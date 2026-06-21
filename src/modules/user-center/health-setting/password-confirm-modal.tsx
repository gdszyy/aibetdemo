'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/components/button/button';
import { FormPassword } from '@/components/form-password/form-password';
import { Modal } from '@/components/modal/modal';

interface PasswordConfirmModalProps {
    /** Whether the modal is visible */
    visible: boolean;
    /** Close callback */
    onClose: () => void;
    /** Confirm callback (returns Promise; closes modal on success, shows error on failure) */
    onConfirm: (password: string) => Promise<void>;
    /** Whether the modal is in loading state */
    loading?: boolean;
}

/**
 * Password confirmation modal
 * Used for password verification when modifying health settings
 */
export const PasswordConfirmModal: FC<PasswordConfirmModalProps> = ({ visible, onClose, onConfirm, loading }) => {
    const t = useTranslations('user');

    const methods = useForm({
        defaultValues: {
            password: '',
        },
    });

    const {
        handleSubmit,
        reset,
        setError,
        formState: { isValid },
    } = methods;

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: { password: string }) => {
        try {
            await onConfirm(data.password);
            handleClose();
        } catch (err) {
            // Map error message to RHF error state for inline display
            const errorMsg =
                (err as { message?: string })?.message || t('healthSetting.passwordConfirm.invalidPassword');
            setError('password', { message: errorMsg });
        }
    };

    return (
        <Modal visible={visible} onClose={handleClose} closeButton={false}>
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-[calc(100vw-2rem)] max-w-[420px] flex flex-col gap-4 px-4 py-6"
                >
                    {/* Prompt text */}
                    <p className="text-title-md text-filltext-ft-g">{t('healthSetting.passwordConfirm.title')}</p>

                    {/* Password input area - using shared FormPassword */}
                    <FormPassword
                        name="password"
                        fieldProps={{
                            placeholder: t('healthSetting.passwordConfirm.placeholder'),
                            className: 'h-10 border-[0.5px] border-filltext-ft-d',
                        }}
                        rules={{ required: true }}
                    />

                    {/* Action buttons */}
                    <div className="flex items-center justify-between gap-[10px] w-full">
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            className="flex-1 h-10 bg-filltext-ft-b text-filltext-ft-e border-none rounded-full"
                        >
                            {t('healthSetting.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            className="flex-1 h-10 bg-brand-primary-0 text-white rounded-full border-none"
                            disabled={!isValid}
                        >
                            {t('healthSetting.confirm')}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};
