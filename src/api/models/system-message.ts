/** System message category */
export enum SystemMessageCategory {
    /** General message */
    General = 1,
    /** Advertisement */
    Advertisement = 2,
}

/** System message delivery status */
export enum SystemMessageStatus {
    /** Unsent */
    Unsent = 0,
    /** Sending */
    Sending = 1,
    /** Sent */
    Sent = 2,
}

/** Message read status */
export enum MessageStatus {
    /** Default / Unread */
    Unread = 0,
    /** Read */
    Read = 1,
}

/** System message */
export interface SystemMessage {
    /** Primary key, auto-increment */
    id: string;
    /** Title */
    title: string;
    /** Content */
    content: string;
    /** Image URL(s), comma-separated if multiple */
    banner?: string;
    /** Redirect URL */
    jump_url?: string;
    /** Category */
    category: SystemMessageCategory;
    msg_time: number;
    /** Start time (hourly precision) datetime(3) -> timestamp ms */
    start_time: number;
    /** End time datetime(3) -> timestamp ms */
    end_time: number;
    /** Source (0 = new, otherwise template message ID) */
    source: string;
    /** Created at */
    created_at: number;
    /** Updated at */
    updated_at?: number;
    /** Message read status */
    status: MessageStatus;
}
