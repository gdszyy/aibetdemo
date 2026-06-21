'use client';

import { getLocalTimeZone, today } from '@internationalized/date';
import { useTimeZone, useTranslations } from 'next-intl';
import { type FC, useCallback, useMemo, useState } from 'react';
import { GetTransferOrderListInterface } from '@/api/handlers/transaction';
import type { TransferOrderItemProps } from '@/api/models/transaction';
import { DateRangePicker } from '@/components/date-range-picker';
import {
    type DateRangePickerValue,
    getDateRangeKey,
    getDateRangeTimestampParams,
    getDefaultDateRange,
} from '@/components/date-range-picker/types';
import { FilterSelect } from '@/components/filter-select/filter-select';
import { Loading } from '@/components/loading/loading';
import { Pagination } from '@/components/pagination';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useCurrencyId } from '@/hooks/use-wallet';
import { cn } from '@/utils/common';
import { Empty } from '../_components/empty';
import { StackedListCard } from '../_components/stacked-list-card';
import { usePaginatedQuery } from '../_hooks/use-paginated-query';
import { adaptTransferOrderToVM } from './transfer-order-adapter';
import {
    getTransferOrderStatusMeta,
    getTransferOrderTypeMeta,
    ORDER_STATUS_OPTIONS,
    ORDER_TYPE_OPTIONS,
    TRANSFER_ORDER_COLUMNS,
    type TransferOrderVM,
} from './transfer-order-types';

const PAGE_SIZE = 10;
const EMPTY_TEXT = '-';
const RECENT_MONTH_DAYS = 30;

const getTransferOrderFallbackLabel = (value: string): string => {
    if (!value) return EMPTY_TEXT;

    return value
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

/** 格式化转账订单时间，无效接口时间统一展示占位符。 */
const formatTransferOrderDate = (value: Date | null, formatter: (value: Date) => string): string => {
    return value ? formatter(value) : EMPTY_TEXT;
};

/** 构造列表渲染 key，兼容无效时间导致的空日期。 */
const getTransferOrderItemKey = (item: TransferOrderVM): string => {
    return `${item.orderId}-${item.date?.getTime() ?? 'unknown'}`;
};

/** 桌面端转账订单表格行，完整展示长内容并交由外层横向滚动。 */
const TransferOrderRow: FC<{ item: TransferOrderVM }> = ({ item }) => {
    const t = useTranslations('transaction');
    const { formatNumber, formatRelativeFullDatetime } = useIntlFormatter();
    const statusMeta = getTransferOrderStatusMeta(item.status);
    const typeMeta = getTransferOrderTypeMeta(item.orderType);
    const statusText = statusMeta ? t(statusMeta.labelKey) : getTransferOrderFallbackLabel(item.status);
    const typeText = typeMeta ? t(typeMeta.labelKey) : getTransferOrderFallbackLabel(item.orderType);
    const dateText = formatTransferOrderDate(item.date, formatRelativeFullDatetime);

    return (
        <tr className="group">
            <td className="h-[42px] whitespace-nowrap bg-filltext-ft-a px-4 text-body-md text-filltext-ft-g transition-colors first:rounded-l-sm last:rounded-r-sm last:pr-7 group-hover:bg-filltext-ft-b">
                {dateText}
            </td>
            <td className="h-[42px] whitespace-nowrap bg-filltext-ft-a px-4 text-body-md text-filltext-ft-g transition-colors first:rounded-l-sm last:rounded-r-sm last:pr-7 group-hover:bg-filltext-ft-b">
                {typeText}
            </td>
            <td className="h-[42px] whitespace-nowrap bg-filltext-ft-a px-4 text-body-md text-filltext-ft-g transition-colors first:rounded-l-sm last:rounded-r-sm last:pr-7 group-hover:bg-filltext-ft-b">
                {item.orderId}
            </td>
            <td className="h-[42px] whitespace-nowrap bg-filltext-ft-a px-4 text-body-md text-filltext-ft-g transition-colors first:rounded-l-sm last:rounded-r-sm last:pr-7 group-hover:bg-filltext-ft-b">
                {formatNumber(item.amount)}
            </td>
            <td
                className={cn(
                    'h-[42px] whitespace-nowrap bg-filltext-ft-a px-4 text-body-md transition-colors first:rounded-l-sm last:rounded-r-sm last:pr-7 group-hover:bg-filltext-ft-b',
                    statusMeta?.toneClassName ?? 'text-filltext-ft-g',
                )}
            >
                {statusText}
            </td>
        </tr>
    );
};

const TransferOrderMobileItem: FC<{ item: TransferOrderVM }> = ({ item }) => {
    const t = useTranslations('transaction');
    const { formatNumber, formatRelativeFullDatetime } = useIntlFormatter();
    const statusMeta = getTransferOrderStatusMeta(item.status);
    const typeMeta = getTransferOrderTypeMeta(item.orderType);
    const statusText = statusMeta ? t(statusMeta.labelKey) : getTransferOrderFallbackLabel(item.status);
    const typeText = typeMeta ? t(typeMeta.labelKey) : getTransferOrderFallbackLabel(item.orderType);
    const dateText = formatTransferOrderDate(item.date, formatRelativeFullDatetime);

    return (
        <StackedListCard
            title={<div className="truncate text-auxiliary-md text-filltext-ft-f">{item.orderId}</div>}
            titleRight={
                <span className={cn('text-auxiliary-md', statusMeta?.toneClassName ?? 'text-filltext-ft-g')}>
                    {statusText}
                </span>
            }
        >
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 truncate text-title-sm text-filltext-ft-h">{typeText}</div>
                    <div className="shrink-0 text-title-sm text-filltext-ft-h">{formatNumber(item.amount)}</div>
                </div>
                <div className="text-auxiliary-sm text-filltext-ft-e">{dateText}</div>
            </div>
        </StackedListCard>
    );
};

/**
 * Transfer Order — cursor-based via usePaginatedQuery, adapter pattern.
 * Filters: Order Status, Order Type, Date Range
 * Table: Date | Transaction Type | Order Id | Amount | Status
 */
export const TransferOrder: FC = () => {
    const t = useTranslations('transaction');
    const currencyId = useCurrencyId();
    const timeZone = useTimeZone() || getLocalTimeZone();

    // ─── Filter state ───
    const [orderStatus, setOrderStatus] = useState<string[]>(() => ORDER_STATUS_OPTIONS.map((option) => option.value));
    const [orderType, setOrderType] = useState<string>('deposit');
    const [dateRange, setDateRange] = useState<DateRangePickerValue>(() => getDefaultDateRange(timeZone));

    // ─── Filter options (i18n) ───
    const statusOptions = useMemo(
        () => ORDER_STATUS_OPTIONS.map((o) => ({ label: t(o.labelKey as Parameters<typeof t>[0]), value: o.value })),
        [t],
    );
    const typeOptions = useMemo(
        () => ORDER_TYPE_OPTIONS.map((o) => ({ label: t(o.labelKey as Parameters<typeof t>[0]), value: o.value })),
        [t],
    );

    // ─── Data source — cursor-based, Strategy pagination ───
    const maxDate = useMemo(() => today(timeZone), [timeZone]);
    const minDate = useMemo(() => maxDate.subtract({ days: RECENT_MONTH_DAYS - 1 }), [maxDate]);
    const dateRangeKey = useMemo(() => getDateRangeKey(dateRange), [dateRange]);
    const dateRangeParams = useMemo(() => getDateRangeTimestampParams({}, dateRange, timeZone), [dateRange, timeZone]);
    const serializedOrderStatus = useMemo(() => {
        const allStatusValues = ORDER_STATUS_OPTIONS.map((option) => option.value);
        const selectedStatuses =
            ORDER_STATUS_OPTIONS.every((option) => orderStatus.includes(option.value)) || orderStatus.length === 0
                ? allStatusValues
                : allStatusValues.filter((value) => orderStatus.includes(value));

        return selectedStatuses.join(',');
    }, [orderStatus]);

    const data = usePaginatedQuery<TransferOrderItemProps>({
        mode: 'cursor',
        queryKey: ['transfer-order', currencyId, serializedOrderStatus, orderType, dateRangeKey],
        queryFn: (p) =>
            GetTransferOrderListInterface({
                currency_id: currencyId,
                order_status: serializedOrderStatus,
                order_type: orderType,
                ...dateRangeParams,
                ...p,
            }),
        pageSize: PAGE_SIZE,
        enabled: currencyId > 0,
    });

    // ─── Adapt at boundary ───
    const viewModels = useMemo(() => data.list.map(adaptTransferOrderToVM), [data.list]);

    const handleOrderStatusChange = useCallback((value: string | string[]) => {
        if (Array.isArray(value)) {
            setOrderStatus(value);
        }
    }, []);

    const handleOrderTypeChange = useCallback((value: string | string[]) => {
        if (typeof value === 'string') {
            setOrderType(value);
        }
    }, []);

    return (
        <div className="flex min-w-0 flex-col gap-4 md:gap-6">
            {/* Filters */}
            <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    minValue={minDate}
                    maxValue={maxDate}
                    ariaLabel={t('transferOrder.date')}
                    className="h-12 w-full rounded-md px-4 text-title-sm md:order-2 md:ml-auto md:h-10 md:w-[296px] md:rounded-sm md:px-4 md:text-body-sm"
                />
                <div className="grid min-w-0 grid-cols-2 gap-2 md:order-1 md:flex md:min-w-0 md:flex-1 md:gap-4">
                    <FilterSelect
                        mode="multiple"
                        value={orderStatus}
                        onValueChange={handleOrderStatusChange}
                        options={statusOptions}
                        placeholder={t('transferOrder.orderStatus')}
                        allLabel={t('transferOrder.allStatuses')}
                        contentWidth="content"
                        triggerPrefix={t('transferOrder.orderStatus')}
                        className="h-10 min-w-0 px-3 py-2 text-auxiliary-md md:w-[280px] md:flex-none md:px-4 md:py-3 md:text-body-sm"
                    />
                    <FilterSelect
                        mode="single"
                        value={orderType}
                        onValueChange={handleOrderTypeChange}
                        options={typeOptions}
                        placeholder={t('transferOrder.orderType')}
                        contentWidth="content"
                        triggerPrefix={t('transferOrder.orderType')}
                        className="h-10 min-w-0 px-3 py-2 text-auxiliary-md md:w-[240px] md:flex-none md:px-4 md:py-3 md:text-body-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="flex min-w-0 flex-col">
                {/* Desktop table — columns expand to content width and scroll horizontally when needed. */}
                <div className="hidden min-w-0 overflow-x-auto md:block">
                    <table className="w-max min-w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                {TRANSFER_ORDER_COLUMNS.map((col) => (
                                    <th
                                        key={col.key}
                                        className="h-12 whitespace-nowrap bg-filltext-ft-c px-4 text-left text-body-lg text-filltext-ft-h first:rounded-l-sm last:rounded-r-sm last:pr-7"
                                        style={{ minWidth: col.width }}
                                    >
                                        {t(col.labelKey)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {!data.isLoading && viewModels.length > 0 ? (
                            <tbody>
                                {viewModels.map((vm) => (
                                    <TransferOrderRow key={getTransferOrderItemKey(vm)} item={vm} />
                                ))}
                            </tbody>
                        ) : null}
                    </table>
                </div>

                {/* Mobile rows and non-data states */}
                {data.isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loading className="size-6" variant="color-red" />
                    </div>
                ) : viewModels.length > 0 ? (
                    <div className="flex flex-col gap-2 md:hidden">
                        {viewModels.map((vm) => (
                            <TransferOrderMobileItem key={getTransferOrderItemKey(vm)} item={vm} />
                        ))}
                    </div>
                ) : (
                    <Empty />
                )}
            </div>

            {/* Pagination — cursor strategy via usePaginatedQuery */}
            <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={data.setPage}
                variant="subtle"
                className="max-md:justify-center"
            />
        </div>
    );
};
