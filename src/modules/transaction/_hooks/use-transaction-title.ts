import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { APP_NAME } from '@/constants';
import { TRANSACTION_TAB_LABEL_KEYS, type TransactionTab } from '../_constants';

/**
 * Dynamically updates document.title based on active transaction tab.
 * Format: "{Tab Label} - {Page Title} - {Brand}"
 */
export function useTransactionTitle(tab: TransactionTab) {
    const t = useTranslations('transaction');
    const tUser = useTranslations('user');

    useEffect(() => {
        const prevTitle = document.title;
        const tabLabel = t(TRANSACTION_TAB_LABEL_KEYS[tab]);
        const pageTitle = tUser('menus.transaction');
        document.title = `${tabLabel} - ${pageTitle} - ${APP_NAME}`;
        return () => {
            document.title = prevTitle;
        };
    }, [tab, t, tUser]);
}
