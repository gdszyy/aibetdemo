import { SportsLayoutClient } from './sports-layout-client';

export default function SportsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <SportsLayoutClient>{children}</SportsLayoutClient>;
}
