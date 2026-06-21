// Re-export from shared location for backwards compatibility within this module

export type { UserCenterMenu } from '@/constants/user-center';
export { type UserCenterSource, UserCenterSourceEnum } from '@/constants/user-center';

export interface OpenUserCenterPayload {
    menu: import('@/constants/user-center').UserCenterMenu;
    source?: import('@/constants/user-center').UserCenterSource;
}
