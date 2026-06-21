'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type FC, useCallback, useEffect, useMemo } from 'react';
import type { SystemMessageListResponse } from '@/api/handlers/notification';
import {
    DeleteSystemMessagesInterface,
    GetSystemMessagesInterface,
    ReadSystemMessagesInterface,
} from '@/api/handlers/notification';
import { MessageStatus, SystemMessageCategory } from '@/api/models/system-message';
import { Loading } from '@/components/loading/loading';
import { Toast } from '@/components/toast';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { GeneralNotificationCard } from './card';
import { EmptyState } from './empty-state';
import { Footer } from './footer';

import { NotificationListSkeleton } from './notification-skeleton';
import { useUnreadMessagesStore } from './use-unread-messages';

/**
 * Normal messages list component
 * Displays in-app messages with infinite scroll loading
 */
export const NormalMessages: FC = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();
    const setHasUnreadMessages = useUnreadMessagesStore((state) => state.setHasUnreadMessages);

    // Fetch message list data
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
        queryKey: ['system-messages', SystemMessageCategory.General],
        queryFn: async ({ pageParam }) => {
            const response = await GetSystemMessagesInterface({
                category: SystemMessageCategory.General,
                cursor: pageParam ?? undefined,
            });
            return response;
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            // Empty string or null/undefined means no next page
            const cursor = lastPage.next_cursor;
            if (!cursor) return undefined;
            return typeof cursor === 'string' ? cursor : String(cursor);
        },
    });

    // Merge all pages' data
    const messages = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.list ?? []);
    }, [data]);
    // Check for unread messages (status is not MessageStatus.Read)
    useEffect(() => {
        const hasUnread = messages.some((msg) => msg.status !== MessageStatus.Read);
        setHasUnreadMessages(hasUnread);
    }, [messages, setHasUnreadMessages]);

    // Handle view detail: mark message as read using queryClient and call API
    const handleViewDetail = useCallback(
        async (message: { id: string }) => {
            const queryKey = ['system-messages', SystemMessageCategory.General];

            // 1. Call API to mark as read
            await ReadSystemMessagesInterface(message.id);

            // Update queryClient cache data
            queryClient.setQueryData<{ pages: SystemMessageListResponse[]; pageParams: (string | number | null)[] }>(
                queryKey,
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            list: page.list.map((msg) =>
                                msg.id === message.id ? { ...msg, status: MessageStatus.Read } : msg,
                            ),
                        })),
                    };
                },
            );
        },
        [queryClient],
    );

    // Handle deleting a single message
    const handleDelete = useCallback(
        async (message: { id: string }) => {
            const queryKey = ['system-messages', SystemMessageCategory.General];

            try {
                // 1. Call API to delete
                await DeleteSystemMessagesInterface(message.id);
                Toast.success(t('message.success'), { id: 'message-action' });

                // 2. Update queryClient cache data (optimistic update)
                queryClient.setQueryData<{
                    pages: SystemMessageListResponse[];
                    pageParams: (string | number | null)[];
                }>(queryKey, (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            list: page.list.filter((msg) => msg.id !== message.id),
                        })),
                    };
                });

                // 3. Trigger unread messages count refresh
                queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
            } catch {
                Toast.error(t('message.error'), { id: 'message-action' });
            }
        },
        [queryClient, t],
    );

    const { sentinelRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

    // Show skeleton while loading
    if (isLoading) {
        return <NotificationListSkeleton />;
    }

    // Empty state
    if (messages.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="flex flex-col h-full min-h-0 gap-2">
            <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                {messages.map((item) => (
                    <GeneralNotificationCard
                        key={item.id}
                        message={item}
                        onViewDetail={handleViewDetail}
                        onDelete={handleDelete}
                    />
                ))}
                {isFetchingNextPage && (
                    <div className="flex items-center justify-center py-4">
                        <Loading className="h-5 w-5" variant="color-red" />
                    </div>
                )}
                <div ref={sentinelRef} />
            </div>
            {/* Bottom action bar */}
            <Footer
                category={SystemMessageCategory.General}
                showDeleteAll={messages.length >= 2}
                showReadAll={messages.filter((msg) => msg.status !== MessageStatus.Read).length >= 2}
                onRefresh={refetch}
            />
        </div>
    );
};
