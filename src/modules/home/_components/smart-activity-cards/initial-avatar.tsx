import type { CSSProperties, FC } from 'react';
import { cn } from '@/utils/common';

interface InitialAvatarProps {
    /** 展示名，用于取首字母。 */
    name: string;
    /** 尺寸 / 额外样式类（如 size-12）。 */
    className?: string;
    /** 首字母字号类，默认 text-title-sm。 */
    textClassName?: string;
    /** brand=品牌渐变底（高光选手），muted=中性底（当前用户）。 */
    variant?: 'brand' | 'muted';
    style?: CSSProperties;
}

/** 从展示名取 1-2 个首字母：多词取首尾词首字母，单词取前两位。 */
const getInitials = (name: string): string => {
    const cleaned = name.trim();
    if (!cleaned) return '?';

    const words = cleaned.split(/\s+/);
    if (words.length > 1) {
        const first = words[0]?.[0] ?? '';
        const last = words[words.length - 1]?.[0] ?? '';
        return (first + last).toUpperCase();
    }

    return cleaned.slice(0, 2).toUpperCase();
};

const BRAND_AVATAR_STYLE: CSSProperties = {
    background: 'linear-gradient(135deg, var(--brand-primary-0) 0%, var(--brand-primary-4) 100%)',
    color: 'var(--on-brand)',
};

/** 首字母头像：主题安全（品牌渐变 / 中性底），无需图片资源。 */
export const InitialAvatar: FC<InitialAvatarProps> = ({
    name,
    className,
    textClassName = 'text-title-sm',
    variant = 'brand',
    style,
}) => {
    const isBrand = variant === 'brand';

    return (
        <div
            className={cn(
                'inline-flex shrink-0 select-none items-center justify-center rounded-full font-black leading-none',
                !isBrand &&
                    'border border-[color:var(--border-strong)] bg-[var(--surface-2)] text-content-secondary',
                textClassName,
                className,
            )}
            style={isBrand ? { ...BRAND_AVATAR_STYLE, ...style } : style}
        >
            {getInitials(name)}
        </div>
    );
};
