import type { TranslationKey } from '@/i18nV2';

export type TransferOrderStatusValue = 'created' | 'pending' | 'completed' | 'failed';
export type TransferOrderTypeValue = 'deposit' | 'withdraw';
//  | 'sportbonus' | 'casinobonus';

// ─── ViewModel (UI layer, decoupled from API) ───

/** 转账订单列表展示模型，隔离接口字段与 UI 渲染字段。 */
export interface TransferOrderVM {
    /** 订单创建时间；接口时间无效时为空，由展示层渲染占位。 */
    date: Date | null;
    /** 订单类型，用于匹配本地化类型文案。 */
    orderType: string;
    /** 订单编号。 */
    orderId: string;
    /** 订单金额。 */
    amount: number;
    /** 订单状态，用于匹配本地化状态文案。 */
    status: string;
}

interface TransferOrderOption<Value extends string> {
    labelKey: TranslationKey<'transaction'>;
    value: Value;
}

interface TransferOrderStatusMeta {
    labelKey: TranslationKey<'transaction'>;
    toneClassName: string;
}

// ─── Column config (Strategy pattern) ───

export interface TransferOrderColumnConfig {
    key: keyof TransferOrderVM;
    labelKey: TranslationKey<'transaction'>;
    width: number;
}

export const TRANSFER_ORDER_COLUMNS: TransferOrderColumnConfig[] = [
    { key: 'date', labelKey: 'transferOrder.date', width: 200 },
    { key: 'orderType', labelKey: 'transferOrder.transactionType', width: 200 },
    { key: 'orderId', labelKey: 'transferOrder.orderId', width: 200 },
    { key: 'amount', labelKey: 'transferOrder.amount', width: 160 },
    { key: 'status', labelKey: 'transferOrder.status', width: 160 },
];

export const TRANSFER_ORDER_STATUS_META: Record<TransferOrderStatusValue, TransferOrderStatusMeta> = {
    created: {
        labelKey: 'transferOrder.statusCreated',
        toneClassName: 'text-func-pending',
    },
    pending: {
        labelKey: 'transferOrder.statusPending',
        toneClassName: 'text-func-pending',
    },
    completed: {
        labelKey: 'transferOrder.statusCompleted',
        toneClassName: 'text-func-win',
    },
    failed: {
        labelKey: 'transferOrder.statusFailed',
        toneClassName: 'text-func-lost',
    },
};

export const TRANSFER_ORDER_TYPE_META: Record<TransferOrderTypeValue, TransferOrderOption<TransferOrderTypeValue>> = {
    deposit: { labelKey: 'transferOrder.typeDeposit', value: 'deposit' },
    withdraw: { labelKey: 'transferOrder.typeWithdraw', value: 'withdraw' },
    // sportbonus: { labelKey: 'transferOrder.typeSportBonus', value: 'sportbonus' },
    // casinobonus: { labelKey: 'transferOrder.typeCasinoBonus', value: 'casinobonus' },
};

// ─── Filter options (Strategy pattern) ───

export const ORDER_STATUS_OPTIONS: readonly TransferOrderOption<TransferOrderStatusValue>[] = [
    { labelKey: 'transferOrder.statusCreated', value: 'created' },
    { labelKey: 'transferOrder.statusPending', value: 'pending' },
    { labelKey: 'transferOrder.statusCompleted', value: 'completed' },
    { labelKey: 'transferOrder.statusFailed', value: 'failed' },
] as const;

export const ORDER_TYPE_OPTIONS: readonly TransferOrderOption<TransferOrderTypeValue>[] = [
    TRANSFER_ORDER_TYPE_META.deposit,
    TRANSFER_ORDER_TYPE_META.withdraw,
    // TRANSFER_ORDER_TYPE_META.sportbonus,
    // TRANSFER_ORDER_TYPE_META.casinobonus,
] as const;

const isTransferOrderStatusValue = (value: string): value is TransferOrderStatusValue => {
    return Object.hasOwn(TRANSFER_ORDER_STATUS_META, value);
};

const isTransferOrderTypeValue = (value: string): value is TransferOrderTypeValue => {
    return Object.hasOwn(TRANSFER_ORDER_TYPE_META, value);
};

export const getTransferOrderStatusMeta = (value: string): TransferOrderStatusMeta | null => {
    return isTransferOrderStatusValue(value) ? TRANSFER_ORDER_STATUS_META[value] : null;
};

export const getTransferOrderTypeMeta = (value: string): TransferOrderOption<TransferOrderTypeValue> | null => {
    return isTransferOrderTypeValue(value) ? TRANSFER_ORDER_TYPE_META[value] : null;
};
