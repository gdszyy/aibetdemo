import type { TransferOrderItemProps } from '@/api/models/transaction';
import type { TransferOrderVM } from './transfer-order-types';

const normalizeTransferOrderValue = (value: string): string => value.trim().toLowerCase();

/** 将接口创建时间解析为 Date，支持秒/毫秒时间戳字符串与标准日期字符串。 */
const parseTransferOrderDate = (value: string): Date | null => {
    const normalizedValue = value.trim();
    if (!normalizedValue) return null;

    const timestamp = Number(normalizedValue);
    const date = Number.isFinite(timestamp)
        ? new Date(timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp)
        : new Date(normalizedValue);

    return Number.isFinite(date.getTime()) ? date : null;
};

/** Adapt API response → UI ViewModel */
export function adaptTransferOrderToVM(item: TransferOrderItemProps): TransferOrderVM {
    return {
        date: parseTransferOrderDate(item.created_at),
        orderType: normalizeTransferOrderValue(item.order_type),
        orderId: item.order_id || '-',
        amount: Number(item.amount) || 0,
        status: normalizeTransferOrderValue(item.order_status),
    };
}
