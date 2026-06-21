# 语言 / 区域 / 时区 / 货币解耦 (已归档)

> 5 维度解耦: Lang, Region, Timezone, Currency, DocumentType | 创建 2026-03-15 | 更新 2026-03-28

## 概览

| # | 事项 | P | 状态 |
|---|------|---|------|
| 1 | `REGION_CONFIG` → `REGION_REGISTRY` (按 RegionCode) | P0 | ✅ |
| 2 | `regionStore` (Zustand + persist) | P0 | ✅ |
| 3 | 认证表单 country code Select 下拉 (+55/+52) | P0 | ✅ |
| 4 | 认证表单 phonePattern 动态 schema | P0 | ✅ |
| 5 | `useWallet.ts` 去 locale 耦合 | P1 | ✅ |
| 6 | KYC — `verifyIdentityDocument(val, config)` | P1 | ✅ |
| 7 | `app-shell.tsx` 登录后 region 自动检测 from `user.phone` | P1 | ✅ |
| 8 | `layout.tsx` SSR 兼容 | P1 | ✅ |
| 9 | Currency 选择 + `setCurrency()` | P2 | ✅ |
| 10-10e | displayName 解绑, 移除 US region, skipHydration SSR 修复, Select 样式, i18n | P0-P1 | ✅ |
| 11 | i18n 目录重构: `region/` (constants, types, utils) + `locale/` | P1 | ✅ |
| 12 | CPF → ID 泛化 (表单字段, i18n, 变量) | P1 | ✅ |
| 13 | `SUPPORTED_REGION_CODES` + 条件下拉 | P1 | ✅ |
| 14 | Timezone/Currency 正式 UI | P2 | ⏳ 延期 |
| 15 | 后端 `cpf` → `id_number` 字段迁移 | P1 | ✅ |
| 16 | `normalizePhone` 归一化 | P1 | ✅ |
| 17 | Deprecated 清理 | P1 | ✅ |
| 18 | `INVARIANT_LOCALE` 常量替换硬编码 `'en-US'` | P1 | ✅ |

## 架构

### 5 维度独立存储

| 维度 | 来源 | 存储 | 消费 |
|------|------|------|------|
| **语言** | URL `[locale]` + cookie `NEXT_LOCALE_2` | next-intl | `useLocale()`, `useTranslations()` |
| **区域** | 用户选择 / phone 自动检测 | Zustand persist (`regionStore`) | `useRegion()` → 电话前缀, ID 类型, 货币 |
| **时区** | 用户选择 / 浏览器自动 | Cookie `app-timezone` | `TimezoneSynchronizer`, `useIntlFormatter()` |
| **货币** | API 驱动 + 区域默认币种回退 | React Query + `regionConfigs.currencyCode` | `useCurrencyCode()`, `useCurrencyId()`, `formatCurrency()` |
| **证件类型** | 区域派生 | `REGION_REGISTRY[region].documentType` | KYC 表单字段标签 |

### 关键文件
- `src/i18n/region/`: `REGION_REGISTRY`, `SUPPORTED_REGION_CODES`, 电话下拉配置
- `src/stores/region-store.ts`: Zustand persist, `skipHydration` 用于 SSR
- `src/i18n/locale/`: locale 路由配置, `INVARIANT_LOCALE = 'en-US'`

### 支持区域
- BR (pt, +55, CPF) / MX (es, +52, CURP)。US 已移除。
- `SUPPORTED_REGION_CODES.length < 2` → 静态文本 (不显示下拉)

### 不在范围内
- 多币种同时使用 (单一活跃币种)
- 自动翻译/机翻
- `Intl.DateTimeFormat` 替换 dayjs (已使用 `useIntlFormatter` / `useRegionIntlLocale`)
