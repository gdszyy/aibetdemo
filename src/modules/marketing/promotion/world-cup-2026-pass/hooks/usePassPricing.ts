import Decimal from 'decimal.js-light';
import type { WorldCupPassInfo } from '@/api/models/world-cup-pass';
import { useWalletMainBalance } from '@/hooks/use-wallet';
import { useAmount } from '../../_utils/useAmount';

interface UsePassPricingParams {
    /** 首页接口返回数据 */
    data: WorldCupPassInfo | null | undefined;
}

interface UsePassPricingReturn {
    /** 是否余额足够解锁高级通行证 */
    hasSufficientBalance: boolean;
    /** 主钱包余额格式化文案 */
    balanceText: string;
    /** 高级通行证原价文案 */
    premiumPriceText: string;
    /** 高级通行证优惠价文案 */
    discountPriceText: string | undefined;
    /** 解锁高级通行证实际支付价文案 */
    unlockPremiumPriceText: string;
    /** 解锁高级通行证实际支付价原始值 */
    unlockPremiumPriceValue: string;
}

/** 计算世界杯通行证解锁价格、余额状态和展示文案。 */
export const usePassPricing = ({ data }: UsePassPricingParams): UsePassPricingReturn => {
    const formatAmount = useAmount();
    const mainBalance = useWalletMainBalance();
    const premiumPrice = new Decimal(data?.premiumPrice ?? 0);
    const discountPrice = data?.discountPrice ? new Decimal(data.discountPrice) : undefined;
    const unlockPremiumPrice = data?.isDiscount && discountPrice ? discountPrice : premiumPrice;
    const mainBalanceAmount = new Decimal(mainBalance);

    return {
        hasSufficientBalance: mainBalanceAmount.greaterThanOrEqualTo(unlockPremiumPrice),
        balanceText: formatAmount(mainBalance),
        premiumPriceText: formatAmount(premiumPrice.toNumber()),
        discountPriceText: discountPrice ? formatAmount(discountPrice.toNumber()) : undefined,
        unlockPremiumPriceText: formatAmount(unlockPremiumPrice.toNumber()),
        unlockPremiumPriceValue: unlockPremiumPrice.toString(),
    };
};
