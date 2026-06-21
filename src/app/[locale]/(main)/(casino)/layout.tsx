import { CasinoLayoutClient } from './casino-layout-client';

export default function CasinoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <CasinoLayoutClient>{children}</CasinoLayoutClient>;
}
