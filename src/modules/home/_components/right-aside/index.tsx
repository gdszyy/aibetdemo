'use client';

import type { FC, PropsWithChildren } from 'react';
import { Announcement, I18N, Setting, Support } from '@/components/icons';
import { NetworkSignalWithIcon } from '@/components/network-signal/network-signal-with-icon';
import { UserCenterMenu } from '@/constants/user-center';
import { useAccountNavigator } from '@/hooks/use-account-navigator';
import { useHasAnyUnread } from '@/modules/user-center/notification/use-unread-messages';
import { useIsLogin } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { TimezoneDisplay } from '../timezone-display';

/**
 * Right utility toolbar.
 * Accepts optional children for top slot (e.g. CartToggleButton in Sports layout).
 */
export const RightAside: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
    const accountNavigator = useAccountNavigator();
    const openLoginModal = useUIStore((s) => s.openLoginModal);
    const openLanguageModal = useUIStore((s) => s.openLanguageModal);
    const hasAnyUnread = useHasAnyUnread();
    const isLogin = useIsLogin();

    const handleAnnouncementClick = () => {
        if (!isLogin) {
            openLoginModal();
        } else {
            accountNavigator.open(UserCenterMenu.NOTIFICATION, { data: { initialTab: 'announcements' } });
        }
    };

    const handleSupportClick = () => {
        if (!isLogin) {
            openLoginModal();
        } else {
            accountNavigator.open(UserCenterMenu.SUPPORT);
        }
    };

    const handleSettingClick = () => {
        if (!isLogin) {
            openLoginModal();
        } else {
            accountNavigator.open(UserCenterMenu.SETTING);
        }
    };

    const utilityIcons = [
        { key: 'announcement', icon: Announcement, onClick: handleAnnouncementClick, badge: hasAnyUnread },
        { key: 'support', icon: Support, onClick: handleSupportClick },
        { key: 'language', icon: I18N, onClick: openLanguageModal },
    ];

    return (
        <div
            className={cn(
                'flex h-full w-[51px] shrink-0 flex-col items-center justify-between border-[color:var(--brand-sidebar-border,var(--border-subtle))] border-l bg-[var(--brand-right-rail-bg,var(--surface-shell))] py-2',
                className,
            )}
        >
            {children && <div className="flex flex-col items-center gap-1.5">{children}</div>}

            <div className="mt-auto mb-[5vh] flex flex-col items-center gap-2">
                <NetworkSignalWithIcon />

                <button
                    type="button"
                    onClick={handleSupportClick}
                    className="group flex h-10 w-[39px] cursor-pointer flex-col items-center justify-center rounded-sm border border-[color:var(--brand-right-rail-button-border,var(--border-subtle))] bg-[var(--brand-right-rail-button-bg,var(--page-bg))] text-filltext-ft-f transition-colors hover:border-brand-primary-0 hover:bg-brand-primary-0 hover:text-on-brand"
                >
                    <span className="text-[10px] font-bold leading-none text-brand-primary-0 group-hover:text-on-brand">
                        LIVE
                    </span>
                    <span className="mt-1 h-1 w-1 rounded-full bg-brand-primary-0" />
                </button>

                {utilityIcons.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={item.onClick}
                        className="relative flex size-[39px] cursor-pointer items-center justify-center rounded-sm border border-[color:var(--brand-right-rail-button-border,var(--border-subtle))] bg-[var(--brand-right-rail-button-bg,var(--page-bg))] text-filltext-ft-f transition-colors hover:border-brand-primary-0 hover:bg-brand-primary-0 hover:text-on-brand"
                    >
                        <item.icon className="size-5" />
                        {item.badge && (
                            <span className="absolute top-1.5 right-1.5 size-2 rounded-full border border-page-bg bg-accent-warm" />
                        )}
                    </button>
                ))}

                <div className="flex size-[39px] items-center justify-center rounded-sm border border-[color:var(--brand-right-rail-button-border,var(--border-subtle))] bg-[var(--brand-right-rail-button-bg,var(--page-bg))]">
                    <TimezoneDisplay className="cursor-pointer text-auxiliary-md text-filltext-ft-f transition-colors hover:text-brand-primary-0" />
                </div>

                <button
                    type="button"
                    onClick={handleSettingClick}
                    className="flex size-[39px] cursor-pointer items-center justify-center rounded-sm border border-[color:var(--brand-right-rail-button-border,var(--border-subtle))] bg-[var(--brand-right-rail-button-bg,var(--page-bg))] text-filltext-ft-f transition-colors hover:border-brand-primary-0 hover:bg-brand-primary-0 hover:text-on-brand"
                >
                    <Setting className="size-5" />
                </button>
            </div>
        </div>
    );
};
