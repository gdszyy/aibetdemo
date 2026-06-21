import { useMutation } from '@tanstack/react-query';
import { useBoolean } from 'ahooks';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { DeleteBankAccountInterface } from '@/api/handlers/bank-account';
import type { ErrorReject } from '@/api/lib/types';
import type { BankAccount } from '@/api/models/bank-account';
import emptyImg from '@/assets/images/no-account.png';
import { Button } from '@/components/button/button';
import { Add } from '@/components/icons';
import { Modal } from '@/components/modal/modal';
import { Toast } from '@/components/toast';
import { useUIStore } from '@/stores/ui-store';
import { useWalletPasswordCheck } from '../../services/use-wallet-password-check';
import { convertBankCardNumber } from '../../services/utils';
import { useWithdrawStore } from '../../stores/use-withdraw-store';
import { Password } from '../password';
import { AddAccountModal } from './add';

const ListHeader: FC = () => {
    const t = useTranslations('withdraw');
    return (
        <div className="grid grid-cols-3 items-center w-full h-10 px-4 gap-x-2">
            <h4 className="min-w-0 text-center text-body-lg text-filltext-ft-g">{t('bankAccount.bankNoTab')}</h4>
            <h4 className="min-w-0 text-center text-body-lg text-filltext-ft-g">{t('bankAccount.bankAccountTab')}</h4>
            <h4 className="min-w-0 text-center text-body-lg text-filltext-ft-g">{t('bankAccount.actionTab')}</h4>
        </div>
    );
};

const ListItem: FC<{
    info: BankAccount;
    index: number;
    onDelClick: (info: BankAccount) => void;
}> = ({ info, index: _index, onDelClick }) => {
    const t = useTranslations('withdraw');

    return (
        <div className="grid grid-cols-3 items-center w-full rounded-sm min-h-10 py-2 px-4 gap-x-2 bg-filltext-ft-a">
            <span className="min-w-0 break-all text-center text-body-sm text-filltext-ft-g">
                {convertBankCardNumber(info.bank_code, info.account_no)}
            </span>
            <span className="min-w-0 break-all text-center text-body-sm text-filltext-ft-g">{info.account_name}</span>
            <button
                type="button"
                onClick={() => onDelClick(info)}
                className="min-w-0 break-all text-center text-body-sm text-func-lost cursor-pointer"
            >
                {t('bankAccount.delAccountBtnText')}
            </button>
        </div>
    );
};

const DeleteAccountTitle: FC<{ accountNo: string }> = ({ accountNo }) => {
    const t = useTranslations('withdraw');

    return (
        <>
            <span className="text-title-md text-neutral-black-h mr-2">{t('bankAccount.delAccountTitlePrefix')} </span>
            <span className="text-title-md text-func-lost">{accountNo}</span>
        </>
    );
};

const Empty: FC = () => {
    const t = useTranslations('withdraw');

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="relative w-[180px] h-[100px] flex flex-col items-center">
                <p className="text-body-lg text-filltext-ft-d text-center mb-4">
                    {t('bankAccount.noAccountAvailable')}
                </p>
                <div className="relative w-[106px] h-[71px]">
                    <Image src={emptyImg} alt="empty" fill sizes="106px" className="object-contain" loading="eager" />
                </div>
            </div>
        </div>
    );
};

/**
 * Fund account management
 */
export const BankAccountList: FC = () => {
    const { bankAccounts } = useWithdrawStore();
    const t = useTranslations('withdraw');
    const tCommon = useTranslations('common');
    const hasWalletPassword = useWalletPasswordCheck();
    const [
        enterPasswordModalVisible,
        { setTrue: setEnterPasswordModalVisible, setFalse: setEnterPasswordModalVisibleFalse },
    ] = useBoolean();
    const openAddAccountModal = useUIStore((s) => s.openAddAccountModal);
    const { dispatchBankAccounts } = useWithdrawStore();

    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [dialogState, setDialogState] = useState<{
        id: number;
        accountNo: string;
    }>({
        id: 0,
        accountNo: '',
    });

    const delAccount = useMutation({
        mutationFn: async (params: { id: number; wallet_password?: string }) => {
            return DeleteBankAccountInterface({
                id: params.id,
                wallet_password: params.wallet_password || '',
            });
        },
        onSuccess: () => {
            dispatchBankAccounts();
            Toast.success(t('bankAccount.delAccountSuccessToast'), { id: 'fund-account-delete' });
        },
        onError: (error: ErrorReject) => {
            Toast.error(error.message, { id: 'fund-account-delete' });
        },
    });

    const onDelClick = (info: BankAccount) => {
        const accountNo = convertBankCardNumber(info.bank_code, info.account_no);
        setDialogState({
            id: info.id,
            accountNo: accountNo,
        });
        // Check if wallet password is set
        if (hasWalletPassword) {
            setEnterPasswordModalVisible();
        } else {
            setDeleteConfirmVisible(true);
        }
    };

    return (
        <>
            <div className="account-card flex flex-col gap-4 h-full">
                <ListHeader />
                <div className="w-full flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto transaction-scrollbar">
                    {bankAccounts.length === 0 ? (
                        <Empty />
                    ) : (
                        bankAccounts.map((item, index) => (
                            <ListItem key={item.id} info={item} index={index} onDelClick={onDelClick} />
                        ))
                    )}
                </div>
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        className="w-[200px] h-10 rounded-full border-brand-primary-0 text-brand-primary-0"
                        icon={<Add className="size-5" />}
                        onClick={openAddAccountModal}
                        loading={delAccount.isPending}
                    >
                        {t('bankAccount.addAccountBtnText')}
                    </Button>
                </div>
            </div>

            <Modal
                visible={deleteConfirmVisible}
                onClose={() => setDeleteConfirmVisible(false)}
                closeButton={false}
                withBg={false}
            >
                <div className="w-[calc(100vw-2rem)] max-w-[435px] rounded-md bg-surface-raised p-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="text-title-md">
                            <DeleteAccountTitle accountNo={dialogState.accountNo} />
                        </div>
                        <p className="text-body-sm text-filltext-ft-e">{t('bankAccount.warningModalMsg')}</p>
                    </div>
                    <div className="flex justify-end gap-[10px]">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteConfirmVisible(false)}
                            className="flex-1 h-10"
                        >
                            {tCommon('dialog.cancelBtnText')}
                        </Button>
                        <Button
                            variant="primary"
                            loading={delAccount.isPending}
                            onClick={async () => {
                                await delAccount.mutateAsync({ id: dialogState.id });
                                setDeleteConfirmVisible(false);
                            }}
                            className="flex-1 h-10"
                        >
                            {t('bankAccount.delAccountBtnText')}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Password
                visible={enterPasswordModalVisible}
                title={<DeleteAccountTitle accountNo={dialogState.accountNo} />}
                subTitle={t('passwordInputTitle')}
                placeholder={t('passwordPlaceholder')}
                confirmText={t('withdraw.submitBtnText')}
                onSubmit={(password) => {
                    delAccount.mutate({ id: dialogState.id, wallet_password: password });
                    setEnterPasswordModalVisibleFalse();
                }}
                onCloseModal={setEnterPasswordModalVisibleFalse}
            />

            <AddAccountModal />
        </>
    );
};
