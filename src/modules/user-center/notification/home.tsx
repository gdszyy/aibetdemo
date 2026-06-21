'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { Tabs } from '@/components/tabs/tabs';
import { Announcements } from './announcements';
import { ContentContainer } from './content-container';
import { NormalMessages } from './normal-messages';
import { useUnreadMessagesStore } from './use-unread-messages';

/**
 * Notification home page component
 * Shows Messages and Announcements tabs with message lists
 */
export const NotificationHome: FC = () => {
    const t = useTranslations('user');
    const hasUnreadMessages = useUnreadMessagesStore((state) => state.hasUnreadMessages);
    const hasUnreadAnnouncements = useUnreadMessagesStore((state) => state.hasUnreadAnnouncements);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'messages');

    const tabItems = [
        {
            value: 'messages',
            label: t('notification.tabs.messages'),
            content: <NormalMessages />,
            showBadge: hasUnreadMessages,
        },
        {
            value: 'announcements',
            label: t('notification.tabs.announcements'),
            content: <Announcements />,
            showBadge: hasUnreadAnnouncements,
        },
    ];

    return (
        <div className="flex flex-col gap-2 flex-1 min-h-0 w-full">
            <Tabs
                items={tabItems}
                value={activeTab}
                onChange={setActiveTab}
                className="flex flex-col gap-2 flex-1 min-h-0"
                ContentContainer={ContentContainer}
            />
        </div>
    );
};
