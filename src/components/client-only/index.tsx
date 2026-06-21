'use client';

import { type FunctionComponent, type PropsWithChildren, type ReactNode, useEffect, useState } from 'react';

/** 客户端渲染 */
export const ClientOnly: FunctionComponent<PropsWithChildren<{ fallback?: ReactNode }>> = ({
    children,
    fallback = null,
}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // 水合阶段显示占位，完成后显示客户端内容
    return isClient ? children : fallback;
};
