'use client';

import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { Notice, User } from '@/components/icons';
import { UserCenterMenu } from '@/constants/user-center';
import { useAccountNavigator } from '@/hooks/use-account-navigator';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useWalletTotalBalance } from '@/hooks/use-wallet';
import { useHasAnyUnread } from '../../user-center/notification/use-unread-messages';

/** Logged-in operation bar */
export const OperationBar: FunctionComponent = () => {
    const { formatCurrency } = useIntlFormatter();

    const tAuth = useTranslations('auth');
    const hasAnyUnread = useHasAnyUnread();

    const accountNavigator = useAccountNavigator();

    const totalBalance = useWalletTotalBalance();

    return (
        <div className="gap-x-4 inline-flex items-center">
            <div className="h-10 rounded-full px-4 bg-surface-raised gap-x-1 inline-flex items-center cursor-pointer">
                <button
                    type="button"
                    className="text-body-lg text-brand-red cursor-pointer"
                    onClick={() => accountNavigator.open(UserCenterMenu.DEPOSIT)}
                >
                    {tAuth('logined.deposit')}
                </button>
                <span className="text-body-lg text-brand-dark">|</span>
                <button
                    type="button"
                    className="text-body-sm text-brand-dark cursor-pointer"
                    onClick={() => accountNavigator.open(UserCenterMenu.WITHDRAW)}
                >
                    {tAuth('logined.withdraw')}
                </button>
            </div>
            <span className="text-title-sm text-brand-red">{formatCurrency(totalBalance)}</span>

            <div className="flex items-center gap-x-2">
                <User
                    className="text-filltext-ft-g text-xl cursor-pointer hover:text-brand-red transition-colors"
                    onClick={() => accountNavigator.open(UserCenterMenu.DEPOSIT)}
                />
                <div className="relative">
                    <Notice
                        className="text-filltext-ft-g text-xl cursor-pointer hover:text-brand-red transition-colors"
                        onClick={() => accountNavigator.open(UserCenterMenu.NOTIFICATION)}
                    />
                    {hasAnyUnread && (
                        <span className="absolute top-0 right-0 w-[6px] h-[6px] rounded-full bg-brand-red" />
                    )}
                </div>
            </div>
        </div>
    );
};
