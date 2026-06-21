'use client';

import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { Button } from '@/components/button/button';
import { DepositReward } from '@/components/DepositReward';
import { NoticeOutlined } from '@/components/icons2/NoticeOutlined';
import { PromotionOutlined } from '@/components/icons2/PromotionOutlined';
import { UserCenterMenu } from '@/constants/user-center';
import { useAccountNavigator } from '@/hooks/use-account-navigator';
import { useIsDesktop } from '@/hooks/use-media-query';
import { useOpenDepositModal } from '@/hooks/use-open-deposit-modal';
import { useRechargeActiveConfig } from '@/hooks/use-recharge-code';
import { useRouter } from '@/i18n';
import { DepositModal } from '@/modules/deposit';
import { WorldCupMenuItem } from '@/modules/marketing/promotion/world-cup-league/leagues-banner/components/WorldCupMenu';
import { useHasAnyUnread } from '@/modules/user-center/notification/use-unread-messages';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { AccountPopover } from './account-popover';
import { Wallet } from './components/Wallet';

/** 包裹的icon */
const WrapperedIcon: FunctionComponent<{
    className?: string;
    icon: FunctionComponent<{ className?: string }>;
    onClick?: () => void;
}> = ({ className, icon: Icon, onClick }) => {
    return (
        <div
            className={cn(
                'group transition-all',
                'shrink-0 max-md:w-8 max-md:h-10 md:size-10 inline-flex items-center justify-center rounded-full',
                'max-md:bg-transparent md:bg-filltext-ft-b md:hover:bg-filltext-ft-c',
                'cursor-pointer',
                className,
            )}
            onClick={onClick}
        >
            <Icon className="size-5 text-filltext-ft-h transition-colors" />
        </div>
    );
};

/** H5 头部图标按钮，按 Figma 统一 32x40 点击区。 */
const MobileHeaderIcon: FunctionComponent<{
    className?: string;
    icon: FunctionComponent<{ className?: string }>;
    iconClassName?: string;
    onClick?: () => void;
}> = ({ className, icon: Icon, iconClassName = 'size-5', onClick }) => {
    return (
        <button
            type="button"
            className={cn(
                'flex h-10 w-8 shrink-0 items-center justify-center rounded-full text-filltext-ft-h transition-colors active:bg-filltext-ft-c',
                className,
            )}
            onClick={onClick}
        >
            <Icon className={iconClassName} />
        </button>
    );
};

/** 登录后的操作 */
export const Logined: FunctionComponent = () => {
    const tUser = useTranslations('user');
    const router = useRouter();
    const accountNavigator = useAccountNavigator();
    const hasAnyUnread = useHasAnyUnread();
    const isDesktop = useIsDesktop();
    const { openDepositModal } = useOpenDepositModal();
    const depositModalOpen = useUIStore((state) => state.depositModalOpen);
    const closeDepositModal = useUIStore((state) => state.closeDepositModal);

    const rechargeReward = Number(useRechargeActiveConfig()?.max_withdraw) || 0;
    const depositModal = <DepositModal visible={depositModalOpen} onClose={closeDepositModal} />;
    const handleDepositEntryClick = (): void => {
        openDepositModal();
    };

    if (!isDesktop) {
        return (
            <>
                <div className="flex h-10 items-center">
                    <MobileHeaderIcon icon={PromotionOutlined} onClick={() => router.push('/sports/promotions')} />
                    <Wallet />
                    {/* 世界杯 menu icon */}
                    <WorldCupMenuItem />
                    <div className="relative h-10">
                        <DepositReward
                            className="right-[-3px] top-[-5px] z-10 h-3.5 px-1"
                            arrowClassName="right-[7px]"
                            variant="compact"
                            reward={rechargeReward}
                        />
                        <Button className="px-4" onClick={handleDepositEntryClick}>
                            {tUser('menus.deposit')}
                        </Button>
                    </div>
                </div>
                {depositModal}
            </>
        );
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <div className={cn('order-10', 'relative')}>
                    <WrapperedIcon
                        icon={NoticeOutlined}
                        onClick={() => accountNavigator.open(UserCenterMenu.NOTIFICATION)}
                    />
                    {hasAnyUnread && (
                        <span className="absolute top-2.5 max-md:right-1.5 md:right-2.5 size-1 bg-brand-red rounded-full" />
                    )}
                </div>
                {/* betbus 形态：头像下拉聚合浮层（替代直接跳资料页） */}
                <AccountPopover className="order-20" />
                <Wallet className="order-30 shrink-0" />
                <Button className="relative order-40 px-4" type="button" onClick={handleDepositEntryClick}>
                    {tUser('menus.deposit')}
                    <DepositReward className="-right-1 -top-1.5" variant="medium" reward={rechargeReward} />
                </Button>
            </div>
            {depositModal}
        </>
    );
};
