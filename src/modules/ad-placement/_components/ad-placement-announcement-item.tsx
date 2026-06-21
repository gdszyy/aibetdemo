'use client';

import type { FC } from 'react';
import { AdPlacementJumpType, type TopAnnouncementAdPlacement } from '@/api/models/ad-placement';
import { cn } from '@/utils/common';

interface AdPlacementAnnouncementItemProps {
    item: TopAnnouncementAdPlacement;
    onNavigate: (item: TopAnnouncementAdPlacement) => void;
    className?: string;
    truncate?: boolean;
}

/**
 * 单条顶部公告。
 *
 * 有有效 jump_target 时渲染为 button 并允许跳转；无跳转时渲染为 span，
 * 避免只展示公告也出现可点击状态。
 */
export const AdPlacementAnnouncementItem: FC<AdPlacementAnnouncementItemProps> = ({
    item,
    onNavigate,
    className,
    truncate = true,
}) => {
    const canNavigate = item.data.jump_type !== AdPlacementJumpType.None && Boolean(item.data.jump_target);
    const itemClassName = cn(
        'shrink-0 text-left text-body-md text-filltext-ft-h',
        truncate ? 'truncate' : 'whitespace-nowrap',
        canNavigate && 'cursor-pointer',
        className,
    );
    const content = item.data.notice_text ?? item.data.text ?? item.activity_name;

    if (canNavigate) {
        return (
            <button type="button" className={itemClassName} onClick={() => onNavigate(item)}>
                {content}
            </button>
        );
    }

    return <span className={itemClassName}>{content}</span>;
};
