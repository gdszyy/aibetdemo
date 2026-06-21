'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useState } from 'react';
import { MessageStatus, type SystemMessage } from '@/api/models/system-message';
import { Delete as SvgDelete } from '@/components/icons';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { cn } from '@/utils/common';

export interface NotificationCardProps {
    /** Message data */
    message: SystemMessage;
    /** Custom class name */
    className?: string;
    /** View detail click callback */
    onViewDetail?: (message: SystemMessage) => void;
    /** Dismiss click callback */
    onDismiss?: (message: SystemMessage) => void;
    /** Delete click callback */
    onDelete?: (message: SystemMessage) => void;
}

/**
 * Card header: timestamp + delete button
 */
const CardHeader: FC<{ message: SystemMessage; onDelete?: (message: SystemMessage) => void }> = ({
    message,
    onDelete,
}) => {
    const { formatRelativeDatetime } = useIntlFormatter();
    const formattedTime = formatRelativeDatetime(new Date(message.start_time));

    return (
        <div className="flex items-center gap-1 w-full shrink-0 text-auxiliary-sm text-filltext-ft-g">
            <p className="text-auxiliary-sm text-filltext-ft-e">{formattedTime}</p>
            {onDelete && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(message);
                    }}
                    className="transition-colors cursor-pointer text-filltext-ft-f hover:text-func-lost -mt-px"
                >
                    <SvgDelete className="w-[10px] h-[10px]" />
                </button>
            )}
        </div>
    );
};

/**
 * Card body: title, content, expand/collapse button
 */
const CardBody: FC<Omit<NotificationCardProps, 'className' | 'onDelete'>> = ({ message, onViewDetail, onDismiss }) => {
    const t = useTranslations('user');
    const [isExpanded, setIsExpanded] = useState(false);
    const isUnread = message.status !== MessageStatus.Read;

    // Handle expand/collapse toggle
    const handleToggle = () => {
        if (!isExpanded) {
            setIsExpanded(true);
            // Only notify the parent; actual read logic is handled by the parent
            if (isUnread) {
                onViewDetail?.(message);
            }
        } else {
            setIsExpanded(false);
        }
    };

    // Handle dismiss action
    const handleDismiss = () => {
        setIsExpanded(false);
        onDismiss?.(message);
    };

    return (
        <div className="flex flex-col w-full shrink-0 text-body-sm text-filltext-ft-g">
            {/* Title on its own line */}
            <p className={cn('text-sm font-bold leading-4 text-filltext-ft-g break-words', !isExpanded && 'truncate')}>
                {message.title}
            </p>
            {/* Content + action button side by side */}
            <div className="flex items-start gap-2 mt-1">
                <p
                    className={cn(
                        'text-sm font-normal leading-4 text-filltext-ft-g break-words min-w-0 flex-1',
                        isExpanded ? 'whitespace-pre-line' : 'truncate',
                    )}
                >
                    {message.content}
                </p>
                <div className="flex shrink-0 flex-col justify-start">
                    {isExpanded ? (
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="flex shrink-0 text-auxiliary-sm text-filltext-ft-e cursor-pointer hover:text-filltext-ft-g transition-colors"
                        >
                            <p className="text-auxiliary-sm text-filltext-ft-e">
                                [{t('notification.actions.dismiss')}]
                            </p>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleToggle}
                            className="flex text-auxiliary-sm text-filltext-ft-e cursor-pointer hover:text-filltext-ft-g transition-colors"
                        >
                            <p className="text-auxiliary-sm text-filltext-ft-e">
                                [{t('notification.actions.showDetail')}]
                            </p>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Card banner
 */
const CardBanner: FC<{ message: SystemMessage }> = ({ message }) => {
    if (!message.banner) return null;

    if (message.jump_url) {
        return (
            <a
                href={message.jump_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 w-full block cursor-pointer"
            >
                <img src={message.banner} alt="banner" className="w-full rounded-[16px] h-[120px] object-cover" />
            </a>
        );
    }

    return <img src={message.banner} alt="banner" className="mt-2 w-full rounded-[16px] h-[120px] object-cover" />;
};

/**
 * Base container component
 */
const NotificationCardContainer: FC<NotificationCardProps & { children: React.ReactNode }> = ({
    message,
    className,
    onDelete,
    children,
}) => {
    // Whether the message is unread (shows red dot)
    const isUnread = message.status !== MessageStatus.Read;

    return (
        <div className={cn('relative flex flex-col gap-1 min-w-0 bg-filltext-ft-a rounded-[8px] py-2 px-6', className)}>
            {/* Unread red dot indicator */}
            {isUnread && (
                <div className="absolute left-[8px] top-[10px] w-1.5 h-1.5">
                    <div className="absolute inset-0 bg-brand-primary-0 rounded-full" />
                </div>
            )}

            {/* Content area container */}
            <div className="flex flex-1 flex-col gap-1 min-h-0 min-w-0">
                <CardHeader message={message} onDelete={onDelete} />
                {children}
            </div>
        </div>
    );
};

/**
 * General notification card
 */
export const GeneralNotificationCard: FC<NotificationCardProps> = (props) => {
    return (
        <NotificationCardContainer {...props}>
            <CardBody {...props} />
        </NotificationCardContainer>
    );
};

/**
 * Advertisement notification card
 */
export const AdvertisementNotificationCard: FC<NotificationCardProps> = (props) => {
    return (
        <NotificationCardContainer {...props}>
            <CardBody {...props} />
            <CardBanner message={props.message} />
        </NotificationCardContainer>
    );
};
