'use client';

import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { UserKycStatus } from '@/api/models/user';
import { useUser } from '@/stores/session-store';
import { cn } from '@/utils/common';
import { UserCenterMenu } from '../_constants/constants';

interface MenuItem {
    key: UserCenterMenu;
    label: string;
}

interface Props {
    activeMenu: UserCenterMenu;
    onMenuChange: (menu: UserCenterMenu) => void;
}

/**
 * Left sidebar menu
 */
export const Menus: FC<Props> = ({ activeMenu, onMenuChange }) => {
    const t = useTranslations('user');

    const user = useUser();

    const menus: MenuItem[] = useMemo(() => {
        return [
            t('menus.deposit'),
            t('menus.withdraw'),
            t('menus.kyc'),
            t('menus.securityCenter'),
            t('menus.affiliate'),
            t('menus.transaction'),
            t('menus.gambling'),
            t('menus.setting'),
            t('menus.support'),
            t('menus.notification'),
            t('menus.faq'),
            t('menus.logout'),
        ]
            .map((label, index) => {
                return {
                    key: (index + 1) as UserCenterMenu,
                    label,
                };
            })
            ?.filter((v) => {
                // Hide KYC menu for users who have completed KYC
                if (v.key === UserCenterMenu.KYC && user?.kyc_status === UserKycStatus.Success) {
                    return false;
                }
                return true;
            });
    }, [t, user?.kyc_status]);

    return (
        <div
            className={cn(
                'flex shrink-0',
                'flex-row gap-2 overflow-x-auto',
                'md:w-[180px] md:flex-col md:gap-1 md:overflow-y-auto md:overflow-x-hidden',
            )}
        >
            {menus.map((menu) => {
                const isLogout = menu.key === UserCenterMenu.LOGOUT;
                const isActive = menu.key === activeMenu && !isLogout;
                return (
                    <button
                        type="button"
                        key={menu.key}
                        onClick={() => onMenuChange(menu.key)}
                        className={cn(
                            'flex items-center gap-1 px-2 py-1 h-8 cursor-pointer text-left rounded-full whitespace-nowrap transition-colors group',
                            isActive ? 'bg-surface-1' : 'hover:bg-filltext-ft-b',
                        )}
                    >
                        <div
                            className={cn(
                                'size-1.5 rounded-full shrink-0 transition-colors hidden md:block',
                                isActive ? 'bg-brand-red' : 'bg-transparent',
                            )}
                        />
                        <span
                            className={cn(
                                'text-body-sm transition-colors',
                                isLogout ? 'text-brand-primary-0' : 'text-filltext-ft-g',
                            )}
                        >
                            {menu.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
