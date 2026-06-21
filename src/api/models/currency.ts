/** Currency */
type Model = {
    /** Currency ID */
    currency_id: number;
    /** Currency name/code (ISO 4217), e.g. BRL, USD, MXN */
    currency_name: string;
};

export type { Model as Currency };
