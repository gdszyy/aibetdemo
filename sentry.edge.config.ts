import * as Sentry from '@sentry/nextjs';
import { createEdgeSentryOptions } from './src/libs/observability/sentry';

/**
 * English: Live edge-runtime Sentry config.
 * 中文：当前真实生效的 edge runtime Sentry 配置。
 */
Sentry.init(createEdgeSentryOptions());
