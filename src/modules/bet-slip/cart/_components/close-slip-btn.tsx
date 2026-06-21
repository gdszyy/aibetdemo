import type { FunctionComponent } from 'react';
import { useCommonTranslations } from '@/hooks/use-translations';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';

/** 关闭购物车的按钮 */
export const CloseSlipBtn: FunctionComponent = () => {
    const tCommon = useCommonTranslations();

    const closeBetSlipDrawer = useUIStore((s) => s.closeBetSlipDrawer);

    return (
        <div
            className={cn(
                'w-full h-10 inline-flex justify-center items-center rounded-full bg-filltext-ft-b',
                'text-body-md text-filltext-ft-g',
            )}
            onClick={closeBetSlipDrawer}
        >
            {tCommon('action.close')}
        </div>
    );
};
