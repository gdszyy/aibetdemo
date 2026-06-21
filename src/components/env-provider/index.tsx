import { createContext, type FC, type PropsWithChildren, useContext } from 'react';

const EnvContext = createContext<{
    isMobile: boolean;
    isDesktop: boolean;
}>({
    isMobile: false,
    isDesktop: false,
});

export const useEnvContext = () => useContext(EnvContext);

/** 一些全局环境环境，需要从服务端传递的 */
export const EnvProvider: FC<
    PropsWithChildren<{
        isMobile: boolean;
        isDesktop: boolean;
    }>
> = ({ children, isMobile, isDesktop }) => {
    return <EnvContext.Provider value={{ isMobile, isDesktop }}>{children}</EnvContext.Provider>;
};
