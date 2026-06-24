'use client';

import { type FC, type FormEvent, useState } from 'react';
import { SearchOutlined } from '@/components/icons2/SearchOutlined';
import { LSPORTS_SPORT_ID_BY_TYPE } from '@/constants/sports';
import { Link, useRouter } from '@/i18n';

const RECENT_LINKS = [
    { label: 'Real Madrid', href: `/sports/${LSPORTS_SPORT_ID_BY_TYPE.football}` },
    { label: 'Chelsea', href: `/sports/${LSPORTS_SPORT_ID_BY_TYPE.football}` },
    { label: 'Lakers', href: `/sports/${LSPORTS_SPORT_ID_BY_TYPE.basketball}` },
] as const;

const TRENDING_LINKS = [
    { label: 'El Clasico', href: `/sports/${LSPORTS_SPORT_ID_BY_TYPE.football}` },
    { label: 'World Cup', href: '/leagues/80462' },
    { label: 'Live Now', href: '/sports-live' },
] as const;

export const SportsQuickAccess: FC = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedQuery = query.trim();
        router.push(trimmedQuery ? `/sports-live?q=${encodeURIComponent(trimmedQuery)}` : '/sports-live');
    };

    return (
        <section className="flex flex-col gap-2">
            <form
                onSubmit={handleSubmit}
                className="flex h-11 items-center gap-3 rounded-[var(--style-radius-panel)] border border-[color:var(--border-subtle)] bg-surface-1 px-3 text-content-muted transition-colors focus-within:border-[color:var(--brand-primary-0)]"
            >
                <SearchOutlined className="size-5 shrink-0" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-body-md text-content-primary outline-none placeholder:text-content-muted"
                    placeholder="Search teams or matches"
                    type="search"
                />
            </form>
            <div className="grid gap-2 md:grid-cols-2">
                <QuickLinkGroup title="Recent" links={RECENT_LINKS} />
                <QuickLinkGroup title="Trending" links={TRENDING_LINKS} />
            </div>
        </section>
    );
};

const QuickLinkGroup: FC<{ title: string; links: readonly { label: string; href: string }[] }> = ({ title, links }) => {
    return (
        <div className="flex min-w-0 items-center gap-2 rounded-[var(--style-radius-card)] border border-[color:var(--border-subtle)] bg-surface-1 px-3 py-2">
            <span className="shrink-0 text-auxiliary-md font-bold uppercase text-content-muted">{title}</span>
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {links.map((link) => (
                    <Link
                        key={`${title}-${link.label}`}
                        href={link.href}
                        className="shrink-0 rounded-full border border-[color:var(--border-subtle)] bg-surface-2 px-3 py-1 text-auxiliary-md font-semibold text-content-secondary transition-colors hover:border-[color:var(--brand-primary-0)] hover:text-content-primary"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};
