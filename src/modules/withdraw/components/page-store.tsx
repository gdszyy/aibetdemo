'use client';

import { useQuery } from '@tanstack/react-query';
import {
    type ContextType,
    createContext,
    type Dispatch,
    type FunctionComponent,
    type PropsWithChildren,
    type SetStateAction,
    useContext,
    useState,
} from 'react';
import { ListChannelInterface } from '@/api/handlers/withdraw';
import type { InterfaceResponse } from '@/api/lib/types';

type Tab = 'withdraw' | 'bankAccount';

const PageStoreContext = createContext(
    {} as {
        tab: Tab;
        setTab: Dispatch<SetStateAction<Tab>>;
        /** 支持的渠道 */
        payChannels: InterfaceResponse<typeof ListChannelInterface>;
    },
);

export function usePageStore() {
    return useContext(PageStoreContext);
}

export type PageStoreType = ContextType<typeof PageStoreContext>;

/** 页面公用状态 */
export const PageStore: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [tab, setTab] = useState<PageStoreType['tab']>('withdraw');

    const { data: payChannels = [] } = useQuery({
        queryKey: ['withdraw', 'payChannels'],
        queryFn: ListChannelInterface,
        staleTime: 10 * 60_000,
        placeholderData: [],
    });

    return (
        <PageStoreContext.Provider
            value={{
                tab,
                setTab,
                payChannels,
            }}
        >
            {children}
        </PageStoreContext.Provider>
    );
};
