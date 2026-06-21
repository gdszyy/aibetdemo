import type { WorldCupChampionship } from '@/api/models/promotion-world-cup-league';
import { INVARIANT_LOCALE } from '@/constants';
import type { OddsEntity } from '@/modules/match';

/** 将冠军盘赔率固定展示为两位小数。 */
export const formatChampionshipOdds = (odds: number): string => {
    return new Intl.NumberFormat(INVARIANT_LOCALE, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
        roundingMode: 'trunc',
    }).format(odds);
};

/** 将世界杯冠军盘转换为可加入购物车的赔率实体列表。 */
export const getWorldCupChampionshipOddsEntities = (
    championship: WorldCupChampionship,
    tournamentId: string,
): OddsEntity[] => {
    return championship.markets.flatMap((market) =>
        market.lines.flatMap((line) =>
            line.outcomes.map((outcome) => ({
                eventId: championship.event_id,
                eventIdType: championship.event_id_type,
                tournamentId,
                isOutright: true,
                title: '',
                marketId: market.id,
                marketName: market.name,
                productRaw: line.product_raw,
                productId: line.product,
                specifiers: line.specifiers,
                lineStatus: line.line_status,
                line: outcome.line,
                outcome,
                timestamp: outcome.last_update ?? 0,
            })),
        ),
    );
};
