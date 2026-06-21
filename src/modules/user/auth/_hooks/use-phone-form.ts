import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { SendSmsCodeInterface } from '@/api/handlers/passport';
import type { ErrorReject } from '@/api/lib/types';
import { getRejectError } from '@/api/lib/utils';
import type { BtnWithCountdownRef } from '@/components/btn-with-countdown/btn-with-countdown';
import { Toast } from '@/components/toast';
import { normalizePhone } from '@/i18n';
import { useRegionCode, useRegionConfig } from '@/stores/region-store';

/** 管理手机号验证码表单的发送流程与反馈状态。 */
export function usePhoneForm() {
    const t = useTranslations('auth');
    const tCommon = useTranslations('common');
    const { phoneCode } = useRegionConfig();
    const regionCode = useRegionCode();

    const { getValues, clearErrors, trigger, setValue } = useFormContext();

    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const countdownRef = useRef<BtnWithCountdownRef | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const closeErrorMsg = (): void => {
        timerRef.current = setTimeout(() => setErrorMsg(null), 0);
    };

    // Send verification code
    const sendAction = useMutation<void, ErrorReject, void>({
        mutationFn: async (): Promise<void> => {
            clearErrors('account');

            const validate = await trigger('account');
            if (!validate) {
                return;
            }

            try {
                const res = await SendSmsCodeInterface({
                    account: `+${phoneCode}${normalizePhone(getValues('account'))}`,
                });
                countdownRef.current?.start();
                setValue('msgId', res.msgId);
                await Toast.success(t('login.codeSentSuccessful'), { id: 'code-sent' });
            } catch (err) {
                setErrorMsg(getRejectError(err as ErrorReject) || t('login.codeSendFailed'));
            }
        },
    });

    useEffect((): (() => void) => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return {
        t,
        tCommon,
        phoneCode,
        regionCode,
        countdownRef,
        errorMsg,
        closeErrorMsg,
        sendAction,
    };
}
