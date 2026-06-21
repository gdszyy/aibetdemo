/**
 * 广告位展示位置。
 *
 * 后端通过 activity_type 下发广告位类型，前端根据类型把同一套活动数据分发到不同展示容器：
 * Banner 进入首页轮播，GlobalModal 进入全局弹窗，FloatingCard 进入右侧悬浮广告，
 * SidebarMenu 进入侧边栏菜单，TopAnnouncement 进入顶部公告条。
 */
export enum AdPlacementType {
    /** 体育首页 Banner。 */
    SportsBanner = 0,
    /** Casino 首页 Banner。 */
    CasinoBanner = 1,
    /** 全局弹窗广告，通常由首访、登录、充值、投注等时机触发。 */
    GlobalModal = 2,
    /** 桌面端右侧悬浮卡片广告。 */
    FloatingCard = 3,
    /** 侧边栏菜单广告入口。 */
    SidebarMenu = 4,
    /** 页面顶部公告条。 */
    TopAnnouncement = 5,
}

/**
 * 广告跳转类型。
 *
 * DisplayOnly 是后端配置语义，表示只曝光不响应跳转；进入前端后会被归一化为 None，
 * 让组件只需要判断 None 即可禁用按钮或点击行为。
 */
export enum AdPlacementJumpType {
    /** 无跳转行为，组件应只展示内容。 */
    None = 0,
    /** 仅展示，不跳转；前端请求层会转为 None。 */
    DisplayOnly = 1,
    /** 平台活动 ID，前端会拼成促销活动路由。 */
    Activity = 2,
    /** 外部链接，使用新窗口打开。 */
    ExternalUrl = 3,
    /** 站内路由，使用带 locale 的 router 跳转。 */
    InternalRoute = 4,
}

/**
 * 触发型广告的业务时机。
 *
 * 非常驻广告不从通用配置直接展示，而是在指定时机调用 trigger 接口获取，
 * 用于支持“首访弹窗”“登录成功浮窗”“充值成功弹窗”等一次性运营触达。
 */
export enum AdPlacementTriggerTiming {
    /** 用户进入首页后首次拉取。 */
    FirstHomeVisit = 0,
    /** 登录成功后由 SSE 或业务事件触发。 */
    LoginSuccess = 1,
    /** 注册成功后触发。 */
    RegisterSuccess = 2,
    /** 充值成功后触发。 */
    DepositSuccess = 3,
    /** 投注成功后触发。 */
    BetSuccess = 4,
}

export interface RawAdPlacementBaseData {
    jump_type: AdPlacementJumpType;
    jump_target: string;
}

export interface RawBannerAdPlacementData extends RawAdPlacementBaseData {
    title?: string;
    desktop_image?: string;
    mobile_image?: string;
}

export interface RawGlobalModalAdPlacementData extends RawAdPlacementBaseData {
    title?: string;
    content?: string;
    text?: string;
    primary_button_text?: string;
    button_text?: string;
}

export interface RawFloatingCardAdPlacementData extends RawAdPlacementBaseData {
    title?: string;
    content?: string;
    text?: string;
    button_text?: string;
    background_image?: string;
}

export interface RawSidebarMenuAdPlacementData extends RawAdPlacementBaseData {
    menu_name?: string;
    menu_icon?: string;
}

export interface RawTopAnnouncementAdPlacementData extends RawAdPlacementBaseData {
    text?: string;
    notice_text?: string;
}

export interface RawAdPlacement<TData extends RawAdPlacementBaseData, TType extends AdPlacementType> {
    id: number;
    activity_name: string;
    activity_type: TType;
    data: TData;
    sort: number;
    status: number;
}

export type RawSportsBannerAdPlacement = RawAdPlacement<RawBannerAdPlacementData, AdPlacementType.SportsBanner>;
export type RawCasinoBannerAdPlacement = RawAdPlacement<RawBannerAdPlacementData, AdPlacementType.CasinoBanner>;
export type RawGlobalModalAdPlacement = RawAdPlacement<RawGlobalModalAdPlacementData, AdPlacementType.GlobalModal>;
export type RawFloatingCardAdPlacement = RawAdPlacement<RawFloatingCardAdPlacementData, AdPlacementType.FloatingCard>;
export type RawSidebarMenuAdPlacement = RawAdPlacement<RawSidebarMenuAdPlacementData, AdPlacementType.SidebarMenu>;
export type RawTopAnnouncementAdPlacement = RawAdPlacement<
    RawTopAnnouncementAdPlacementData,
    AdPlacementType.TopAnnouncement
>;

export type RawAdPlacementItem =
    | RawSportsBannerAdPlacement
    | RawCasinoBannerAdPlacement
    | RawGlobalModalAdPlacement
    | RawFloatingCardAdPlacement
    | RawSidebarMenuAdPlacement
    | RawTopAnnouncementAdPlacement;

export type AdPlacementActivityResponse = RawAdPlacementItem[];
export interface RawTriggeredAdPlacementsResponse {
    popup: RawGlobalModalAdPlacement | null;
    float_cards: RawFloatingCardAdPlacement[];
}

export type SportsBannerAdPlacement = RawSportsBannerAdPlacement;
export type CasinoBannerAdPlacement = RawCasinoBannerAdPlacement;
export type BannerAdPlacement = SportsBannerAdPlacement | CasinoBannerAdPlacement;
export type GlobalModalAdPlacement = RawGlobalModalAdPlacement;
export type FloatingCardAdPlacement = RawFloatingCardAdPlacement;
export type SidebarMenuAdPlacement = RawSidebarMenuAdPlacement;
export type TopAnnouncementAdPlacement = RawTopAnnouncementAdPlacement;
export type AdPlacementItem = RawAdPlacementItem;
export type AdPlacementTriggeredResponse = RawTriggeredAdPlacementsResponse;

export interface GetTriggeredAdPlacementsParams {
    opportunity: AdPlacementTriggerTiming;
}

export interface AdPlacementSSEPayload {
    event: 'operation_pos_update';
    user_id: number;
    data: {
        type: AdPlacementTriggerTiming;
    };
    timestamp: number;
}
