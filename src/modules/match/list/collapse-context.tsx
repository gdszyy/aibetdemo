'use client';

import { createContext, type Dispatch, type SetStateAction, useContext } from 'react';

interface CollapseContextValue {
    isCollapsed: boolean;
    setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

export const CollapseContext = createContext<CollapseContextValue | null>(null);

export const useCollapseContext = () => useContext(CollapseContext);
