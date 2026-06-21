import {
    GetAdPlacementConfigInterface,
    GetGuestTriggeredAdPlacementsInterface,
    GetTriggeredAdPlacementsInterface,
} from '@/api/handlers/ad-placement';
import {
    type AdPlacementActivityResponse,
    type AdPlacementItem,
    AdPlacementJumpType,
    type AdPlacementTriggeredResponse,
    type AdPlacementTriggerTiming,
    type RawAdPlacementItem,
    type RawFloatingCardAdPlacement,
    type RawGlobalModalAdPlacement,
} from '@/api/models/ad-placement';

/**
 * 归一化单个广告位。
 *
 * 后端的 DisplayOnly 与前端 None 在交互上等价：都不允许跳转。
 * 在模块 service 层统一转换后，组件层只需要判断 None，避免各个展示组件重复理解后端配置语义。
 */
const normalizeAdPlacementActivityItem = <T extends RawAdPlacementItem>(raw: T): T => {
    if (raw.data.jump_type !== AdPlacementJumpType.DisplayOnly) return raw;

    // DisplayOnly 是后端配置语义，前端统一按 None 处理以复用无跳转分支。
    return {
        ...raw,
        data: {
            ...raw.data,
            jump_type: AdPlacementJumpType.None,
        },
    } as T;
};

/**
 * 归一化常驻广告配置。
 *
 * config 接口会返回所有类型的广告位，包含 Banner、公告条、侧边栏入口等。
 * status=1 才是当前生效的运营配置，失效配置在这里过滤，避免组件层出现空图、旧活动或误跳转。
 */
const normalizeAdPlacementConfigResponse = (response: AdPlacementActivityResponse): AdPlacementItem[] => {
    // status=1 表示有效广告位，其他状态不进入任何展示容器。
    return response.filter((item) => item.status === 1).map((item) => normalizeAdPlacementActivityItem(item));
};

/**
 * 归一化触发型弹窗。
 *
 * trigger 接口的 popup 可能为空，也可能返回已下线活动；组件只接收可展示的弹窗或 null。
 */
const normalizeTriggeredPopup = (popup: RawGlobalModalAdPlacement | null): RawGlobalModalAdPlacement | null => {
    if (!popup || popup.status !== 1) return null;
    return normalizeAdPlacementActivityItem(popup);
};

/**
 * 归一化触发型悬浮卡片列表。
 *
 * 多张卡片会交给右侧悬浮组件处理轮播和展开，service 层只负责过滤有效状态和统一跳转语义。
 */
const normalizeTriggeredFloatCards = (floatCards: RawFloatingCardAdPlacement[]): RawFloatingCardAdPlacement[] => {
    return floatCards.filter((item) => item.status === 1).map((item) => normalizeAdPlacementActivityItem(item));
};

/**
 * 获取常驻广告配置。
 *
 * 常驻配置用于页面级广告位：体育 Banner、Casino Banner、顶部公告、侧边栏广告入口等。
 */
export const getAdPlacementConfig = async (): Promise<AdPlacementItem[]> => {
    const response = await GetAdPlacementConfigInterface();

    return normalizeAdPlacementConfigResponse(response);
};

/**
 * 按业务时机获取触发型广告。
 *
 * 触发型广告由首访或 SSE 事件驱动，返回结果会直接写入广告位 store，
 * 再由全局广告层渲染弹窗和悬浮卡片。
 */
export const getTriggeredAdPlacementsByTriggerTiming = async (
    triggerTiming: AdPlacementTriggerTiming,
    isLogin: boolean,
): Promise<AdPlacementTriggeredResponse> => {
    const response = await (isLogin ? GetTriggeredAdPlacementsInterface : GetGuestTriggeredAdPlacementsInterface)({
        opportunity: triggerTiming,
    });

    return {
        popup: normalizeTriggeredPopup(response.popup),
        float_cards: normalizeTriggeredFloatCards(response.float_cards),
    };
};
