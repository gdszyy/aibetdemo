'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDeepCompareEffect } from 'ahooks';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { GetMenuTournamentsInterface } from '@/api/handlers/menu';
import { Arrow } from '@/components/Arrow';
import { Collapsible, CollapsibleContent } from '@/components/collapsible/collapsible';
import { Loading } from '@/components/loading/loading';
import { ConditionalTooltip } from '@/components/tooltip';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { cn } from '@/utils/common';
import { TournamentItem } from './components/tournament-item';
import type { CategoryNode } from './service/node';
import { useTreeStore } from './service/store';

export interface CategoryItemProps {
    categoryNode: CategoryNode;
    isOpen: boolean;
    onToggle: () => void;
}

// TODO 简单的菜单，写这么复杂！！！需要简化
export const CategoryItem: FC<CategoryItemProps> = ({ categoryNode: categoryNodeProp, isOpen, onToggle }) => {
    const t = useTranslations('common');
    const tHome = useTranslations('home');
    const setTournamentData = useTreeStore((state) => state.setTournamentData);
    // Get the latest categoryNode instance from the store to ensure correct rendering after children update
    const categoryNode = useTreeStore(
        (state) => (state.root.findNode(categoryNodeProp.key) as CategoryNode) ?? categoryNodeProp,
    );
    const activeTournamentId = useTreeStore((state) => state.activeTournamentId);
    // Determine active state from URL: show active when the selected tournament belongs to this category
    const params = useParams<{ tournament_id: string }>();
    const selectedTournamentId = params.tournament_id ? decodeURIComponent(params.tournament_id) : activeTournamentId;
    const isActive = selectedTournamentId
        ? categoryNode.children.some((child) => child.tournament_id === selectedTournamentId)
        : false;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['menuTournaments', categoryNode.sport_id, categoryNode.category_id],
        queryFn: async ({ pageParam }) => {
            return GetMenuTournamentsInterface({
                sport_id: categoryNode.sport_id,
                cate_id: categoryNode.category_id,
                start_id: pageParam,
            });
        },
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => {
            if (lastPage.length < 20) {
                return undefined;
            }
            const lastItem = lastPage[lastPage.length - 1];
            return lastItem?.id;
        },
        enabled: isOpen,
    });

    // Merge data from all pages and update the store
    useDeepCompareEffect(() => {
        if (!data?.pages) {
            return;
        }
        const pages = data.pages;
        const allTournaments = pages.flat();
        setTournamentData(categoryNode.key, allTournaments);
    }, [data, setTournamentData, categoryNode.key]);

    const { sentinelRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

    return (
        <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
            <div
                className={cn(
                    // 未展开+未选中：默认、悬浮、点击
                    // 整行背景色
                    [
                        'data-[open=false]:data-[active=false]:[--row-bg:transparent]',
                        'data-[open=false]:data-[active=false]:hover:[--row-bg:var(--filltext-ft-c)]',
                    ].join(' '),
                    // 文本色
                    [
                        'data-[open=false]:data-[active=false]:[--text-color:var(--filltext-ft-g)]',
                        'data-[open=false]:data-[active=false]:hover:[--text-color:var(--filltext-ft-g)]',
                    ].join(' '),
                    // 方向图标背景色
                    [
                        'data-[open=false]:data-[active=false]:[--arrow-bg:transparent]',
                        'data-[open=false]:data-[active=false]:hover:[--arrow-bg:var(--filltext-ft-a)]',
                    ].join(' '),
                    // 方向图标颜色
                    [
                        'data-[open=false]:data-[active=false]:[--arrow-color:var(--filltext-ft-e)]',
                        'data-[open=false]:data-[active=false]:hover:[--arrow-color:var(--brand-primary-0)]',
                    ].join(' '),

                    // 未展开+选中：默认、悬浮、点击
                    // 整行背景色
                    [
                        'data-[open=false]:data-[active=true]:[--row-bg:var(--surface-1)]',
                        'data-[open=false]:data-[active=true]:hover:[--row-bg:var(--surface-1)]',
                    ].join(' '),
                    // 文本色
                    [
                        'data-[open=false]:data-[active=true]:[--text-color:var(--brand-primary-0)]',
                        'data-[open=false]:data-[active=true]:hover:[--text-color:var(--brand-primary-0)]',
                    ].join(' '),
                    // 方向图标背景色
                    [
                        'data-[open=false]:data-[active=true]:[--arrow-bg:var(--filltext-ft-a)]',
                        'data-[open=false]:data-[active=true]:hover:[--arrow-bg:var(--filltext-ft-a)]',
                    ].join(' '),
                    // 方向图标颜色
                    [
                        'data-[open=false]:data-[active=true]:[--arrow-color:var(--filltext-ft-g)]',
                        'data-[open=false]:data-[active=true]:hover:[--arrow-color:var(--brand-primary-0)]',
                    ].join(' '),

                    // 展开+未选中：默认、悬浮、点击
                    // 整行背景色
                    [
                        'data-[open=true]:data-[active=false]:[--row-bg:var(--filltext-ft-c)]',
                        'data-[open=true]:data-[active=false]:hover:[--row-bg:var(--filltext-ft-c)]',
                    ].join(' '),
                    // 文本色
                    [
                        'data-[open=true]:data-[active=false]:[--text-color:var(--filltext-ft-g)]',
                        'data-[open=true]:data-[active=false]:hover:[--text-color:var(--filltext-ft-g)]',
                    ].join(' '),
                    // 方向图标背景色
                    [
                        'data-[open=true]:data-[active=false]:[--arrow-bg:var(--filltext-ft-a)]',
                        'data-[open=true]:data-[active=false]:hover:[--arrow-bg:var(--filltext-ft-a)]',
                    ].join(' '),
                    // 方向图标颜色
                    [
                        'data-[open=true]:data-[active=false]:[--arrow-color:var(--filltext-ft-g)]',
                        'data-[open=true]:data-[active=false]:hover:[--arrow-color:var(--brand-primary-0)]',
                    ].join(' '),

                    // 展开+选中：默认、悬浮、点击
                    // 整行背景色
                    [
                        'data-[open=true]:data-[active=true]:[--row-bg:var(--surface-1)]',
                        'data-[open=true]:data-[active=true]:hover:[--row-bg:var(--surface-1)]',
                    ].join(' '),
                    // 文本色
                    [
                        'data-[open=true]:data-[active=true]:[--text-color:var(--brand-primary-0)]',
                        'data-[open=true]:data-[active=true]:hover:[--text-color:var(--brand-primary-0)]',
                    ].join(' '),
                    // 方向图标背景色
                    [
                        'data-[open=true]:data-[active=true]:[--arrow-bg:var(--filltext-ft-a)]',
                        'data-[open=true]:data-[active=true]:hover:[--arrow-bg:var(--filltext-ft-a)]',
                    ].join(' '),
                    // 方向图标颜色
                    [
                        'data-[open=true]:data-[active=true]:[--arrow-color:var(--filltext-ft-g)]',
                        'data-[open=true]:data-[active=true]:hover:[--arrow-color:var(--brand-primary-0)]',
                    ].join(' '),

                    'w-full h-10 flex items-center justify-between',
                    'p-2 rounded-sm',
                    'bg-(--row-bg)',
                )}
                data-active={isActive}
                data-open={isOpen}
            >
                <button
                    type="button"
                    onClick={onToggle}
                    className={cn('flex-auto min-w-0 h-full flex items-center gap-x-2 cursor-pointer')}
                >
                    <div className="size-6 shrink-0 rounded-[2px] bg-filltext-ft-c flex items-center justify-center text-[10px] font-bold text-filltext-ft-e uppercase">
                        {categoryNode.name[0]}
                    </div>
                    <ConditionalTooltip content={categoryNode.name} side="right">
                        <span className={cn('text-body-lg flex-auto truncate text-left text-(--text-color)')}>
                            {categoryNode.name}
                        </span>
                    </ConditionalTooltip>
                </button>

                <button
                    type="button"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onToggle();
                    }}
                    className={cn('size-5 flex items-center justify-center rounded cursor-pointer bg-(--arrow-bg)')}
                >
                    <Arrow
                        className={cn('w-3 h-3 transition-transform text-(--arrow-color)')}
                        direction={isOpen ? 'up' : 'down'}
                    />
                </button>
            </div>

            <CollapsibleContent>
                <div className="flex flex-col pl-2 mt-1">
                    {isLoading && (
                        <div className="h-20 flex items-center justify-center">
                            <Loading className="h-5 w-5" variant="color-red" />
                        </div>
                    )}

                    {!isLoading && categoryNode.children.length > 0 && (
                        <div className="flex flex-col">
                            {categoryNode.children.map((child) => (
                                <TournamentItem key={`${child.id}-${child.tournament_id}`} tournamentNode={child} />
                            ))}
                        </div>
                    )}

                    {!isLoading && hasNextPage && (
                        <div
                            ref={sentinelRef}
                            className="h-10 flex items-center justify-center text-filltext-ft-f text-sm"
                        >
                            {isFetchingNextPage ? (
                                <Loading className="h-4 w-4" variant="color-red" />
                            ) : (
                                t('list.loadMore')
                            )}
                        </div>
                    )}

                    {!isLoading &&
                        !hasNextPage &&
                        categoryNode.children.length > 0 &&
                        (data?.pages?.length ?? 0) > 1 && (
                            <div className="h-8 flex items-center justify-center px-2">
                                <span className="text-sm text-filltext-ft-e">{tHome('noMore.tournaments')}</span>
                            </div>
                        )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
