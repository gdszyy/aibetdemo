# CR 反模式速查表

| 反模式 | 示例 | 修复 |
|--------|------|------|
| useEffect 中的无效表达式 | `isExpired; if (!ref.current) {...}` | `if (isExpired && !ref.current) {...}` |
| 重复渲染 | 条件渲染 + 无条件渲染同一内容 | 移除重复 |
| 定时 hack | `await delay(100); reset()` | 事件回调或状态驱动逻辑 |
| 魔法数字 | `if (totalItems < 20)`、`max-h-[360px]` | 命名常量 |
| 魔法枚举值 | `betMode === 1` | `betMode === BetType.Single` |
| 动态 `require()` | `require('../_constants')` | 静态 ES `import` |
| 内部路由用 `window.location.href` | `window.location.href = '/'` | `@/i18n` 的 `router.push('/')` |
| "返回上级"用 `router.back()` | 返回按钮使用 `router.back()` | `router.push('/parent')` — 确定性 |
| 从 `next/navigation` 导入 `useRouter` | `router.push('/sports')` 丢失 locale | 从 `@/i18n` 导入 |
| 重新实现共享组件 | 手写带定时器的 popover | 使用 `@/components/` |
| 纯函数放在 `api/handlers/` | 同步验证命名 `*Interface` | 移至 `_utils/`，去掉后缀 |
| 双重点击处理 | `<div onClick><button onClick>` | 仅一个元素，或 `stopPropagation` |
| SSR code 比较 | `json.code === 0` | `Number(json.code) === 0` |
| 冗余回调包装 | `useCallback((x) => fn(x), [fn])` | 直接传 `fn` |
| 死代码 | 注释块、未使用变量、过期 TODO | 删除 |
