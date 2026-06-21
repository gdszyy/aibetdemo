import * as Sentry from '@sentry/nextjs';
import { createServerSentryOptions } from './src/libs/observability/sentry';

/**
 * English: Live node-runtime Sentry config.
 * 中文：当前真实生效的 node runtime Sentry 配置。
 */
Sentry.init(createServerSentryOptions());
