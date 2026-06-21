import { uofFetcher } from '@/api/client';
import type { ScrollPageResponse } from '@/api/lib/types';
import { MessageStatus, type SystemMessage, SystemMessageCategory } from '@/api/models/system-message';

/** System message query params */
export type SystemMessageQueryParams = {
    /** Category type */
    category: SystemMessageCategory;
    /** Cursor (optional) */
    cursor?: string;
};

/** System message list response */
export type SystemMessageListResponse = ScrollPageResponse<SystemMessage>;

/**
 * Get system message list (Messages)
 * @param params - Query params
 * @returns System message list
 */
export const GetSystemMessagesInterface = (params: SystemMessageQueryParams) => {
    return uofFetcher.get<SystemMessageListResponse>(`/v1/users/message`, params);
};

/**
 * Get announcement list (Announcements)
 * @param params - Query params
 * @returns Announcement list
 */
export const GetAnnouncementsInterface = (params: Omit<SystemMessageQueryParams, 'category'>) => {
    return uofFetcher.get<SystemMessageListResponse>(`/v1/users/message`, {
        ...params,
        category: SystemMessageCategory.Advertisement,
    });
};

/**
 * Mark all messages as read
 * @param category - Message category
 */
export const ReadAllSystemMessagesInterface = (category: SystemMessageCategory) => {
    return uofFetcher.post(`/v1/users/message/status`, {
        category,
        status: MessageStatus.Read,
    });
};

/**
 * Mark a single message as read
 * @param id - Message ID
 */
export const ReadSystemMessagesInterface = (id: string) => {
    return uofFetcher.post(`/v1/users/message/status/${id}`, { status: MessageStatus.Read });
};

/**
 * Delete all messages
 * @param category - Message category
 */
export const DeleteAllSystemMessagesInterface = (category: SystemMessageCategory) => {
    return uofFetcher.delete(`/v1/users/message/category/${category}`);
};
/**
 * Delete a single message
 * @param id - Message ID
 */
export const DeleteSystemMessagesInterface = (id: string) => {
    return uofFetcher.delete(`/v1/users/message/${id}`);
};
