'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type FC, useCallback, useEffect, useMemo } from 'react';
import type { SystemMessageListResponse } from '@/api/handlers/notification';
import {
    DeleteSystemMessagesInterface,
    GetAnnouncementsInterface,
    ReadSystemMessagesInterface,
} from '@/api/handlers/notification';
import { MessageStatus, SystemMessageCategory } from '@/api/models/system-message';
import { Loading } from '@/components/loading/loading';
import { Toast } from '@/components/toast';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { AdvertisementNotificationCard } from './card';
import { EmptyState } from './empty-state';
import { Footer } from './footer';

import { NotificationListSkeleton } from './notification-skeleton';
import { useUnreadMessagesStore } from './use-unread-messages';

/**
 * Announcements list component
 * Displays announcement list with infinite scroll loading
 */
export const Announcements: FC = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();
    const setHasUnreadAnnouncements = useUnreadMessagesStore((state) => state.setHasUnreadAnnouncements);

    // Fetch announcements list data
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
        queryKey: ['announcements'],
        queryFn: async ({ pageParam }) => {
            const response = await GetAnnouncementsInterface({
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
    const announcements = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.list ?? []);
    }, [data]);

    // Check for unread announcements (status is not MessageStatus.Read)
    useEffect(() => {
        const hasUnread = announcements.some((announcement) => announcement.status !== MessageStatus.Read);
        setHasUnreadAnnouncements(hasUnread);
    }, [announcements, setHasUnreadAnnouncements]);

    // Handle view detail: mark announcement as read using queryClient
    const handleViewDetail = useCallback(
        async (announcement: { id: string }) => {
            const queryKey = ['announcements'];

            await ReadSystemMessagesInterface(announcement.id);

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
                                msg.id === announcement.id ? { ...msg, status: MessageStatus.Read } : msg,
                            ),
                        })),
                    };
                },
            );
        },
        [queryClient],
    );

    // Handle deleting a single announcement
    const handleDelete = useCallback(
        async (announcement: { id: string }) => {
            const queryKey = ['announcements'];

            try {
                // 1. Call API to delete
                await DeleteSystemMessagesInterface(announcement.id);
                Toast.success(t('message.success'), { id: 'announcement-action' });

                // 2. Update queryClient cache data
                queryClient.setQueryData<{
                    pages: SystemMessageListResponse[];
                    pageParams: (string | number | null)[];
                }>(queryKey, (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            list: page.list.filter((msg) => msg.id !== announcement.id),
                        })),
                    };
                });

                // 3. Trigger unread announcements count refresh
                queryClient.invalidateQueries({ queryKey: ['unread-announcements'] });
            } catch {
                Toast.error(t('message.error'), { id: 'announcement-action' });
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
    if (announcements.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="flex flex-col h-full min-h-0 gap-2">
            <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                {announcements.map((item) => (
                    <AdvertisementNotificationCard
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
                category={SystemMessageCategory.Advertisement}
                showDeleteAll={announcements.length >= 2}
                showReadAll={announcements.filter((msg) => msg.status !== MessageStatus.Read).length >= 2}
                onRefresh={refetch}
            />
        </div>
    );
};
