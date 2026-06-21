let suppressedScrollKey: string | null = null;

export const createNavigationScrollKey = (pathname: string, searchKey: string) =>
    `${pathname}?${searchKey.replaceAll('%3A', ':')}`;

export const suppressNextScrollToTop = (url: string) => {
    const [pathname, searchKey = ''] = url.split('?');
    suppressedScrollKey = createNavigationScrollKey(pathname, searchKey);
};

export const consumeScrollToTopSuppression = (scrollKey: string) => {
    if (suppressedScrollKey !== scrollKey) return false;

    suppressedScrollKey = null;
    return true;
};
