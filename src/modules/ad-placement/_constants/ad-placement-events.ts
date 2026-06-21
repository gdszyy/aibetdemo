/**
 * 广告位相关 SSE 事件名。
 *
 * use-sse-connection 会把后端 operation_pos_update 转发到全局事件总线，
 * ad-placement 模块只订阅这里定义的事件常量。
 */
export const AdPlacementSSEEvent = {
    Triggered: 'sse:operation_pos_update',
} as const;
