# 全局动画系统 Plan (已归档)

> 能量球命令式 DOM → 声明式 React 动画 | 创建 2026-04-01 | 更新 2026-04-02

## 概览

| # | 事项 | 优先级 | 状态 |
|---|------|--------|------|
| **Phase 1：能量球功能（命令式 DOM）** | | | |
| 1-11 | 飞球引擎、按钮透传、bet-actions 编排、BetSlip 锚点、展开态飞向卡片、同 specifier flip/呼吸、prefers-reduced-motion、token 收敛 | P1 | ✅ 全部完成 |
| 12-19 | 代码改善：offset:0 补足、rAF cancel 互斥、工具函数提取到 `@/utils/dom.ts`、z-index 65 登记、拆分工具文件、英文化注释 | P0-P3 | ✅ 全部完成 |
| **Phase 2：声明式架构重构** | | | |
| 20-28 | `src/libs/animation/` 基础设施、5 个 Motion 声明式 effects、`bet-actions.ts` 改用 `animationState.launch()`、删除旧命令式代码 (~990 行) | P1-P2 | ❌ 未开始 |

## Phase 1 现有实现（命令式 DOM）

| 文件 | 行数 | 职责 |
|------|------|------|
| `src/utils/fly-energy-ball-bezier.ts` | ~291 | 飞球 pop→wait→flight→爆裂 |
| `src/utils/betslip-switch-feedback.ts` | ~332 | 切换 flip 卡片 slide→flip→slide |
| `src/modules/match/_hooks/bet-actions.ts` | ~204 | 业务编排 |
| `src/modules/match/_hooks/bet-animation-utils.ts` | ~161 | DOM 工具、滚动、呼吸动画 |

**问题**: 手动 DOM 生命周期、React 不可见、不可测试、魔法字符串 (`data-energy-ball-*` 20+ 处)

## Phase 2 架构设计

### 设计原则
1. **Observer 优于 Context** — 仿 Sonner toast，无 Provider 嵌套，任意代码能触发
2. **Registry 优于 switch/case** — 新动效 = 新文件 + `registerEffect()`
3. **Motion 优于原始 WAAPI** — 自动清理 + TypeScript + cancel/seek
4. **兼容 globalEventObserver** — 项目已有基础设施
5. **每个动效是独立 React 组件** — 自管生命周期

### 设计模式
| 模式 | 应用场景 |
|------|---------|
| Observer (Sonner 式) | `AnimationState` 管理实例列表，通知 `AnimationLayer` 渲染 |
| Registry (Plugin) | `AnimationRegistry` 映射 `type → EffectComponent` |
| Strategy | `bet-actions.ts` 按 `add/switch/remove` 分发动画策略 |
| Factory | `AnimationState.launch()` 生成带唯一 ID 的 instance |

### 目录结构
```
src/libs/animation/
├── types.ts                 # AnimationInstance, AnimationPayload, EffectComponent
├── animation-state.ts       # Sonner 式 Observer（全局单例）
├── animation-registry.ts    # type → Component 映射 + registerEffect()
├── animation-layer.tsx      # 全局唯一 Portal（AnimatePresence 包裹）
├── use-animation.ts         # launch/cancel hook
└── effects/                 # 动效插件（每文件自包含）
    ├── energy-ball.tsx       # 飞球 +1（Motion animate）
    ├── particle-burst.tsx    # 取消爆裂（Motion stagger）
    ├── switch-flip.tsx       # 切换翻牌（Motion 3D transform）
    ├── outcome-breathing.tsx # 呼吸高亮（Motion keyframes）
    └── badge-pulse.tsx       # 徽章弹跳（Motion spring）
```

### 层次关系
```
任意代码 → animationState.launch({ type, payload })
  → AnimationState (Observer, prefers-reduced-motion 短路)
    → AnimationLayer (Portal, AnimatePresence)
      → Registry[type] → Effect 组件 (motion.div)
        → onDone() → animationState.remove(id)
```

### 库可行性评估
| 场景 | 结论 |
|------|------|
| 飞球到购物车 | ✅ Motion `animate` + Portal (已有 Motion，无新依赖) |
| 粒子爆裂 | ⚠️ `react-confetti-boom` 可用但 ROI 低 (仅 6 粒子 30 行) |
| 3D Flip | ⚠️ `react-card-flip` 不适合 (需可中断/复用) |
| 全局管理 | ✅ 自建 Observer + Registry (~150 行核心) |

**结论：不引入新依赖。用 Motion + globalEventObserver + Portal 构建。**

### Phase 1 技术备忘
- 轨迹：Pop `translateY(-25px) scale(1.2)` → Flight 外 X (ease-in) + 内 Y (ease-out) → 近似贝塞尔抛物线
- 中断爆裂：读当前 rect → 6 粒子向外扩散 + opacity fade (300-500ms)
- Token：能量球色 `var(--color-brand-primary-0)`，glow `color-mix(55%)`，z-index 65
- 同行切换：收起 → 迷你卡 3D flip (`perspective: 800px + rotateX`)，展开 → outcome 呼吸 (`scale(1.05)` + glow 800ms)
