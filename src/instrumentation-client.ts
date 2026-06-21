// instrumentation-client.ts 是 Next.js 自动识别的浏览器端初始化入口，不需要手动引用；
// 它的职责就是在客户端启动时把 Sentry browser runtime 接起来
import { initializeSentry, onRouterTransitionStart } from '@/libs/observability/sentry/browser';

initializeSentry();

export { onRouterTransitionStart };
