import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TransmisionPlaceholder } from '@/modules/transmision/transmision-placeholder';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('common');
    return { title: t('mainMenu.transmision') };
}

/** 直播（Transmisión）占位路由，布局后续再改。 */
export default function SportsTransmisionPage() {
    return <TransmisionPlaceholder />;
}
