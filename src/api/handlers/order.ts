import { uofFetcher } from '@/api/client';
import type { ScrollPageResponse } from '@/api/lib/types';
import type { BetType } from '@/api/models/cart';
import type { Order, OrderType } from '@/api/models/order';

export type BetItem = {
    product: string;
    product_raw: string;
    event_id: string;
    event_id_type: string;
    market_id: string;
    outcome_id: string;
    outcome_odds: string;
    specifiers: string;
    line: string;
};

export type Stake = {
    type: 'cash' | 'bonus';
    currency: string;
    amount: string;
};

export type CreateOrderBet = {
    selections: BetItem[];
    stakes: Stake[];
};

export type CreateOrderBody = {
    bet_type: BetType;
    /** 串关加赔活动规则 ID，仅串关且参与活动时传入。 */
    activity_parlay_boost_id?: number;
    bets: CreateOrderBet[];
};

interface CreateOrderInsufficientBizData {
    /** 余额不足时返回的差额。 */
    shortage: string;
    /** 当前订单总金额。 */
    total_amount: string;
    /** 当前可用余额。 */
    current_balance: string;
}

interface CreateOrderResponse {
    /** 下单业务结果。 */
    biz_code: number | string;
    /** 下单业务文案。 */
    biz_message: string;
    /** 下单业务附加数据。 */
    biz_data: CreateOrderInsufficientBizData;
}

export const CreateOrderInterface = (body: CreateOrderBody) => {
    return uofFetcher.post<CreateOrderResponse | null>(`/v1/mts/order`, body);
};

type QueryOrderListParams = {
    tab: OrderType;
    cursor: string;
    limit: number;
};

export type OrderListResponse = ScrollPageResponse<Order>;

export const GetOrderListInterface = (params: QueryOrderListParams) => {
    return uofFetcher.get<OrderListResponse>(`/v1/mts/order`, params);
};
