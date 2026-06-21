import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { RestConfig } from '@/api/models/health-setting';
import { formatPendingText, formatScheduleValue } from './_utils';
import { GamingScheduleEditor as BaseEditor } from './gaming-schedule-editor';
import { SettingCard } from './setting-card';

interface GamingScheduleCardProps {
    config?: RestConfig;
    isExpanded: boolean;
    onToggle: () => void;
}

export const GamingScheduleCard: FC<GamingScheduleCardProps> = ({ config, isExpanded, onToggle }) => {
    const t = useTranslations('user');

    return (
        <SettingCard
            title={t('healthSetting.gamingSchedule')}
            value={formatScheduleValue(t, config?.effective)}
            hasValue={!!config?.effective?.start}
            isExpanded={isExpanded}
            pendingText={formatPendingText(t, config?.pending, 'rest')}
            onClick={onToggle}
        />
    );
};

interface GamingScheduleEditorProps {
    config?: RestConfig;
    onClose: () => void;
    onConfirm: (data: { start: string; end: string }) => void;
}

export const GamingScheduleEditor: FC<GamingScheduleEditorProps> = ({ config, onClose, onConfirm }) => {
    return <BaseEditor currentValue={config?.effective} onClose={onClose} onConfirm={onConfirm} />;
};
