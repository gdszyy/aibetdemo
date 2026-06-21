# betbus 差距开发 TODO

> 基准：`betbus-vs-gtb-布局对比分析.md` 的 2026-06-16 线上实测结论 + 当前代码核对。
> 目标：把当前已完成的 betbus 布局骨架继续推进到可验收的模块内容与真实交互。

## P0：结构与主流程补齐

- [ ] 运动专题页完整 betbus 化
  - 当前状态：已有一级运动入口、12h/24h、Popular、A-Z、国家手风琴。
  - 进展：已补完整专题首屏 Hero、`Partidos / Futuras` 分段、`Partidos Destacados` 横向精选赛事卡、Futuras 联赛入口。
  - 剩余差距：12h/24h 目前只是交互提示，未真实按时间过滤；首屏视觉仍需用 PC/移动视口继续微调到 betbus 密度。
  - 涉及模块：`src/modules/match/home/sport-topic-panel.tsx`、`src/app/[locale]/(main)/(sports)/sports/[sport_id]/page.tsx`。
  - 验收标准：运动页首屏结构与 betbus `/soccer` 范式一致；精选赛事、未来盘、全部竞赛入口清晰；移动端保持单列可扫读。

- [ ] PC 悬浮投注单内容交互对齐
  - 当前状态：投注单已从右侧固定列改为右下角 fixed 悬浮挂载。
  - 进展：已补 Parlay 多选摘要折叠条，展示 `Parlay(N)`、总赔率和 `Mostrar Selecciones / Ocultar Selecciones` 展开切换；已补 `Mostrar mas multiplos` 系统注预览入口。
  - 进展：已补桌面单注卡 compact 样式，压缩删除区、信息区、赔率字号、金额输入和快捷金额按钮。
  - 剩余差距：系统注仍是待后端下注能力接入的预览态；折叠/展开和 compact 卡片视觉仍需 PC 实机视口微调。
  - 涉及模块：`src/modules/bet-slip/_components/desktop-floating-bet-slip.tsx`、`src/modules/bet-slip/slip/*`、`src/modules/bet-slip/cart/*`。
  - 验收标准：无选项时不占位；有选项时自动浮现；单选/多选/展开/收起行为与 betbus 接近；右侧促销栏不再被投注单布局占位挤压。

- [ ] 移动投注单自绘数字键盘与赔率变动交互
  - 当前状态：移动端已有底部摘要条 + bottom sheet。
  - 进展：确认 `StakeInput` 移动端已接自绘 `NumericKeypad`，输入框 `readOnly` 避免唤起系统键盘；已清理键盘按钮文案为 `Del` / `Done`。
  - 剩余差距：`Aceptar Cambio` 类赔率变动确认位置仍需对齐；移动端真实视口仍需验收键盘遮挡与 bottom sheet 层级。
  - 涉及模块：`src/modules/bet-slip/_components/*`、`src/modules/bet-slip/cart/numeric-keypad.tsx`、`src/modules/bet-slip/cart/stake-input.tsx`。
  - 验收标准：移动端输入 stake 不唤起系统键盘；快捷金额、清除、确认、赔率变动接受链路完整。

## P1：比赛详情真实内容

- [ ] 比赛详情 Chat 从 mock 占位升级为真实模块
  - 当前状态：PC 右栏和移动 `Chat` Tab 已有占位 UI。
  - 剩余差距：缺真实消息源、发送框、用户/VIP 标识、连接状态、权限/登录态处理。
  - 涉及模块：`src/modules/match/detail/layout.tsx`、`src/modules/match/detail/match-detail-top-tabs.tsx`。
  - 验收标准：PC 右侧显示比赛聊天室；移动端 `Chat` Tab 可进入；未登录、发送失败、空消息、断线状态有明确反馈。

- [ ] 天气/场馆信息接入真实数据
  - 当前状态：`MatchConditionsBar` 使用 mock。
  - 剩余差距：缺后端字段映射、缺无数据降级展示。
  - 涉及模块：`src/modules/match/detail/match-conditions.tsx`、比赛详情接口模型。
  - 验收标准：有数据时展示温度、风速、湿度、气压、场馆、容量、裁判、天气；无数据时不出现假数据。

- [ ] Bet Builder / Crear Apuesta 接真实 SGP 数据
  - 当前状态：`BetBuilder` 使用 mock props，可做演示交互。
  - 剩余差距：缺真实 SGP 可选项接口、组合规则、赔率计算、下注链路。
  - 涉及模块：`src/modules/match/detail/bet-builder.tsx`、投注单 store、投注接口。
  - 验收标准：用户可选择同场组合项，实时得到组合赔率，并能进入投注单完成下注前校验。

- [ ] 详情页移动 Tab 内容补齐
  - 当前状态：已有 `Apuesta / Chat / En Vivo / Alineaciones / Estadisticas / Previa / Analytic` Tab 壳。
  - 剩余差距：`Chat`、`Alineaciones`、`Previa` 多数仍是 placeholder；`En Vivo` 与 STATSCORE/直播入口关系需统一。
  - 涉及模块：`src/modules/match/detail/layout.tsx`、`src/modules/match/detail/components/*`。
  - 验收标准：每个可见 Tab 都有真实内容或明确业务降级，不出现开发占位文案。

## P1：导航入口与业务页

- [ ] Transmision 从占位页升级为直播流页面
  - 当前状态：顶部/底部入口已接入，页面为占位。
  - 剩余差距：缺直播流服务、版权/可用性状态、直播列表或播放器布局。
  - 涉及模块：`src/modules/transmision/transmision-placeholder.tsx`、`src/app/[locale]/(main)/(sports)/sports/transmision/page.tsx`。
  - 验收标准：入口点击后不是占位页；可展示直播列表、不可用状态或真实播放器。

- [ ] Mis Apuestas 页面体验对齐
  - 当前状态：一级入口已接入，当前是基础页面/现有战绩承接。
  - 剩余差距：需核对 betbus 我的投注列表、状态筛选、投注详情、结算状态、空态。
  - 涉及模块：`src/app/[locale]/(main)/(sports)/sports/my-bets/page.tsx`、投注历史相关模块。
  - 验收标准：用户能按 betbus 类路径查看未结算/已结算/失败投注，进入详情并看到完整投注信息。

## P2：首页与右侧栏

- [ ] 首页模块排序与内容密度继续对齐
  - 当前状态：已加入中奖滚动条，保留活动、超级赔率、滚球推荐、热门赛事、赌场、热门联赛等模块。
  - 剩余差距：betbus 的首页横向 Tab 分区、赛事精选卡、赛事列表节奏仍需逐屏核对。
  - 涉及模块：`src/modules/home/sports-page.tsx`、`src/modules/home/_components/*`、`src/modules/match/home/*`。
  - 验收标准：首页首屏与下滑两屏的信息顺序、模块密度、移动端运动条/赛事流接近 betbus。

- [ ] 右栏促销卡片流加重
  - 当前状态：右栏更偏工具轨，投注单已移走。
  - 剩余差距：betbus 右栏是重促销卡片流，含世界杯、返现、排行榜、Telegram、App 下载等。
  - 涉及模块：`src/modules/home/_components/right-aside/*`、广告/活动接口。
  - 验收标准：PC 右栏在首页和赛事页能持续承载促销卡片，不只是投注入口。

## P2：账户入口

- [ ] 头像账户浮层内容补齐
  - 当前状态：头像浮层已接入。
  - 剩余差距：需要补齐/核对余额、Banco/Depositar、Bono Deportes/Casino、VIP 进度、Funciones Comunes、安全与更多入口。
  - 涉及模块：`src/modules/home/_components/navigation-bar/account-popover.tsx`、`src/modules/user-center/*`。
  - 验收标准：登录后点击头像出现 betbus 风格聚合浮层；常用账户动作无需先进入完整账户页。

## 开发准备清单

- [ ] 跑类型检查：`pnpm lint:ts`
- [ ] 跑 lint：`pnpm lint`
- [ ] 启动本地服务：`pnpm dev`
- [ ] 用 PC 视口验收：首页、运动专题页、比赛详情页、投注单、账户浮层。
- [ ] 用移动视口验收：首页底部 Tab、运动抽屉、投注单 bottom sheet、详情页 Tab。
- [ ] 清理开发占位文案：`Mock`、`placeholder`、硬编码西语/中文调试文字。
## 2026-06-18 移动端投注单进展

- [x] 底部摘要条改为更接近 betbus 的 CTA 型入口：左侧保留投注单徽标，中部压缩展示选项数、赔率、投注额、潜在收益，右侧显示 `Establecer` / `Realizar Apuesta`。
- [x] 自绘数字键盘补充 `Recordar` 开关，并通过 localStorage 持久化 UI 偏好。
- [ ] 剩余差距：`Aceptar Cambio` 类赔率变化确认仍未接入真实 odds-change pending 状态；移动端真实视口还需要验收键盘遮挡、bottom sheet 层级和 CTA 宽度。
