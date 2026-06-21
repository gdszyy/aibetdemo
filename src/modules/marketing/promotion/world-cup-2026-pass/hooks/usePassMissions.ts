import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import type { WorldCupPassInfo } from '@/api/models/world-cup-pass';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useAmount } from '../../_utils/useAmount';
import { buildMissionItems, type MissionCardItem } from '../constants';

interface UsePassMissionsParams {
    /** 首页接口返回数据 */
    data: WorldCupPassInfo | null | undefined;
}

interface UsePassMissionsReturn {
    /** 每日任务卡片数据 */
    dailyMissions: MissionCardItem[];
    /** 每周任务卡片数据 */
    weeklyMissions: MissionCardItem[];
}

/** 构建世界杯通行证每日和每周任务卡片数据。 */
export const usePassMissions = ({ data }: UsePassMissionsParams): UsePassMissionsReturn => {
    const tWorldCupPass = useTranslations('promotionWorldCupPass');
    const { formatNumber } = useIntlFormatter();
    const formatAmount = useAmount();

    const dailyMissions = useMemo(
        () => buildMissionItems(data?.dailyMissions ?? [], tWorldCupPass, formatNumber, formatAmount),
        [data?.dailyMissions, formatAmount, formatNumber, tWorldCupPass],
    );
    const weeklyMissions = useMemo(
        () => buildMissionItems(data?.weeklyMissions ?? [], tWorldCupPass, formatNumber, formatAmount),
        [data?.weeklyMissions, formatAmount, formatNumber, tWorldCupPass],
    );

    return {
        dailyMissions,
        weeklyMissions,
    };
};
