export const useIsProductionHost = () => {
    if (typeof window === 'undefined') return false;

    const hostname = window.location.hostname;
    const isProductionHost = ['gotobet.com', 'www.gotobet.com'].includes(hostname);

    return isProductionHost;
};
