import type { z } from 'zod';
import { config } from '@/constants/config';
import { reportError, ValidationError } from '@/utils/error';

const IS_DEV = config.isDev;
const ENABLE_VALIDATION = process.env.NEXT_PUBLIC_API_VALIDATION === 'true' || IS_DEV;

/**
 * Common runtime validation function
 * @param data Data to validate
 * @param schema Zod schema
 * @param label API identifier for logging
 */
export function validateResponse<T>(data: T, schema: z.ZodSchema<T>, label: string): T {
    if (!ENABLE_VALIDATION) return data;

    const result = schema.safeParse(data);

    if (!result.success) {
        // Standardized error logs for Playwright/Sentry monitoring
        console.warn(`[API Validation] ❌ ${label} - Schema validation failed`);

        const error = new ValidationError(`API Validation Failed: ${label}`, {
            label,
            errors: result.error.format(),
            data,
        });

        if (IS_DEV) {
            console.warn(`[API Validation] Error details:`, result.error.format());
            console.groupCollapsed(`[API Validation] Raw data preview (${label})`);
            console.dir(data);
            console.groupEnd();
        } else {
            // Report to Sentry in production
            reportError(error);
        }

        // We do not throw to avoid breaking business logic, but it's logged for monitoring
    } else if (IS_DEV) {
        console.log(`[API Validation] ✅ ${label} - Validated successfully`);
    }

    return data;
}
