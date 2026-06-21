# 移动端与跨平台适配

> H5 响应式 / PWA / React Native | 路线: H5 增强 → PWA → RN (按需)

## 概览

| 阶段 | 事项 | P | ��态 |
|------|------|---|------|
| 1 | 响应式基础设施 (Hooks, CSS Variables, Safe Area) | P0 | ✅ |
| 2 | 移动端布局 (BottomSheet, BottomTabBar, MobileNav, 三栏响应式) | P0 | ✅ |
| 3A | User Center 弹窗响应式 | P0 | ✅ |
| 3B | 弹窗响应式 (Dialog, AddAccount, Password, Language, Login) | P1 | ✅ |
| 3C | Window Scroll 迁移 (sticky sidebar/NavBar) | P0 | ✅ |
| 4 | ResponsiveModal 统一组件 | P2 | ❌ |
| 5A | PWA: Manifest + SW + Viewport (Serwist) | P1 | ✅ |
| 5B | PWA: 安装提示 + 离线策略 | P2 | ❌ |
| 6 | React Native 原生 App | P3 | ❌ |

## 已有基础设施

- **Hooks**: `useIsMobile()` < 768 / `useIsTablet()` 768-1024 / `useIsDesktop()` >= 1024
- **CSS**: `--safe-area-top/bottom`, `--min-touch-target: 44px`, `--bottom-bar-height: 56px`
- **布局**: 桌面端三栏 (Sidebar 200↔60 + Content + BetSlip 308) / 移动端单栏 + BottomTabBar
- **PWA**: Serwist v9.5.7, `NetworkFirst` 用于 API (60s TTL), standalone, 主题色 `#E80104`

## 剩余 TODO

### #4 ResponsiveModal 统一
桌面端 Modal / 移动端 BottomSheet 自动切换。待改造: EnterPasswordModal, AddAccountModal, ConfirmDialog, KYCModal。

### #5B 安装提示 + 离线策略
- `usePWAInstall()` hook: `beforeinstallprompt` → 延迟提示
- 离线: 赛事列表 NetworkFirst 60s, 静态页 CacheFirst, WS/下注不缓存

### #6 React Native (按需)
代码复用率仅 ~11% (API + stores + utils)。89% 组件层需重写。仅 App Store 分发为硬需求时启动。需 monorepo 抽取共享层 + WebSocket 适配器模式 (`IWebSocketAdapter`)。
