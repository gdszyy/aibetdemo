# 生产安全标准

- **测试页面**：所有测试页面（如 `src/app/[locale]/test1/`）**必须**通过 `next.config.ts` 重定向和内部 `notFound()` 守卫在生产环境中阻止访问。
- **环境隔离**：
  - **调试工具**：`ReplayControl` 等工具必须仅在开发环境条件渲染。
  - **控制台日志**：敏感数据（token、PII）**禁止**记录。所有调试日志必须用 `process.env.NODE_ENV === 'development'` 守卫。
- **Mock 数据兜底**：硬编码的 mock 数据（如 `MOCK_PROMOTIONS`）应严格限于开发/预览使用。生产环境中 API 数据缺失时确保优雅降级。
- **环境变量**：API key、DSN 和追踪 ID **禁止**硬编码在源码中。使用 `NEXT_PUBLIC_*` 环境变量。模式：`.env`（已提交）= 仅空占位符；`.env.development`（已提交）= 开发值或空以禁用；`.env.production.local`（gitignored）或 CI/CD = 生产值。第三方 SDK（Firebase、GA、Sentry）必须使用延迟初始化 + 生产守卫（`NODE_ENV === 'production'` + 环境变量存在检查）。
