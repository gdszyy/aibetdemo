import type { AdPlacementTriggerTiming } from '@/api/models/ad-placement';

/**
 * 广告位 React Query key。
 *
 * config 是常驻配置缓存；triggered 带触发时机，避免登录成功、充值成功等不同场景互相复用结果。
 */
export const AdPlacementQueryKeys = {
    all: ['ad-placement'] as const,
    config: () => ['ad-placement', 'config'] as const,
    triggered: (triggerTiming: AdPlacementTriggerTiming, isLogin: boolean) =>
        ['ad-placement', 'triggered', triggerTiming, isLogin ? 'user' : 'guest'] as const,
};
