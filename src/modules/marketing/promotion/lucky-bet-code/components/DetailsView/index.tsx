import Image, { type StaticImageData } from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { FC } from 'react';
import { ClockOutlined } from '@/components/icons2/ClockOutlined';
import { regionConfigs, useRegionCode } from '@/i18nV2';
import CasinoIcon from '../../assets/casino-icon.png';
import DetailBackground from '../../assets/detail-bg.png';
import CasinoRewardImage from '../../assets/detail-casino-card.png';
import SportsRewardImage from '../../assets/detailsports-card.png';
import Sportsicon from '../../assets/sprts-icon.png';
import { getLuckyBetCodeTimeRange } from '../../constants';

interface RewardCardProps {
    /** 奖励卡标题。 */
    title: string;
    /** 奖励卡说明。 */
    description: string;
    /** 符合资格用户可获得的奖励提示。 */
    eligibleUsers: string;
    /** 幸运数字奖励图。 */
    rewardImage: StaticImageData;
    /** 奖励规则列表。 */
    rewardItems: string[];
    /** 奖励卡类型。 */
    variant: 'sport' | 'casino';
}

/** 幸运投注码单类奖励说明卡。 */
const RewardCard: FC<RewardCardProps> = ({ title, description, eligibleUsers, rewardImage, rewardItems, variant }) => {
    return (
        <article className="overflow-hidden rounded-md border-[0.5px] border-[#FF0003] bg-surface-1">
            <div className="flex items-center px-4 py-2 gap-2 bg-brand-primary-5 text-body-lg text-neutral-white-h">
                <Image
                    src={variant === 'sport' ? Sportsicon : CasinoIcon}
                    alt={variant === 'sport' ? 'Sports icon' : 'Casino icon'}
                    className="size-9 shrink-0"
                    width={36}
                    height={36}
                />
                <h3>{title}</h3>
            </div>
            <div className="flex flex-col gap-2 px-4 py-2">
                <p className="text-auxiliary-sm font-poppins text-filltext-ft-g">{description}</p>
                <Image
                    src={rewardImage}
                    alt={title}
                    sizes="(max-width: 767px) calc(100vw - 64px), 45vw"
                    className="h-auto w-full rounded-sm"
                />
                <div className="flex flex-col gap-1">
                    <p className="text-auxiliary-sm font-poppins text-filltext-ft-g">{eligibleUsers}</p>
                    <ul className="list-disc pl-4 text-auxiliary-md text-filltext-ft-h">
                        {rewardItems.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </article>
    );
};

/** 幸运投注码活动详情与奖励区域。 */
export const DetailsView: FC = () => {
    const t = useTranslations('promotionLuckyBetCode');
    const locale = useLocale();
    const regionCode = useRegionCode();
    const { startTimestamp, endTimestamp } = getLuckyBetCodeTimeRange(regionCode);
    const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
        timeZone: regionConfigs[regionCode].timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
    const sportsRewardItems = [
        t('details.sports.rewards.item1'),
        t('details.sports.rewards.item2'),
        t('details.sports.rewards.item3'),
        t('details.sports.rewards.item4'),
    ];
    const casinoRewardItems = [t('details.casino.rewards.item1'), t('details.casino.rewards.item2')];

    return (
        <section className="relative overflow-hidden rounded-md">
            <Image src={DetailBackground} alt="" fill sizes="100vw" className="object-cover" />
            <div className="relative flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-2 text-neutral-white-h">
                    <div>
                        <h2 className="font-racing-sans-one text-title-sm leading-4 font-normal">
                            {t('details.title')}
                        </h2>
                        <p className="text-auxiliary-xs font-poppins text-neutral-white-h">
                            {t('details.description')}
                        </p>
                    </div>
                    <div className="mt-2 flex items-center gap-0.5 text-auxiliary-sm text-neutral-white-f">
                        <ClockOutlined className="size-4 shrink-0" />
                        <span>
                            {t('details.period', {
                                startTime: dateTimeFormatter.format(new Date(startTimestamp)),
                                endTime: dateTimeFormatter.format(new Date(endTimestamp)),
                            })}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <RewardCard
                        variant="sport"
                        title={t('details.sports.title')}
                        description={t('details.sports.description')}
                        eligibleUsers={t('details.sports.eligibleUsers')}
                        rewardImage={SportsRewardImage}
                        rewardItems={sportsRewardItems}
                    />
                    <RewardCard
                        variant="casino"
                        title={t('details.casino.title')}
                        description={t('details.casino.description')}
                        eligibleUsers={t('details.casino.eligibleUsers')}
                        rewardImage={CasinoRewardImage}
                        rewardItems={casinoRewardItems}
                    />
                </div>
            </div>
        </section>
    );
};
