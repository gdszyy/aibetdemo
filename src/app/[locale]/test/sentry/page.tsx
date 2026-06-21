import type { FunctionComponent } from 'react';
import { SentryDebugPanel } from './_components/sentry-debug-panel';

/**
 * Sentry 调试测试页。
 * 用于本地触发当前项目内常见的手动上报和自动异常捕获场景。
 */
const SentryTestPage: FunctionComponent = () => {
    return <SentryDebugPanel />;
};

export default SentryTestPage;
