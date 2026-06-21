import { uofFetcher } from '@/api/client';
import type { Cart, CartItemOutcome, CartSettings } from '@/api/models/cart';

/** Get cart info */
export const GetCartInterface = () => {
    return uofFetcher.get<Cart>(`/v1/mts/cart`);
};

/** Update cart item params */
type PutCartItemParams = {
    version: number;
    items: CartItemOutcome[];
};

export interface PutCartItemResponse {
    user_id: string;
    version: number;
}

/** Update cart items */
export const PutCartItemInterface = (body: PutCartItemParams) => {
    return uofFetcher.put<PutCartItemResponse>(`/v1/mts/cart`, body);
};

// Slip Settings
/** Get slip settings */
export const GetSlipSettingsInterface = () => {
    return uofFetcher.get<CartSettings>(`/v1/mts/cart/setting`);
};

/** Update slip settings */
export const UpdateSlipSettingsInterface = (body: CartSettings) => {
    return uofFetcher.put<Cart>(`/v1/mts/cart/setting`, body);
};
