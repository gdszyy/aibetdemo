import Cookies from 'js-cookie';
import { keys } from 'lodash-es';
import type { FunctionComponent } from 'react';
import { Button } from '@/components/button/button';
import { CacheKey } from '@/constants/cache';
import { regionConfigs, useRegionCode } from '@/i18nV2';

/** 切换地区 */
export const Region: FunctionComponent = () => {
    const regionCode = useRegionCode();

    return (
        <div className="p-2 border border-filltext-ft-g">
            <h2 className="text-title-lg">Debug Region</h2>
            <p>The region configured here has a higher priority than the region returned by the API.</p>
            <div>
                current regionCode: <span className="text-brand-primary-0">{regionCode}</span>
                <br />
                debug regionCode: <span className="text-brand-primary-0">{Cookies.get(CacheKey.I18nRegionDebug)}</span>
                <Button
                    variant="text"
                    onClick={() => {
                        Cookies.remove(CacheKey.I18nRegionDebug);
                        window.location.reload();
                    }}
                >
                    Clear
                </Button>
                <br />
                <p>Switch a debug region:</p>
                <div className="flex gap-2">
                    {keys(regionConfigs).map((v) => {
                        return (
                            <Button
                                key={v}
                                type="button"
                                variant="primary"
                                onClick={() => {
                                    Cookies.set(CacheKey.I18nRegionDebug, v);
                                    window.location.reload();
                                }}
                            >
                                {v}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
