'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useDeepCompareEffect } from 'ahooks';
import { useTranslations } from 'next-intl';
import { type FC, memo, useEffect, useState } from 'react';
import { GetMenuCategoriesInterface, GetMenuHotTournamentsInterface } from '@/api/handlers/menu';
import { Arrow } from '@/components/Arrow';
import { Collapsible, CollapsibleContent } from '@/components/collapsible/collapsible';
import { Loading } from '@/components/loading/loading';
import { useSidebar } from '@/components/sidebar';
import { Toast } from '@/components/toast';
import { ConditionalTooltip } from '@/components/tooltip';
import { getSportConfig } from '@/constants/sports-config';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Link } from '@/i18n';
import { useSportNavMode } from '@/stores/layout-experiment-store';
import { cn } from '@/utils/common';
import { useLiveStatusSuffix } from '../_hooks/use-live-status-suffix';
import { CategoryItem } from './category-item';
import { TournamentItem } from './components/tournament-item';
import { HotTournamentTitle } from './hot-tournament-title';
import type { SportNode } from './service/node';
import { useTreeStore } from './service/store';

// TODO 简单的菜单，写这么复杂！！！需要简化

export interface SportItemProps {
    sportNode: SportNode;
    isOpen: boolean;
    isActive: boolean;
    isChildActive: boolean;
    onToggleOpen: () => void;
}

export const SportItem: FC<SportItemProps> = memo(({ sportNode, isOpen, isActive, isChildActive, onToggleOpen }) => {
    const { state } = useSidebar();
    const collapsed = state === 'collapsed';
    const navMode = useSportNavMode();
    const t = useTranslations('common');
    const tHome = useTranslations('home');
    const liveStatusSuffix = useLiveStatusSuffix();
    const setCategoryAndTournament = useTreeStore((state) => state.setCategoryAndTournament);
    const [openedCategoryKey, setOpenedCategoryKey] = useState<string | null>(null);
    const sportConfig = getSportConfig(sportNode.sport_id);
    const { icon: Icon } = sportConfig ?? {};

    const { data: hotTournaments = [] } = useQuery({
        queryKey: ['menuTournaments', 'hot', sportNode.sport_id],
        queryFn: () => {
            return GetMenuHotTournamentsInterface({
                sport_id: sportNode.sport_id,
            }).then((res) => {
                return res.map((v) => ({ ...v, is_top: true }));
            });
        },
        enabled: isOpen && !collapsed && !sportNode.isComingSoon,
        placeholderData: [],
    });

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useInfiniteQuery({
        queryKey: ['menuCategories', sportNode.sport_id],
        queryFn: async ({ pageParam }) => {
            return GetMenuCategoriesInterface({
                sport_id: sportNode.sport_id,
                start_id: pageParam,
            });
        },
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => {
            // Check if there is more data
            const totalItems = lastPage.length;
            if (totalItems < 20) {
                return undefined;
            }
            // Return the id of the last category or match
            const lastCategory = lastPage[lastPage.length - 1];
            return lastCategory?.id;
        },
        enabled: isOpen && !collapsed && !sportNode.isComingSoon,
        refetchOnMount: 'always',
    });

    // Merge data from all pages and update the store
    useEffect(() => {
        if (isOpen && !collapsed && !sportNode.isComingSoon && !data) {
            refetch();
        }
    }, [isOpen, collapsed, sportNode.isComingSoon, data, refetch]);

    useDeepCompareEffect(() => {
        if (!data?.pages) {
            return;
        }
        const pages = data.pages;

        // Merge data from all pages
        const allCategories = pages.flat();
        setCategoryAndTournament(sportNode.key, allCategories, hotTournaments);
    }, [data?.pages, hotTournaments, setCategoryAndTournament, sportNode.key]);

    useEffect(() => {
        if (!isOpen) {
            setOpenedCategoryKey(null);
        }
    }, [isOpen]);

    const { sentinelRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

    // ============================================
    // Conditional Rendering (After all hooks)
    // ============================================

    // 收缩的菜单
    if (collapsed) {
        return (
            <div key="collapsed">
                <Link
                    href={`/sports/${sportNode.sport_id}${liveStatusSuffix}`}
                    className={cn(
                        // 未选中
                        // 背景色
                        [
                            'data-[active=false]:[--row-bg:transparent]',
                            'data-[active=false]:hover:[--row-bg:var(--interactive-row-hover-bg)]',
                        ].join(' '),
                        // 运动图标色
                        [
                            'data-[active=false]:[--icon-color:var(--interactive-row-icon)]',
                            'data-[active=false]:hover:[--icon-color:var(--interactive-row-hover-icon)]',
                        ].join(' '),

                        // 选中
                        // 背景色
                        ['data-[active=true]:[--row-bg:var(--interactive-row-active-bg)]'].join(' '),
                        // 运动图标色
                        [
                            'data-[active=true]:[--icon-color:var(--interactive-row-active-icon)]',
                            'data-[active=true]:hover:[--icon-color:var(--interactive-row-active-icon)]',
                        ].join(' '),

                        "data-[active=true]:before:content-[''] data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1.5 data-[active=true]:before:bottom-1.5 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-r-sm",
                        'data-[active=true]:before:[background:var(--interactive-active-rail-bg)] data-[active=true]:before:[box-shadow:var(--interactive-active-rail-shadow)]',
                        'relative flex items-center justify-center size-10 rounded-sm',
                        'bg-(--row-bg)',
                    )}
                    data-active={isActive || isChildActive}
                >
                    {Icon && <Icon className={cn('size-5 text-(--icon-color)')} />}
                </Link>
            </div>
        );
    }

    // betbus 专题页导航形态：侧栏运动行降级为纯一级 Link（图标 + 名称 → 运动专题页），
    // 竞赛树改由运动专题页正文承载，侧栏不再原地展开三级树（运动 → 类别 → 赛事）。
    if (navMode === 'topic') {
        return (
            <Link
                href={`/sports/${sportNode.sport_id}${liveStatusSuffix}`}
                onClick={() => {
                    if (sportNode.isComingSoon) {
                        Toast.info(t('message.coming'), { id: 'coming-soon', duration: 650 });
                    }
                }}
                className={cn(
                    'data-[active=false]:[--row-bg:transparent]',
                    'data-[active=false]:hover:[--row-bg:var(--interactive-row-hover-bg)]',
                    'data-[active=false]:[--text-color:var(--interactive-row-text)]',
                    'data-[active=false]:hover:[--text-color:var(--interactive-row-hover-text)]',
                    'data-[active=false]:[--icon-color:var(--interactive-row-icon)]',
                    'data-[active=false]:hover:[--icon-color:var(--interactive-row-hover-icon)]',
                    'data-[active=true]:[--row-bg:var(--interactive-row-active-bg)]',
                    'data-[active=true]:[--text-color:var(--interactive-row-active-text)]',
                    'data-[active=true]:[--icon-color:var(--interactive-row-active-icon)]',
                    "data-[active=true]:before:content-[''] data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1.5 data-[active=true]:before:bottom-1.5 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-r-sm",
                    'data-[active=true]:before:[background:var(--interactive-active-rail-bg)] data-[active=true]:before:[box-shadow:var(--interactive-active-rail-shadow)]',
                    'relative w-full h-11 flex items-center gap-x-2 px-3 py-0 rounded-none bg-(--row-bg)',
                )}
                data-active={isActive || isChildActive}
            >
                <div className="size-6 inline-flex justify-center items-center">
                    {Icon && <Icon className={cn('size-5 text-(--icon-color)')} />}
                </div>
                <ConditionalTooltip content={sportNode.name} side="right">
                    <span className={cn('text-body-md flex-auto truncate text-left text-(--text-color)')}>
                        {sportNode.name}
                    </span>
                </ConditionalTooltip>
            </Link>
        );
    }

    const onExpandToggleClick = () => {
        if (sportNode.isComingSoon) {
            Toast.info(t('message.coming'), { id: 'coming-soon', duration: 650 });
            return;
        }
        onToggleOpen();
    };

    return (
        <Collapsible open={isOpen} onOpenChange={onExpandToggleClick} className="w-full">
            <div
                className={cn(
                    // 未展开+未选中：默认、悬浮、点击
                    // 整行背景色
                    [
                        'data-[open=false]:data-[active=false]:[--row-bg:transparent]',
                        'data-[open=false]:data-[active=false]:hover:[--row-bg:var(--interactive-row-hover-bg)]',
                    ].join(' '),
                    // 文本色
                    [
                        'data-[open=false]:data-[active=false]:[--text-color:var(--interactive-row-text)]',
                        'data-[open=false]:data-[active=false]:hover:[--text-color:var(--interactive-row-hover-text)]',
                    ].join(' '),
                    // 运动图标色
                    [
                        'data-[open=false]:data-[active=false]:[--icon-color:var(--interactive-row-icon)]',
                        'data-[open=false]:data-[active=false]:hover:[--icon-color:var(--interactive-row-hover-icon)]',
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
                        'data-[open=false]:data-[active=true]:[--row-bg:var(--interactive-row-active-bg)]',
                        'data-[open=false]:data-[active=true]:hover:[--row-bg:var(--interactive-row-active-bg)]',
                    ].join(' '),
                    // 文本色
                    [
                        'data-[open=false]:data-[active=true]:[--text-color:var(--interactive-row-active-text)]',
                        'data-[open=false]:data-[active=true]:hover:[--text-color:var(--interactive-row-active-text)]',
                    ].join(' '),
                    // 运动图标色
                    [
                        'data-[open=false]:data-[active=true]:[--icon-color:var(--interactive-row-active-icon)]',
                        'data-[open=false]:data-[active=true]:hover:[--icon-color:var(--interactive-row-active-icon)]',
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
                        'data-[open=true]:data-[active=false]:[--row-bg:var(--interactive-row-hover-bg)]',
                        'data-[open=true]:data-[active=false]:hover:[--row-bg:var(--interactive-row-hover-bg)]',
                    ].join(' '),
                    // 文本色
                    [
                        'data-[open=true]:data-[active=false]:[--text-color:var(--interactive-row-text)]',
                        'data-[open=true]:data-[active=false]:hover:[--text-color:var(--interactive-row-hover-text)]',
                    ].join(' '),
                    // 运动图标色
                    [
                        'data-[open=true]:data-[active=false]:[--icon-color:var(--interactive-row-active-icon)]',
                        'data-[open=true]:data-[active=false]:hover:[--icon-color:var(--interactive-row-active-icon)]',
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
                        'data-[open=true]:data-[active=true]:[--row-bg:var(--interactive-row-active-bg)]',
                        'data-[open=true]:data-[active=true]:hover:[--row-bg:var(--interactive-row-active-bg)]',
                    ].join(' '),
                    // 文本色
                    [
                        'data-[open=true]:data-[active=true]:[--text-color:var(--interactive-row-active-text)]',
                        'data-[open=true]:data-[active=true]:hover:[--text-color:var(--interactive-row-active-text)]',
                    ].join(' '),
                    // 运动图标色
                    [
                        'data-[open=true]:data-[active=true]:[--icon-color:var(--interactive-row-active-icon)]',
                        'data-[open=true]:data-[active=true]:hover:[--icon-color:var(--interactive-row-active-icon)]',
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

                    "data-[active=true]:before:content-[''] data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1.5 data-[active=true]:before:bottom-1.5 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-r-sm",
                    'data-[active=true]:before:[background:var(--interactive-active-rail-bg)] data-[active=true]:before:[box-shadow:var(--interactive-active-rail-shadow)]',
                    'relative w-full h-10 flex items-center justify-between',
                    'p-2 rounded-sm',
                    'bg-(--row-bg)',
                )}
                data-active={isActive || isChildActive}
                data-open={isOpen}
            >
                {/* Left link area: icon + text, navigates to sport page */}
                <Link
                    href={`/sports/${sportNode.sport_id}${liveStatusSuffix}`}
                    onClick={onExpandToggleClick}
                    className={cn('flex-auto min-w-0 h-full flex items-center gap-x-2')}
                >
                    {/* Icon: if strategy dictates, DefaultIcon otherwise */}
                    <div className="size-6 inline-flex justify-center items-center">
                        {Icon && <Icon className={cn('size-5 text-(--icon-color)')} />}
                    </div>
                    <ConditionalTooltip content={sportNode.name} side="right">
                        <span className={cn('text-body-lg flex-auto truncate text-left text-(--text-color)')}>
                            {sportNode.name}
                        </span>
                    </ConditionalTooltip>
                </Link>
                {/* Right arrow button: independent hover, click to expand/collapse */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onExpandToggleClick();
                    }}
                    className={cn(
                        'size-5 inline-flex items-center justify-center rounded cursor-pointer bg-(--arrow-bg)',
                    )}
                >
                    <Arrow
                        className={cn('w-3 h-3 transition-transform text-(--arrow-color)')}
                        direction={isOpen ? 'up' : 'down'}
                    />
                </button>
            </div>
            <CollapsibleContent>
                <div className="max-h-90 pl-2 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                    {/* Initial loading state */}
                    {isLoading && (
                        <div className="h-20 flex items-center justify-center">
                            <Loading className="h-5 w-5" variant="color-red" />
                        </div>
                    )}
                    {/* Data list */}
                    {!isLoading && sportNode.categoryList.length > 0 && (
                        <div className="flex flex-col gap-1 pt-1">
                            {Boolean(sportNode.tournamentList?.length) && (
                                <>
                                    <HotTournamentTitle />
                                    {sportNode.tournamentList.map((tournamentNode) => {
                                        return (
                                            <TournamentItem
                                                key={`${tournamentNode.key}`}
                                                tournamentNode={tournamentNode}
                                            />
                                        );
                                    })}
                                </>
                            )}

                            {sportNode.categoryList.map((categoryNode) => {
                                return (
                                    <CategoryItem
                                        key={categoryNode.key}
                                        categoryNode={categoryNode}
                                        isOpen={openedCategoryKey === categoryNode.key}
                                        onToggle={() => {
                                            setOpenedCategoryKey((prev) =>
                                                prev === categoryNode.key ? null : categoryNode.key,
                                            );
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}
                    {/* Load more trigger */}
                    {!isLoading && hasNextPage && (
                        <div
                            ref={sentinelRef}
                            className="h-10 flex items-center justify-center text-filltext-ft-e text-auxiliary-sm"
                        >
                            {isFetchingNextPage ? (
                                <Loading className="h-4 w-4" variant="color-red" />
                            ) : (
                                t('list.loadMore')
                            )}
                        </div>
                    )}

                    {/* Bottom hint text - only shown after loading multiple pages */}
                    {!isLoading &&
                        !hasNextPage &&
                        sportNode.categoryList.length > 0 &&
                        (data?.pages?.length ?? 0) > 1 && (
                            <div className="h-8 flex items-center justify-center px-2">
                                <span className="text-body-sm text-filltext-ft-f">{tHome('noMore.categories')}</span>
                            </div>
                        )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
});

SportItem.displayName = 'SportItem';
