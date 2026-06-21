# 样式与设计令牌

> 引擎：Tailwind CSS v4，`@theme` 位于 `src/assets/css/tailwind.css`。暗色模式通过 CSS 变量反转（next-themes）。`cn()` 用于 class 合并。

## 字体排版（字体：Poppins 默认，禁止手动设置）

| 令牌 | 尺寸 | 字重 | 行高 | 备注 |
|------|------|------|------|------|
| `text-auxiliary-xxs` | 10px | 300 | 14px | |
| `text-auxiliary-xs/sm/md` | 12px | 300/400/600 | 16px | |
| `text-body-sm/md/lg` | 14px | 400/500/700 | 18px | |
| `text-market` | 14px | 700 | 18px | letter-spacing: 0.84px |
| `text-title-sm/md/lg` | 16/18/20px | 700 | 20/22/24px | |
| `text-headline-sm/md/lg` | 24/28/36px | 600 (Roboto Flex) | 28/32/40px | |

> 禁止裸写 `text-[14px]` 或 `font-['Poppins']`。Headline 令牌自动应用 Roboto Flex。`text-market` 用于赔率/市场按钮。
>
> **重要**：新的 `text-*` font-size 令牌**必须**在 `src/utils/common.ts` 的 `extendTailwindMerge()` 中注册。

## 圆角

| 令牌 | 值 | 用途 |
|------|------|------|
| `rounded-xs` | 4px | 数据背景 |
| `rounded-sm` | 8px | 卡片 / 按钮 |
| `rounded-md` | 16px | 面板卡片 |
| `rounded-lg` | 20px | 促销 / 登录 |
| `rounded-full` | 999px | 头部/搜索 |

## 其他令牌
- **背景模糊**：`backdrop-blur-header`（30px）、`backdrop-blur-dialog`（50px）、`backdrop-blur-overlay-1`（15px）、`backdrop-blur-overlay-2`（5px）
- **颜色**：`ft-h (#2a303c)` 仅用于投注/体育按钮，不用于普通文本。数字/日期/货币格式统一通过 `useRegionIntlLocale()` + `useIntlFormatter()` 区域化；不要再直接把 `RegionCode` 传给 `Intl`。
- **Figma 双填充**：`bg-neutral-white-h bg-[image:linear-gradient(var(--neutral-black-b),var(--neutral-black-b))]`
- **渐变**：`--gradient-game-button`、`--gradient-a` 到 `--gradient-g`。使用 `style={{ backgroundImage: 'var(--gradient-*)' }}`，禁止硬编码 hex。

## Z-Index 层级

| 层级 | 值 | 示例 |
|------|------|------|
| 调试 | 9999 | ReplayControl |
| Toast | 70-100 | ToastContainer |
| Toast 遮罩 | 69 | bg-black/42 |
| 能量球 | 65 | fly-energy-ball-bezier |
| 模态框 | 60 | ModalContainer |
| 游戏 Iframe | 55 | Casino 全屏 |
| 叠加层/下拉 | 50 | MobileNav、BottomSheet、Tooltip |
| 头部 | 40 | NavigationBar |
| 面板切换 | 30 | BetSlip 展开 |
| 粘性/应用 | 10 | MatchFilter、AppContainer |

Portal：Modal → `DomIdEnum.ModalContainer`（z-60），Toast → `DomIdEnum.ToastContainer`（z-70）。

## Toast 系统
- CSS 驱动遮罩层通过 `:has([data-sonner-toast])` — 无 JS 状态。z-69。
- Modal 保护：`BaseModal.onPointerDownOutside` 检查 toast 存在。
- API：`Toast.success/error/warn/info/loading(msg, opts?)`。去重：`{ id: 'key' }`。
