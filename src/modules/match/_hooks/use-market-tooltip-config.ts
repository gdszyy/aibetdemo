import { useQuery } from '@tanstack/react-query';
import type { Locale } from '@/i18n';

/**
 * 单个市场对应的 tooltip 多语言文案。
 */
export type MarketTooltipConfigItem = Record<Locale, string>;

/**
 * 市场 tooltip 配置表，key 为 market id。
 */
export type MarketTooltipConfig = Record<string, MarketTooltipConfigItem>;

const MARKET_TOOLTIP_CONFIG_URL = '/static/match-detail-market-tooltip-config.json';
const MARKET_TOOLTIP_CONFIG_QUERY_KEY = ['match-detail-market-tooltip-config'] as const;

/**
 * 判断远端 JSON 是否符合市场 tooltip 配置的最小结构。
 */
function isMarketTooltipConfig(value: unknown): value is MarketTooltipConfig {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }

    return Object.values(value).every(
        (item) =>
            item !== null &&
            typeof item === 'object' &&
            !Array.isArray(item) &&
            typeof (item as MarketTooltipConfigItem).en === 'string' &&
            typeof (item as MarketTooltipConfigItem).pt === 'string' &&
            typeof (item as MarketTooltipConfigItem).es === 'string',
    );
}

/**
 * 请求比赛详情市场 tooltip 配置。
 */
async function fetchMarketTooltipConfig(): Promise<MarketTooltipConfig> {
    const response = await fetch(MARKET_TOOLTIP_CONFIG_URL);

    if (!response.ok) {
        throw new Error(`Failed to load market tooltip config: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isMarketTooltipConfig(data)) {
        throw new Error('Invalid market tooltip config format');
    }

    return data;
}

/**
 * 读取并缓存市场 tooltip 配置。
 */
export function useMarketTooltipConfig() {
    return useQuery({
        queryKey: MARKET_TOOLTIP_CONFIG_QUERY_KEY,
        queryFn: fetchMarketTooltipConfig,
        staleTime: Number.POSITIVE_INFINITY,
        gcTime: Number.POSITIVE_INFINITY,
    });
}
