'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ComponentType, SVGProps } from 'react';
import { useEffect, useMemo } from 'react';
import { UserKycStatus } from '@/api/models/user';
import accountBgTexture from '@/assets/images/account-bg-texture.png';
import depositH5 from '@/assets/images/Deposit-H5.png';
import withdrawH5 from '@/assets/images/Withdraw-H5.png';
import { Button } from '@/components/button/button';
import {
    ArrowRight,
    Coin,
    KycSuccess,
    Notice,
    Setting,
    UcAffiliate,
    UcDeposit,
    UcGamblingGames,
    UcHelpFaq,
    UcKyc,
    UcNotification,
    UcSecurityCenter,
    UcSetting,
    UcSupport,
    UcTransaction,
    UcWithdraw,
    User,
} from '@/components/icons';
import { Logo } from '@/components/Logo';
import { Modal } from '@/components/modal/modal';
import { Tooltip } from '@/components/tooltip/tooltip';
import { getVisibleAccountRoutes } from '@/constants/account-routes';
import { UserCenterMenu } from '@/constants/user-center';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useKycRequiredToast } from '@/hooks/use-kyc-state';
import { useLogout } from '@/hooks/use-logout';
import { useIsDesktop } from '@/hooks/use-media-query';
import { useWalletDispatchBalance, useWalletTotalBalance } from '@/hooks/use-wallet';
import { Link, useRouter } from '@/i18n';
import { useHasAnyUnread } from '@/modules/user-center/notification/use-unread-messages';
import { useSessionStore, useUser } from '@/stores/session-store';

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

const ICON_MAP: Record<string, SvgComponent> = {
    'uc-deposit': UcDeposit,
    'uc-profile': User,
    'uc-withdraw': UcWithdraw,
    'uc-kyc': UcKyc,
    'uc-security-center': UcSecurityCenter,
    'uc-affiliate': UcAffiliate,
    'uc-transaction': UcTransaction,
    'uc-gambling-games': UcGamblingGames,
    'uc-setting': UcSetting,
    'uc-support': UcSupport,
    'uc-notification': UcNotification,
    'uc-help-faq': UcHelpFaq,
};

/** Menu items to exclude from list (shown elsewhere in the layout) */
const EXCLUDED_MENUS = new Set([
    UserCenterMenu.DEPOSIT,
    UserCenterMenu.WITHDRAW,
    UserCenterMenu.NOTIFICATION,
    UserCenterMenu.SETTING,
    UserCenterMenu.LOGOUT,
]);

export function AccountMenuClient() {
    const isDesktop = useIsDesktop();
    const router = useRouter();
    const t = useTranslations('user');
    const tAuth = useTranslations('auth');
    const user = useUser();
    const { formatCurrency } = useIntlFormatter();
    const hasAnyUnread = useHasAnyUnread();
    const { logout, logoutConfirmProps } = useLogout();

    const update = useSessionStore((s) => s.update);
    const totalBalance = useWalletTotalBalance();
    const dispatchBalance = useWalletDispatchBalance();

    // Refresh user + balance on mount
    useEffect(() => {
        update();
        dispatchBalance();
    }, [update, dispatchBalance]);

    // Desktop: redirect to deposit (account menu is mobile-only)
    useEffect(() => {
        if (isDesktop) {
            router.replace('/account/deposit');
        }
    }, [isDesktop, router]);

    // Filter routes: exclude deposit/withdraw/notification/settings (shown in other sections)
    // h5 exclude logout routes, use current fixed logout button
    const visibleRoutes = useMemo(
        () => getVisibleAccountRoutes(user?.kyc_status).filter((route) => !EXCLUDED_MENUS.has(route.menu)),
        [user?.kyc_status],
    );

    // Group routes by group number
    const groups = useMemo(() => {
        const result: (typeof visibleRoutes)[] = [];
        let currentGroup = -1;
        for (const route of visibleRoutes) {
            if (route.group !== currentGroup) {
                result.push([]);
                currentGroup = route.group;
            }
            result[result.length - 1].push(route);
        }
        return result;
    }, [visibleRoutes]);

    /** 在跳转前检查kyc */
    const { checkKycRequired } = useKycRequiredToast();
    const routeRedirectBeforeCheckKycRequired = (route: string) => {
        if (!checkKycRequired({ ignoreSwitch: route.includes('account/withdraw') })) {
            return;
        }
        router.push(route);
    };

    if (isDesktop) return null;

    return (
        <div className="bg-filltext-ft-a flex flex-col">
            {/* Background: isolate container with clip-path, 3 layers inside */}
            <div className="absolute inset-x-0 top-0 h-[360px] isolate overflow-hidden pointer-events-none [clip-path:polygon(0_0,100%_0,100%_83%,50%_100%,0_83%)]">
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: [
                            'radial-gradient(ellipse at 50% 50%, white 0%, transparent 70%)',
                            'radial-gradient(ellipse at 50% 50%, transparent 0%, #FFBCDD 100%)',
                            'linear-gradient(to right, #FF3BC4, transparent)',
                            'linear-gradient(to left, #FF4656, transparent)',
                            'white',
                        ].join(', '),
                    }}
                />
                <div className="absolute inset-0 bg-brand-red" />
                <Image
                    src={accountBgTexture}
                    alt=""
                    className="absolute top-0 -left-[35%] w-[204%] max-w-none h-[81%] mix-blend-hard-light opacity-60 saturate-0"
                    width={765}
                    height={291}
                    priority
                />
            </div>

            {/* Top navigation */}
            <div className="sticky top-0 z-40 flex items-center pt-[max(env(safe-area-inset-top),12px)] px-3 py-1">
                <Logo className="w-31 text-neutral-white-h" variant="long" />
                <div className="ml-auto flex items-center gap-3">
                    <Link
                        href="/account/notifications"
                        className="flex items-center justify-center size-8 bg-neutral-white-e rounded-full relative"
                    >
                        <Notice className="size-5 text-neutral-white-h" />
                        {hasAnyUnread && (
                            <span className="absolute top-1 right-1 size-2 bg-brand-red rounded-full border-2 border-white" />
                        )}
                    </Link>
                    <Link
                        href="/account/settings"
                        className="flex items-center justify-center size-8 bg-neutral-white-e rounded-full"
                    >
                        <Setting className="size-5 text-neutral-white-h" />
                    </Link>
                </div>
            </div>

            {/* Profile */}
            <div className="relative flex flex-col items-center mt-10 gap-[10px]">
                <Image
                    className="size-[60px] rounded-full overflow-hidden"
                    src={user?.avatar || 'https://placehold.co/100x100?text=User'}
                    alt=""
                    width={60}
                    height={60}
                    sizes="60px"
                    loading="eager"
                />
                <div className="flex items-center gap-1">
                    <span className="text-title-md text-neutral-white-h">{user?.nickname || '-'}</span>
                    {user?.kyc_status === UserKycStatus.Success && (
                        <Tooltip
                            content={tAuth('logined.kycVerified')}
                            side="top"
                            contentStyle={{
                                background: 'var(--gradient-d)',
                                borderRadius: '99px',
                            }}
                            className="bg-transparent!"
                            arrowClassName="fill-[#0080FF]"
                            arrowWidth={8}
                            arrowHeight={4}
                        >
                            <div className="flex items-center cursor-pointer">
                                <KycSuccess />
                            </div>
                        </Tooltip>
                    )}
                </div>
            </div>

            {/* Balance card */}
            <div className="relative mx-2 mt-5 rounded-sm backdrop-blur-[25px] bg-surface-1 border border-surface-3 p-4 pb-3">
                {/* Balance info */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-body-sm text-filltext-ft-g">{t('menus.accountBalance')}</span>
                    <div className="flex items-center gap-[5px]">
                        <Coin className="size-6 shrink-0" />
                        <span className="text-headline-sm text-filltext-ft-h">{formatCurrency(totalBalance)}</span>
                    </div>
                </div>

                {/* Deposit / Withdraw cards */}
                <div className="flex gap-2 mt-2">
                    <span
                        className="flex-1 flex flex-col items-center justify-center gap-0.5 h-[76px] bg-surface-1 rounded-sm"
                        onClick={() => {
                            routeRedirectBeforeCheckKycRequired('/account/deposit');
                        }}
                    >
                        <Image src={depositH5} alt="" width={40} height={40} className="size-10 object-contain" />
                        <span className="text-body-md text-filltext-ft-g">{t('menus.deposit')}</span>
                    </span>
                    <span
                        className="flex-1 flex flex-col items-center justify-center gap-0.5 h-[76px] bg-surface-1 rounded-sm"
                        onClick={() => {
                            routeRedirectBeforeCheckKycRequired('/account/withdraw');
                        }}
                    >
                        <Image src={withdrawH5} alt="" width={40} height={40} className="size-10 object-contain" />
                        <span className="text-body-md text-filltext-ft-g">{t('menus.withdraw')}</span>
                    </span>
                </div>
            </div>

            {/* Menu groups */}
            <div className="relative flex flex-col gap-2 mx-2 mt-2">
                {groups.map((group) => (
                    <div key={group[0].path} className="rounded-sm overflow-hidden">
                        {group.map((route) => {
                            const Icon = ICON_MAP[route.icon];
                            return (
                                <Link
                                    key={route.path}
                                    href={route.path}
                                    className="flex items-center justify-between h-12 px-3 bg-surface-1"
                                >
                                    <div className="flex items-center gap-2">
                                        {Icon && (
                                            <div className="flex items-center justify-center size-6">
                                                <Icon className="size-5 text-filltext-ft-g" />
                                            </div>
                                        )}
                                        <span className="text-body-md text-filltext-ft-h">{t(route.titleKey)}</span>
                                    </div>
                                    <ArrowRight className="size-4 text-filltext-ft-e shrink-0" />
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Logout */}
            <div className="relative mx-2 mt-2 pb-4">
                <button
                    type="button"
                    onClick={() => logout()}
                    className="flex items-center justify-center gap-2 w-full h-11 px-3 bg-surface-1 rounded-sm cursor-pointer"
                >
                    <span className="text-body-md text-filltext-ft-h">{t('menus.logout')}</span>
                </button>
            </div>

            {/* Logout confirm modal */}
            <Modal
                visible={logoutConfirmProps.visible}
                onClose={logoutConfirmProps.onCancel}
                closeButton={false}
                withBg={false}
            >
                <div className="w-[calc(100vw-2rem)] max-w-[435px] rounded-md bg-surface-raised p-6 flex flex-col gap-6">
                    <p className="text-title-md">{logoutConfirmProps.title}</p>
                    <div className="flex justify-end gap-[10px]">
                        <Button variant="secondary" onClick={logoutConfirmProps.onCancel} className="flex-1 h-10">
                            {logoutConfirmProps.cancelText}
                        </Button>
                        <Button
                            variant="primary"
                            onClick={logoutConfirmProps.onConfirm}
                            loading={logoutConfirmProps.loading}
                            className="flex-1 h-10"
                        >
                            {logoutConfirmProps.confirmText}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
