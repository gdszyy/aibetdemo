import Cookies from 'js-cookie';
import { useLocale } from 'next-intl';
import type { FunctionComponent } from 'react';
import { Button } from '@/components/button/button';
import { CacheKey } from '@/constants/cache';
import { type Locale, usePathname } from '@/i18n';
import { regionConfigs, useRegionCode } from '@/i18nV2';

/** 切换语言 */
export const Language: FunctionComponent = () => {
    const pathname = usePathname();
    const language = useLocale();

    const languages = regionConfigs[useRegionCode()]?.supportLanguages || [];

    const handleClick = (lang: Locale) => {
        Cookies.set(CacheKey.I18nLanguage, lang, { path: '/', expires: 365, sameSite: 'lax' });
        const nextUrl = new URL(window.location.href);
        nextUrl.pathname = `/${lang}${pathname}`;
        window.location.assign(nextUrl.toString());
    };

    return (
        <div className="p-2 border border-filltext-ft-g">
            <h2 className="text-title-lg">Debug Language</h2>
            <p>The language configured here has a higher priority than the language returned by the API.</p>
            <div>
                current language: <span className="text-brand-primary-0">{language}</span>
                <Button
                    variant="text"
                    onClick={() => {
                        Cookies.remove(CacheKey.I18nLanguage);
                        window.location.href = '/';
                    }}
                >
                    Clear
                </Button>
                <br />
                <p>Switch a debug language:</p>
                <div className="flex gap-2">
                    {languages.map((v) => {
                        return (
                            <Button
                                key={v}
                                type="button"
                                variant="primary"
                                onClick={() => {
                                    handleClick(v);
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
