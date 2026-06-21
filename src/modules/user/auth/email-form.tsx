import type { FunctionComponent } from 'react';
import { BtnWithCountdown } from '@/components/btn-with-countdown/btn-with-countdown';
import { Button } from '@/components/button/button';
import { Modal } from '@/components/modal/modal';
import { useEmailForm } from './_hooks/use-email-form';
import { TextField } from './text-field';

/** 邮箱登录表单。 */
export const EmailForm: FunctionComponent = () => {
    const { t, tCommon, countdownRef, errorMsg, closeErrorMsg, sendAction } = useEmailForm();

    return (
        <div className="flex min-w-0 flex-col gap-4 max-md:gap-6">
            <TextField
                name="account"
                placeholder={t('login.emailPlaceholder')}
                label={t('login.emailLabel')}
                autoComplete="email"
                inputMode="email"
                maxLength={254}
            />
            <TextField
                name="code"
                label={t('login.codeLabel')}
                placeholder={t('login.codePlaceholder')}
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={8}
                outlineProps={{
                    endAdornment: (
                        <BtnWithCountdown
                            ref={countdownRef}
                            text={t('login.sendCodeButton')}
                            countdownTime={60}
                            onClick={sendAction.mutateAsync}
                            disabled={sendAction.isPending}
                            className="inline-flex max-w-24 flex-none items-center truncate text-auxiliary-sm"
                        />
                    ),
                }}
            />
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
