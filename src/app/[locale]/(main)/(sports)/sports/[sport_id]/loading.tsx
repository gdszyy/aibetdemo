import { SkeletonMatchListContent } from '@/components/route-skeletons';

/**
 * 单一运动比赛列表加载骨架。
 * 渲染在 MatchListShell 内，使运动间切换（如足球→篮球）时立即出骨架、保留列表外壳。
 */
export default function SportDetailLoading() {
    return <SkeletonMatchListContent />;
}
