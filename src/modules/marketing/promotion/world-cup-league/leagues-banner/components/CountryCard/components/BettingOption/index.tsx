import Image from 'next/image';
import type { FC } from 'react';
import { BetActionButton, type OddsEntity } from '@/modules/match';
import { GOLD_ODDS_GRADIENT } from '../../constants';
import { formatChampionshipOdds } from '../../utils';
import { BetNowButton } from '../BetNowButton';

/** 推荐投注选项属性。 */
interface BettingOptionProps {
    /** 当前推荐投注项。 */
    oddsEntity: OddsEntity;
    /** 投注按钮展示文案。 */
    betNowLabel: string;
}

/** 冠军盘推荐投注选项展示卡片。 */
export const BettingOption: FC<BettingOptionProps> = ({ oddsEntity, betNowLabel }) => {
    const { icon, name, odds } = oddsEntity.outcome;

    return (
        <div className="relative h-40 min-w-0 flex-[0_0_calc((100%-64px)/5)] rounded-sm p-px max-md:h-17 max-md:flex-[0_0_72px] max-md:bg-filltext-ft-a max-md:p-0">
            <div className="flex h-full flex-col items-center rounded-sm bg-[#002208] px-6 py-4 max-md:justify-center max-md:bg-filltext-ft-a max-md:px-2 max-md:py-2">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-filltext-ft-c max-md:size-8">
                    {icon && <Image src={icon} alt={name} fill unoptimized className="object-contain" />}
                </span>
                <strong
                    className="mt-2 bg-clip-text text-headline-lg text-transparent max-md:mt-1 max-md:bg-none max-md:text-auxiliary-md max-md:text-filltext-ft-g"
                    style={{ backgroundImage: GOLD_ODDS_GRADIENT }}
                >
                    {formatChampionshipOdds(odds)}
                </strong>
                <BetNowButton
                    oddsEntity={oddsEntity}
                    className="mt-auto h-7 w-full text-body-lg max-md:hidden"
                    label={betNowLabel}
                />
            </div>
            <BetActionButton oddsEntity={oddsEntity} className="absolute inset-0 hidden rounded-sm max-md:block">
                <span className="sr-only">{betNowLabel}</span>
            </BetActionButton>
        </div>
    );
};
