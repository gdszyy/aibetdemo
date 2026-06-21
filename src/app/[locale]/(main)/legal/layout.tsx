import { SportsLayoutClient } from '../(sports)/sports-layout-client';

export default function LegalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <SportsLayoutClient>{children}</SportsLayoutClient>;
}
