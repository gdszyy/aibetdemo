import { config } from '@/constants/config';
import type { ErrorReject } from './types';

/** Build full API URL */
export const getFullUrl = (prefix: string, api: string) => {
    let fullUrl = '';

    fullUrl += prefix?.endsWith('/') ? prefix.substring(0, prefix.length - 1) : prefix;
    fullUrl += api?.startsWith('/') ? api : `/${api}`;

    return fullUrl;
};

/** Format API error message */
export const getRejectError = (err: string | ErrorReject): string => {
    if (typeof err === 'string') {
        return err;
    }

    let msg = err?.message || `Network Error${config.isProd ? '' : ` (Unknown)`}`;
    if (err.code && !err?.message) {
        msg += `(${err.code})`;
    }

    return msg;
};
