import type { FunctionComponent } from 'react';
import { Search } from '@/components/icons';
import { useCommonTranslations } from '@/hooks/use-translations';
import { cn } from '@/utils/common';
import { usePageStore } from './page-store';

/** 关键词搜索 */
export const KeywordFilterH5: FunctionComponent = () => {
    const tCommon = useCommonTranslations();
    const { searchKeyword, setSearchKeyword } = usePageStore();
    const hasValue = Boolean(searchKeyword);

    return (
        <div className={cn('min-w-0 flex-3 h-10 flex items-center bg-surface-1 rounded-sm')}>
            <input
                type="text"
                data-value={hasValue}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={tCommon('action.search')}
                className={cn(
                    'order-2',
                    'peer',
                    'h-full',
                    'border-none',
                    'text-body-md font-medium',
                    'text-filltext-ft-f placeholder:text-filltext-ft-f',
                    'focus:text-filltext-ft-g focus:placeholder:text-filltext-ft-g',
                    'flex-1 pr-4',
                )}
            />
            <span className="order-1 shrink-0 h-full w-10 inline-flex justify-center items-center text-filltext-ft-f peer-focus:text-filltext-ft-g">
                <Search className={cn('size-5', 'text-inherit')} />
            </span>
        </div>
    );
};
