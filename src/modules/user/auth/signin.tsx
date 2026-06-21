'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type FunctionComponent, useEffect, useState } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { LoginType } from '@/api/handlers/passport';
import { FirebaseAnalyticsEventName } from '@/api/models/analytics';
import { OAuthProvider } from '@/api/models/user';
import gotobetArenaBg from '@/assets/images/gotobet-arena-bg.png';
import { Button } from '@/components/button/button';
import { DepositReward } from '@/components/DepositReward';
// import { Facebook } from '@/components/icons2/Facebook';
import { Google } from '@/components/icons2/Google';
import { Logo } from '@/components/Logo';
import { Modal } from '@/components/modal/modal';
import { APP_NAME } from '@/constants';
import { useBusinessFirebaseAnalytics } from '@/hooks/use-business-firebase-analytics';
import { useIsDesktop, useIsMobile } from '@/hooks/use-media-query';
import { useRechargeActiveConfig } from '@/hooks/use-recharge-code';
import { Link, useRouter } from '@/i18n';
import { prepareFirebaseOAuth } from '@/libs/oauth';
import { useUIStore } from '@/stores/ui-store';
import { getAnalyticsAuthDurationMs, markAnalyticsAuthPageEnterAt } from '@/utils/analytics';
import { cn } from '@/utils/common';
import { type AuthTabItem, AuthTabs } from './_components/auth-tabs';
import { useSigninForm } from './_hooks/use-signin-form';
import { EmailForm } from './email-form';
import { PhoneForm } from './phone-form';

/** 登录页支持的认证方式。 */
type SigninTab = `${LoginType.Mobile}` | `${LoginType.Email}`;

/** 桌面端登录入口按钮，实际登录弹窗由全局 SigninModal 承载。 */
export const Signin: FunctionComponent = () => {
    const t = useTranslations('auth');
    const openLoginModal = useUIStore((s) => s.openLoginModal);
    const rechargeReward = Number(useRechargeActiveConfig()?.max_withdraw) || 0;
    const { track } = useBusinessFirebaseAnalytics();

    /** 打开登录弹窗并记录入口点击。 */
    const handleOpenLoginModal = (): void => {
        track(FirebaseAnalyticsEventName.AuthPageEntryClick);
        openLoginModal();
    };

    return (
        <div className="relative">
            <Button className="px-4" onClick={handleOpenLoginModal}>
                {t('login.title2')}
            </Button>
            <DepositReward className="-right-1 -top-1.5" variant="medium" reward={rechargeReward} />
        </div>
    );
};

/** 全局登录弹窗桥接：PC 打开 Modal，H5 跳转独立登录页。 */
export const SigninModal: FunctionComponent = () => {
    const { t, formMethods, loginAction, oauthLoginAction, errorMsg, setErrorMsg } = useSigninForm();
    const isDesktop = useIsDesktop();
    const isMobile = useIsMobile();
    const router = useRouter();
    const tCommon = useTranslations('common');
    const { track } = useBusinessFirebaseAnalytics();
    const loginModalOpen = useUIStore((s) => s.loginModalOpen);
    const closeLoginModal = useUIStore((s) => s.closeLoginModal);
    const [oauthReady, setOauthReady] = useState(false);
    const activeTab = String(useWatch({ control: formMethods.control, name: 'type' })) as SigninTab;
    const tabs: AuthTabItem<SigninTab>[] = [
        {
            value: String(LoginType.Email) as SigninTab,
            label: t('login.emailTab'),
        },
        {
            value: String(LoginType.Mobile) as SigninTab,
            label: t('login.phoneTab'),
        },
    ];

    useEffect(() => {
        if (loginModalOpen && isMobile) {
            closeLoginModal();
            router.push('/signin');
        }
    }, [loginModalOpen, isMobile, closeLoginModal, router]);

    useEffect(() => {
        prepareFirebaseOAuth()
            .then(() => setOauthReady(true))
            .catch(() => setErrorMsg(t('login.oauthFailed')));
    }, [setErrorMsg, t]);

    // Reset validation errors when re-opening with empty fields (avoid stale errors from previous attempt)
    useEffect(() => {
        if (loginModalOpen) {
            const { account, code } = formMethods.getValues();
            if (!account && !code) {
                formMethods.clearErrors();
            }
        }
    }, [loginModalOpen, formMethods]);

    useEffect(() => {
        if (!loginModalOpen || isMobile) return;

        markAnalyticsAuthPageEnterAt();
        track(FirebaseAnalyticsEventName.AuthPageView);
    }, [isMobile, loginModalOpen, track]);

    const closeErrorMsg = () => {
        // Delay unmount so the pointerdown event that triggered this close
        // is fully processed while the modal DOM is still present,
        // preventing it from being seen as an outside-click on the login modal below.
        setTimeout(() => setErrorMsg(null), 0);
    };

    /** 切换认证方式时重置账号字段，避免跨类型复用旧输入。 */
    const handleTabChange = (value: SigninTab): void => {
        formMethods.setValue('type', Number(value) as LoginType);
        formMethods.setValue('account', '');
        formMethods.setValue('code', '');
        formMethods.setValue('msgId', undefined);
        formMethods.clearErrors();
    };

    /** 关闭登录弹窗并记录停留时长。 */
    const handleCloseLoginModal = (): void => {
        track(FirebaseAnalyticsEventName.AuthPageClose, {
            close_duration_ms: getAnalyticsAuthDurationMs() ?? 0,
        });
        closeLoginModal();
    };

    return (
        <>
            <Modal visible={!!errorMsg} onClose={closeErrorMsg} closeButton={false} withBg={false} maskClosable={false}>
                <div className="w-[calc(100vw-2rem)] max-w-108.75 rounded-md bg-surface-raised p-6 flex flex-col gap-6">
                    <p className="text-title-md">{errorMsg}</p>
                    <div className="flex justify-end">
                        <Button variant="primary" onClick={closeErrorMsg} className="flex-1 h-10">
                            {tCommon('dialog.confirmBtnText')}
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                visible={loginModalOpen}
                onClose={handleCloseLoginModal}
                closeButton={true}
                withBg={false}
                maskClosable={!errorMsg}
            >
                <div className={cn('rounded-lg overflow-hidden relative bg-surface-1', isDesktop && 'rounded-md')}>
                    <div className="relative z-10">
                        <FormProvider {...formMethods}>
                            <form
                                onSubmit={formMethods.handleSubmit((data) =>
                                    loginAction.mutateAsync(data).catch(() => undefined),
                                )}
                            >
                                <div
                                    className={cn(
                                        'w-[calc(100vw-2rem)] max-w-165 flex flex-col shadow-default',
                                        isDesktop && 'flex-row h-140',
                                    )}
                                >
                                    <input type="hidden" {...formMethods.register('type')} />
                                    <input type="hidden" {...formMethods.register('msgId')} />
                                    <div
                                        className={cn(
                                            'flex flex-col items-center justify-center relative group/left',
                                            isDesktop && 'w-70 justify-start',
                                        )}
                                    >
                                        {isDesktop && (
                                            <>
                                                <div className="absolute inset-x-0 bottom-0 h-full bg-filltext-ft-a z-0 pointer-events-none" />
                                                <div className="absolute inset-x-0 bottom-0 h-full z-0 pointer-events-none">
                                                    <div className="relative h-full">
                                                        <Image
                                                            src={gotobetArenaBg}
                                                            alt=""
                                                            fill
                                                            sizes="50vw"
                                                            priority
                                                            className="object-cover object-center bottom"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {!isDesktop && (
                                            <div
                                                className={cn(
                                                    'w-full flex items-center justify-center relative z-10 h-20',
                                                )}
                                            >
                                                <Logo className="w-30" variant="long" />
                                            </div>
                                        )}

                                        {/* Left-side desktop visual (hover up / leave down) */}
                                        {isDesktop && (
                                            <div className="absolute left-4 bottom-10 z-10">
                                                <div className="transition-transform duration-1000 ease-out group-hover/left:-translate-y-1">
                                                    <Logo className="w-45" variant="invert" />
                                                    <div className="mt-1.5 relative h-0.5 w-8 rounded-full bg-brand-primary-0">
                                                        {/* Red segment on the left */}
                                                        <div className="absolute left-0 top-0 h-0.5 w-4 rounded-full rounded-r-none bg-filltext-ft-f" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 relative">
                                        <div
                                            className={cn(
                                                'px-6 py-8',
                                                isDesktop && 'flex flex-col gap-5 px-7 py-0 mt-8',
                                            )}
                                        >
                                            <div>
                                                <div className="mb-4 flex flex-col">
                                                    <h3 className="text-headline-sm text-filltext-ft-h">
                                                        {t('login.welcome')}
                                                    </h3>
                                                    <span className="text-auxiliary-sm text-filltext-ft-e">
                                                        {t('login.description')}
                                                    </span>
                                                </div>
                                                <AuthTabs value={activeTab} items={tabs} onChange={handleTabChange} />
                                            </div>
                                            {activeTab === String(LoginType.Email) ? <EmailForm /> : <PhoneForm />}
                                            <Button
                                                className="h-10 px-4 rounded-full"
                                                type="submit"
                                                block
                                                variant="primary"
                                                loading={loginAction.isPending}
                                            >
                                                {t('login.button')}
                                            </Button>
                                            <div className={'flex flex-col items-center gap-2'}>
                                                <div className="flex w-full items-center gap-1 text-body-sm text-filltext-ft-e">
                                                    <div className="h-px flex-1 bg-filltext-ft-c" />
                                                    <span>{t('login.oauthDivider')}</span>
                                                    <div className="h-px flex-1 bg-filltext-ft-c" />
                                                </div>
                                                <div className="flex items-center justify-center gap-6">
                                                    <button
                                                        type="button"
                                                        className="size-10 rounded-full bg-filltext-ft-a hover:bg-filltext-ft-b flex items-center justify-center transition-colors disabled:opacity-60"
                                                        onClick={() => oauthLoginAction.mutate(OAuthProvider.Google)}
                                                        disabled={
                                                            !oauthReady ||
                                                            loginAction.isPending ||
                                                            oauthLoginAction.isPending
                                                        }
                                                    >
                                                        <Google className="size-5" />
                                                    </button>
                                                    {/* <button
                                                        type="button"
                                                        className="size-10 rounded-full bg-filltext-ft-a hover:bg-filltext-ft-b flex items-center justify-center transition-colors disabled:opacity-60"
                                                        onClick={() => oauthLoginAction.mutate(OAuthProvider.Facebook)}
                                                        disabled={loginAction.isPending || oauthLoginAction.isPending}
                                                    >
                                                        <Facebook className="size-5" />
                                                    </button> */}
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <div className="text-filltext-ft-g text-auxiliary-xxs">
                                                    {t('login.legalNoticeIntro', { appName: APP_NAME })}
                                                </div>
                                                <div className="text-auxiliary-xxs text-filltext-ft-e">
                                                    {t.rich('login.legalNoticeAgreement', {
                                                        terms: (chunks) => (
                                                            <Link
                                                                href="/legal/terms"
                                                                className="text-brand-primary-0 px-1"
                                                            >
                                                                {chunks}
                                                            </Link>
                                                        ),
                                                        privacy: (chunks) => (
                                                            <Link
                                                                href="/legal/privacy"
                                                                className="text-brand-primary-0 px-1"
                                                            >
                                                                {chunks}
                                                            </Link>
                                                        ),
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </div>
            </Modal>
        </>
    );
};
