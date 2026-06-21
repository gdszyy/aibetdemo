import type { FunctionComponent } from 'react';
import { BtnWithCountdown } from '@/components/btn-with-countdown/btn-with-countdown';
import { Button } from '@/components/button/button';
import { Modal } from '@/components/modal/modal';
import { CountryFlag } from '@/i18n';
import { usePhoneForm } from './_hooks/use-phone-form';
import { TextField } from './text-field';

/** Phone number login form */
export const PhoneForm: FunctionComponent = () => {
    const { t, tCommon, phoneCode, regionCode, countdownRef, errorMsg, closeErrorMsg, sendAction } = usePhoneForm();

    return (
        <div className="flex min-w-0 flex-col gap-4 max-md:gap-6">
            <TextField
                name="account"
                placeholder={t('login.phonePlaceholder')}
                label={t('login.phoneLabel')}
                autoComplete="username"
                inputMode="tel"
                maxLength={20}
                outlineProps={{
                    startAdornment: (
                        <>
                            <div className="flex items-center gap-2 select-none shrink-0 relative">
                                <CountryFlag code={regionCode} className="size-5 rounded-xs shrink-0" />
                                <span className="text-body-md text-filltext-ft-g select-none shrink-0">
                                    +{phoneCode}
                                </span>
                            </div>
                            <div className="w-px h-3.5 bg-filltext-ft-d shrink-0" />
                        </>
                    ),
                }}
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
