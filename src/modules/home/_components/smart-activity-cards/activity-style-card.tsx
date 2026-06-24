'use client';

import type { FC } from 'react';
import { CupOutlined } from '@/components/icons2/CupOutlined';
import { PromoParlayBoostMinLightning } from '@/components/icons2/PromoParlayBoostMinLightning';
import { PromotionOutlined } from '@/components/icons2/PromotionOutlined';
import type { ThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { cn } from '@/utils/common';
import type { SmartActivityCardSkin } from './card-skin';
import type { ActivityStyleItem, ActivityVisualVariant } from './types';

interface ActivityStyleCardProps {
    item: ActivityStyleItem;
    skin: SmartActivityCardSkin;
    componentProfile: ThemeComponentProfile;
}

const VARIANT_META: Record<
    ActivityVisualVariant,
    {
        icon: typeof PromotionOutlined;
        rootClassName: string;
        accentClassName: string;
    }
> = {
    poster: {
        icon: PromoParlayBoostMinLightning,
        rootClassName: 'min-h-[154px] md:col-span-2',
        accentClassName: 'h-1.5 w-16 rounded-full',
    },
    ticket: {
        icon: PromotionOutlined,
        rootClassName: 'min-h-[154px]',
        accentClassName: 'h-10 w-1 rounded-full',
    },
    offer: {
        icon: PromotionOutlined,
        rootClassName: 'min-h-[154px]',
        accentClassName: 'h-10 w-1 rounded-full',
    },
    sheet: {
        icon: PromoParlayBoostMinLightning,
        rootClassName: 'min-h-[154px]',
        accentClassName: 'h-10 w-1 rounded-full',
    },
    crest: {
        icon: CupOutlined,
        rootClassName: 'min-h-[154px]',
        accentClassName: 'size-10 rounded-full',
    },
    mission: {
        icon: CupOutlined,
        rootClassName: 'min-h-[154px] md:col-span-2',
        accentClassName: 'h-1.5 w-full rounded-full',
    },
};

const getVariantStyle = (variant: ActivityVisualVariant, skin: SmartActivityCardSkin) => {
    if (variant === 'ticket' || variant === 'offer') return skin.ticketStyle;
    if (variant === 'sheet' || variant === 'mission') return skin.marketStyle;
    return skin.heroStyle;
};

/** 首页活动卡片样式展示单元。 */
export const ActivityStyleCard: FC<ActivityStyleCardProps> = ({ componentProfile, item, skin }) => {
    const meta = VARIANT_META[item.variant];
    const activityProfile = componentProfile.activityCards;
    const Icon = meta.icon;
    const hasVisualImage = Boolean(item.visualImage);

    return (
        <article
            className={cn(
                skin.cardClassName,
                'relative flex overflow-hidden p-2.5 transition-[background-color,border-color,transform]',
                meta.rootClassName,
                'min-h-[var(--component-smart-card-min-height,154px)]',
                activityProfile.layout === 'ticket-hub' && 'md:col-span-1',
                activityProfile.interaction === 'promo-lift' && 'hover:-translate-y-0.5',
                activityProfile.interaction === 'ticket-focus' && 'hover:border-[color:var(--brand-primary-0)]',
                activityProfile.interaction === 'board-hover' && 'hover:border-[color:var(--brand-primary-0)]',
            )}
            data-smart-activity-card-profile={activityProfile.profile}
            data-smart-activity-card-density={activityProfile.cardDensity}
            style={{ ...componentProfile.style, ...getVariantStyle(item.variant, skin) }}
        >
            {item.visualImage ? (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${item.visualImage.src})`,
                            backgroundPosition: item.visualPosition,
                        }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,20,0.9)_0%,rgba(7,11,20,0.72)_48%,rgba(7,11,20,0.22)_100%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.24)_100%)]" />
                </>
            ) : null}
            <div className="relative z-1 flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <div
                            className={cn(
                                'mb-1.5 text-auxiliary-xs font-bold uppercase',
                                hasVisualImage ? 'text-white/78' : 'text-[var(--brand-primary-0)]',
                            )}
                        >
                            {item.eyebrow}
                        </div>
                        <h3
                            className={cn(
                                'line-clamp-2 text-title-md font-bold',
                                hasVisualImage ? 'text-white' : 'text-content-primary',
                            )}
                        >
                            {item.title}
                        </h3>
                        <p
                            className={cn(
                                'mt-1 line-clamp-2 text-body-sm',
                                hasVisualImage ? 'text-white/76' : skin.mutedTextClassName,
                            )}
                        >
                            {item.description}
                        </p>
                    </div>
                    <div
                        className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))]',
                            hasVisualImage
                                ? 'border border-white/18 bg-white/14 text-white backdrop-blur-[2px]'
                                : 'bg-[var(--brand-odds-bg,var(--surface-2))] text-[var(--brand-primary-0)]',
                        )}
                    >
                        <Icon className="size-5" />
                    </div>
                </div>

                <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                        <div
                            className={cn(
                                'text-title-lg font-black',
                                hasVisualImage ? 'text-white' : 'text-content-primary',
                            )}
                        >
                            {item.metric}
                        </div>
                        <div
                            className={cn(
                                'truncate text-auxiliary-xs',
                                hasVisualImage ? 'text-white/72' : skin.mutedTextClassName,
                            )}
                        >
                            {item.action}
                        </div>
                    </div>
                    <span
                        className={meta.accentClassName}
                        style={hasVisualImage ? { background: 'rgba(255, 255, 255, 0.9)' } : skin.accentStyle}
                    />
                </div>
            </div>
        </article>
    );
};
