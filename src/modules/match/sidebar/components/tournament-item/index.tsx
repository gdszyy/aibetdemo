'use client';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { CupFilled } from '@/components/icons';
import { ConditionalTooltip } from '@/components/tooltip';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';
import { useLiveStatusSuffix } from '../../../_hooks/use-live-status-suffix';
import type { TournamentNode } from '../../service/node';
import { useTreeStore } from '../../service/store';
import imageHot from './assets/hot.gif';

interface TournamentItemProps {
    tournamentNode: TournamentNode;
}

export const TournamentItem: FC<TournamentItemProps> = ({ tournamentNode }) => {
    const params = useParams<{ tournament_id: string }>();
    const liveStatusSuffix = useLiveStatusSuffix();
    const activeTournamentId = useTreeStore((state) => state.activeTournamentId);
    const selectedTournamentId = params.tournament_id ? decodeURIComponent(params.tournament_id) : activeTournamentId;
    const isActive = selectedTournamentId === tournamentNode.tournament_id;

    // 是否热门联赛
    const isTop = tournamentNode.is_top;

    return (
        <Link
            href={`/leagues/${tournamentNode.tournament_id}${liveStatusSuffix}`}
            prefetch
            className={cn(
                // 未选中
                // 背景色
                [
                    'data-[active=false]:[--row-bg:transparent]',
                    'data-[active=false]:hover:[--row-bg:var(--filltext-ft-c)]',
                ].join(' '),
                // 文字颜色
                [
                    'data-[active=false]:[--text-color:var(--filltext-ft-g)]',
                    'data-[active=false]:hover:[--text-color:var(--filltext-ft-g)]',
                ].join(' '),

                // 选中
                // 背景色
                ['data-[active=true]:[--row-bg:var(--surface-1)]'].join(' '),
                // 文字颜色
                ['data-[active=true]:[--text-color:var(--brand-primary-0)]'].join(' '),

                'group/league relative flex h-10 w-full items-center justify-between p-2 text-body-lg cursor-pointer transition-colors',
                'bg-(--row-bg)',
            )}
            data-active={isActive}
            data-top={isTop}
        >
            {/* Left: icon + name */}
            <div className="flex h-full min-w-0 flex-1 items-center">
                {isTop && <Image className="size-4 object-cover" src={imageHot} alt="" />}
                <div className="mr-1 relative size-6 shrink-0 inline-flex items-center justify-center">
                    <CupFilled className="absolute inset-0 size-full text-filltext-ft-c" />
                    <span className="relative text-[10px] font-bold text-filltext-ft-e uppercase leading-none -translate-y-0.5">
                        {tournamentNode.name[0]}
                    </span>
                </div>
                <ConditionalTooltip content={tournamentNode.name} side="right">
                    <span className={cn('text-body-lg min-w-0 flex-1 truncate', 'text-(--text-color)')}>
                        {tournamentNode.name}
                    </span>
                </ConditionalTooltip>
            </div>
        </Link>
    );
};
