/**
 * LiveChat Widget JS API 全局类型声明。
 * 官方文档：https://platform.text.com/docs/extending-chat-widget/javascript-api
 */

/** LiveChat 可识别的全局命令名（仅枚举本项目使用到的子集）。 */
export type LiveChatCommand =
    | 'destroy'
    | 'maximize'
    | 'hide'
    | 'set_customer_name'
    | 'set_customer_email'
    | 'set_session_variables';

/** LiveChat 可监听的事件名（仅枚举本项目使用到的子集）。 */
export type LiveChatEvent = 'ready' | 'visibility_changed';

/** LiveChat Widget 全局对象的最小可用接口。 */
export interface LiveChatWidgetGlobal {
    /** asyncInit 模式下手动拉取 tracking.js。 */
    init?: () => void;
    call: (command: LiveChatCommand, payload?: unknown) => void;
    on: (event: LiveChatEvent, handler: (payload: unknown) => void) => void;
    once: (event: LiveChatEvent, handler: (payload: unknown) => void) => void;
    off: (event: LiveChatEvent, handler: (payload: unknown) => void) => void;
}

/** LiveChat snippet 初始化阶段写入的全局配置。 */
export interface LiveChatConfig {
    license: number;
    /** LiveChat 后台客服分组 ID，必须在 tracking.js 初始化前写入。 */
    group?: number;
    integration_name?: string;
    product_name?: string;
    asyncInit?: boolean;
}

/** 发送给 LiveChat 的用户上下文 payload。 */
export interface LiveChatContext {
    name?: string;
    email?: string;
    vars: Record<string, string>;
}

declare global {
    interface Window {
        __lc?: LiveChatConfig;
        LiveChatWidget?: LiveChatWidgetGlobal;
    }
}
