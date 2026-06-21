import type { StaticImageData } from 'next/image';
import { WorldCupPassCouponType } from '@/api/models/world-cup-pass';
import CashbackReward from './assets/cashback.png';
import CasinoBonusReward from './assets/casinobonus.png';
import FreeSpinReward from './assets/freespin.png';
import FreeSportReward from './assets/freesport.png';
import SportBonusReward from './assets/sportbonus.png';

/** 世界杯通行证奖励类型对应的展示图片。 */
const WORLD_CUP_PASS_REWARD_IMAGE_MAP: Record<WorldCupPassCouponType, StaticImageData> = {
    [WorldCupPassCouponType.Cash]: CashbackReward,
    [WorldCupPassCouponType.SportBonus]: SportBonusReward,
    [WorldCupPassCouponType.FreeSport]: FreeSportReward,
    [WorldCupPassCouponType.CasinoBonus]: CasinoBonusReward,
    [WorldCupPassCouponType.FreeSpin]: FreeSpinReward,
};

/**
 * 根据优惠券奖励类型获取世界杯通行证奖励图片。
 * @param type 优惠券奖励类型
 * @returns 奖励展示图片
 */
export const getWorldCupPassRewardImage = (type: WorldCupPassCouponType): StaticImageData =>
    WORLD_CUP_PASS_REWARD_IMAGE_MAP[type];
