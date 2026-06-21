/** 应用运行环境 */
type APP_ENV = 'development' | 'test' | 'production';

const appEnv: APP_ENV = (process.env.NEXT_PUBLIC_APP_ENV as APP_ENV) || 'production';

const ABSOLUTE_SERVICE_URL_PATTERN = /^(?:https?|wss?):\/\//i;
const WS_HOST_PREFIX_PATTERN = /^xp-ws(?:-|$)/i;
const SERVICE_ROOT_DOMAIN = process.env.NEXT_PUBLIC_SERVICE_ROOT_DOMAIN || 'helix.city';

export const config = {
    /** 应用运行环境： */
    appEnv,
    /** 是否是开发环境 */
    isDev: appEnv === 'development',
    /** 是否是测试环境 */
    isTest: appEnv === 'test',
    /** 是否是生产环境 */
    isProd: appEnv === 'production',
    /** 关闭检查kyc */
    disableKycVerify: process.env.NEXT_PUBLIC_DISABLE_KYC_VERIFY === 'true',
    /** 20260521上线特性展示 */
    // TODO 相关功能上线，应当移除掉开关
    showFeature20260521: process.env.NEXT_PUBLIC_SHOW_FEATURE_20260521 === 'true',
    /** 是否显示VIP侧边栏菜单入口 */
    // TODO 如果确定开发了，就删除此开关吧
    showVipMenu: process.env.NEXT_PUBLIC_SHOW_VIP_MENU === 'true',
    /** 详情页投注项测试定位属性开关，仅 test1 环境开启。 */
    enableMatchOutcomeTestData: process.env.NEXT_PUBLIC_ENABLE_MATCH_OUTCOME_TEST_DATA === 'true',
    /** LiveChat 总开关。 */
    liveChatEnabled: process.env.NEXT_PUBLIC_LIVECHAT_ENABLED === 'true',
    /** LiveChat license number，公开配置非密钥。 */
    liveChatLicense: process.env.NEXT_PUBLIC_LIVECHAT_LICENSE ?? '',
};

/** 从访问主机名提取根域，例如 test1.helix.city → helix.city */
const extractRootDomain = (hostname: string): string => {
    const parts = hostname.split('.');
    if (parts.length <= 2) {
        return hostname;
    }

    if (parts[0] === 'www') {
        return parts.slice(1).join('.');
    }

    return parts.slice(-2).join('.');
};

/** SSR：从请求头取当前访问主机名 */
export const getHostFromHeaders = (headersList: Headers): string | undefined => {
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
    return host?.split(':')[0];
};

/**
 * 将 env 子域前缀解析为完整服务 URL。
 * dev 固定拼到 SERVICE_ROOT_DOMAIN；其他环境按当前访问主域拼接。
 */
export const resolveServiceUrl = (raw: string | undefined, host?: string): string => {
    if (!raw?.trim()) {
        return '';
    }

    const value = raw.trim();
    if (ABSOLUTE_SERVICE_URL_PATTERN.test(value)) {
        return value.replace(/\/$/, '');
    }

    const slashIndex = value.indexOf('/');
    const hostPrefix = slashIndex === -1 ? value : value.slice(0, slashIndex);
    const pathSuffix = slashIndex === -1 ? '' : value.slice(slashIndex);

    const rootDomain = config.isDev
        ? SERVICE_ROOT_DOMAIN
        : extractRootDomain(host ?? (typeof window !== 'undefined' ? window.location.hostname : ''));

    if (!rootDomain) {
        return '';
    }

    const protocol = WS_HOST_PREFIX_PATTERN.test(hostPrefix) ? 'wss' : 'https';
    return `${protocol}://${hostPrefix}.${rootDomain}${pathSuffix}`;
};
