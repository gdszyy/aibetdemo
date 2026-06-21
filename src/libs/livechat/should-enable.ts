/** LiveChat 环境开关与 license（NEXT_PUBLIC_*）。 */
import { config } from '@/constants/config';

export function isLiveChatEnvEnabled(): boolean {
    return config.liveChatEnabled;
}

export function getLiveChatLicense(): string {
    return config.liveChatLicense;
}
