'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useIsLogin } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { CommonButton } from '../CommonButton';
import { Title } from '../Title';
import bgImg from './assets/bg.png';

/**
 * WelcomeBanner 组件，用于展示 VIP 首页顶部欢迎横幅。
 */
export const WelcomeBanner: FC = () => {
    const t = useTranslations('vip');
    const isLogin = useIsLogin();
    const openLoginModal = useUIStore((state) => state.openLoginModal);

    const handleViewBenefits = () => {
        const target = document.getElementById('vip-all-benefits');

        if (!target) return;

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <section
            className="overflow-hidden rounded-lg"
            style={{
                backgroundImage: `url(${bgImg.src})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <div className="flex flex-col items-center justify-center px-4 py-10  text-center  ">
                <div className="flex flex-col items-center">
                    {/* 欢迎标题 */}
                    <Title title={t('banner.welcome')} color="text-neutral-white-h" />

                    <h1 className="text-center text-[60px] leading-17 max-md:text-[40px] font-roboto-flex font-extrabold uppercase italic text-neutral-white-h ">
                        {t('banner.club')}
                    </h1>

                    {/* 欢迎描述 */}
                    <p className="mt-4 text-body-md max-md:text-auxiliary-sm font-medium text-neutral-white-h ">
                        {t('banner.description')}
                    </p>

                    {/* 未登录时展示操作按钮 */}
                    {!isLogin ? (
                        <div className="mt-8 flex flex-row items-center gap-4  ">
                            <button
                                type="button"
                                className="w-39.5 max-md:w-40 h-10 rounded-lg bg-brand-red px-4 text-body-lg font-poppins font-bold uppercase text-white  cursor-pointer transition-colors hover:bg-brand-primary-4 active:bg-brand-primary-4"
                                onClick={openLoginModal}
                            >
                                {t('banner.joinNow')}
                            </button>

                            <CommonButton
                                icon
                                size="large"
                                variant="secondarySpecial"
                                className="max-md:w-40 "
                                onClick={handleViewBenefits}
                            >
                                {t('banner.viewBenefits')}
                            </CommonButton>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
};
