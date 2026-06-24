import { SkeletonSportsContent } from '@/components/route-skeletons';

/**
 * 体育板块内容区加载骨架。
 * 作为 (sports) 路由组的 Suspense 边界：侧边栏 / 投注单等 Layout 外壳保持不变，
 * 仅内容区在页面数据就绪前显示骨架屏。
 */
export default function SportsLoading() {
    return <SkeletonSportsContent />;
}
