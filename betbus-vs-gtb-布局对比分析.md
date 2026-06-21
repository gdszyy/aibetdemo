# betbus.mx vs GTB 核心功能布局对比分析

> 勘察对象：betbus.mx（线上实测，2026-06-16，已登录态）
> 对照对象：本仓库 GTB 前端（`match-pc`）现有实现
> 目标：GTB 完全按 betbus 布局转型，本文按「betbus 布局形态 → GTB 现状 → 改造对应」逐模块拆解，PC 与移动端分别对照。
> 勘察方式：PC 端直接访问；移动端因 betbus 按 viewport 宽度做响应式（非纯 UA），用同源 412px iframe 还原真实移动布局。

---

## 0. 一句话核心结论

| 维度 | betbus 范式 | GTB 现状 | 转型动作 |
|------|------------|---------|---------|
| 体育导航 | **一级导航跳转「运动专题页」**，竞赛树在专题页正文里 | **侧边栏三级父子树**（运动→类别→赛事，原地内联展开） | 侧边栏降级为纯一级入口；竞赛树搬到专题页正文 |
| 投注单（PC） | **悬浮**：右下角弹层，随选择出现/折叠，盖在内容上 | **固定**：右侧 sticky 整列面板（`BetSlipPanel`） | 固定列改为右下角悬浮弹层 |
| 投注单（移动） | 底部停靠条 → 上拉抽屉 + 自绘数字键盘 | 底部摘要条 → 抽屉（`BetSlipBottomSheet`） | 形态相近，补自绘键盘/改造细节 |
| 比赛详情 | 含**每场直播聊天室**（PC 右栏 / 移动 Tab）+ 天气场馆头 | 仅 `apuesta`/`analytic`，**无聊天室** | 新增聊天室 + 天气场馆头 + 盘口分类细化 |
| 顶部主导航 | 5 项：体育/滚球/娱乐场/**直播**/**我的投注** | 3 项：体育/滚球/娱乐场 | 增 Transmisión、Mis Apuestas |
| 底部 TabBar | 首页/滚球/**直播**/**我的投注**/娱乐场 | 首页/滚球/**投注单**/娱乐场/**我的** | 替换 2 项 |

> 用户给的两个样例差异（投注车固定/悬浮、体育导航三级树/一级跳专题页）都已被实测确认，是 betbus 与 GTB 之间**最结构性的两处布局分歧**。

---

## 1. 导航与信息架构

### 1.1 顶部 Header / 主导航

**PC**

| | betbus | GTB |
|---|--------|-----|
| 顶部促销条 | 有独立顶条（Pagos 徽标 + 充值返利文案 + 右侧 APP/赔率制式 Americano/设置图标） | `--header-strip-height` 顶条（促销/世界杯入口） |
| 主导航栏 | Logo + 水平主导航 **DEPORTES / EN VIVO / CASINO / TRANSMISIÓN / MIS APUESTAS** + 右侧 PROMOCIONES、Depositar(绿)、余额/头像 | 汉堡(折叠侧栏) + Logo + `DesktopMenu`(体育/滚球/娱乐场+各娱乐大厅，Embla 可横滑) + 右侧 `Logined`/充值 |
| 一级入口数 | **5 项**，含直播流、我的投注 | **3 项**（体育/滚球/娱乐场） |

- GTB 顶部主导航来源：`src/modules/home/_components/navigation-bar/desktop-menu.tsx` + `_constants/nav-menus.ts`（`FIXED_NAV_ITEMS` = sport / sport-live / casino）。
- **改造**：在 `FIXED_NAV_ITEMS` 增加 `TRANSMISIÓN`（直播流）与 `MIS APUESTAS`（我的投注）两个一级入口。

**移动**

| | betbus | GTB |
|---|--------|-----|
| 顶栏 | ≡ 汉堡 + Logo + 礼包 + Depositar + 余额/头像（单行） | `NavigationBar` 移动态：`MobileNav`(汉堡) / Logo + 访客快捷登录；滚动上移隐藏 |
| App 下载条 | 顶部常驻「Betbus App / ABRIR」横幅 | 无常驻下载条 |

### 1.2 体育导航模型（最关键差异）

**betbus：一级导航 → 运动专题页**

- 左侧栏（PC）/汉堡抽屉（移动）是**扁平列表**：
  快捷区（En Vivo、Principales Eventos、Próximos、CLUB VIP、Promociones、Tabla de Líderes）→「Populares」热门联赛 →「Todos los Deportes」运动清单（每项带赛事计数 + 收藏星）。
- 点击某运动（如 Fútbol）→ **跳转独立专题页 `/soccer`**，侧边栏**不**原地展开树。
- 竞赛层级**全部在专题页正文**里（见 1.3）。
- 比赛详情页时，左侧栏**收成纯图标轨**（~60px）。

**GTB：侧边栏三级父子树**

- 左侧栏 = `SIDEBAR_MENUS`（Lobby/Promotions/VIP/Favorite）+「Top Sports」组。
- 每个运动是**可内联展开的树节点**（`src/modules/match/sidebar/sport-item.tsx`）：
  点击运动**既跳** `/sports/{sport_id}` **又原地展开** → 热门赛事 `tournamentList` + 类别 `categoryList`（`CategoryItem` 再展开到 `TournamentItem`）。
  即 **运动 → 类别 → 赛事** 三级树，全在侧栏内。
- 侧栏宽度 `--sidebar-width-expand: 230px` / `--sidebar-width-collapse: 60px`。

**改造对应**

1. 侧边栏 `SportItem` 去掉 `Collapsible` 内联树（移除 `categoryList`/`tournamentList`/`CategoryItem` 渲染），运动行降级为**纯一级 Link → 运动专题页**。
2. 把竞赛树从侧栏迁到专题页正文（见下）。
3. 比赛详情页让侧栏走 collapsed 图标轨形态（GTB 已有 collapsed 分支，可复用）。

### 1.3 运动专题页（「导航专题页」的正文结构）

**betbus `/soccer`（PC 与移动同构，移动为单列）**

```
绿色 Hero（运动名 + 运动插画）
├─ Tab：Partidos（赛程） / Futuras（冠军盘/Outright）
├─ Partidos Destacados（精选赛事横向卡片轮播：联赛 + 双队 + 时间 + 1/X/2）
├─ Próximos Partidos（Próximas 12 Horas / 24 Horas 时间快筛 + 计数）
├─ Todas las Competiciones（A–Z 字母筛选条：TODOS A B C …）
└─ 竞赛分组
   ├─ Popular（热门联赛，多列网格，行尾 ›）
   └─ 按国家手风琴（Inglaterra / Alemania / Italia / España / Clubes Internacionales…）
      └─ 展开 → 该国联赛（→ 联赛页）
```

**GTB `/sports/{sport_id}`**

- `SportsPage` = Banner 轮播 + `MatchFilter`（仅移动、热门页）+ 运动专属赛事列表（`src/modules/match/home/`）。
- 竞赛树在**侧栏**而非页面；无 A–Z 字母筛选、无页面内国家手风琴、无 Partidos/Futuras 双 Tab（Outright 是独立路由 `leagues/[tournament_id]/outright`）。

**改造对应**：在运动页正文搭建 betbus 同款结构 —— Hero + Partidos/Futuras Tab + 精选轮播 + 12h/24h 时间快筛 + A–Z 字母筛选 + Popular 网格 + 国家手风琴树。数据源可复用现有 `GetMenuCategories`/`GetMenuHotTournaments`。

### 1.4 移动端体育导航

| | betbus | GTB |
|---|--------|-----|
| 顶部运动条 | 首页横向**运动图标条**（En Vivo/Mundial/Fútbol/Casino/Béisbol…可横滑），点击→专题页 | `match-filters/index.tsx`（Embla 横滑圆形运动图标，**仅热门页**），点击→`/sports/{id}` |
| 全量导航 | ≡ 汉堡 → 左侧抽屉（同 PC 扁平列表） | `MobileNav` 汉堡 → 侧栏抽屉（**含三级树**） |
| 底部 TabBar | Inicio / En Vivo / **Transmisión** / **Mis Apuestas** / Casino | Home / Live / **BetSlip** / Casino / **Profile** |

- 运动条两端都有（相似）；差异在**汉堡抽屉内容**（betbus 扁平 / GTB 树）与**底部 TabBar 项**。
- GTB 底部条来源：`src/modules/home/_components/bottom-tab-bar.tsx`。
- **改造**：底部 TabBar 用 Transmisión + Mis Apuestas 替换 BetSlip + Profile（投注单改由悬浮/停靠条承载，账户入口移到头像）。

---

## 2. 投注购物车 / 投注单（固定 vs 悬浮）

### 2.1 PC —— 核心差异

**betbus：悬浮弹层（右下角）**

- 选中赔率后，**右下角**冒出投注单，**盖在右侧促销栏之上**，无选择时不占位。
- 单选：紧凑卡（选项 + 市场 + 赛事 + Importe Apostado 输入 + Recordar 开关 + Realizar Apuesta）。
- 多选：折叠成「Parlay (N) +总赔率」条 + 「Mostrar Selecciones」展开器。
- 展开态：向上生长的面板 —— 头部「N Selecciones / Saldo / Eliminar Todo / BB Crear Apuesta」+ 每注独立 stake 输入 + Parlay 行 + 「Mostrar más múltiplos」(系统注) + Realizar Apuesta。

**GTB：固定右侧列**

- `SportsLayoutClient` 中右侧 `<aside sticky top-[72px] h-screen>` 内挂 `{betSlipDrawerOpen && <BetSlipPanel />}` + `RightAside`（含 `CartToggleButton`）。
- `BetSlipPanel`（`src/modules/bet-slip/slip/bet-slip-panel.tsx`）是**整列固定面板**，由 `CartToggleButton` 开关；设置面板从其左侧滑出。

| 维度 | betbus | GTB |
|------|--------|-----|
| 形态 | 右下角**悬浮弹层** | 右侧**固定整列** |
| 触发 | 有选择即自动浮现 | 手动 `CartToggleButton` 开关 |
| 占位 | 不占布局，盖内容 | 占据右栏宽度 |
| 折叠 | 多选折叠成赔率条 | 整列展开/收起 |

**改造对应**：把 `BetSlipPanel` 从右 `aside` 固定列中拆出，改为**右下角 fixed 悬浮层**（随 `selections.length>0` 自动浮现、可折叠成 Parlay 条）。右栏 `aside` 仅保留 `RightAside`（促销）。复用现有 `bet-cart-store`/`bet-slip-store`，只改挂载位置与折叠态 UI。

### 2.2 移动 —— 形态相近

| | betbus | GTB |
|---|--------|-----|
| 停靠条 | 底部 TabBar 上方**停靠条**（选项摘要 + Establecer/Realizar Apuesta） | `MobileCartSummaryBar`（`selectionCount>0` 时出现） |
| 展开 | 上拉**底部抽屉** + **自绘数字键盘** + 快捷金额片（+$10/+$50/+$100/+$500）+ Recordar | `BetSlipBottomSheet` 抽屉 + `quick-stake-button` 快捷金额 |
| 赔率变动 | 「La disponibilidad… / Aceptar Cambio」接受变动提示 | 投注单异常/变动处理（已有） |

- 移动端两者范式一致（停靠条 → 抽屉）。betbus 用**自绘数字键盘**避免唤起系统键盘，GTB 目前以快捷金额按钮为主。
- **改造**：补自绘金额键盘；对齐「接受赔率变动」交互文案与位置。

---

## 3. 赛事列表与详情

### 3.1 赛事列表

| | betbus | GTB |
|---|--------|-----|
| 精选 | Partidos Destacados 横向卡片（联赛 + 双队 + 时间 + 1/X/2） | `hot-matches` / `hot-league-match-carousel` |
| 列表 | 赛事行（双队竖排 + 1/X/2 列 + 盘口数 + 时间） | 赛事卡/行（`MatchListBase`） |
| 分区 | 首页 Tab 分区（Eventos Populares / 指定联赛 / En Vivo / Juegos Populares） | `recommend-live-matches` / `super-odds` / `sports-activity` 等区块 |

- 列表层概念接近，主要差异在首页**横向 Tab 分区**与精选轮播的组织方式。

### 3.2 比赛详情（关键差异：直播聊天室）

**betbus —— PC（三栏）**

```
收窄图标侧栏 │ 中栏 │ 右栏
中栏：面包屑(运动›联赛›轮次) + 天气/场馆条(温度/风速/湿度/气压、体育场/容量/裁判/天气)
     + 绿色 Hero(双队 + 倒计时 + En Vivo) + Alineaciones/Previa(阵容/前瞻块)
     + 盘口 Tab：Todos / Crear Apuesta / Mercados Principales / Goles / Goleadores /
       Primera Mitad / Córners / Tarjetas / Especiales / Combinadas …
     + 盘口分组卡(Resultado Final、Potenciador de Momios 增强赔率、Más/Menos、Ambos Equipos…)
右栏：**直播聊天室 Chat**(Conectado / 用户消息含 VIP 徽章与表情 / 发送框)
投注单：仍是右下角悬浮
```

**betbus —— 移动（单列 Tab）**

- 顶部双队 Hero + 倒计时；Tab：**Apuesta / Chat / Alineaciones / Previa**；盘口子 Tab + 盘口分组竖排。聊天室是一个 Tab。

**GTB**

- 桌面：`MatchView`(运动信息) + `Markets` 并排，置于三栏壳（侧栏 + 内容 + 投注单面板）。
- 顶部 Tab：`MatchDetailTopTabs` = **`apuesta` | `analytic`**（无聊天、无独立阵容/前瞻 Tab，统计走 STATSCORE analytic）。
- 移动：`Markets` 作为 Tab 嵌入 `MatchView`（market/overview/historical/lineup）。
- **无每场直播聊天室**（仓库内 chat 仅 `support-floating`/`user-center/support` 客服）。

| 维度 | betbus | GTB | 改造 |
|------|--------|-----|------|
| 直播聊天室 | **有**（PC 右栏 / 移动 Tab） | **无** | 新增聊天室模块 + 挂载位 |
| 天气/场馆头 | 有 | 无（有 STATSCORE） | 新增比赛信息头 |
| 盘口 Tab 分类 | 细（含 Crear Apuesta 自建投注、Goleadores、Córners、Tarjetas、Especiales、Combinadas） | 粗（apuesta/analytic） | 细化盘口分类 + 补 Bet Builder |
| 详情 Tab | Apuesta/Chat/Alineaciones/Previa | apuesta/analytic | 增 Chat、拆 Alineaciones/Previa |

---

## 4. 账户与首页

### 4.1 首页

| | betbus（PC，三栏） | GTB（PC） |
|---|--------|-----|
| 左 | 体育导航侧栏 | `Sidebar`（树） |
| 中 | Banner 轮播 + 搜索 + **Ganancias Recientes 中奖滚动条**(体育/娱乐场赢家) + Tab 分区赛事 + 运动赛事列表 | Banner + 热门赛事/联赛 + 推荐滚球 + 超级赔率 + 体育活动 |
| 右 | **促销卡竖列**(世界杯/返现/排行榜/Telegram…)，部分页切 App 下载二维码 | `RightAside`(+ `CartToggleButton`)，较轻 |

- betbus 首页**中奖实时滚动条**与**重促销右栏**是显著特征；GTB 右栏更轻。
- **改造**：补中奖滚动条；右栏促销卡片化加重。

### 4.2 账户

| | betbus | GTB |
|---|--------|-----|
| 入口 | 点头像 → **下拉浮层**：余额 + Banco/Depositar + Bono Deportes/Casino + VIP 进度(XP) + 「Funciones Comunes」图标格(Mis Ofertas/Historial/Mensajes/Retirar) + 「Seguridad y Más」(Verificación/Juego Responsable/Soporte en Vivo/Ayuda/Configuración) | **路由化账户区** `/account/*`：`AccountSidebar`(桌面固定 60/200px) + 内容 + RightAside；移动 `/account` 卡片菜单 |
| 形态 | 头像气泡快捷菜单 | 完整路由页 + 侧栏 |

- betbus 用**头像下拉浮层**做账户聚合入口（再跳明细）；GTB 是**完整路由 + 账户侧栏**。
- **改造**：在头像处新增 betbus 同款下拉聚合浮层（余额/奖金/VIP/功能格），明细仍可复用现有 `/account/*` 路由。

---

## 5. 改造优先级建议（按结构性影响排序）

| 优先级 | 改造项 | 影响面 | 关键文件 |
|--------|--------|--------|---------|
| P0 | 体育导航：侧栏三级树 → 一级入口 + 运动专题页树 | 信息架构全局 | `match/sidebar/*`、`(sports)/sports/[sport_id]`、`home/sports-page` |
| P0 | 投注单：固定右列 → 右下角悬浮弹层 | 全站投注交互 | `sports-layout-client.tsx`、`bet-slip/slip/bet-slip-panel.tsx` |
| P1 | 比赛详情：新增直播聊天室 + 天气场馆头 + 盘口分类细化 | 详情页 | `match/detail/layout.tsx`、`match-detail-top-tabs.tsx` |
| P1 | 顶部主导航 + 底部 TabBar：补 Transmisión / Mis Apuestas | 导航 | `nav-menus.ts`、`desktop-menu.tsx`、`bottom-tab-bar.tsx` |
| P2 | 首页中奖滚动条 + 右栏促销卡片化 | 首页 | `home/*`、`right-aside` |
| P2 | 账户头像下拉聚合浮层 | 账户入口 | `navigation-bar/logined.tsx`、`account/*` |
| P2 | 移动投注单自绘数字键盘 + 接受赔率变动 | 移动投注 | `bet-slip/_components/*`、`cart/*` |

---

## 附：betbus 实测要点速查

- 移动布局**按 viewport 宽度**响应式（非纯 UA），<768px 切移动态。
- PC 投注单**悬浮右下**、随选择出现、多选折叠成 Parlay 条。
- 运动一级导航**跳专题页**（`/soccer`），竞赛树（Popular + 国家手风琴 + A–Z + 12h/24h 快筛）在专题页正文。
- 比赛详情**右栏是直播聊天室**（移动端为 Chat Tab），并有天气/场馆信息头。
- 底部 TabBar：Inicio / En Vivo / Transmisión / Mis Apuestas / Casino。
- 账户走**头像下拉浮层**聚合（余额/奖金/VIP/功能格）。
