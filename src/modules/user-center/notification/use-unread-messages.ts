'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { create } from 'zustand';
import { GetAnnouncementsInterface, GetSystemMessagesInterface } from '@/api/handlers/notification';
import { MessageStatus, SystemMessageCategory } from '@/api/models/system-message';
import { useIsLogin } from '@/stores/session-store';

interface UnreadMessagesState {
    /** Whether there are unread messages */
    hasUnreadMessages: boolean;
    /** Whether there are unread announcements */
    hasUnreadAnnouncements: boolean;
    /** Set messages unread state */
    setHasUnreadMessages: (hasUnread: boolean) => void;
    /** Set announcements unread state */
    setHasUnreadAnnouncements: (hasUnread: boolean) => void;
    /** Reset all unread states */
    reset: () => void;
}

/**
 * Unread messages state store
 */
export const useUnreadMessagesStore = create<UnreadMessagesState>((set) => ({
    hasUnreadMessages: false,
    hasUnreadAnnouncements: false,
    setHasUnreadMessages: (hasUnread) => set({ hasUnreadMessages: hasUnread }),
    setHasUnreadAnnouncements: (hasUnread) => set({ hasUnreadAnnouncements: hasUnread }),
    reset: () => set({ hasUnreadMessages: false, hasUnreadAnnouncements: false }),
}));

/**
 * Hook to check for unread messages
 * Fetches unread message data when login state changes
 */
export const useUnreadMessages = () => {
    const isLogin = useIsLogin();
    const { setHasUnreadMessages, setHasUnreadAnnouncements, reset } = useUnreadMessagesStore();

    // Query whether Messages have any unread
    const { data: messagesData } = useQuery({
        queryKey: ['unread-messages', SystemMessageCategory.General],
        queryFn: async () => {
            const response = await GetSystemMessagesInterface({
                category: SystemMessageCategory.General,
            });
            return response;
        },
        enabled: isLogin,
    });

    // Query whether Announcements have any unread
    const { data: announcementsData } = useQuery({
        queryKey: ['unread-announcements'],
        queryFn: async () => {
            const response = await GetAnnouncementsInterface({});
            return response;
        },
        enabled: isLogin,
    });

    // Update unread state when data changes (based on status field)
    useEffect(() => {
        if (messagesData?.list) {
            const hasUnread = messagesData.list.some((msg) => msg.status !== MessageStatus.Read);
            setHasUnreadMessages(hasUnread);
        }
        if (announcementsData?.list) {
            const hasUnread = announcementsData.list.some((announcement) => announcement.status !== MessageStatus.Read);
            setHasUnreadAnnouncements(hasUnread);
        }
    }, [messagesData, announcementsData, setHasUnreadMessages, setHasUnreadAnnouncements]);

    // Reset unread state when user logs out
    useEffect(() => {
        if (!isLogin) {
            reset();
        }
    }, [isLogin, reset]);

    return {
        hasUnreadMessages: useUnreadMessagesStore((state) => state.hasUnreadMessages),
        hasUnreadAnnouncements: useUnreadMessagesStore((state) => state.hasUnreadAnnouncements),
    };
};

/**
 * Check whether there are any unread items (Messages or Announcements)
 */
export const useHasAnyUnread = () => {
    const hasUnreadMessages = useUnreadMessagesStore((state) => state.hasUnreadMessages);
    const hasUnreadAnnouncements = useUnreadMessagesStore((state) => state.hasUnreadAnnouncements);
    return hasUnreadMessages || hasUnreadAnnouncements;
};
