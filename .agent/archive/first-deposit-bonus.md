# 首充活动 V1 (已归档)

> 首充促销系统 — Promo Code + 阶梯 Bonus + 活动列表/详情 | 创建 2026-03-20 | 更新 2026-03-26

## 概览

| # | 事项 | P | 状态 |
|---|------|---|------|
| **阶段一：API 层** | | | |
| 1-3 | 数据模型, API 接口 (优惠码验证+首充状态), MSW mock | P0 | ✅ |
| **阶段二：充值优惠码** | | | |
| 4-7 | 优惠码输入框 (debounced 500ms), 5 种验证状态 UI (策略模式), 提交集成, Banner 位 | P0-P1 | ✅ |
| **阶段三：活动列表** | | | |
| 8-11 | `/sports/promotions` + `/casino/promotions`, 卡片组件, 排序, 空状态 | P0-P1 | ✅ |
| **阶段四：活动详情** | | | |
| 12-14 | `/promotion/[id]` 详情页, CTA, 内容区域 | P0-P1 | ❌ 未开始 |
| **阶段五：Bonus 卡片** | | | |
| 15-16 | 奖励卡片 + 转现确认弹窗 | P1 | ❌ (部分在 transaction/balance V2 `BonusCard` 中实现) |
| **阶段六：集成** | | | |
| 17-19 | 侧边栏接通, 首页 Banner, i18n | P1-P2 | ✅ (Banner 待做) |
| **阶段七：真实 API** | | | |
| 20-25 | 真实 API 接通, mock 清理 | P0 | ✅ (25: MSW BASE_URL 待修 → 应用 PAYMENT_SERVICE) |

## 已有代码
- **路由**: `/promotion` 静态着陆页, `/casino/promotions`
- **模块**: `src/modules/marketing/promotion/` — hero, how-it-works, promo-codes, bonus-details, terms, responsible-gaming
- **API**: `GetFirstRechargeStatusInterface`, `GetFirstRechargeDefaultStatusInterface` (公开端点)
- **优惠码**: 客户端基于 status 数据本地校验 (非 API 调用)
- ⚠️ **CR 待修**: 着陆页硬编码西班牙语 (无 i18n), 大量裸色值

## 业务规则
| 规则 | 详情 |
|------|------|
| 阶梯顺序 | 首充 → 二充 → 三充，不可跳级 |
| 一次性 | 每阶段优惠码只能成功使用一次 |
| 时间限制 | 活动结束 → 所有未使用券失效 |
| 支付失败 | 返还优惠券，不消耗 |
| Bonus 计算 | `Min(充值金额 * 比例, 最大限额 * 比例)` |
| 转现规则 | bonus 余额 > 最大派彩 → 超出清零 (需二次确认) |
| 金额校验 | 充值金额 < 券起充额 → 阻止提交 + 提示 |
