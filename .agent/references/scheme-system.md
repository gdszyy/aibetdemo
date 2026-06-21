# 多配色方案系统（Scheme System） — GTB ↔ betbus

> 目的：用一套「命名配色方案」机制承载 betbus 布局转型。GTB（浅色+红）为默认方案，betbus（深色+绿）为可切换方案，并可低成本扩展第三套。**这不是明暗切换（light/dark），而是多套完整配色方案。**

## 1. 机制（零组件改动即可全站换肤）

三段式令牌链，切换方案只动第一段：

```
原始色变量(theme.css :root / :root.betbus)
        ↓  被 @theme 间接引用
--color-*(tokens.css @theme：--color-x: var(--原始变量))
        ↓  被工具类使用
bg-* / text-* / border-*(组件)
```

next-themes 以 `attribute="class"` 把方案名挂到 `<html>`（即 `:root`）。选中 betbus → `<html class="betbus">`，`:root.betbus` 覆盖的原始变量会沿 `--color-*` 间接层在该子树重解析，所有颜色工具类自动换肤。`:root.betbus`（0,2,0）特异性高于 `:root`（0,1,0），覆盖稳定生效。

## 2. 改动文件

| 文件 | 改动 |
|------|------|
| `src/assets/css/theme.css` | `:root` 新增语义表面层（`--surface-1/2/3`、`--on-brand`）；新增 `:root.betbus {}` 覆盖块（主色环/灰阶反转/neutral-black 反转/表面/功能色 + `color-scheme:dark`） |
| `src/assets/css/tokens.css` | `@theme` 注册 `--color-surface-1/2/3`、`--color-on-brand` → 生成 `bg-surface-1`、`text-on-brand` 等 |
| `src/assets/css/base.css` | `@utility account-card` 背景 `--neutral-white-h` → `--surface-1` |
| `src/components/theme-provider/theme-provider.tsx` | `themes={['gtb','betbus']}`、`defaultTheme='gtb'`、`enableSystem={false}`；导出 `SCHEMES`/`Scheme`/`DEFAULT_SCHEME` |
| `src/components/scheme-switcher/scheme-switcher.tsx` | 新增：悬浮调试切换开关（左下角，`setTheme` 切换；上线可加 `NODE_ENV` 守卫或移除） |
| `src/components/providers/root-providers.tsx` | 在 `ThemeProvider` 内挂载 `<SchemeSwitcher />` |
| `src/**/*.tsx,ts`（138 文件） | 表面用途 `bg-neutral-white-h` → `bg-surface-1`（228 处）。**`text-neutral-white-h` 保持不动**（品牌色块上的白字） |

## 3. 语义表面层（为何要它）

`neutral-white-h`（=白）在旧代码里被重载为两种相反用途：
- `bg-neutral-white-h` → 白色卡片/弹层底（深色方案下需变深）
- `text-neutral-white-h` → 品牌/功能色块上的白色文字（深色方案下仍需白）

一个变量无法同时满足。因 `bg-` 与 `text-` 是不同工具类，故拆解为：保留 `--neutral-white-h=白` 专供 `text-` 用；新增 `--surface-1/2/3` 专供底色，由方案各自取值。这样 betbus 深色不会把品牌按钮上的白字也改黑。

## 4. betbus ↔ GTB 配色映射

| 项目原始变量 | GTB（:root 默认） | betbus（:root.betbus） | 语义/用途 |
|------|------|------|------|
| `--brand-primary-0` | `#e80104` | `#26c07a` | 主色 |
| `--brand-primary-1` | `#fff0f0` | `#11271e` | 主色最浅底（深色下=深微绿） |
| `--brand-primary-2` | `#ffdddd` | `#173a2a` | 主色次浅底 |
| `--brand-primary-3` | `#ff9697` | `#5fd89c` | 浅主色 / hover |
| `--brand-primary-4` | `#c70003` | `#1b9e61` | 深主色 / 按下 |
| `--brand-primary-5` | `#4f0001` | `#0a2e1e` | 最深主色 |
| `--filltext-ft-a` | `#f5f6f8` | `#0f0f0f` | 页面最底（html bg） |
| `--filltext-ft-b` | `#f0f2f5` | `#161616` | 次级底 |
| `--filltext-ft-c` | `#e2e5ea` | `#242424` | 分隔/描边底 |
| `--filltext-ft-d` | `#c5cbd6` | `#313131` | 较强描边 |
| `--filltext-ft-e` | `#99a4b7` | `#6f6f6f` | 弱文字 |
| `--filltext-ft-f` | `#6d7d98` | `#9a9a9a` | 次文字 |
| `--filltext-ft-g` | `#495266` | `#cfcfcf` | 近主文字 |
| `--filltext-ft-h` | `#2a303c` | `#f2f2f2` | 主文字 |
| `--neutral-black-a…g` | `rgba(46,46,46,α)` | `rgba(255,255,255,α)` | 半透明文字/分隔（反转） |
| `--neutral-black-h` | `#2e2e2e` | `#ededed` | 实色深文字/元素（反转） |
| `--neutral-white-*` | 不变 | 不变 | 品牌色块上的白字/浅高光 |
| `--surface-1` | `var(--neutral-white-h)`=白 | `#1e1e1e` | 卡片/面板/弹层底 |
| `--surface-2` | `var(--filltext-ft-b)` | `#2b2b2b` | 次级/输入底 |
| `--surface-3` | `var(--filltext-ft-c)` | `#363636` | 三级/分隔 |
| `--on-brand` | 白 | `#ffffff` | 品牌/功能色块上的文字 |
| `--func-win` | `#068547` | `#2bbf76` | 赢（深色提亮） |
| `--func-lost` | `#af0507` | `#ff5a5a` | 输 / live 红 |
| `--func-favorite` | `#ff8800` | `#ff9a3d` | 收藏/热门 |
| `--func-bonus` | `#ffc31d` | `#ffce4d` | 奖金 |
| `--func-pending` | `#b18118` | `#cda23f` | 待定 |
| `--func-void` | `#c4c4c4` | `#777777` | 作废 |

> `--auxiliary-*`、`--gradient-*`、`--promo-parlay-boost-*` 在 betbus 保持不变（多彩强调/促销，深底上仍可用）。

## 5. 如何使用 / 扩展

切换（代码内）：
```ts
import { useTheme } from '@/components/theme-provider/theme-provider';
const { setTheme } = useTheme();
setTheme('betbus'); // 或 'gtb'
```

新增第三套方案（如 `aurora`）：
1. `theme.css` 复制 `:root.betbus {}` → `:root.aurora {}`，改取值；
2. `theme-provider.tsx` 的 `SCHEMES` 数组加 `'aurora'`；
3. 切换器自动出现该项（按 `SCHEMES` 渲染）。

## 6. QA 清单（已知取舍 / 需人工目检）

- [ ] **on-brand 白字对比度**：betbus 主色 `#26c07a` 上的白字对比约 2.2:1，低于 AA。若需更稳，可把 `--on-brand` 改深（如 `#07130d`）或主色取深一档 `#1b9e61`。当前 v1 取白以避免红/橙/win 色块白字回归。
- [ ] **`border-neutral-white-h`（未迁移）**：少数白色描边/圆环在深底上会显白边（betbus 偏好极淡 hairline）。逐个评估是否改 `border-surface-2` 或保留。
- [ ] **表面层级**：`bg-filltext-ft-a/b` 在 betbus 变 `#0f0f0f/#161616`，与卡片 `--surface-1 #1e1e1e` 的明暗层级需目检，必要时微调灰阶取值。
- [ ] **写死的 rgba(46,46,46,…) 阴影**：部分组件用字面黑色阴影（非变量），深底上偏弱，可改 `var(--neutral-black-*)`。
- [ ] **真·白底元素**：极少数确需恒白的底（如支付方 logo 卡）若误迁到 `bg-surface-1`，深色下会变深；目检后单点改回。
- [ ] **导航栏/侧栏/底部栏背景**：确认深色下与页面对比合理。

迁移备份（沙箱，供回滚参考）：`outputs/scheme-migration-backup/`（138 个文件迁移前快照）。
