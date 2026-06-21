import { isString } from 'lodash-es';
import Image, { type StaticImageData } from 'next/image';
import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/utils/common';

/** 标题区域 */
export const BlockTitle2: FunctionComponent<
    PropsWithChildren<{
        icon?: FunctionComponent<{ className?: string }>;
        iconClassName?: string;
        iconImage?: StaticImageData;
        iconImageClassName?: string;
        title?: ReactNode;
        titleClassName?: string;
        right?: ReactNode;
    }>
> = ({ icon: Icon, iconClassName, iconImage, iconImageClassName, title, titleClassName, right }) => {
    return (
        <div>
            {Boolean(title) && (
                <div className="h-7 flex items-center">
                    {Icon && <Icon className={cn('size-7 mr-2', iconClassName)} />}
                    {iconImage && <Image className={cn('size-7 mr-2', iconImageClassName)} src={iconImage} alt="" />}
                    {isString(title) ? (
                        <span
                            className={cn(
                                'text-filltext-ft-h text-title-lg font-roboto-flex variation-title ellipsis',
                                titleClassName,
                            )}
                        >
                            {title}
                        </span>
                    ) : (
                        title
                    )}
                    <div className="shrink-0 flex-1 min-w-4" />
                    <div className="shrink-0">{right}</div>
                </div>
            )}
        </div>
    );
};
