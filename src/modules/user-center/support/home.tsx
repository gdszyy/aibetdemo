'use client';

import { useQuery } from '@tanstack/react-query';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { GetSupportPhoneInterface } from '@/api/handlers/support';
import onlineCallDefault from '@/assets/images/online-call.png';
import onlineCallChosen from '@/assets/images/online-call-chosen.png';
import onlineCallDisabled from '@/assets/images/online-call-disabled.png';
import onlineCallHover from '@/assets/images/online-call-hover.png';
import livechatDefault from '@/assets/images/support-livechat.png';
import livechatChosen from '@/assets/images/support-livechat-chosen.png';
import livechatDisabled from '@/assets/images/support-livechat-disabled.png';
import livechatHover from '@/assets/images/support-livechat-hover.png';
import vipDefault from '@/assets/images/vip.png';
import vipChosen from '@/assets/images/vip-chosen.png';
import vipDisabled from '@/assets/images/vip-disabled.png';
import vipHover from '@/assets/images/vip-hover.png';
import { Loading } from '@/components/loading/loading';
import { Toast } from '@/components/toast';
import { useLiveChatSession } from '@/hooks/use-live-chat-session';
import { useIsMobile } from '@/hooks/use-media-query';
import type { TranslationKey } from '@/i18nV2/types';
import { cn } from '@/utils/common';
import { CopyUserId } from './components/CopyUserId';
import { OnlineCall } from './online';
import { VipSupport } from './vip';

/** 个人中心客服入口类型。 */
enum SupportType {
    LiveChat = 'liveChat',
    OnlineCall = 'onlineCall',
    VipSupport = 'vipSupport',
}

/** 会在当前页面内展示内容面板的客服类型，LiveChat 只作为外部打开动作。 */
type SupportPanelType = SupportType.OnlineCall | SupportType.VipSupport;

/** 客服入口不同交互状态的图片资源。 */
interface IconSet {
    default: StaticImageData;
    hover: StaticImageData;
    chosen: StaticImageData;
    disabled: StaticImageData;
}

const iconMap: Record<SupportType, IconSet> = {
    [SupportType.LiveChat]: {
        default: livechatDefault,
        hover: livechatHover,
        chosen: livechatChosen,
        disabled: livechatDisabled,
    },
    [SupportType.OnlineCall]: {
        default: onlineCallDefault,
        hover: onlineCallHover,
        chosen: onlineCallChosen,
        disabled: onlineCallDisabled,
    },
    [SupportType.VipSupport]: {
        default: vipDefault,
        hover: vipHover,
        chosen: vipChosen,
        disabled: vipDisabled,
    },
};

const supportOptions = [
    { type: SupportType.LiveChat, labelKey: 'support.liveChat' },
    { type: SupportType.OnlineCall, labelKey: 'support.onlineCall' },
    { type: SupportType.VipSupport, labelKey: 'support.vipSupport' },
] as const;

/** 客服入口按钮参数。 */
interface SupportOptionButtonProps {
    type: SupportType;
    labelKey: TranslationKey<'user'>;
    isSelected: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    onClick: (type: SupportType) => void;
}

/** 客服入口按钮：用于选择站内支持内容，或触发 LiveChat 打开动作。 */
const SupportOptionButton: FC<SupportOptionButtonProps> = ({
    type,
    labelKey,
    isSelected,
    isDisabled = false,
    isLoading = false,
    onClick,
}) => {
    const t = useTranslations('user');
    const [isHovered, setIsHovered] = useState(false);

    const icons = iconMap[type];
    const isActive = isSelected || isLoading;
    const iconSrc = isDisabled ? icons.disabled : isActive ? icons.chosen : isHovered ? icons.hover : icons.default;

    const labelColor = isDisabled
        ? 'text-func-void'
        : isActive || isHovered
          ? 'text-filltext-ft-g'
          : 'text-filltext-ft-f';

    return (
        <button
            type="button"
            onClick={() => onClick(type)}
            disabled={isDisabled || isLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 px-4 py-2',
                'rounded-sm transition-colors bg-surface-1',
                isDisabled ? 'cursor-not-allowed' : isLoading ? 'cursor-wait' : 'cursor-pointer',
                (isActive || isHovered) && !isDisabled && 'text-brand-primary-0',
            )}
        >
            {isLoading ? (
                <span className="flex size-10 items-center justify-center">
                    <Loading className="size-6" variant="color-red" />
                </span>
            ) : (
                <Image src={iconSrc} alt={t(labelKey)} width={40} height={40} className="size-10" />
            )}
            <span className={cn('text-xs font-semibold leading-3.5 transition-colors', labelColor)}>{t(labelKey)}</span>
        </button>
    );
};

/** 个人中心客服首页：Chat 直接打开第三方 LiveChat，电话/VIP 保持站内内容面板。 */
export const SupportHome: FC = () => {
    const t = useTranslations('user');

    const isMobile = useIsMobile();
    const { isAvailable: isLiveChatAvailable, openLiveChat } = useLiveChatSession();

    const [selectedType, setSelectedType] = useState<SupportPanelType>(SupportType.OnlineCall);
    const [isOpeningLiveChat, setIsOpeningLiveChat] = useState(false);

    const { data: phoneData, isLoading } = useQuery({
        queryKey: ['support', 'phone'],
        queryFn: GetSupportPhoneInterface,
    });

    const isOnlineCallDisabled = !isLoading && !phoneData?.ref_number;

    useEffect(() => {
        if (selectedType === SupportType.OnlineCall && isOnlineCallDisabled) {
            setSelectedType(SupportType.VipSupport);
        }
    }, [isOnlineCallDisabled, selectedType]);

    const handleLiveChatClick = (): void => {
        if (isOpeningLiveChat) return;

        if (!isLiveChatAvailable) {
            Toast.error(t('support.liveChatUnavailable'), { id: 'support-live-chat' });
            return;
        }

        setIsOpeningLiveChat(true);
        openLiveChat()
            .then((didOpen) => {
                if (!didOpen) {
                    Toast.error(t('support.liveChatUnavailable'), { id: 'support-live-chat' });
                }
            })
            .catch((error: unknown) => {
                if (process.env.NODE_ENV === 'development') {
                    console.error('[LiveChat] open failed', error);
                }
                Toast.error(t('support.liveChatUnavailable'), { id: 'support-live-chat' });
            })
            .finally(() => {
                setIsOpeningLiveChat(false);
            });
    };

    const handleSupportClick = (type: SupportType): void => {
        if (type === SupportType.LiveChat) {
            handleLiveChatClick();
            return;
        }

        if (type === SupportType.OnlineCall && isOnlineCallDisabled) return;

        setSelectedType(type);
    };

    return (
        <div className="flex h-full flex-col gap-4">
            {isMobile ? (
                <div className="relative flex items-center justify-end">
                    <CopyUserId className="" />
                </div>
            ) : (
                <div className="relative">
                    <CopyUserId className="absolute right-0 -top-12" />
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {supportOptions.map(({ type, labelKey }) => (
                    <SupportOptionButton
                        key={type}
                        type={type}
                        labelKey={labelKey}
                        isSelected={type !== SupportType.LiveChat && selectedType === type}
                        isDisabled={type === SupportType.OnlineCall && isOnlineCallDisabled}
                        isLoading={type === SupportType.LiveChat && isOpeningLiveChat}
                        onClick={handleSupportClick}
                    />
                ))}
            </div>

            <div className="min-h-0 flex-1">
                {selectedType === SupportType.OnlineCall && <OnlineCall />}
                {selectedType === SupportType.VipSupport && <VipSupport />}
            </div>
        </div>
    );
};
