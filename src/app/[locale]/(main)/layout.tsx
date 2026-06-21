import { MainShell } from './main-shell';

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <MainShell>{children}</MainShell>;
}
