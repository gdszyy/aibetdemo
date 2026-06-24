'use client';

import { useTranslations } from 'next-intl';
import { type FunctionComponent, useEffect, useState } from 'react';
import { FormProvider, useFormState, useWatch } from 'react-hook-form';
import { LoginType } from '@/api/handlers/passport';
import { FirebaseAnalyticsEventName } from '@/api/models/analytics';
import { OAuthProvider } from '@/api/models/user';
import { Arrow } from '@/components/Arrow';
import { Button } from '@/components/button/button';
// import { Facebook } from '@/components/icons2/Facebook';
import { Google } from '@/components/icons2/Google';
import { Logo } from '@/components/Logo';
import { Modal } from '@/components/modal/modal';
import { APP_NAME } from '@/constants';
import { useBusinessFirebaseAnalytics } from '@/hooks/use-business-firebase-analytics';
import { useIsDesktop } from '@/hooks/use-media-query';
import { Link, useRouter } from '@/i18n';
import { prepareFirebaseOAuth } from '@/libs/oauth';
import { useIsLogin } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { getAnalyticsAuthDurationMs, markAnalyticsAuthPageEnterAt } from '@/utils/analytics';
import { cn } from '@/utils/common';
import { type AuthTabItem, AuthTabs } from './_components/auth-tabs';
import { useSigninForm } from './_hooks/use-signin-form';
import { EmailForm } from './email-form';
import { PhoneForm } from './phone-form';

/** 移动端登录页支持的认证方式。 */
type H5SigninTab = `${LoginType.Mobile}` | `${LoginType.Email}`;

export const H5Signin: FunctionComponent = () => {
    const { t, formMethods, loginAction, oauthLoginAction, errorMsg, setErrorMsg } = useSigninForm();
    const tCommon = useTranslations('common');
    const router = useRouter();
    const isLogin = useIsLogin();
    const isDesktop = useIsDesktop();
    const openLoginModal = useUIStore((s) => s.openLoginModal);
    const [oauthReady, setOauthReady] = useState(false);
    const { track } = useBusinessFirebaseAnalytics();
    const [account, code] = useWatch({ control: formMethods.control, name: ['account', 'code'] });
    const activeTab = String(useWatch({ control: formMethods.control, name: 'type' })) as H5SigninTab;
    const tabs: AuthTabItem<H5SigninTab>[] = [
        {
            value: String(LoginType.Email) as H5SigninTab,
            label: t('login.emailTab'),
        },
        {
            value: String(LoginType.Mobile) as H5SigninTab,
            label: t('login.phoneTab'),
        },
    ];
    const { errors } = useFormState({ control: formMethods.control });
    const isFormReady = !!account && !!code && !errors.account && !errors.code;

    useEffect(() => {
        if (isLogin) {
            router.replace('/');
        }
    }, [isLogin, router]);

    useEffect(() => {
        if (isDesktop === true) {
            router.replace('/');
            requestAnimationFrame(() => {
                openLoginModal();
            });
        }
    }, [isDesktop, router, openLoginModal]);

    useEffect(() => {
        prepareFirebaseOAuth()
            .then(() => setOauthReady(true))
            .catch(() => setErrorMsg(t('login.oauthFailed')));
    }, [setErrorMsg, t]);

    useEffect(() => {
        markAnalyticsAuthPageEnterAt();
        track(FirebaseAnalyticsEventName.AuthPageView);
    }, [track]);

    const closeErrorMsg = () => setErrorMsg(null);

    /** 切换认证方式时清空旧账号和验证码，避免手机号与邮箱表单串用。 */
    const handleTabChange = (value: H5SigninTab): void => {
        formMethods.setValue('type', Number(value) as LoginType);
        formMethods.setValue('account', '');
        formMethods.setValue('code', '');
        formMethods.setValue('msgId', undefined);
        formMethods.clearErrors();
    };

    /** 关闭登录弹窗并记录停留时长。 */
    const handleClosePage = (): void => {
        track(FirebaseAnalyticsEventName.AuthPageClose, {
            close_duration_ms: getAnalyticsAuthDurationMs() ?? 0,
        });
        router.back();
    };

    return (
        <div className="relative flex min-h-screen flex-col bg-surface-1 pb-[env(safe-area-inset-bottom)]">
            <button
                type="button"
                onClick={handleClosePage}
                className="absolute left-3 top-3 h-7 flex flex-row gap-2 items-center text-headline-sm text-brand-primary-4"
            >
                <Arrow className="size-4 text-filltext-ft-g" direction="left" />
                <span> {t('login.title')}</span>
            </button>

            <main className="flex w-full flex-1 flex-col px-7 pb-20 pt-11">
                <div className="py-2 flex flex-col gap-4">
                    <div className="py-1.25">
                        <Logo className="w-44.25 h-10 mx-auto" variant="long" />
                    </div>
                    <FormProvider {...formMethods}>
                        <form
                            onSubmit={formMethods.handleSubmit((data) =>
                                loginAction.mutateAsync(data).catch(() => undefined),
                            )}
                            className="flex w-full min-w-0 flex-col gap-5 items-center"
                        >
                            <input type="hidden" {...formMethods.register('type')} />
                            <input type="hidden" {...formMethods.register('msgId')} />

                            <div className="flex w-full min-w-0 flex-col gap-6">
                                <AuthTabs
                                    value={activeTab}
                                    items={tabs}
                                    onChange={handleTabChange}
                                    className="w-full"
                                    listClassName="justify-center"
                                />
                                {activeTab === String(LoginType.Email) ? <EmailForm /> : <PhoneForm />}
                            </div>

                            <Button
                                className={cn('rounded-full h-11 text-neutral-white-h', !isFormReady && 'opacity-60')}
                                type="submit"
                                block
                                variant="primary"
                                loading={loginAction.isPending}
                            >
                                {t('login.button')}
                            </Button>

                            <div className="w-full flex flex-col items-center gap-2">
                                <div className="flex w-full items-center gap-1 text-body-sm text-filltext-ft-e">
                                    <div className="h-px flex-1 bg-filltext-ft-c" />
                                    <span>{t('login.oauthDivider')}</span>
                                    <div className="h-px flex-1 bg-filltext-ft-c" />
                                </div>
                                <div className="flex items-center justify-center gap-6">
                                    <button
                                        type="button"
                                        className="flex size-10 items-center justify-center rounded-full bg-filltext-ft-a transition-colors hover:bg-filltext-ft-b disabled:opacity-60"
                                        onClick={() => oauthLoginAction.mutate(OAuthProvider.Google)}
                                        disabled={!oauthReady || loginAction.isPending || oauthLoginAction.isPending}
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
                        </form>
                    </FormProvider>
                </div>
                <div className="pt-14 text-center">
                    <div className="text-auxiliary-xxs text-filltext-ft-g">
                        {t('login.legalNoticeIntro', { appName: APP_NAME })}
                    </div>
                    <div className="text-auxiliary-xxs text-filltext-ft-e">
                        {t.rich('login.legalNoticeAgreement', {
                            terms: (chunks) => (
                                <Link href="/legal/terms" className="text-brand-primary-0 px-1">
                                    {chunks}
                                </Link>
                            ),
                            privacy: (chunks) => (
                                <Link href="/legal/privacy" className="text-brand-primary-0 px-1">
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </div>
                </div>
            </main>
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
        </div>
    );
};
