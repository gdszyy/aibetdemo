import { useCallback, useState } from 'react';

export const useShow = <ShowKey extends string>(initValue?: Partial<Record<ShowKey, boolean>>) => {
    const [show, setShow] = useState<Partial<Record<ShowKey, boolean>>>(initValue || {});

    const dispatchShow = useCallback((input: Partial<Record<ShowKey, boolean>>) => {
        setShow((prev) => {
            return { ...prev, ...input };
        });
    }, []);

    return [show, dispatchShow] as const;
};
