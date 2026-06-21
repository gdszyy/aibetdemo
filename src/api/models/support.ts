/** VIP support status */
export enum VipSupportStatus {
    /** Available */
    AVAILABLE = 1,
    /** Unavailable */
    UNAVAILABLE = 0,
}

/** VIP support agent */
export interface VipSupportModel {
    /** ID */
    id: number;
    /** Support code */
    code: string;
    /** Support agent name */
    name: string;
    /** Category */
    category: number;
    /** Reference number */
    ref_number: string;
    /** Support level */
    support_level: number;
    /** Welcome message */
    welcome: string;
    /** Self introduction */
    introduction: string;
    /** Avatar URL */
    avatar: string;
    /** Work start time (UTC seconds) */
    work_begin_time: number;
    /** Work end time (UTC seconds) */
    work_end_time: number;
    /** Whether currently working */
    is_working: boolean;
    /** Status: 0 = active, 1 = disabled (per example status=0 is active) */
    status: number;
    /** Whether deleted */
    is_deleted: number;
    /** Created by */
    created_by: string;
    /** Created at */
    created_at: string;
    /** Updated by */
    updated_by: string;
    /** Updated at */
    updated_at: string;
}
