import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { CheckNewUserInterface, LoginInterface, LoginType } from '@/api/handlers/passport';
import type { ErrorReject, InterfaceRequest } from '@/api/lib/types';
import { getRejectError } from '@/api/lib/utils';
import { AdPlacementTriggerTiming } from '@/api/models/ad-placement';
import { FirebaseAnalyticsEventName, type FirebaseAnalyticsParams } from '@/api/models/analytics';
import { OAuthProvider } from '@/api/models/user';
import { Toast } from '@/components/toast';
import { StorageEnum } from '@/constants';
import { useBusinessFirebaseAnalytics } from '@/hooks/use-business-firebase-analytics';
import { normalizePhone } from '@/i18n';
import { getFirebaseOAuthIdToken, isFirebaseOAuthUserCancelledError } from '@/libs/oauth';
import { useRegionConfig } from '@/stores/region-store';
import { useSessionStore } from '@/stores/session-store';
import {
    clearAnalyticsAfterRegistration,
    getAnalyticsAuthDurationMs,
    getRegistrationAttributionPayload,
    persistAnalyticsAttributionFromLocation,
} from '@/utils/analytics';

type LoginReq = InterfaceRequest<typeof LoginInterface>;

/** 登录表单字段结构，验证码在表单层始终必填。 */
interface SigninFormValues {
    /** 登录方式。 */
    type: LoginType;
    /** 手机号或邮箱。 */
    account: string;
    /** 验证码。 */
    code: string;
    /** 验证码消息标识。 */
    msgId?: string;
}

/** 将登录类型映射为埋点文档约定的方法名。 */
const getAuthAnalyticsMethod = (type: LoginType): string => {
    switch (type) {
        case LoginType.Mobile:
            return 'phone';
        case LoginType.Email:
            return 'email';
        case LoginType.Google:
            return 'google';
        case LoginType.Facebook:
            return 'facebook';
        default:
            return 'phone';
    }
};

/** 构建提交点击埋点参数。 */
const buildAuthSubmitParams = (payload: SigninFormValues, phoneCode: string): FirebaseAnalyticsParams => {
    const params: FirebaseAnalyticsParams = {
        otp_valid: /^\d+$/.test(payload.code),
        register_duration_ms: getAnalyticsAuthDurationMs() ?? 0,
    };

    if (payload.type === LoginType.Mobile) {
        return {
            ...params,
            phone_valid: payload.account.length > 0,
            country_code: phoneCode,
        };
    }

    return params;
};

/** 管理验证码登录表单、校验和登录提交逻辑。 */
export function useSigninForm(): {
    t: ReturnType<typeof useTranslations<'auth'>>;
    formMethods: ReturnType<typeof useForm<SigninFormValues>>;
    loginAction: ReturnType<typeof useMutation<void, unknown, SigninFormValues>>;
    oauthLoginAction: ReturnType<typeof useMutation<void, unknown, OAuthProvider>>;
    errorMsg: string | null;
    setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;
} {
    const t = useTranslations('auth');
    const { phoneCode, phonePattern } = useRegionConfig();
    const signIn = useSessionStore((state) => state.signIn);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { track } = useBusinessFirebaseAnalytics();

    const schema = useMemo(() => {
        return z
            .object({
                type: z.enum(LoginType),
                account: z.string(),
                code: z
                    .string()
                    .nonempty({ message: t('login.pleaseEnterCode') })
                    .regex(/^\d+$/, {
                        message: t('login.incorrectCodeFormat'),
                    }),
                msgId: z.string().optional(),
            })
            .superRefine((data, ctx): void => {
                if (data.type === LoginType.Email) {
                    const emailSchema = z
                        .string()
                        .nonempty({ message: t('login.pleaseEnterEmail') })
                        .email({
                            message: t('login.incorrectEmailFormat'),
                        });
                    const emailResult = emailSchema.safeParse(data.account);
                    if (!emailResult.success) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['account'],
                            message: emailResult.error.issues[0]?.message ?? t('login.incorrectEmailFormat'),
                        });
                    }
                    return;
                }

                const phoneSchema = phonePattern
                    ? z
                          .string()
                          .nonempty({ message: t('login.pleaseEnterPhoneNumber') })
                          .refine((value) => phonePattern.test(normalizePhone(value)), {
                              message: t('login.incorrectPhoneNumberFormat'),
                          })
                    : z.string().nonempty({ message: t('login.pleaseEnterPhoneNumber') });
                const phoneResult = phoneSchema.safeParse(data.account);
                if (!phoneResult.success) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['account'],
                        message: phoneResult.error.issues[0]?.message ?? t('login.incorrectPhoneNumberFormat'),
                    });
                }
            });
    }, [phonePattern, t]);

    const formMethods = useForm<SigninFormValues>({
        resolver: zodResolver(schema),
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            account: '',
            code: '',
            type: LoginType.Email,
        },
    });

    const loginAction = useMutation<void, unknown, SigninFormValues>({
        mutationFn: async (payload: SigninFormValues): Promise<void> => {
            let isNewUser = false;
            const loginMethod = getAuthAnalyticsMethod(payload.type);
            track(FirebaseAnalyticsEventName.AuthSubmitClick, buildAuthSubmitParams(payload, phoneCode));

            try {
                persistAnalyticsAttributionFromLocation();

                const account =
                    payload.type === LoginType.Email
                        ? payload.account
                        : `+${phoneCode}${normalizePhone(payload.account)}`;
                const { is_new } = await CheckNewUserInterface({ account, type: payload.type });
                isNewUser = is_new;
                const attribution = is_new ? getRegistrationAttributionPayload() : undefined;

                const params: LoginReq = {
                    ...payload,
                    account,
                    type: payload.type,
                    msgId: formMethods.getValues('msgId'),
                    ...(attribution
                        ? { ads_ch_code: attribution.ads_ch_code, ads_ch_params: attribution.ads_ch_params }
                        : {}),
                };

                const res = await LoginInterface(params);

                track(is_new ? FirebaseAnalyticsEventName.RegisterSuccess : FirebaseAnalyticsEventName.LoginSuccess, {
                    [is_new ? 'register_method' : 'login_method']: loginMethod,
                });

                if (is_new) {
                    clearAnalyticsAfterRegistration();
                }

                sessionStorage.setItem(
                    StorageEnum.PendingAdPlacementTrigger,
                    String(is_new ? AdPlacementTriggerTiming.RegisterSuccess : AdPlacementTriggerTiming.LoginSuccess),
                );

                await signIn(res.token);
                await Toast.success(t('login.loginSuccess'), { id: 'login-success' });
                window.location.reload();
            } catch (err) {
                const failReason = getRejectError(err as ErrorReject) || '';
                track(isNewUser ? FirebaseAnalyticsEventName.RegisterFail : FirebaseAnalyticsEventName.LoginFail, {
                    [isNewUser ? 'register_method' : 'login_method']: loginMethod,
                    fail_reason: failReason,
                    phone_otp: payload.code,
                });
                setErrorMsg(failReason);
            }
        },
    });

    const oauthLoginAction = useMutation<void, unknown, OAuthProvider>({
        mutationFn: async (provider: OAuthProvider): Promise<void> => {
            let isNewUser = false;
            try {
                persistAnalyticsAttributionFromLocation();

                const idToken = await getFirebaseOAuthIdToken(provider);
                const loginType = provider === OAuthProvider.Google ? LoginType.Google : LoginType.Facebook;
                const loginMethod = getAuthAnalyticsMethod(loginType);
                const { is_new } = await CheckNewUserInterface({ account: idToken, type: loginType });
                isNewUser = is_new;
                const attribution = is_new ? getRegistrationAttributionPayload() : undefined;

                const res = await LoginInterface({
                    type: loginType,
                    account: idToken,
                    ...(attribution
                        ? { ads_ch_code: attribution.ads_ch_code, ads_ch_params: attribution.ads_ch_params }
                        : {}),
                });

                track(is_new ? FirebaseAnalyticsEventName.RegisterSuccess : FirebaseAnalyticsEventName.LoginSuccess, {
                    [is_new ? 'register_method' : 'login_method']: loginMethod,
                });

                if (is_new) {
                    clearAnalyticsAfterRegistration();
                }

                sessionStorage.setItem(
                    StorageEnum.PendingAdPlacementTrigger,
                    String(is_new ? AdPlacementTriggerTiming.RegisterSuccess : AdPlacementTriggerTiming.LoginSuccess),
                );

                await signIn(res.token);
                await Toast.success(t('login.loginSuccess'), { id: 'login-success' });
                window.location.reload();
            } catch (err) {
                if (isFirebaseOAuthUserCancelledError(err)) {
                    await Toast.info(t('login.oauthCancelled'), { id: 'oauth-cancelled' });
                    return;
                }

                const failReason = getRejectError(err as ErrorReject) || t('login.oauthFailed');
                track(isNewUser ? FirebaseAnalyticsEventName.RegisterFail : FirebaseAnalyticsEventName.LoginFail, {
                    [isNewUser ? 'register_method' : 'login_method']:
                        provider === OAuthProvider.Google ? 'google' : 'facebook',
                    fail_reason: failReason,
                });
                setErrorMsg(failReason);
            }
        },
    });

    return {
        t,
        formMethods,
        loginAction,
        oauthLoginAction,
        errorMsg,
        setErrorMsg,
    };
}
