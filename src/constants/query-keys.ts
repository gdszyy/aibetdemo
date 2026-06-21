// Generate TanStack Query Keys

// TODO 所有的usequery, persist, localstorage 等等缓存，应该统一维护缓存key，并且要类型正确

/** Module Enumeration */
export enum ModuleKeys {
    /** deposit */
    DEPOSIT = 'deposit',
    /** Withdraw */
    WITHDRAW = 'withdraw',
    /** User/Wallet Password Setting */
    SECURITY_CENTER = 'security_center',
    /** Payment Channel */
    MERCHANT = 'merchant',
    /** Shopping Cart */
    CART = 'cart',
    /** Order */
    ORDER = 'order',
    /** Health Setting */
    HEALTH_SETTING = 'health_setting',
    /** World cup pass */
    WORLD_CUP_PASS = 'world_cup_pass',
    /** VIP */
    VIP = 'vip',
}

/** Order Action Enumeration */
export enum OrderActions {
    /** Fetch order list */
    GET_ORDERS = 'get_orders',
}

/** deposit Action Enumeration */
export enum DepositActions {
    CHANNEL_LIST = 'channel_list',
}

/** Withdraw Action Enumeration */
export enum WithdrawActions {
    /** Fetch bank type list */
    GET_BANK_TYPE_LIST = 'get_bank_type_list',
    /** 流水 */
    GET_TURNOVER = 'get_turnover',
}

/** User/Wallet Password Setting Action Enumeration */
export enum PasswordCheckAction {
    PASSWORD_HAS_SETTING_CHECK = 'password_has_setting_check',
}

/** Payment Channel Action Enumeration */
export enum MerchantActions {
    /** Limit */
    LIMIT = 'limit',
}

/** Shopping Cart Action Enumeration */
export enum CartActions {
    /** Fetch shopping cart */
    GET_CART = 'get_cart',
}

/** Health Setting Action Enumeration */
export enum HealthSettingActions {
    /** Fetch health setting */
    GET_HEALTH_SETTING = 'get_health_setting',
}

/** World Cup Pass 功能枚举 */
export enum WorldCupPassActions {
    /** 首页信息 */
    INFO = 'info',
}

/** VIP 功能枚举 */
export enum VipActions {
    /** 活动状态 */
    ACTIVITY_STATUS = 'activity_status',
}

/** Mapping between Modules and Actions */
type ModuleActionMap = {
    [ModuleKeys.DEPOSIT]: DepositActions;
    [ModuleKeys.WITHDRAW]: WithdrawActions;
    [ModuleKeys.SECURITY_CENTER]: PasswordCheckAction;
    [ModuleKeys.MERCHANT]: MerchantActions;
    [ModuleKeys.CART]: CartActions;
    [ModuleKeys.ORDER]: OrderActions;
    [ModuleKeys.HEALTH_SETTING]: HealthSettingActions;
    [ModuleKeys.WORLD_CUP_PASS]: WorldCupPassActions;
    [ModuleKeys.VIP]: VipActions;
};

/** Get the corresponding action for a module */
type GetActionType<TModule extends ModuleKeys> = TModule extends keyof ModuleActionMap
    ? ModuleActionMap[TModule]
    : never;

/** 用于标记“该 key 确实由 generateQueryKey 生成”的内部品牌。 */
const QUERY_KEY_BRAND = Symbol('QUERY_KEY_BRAND');

/** 品牌化 QueryKey，仅用于项目内部治理与运行时校验 */
export type GeneratedQueryKey<TModule extends ModuleKeys = ModuleKeys, TAction extends string = string> = [
    TModule,
    TAction,
    string | undefined,
] & {
    [QUERY_KEY_BRAND]: true;
};

/** 判断 queryKey 是否由 generateQueryKey 生成 */
export const isGeneratedQueryKey = (value: unknown): value is GeneratedQueryKey => {
    return Array.isArray(value) && QUERY_KEY_BRAND in value;
};

/**
 * Generate Query Key
 *
 * @param module - Module name
 * @param action - Action type (must correspond to module)
 * @param params - Query parameters (supports objects, arrays, primitives, etc.)
 */
export const generateQueryKey = <TModule extends ModuleKeys, TAction extends GetActionType<TModule>, TParams>(
    module: TModule,
    action: TAction,
    params?: TParams,
): GeneratedQueryKey<TModule, TAction> => {
    /** 保持原有三段式结构，只额外挂上内部品牌，不改变业务使用方式。 */
    const key = [module, action, params ? JSON.stringify(params) : undefined] as unknown as GeneratedQueryKey<
        TModule,
        TAction
    >;

    /** 品牌属性不可枚举, 不可删除, 不可修改, 避免影响 JSON 序列化和 React Query 既有 key 行为。 */
    Object.defineProperty(key, QUERY_KEY_BRAND, {
        value: true,
        enumerable: false,
        configurable: false, // 不可删除
        writable: false, // 不可修改
    });

    return key;
};
