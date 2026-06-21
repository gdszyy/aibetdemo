import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { LimitConfig } from '@/api/models/health-setting';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { formatLimitValue, formatPendingText } from './_utils';
import { LimitEditor } from './limit-editor';
import { SettingCard } from './setting-card';

interface DepositCardProps {
    config?: LimitConfig;
    isExpanded: boolean;
    onToggle: () => void;
}

export const DepositCard: FC<DepositCardProps> = ({ config, isExpanded, onToggle }) => {
    const t = useTranslations('user');
    const { currencySymbolNarrow } = useIntlFormatter();

    return (
        <SettingCard
            title={t('healthSetting.depositLimit')}
            value={formatLimitValue(t, currencySymbolNarrow, config?.effective)}
            hasValue={!!config?.effective?.limit}
            isExpanded={isExpanded}
            pendingText={formatPendingText(t, config?.pending, 'limit', currencySymbolNarrow)}
            onClick={onToggle}
        />
    );
};

interface DepositEditorProps {
    config?: LimitConfig;
    onClose: () => void;
    onConfirm: (data: { limit: number }) => void;
}

export const DepositEditor: FC<DepositEditorProps> = ({ config, onClose, onConfirm }) => {
    return <LimitEditor type="deposit" currentValue={config?.effective} onClose={onClose} onConfirm={onConfirm} />;
};
