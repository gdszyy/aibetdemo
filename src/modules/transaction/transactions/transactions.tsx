'use client';

import type { FC } from 'react';
// import { TransactionsPageMode } from './transactions-page';
import { TransactionsScrollMode } from './transactions-scroll';

/**
 * Transactions tab — pluggable pagination strategy.
 *
 * 'scroll': cursor-based infinite scroll (current backend — legacy endpoint)
 * 'page':   page-based pagination with Pagination component (future — when API supports total count)
 */
// const PAGINATION_MODE: 'page' | 'scroll' = 'scroll';

/** Transactions 当前统一使用游标滚动加载，保留页码模式实现待后续切换。 */
export const Transactions: FC = () => {
    return <TransactionsScrollMode />;
};
