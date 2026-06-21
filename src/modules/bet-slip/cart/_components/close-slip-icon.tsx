import type { FunctionComponent } from 'react';
import { Arrow } from '@/components/Arrow';
import { useUIStore } from '@/stores/ui-store';

/** 关闭购物车的图标 */
export const CloseSlipIcon: FunctionComponent = () => {
    const closeBetSlipDrawer = useUIStore((s) => s.closeBetSlipDrawer);

    return (
        <div
            className="size-10 rounded-full bg-filltext-ft-a inline-flex items-center justify-center cursor-pointer"
            onClick={closeBetSlipDrawer}
        >
            <Arrow className="size-4 text-filltext-ft-g" direction="down" />
        </div>
    );
};
