import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { LimitConfig } from '@/api/models/health-setting';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { formatLimitValue, formatPendingText } from './_utils';
import { LimitEditor } from './limit-editor';
import { SettingCard } from './setting-card';

interface LossCardProps {
    config?: LimitConfig;
    isExpanded: boolean;
    onToggle: () => void;
}

export const LossCard: FC<LossCardProps> = ({ config, isExpanded, onToggle }) => {
    const t = useTranslations('user');
    const { currencySymbolNarrow } = useIntlFormatter();

    return (
        <SettingCard
            title={t('healthSetting.lossLimit')}
            value={formatLimitValue(t, currencySymbolNarrow, config?.effective)}
            hasValue={!!config?.effective?.limit}
            isExpanded={isExpanded}
            pendingText={formatPendingText(t, config?.pending, 'limit', currencySymbolNarrow)}
            onClick={onToggle}
        />
    );
};

interface LossEditorProps {
    config?: LimitConfig;
    onClose: () => void;
    onConfirm: (data: { limit: number }) => void;
}

export const LossEditor: FC<LossEditorProps> = ({ config, onClose, onConfirm }) => {
    return <LimitEditor type="loss" currentValue={config?.effective} onClose={onClose} onConfirm={onConfirm} />;
};
