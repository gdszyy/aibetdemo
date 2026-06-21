import { useCallback, useRef } from 'react';

type Options = {
    lines?: number;
};

export function useTextOverflow<T extends HTMLElement>({ lines = 1 }: Options = {}) {
    const ref = useRef<T>(null);
    const rangeRef = useRef<Range | null>(null);

    const check = useCallback(() => {
        const element = ref.current;
        if (!element) return false;
        if (lines === 1) {
            const style = window.getComputedStyle(element);
            // getBoundingClientRect keeps sub-pixel precision; clientWidth would round down
            // and can misreport edge cases where ellipsis has not actually kicked in yet.
            const borderLeft = Number.parseFloat(style.borderLeftWidth) || 0;
            const borderRight = Number.parseFloat(style.borderRightWidth) || 0;
            const availableWidth = element.getBoundingClientRect().width - borderLeft - borderRight;
            if (availableWidth === 0) {
                return false;
            }

            // Range measures the rendered text width itself. We add horizontal padding because
            // ellipsis is triggered when text content plus padding exceeds the content box.
            const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
            const paddingRight = Number.parseFloat(style.paddingRight) || 0;
            const range = rangeRef.current ?? document.createRange();
            rangeRef.current = range;
            range.selectNodeContents(element);
            const rangeWidth = range.getBoundingClientRect().width;
            return rangeWidth + paddingLeft + paddingRight > availableWidth;
        }

        return element.scrollHeight > element.clientHeight;
    }, [lines]);

    return { ref, check };
}
