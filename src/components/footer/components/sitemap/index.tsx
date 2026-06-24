'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { GetCasinoGameLobbiesV2Interface, GetCasinoGameTagsInterface } from '@/api/handlers/casino';
import { CasinoActions, generateQueryKey, ModuleKeys } from '@/constants/query-keys';
import { UserCenterMenu } from '@/constants/user-center';
import { useAccountNavigator } from '@/hooks/use-account-navigator';
import { useIsMobile } from '@/hooks/use-media-query';
import { Link } from '@/i18n';
import { useIsLogin } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import type { FooterSiteMapColumnConfig } from '../../services/constant';
import { Collapse } from '../collapse';

const useSportLinks = () => {
    const t = useTranslations('common');

    const ret: FooterSiteMapColumnConfig = {
        key: 'sports',
        title: t('footer.columns.sports'),
        items: [
            { key: 'sports-live', title: t('footer.links.liveSports'), href: '/sports-live' },
            { key: 'sports-home', title: t('footer.links.sportHome'), href: '/sports' },
            { key: 'sports-rules', title: t('footer.links.sportsRules'), href: '/sports/rules' },
        ],
    };

    return ret;
};

const useCasinoLinks = () => {
    const t = useTranslations('common');

    const { data: lobbies } = useQuery({
        queryKey: generateQueryKey(ModuleKeys.CASINO, CasinoActions.LOBBIES),
        queryFn: GetCasinoGameLobbiesV2Interface,
        staleTime: 10 * 60 * 1000,
    });
    const firstLobbyId = lobbies?.[0]?.id;

    const { data: tags } = useQuery({
        queryKey: generateQueryKey(ModuleKeys.CASINO, CasinoActions.TAGS, { lobbyId: firstLobbyId }),
        queryFn: () => (firstLobbyId ? GetCasinoGameTagsInterface(firstLobbyId) : Promise.resolve([])),
        enabled: !!firstLobbyId,
        staleTime: 10 * 60 * 1000,
    });

    const defaultItems: FooterSiteMapColumnConfig['items'] = [
        { key: 'casino-home', title: t('footer.links.casinoHome'), href: '/casino' },
        { key: 'casino-slots', title: t('footer.links.slots'), href: '/casino?tag_id=slots' },
        { key: 'casino-promotions', title: t('footer.links.promotions'), href: '/casino/promotions' },
    ];

    const ret: FooterSiteMapColumnConfig = {
        key: 'casino',
        title: t('footer.columns.casino'),
        items: [],
    };

    if (!firstLobbyId) {
        ret.items = defaultItems;
        return ret;
    }

    const slotsTag = tags?.find((t) => t.tag_code.toUpperCase() === 'SLOT');
    ret.items = defaultItems.map((item) => {
        if (item.key === 'casino-slots' && slotsTag) {
            return { ...item, href: `/casino/${firstLobbyId}?tag_id=${slotsTag.id}` };
        }
        return item;
    });

    return ret;
};

const useLegalLinks = () => {
    const t = useTranslations('common');

    const ret: FooterSiteMapColumnConfig = {
        key: 'legal',
        title: t('footer.columns.legal'),
        items: [
            { key: 'legal-terms', title: t('footer.links.termsOfService'), href: '/legal/terms' },
            { key: 'legal-privacy', title: t('footer.links.privacyPolicy'), href: '/legal/privacy' },
            { key: 'legal-aml-kyc', title: t('footer.links.amlKycPolicy'), href: '/legal/aml-kyc' },
            {
                key: 'legal-responsible-gaming',
                title: t('footer.links.responsibleGaming'),
                href: '/legal/responsible-gaming',
            },
        ],
    };

    return ret;
};

const useSupportLinks = () => {
    const isLogin = useIsLogin();
    const openLoginModal = useUIStore((s) => s.openLoginModal);
    const accountNavigator = useAccountNavigator();
    const t = useTranslations('common');

    const handleClick = (callback: () => void) => {
        if (!isLogin) {
            openLoginModal();
            return;
        }
        callback();
    };

    const ret: FooterSiteMapColumnConfig = {
        key: 'support',
        title: t('footer.columns.support'),
        items: [
            {
                key: 'support-faq',
                title: t('footer.links.faq'),
                href: '/support/faq',
                onClick: () => {
                    handleClick(() => {
                        accountNavigator.open(UserCenterMenu.FAQ);
                    });
                },
            },
            {
                key: 'support-contact-us',
                title: t('footer.links.contactUs'),
                href: '/support/contact-us',
                onClick: () => {
                    handleClick(() => {
                        accountNavigator.open(UserCenterMenu.SUPPORT);
                    });
                },
            },
            {
                key: 'support-deposit-withdrawal',
                title: t('footer.links.depositWithdrawal'),
                href: '/support/deposit-withdrawal',
                onClick: () => {
                    handleClick(() => {
                        accountNavigator.open(UserCenterMenu.DEPOSIT);
                    });
                },
            },
        ],
    };

    return ret;
};

export const SiteMap: FunctionComponent = () => {
    const sportLinks = useSportLinks();
    const casinoLinks = useCasinoLinks();
    const legalLinks = useLegalLinks();
    const supportLinks = useSupportLinks();

    const columns = [sportLinks, casinoLinks, legalLinks, supportLinks];

    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <>
                {columns.map((col) => {
                    return (
                        <Collapse key={col.key} title={col.title} titleBold>
                            <nav className="flex flex-col gap-4">
                                {col.items.map((item) => {
                                    if (item.onClick) {
                                        return (
                                            <button
                                                key={item.key}
                                                type="button"
                                                onClick={() => item.onClick?.(item)}
                                                className="text-left text-filltext-ft-f text-auxiliary-sm font-normal"
                                            >
                                                {item.title}
                                            </button>
                                        );
                                    }

                                    if (!item.href) {
                                        return null;
                                    }

                                    return (
                                        <Link
                                            key={item.key}
                                            href={item.href}
                                            className="text-filltext-ft-f text-auxiliary-sm font-normal"
                                        >
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </Collapse>
                    );
                })}
            </>
        );
    }

    return (
        <div className="flex flex-row justify-between">
            {columns.map((col) => (
                <section key={col.key} className="w-40">
                    <h3 className="text-body-lg text-filltext-ft-g mb-6">{col.title}</h3>
                    <nav className="flex flex-col gap-6">
                        {col.items.map((item) => {
                            if (item.onClick) {
                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => item.onClick?.(item)}
                                        className="text-left text-auxiliary-sm text-filltext-ft-f hover:text-brand-red transition-colors w-fit max-w-full cursor-pointer"
                                    >
                                        {item.title}
                                    </button>
                                );
                            }

                            if (!item.href) {
                                return null;
                            }

                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className="text-auxiliary-sm text-filltext-ft-f hover:text-brand-red transition-colors w-fit max-w-full"
                                >
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </section>
            ))}
        </div>
    );
};
