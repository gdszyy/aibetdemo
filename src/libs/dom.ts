import { useEffect, useRef } from 'react';

/** 元素进入可视区域 */
export const useIntersectionReport = (
    callback: (event: IntersectionObserverEntry) => void,
    options?: Partial<{
        /** 只执行一次 */
        once: boolean;
        /** 元素在可视区域出现的比例阈值，才算进入可视区域 */
        threshold: number;
    }>,
) => {
    const threshold = options?.threshold ?? 0.5;

    const targetRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    callback(entry);
                    // 触发后立即停止监听当前元素
                    if (options?.once) {
                        observer.unobserve(entry.target);
                    }
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold,
            },
        );

        // 4. 组件挂载后，监听目标元素（targetRef.current为组件根元素）
        const target = targetRef.current;
        if (target) {
            observer.observe(target);
        }

        // 5. 组件卸载时，销毁监听器，避免内存泄漏
        return () => {
            if (target) {
                observer.unobserve(target);
            }
            observer.disconnect();
        };
    }, [callback, options?.once, threshold]);

    return targetRef;
};
