'use client';

import { type FunctionComponent, useEffect, useState } from 'react';
import { cn } from '@/utils/common';

const ANJ_SEAL_ID = '1937741b-6c2d-47a6-9071-765607c10029';

type AnjSealWindow = Window & {
    anj_1937741b_6c2d_47a6_9071_765607c10029?: {
        init: () => void;
    };
};

export const AnjSealMount: FunctionComponent = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        (window as AnjSealWindow).anj_1937741b_6c2d_47a6_9071_765607c10029?.init();
    }, [isMounted]);

    return (
        <div className="h-full w-full flex items-center justify-center overflow-hidden rounded-sm hover:bg-filltext-ft-a">
            {isMounted ? (
                <div
                    className={cn(
                        'grayscale brightness-[1.4] contrast-[0.6] opacity-50 [&_*]:max-h-5 [&_*]:!w-auto',
                        'md:[&_*]:max-h-5',
                    )}
                    id={`anj-${ANJ_SEAL_ID}`}
                    data-anj-seal-id={ANJ_SEAL_ID}
                    data-anj-image-size="32"
                    data-anj-image-type="basic-small"
                />
            ) : null}
        </div>
    );
};
