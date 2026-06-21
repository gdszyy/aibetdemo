import type { FunctionComponent } from 'react';
import { Search } from '@/components/icons';
import { useCommonTranslations } from '@/hooks/use-translations';
import { cn } from '@/utils/common';
import { usePageStore } from './page-store';

/** 关键词搜索 */
export const KeywordFilter: FunctionComponent = () => {
    const tCommon = useCommonTranslations();
    const { searchKeyword, setSearchKeyword } = usePageStore();
    const hasValue = Boolean(searchKeyword);

    return (
        <div className="w-full md:flex-1 h-10 relative">
            <input
                type="text"
                data-value={hasValue}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={tCommon('action.search')}
                className={cn(
                    'peer',
                    'w-full h-full px-11 rounded-full',
                    'border-none',
                    'text-body-md font-medium',
                    'bg-surface-1',
                    'data-[value=false]:text-filltext-ft-f data-[value=false]:placeholder:text-filltext-ft-f',
                    'data-[value=true]:text-filltext-ft-g data-[value=true]:placeholder:text-filltext-ft-g',
                    'focus:text-filltext-ft-g! focus:placeholder:text-filltext-ft-g!',
                )}
            />
            <Search
                className={cn(
                    'absolute left-4 top-1/2 transform -translate-y-1/2 size-5',
                    'peer-data-[value=false]:text-filltext-ft-f',
                    'peer-data-[value=ftruealse]:text-filltext-ft-g',
                    'peer-focus:text-filltext-ft-g!',
                )}
            />
        </div>
    );
};
