# 共享 UI 组件库参考

> 路径: `src/components/` | 所有共享组件的完整概览，按类别分组。

---

## 一、核心基础组件

### Button

`@/components/button/button`

CVA 驱动的按钮组件，支持 4 种变体和 loading 状态。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'text'` | `'primary'` | 样式变体 |
| `block` | `boolean` | `false` | 宽度拉伸至父容器 |
| `loading` | `boolean` | `false` | 加载状态（禁用交互 + 显示 Loading 图标） |
| `disabled` | `boolean` | `false` | 禁用状态 |
| `icon` | `ReactNode` | - | 前置图标 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生按钮类型 |

**变体样式**:
- `primary`: 红色背景 + 白色文字，hover 变深
- `secondary`: 灰色背景 + 深色文字
- `outline`: 白色背景 + 红色边框 + 红色文字
- `text`: 纯文字，无背景无边框

**Loading 图标颜色映射**: primary -> `color-white`，outline -> `color-red`，其他 -> `color-gray`

```tsx
import { Button } from '@/components/button/button';

<Button variant="primary" loading={isSubmitting} block>
  {t('submit')}
</Button>
```

---

### Input

`@/components/input/input`

基础输入框，支持前后插槽和错误状态。**注意**: 无错误信息展示，表单场景请用 `FormInput`。

| Prop | 类型 | 说明 |
|------|------|------|
| `addonBefore` | `ReactNode` | 前置插槽 |
| `addonAfter` | `ReactNode` | 后置插槽 |
| `error` | `boolean` | 错误状态（红色边框） |

**状态样式**: 空值无边框 -> 有值显示边框 -> 聚焦显示聚焦边框 -> 错误红色边框。内部维护 `inputValue` 状态实现受控/非受控兼容。

---

### Checkbox

`@/components/checkbox/checkbox`

复选框组件，使用自定义 SVG 图标（`Checked` / `UnChecked`），支持受控与非受控模式。

| Prop | 类型 | 说明 |
|------|------|------|
| `checked` | `boolean` | 受控模式的选中值 |
| `defaultChecked` | `boolean` | 非受控模式的默认值 |
| `label` | `string` | 右侧文字标签 |
| `disabled` | `boolean` | 禁用状态 |
| `onChange` | `(checked: boolean) => void` | 值变化回调 |

---

### IconButton

`@/components/icon-button`

图标按钮，遵循 Figma 设计规范，支持 4 种尺寸、2 种形状、3 种变体。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `icon` | `FC<SVGProps<SVGSVGElement>>` | (必填) | 图标组件 |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | 尺寸: 24/32/36/40px |
| `shape` | `'square' \| 'round'` | `'square'` | 方形圆角 / 完全圆形 |
| `variant` | `'solid' \| 'subtle' \| 'ghost'` | `'solid'` | 背景变体 |
| `badge` | `number` | - | 右上角红色徽章数字 |
| `aria-label` | `string` | (必填) | 无障碍标签 |
| `iconClassName` | `string` | - | 图标额外 className |

**尺寸配置**:

| size | 按钮尺寸 | 图标尺寸 |
|------|---------|---------|
| `xs` | 24px | 12px |
| `sm` | 32px | 14px |
| `md` | 36px | 16px |
| `lg` | 40px | 20px |

**变体**:
- `solid`: 白色背景 (`bg-neutral-white-h`)
- `subtle`: 灰色背景 (`bg-filltext-ft-a`)
- `ghost`: 透明背景

---

### TextField

`@/components/text-field/text-field`

集成 `react-hook-form` 的输入框，内置标签、错误显示和 `onBlur` 自动触发校验。与 `FormInput` 的区别: 样式更大（h-11），带 `backdrop-blur`，label 用 `text-body-sm font-medium`，聚焦时 placeholder 消失。

| Prop | 类型 | 说明 |
|------|------|------|
| `name` | `string` | 表单字段名 (必填) |
| `label` | `ReactNode` | 标签 |
| `startAdornment` | `ReactNode` | 前置装饰 |
| `endAdornment` | `ReactNode` | 后置装饰 |

**必须**配合 `FormProvider` 使用。自带 `client-only` 导入保护。

---

## 二、表单系统

> 所有表单组件**必须**在 `react-hook-form` 的 `FormProvider` 上下文中使用。

### FormItem

`@/components/form-item/form-item`

表单项容器，负责标签展示和错误信息。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | (必填) | 表单字段名 |
| `label` | `string` | - | 标签文字 |
| `labelBold` | `boolean` | `false` | 标签是否加粗 |
| `showError` | `boolean` | `true` | 是否显示错误信息 |

---

### FormInput

`@/components/form-input/form-input`

表单输入框 = `FormItem` + `Input`。通过 `fieldProps` 传递 `Input` 的属性。

```tsx
<FormInput
  name="email"
  label={t('email')}
  fieldProps={{ placeholder: t('emailPlaceholder'), addonBefore: <MailIcon /> }}
  rules={{ required: t('emailRequired') }}
/>
```

---

### FormCheckbox

`@/components/form-checkbox/form-checkbox`

表单复选框 = `FormItem` + `Checkbox`。通过 `useController` 进行受控绑定。

---

### FormPassword

`@/components/form-password/form-password`

密码输入框 = `FormInput` + 眼睛切换。使用 `ahooks` 的 `useToggle` 控制 `type="password"` / `type="text"`。后置图标: `EyeOpen` / `EyeClose`。

---

### FormSelect

`@/components/form-select/form-select`

表单选择器 = `FormItem` + `Select`。通过 `useController` 进行受控绑定。

---

### FormCascader

`@/components/form-cascader/form-cascader`

表单级联选择器 = `FormItem` + `Cascader`。通过 `useController` 进行受控绑定。

---

### FormErrorMessage

`@/components/form-error-message/form-error-message`

表单错误信息展示组件，支持多种错误类型解析:
- `ReactNode` (ReactElement) -> 直接渲染
- `FieldError` 对象 -> 提取 `.message`
- 字符串 -> 直接展示

显示时带 `Warn` 图标 + 红色文字 (`text-func-lost`)。

---

## 三、高级交互

### Select

`@/components/select/select`

基于 Radix UI `Select` 的下拉选择器。

| Prop | 类型 | 说明 |
|------|------|------|
| `options` | `Option[]` | 选项列表 (`{ label, value, disabled?, children? }`) |
| `placeholder` | `ReactNode` | 占位文字 |
| `error` | `boolean` | 错误状态 |

内部子组件: `SelectTrigger`（自定义触发器样式）、`SelectContent`（下拉面板 + ScrollUpButton/ScrollDownButton）、`SelectItem`（选项项）。

---

### Cascader

`@/components/cascader/cascader`

多级联动选择器，基于 Radix UI `Select`。动态多列布局，每列宽度 120px。

**核心机制**:
- 选中有 `children` 的选项 -> 展开下一级列
- 选中叶子节点 -> 关闭下拉 + 触发 `onValueChange`
- ESC 键 -> 回退一级（而非直接关闭）
- 面板宽度 = `列数 * 120px`

---

### Pagination

`@/components/pagination`

数字分页组件，支持省略号和两种视觉变体。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `currentPage` | `number` | (必填) | 当前页码 |
| `totalPages` | `number` | (必填) | 总页数 |
| `onPageChange` | `(page: number) => void` | (必填) | 页码变化回调 |
| `variant` | `'default' \| 'subtle'` | `'default'` | 视觉变体 |

**变体区别**:
- `default`: 红色背景活跃态，方形圆角，`text-body-sm`
- `subtle`: 灰色背景活跃态，完全圆形，`text-body-lg`

页码范围算法: 当总页数 > `siblings * 2 + 5` 时，两端用 `...` 省略。

---

### Tabs

`@/components/tabs/tabs`

基于 Radix UI `Tabs` 的标签页组件。

| Prop | 类型 | 说明 |
|------|------|------|
| `items` | `TabItem[]` | 标签项列表 |
| `value` | `string` | 受控选中值 |
| `defaultValue` | `string` | 默认选中值 |
| `onChange` | `(value: string) => void` | 切换回调 |
| `ContentContainer` | `ComponentType<PropsWithChildren>` | 自定义内容容器 (默认 `Fragment`) |

**TabItem 结构**:
```ts
interface TabItem {
  value: string;
  label: string | ReactNode;
  content?: ReactNode;
  icon?: ReactNode;        // 尾部图标
  disabled?: boolean;
  showBadge?: boolean;     // 红点徽章
}
```

样式: 下划线指示器 (`after:bg-brand-red`)，hover 时显示浅色下划线。

---

### Table

`@/components/table`

泛型表格组件，支持自定义列渲染和斑马纹。

| Prop | 类型 | 说明 |
|------|------|------|
| `theme` | `'style1' \| 'style2'` | 主题: 红色渐变表头 / 灰色表头 |
| `columns` | `TableColumn<T>[]` | 列配置 |
| `data` | `T[]` | 数据源 |
| `stripe` | `boolean` | 斑马纹（奇偶行交替背景） |
| `rowKey` | `string \| ((row, index) => Key)` | 行唯一键 |
| `emptyComponent` | `ReactNode` | 空状态组件 |

**TableColumn 定义**:
```ts
type TableColumn<T> = {
  key: keyof T | string;
  title: ReactNode;
  render?: (value, row, index) => ReactNode;
  className?: string;
  width?: number;
  align?: 'center' | 'left' | 'right';
};
```

---

### Tooltip

`@/components/tooltip/tooltip`

基于 Radix UI `Tooltip` 的提示气泡组件。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `content` | `ReactNode` | (必填) | 提示内容 |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | 弹出方向 |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | 对齐方式 |
| `sideOffset` | `number` | `4` | 偏移量 |
| `arrowWidth/arrowHeight` | `number` | `20/10` | 箭头尺寸 |

使用自定义 SVG 箭头 (`<path d="M0 0 L12.69 9.14 ...">`)。Portal 挂载到 `DomIdEnum.ModalContainer`。`delayDuration={0}` 立即显示。

---

### ConditionalTooltip

`@/components/tooltip/conditional-tooltip`

条件 Tooltip，**仅在文本溢出时**自动显示。使用 `useTextOverflow` hook 检测。

| Prop | 类型 | 说明 |
|------|------|------|
| `content` | `ReactNode` | 提示内容 |
| `forceShow` | `boolean` | 强制显示（不依赖溢出检测） |
| `children` | `ReactElement` | 子元素（会被注入 ref） |

```tsx
<ConditionalTooltip content={longText}>
  <span className="truncate">{longText}</span>
</ConditionalTooltip>
```

---

### Drawer

`@/components/drawer/drawer`

基于 Vaul 的抽屉组件，支持上/下/左/右四个方向。

**导出组件**: `Drawer`, `DrawerTrigger`, `DrawerClose`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription`, `DrawerPortal`, `DrawerOverlay`

`DrawerContent` 根据 `data-vaul-drawer-direction` 自动适配方向样式:
- `bottom`: `inset-x-0 bottom-0 rounded-t-lg max-h-[80vh]`
- `top`: `inset-x-0 top-0 rounded-b-lg max-h-[80vh]`
- `left/right`: `inset-y-0 w-3/4 sm:max-w-sm`

底部方向自带拖拽指示条。

---

### Collapsible

`@/components/collapsible/collapsible`

基于 Radix UI `Collapsible` 的展开/折叠容器。直接透传 Radix 原语。

**导出**: `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`

---

### CardCollapsible

`@/components/card-collapsible`

手风琴卡片组件，基于 Radix UI `Accordion`。白色圆角卡片背景，标题 + 折叠箭头。默认展开。单选模式 (`type="single"`)，可全部收起 (`collapsible`)。

---

## 四、数据反馈

### Loading

`@/components/loading/loading`

SVG 加载动画图标，锥形渐变 + 旋转动画。

| Prop | 类型 | 说明 |
|------|------|------|
| `variant` | `'color-red' \| 'color-gray' \| 'color-white'` | 颜色变体 |
| `gradientColors` | `[string, string]` | 自定义渐变起止色 |

**变体颜色**:
- `color-red`: 透明 -> 品牌红
- `color-gray`: 透明灰 -> 不透明灰
- `color-white`: 透明粉 -> 不透明粉

使用内联 SVG（而非 `icon:build`）因为需要动态渐变色。`animate-spin` 实现旋转。

---

### Empty

`@/components/empty`

空状态组件，展示 `no-matches.png` 图片 + 描述文字 + 可选返回按钮。

| Prop | 类型 | 说明 |
|------|------|------|
| `desc` | `string` | 自定义描述文字 (默认: `t('matches.noMatchesAvailable')`) |
| `showBackButton` | `boolean` | 是否显示"返回首页"按钮 (链接到 `/sports`) |

---

### Toast

`@/components/toast/toast`

基于 sonner 的全局 Toast 服务，**命令式调用**。

**类型**: `info` / `success` / `warn` / `error` / `loading` / `network`

```tsx
import { Toast } from '@/components/toast';

// 基本用法
Toast.success(t('saved'));

// 带去重 ID（防止重复弹出）
Toast.error(t('networkError'), { id: 'network-error' });

// loading 返回 dismiss 函数
const dismiss = Toast.loading(t('uploading'));
// ... 完成后
dismiss();

// 关闭所有
Toast.dismissAll();
```

**默认持续时间**: success 1s, error/warn/network 3s, info 2s, loading 无限。

**图标映射**: success -> `Success`(绿), warn -> `Warn`(黄), error -> `Error`(红), loading -> `Loading`(红旋转), network -> 自定义弱信号 SVG。

---

### ToastProvider

`@/components/toast/toast-provider`

Toast 挂载容器，在根 Layout 中挂载一次即可。

**核心机制**: 使用 CSS `:has()` 选择器驱动叠加层 — 当 `[data-sonner-toast]` 存在时自动显示半透明遮罩 (`bg-black/42 z-[69]`)。遮罩点击时调用 `sonnerToast.dismiss()` 关闭所有 Toast。通过 `onPointerDown.stopPropagation()` 防止 Radix `DismissableLayer` 误判为 Modal 外部点击。

**配置**: `position="top-center"`, `offset="33vh"`, `visibleToasts={10}`, `z-index: 70`。

---

### DialogProvider

`@/components/dialog/dialog-provider`

全局对话框服务 + 渲染器。基于 Radix Dialog，支持 confirm/info/error 三种类型。

**命令式 API**:
```tsx
import { Dialog } from '@/components/dialog';

// 确认对话框（双按钮）
Dialog.confirm({
  title: t('confirmTitle'),
  content: t('confirmContent'),
  onConfirm: async (close) => {
    await doSomething();
    close(); // 手动关闭（当 autoClose=false 时）
  },
  onCancel: (close) => close(),
});

// 信息对话框（单按钮）
Dialog.info({ title: t('infoTitle'), content: t('infoContent') });

// 错误对话框（单按钮 + 警告图标）
Dialog.error({ content: t('errorMessage') });
```

**DialogItem 类型**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'confirm' \| 'info' \| 'error'` | 对话框类型 |
| `autoClose` | `boolean` (默认 `true`) | 是否自动关闭 |
| `title` | `ReactNode \| () => ReactNode` | 标题 |
| `content` | `ReactNode \| () => ReactNode` | 内容 |
| `confirmText` / `cancelText` | `string` | 自定义按钮文字 |
| `onConfirm` / `onCancel` | `(close) => void \| Promise<void>` | 回调函数 |

**异步确认**: `confirm` 类型的 `onConfirm` 回调使用 `useRequest` 管理 loading 状态，300ms 延迟后显示加载动画。

**内部实现**: 基于 `useSyncExternalStore` 的 pub-sub 模式管理状态，不依赖 React state。

---

## 五、布局容器

### BaseModal

`@/components/base-modal/base-modal`

基础弹窗组件，基于 Radix Dialog。**支持多层弹窗嵌套** + z-level 管理。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `visible` | `boolean` | (必填) | 是否可见 |
| `onClose` | `() => void` | (必填) | 关闭回调 |
| `maskClosable` | `boolean` | `true` | 点击遮罩是否关闭 |
| `blur` | `boolean` | `false` | 背景模糊 |
| `contentClassName` | `string` | - | Dialog.Content 额外样式 |

**多层嵌套机制**: 使用 `useModalLevel` hook 管理弹窗层级栈。每个弹窗注册时获得唯一 ID 和 z-level。第二层及以上的 `backdrop-blur` 减弱 (`2.5px` vs `7.5px`)。

**Toast 兼容**: 当存在 Toast (`[data-sonner-toast]`) 时，阻止外部点击关闭弹窗。

Portal 挂载到 `DomIdEnum.ModalContainer`。

---

### Modal

`@/components/modal/modal`

对 `BaseModal` 的高级封装，添加关闭按钮和卡片背景。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `withBg` | `boolean` | `true` | 是否显示白色卡片背景 |
| `closeButton` | `boolean` | `true` | 是否显示关闭按钮 |

**规则**: 项目中**始终使用 `Modal`，不要使用 `Dialog`**（Dialog 仅用于全局命令式服务）。

```tsx
const [open, setOpen] = useState(false);

<Modal visible={open} onClose={() => setOpen(false)}>
  <div>弹窗内容</div>
</Modal>
```

---

### StickyBlurHeader

`@/components/sticky-blur-header`

全宽吸顶模糊头部组件。使用 CSS Container Query 单位 (`cqi`) 实现跨容器全宽效果。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fullBleed` | `boolean` | `true` | 是否全宽出血效果 |
| `innerClassName` | `string` | - | 内层容器额外样式 |

**原理**: `w-[100cqi] ml-[calc(50%-50cqi)]` 使背景模糊延伸到最近 `@container` 祖先的全宽，而内容区域 `max-w-[var(--main-content-max-width)]` 居中。

---

### Sidebar 系统

`@/components/sidebar/`

4 层架构的侧边栏系统。

**层级结构**:

1. **`sidebar-primitives.tsx`** — 底层原语，基于 Radix UI Sheet + Tooltip + Context
   - `SidebarProvider`: 提供展开/折叠状态，Cookie 持久化 (`sidebar_state`, 7天)
   - 移动端 -> Sheet 模态弹出；桌面端 -> 固定宽度过渡 (60/200px)
   - 导出: `useSidebar`, `SidebarContent`, `SidebarHeader`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarGroup*`

2. **`sidebar-group.tsx`** — 分组容器
   - `SidebarGroup`: 带标题的分组，折叠时可显示简短标题 (`collapsedTitle`)
   - `SidebarLine`: 分隔线（折叠时变窄居中）

3. **`sidebar-item.tsx`** — 导航项
   - 图标 (`icon` / `activeIcon` 切换)、文字标签、活跃态红色左边框指示器
   - `comingSoon` 属性: 点击时 Toast 提示而非导航
   - 使用 `memo` 优化渲染

4. **`sidebar-shell.tsx`** — 完整侧边栏壳
   - Logo + 汉堡菜单切换按钮
   - 可滚动内容区域 (`hidden-scrollbar`, `overscroll-y-contain`)
   - 支持受控折叠状态 (`collapsed` / `onCollapsedChange`)

---

## 六、特殊工具组件

### TimePicker

`@/components/time-picker/time-picker`

时间选择器，结合 React Aria `TimeField`（键盘输入）和 Radix `Popover` + `Select`（鼠标点击下拉）。

| Prop | 类型 | 说明 |
|------|------|------|
| `value` | `string` | 时间值 (`"HH:mm"` 或 `"HH:mm:ss"`) |
| `onChange` | `(value: string) => void` | 变化回调 |
| `disabled` | `boolean` | 禁用 |
| `showSeconds` | `boolean` | 是否显示秒选择 |

**交互模式**: 键盘可通过 Tab/方向键/直接输入数字编辑各段；鼠标可通过下拉面板选择时/分/秒。支持 12/24 小时制（通过 `TimePickerConfig` 上下文配置）。

**依赖**: `@internationalized/date` (Time 对象), `react-aria-components` (TimeField/DateInput/DateSegment)

---

### CurrencyInput

`@/components/currency-input/currency-input`

货币金额输入框，支持多语言格式化（千分位、小数点符号）。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `number` | - | 当前金额 |
| `onChange` | `(value: number \| undefined) => void` | - | 金额变化 |
| `min` / `max` | `number` | `0` / `MAX_SAFE_INTEGER` | 范围限制（blur 时 clamp） |
| `allowDecimals` | `boolean` | `true` | 是否允许小数（最多 2 位） |
| `error` | `boolean` | `false` | 错误状态 |

**核心行为**:
- 聚焦时: 移除千分位分隔符，方便编辑
- 失焦时: 自动 clamp 到 min/max 范围，恢复千分位格式
- 使用 `Intl.NumberFormat` 和 `useIntlFormatter()` 确保多语言格式正确
- 自动显示当前 locale 的货币符号

---

### BtnWithCountdown

`@/components/btn-with-countdown/btn-with-countdown`

验证码发送按钮，带倒计时功能。

| Prop | 类型 | 说明 |
|------|------|------|
| `text` | `string` | 按钮文字 |
| `countdownTime` | `number` | 倒计时秒数 |
| `onClick` | `() => void` | 点击回调 |
| `onEnd` | `() => void` | 倒计时结束回调 |

**使用方式**: 通过 `ref.start()` 启动倒计时。倒计时期间按钮禁用并显示秒数。

```tsx
const countdownRef = useRef<BtnWithCountdownRef>(null);

<BtnWithCountdown
  ref={countdownRef}
  text={t('sendCode')}
  countdownTime={60}
  onClick={async () => {
    await sendSms();
    countdownRef.current?.start();
  }}
/>
```

---

### QuestionTooltip

`@/components/question-tooltip`

问号帮助提示组件，**响应式适配**: 桌面端使用 Tooltip 气泡，移动端使用 Modal 弹窗。

| Prop | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 标题 |
| `items` | `ReactNode[]` | 列表项（带圆点列表） |
| `content` | `string` | 纯文本内容 (与 items 二选一) |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | 气泡方向 (仅桌面) |

---

### CheckboxFilter

`@/components/checkbox-filter/checkbox-filter`

多选复选框过滤器，基于 Radix `Popover`。

| Prop | 类型 | 说明 |
|------|------|------|
| `groups` | `CheckboxFilterGroup[]` | 分组选项 (`{ title, options[] }`) |
| `selected` | `string[]` | 当前选中值 (受控) |
| `onSelectionChange` | `(values: string[]) => void` | 选择变化回调 |
| `placeholder` | `string` | 触发器文字 |

选中数量显示在触发器按钮上作为计数徽章。每个选项可带 `count` 数字徽章。

---

### CarouselNavControls

`@/components/carousel-nav-controls`

Embla Carousel 导航控件，提供两种模式:

**`CarouselInlineNav`** — 内联模式（按钮与内容并排）:
- `visibilityMode: 'conditional' | 'always'`
- `buttonVariant: 'default' | 'compact' | 'mini'`

**`CarouselOverlayNav`** — 覆盖模式（按钮浮动在内容上方）:
- `showOnHover`: hover 时显示 (默认 `true`)
- 按钮绝对定位，支持自定义位置 (`prevClassName` / `nextClassName`)

两种模式都使用 `IconButton` 组件渲染箭头按钮。

---

### BannerCarousel

`@/components/banner-carousel`

Banner 轮播图组件，基于 Embla + Autoplay 插件。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `banners` | `BannerItem[]` | (必填) | Banner 数据列表 |
| `autoplayInterval` | `number` | `3000` | 自动播放间隔 (ms) |
| `startIndex` | `number` | `0` | 起始索引 |

**特性**:
- 循环播放 (`loop: true`)
- 鼠标悬停暂停 (`stopOnMouseEnter`)
- 响应式: 移动端全宽单张，桌面端 3 列 (每列 `calc((100%-2*1rem)/3)`)
- 桌面端 hover 时显示左右导航箭头 (`CarouselOverlayNav`)
- 支持移动端/桌面端不同图片 (`imageUrl` / `mobileImageUrl`)

---

### BorderBeam 系列

三种边框光束动画实现:

**`BorderBeam`** (`@/components/border-beam`) — 锥形渐变旋转方案:
- 200% 超大 `conic-gradient` 旋转，CSS mask 仅显示 1px 边框环
- GPU 优化: `transform: rotate()` 在合成线程运行
- 支持自定义弧度 `arc`、模糊 `blur`、反向 `reverse`

**`BorderBeamSvg`** (`@/components/border-beam-svg`) — SVG pathLength 方案:
- 三层结构: 轨道 + 鬼影尾 + 辉光体 + 激光尖端
- `pathLength="100"` 归一化使比例尺寸无关
- 负 `animation-delay` 实现层级错开

**`BorderBeamPath`** (`@/components/border-beam-path`) — CSS offset-path 方案:
- 固定长度光束沿矩形边框匀速运动
- `offset-distance` 线性插值，速度均匀

父容器需要 `position: relative`。

---

## 七、提供者与工具组件

### RootProviders

`@/components/providers/root-providers`

根级客户端 Provider 包装器，组合所有全局 Provider:

```
ThemeProvider -> TanstackProvider -> MobileZoomLock -> {children}
```

同时初始化 dayjs 插件 (`duration`, `utc`, `timezone`)。

---

### ClientOnly

`@/components/client-only`

防止 SSR 水合不匹配的客户端渲染包装器。

| Prop | 类型 | 说明 |
|------|------|------|
| `fallback` | `ReactNode` | 水合阶段的占位内容 (默认 `null`) |

**原理**: `useEffect` 在客户端首次渲染后将 `isClient` 设为 `true`，水合阶段显示 fallback。

---

### TimezoneSynchronizer

`@/components/timezone-synchronizer`

时区状态同步器，确保 Cookie (SSR) / Zustand Store (Client) / 浏览器环境三方一致。

**同步场景**:
1. 首次访问无 Cookie -> 写入浏览器时区 + `router.refresh()` 刷新 SSR
2. Cookie 与 Store 不一致 -> 以 Cookie 为准同步 Store

Cookie 名: `app-timezone`，有效期 365 天。

---

### ModuleErrorBoundary

`@/components/module-error-boundary`

模块级错误边界，防止单个组件崩溃影响整页。Class Component 实现。

| Prop | 类型 | 说明 |
|------|------|------|
| `name` | `string` | 模块名称 (用于 Sentry 追踪) |
| `fallback` | `ReactNode` | 自定义错误 UI |

默认 fallback: 灰色虚线框 + "Something went wrong" + Retry 按钮。报错时通过 `reportError()` 上报 Sentry。

```tsx
<ModuleErrorBoundary name="BetSlipPanel">
  <BetSlipPanel />
</ModuleErrorBoundary>
```

---

## 快速查找索引

| 需求 | 组件 | 路径 |
|------|------|------|
| 按钮 | `Button` | `button/button` |
| 图标按钮 | `IconButton` | `icon-button` |
| 输入框 | `Input` | `input/input` |
| 表单输入 | `FormInput` | `form-input/form-input` |
| 带标签输入 | `TextField` | `text-field/text-field` |
| 密码框 | `FormPassword` | `form-password/form-password` |
| 复选框 | `Checkbox` | `checkbox/checkbox` |
| 下拉选择 | `Select` | `select/select` |
| 级联选择 | `Cascader` | `cascader/cascader` |
| 时间选择 | `TimePicker` | `time-picker/time-picker` |
| 金额输入 | `CurrencyInput` | `currency-input/currency-input` |
| 标签页 | `Tabs` | `tabs/tabs` |
| 表格 | `Table` | `table/index` |
| 分页 | `Pagination` | `pagination` |
| 提示气泡 | `Tooltip` | `tooltip/tooltip` |
| 条件提示 | `ConditionalTooltip` | `tooltip/conditional-tooltip` |
| 弹窗 | `Modal` | `modal/modal` |
| 抽屉 | `Drawer*` | `drawer/drawer` |
| 折叠 | `Collapsible` | `collapsible/collapsible` |
| 手风琴卡片 | `CardCollapsible` | `card-collapsible` |
| 加载动画 | `Loading` | `loading/loading` |
| 空状态 | `Empty` | `empty` |
| Toast | `Toast` | `toast/toast` |
| 确认对话框 | `Dialog` | `dialog` |
| 验证码按钮 | `BtnWithCountdown` | `btn-with-countdown/btn-with-countdown` |
| 问号帮助 | `QuestionTooltip` | `question-tooltip` |
| 多选过滤 | `CheckboxFilter` | `checkbox-filter/checkbox-filter` |
| 轮播导航 | `CarouselInlineNav` / `CarouselOverlayNav` | `carousel-nav-controls` |
| Banner 轮播 | `BannerCarousel` | `banner-carousel` |
| 边框光束 | `BorderBeam` / `BorderBeamSvg` / `BorderBeamPath` | `border-beam*` |
| 吸顶头 | `StickyBlurHeader` | `sticky-blur-header` |
| 侧边栏 | `SidebarShell` / `SidebarItem` | `sidebar/` |
| 错误边界 | `ModuleErrorBoundary` | `module-error-boundary` |
| 客户端渲染 | `ClientOnly` | `client-only` |
| 时区同步 | `TimezoneSynchronizer` | `timezone-synchronizer` |
| 根 Provider | `RootProviders` | `providers/root-providers` |
