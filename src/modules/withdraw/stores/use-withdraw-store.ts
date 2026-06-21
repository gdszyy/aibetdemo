import { create } from 'zustand';
import { ListBankAccountInterface } from '@/api/handlers/bank-account';
import type { InterfaceResponse } from '@/api/lib/types';

type BankAccount = InterfaceResponse<typeof ListBankAccountInterface>['list'][number];

type WithdrawStore = {
    bankAccounts: BankAccount[];
    dispatchBankAccounts: () => Promise<BankAccount[]>;
};

export const useWithdrawStore = create<WithdrawStore>((set) => ({
    bankAccounts: [],
    dispatchBankAccounts: async () => {
        const res = (await ListBankAccountInterface())?.list || [];
        set({ bankAccounts: res });
        return res;
    },
}));
