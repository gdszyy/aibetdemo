# 串关加赔 CMS 计划（PRD 对齐版）

## Summary

目标：在另一个 Next CMS 项目里实现串关加赔 CMS MVP，并按后端已对齐接口落地。

PRD 对齐结论：

- 活动配置是全局唯一配置：同一时刻只有 1 份生效配置，运营在后台上线、修改、下线。
- CMS 只做活动配置、体育数据选择器接入、推荐卡片管理、新建推荐卡片、下线原因录入。
- 不做活动列表、活动详情、推荐卡片详情、推荐卡片状态查询、操作日志查询、已选范围反查接口。
- 后端已对齐 3 类能力：活动更新/下线 reason、推荐卡片列表、推荐卡片 `legs` outcome 结构。

## PRD 对齐依据

- 活动唯一配置：PRD §3.1 写“同一时刻系统里只有 1 份生效配置”，运营流程是“上线一份配置 → 用一段时间 → 改 / 下线”。
- 活动配置表单：PRD §3.1 mock 包含活动名、开始/结束时间、封顶串数、单关最低赔率、单注加赔金额上限、准入/拒绝标签、阶梯、适用范围。
- 状态机：PRD §3.2 写只有上线/下线两种核心状态，无草稿/复核；修改配置 version +1；上线必须带结束时间；到期自动下线。
- 下线：PRD §3.4 写手动下线要“必填下线原因”，活动状态切到已下线，并联动推荐卡片 DEL006 自动下架。
- 体育数据选择器：PRD §8 写选择器用于活动适用范围和推荐卡片组合投注项；L1-L6 为数据源、体育、地区、联赛、比赛、盘口/投注项。
- 推荐卡片管理：PRD §7.1 写 CMS 第一屏看现存卡片实时状态、删除失效卡片、调顺序、新建；状态包含健康、降级、前端隐藏。
- 推荐卡片创建：PRD §7.2 写卡片标题、自动绑定当前唯一生效活动、组合里的投注项 2-12 条，不能少于 `min_legs`。
- 推荐卡片数据：PRD 附录 H 写 `legs = array<B>`，outcome 级，含完整 6 层 ID，2-12 条。
- 本期不做：PRD §10 明确不做用户分群/准入限制、强制复核、适用范围 exclude 等；所以 CMS 里相关能力只留字段或禁用态，不做完整功能。

文档中已删除/改正旧缺口：

- 删除 `GET /v1/event/boost/list`
- 删除 `GET /v1/event/boost/:id`
- 删除 `POST /v1/event/boost/:id/offline`
- 删除 `GET /v1/event/recommend_card/:id`
- 删除 `POST /v1/event/recommend_card/status`
- 删除 `GET /v1/event/operation_logs`
- 删除 `POST /sports/resolve`
- `/sports/{source_id}/{event_id}/markets` 保留为“补响应结构”，不作为缺接口

## CMS 实现计划

### 1. 活动配置页

页面入口：`活动管理 / 串关加赔 / 活动配置`

页面职责：

- 展示当前唯一配置
- 新建配置
- 编辑当前配置并保存生效
- 下线当前配置并录入原因
- 不展示活动列表，不做历史版本列表

页面状态：

- 无配置：空态 + “新建配置”
- 生效中：展示配置概览 + 编辑 + 下线
- 已下线：展示下线状态；不原地重新上线，按 PRD 重新上线视为新配置

概览区字段：

- 活动名
- 国家 ID / 国家编码
- 状态
- 版本号
- 开始时间 / 结束时间
- 封顶串数
- 最低串数：由 ladder 第一档派生，只展示，不编辑
- 单关最低赔率
- 单注加赔金额上限
- 阶梯摘要
- 适用范围面包屑
- 如果 `getConfig` 返回统计，则展示投注笔数和金额；没有则隐藏

编辑表单字段：

- `name`
- `country_id`
- `country_code`
- `start_time`
- `end_time`
- `legs`
- `min_odds_per_leg`
- `boost_cap_per_bet`
- `ladder`
- `scope_include`
- `pre_match_only` 默认 1
- `allow_tags / deny_tags`：本期 PRD 不做用户分群/准入限制，CMS 先禁用或隐藏；若保留字段，则默认空数组

前端校验：

- 活动名必填
- 开始/结束时间必填
- 结束时间晚于开始时间
- 时间窗不超过 180 天
- 封顶串数不小于 ladder 最大串数
- 单注加赔金额上限必填且大于 0
- ladder 至少 1 档
- ladder 串数不重复
- ladder boost 严格递增
- 适用范围至少 1 条 include
- 本期不支持 exclude

提交行为：

- 无配置时调 `POST /v1/event/boost/create`
- 有配置时调 `/boost/update/:id`
- 保存成功后刷新 `getConfig`
- 保存失败按后端错误码定位字段提示

下线行为：

- 点击下线弹确认框
- 必填下线原因
- 调 `/boost/update/:id`
- 请求语义：`status=2 + reason`
- 成功后刷新 `getConfig`
- reason 不作为活动字段展示，只作为下线动作输入

### 2. Ladder 编辑器

职责：编辑活动阶梯。

字段：

- 串数 `legs`
- 加赔比例 `boost`
- 展示倍数 `multiplier = 1 + boost`

交互：

- 新增一档
- 删除一档
- 自动按串数排序或提交前排序
- 显示派生 `min_legs = ladder[0].legs`
- 显示封顶约束：最高档不得超过封顶串数

PRD 口径：

- 加赔比例严格递增
- 串数允许跳档
- 跳档时后端按向下取档
- `min_legs` 不在 CMS 表单中

### 3. 体育数据选择器接入

活动范围模式：

- mode = `scope`
- 用于 `scope_include`
- 多选
- 只 include
- 可选到 L2-L5：体育、地区、联赛、比赛
- 选择结果保存 ID + 展示面包屑
- 回显直接使用后端返回的 `breadcrumb`，不新增 resolve 接口

推荐卡片投注项模式：

- mode = `outcome`
- 必须选到 L6 outcome
- 多选
- 最多 12 条
- 不允许 exclude
- 每条保存 `source`、`event_id`、`event_id_type`、`product`、`product_raw`、`market_id`、`specifiers`、`outcome_id`

异常态：

- 赛事已开赛：禁选或灰显
- 赛事取消：禁选并展示状态
- 数据源超过 24 小时未同步：展示警告
- 搜索空结果、接口失败、加载中要有状态

### 4. 推荐卡片管理页

页面入口：`活动管理 / 串关加赔 / 推荐卡片`

页面职责：

- 展示现存推荐卡片
- 新建推荐卡片
- 手动下架
- 删除
- 展示健康/降级/隐藏/已下架状态
- 不做编辑；PRD 明确只能删除 + 新建

列表字段：

- 排序位置
- 卡片标题
- 绑定活动
- 国家
- 状态：published / offline
- 健康状态：healthy / degraded / frontend_hidden / offline
- 当前命中档位
- 有效 outcome 数 / 总 outcome 数
- 下架原因 `delisted_reason`
- 下架时间 `delisted_at`
- 创建时间 / 更新时间

状态口径：

- 绿色：所有 outcome 合规，命中最高档
- 黄色：部分 outcome 失效，但剩余有效数仍大于等于 `min_legs`
- 红色/前端隐藏：剩余有效数小于 `min_legs` 或赔率低于门槛
- 后端结构性下架：比赛开赛 DEL001、投注项失效 DEL002、活动下线 DEL006、运营手动下架 DEL000
- 赔率变化只由前端实时显隐，不改后端 status

操作：

- 新建：打开新建弹窗
- 下架：调用现有下架接口，填写下架原因如后端要求
- 删除：二次确认后调用删除接口
- 排序：PRD 有排序诉求；若本期后端无排序接口，则先只展示 position，不实现拖拽/上移下移

### 5. 新建推荐卡片弹窗

字段：

- 标题 `title`
- 绑定活动：自动绑定当前唯一生效活动，不可手选
- 组合投注项 `legs`：通过体育选择器 outcome 模式选择
- 首页位置：PRD 文本有“默认尾部追加”，mock 里有 position；本期以默认尾部追加为准，除非后端已支持 position

校验：

- 必须有当前生效活动
- 标题必填
- outcome 数量 2-12
- outcome 数量不能少于活动 `min_legs`
- outcome 必须是 L6
- outcome 必须全部在活动适用范围内
- outcome 未开赛、未失效
- outcome 赔率满足活动最低赔率

提交：

- 调 `POST /v1/event/recommend_card`
- `legs` 传 outcome 对象数组，字段为 `source`、`event_id`、`event_id_type`、`product`、`product_raw`、`market_id`、`specifiers`、`outcome_id`
- 成功后刷新推荐卡列表

### 6. 文档更新位置

更新 [docs/parlay-boost-api.md](/Users/abc/sport/match-pc/docs/parlay-boost-api.md)：

- 修改 `1.4 下线活动`：补充 `reason` 是下线动作参数，不入活动表
- 修改 `3.1 新建推荐卡片`：明确 `legs` 是 outcome 对象数组，不是串数数组
- 修改 `5. 对接待确认`：保留字段命名统一、markets 返回结构待补
- 替换 `6. CMS MVP 后端缺口`：改为后端已对齐 3 项
- 新增 `7. CMS 实现计划`：写入上述页面、字段、动作、校验、接口依赖

## Test Plan

活动配置：

- 无配置时显示空态，可新建
- 有配置时完整回显
- 保存成功后刷新并显示新 version
- ladder 倒挂被拦截
- ladder 串数超过封顶被拦截
- 时间窗不合法被拦截
- 适用范围为空被拦截
- 下线未填 reason 不能提交
- 下线成功后状态刷新

体育选择器：

- scope 模式可选 L2-L5 include
- outcome 模式必须选 L6
- 已开赛/取消/失效项不可选或有明确提示
- 已选项删除后表单值正确
- 回显使用 breadcrumb，不调用 resolve

推荐卡片：

- 无生效活动不能新建
- outcome 少于 2 条不能提交
- outcome 少于活动 min_legs 不能提交
- outcome 超过 12 条不能提交
- outcome 不在活动范围内不能提交
- 创建成功后列表刷新
- 下架和删除有二次确认
- 列表正确展示健康/降级/已下架/前端隐藏状态

## Assumptions

- 另一个 Next CMS 项目已有基础布局、权限、表单、表格、弹窗、请求封装。
- 这次只产文档和 CMS 实现计划；Plan Mode 下不改文件。
- 后端 `getConfig` 能支撑当前配置回显。
- 推荐卡片列表接口会返回足够列表展示的状态摘要；不新增详情和状态查询。
- 操作日志/告警由后端内部记录，本期 CMS 不做日志查询页。
