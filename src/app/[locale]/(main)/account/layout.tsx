import { AccountLayoutClient } from './account-layout-client';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return <AccountLayoutClient>{children}</AccountLayoutClient>;
}
