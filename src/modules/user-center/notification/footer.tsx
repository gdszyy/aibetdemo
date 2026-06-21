import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { DeleteAllSystemMessagesInterface, ReadAllSystemMessagesInterface } from '@/api/handlers/notification';
import { SystemMessageCategory } from '@/api/models/system-message';
import { Button } from '@/components/button/button';
import { Toast } from '@/components/toast';

interface FooterProps {
    category: SystemMessageCategory;
    onRefresh?: () => void;
    showDeleteAll: boolean;
    showReadAll: boolean;
}

/**
 * Message list bottom action bar
 * Provides "Read All" and "Delete All" functionality
 */
export const Footer: FC<FooterProps> = ({ category, onRefresh, showDeleteAll, showReadAll }) => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    // Read All mutation
    const { mutate: readAll, isPending: isReading } = useMutation({
        mutationFn: () => ReadAllSystemMessagesInterface(category),
        onSuccess: () => {
            Toast.success(t('message.success'), { id: 'notification-action' });
            // Refresh list data
            if (category === SystemMessageCategory.General) {
                queryClient.invalidateQueries({ queryKey: ['system-messages'] });
                queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['announcements'] });
                queryClient.invalidateQueries({ queryKey: ['unread-announcements'] });
            }
            onRefresh?.();
        },
        onError: () => {
            Toast.error(t('message.error'), { id: 'notification-action' });
        },
    });

    // Delete All mutation
    const { mutate: deleteAll, isPending: isDeleting } = useMutation({
        mutationFn: () => DeleteAllSystemMessagesInterface(category),
        onSuccess: () => {
            Toast.success(t('message.success'), { id: 'notification-action' });
            // Refresh list data
            if (category === SystemMessageCategory.General) {
                queryClient.invalidateQueries({ queryKey: ['system-messages'] });
                queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['announcements'] });
                queryClient.invalidateQueries({ queryKey: ['unread-announcements'] });
            }
            onRefresh?.();
        },
        onError: () => {
            Toast.error(t('message.error'), { id: 'notification-action' });
        },
    });

    if (!showDeleteAll && !showReadAll) return null;

    return (
        <div className="h-8 flex items-center justify-end px-4 bg-surface-raised shrink-0 gap-x-3">
            {/* Delete All */}
            {showDeleteAll && (
                <Button
                    variant="secondary"
                    onClick={() => deleteAll()}
                    loading={isDeleting}
                    disabled={isReading}
                    className="rounded-[999px] h-full px-4"
                >
                    {t('action.all_delete')}
                </Button>
            )}

            {/* Read All */}
            {showReadAll && (
                <Button
                    variant="outline"
                    onClick={() => readAll()}
                    loading={isReading}
                    disabled={isDeleting}
                    className="rounded-[999px] h-full px-4 border border-brand-primary-0"
                >
                    {t('action.all_read')}
                </Button>
            )}
        </div>
    );
};
