import type { OutcomeModel } from '@/api/models/market';

/** 获取投注项在购物车与投注反馈中的统一展示名称，优先使用后端映射后的别名。 */
export function getOutcomeDisplayName(outcome: Pick<OutcomeModel, 'name' | 'name_alias'>): string {
    return outcome.name_alias || outcome.name;
}
