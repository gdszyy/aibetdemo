/** 串关加赔规则弹窗区块可见性。 */
export interface ParlayBoostRulesSectionVisibility {
    /** 是否展示逐腿贡献区块。 */
    showContributionSection: boolean;
    /** 是否展示派彩计算区块。 */
    showPayoutCalculation: boolean;
    /** 是否展示 Markets 区块。 */
    showMarketsSection: boolean;
}

/** 生成闪电入口规则弹窗区块配置：闪电入口固定隐藏逐腿贡献。 */
export const createParlayBoostLightningRulesSections = (
    showOrderDetailSections = true,
): ParlayBoostRulesSectionVisibility => ({
    showContributionSection: false,
    showPayoutCalculation: showOrderDetailSections,
    showMarketsSection: showOrderDetailSections,
});

/** 购物车闪电入口默认展示活动说明与派彩计算。 */
export const PARLAY_BOOST_LIGHTNING_RULES_SECTIONS: ParlayBoostRulesSectionVisibility =
    createParlayBoostLightningRulesSections();
