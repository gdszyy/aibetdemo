import { useEffect, useState } from 'react';

// 是否显示statscore组件
export const useShowStatscoreWidget = () => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // 域名匹配才展示
        const host = window.location.host;
        if (
            ['.helix.city', '.gotobet.com', 'localhost'].some((v) => {
                return host.includes(v);
            }) ||
            ['gotobet.com'].some((v) => {
                return host === v;
            })
        ) {
            setReady(true);
        }
    }, []);

    return ready;
};
