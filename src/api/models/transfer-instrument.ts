interface Model {
    id: number;
    user_id: number;
    bank_account_number: string;
    account_name: string;
    bank_name: string;
    bank_branch_no: string;
    bank_main_type: number;
    bank_type: number;
    bank_type_name: string;
    identify_num: string;
    identify_type: string;
    created_at: string;
    updated_at: string;
}

interface InstrumentBase {
    id: number;
    name: string;
}

interface PaymentType extends InstrumentBase {
    bank_type_ids: string;
    relation: { bank_type: InstrumentBase[] };
}

export type { PaymentType as TransferInstrumentType };

export type { Model as TransferInstrument };
