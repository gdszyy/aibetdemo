import { getMarketGroupId, isRowBasedMarketCardType, type MarketGroup, type MarketLine } from '@/api/models/market';
import type { OddsChangeMarketPayload, OddsChangePayload } from '@/api/models/ws';
import {
    createOddsChangeMarketLine,
    type MergeOddsChangeOutcomesOptions,
    mergeOddsChangeOutcomes,
} from '@/utils/odds-change-merge';
import { extractSpecifierNum } from '@/utils/specifier';

/** WS merge options; **`allowNewLines` / outcome flags default true** unless set. */
export type OddsUpdateProcessorOptions = {
    mergeOutcomes?: MergeOddsChangeOutcomesOptions;
    /** When `false`, never `push` a new line — patch matched lines only. */
    allowNewLines?: boolean;
};

export interface FormattingContext {
    home?: { name: string; competitor_id: string };
    away?: { name: string; competitor_id: string };
}

interface UpdatedMarketsResult {
    markets: MarketGroup[];
    completelyNewMarkets: MarketGroup[];
    newLinesByMarket: Map<string, MarketLine[]>;
    updatedLinesByLine: Map<string, MarketLine>;
    requiresRefetch: boolean;
}

export class OddsUpdateProcessor {
    constructor(
        private payload: OddsChangePayload,
        private readonly options?: OddsUpdateProcessorOptions,
    ) {}

    /** Default true — only `explicit false` skips new outcomes. */
    private get mergeOddsOutcomeOptions(): MergeOddsChangeOutcomesOptions | undefined {
        return this.options?.mergeOutcomes;
    }

    /** Default true — only `explicit false` blocks new lines. */
    private get allowNewLines(): boolean {
        return this.options?.allowNewLines !== false;
    }

    private isRowBasedMarketLineMatch(
        market: MarketGroup,
        existingLine: MarketLine,
        incomingLine: OddsChangeMarketPayload['lines'][number],
    ): boolean {
        return (
            isRowBasedMarketCardType(market.card_type) &&
            existingLine.row !== undefined &&
            existingLine.row === incomingLine.specifiers
        );
    }

    private isMarketLineMatch(
        market: MarketGroup,
        existingLine: MarketLine,
        incomingLine: OddsChangeMarketPayload['lines'][number],
    ): boolean {
        return (
            existingLine.product === incomingLine.product &&
            (existingLine.specifiers === incomingLine.specifiers ||
                this.isRowBasedMarketLineMatch(market, existingLine, incomingLine))
        );
    }

    private createMarketLine(market: MarketGroup, incomingLine: OddsChangeMarketPayload['lines'][number]): MarketLine {
        const line = createOddsChangeMarketLine(incomingLine);
        const isRowBasedMarket = isRowBasedMarketCardType(market.card_type);

        if (!isRowBasedMarket) {
            return line;
        }

        const row = line.row ?? line.specifiers;

        return {
            ...line,
            row,
            outcomes: line.outcomes.map((outcome) => ({
                ...outcome,
                name_alias: outcome.name_alias ?? outcome.name,
            })),
        };
    }

    private addGroupKey(groupKeysById: Map<number, string[]>, marketId: number, groupKey: string) {
        const keys = groupKeysById.get(marketId);

        if (keys) {
            keys.push(groupKey);
            return;
        }

        groupKeysById.set(marketId, [groupKey]);
    }

    private resolveTargetGroup(
        updatedGroups: Map<string, MarketGroup>,
        groupKeysById: Map<number, string[]>,
        incomingMarket: OddsChangeMarketPayload,
    ) {
        if (incomingMarket.name) {
            const explicitKey = getMarketGroupId({ id: incomingMarket.id, name: incomingMarket.name });
            const explicitGroup = updatedGroups.get(explicitKey);

            if (explicitGroup) {
                return explicitGroup;
            }
        }

        const candidateKeys = groupKeysById.get(incomingMarket.id) ?? [];

        if (candidateKeys.length === 1) {
            return updatedGroups.get(candidateKeys[0]);
        }

        if (candidateKeys.length > 1) {
            for (const candidateKey of candidateKeys) {
                const candidateGroup = updatedGroups.get(candidateKey);

                if (!candidateGroup) {
                    continue;
                }

                const hasMatchingLine = incomingMarket.lines.some((incomingLine) =>
                    candidateGroup.lines.some((existingLine) =>
                        this.isMarketLineMatch(candidateGroup, existingLine, incomingLine),
                    ),
                );

                if (hasMatchingLine) {
                    return candidateGroup;
                }
            }
        }

        return undefined;
    }

    private sortLines(lines: MarketLine[]) {
        return lines.sort((a, b) => extractSpecifierNum(a.specifiers) - extractSpecifierNum(b.specifiers));
    }

    private buildUpdatedMarkets(markets: MarketGroup[]): UpdatedMarketsResult {
        const payloadMarkets = this.payload.markets || [];
        if (payloadMarkets.length === 0) {
            return {
                markets,
                completelyNewMarkets: [],
                newLinesByMarket: new Map(),
                updatedLinesByLine: new Map(),
                requiresRefetch: false,
            };
        }

        const existingGroupMap = new Map<string, MarketGroup>();
        const groupKeysById = new Map<number, string[]>();

        for (const market of markets) {
            const groupKey = getMarketGroupId(market);
            existingGroupMap.set(groupKey, market);
            this.addGroupKey(groupKeysById, market.id, groupKey);
        }

        const updatedGroups = new Map<string, MarketGroup>();
        let requiresRefetch = false;

        // Deep clone existing groups to start merging
        for (const [key, market] of existingGroupMap) {
            updatedGroups.set(key, {
                ...market,
                lines: [...market.lines],
            });
        }

        for (const incomingMarket of payloadMarkets) {
            let targetGroup = this.resolveTargetGroup(updatedGroups, groupKeysById, incomingMarket);

            if (!targetGroup) {
                if (!this.allowNewLines) {
                    continue;
                }
                if (!incomingMarket.name) {
                    requiresRefetch = true;
                    continue;
                }

                targetGroup = {
                    id: incomingMarket.id,
                    name: incomingMarket.name,
                    lines: [],
                };

                const groupKey = getMarketGroupId(targetGroup);
                updatedGroups.set(groupKey, targetGroup);
                this.addGroupKey(groupKeysById, incomingMarket.id, groupKey);
            }

            for (const incomingLine of incomingMarket.lines || []) {
                const existingLineIndex = targetGroup.lines.findIndex((line) =>
                    this.isMarketLineMatch(targetGroup, line, incomingLine),
                );

                if (existingLineIndex >= 0) {
                    const existingLine = targetGroup.lines[existingLineIndex];
                    const outcomes = mergeOddsChangeOutcomes(
                        existingLine.outcomes,
                        incomingLine.outcomes,
                        this.mergeOddsOutcomeOptions,
                    );

                    targetGroup.lines[existingLineIndex] = {
                        ...existingLine,
                        id: incomingLine.id ?? existingLine.id,
                        product: incomingLine.product ?? existingLine.product,
                        product_raw: incomingLine.product_raw ?? existingLine.product_raw,
                        row: incomingLine.row ?? existingLine.row,
                        is_main_line: incomingLine.is_main_line ?? existingLine.is_main_line,
                        line_status: existingLine.line_status,
                        outcomes,
                    };
                } else if (this.allowNewLines) {
                    targetGroup.lines.push(this.createMarketLine(targetGroup, incomingLine));
                }
            }

            this.sortLines(targetGroup.lines);
        }

        return {
            markets: Array.from(updatedGroups.values()),
            completelyNewMarkets: [], // Stub for tests
            newLinesByMarket: new Map(), // Stub for tests
            updatedLinesByLine: new Map(), // Stub for tests
            requiresRefetch,
        };
    }

    public updateMarkets(markets: MarketGroup[]) {
        return this.buildUpdatedMarkets(markets);
    }

    public generateMarkets(markets: MarketGroup[]) {
        return this.buildUpdatedMarkets(markets);
    }
}
