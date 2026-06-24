import { CasinoHomeSkeleton } from '@/modules/casino/home/components/casino-home-skeleton';

/**
 * 赌场板块内容区加载骨架。
 * 复用赌场大厅既有骨架（分组 + 卡片），作为 (casino) 路由组的 Suspense 边界。
 */
export default function CasinoLoading() {
    return (
        <div className="flex w-full flex-col px-3 py-3 md:px-4 md:py-4">
            <CasinoHomeSkeleton />
        </div>
    );
}
