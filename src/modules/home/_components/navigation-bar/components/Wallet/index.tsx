import { useBoolean } from 'ahooks';
import { useTranslations } from 'next-intl';
import { Popover } from 'radix-ui';
import type { FunctionComponent } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Arrow } from '@/components/Arrow';
import { Button } from '@/components/button/button';
import { Coin } from '@/components/icons';
import { CasinoBonusOutlined } from '@/components/icons2/CasinoBonusOutlined';
import { FreeSpinOutlined } from '@/components/icons2/FreeSpinOutlined';
import { FreeSportOutlined } from '@/components/icons2/FreeSportOutlined';
import { SportBonusOutlined } from '@/components/icons2/SportBonusOutlined';
import { WalletOutlined } from '@/components/icons2/WalletOutlined';
import { getAccountPath } from '@/constants/account-routes';
import { UserCenterMenu } from '@/constants/user-center';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useIsMobile } from '@/hooks/use-media-query';
import { useOpenDepositModal } from '@/hooks/use-open-deposit-modal';
import { useWallet, useWalletTotalBalance } from '@/hooks/use-wallet';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';

/** 钱包 */
export const Wallet: FunctionComponent<{
    className?: string;
}> = ({ className }) => {
    const t = useTranslations('transaction');
    const tUser = useTranslations('user');
    const isMobile = useIsMobile();
    const { openDepositModal } = useOpenDepositModal();

    const { formatCurrency, formatNumber, currencySymbolCode } = useIntlFormatter();

    const totalBalance = useWalletTotalBalance();
    const { mainBalance, sportBonus, casinoBonus, freeSport, freeSpin } = useWallet(
        useShallow((s) => ({
            mainBalance: s.mainBalance,
            sportBonus: s.sportBonus,
            casinoBonus: s.casinoBonus,
            freeSport: s.freeSport,
            freeSpin: s.freeSpin,
        })),
    );
    const formattedTotalBalance = isMobile ? formatNumber(totalBalance) : formatCurrency(totalBalance);
    const formattedMainBalance = isMobile ? formatNumber(mainBalance) : formatCurrency(mainBalance);

    const listItems: { key: string; title: string; value: number; icon: typeof SportBonusOutlined }[] = [
        {
            key: 'sportBonus',
            title: t('sportBonus'),
            icon: SportBonusOutlined,
            value: sportBonus,
        },
        {
            key: 'casinoBonus',
            title: t('casinoBonus'),
            icon: CasinoBonusOutlined,
            value: casinoBonus,
        },
        {
            key: 'freeSport',
            title: t('freeSport'),
            icon: FreeSportOutlined,
            value: freeSport,
        },
        {
            key: 'freeSpin',
            title: t('freeSpin'),
            icon: FreeSpinOutlined,
            value: freeSpin,
        },
    ];

    const [open, openAction] = useBoolean(false);

    const handleDepositClick = (): void => {
        openAction.setFalse();
        openDepositModal();
    };

    return (
        <Popover.Root open={open} onOpenChange={openAction.toggle}>
            <Popover.Trigger asChild>
                <div
                    className={cn(
                        'group',
                        'inline-flex items-center gap-1',
                        'min-w-0 h-10 px-1 md:px-4',
                        'rounded-full',
                        'md:bg-filltext-ft-b ',
                        'md:hover:bg-filltext-ft-c',
                        'cursor-pointer transition-all',
                        className,
                    )}
                >
                    {isMobile ? (
                        <p className="inline-flex items-center gap-1">
                            <span className="max-w-[82px] truncate text-body-lg text-filltext-ft-h">
                                {formattedTotalBalance}
                            </span>
                            <span className="text-auxiliary-md font-semibold text-filltext-ft-e">
                                {currencySymbolCode}
                            </span>
                        </p>
                    ) : (
                        <>
                            <span className="coin-shine">
                                <Coin className="size-5 shrink-0" />
                            </span>
                            <span className="text-body-lg text-filltext-ft-h ellipsis">{formattedTotalBalance}</span>
                        </>
                    )}

                    <Arrow
                        direction="down"
                        className="size-3 shrink-0 text-filltext-ft-h transition-transform group-data-[state=open]:rotate-0"
                    />
                </div>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="z-9999 outline-none" align="end" side="bottom" sideOffset={8}>
                    <div className="max-md:w-[70vw] md:w-75 rounded-sm bg-filltext-ft-a shadow-[0_0_4px_0_var(--filltext-ft-d)]">
                        <div className="px-4 py-2">
                            <p className="h-6 flex items-center gap-x-1">
                                <WalletOutlined className="size-3.5" />
                                <span className="text-auxiliary-sm text-filltext-ft-g">{t('mainBalance')}</span>
                            </p>
                            <p className="mt-px text-title-md text-filltext-ft-h">{formattedMainBalance}</p>
                        </div>
                        <div className="p-2 flex flex-col gap-y-1 bg-surface-1">
                            {listItems.map((v) => {
                                return (
                                    <div
                                        key={v.key}
                                        className="group flex items-center h-10 p-2 rounded-sm hover:bg-brand-primary-1"
                                    >
                                        <v.icon className="size-3.5 text-filltext-ft-e group-hover:text-brand-primary-0" />
                                        <span className="ml-1 text-auxiliary-sm text-filltext-ft-g  group-hover:text-brand-primary-0">
                                            {v.title}
                                        </span>
                                        <div className="flex-1" />
                                        <span className="text-body-lg text-filltext-ft-h  group-hover:text-brand-primary-0">
                                            {formatCurrency(v.value)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-4 py-2 flex flex-col gap-2">
                            <Button type="button" block className="h-10" onClick={handleDepositClick}>
                                {tUser('menus.deposit')}
                            </Button>
                            <Link
                                className="h-10 flex items-center justify-center rounded-full border border-filltext-ft-c bg-surface-1 text-body-md text-filltext-ft-e hover:bg-brand-primary-0 hover:text-neutral-white-h"
                                href={getAccountPath(UserCenterMenu.TRANSACTION)}
                                onClick={openAction.setFalse}
                            >
                                {t('transaction')}
                            </Link>
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};
