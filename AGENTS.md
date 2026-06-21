# GOTO

> 体育博彩与在线赌场平台（**GOTO**），基于 Next.js 16 (App Router)、React 19 和 Tailwind CSS v4 构建。模块化 DDD 架构，支持实时 WebSocket 数据、多语言（pt 默认/es/en）和 Zustand + React Query 状态管理。React Compiler 已启用。输出：standalone（CI 中容器化）。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript 5 |
| UI | React 19 + Radix UI |
| 样式 | Tailwind CSS v4 |
| 动画 | Motion |
| 状态 | Zustand（全局/模块）+ React Query（服务端） |
| 实时 | WebSocket（二进制协议 + BroadcastChannel + Leader Election） |
| 表单 | Zod + React Hook Form |
| 国际化 | next-intl（pt 默认, es, en） |
| Lint | Biome |
| E2E | Playwright |
| 包管理 | pnpm 10 |

## 目录结构

```
src/
├── app/[locale]/           # 路由 (pt/es/en) — (main)/(sports|casino|account), legal
├── modules/                # 业务模块 (DDD): match, bet-slip, casino, user, balance, transaction 等
│   └── <module>/           # _components/, _hooks/, _logic/, _utils/, _constants/ (下划线 = 私有)
├── api/                    # client.ts (fetchers), handlers/, models/, lib/
├── components/             # 共享 UI: Button, Input, Modal, Tabs, Sidebar, Toast, Drawer, TextField, Pagination 等
├── stores/                 # 全局 Zustand stores
├── hooks/                  # 全局 React hooks
├── utils/                  # 纯工具函数 + websocket/
├── constants/              # 全局常量 (query-keys, ui, sports-config, account-routes)
├── libs/                   # 第三方集成 (firebase, navigation, event-constants)
├── i18n/                   # 国际化 + 区域配置
└── replay/                 # 开发期录制 / 回放工具
```

**模块约定**：`_` 前缀目录为模块私有。禁止从其他模块的 `_*` 目录导入。公开导出通过模块根 `index.ts`。

## 命令

```bash
pnpm dev              # 开发服务器
pnpm build            # 生产构建
pnpm lint             # Biome 检查
pnpm lint:ts          # TypeScript 检查
pnpm icon:build       # SVG → React 组件
pnpm icon2:build      # SVG → 支持传色的 React 图标组件（src/assets/icons2 → src/components/icons2）
pnpm icon2:preview    # 预览所有 icon2 图标
pnpm sync:agents      # 同步 .agent/ → 所有 agent 配置
```

## API 客户端

使用 `src/api/client.ts` 中的实例 — 禁止硬编码 API URL：

| Fetcher | 服务 | 用途 |
|---------|------|------|
| `uofFetcher` | `NEXT_PUBLIC_UOF_SERVICE` | 体育数据、认证 |
| `userFetcher` | `NEXT_PUBLIC_USER_SERVICE` | 用户档案、短信、KYC |
| `paymentFetcher` | `NEXT_PUBLIC_PAYMENT_SERVICE` | 充值、提现 |
| `gameFetcher` | `NEXT_PUBLIC_GAME_SERVICE` | 赌场游戏 |
| `sportFetcher` | `NEXT_PUBLIC_SPORT_SERVICE` | 足球、篮球统计数据 |

## 行为准则

- **先计划**：编写代码前先分析并展示计划（`/a`）。等待审批。
- **禁止防御性 hack**：不编写"以防万一"的兜底代码来掩盖错误。
- **禁止自动提交**：除非明确要求，不 commit 或 push。
- **Meegle 提交格式**：修复 Meegle 任务时，commit 标题使用 `fix(meegle-<issue-id>): 中文说明`；commit 正文保留完整 Meegle 链接。
- **网络搜索**：提出代码模式前搜索最佳实践 — 非可选。
- **复用优先**：优先使用成熟的开源库而非自定义实现。

## 核心编码规范

- **组件**：函数式 + Hooks。最大约 250 行 — 超出则提取 hooks/子组件。
- **基础文档与注释**：函数、枚举、组件、接口、API models 必须有简洁中文注释，说明用途、关键参数、返回结构或业务语义；复杂目录可新增 `README.md` 用一句话说明职责，例如：`list` 是活动列表，`details` 存放每一个活动详情。
- **TypeScript 显式类型**：函数必须声明入参与返回类型；组件使用 `FC<Props>` 描述结构；接口/models 要定义最基本字段类型，禁止依赖隐式 `any` 或未声明的松散对象结构。
- **样式**：Tailwind v4 设计令牌（`text-body-sm`、`rounded-sm`），用 `cn()` 合并。禁止裸写 `text-[14px]` 或 `bg-[#xxx]`。响应式只用基础样式、`md:`、`max-md:`，不要写 `lg:*`。
- **文案**：必须使用 i18n `t('key')`，禁止硬编码。日志仅英文。代码注释和提交说明使用中文。
- **导入**：路径别名 `@/components/`、`@/api/`、`@/utils/`、`@/hooks/`、`@/stores/`、`@/constants/`。
- **区域导航**：`Link`/`useRouter`/`redirect` 仅从 `@/i18n` 导入 — 禁止 `next/link` 或 `next/navigation`（丢失 locale）。
- **不可变性**：禁止修改函数参数。返回新对象：`{ ...param, field: value }`。
- **禁止类型 hack**：避免 `as any`、`as unknown as X`。修复类型定义。不要一股脑儿写 `biome-ignore`，只能针对无法消除且已说明原因的单点例外。
- **错误处理**：所有 fire-and-forget promise 必须有 `.catch()`。使用 `Toast.error()` + `{ id }` 去重。
- **禁止跨模块私有导入**：不从其他模块的 `_*` 目录导入。
- **图标**：优先使用支持传色的 icon2。缺少图标时，从设计稿导出 SVG 放入 `src/assets/icons2/`，执行 `pnpm icon2:build` 生成组件，再从 `@/components/icons2/...` 导入。单色用 `className` 控色，多色用 `colors` 传入完整颜色数组。方向箭头用 `Arrow` / `DoubleArrow` 组件。
- **Logo**：各种 logo 必须通过 `Logo` 组件渲染，不要手动引用 logo 资源。
- **始终用 Modal，禁止 Dialog**：`Modal` 来自 `@/components/modal/modal` + `useState`，不用 `Dialog`。
- **窗口滚动**：应用使用原生 window scroll — 禁止将页面内容包裹在 `overflow-y-auto` 容器中。
- **强类型事件**：EventObserver 事件负载必须定义接口。
- **禁止魔法字符串**：使用 Enum / Constant（`StorageEnum`、`DomIdEnum`）。
- **CSS 优先**：视觉效果优先使用纯 CSS 而非自定义 JS 状态管理。
- **全局组件**：谨慎修改 `src/components/` 全局组件，改动前评估影响页面和复用场景。
- **ARIA**：不要新增 `aria-*`。若只是为了样式选择器，使用 `data-*`。
- **设备模式**：Desktop/mobile 由 user-agent 判断；开发或测试手机模式时 UA 必须包含 `mobile` 字符串。

## Agent 上下文

更深入的项目知识位于 `.agent/`：

| 目录 | 用途 | 加载方式 |
|------|------|----------|
| `.agent/rules/` | 编码规范 + 前端架构 | **始终**在启动时读取 |
| `.agent/plans/` | 实现计划（6 个计划） | **按需** — 仅加载与当前任务相关的计划 |
| `.agent/workflows/` | 斜杠命令：`/init`、`/a`、`/cr`、`/uc` | 使用命令时读取 |
| `.agent/references/` | 按需文档（Figma、图标、UOF、CR 反模式、模块概览、组件库、Stores/Hooks/Utils、API/路由/i18n） | **按需** — 仅在任务需要时读取 |

### 工作流

| 命令 | 描述 |
|------|------|
| `/init` | 初始化项目上下文 — 加载所有规则、计划、工作流 |
| `/a` | 分析实现计划 — 先计划，审批后再编码 |
| `/cr` | 按 P0-P6 清单进行代码审查 |
| `/uc` | 更新项目上下文 — 审查代码，更新计划和规则 |

## Agent skills

### Issue tracker

Issues and PRDs for this repo live as GitHub issues. See `docs/agents/issue-tracker.md`.

### Triage labels

This repo uses the default triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context layout with one root `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.
