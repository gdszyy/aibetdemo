---
trigger: always_on
description: 项目行为准则与编码规范
---

# AI Agent 行为准则

- 执行 feat / fix / refactor 时，先分析计划并等待审批后再写代码。
- 关注代码架构质量：组件化、高内聚低耦合、不重复造轮子。优先使用成熟的开源库而非自行实现。
- 遇到复杂/遗留代码时，主动识别重构机会，运用 GoF 设计模式或 SOLID 原则。
- 实现相关业务功能时，参考 `.agent/plans/` 中的技术计划。
- **不要** 主动编写防御性/兜底代码（可能掩盖错误）。
- 除非明确要求，**不要** commit / push。

> **技术栈、目录结构、命令、API 客户端** → 见 `AGENTS.md`（项目根目录）。版本：Next.js 16.1.7, TypeScript 5.9.3, React 19.2.1, Tailwind CSS v4.1.18, Zustand 5.0.9, React Query 5.90.16, Biome 2.3.8, pnpm 10.30.3。

## 1. API 调用规范

使用 `src/api/client.ts` 中的 fetcher 实例 — 禁止硬编码 API URL。Fetcher 列表：`uofFetcher`（体育/认证）、`userFetcher`（用户/KYC）、`paymentFetcher`（充提）、`gameFetcher`（赌场）、`sportFetcher`（足球/篮球统计数据）、`activityFetcher`（VIP/活动，`NEXT_PUBLIC_ACTIVITY_SERVICE`）。

**SSR 注意**：`client.ts` 会将 `code` 通过 `Number()` 标准化。Server Components 使用原生 `fetch()` 时需 `Number(json.code) === 0`（后端可能返回字符串 `"0"`）。

**API 处理流程**：
1. Handler（`src/api/handlers/`）定义接口函数，参数验证和请求标准化
2. Fetcher 自动注入 Auth token、链路追踪头（X-Traceparent）、Accept-Language、X-Timezone
3. 响应处理：HTTP 状态码校验 → JSON 解析 → 业务 code 校验 → 可选 Zod schema 验证
4. 错误分层：`NetworkError`（网络层）、`ApiError`（code 700 服务端错误）、`ForbiddenError`（业务错误）、`ValidationError`（数据格式错误）
5. Token 轮换：自动从响应头读取新 token，静默更新到 localStorage

**错误码处理**：
- `code 0`：成功
- `code 700`：服务端错误，报告到 Sentry
- `code 1000/1001`：Token 过期，自动清除会话 + 弹出登录对话框
- 其他非零 code：业务错误，`ForbiddenError`

## 2. 网络搜索 — 默认行为，非可选

**网络搜索是默认动作，不是备选方案。** 每个 `/a`、`/cr`、`/uc` 任务都应至少包含一次网络搜索。

**搜索时机**：
- `/a`：提议前验证核心模式/方案是否为标准做法
- `/cr`、`/uc`：发现自定义实现时，搜索标准方案
- 调试：猜测前先搜索框架相关的已知坑
- 任何 API/库：不确定时查阅最新文档

**搜索内容**：浏览器兼容性、最新最佳实践、成熟库、已知陷阱。

**重要**：搜索时始终查找最新内容 — 查询中使用当前年份或更晚。

### 库优先检查 — UI 原语强制要求

提议或审查常见 UI 原语的自定义实现时，**必须先搜索已有库**。

**触发关键词**：drawer、bottom sheet、modal、dialog、popover、tabs、accordion、date/time picker、select、combobox、virtual list、carousel、drag-and-drop、data grid、infinite scroll、skeleton loader。

**评估标准**：维护频率（< 3 个月）、采用度（> 10k npm/周）、优先无头库（Radix、Vaul、Embla、TanStack）、包体积、无障碍。

**报告格式**：名称、npm 下载量、包体积、适合原因。如果拒绝库而使用自定义代码，需说明原因。

## 3. 编码规范

- **日志**：仅英文。用 `process.env.NODE_ENV === 'development'` 守卫或移除。
- **组件**：函数式 + Hooks。最大约 500 行 — 超出则提取 hooks/子组件。`*Base` 后缀用于纯 UI（展示层），包装组件用于连接层（含 hooks/stores）。
- **基础文档与注释**：新增或修改函数、枚举、组件、接口、API models 时，必须补充简洁中文注释，说明用途、关键参数、返回结构或业务语义。注释要解释“为什么/是什么”，不要重复代码本身。结构不明显的目录可新增 `README.md`，用一句话说明职责，例如：`list` 是活动列表，`details` 存放每一个活动详情。
- **TypeScript 显式类型**：函数必须声明入参与返回类型；React 组件必须使用 `FC<Props>` 或 `FunctionComponent<Props>` 描述 props 结构；接口/models 必须提供最基本字段类型。禁止依赖隐式 `any`、未声明返回类型或松散对象结构来通过编译。
- **样式**：Tailwind v4 设计令牌 + `cn()`。禁止裸写 `text-[14px]` 或 `bg-[#xxx]`。详见 `frontend.md` §5 令牌参考。
- **文案**：仅用 i18n `t('key')`，禁止硬编码。
- **导入**：`@/components/`、`@/api/`、`@/utils/`、`@/hooks/`、`@/stores/`、`@/constants/`。
- **提交**：Conventional Commits，scope/type 保持英文规范，提交标题和正文说明使用中文。
- **禁止魔法字符串**：使用 Enum / Constant（`StorageEnum`、`DomIdEnum`）。
- **强类型事件**：EventObserver 事件负载必须定义 Interface。
- **图标**：优先使用 icon2。缺少图标时，从设计稿导出 SVG 放入 `src/assets/icons2/`，执行 `pnpm icon2:build` 生成组件，再从 `@/components/icons2/...` 导入；`pnpm icon2:preview` 可预览。单色图标用 `className` 控色，例如 `<UserOutlined className="text-red-400" />`；多色图标传完整颜色数组，例如 `<UserOutlined colors={['#f00', '#080']} />`。
- **Logo**：所有 logo 使用 `Logo` 组件渲染，不要手动引用 logo 资源。
- **不可变性**：禁止修改参数。返回 `{ ...param, field: value }`。
- **禁止类型 hack**：禁止 `as any`、`as unknown as X`。修复类型定义。不要一股脑儿写 `biome-ignore`；仅允许针对无法消除的问题做单点忽略，并写清原因。
- **区域导航**：`Link`/`useRouter`/`redirect` 仅从 `@/i18n` 导入。`window.location` 仅用于外部/协议/重载场景。详见 `frontend.md` §7。
- **禁止动态 `require()`**：仅使用静态 ES `import`。
- **错误处理**：fire-and-forget promise → `.catch()`。`Toast.error(msg, { id })` 用于去重。
- **禁止跨模块私有导入**：禁止导入其他模块的 `_*` 目录。移动到 `@/hooks/`、`@/utils/`、`@/constants/`。
- **文件分离**：`constants.ts` = 静态数据。派生值/辅助函数 → `utils.ts`。
- **禁止 "services" 目录**：使用 `hooks/` / `utils/` / `logic/` / `constants/` / `stores/`。
- **CSS 优先**：视觉效果优先使用纯 CSS 而非 JS。
- **组合优先于重新实现**：先穷尽库的扩展点，再考虑重新实现。
- **复用共享组件**：构建 UI 原语前先检查 `src/components/`。
- **谨慎修改全局组件**：`src/components/` 中的共享组件影响面大，修改前必须确认使用范围、状态组合、桌面/移动端表现，不做局部页面假设。
- **始终用 Modal，禁止 Dialog**：`Modal` 来自 `@/components/modal/modal` + `useState`。
- **不要新增 `aria-*`**：如只是为了样式选择器，使用 `data-*`。遇到第三方组件自带属性时不要为样式依赖扩大使用。
- **设备模式判断**：Desktop/mobile 从 user-agent 判断。开发或测试手机模式时，UA 必须包含 `mobile` 字符串。

## 4. 常用任务

> 参考：`.agent/references/common-tasks.md` — 新增 API、新增图标、新增页面/路由（generateMetadata）、新增模块、响应式、测试桩 / 局部假数据方案。

## 5. 领域参考

- `.agent/references/sportradar-uof.md` — 体育数据逻辑（WS、市场/赔率/specifier）
- `.agent/references/figma.md` — 设计令牌、图标/图片导出
- `.agent/references/icon-conventions.md` — 模块前缀命名、SVGR 清理
- `.agent/references/production-safety.md` — 测试页面守卫、环境隔离
- `.agent/references/cr-anti-patterns.md` — CR 反模式速查表
- `.agent/references/modules-overview.md` — 业务模块全景（12 个模块详解）
- `.agent/references/shared-components.md` — 共享 UI 组件库概览
- `.agent/references/stores-hooks-utils.md` — 全局 Stores / Hooks / Utils / Constants / Libs 详解
- `.agent/references/api-routes-i18n.md` — API 层、路由结构、国际化、Mock 系统详解
