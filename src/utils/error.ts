import {
    ApiError,
    AppError,
    type AppErrorOptions,
    captureAppError,
    type ErrorLevel,
    ForbiddenError,
    NetworkError,
    ValidationError,
} from '@/libs/observability/sentry';

export type { AppErrorOptions, ErrorLevel };
export { AppError, ApiError, NetworkError, ForbiddenError, ValidationError };

/** Centralized error reporting compatibility wrapper */
export const reportError = (error: unknown, options?: AppErrorOptions) => {
    captureAppError(error, options);
};
