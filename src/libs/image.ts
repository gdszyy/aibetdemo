/** 生成图片的优化宽度 */
export function getOptimizedWidth(
    /** 图片的tailwind宽度size，例如：w-6里的6 */
    widthSize: number,
) {
    return `${widthSize * 4}px`;
}
