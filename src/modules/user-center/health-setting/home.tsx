'use client';

import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { SetDepositLimitInterface, SetLossLimitInterface, SetRestTimeInterface } from '@/api/handlers/health-setting';
import { Toast } from '@/components/toast';
import { usePasswordSettingCheck } from '@/hooks/use-password-setting-check';
import { PasswordSetupMode, PasswordType } from '@/modules/security-center/_components/passwords-forms';
import { DepositCard, DepositEditor } from './deposit-section';
import { GamingScheduleCard, GamingScheduleEditor } from './gaming-schedule-section';
import { LossCard, LossEditor } from './loss-section';
import { PasswordConfirmModal } from './password-confirm-modal';
import { useHealthSetting, useRefreshHealthSetting } from './use-health-setting';

type EditorType = 'deposit' | 'loss' | 'schedule' | null;

type EditorParams =
    | { type: 'deposit'; data: { limit: number } }
    | { type: 'loss'; data: { limit: number } }
    | { type: 'schedule'; data: { start: string; end: string } };

/**
 * Health setting home page
 */
export const HealthSettingHome: FC = () => {
    const tCommon = useTranslations('common');
    const { data: config } = useHealthSetting();
    const refreshHealthSetting = useRefreshHealthSetting();
    const passwordCheck = usePasswordSettingCheck();
    const hasUserPassword = passwordCheck[PasswordType.User] === PasswordSetupMode.Reset;

    const [activeEditor, setActiveEditor] = useState<EditorType>(null);
    const [pendingParams, setPendingParams] = useState<EditorParams | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Submit settings
    const handleSubmit = async (params: EditorParams, password: string) => {
        setLoading(true);
        try {
            switch (params.type) {
                case 'deposit':
                    await SetDepositLimitInterface({
                        limit: params.data.limit,
                        user_password: password || undefined,
                    });
                    break;
                case 'loss':
                    await SetLossLimitInterface({
                        limit: params.data.limit,
                        user_password: password || undefined,
                    });
                    break;
                case 'schedule':
                    await SetRestTimeInterface({
                        start: params.data.start,
                        end: params.data.end,
                        user_password: password || undefined,
                    });
                    break;
            }

            Toast.success(tCommon('message.success'), { id: 'health-setting-save' });
            refreshHealthSetting();
            setActiveEditor(null);
            setShowPasswordModal(false);
            setPendingParams(null);
        } catch (error) {
            const msg = (error as { message?: string })?.message || tCommon('message.error');
            // If submitted within the password modal, rethrow so the modal catches and shows inline error
            if (showPasswordModal) {
                throw error;
            }
            // Otherwise (direct submit without password) show Toast
            Toast.error(msg, { id: 'health-setting-save' });
        } finally {
            setLoading(false);
        }
    };

    // Handle editor confirm: show password modal if password is set, otherwise submit directly
    const handleEditorConfirm = (params: EditorParams) => {
        if (hasUserPassword) {
            setPendingParams(params);
            setShowPasswordModal(true);
        } else {
            handleSubmit(params, '');
        }
    };

    // Handle submit after password confirmation
    const handlePasswordConfirm = async (password: string) => {
        if (!pendingParams) return;
        return handleSubmit(pendingParams, password);
    };

    // Toggle editor (close if clicking the same one)
    const toggleEditor = (type: EditorType) => {
        setActiveEditor((prev) => (prev === type ? null : type));
    };

    // Render editor (based on activeEditor type)
    const renderEditor = () => {
        if (!activeEditor) return null;

        if (activeEditor === 'deposit') {
            return (
                <DepositEditor
                    key="deposit"
                    config={config?.deposit}
                    onClose={() => setActiveEditor(null)}
                    onConfirm={(data) => handleEditorConfirm({ type: 'deposit', data })}
                />
            );
        }

        if (activeEditor === 'loss') {
            return (
                <LossEditor
                    key="loss"
                    config={config?.loss}
                    onClose={() => setActiveEditor(null)}
                    onConfirm={(data) => handleEditorConfirm({ type: 'loss', data })}
                />
            );
        }

        if (activeEditor === 'schedule') {
            return (
                <GamingScheduleEditor
                    key="schedule"
                    config={config?.rest}
                    onClose={() => setActiveEditor(null)}
                    onConfirm={(data) => handleEditorConfirm({ type: 'schedule', data })}
                />
            );
        }

        return null;
    };

    return (
        <div className="account-card w-full h-full flex flex-col justify-between">
            {/* Card list */}
            <div className="flex flex-col gap-4">
                {/* Deposit Limit */}
                <DepositCard
                    config={config?.deposit}
                    isExpanded={activeEditor === 'deposit'}
                    onToggle={() => toggleEditor('deposit')}
                />

                {/* Lost Limit */}
                <LossCard
                    config={config?.loss}
                    isExpanded={activeEditor === 'loss'}
                    onToggle={() => toggleEditor('loss')}
                />

                {/* Daily Gaming Schedule */}
                <GamingScheduleCard
                    config={config?.rest}
                    isExpanded={activeEditor === 'schedule'}
                    onToggle={() => toggleEditor('schedule')}
                />
            </div>

            {/* Editor area - always at the bottom of the card list */}
            {renderEditor()}

            {/* Password confirmation modal */}
            <PasswordConfirmModal
                visible={showPasswordModal}
                onClose={() => {
                    setShowPasswordModal(false);
                    setPendingParams(null);
                }}
                onConfirm={handlePasswordConfirm}
                loading={loading}
            />
        </div>
    );
};
