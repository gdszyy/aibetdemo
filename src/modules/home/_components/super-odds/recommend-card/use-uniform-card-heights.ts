'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

/** 测量轮播内推荐卡自然高度，取最大值供等高对齐。 */
export const useUniformRecommendCardHeights = (
    cardIds: string[],
): {
    uniformHeight: number | undefined;
    setCardWrapperRef: (cardId: string) => (node: HTMLDivElement | null) => void;
} => {
    const [uniformHeight, setUniformHeight] = useState<number | undefined>();
    const refs = useRef<Map<string, HTMLDivElement>>(new Map());

    const setCardWrapperRef = useCallback(
        (cardId: string) => (node: HTMLDivElement | null) => {
            if (node) {
                refs.current.set(cardId, node);
                return;
            }

            refs.current.delete(cardId);
        },
        [],
    );

    useLayoutEffect(() => {
        const measure = (): void => {
            const nodes = cardIds
                .map((cardId) => refs.current.get(cardId))
                .filter((node): node is HTMLDivElement => node !== undefined);

            if (nodes.length === 0) {
                setUniformHeight(undefined);
                return;
            }

            const maxHeight = nodes.reduce((max, node) => Math.max(max, node.offsetHeight), 0);
            setUniformHeight((current) => (current === maxHeight ? current : maxHeight));
        };

        measure();

        const observer = new ResizeObserver(measure);
        for (const cardId of cardIds) {
            const node = refs.current.get(cardId);
            if (node) {
                observer.observe(node);
            }
        }

        return () => {
            observer.disconnect();
        };
    }, [cardIds]);

    return { uniformHeight, setCardWrapperRef };
};
