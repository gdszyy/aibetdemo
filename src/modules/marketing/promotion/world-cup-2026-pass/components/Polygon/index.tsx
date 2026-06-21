import { type FC, type PropsWithChildren, useEffect, useId, useState } from 'react';
import { getColor } from '@/components/icons2/utils/helper';
import type { SVGIconProps } from '@/components/icons2/utils/types';
import { cn } from '@/utils/common';

export const Polygon: FC<
    SVGIconProps & {
        // 是否解锁，解锁显示绿色渐变，未解锁显示灰色渐变
        isUnlocked: boolean;
        // 是否为高级通行证
        isHighLevel: boolean;
    }
> = ({ color = ['#00B76E', '#008044', '#45BC42', '#9DE57C'], isHighLevel = false, isUnlocked = false, ...props }) => {
    const uid = useId().replaceAll(':', '');
    const filterId = `polygon-filter-${uid}`;
    const fillGradientId = `polygon-fill-gradient-${uid}`;
    const strokeGradientId = `polygon-stroke-gradient-${uid}`;

    return (
        <svg viewBox="0 0 31 35" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <g filter={`url(#${filterId})`}>
                <path
                    d="M15.1562 0.299805L29.0127 8.2998V24.2998L15.1562 32.2998L1.29984 24.2998V8.2998L15.1562 0.299805Z"
                    fill={`url(#${fillGradientId})`}
                />
                <path
                    d="M28.0127 8.87695V23.7217L15.1562 31.1445L2.2998 23.7217V8.87695L15.1562 1.4541L28.0127 8.87695Z"
                    stroke={`url(#${strokeGradientId})`}
                    strokeWidth="2"
                />
            </g>
            <defs>
                {isUnlocked ? (
                    isHighLevel ? (
                        <filter
                            id={filterId}
                            x="0.000781298"
                            y="-0.000195265"
                            width="30.3109"
                            height="34.6"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                        >
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                            />
                            <feOffset dy="1" />
                            <feGaussianBlur stdDeviation="0.65" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.027451 0 0 0 0 0.380392 0 0 0 0 0.00784314 0 0 0 1 0"
                            />
                            <feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${uid}`} />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2={`effect1_dropShadow_${uid}`}
                                result="shape"
                            />
                        </filter>
                    ) : (
                        <filter
                            id={filterId}
                            x="4.88758e-05"
                            y="-0.000195265"
                            width="30.3129"
                            height="34.6"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                        >
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                            />
                            <feOffset dy="1" />
                            <feGaussianBlur stdDeviation="0.65" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.780392 0 0 0 0 0 0 0 0 0 0.0117647 0 0 0 1 0"
                            />
                            <feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${uid}`} />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2={`effect1_dropShadow_${uid}`}
                                result="shape"
                            />
                        </filter>
                    )
                ) : (
                    <filter
                        id={filterId}
                        x="4.88758e-05"
                        y="-0.000195265"
                        width="30.3129"
                        height="34.6"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dy="1" />
                        <feGaussianBlur stdDeviation="0.65" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.413462 0 0 0 0 0.413462 0 0 0 0 0.413462 0 0 0 1 0"
                        />
                        <feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${uid}`} />
                        <feBlend mode="normal" in="SourceGraphic" in2={`effect1_dropShadow_${uid}`} result="shape" />
                    </filter>
                )}
                <linearGradient
                    id={fillGradientId}
                    x1="15.1562"
                    y1="29.2998"
                    x2="15.1562"
                    y2="2.29981"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor={getColor(color, 1, '#00B76E')} />
                    <stop offset="1" stopColor={getColor(color, 2, '#008044')} />
                </linearGradient>
                <linearGradient
                    id={strokeGradientId}
                    x1="15.1562"
                    y1="0.299805"
                    x2="15.1563"
                    y2="32.2998"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor={getColor(color, 3, '#45BC42')} />
                    <stop offset="1" stopColor={getColor(color, 4, '#9DE57C')} />
                </linearGradient>
            </defs>
        </svg>
    );
};

/** 多边形图标组件 */
export const PolygonIcon: FC<
    PropsWithChildren<{
        // 是否解锁，解锁显示绿色渐变，未解锁显示灰色渐变
        isUnlocked: boolean;
        // 是否为高级通行证
        isHighLevel: boolean;
    }>
> = ({ children, isUnlocked, isHighLevel }) => {
    const [color, setColor] = useState(['#00B76E', '#008044', '#45BC42', '#9DE57C']);
    useEffect(() => {
        if (isHighLevel) {
            if (isUnlocked) {
                setColor(['#00B76E', '#008044', '#45BC42', '#9DE57C']);
            } else {
                setColor(['#BFBFBF', '#8B8B8B', '#C1C4C1', '#EAEAEA']);
            }
        } else {
            if (isUnlocked) {
                setColor(['#E80104', '#8C0002', '#FF9697', '#FFDDDD']);
            } else {
                setColor(['#BFBFBF', '#8B8B8B', '#C1C4C1', '#EAEAEA']);
            }
        }
    }, [isUnlocked, isHighLevel]);
    return (
        <div className={cn('relative w-7.75 h-8.75')}>
            <Polygon className="w-8 h-9.25" isHighLevel={isHighLevel} isUnlocked={isUnlocked} color={color} />
            <div className="absolute inset-0 flex justify-center items-center text-filltext-ft-c text-[13px] font-bold font-barlow">
                {children}
            </div>
        </div>
    );
};
