import type { CasinoReportItem, GameReportItem, SportReportItem } from '@/api/models/transaction-bethistory';

export type BetFilterType = 'all' | 'sport' | 'casino';

export type BetHistoryListItem = GameReportItem | SportReportItem | CasinoReportItem;
