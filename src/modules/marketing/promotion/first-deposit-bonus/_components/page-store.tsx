'use client';

import { type ContextType, createContext, type FunctionComponent, type PropsWithChildren, useContext } from 'react';

const PageStoreContext = createContext<Record<string, never>>({});

export function usePageStore() {
    return useContext(PageStoreContext);
}

export type PageStoreType = ContextType<typeof PageStoreContext>;

/** 页面公用状态 */
export const PageStore: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <PageStoreContext.Provider value={{}}>{children}</PageStoreContext.Provider>;
};
