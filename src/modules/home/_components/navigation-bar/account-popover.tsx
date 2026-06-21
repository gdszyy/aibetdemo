'use client';

import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { Button } from '@/components/button/button';
import { UserOutlined } from '@/components/icons2/UserOutlined';
import { ACCOUNT_ROUTES } from '@/constants/account-routes';
import { UserCenterMenu } from '@/constants/user-center';
import { useOpenDepositModal } from '@/hooks/use-open-deposit-modal';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';
import { Wallet } from './components/Wallet';

/**
 * 账户头像聚合浮层（betbus 形态）。
 *
 * 点击头像下拉：余额（复用 Wallet）+ 充值按钮 + 常用功能格（跳现有 /account/* 路由）。
 * 替代原本「点头像直接跳资料页」的交互，桌面端使用。
 */

/** 浮层里展示的功能项（按需裁剪 ACCOUNT_ROUTES）。 */
const POPOVER_MENUS: UserCenterMenu[] = [
    UserCenterMenu.DEPOSIT,
    UserCenterMenu.WITHDRAW,
    UserCenterMenu.TRANSACTION,
    UserCenterMenu.PROFILE,
    UserCenterMenu.SECURITY_CENTER,
    UserCenterMenu.SUPPORT,
];

export const AccountPopover: FC<{ className?: string }> = ({ className }) => {
    const tUser = useTranslations('user');
    const { openDepositModal } = useOpenDepositModal();
    const [open, setOpen] = useState(false);

    const items = ACCOUNT_ROUTES.filter((route) => POPOVER_MENUS.includes(route.menu));

    return (
        <div className={cn('relative', className)}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-filltext-ft-b transition-colors hover:bg-filltext-ft-c"
            >
                <UserOutlined className="size-5 text-filltext-ft-h" />
            </button>

            {open && (
                <>
                    {/* 点击空白关闭 */}
                    <button
                        type="button"
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-md border border-filltext-ft-c bg-surface-1 p-3 shadow-floating">
                        <div className="flex items-center justify-between gap-2">
                            <Wallet />
                            <Button
                                className="h-8 px-3"
                                onClick={() => {
                                    openDepositModal();
                                    setOpen(false);
                                }}
                            >
                                {tUser('menus.deposit')}
                            </Button>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-1.5">
                            {items.map((item) => (
                                <Link
                                    key={item.menu}
                                    href={item.path}
                                    onClick={() => setOpen(false)}
                                    className="flex flex-col items-center justify-center gap-1 rounded-sm p-2 text-center transition-colors hover:bg-filltext-ft-c"
                                >
                                    <span className="text-auxiliary-md text-filltext-ft-g">{tUser(item.titleKey)}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
