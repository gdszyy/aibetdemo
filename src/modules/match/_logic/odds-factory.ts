import type { MarketGroup, MarketLine, OutcomeModel } from '@/api/models/market';
import type { OddsEventEntity } from '@/api/models/match';
import type { OddsEntity } from '../_constants/match.types';

interface MatchContext {
    event_id: string;
    event_id_type: string;
}

interface EventContext {
    sportId: string;
    tournamentId: string;
    /** 地区 ID，用于活动规则 region_id 匹配。 */
    categoryId?: string;
    matchTitle: string;
}

/**
 * Factory: build OddsEntity from match-list / match-detail context
 * Covers: odds-columns.tsx, bet-item.tsx
 */
export function createOddsEntity(
    match: MatchContext,
    context: EventContext,
    market: MarketGroup,
    line: MarketLine,
    outcome: OutcomeModel,
): OddsEntity {
    return {
        eventId: match.event_id,
        eventIdType: match.event_id_type,
        line: outcome.line,
        tournamentId: context.tournamentId,
        categoryId: context.categoryId,
        title: context.matchTitle,
        marketId: market.id,
        marketName: market.name,
        productRaw: line.product_raw,
        productId: line.product,
        specifiers: line.specifiers,
        lineStatus: line.line_status,
        outcome,
        sportId: context.sportId,
        timestamp: outcome.last_update ?? 0,
    };
}

/**
 * Factory: build OddsEntity from OddsEventEntity (outright / detail with OEE)
 * Covers: outright/card.tsx
 */
export function createOddsEntityFromOEE(
    oee: OddsEventEntity,
    market: MarketGroup,
    line: MarketLine,
    outcome: OutcomeModel,
): OddsEntity {
    return {
        eventId: oee.eventId,
        eventIdType: oee.eventIdType,
        tournamentId: oee.tournamentId,
        categoryId: oee.categoryId,
        isOutright: oee.isOutright ?? false,
        title: oee.title,
        marketId: market.id,
        marketName: market.name,
        productRaw: line.product_raw,
        productId: line.product,
        specifiers: line.specifiers,
        lineStatus: line.line_status,
        outcome,
        sportId: oee.sportId,
        line: outcome.line,
        timestamp: outcome.last_update ?? 0,
    };
}
