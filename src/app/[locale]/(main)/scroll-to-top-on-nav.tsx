'use client';

import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';

import { usePathname } from '@/i18n';
import { consumeScrollToTopSuppression, createNavigationScrollKey } from '@/utils/navigation-scroll';

let popStateTriggered = false;

if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
        popStateTriggered = true;
    });
}

export default function ScrollToTopOnNav() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchKey = searchParams?.toString() ?? '';

    const lastScrollKeyRef = useRef('');

    useLayoutEffect(() => {
        if (popStateTriggered) {
            popStateTriggered = false;
            return;
        }

        const scrollKey = createNavigationScrollKey(pathname, searchKey);
        if (scrollKey === lastScrollKeyRef.current) return;
        lastScrollKeyRef.current = scrollKey;

        if (consumeScrollToTopSuppression(scrollKey)) return;

        // 必须在浏览器绘制前置顶，避免下一页组件先读到上一页遗留的 scrollY。
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [pathname, searchKey]);

    return null;
}
