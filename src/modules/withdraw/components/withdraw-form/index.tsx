import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useBoolean } from 'ahooks';
import Decimal from 'decimal.js-light';
import { min } from 'lodash-es';
import { useTranslations } from 'next-intl';
import { type FC, type FunctionComponent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';
import { CreateWithdrawInterface, GetTurnoverInterface } from '@/api/handlers/withdraw';
import type { ErrorReject, InterfaceRequest, InterfaceResponse } from '@/api/lib/types';
import { FirebaseAnalyticsEventName } from '@/api/models/analytics';
import { Button } from '@/components/button/button';
import { Dialog } from '@/components/dialog';
import { FormCheckbox } from '@/components/form-checkbox/form-checkbox';
import { FormInput } from '@/components/form-input/form-input';
import { FormSelect } from '@/components/form-select/form-select';
import { FunsSelectShortCutList } from '@/components/funs-select-short-cut-list/funs-select-short-cut-list';
import { ExclamationCircleOutlined } from '@/components/icons2/ExclamationCircleOutlined';
import { PlusFilled } from '@/components/icons2/PlusFilled';
import { Toast } from '@/components/toast';
import { StorageEnum } from '@/constants';
import { generateQueryKey, ModuleKeys, WithdrawActions } from '@/constants/query-keys';
import { useBusinessFirebaseAnalytics } from '@/hooks/use-business-firebase-analytics';
import { useCurrencyLimit } from '@/hooks/use-currency-limit';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useKycRequiredToast } from '@/hooks/use-kyc-state';
import { useWalletDispatchBalance, useWalletMainBalance } from '@/hooks/use-wallet';
import { useUIStore } from '@/stores/ui-store';
import { useWalletPasswordCheck } from '../../services/use-wallet-password-check';
import { useWithdrawPolling } from '../../services/use-withdraw-polling';
import { checkAmountLimit, convertBankCardNumber } from '../../services/utils';
import { useWithdrawStore } from '../../stores/use-withdraw-store';
import { usePageStore } from '../page-store';
import { Password } from '../password';

type CreateWithdrawParams = InterfaceRequest<typeof CreateWithdrawInterface>;
type CreateWithdrawResponse = InterfaceResponse<typeof CreateWithdrawInterface>;

/** main 余额 */
const MainBalance: FunctionComponent = () => {
    const t = useTranslations('withdraw');
    const { formatCurrency } = useIntlFormatter();
    const mainBalance = useWalletMainBalance();

    return (
        <div className="flex flex-col gap-y-1">
            <p className="text-body-sm text-filltext-ft-h">{t('withdraw.availableTitle')}</p>
            <p className="text-headline-lg text-func-win">{formatCurrency(mainBalance)}</p>
            <p className="text-body-sm text-filltext-ft-h">
                {t('withdraw.availableDesc')}&nbsp;:&nbsp;{formatCurrency(mainBalance)}
            </p>
        </div>
    );
};

/** 提现流水 */
const Turnover: FunctionComponent = () => {
    const t = useTranslations('withdraw');
    const { formatCurrency } = useIntlFormatter();

    const { data } = useQuery({
        queryKey: generateQueryKey(ModuleKeys.WITHDRAW, WithdrawActions.GET_TURNOVER),
        queryFn: GetTurnoverInterface,
    });

    const turnover = data?.total_turnover || 0;
    const total = data?.total_deposit || 0;
    const progress = `${min([Number(new Decimal(turnover).div(total).mul(100).toFixed(2)), 100])}%`;

    return (
        <div className="rounded-sm p-2 bg-status-info-surface flex items-start gap-x-1">
            <ExclamationCircleOutlined className="size-4 text-auxiliary-blue" />
            <div className="flex flex-col gap-y-1">
                <p className="text-auxiliary-sm text-filltext-ft-h">{t('withdraw.turnoverDesc')}</p>
                <p className="text-auxiliary-sm text-filltext-ft-f">
                    {t('withdraw.turnoverTitle')}
                    {` : ${turnover} / ${formatCurrency(total)} (${progress})`}
                </p>
            </div>
        </div>
    );
};

/**
 * Withdraw module
 */
export const WithdrawForm: FC = () => {
    const { currencySymbolNarrow } = useIntlFormatter();

    const { setTab } = usePageStore();

    const t = useTranslations('withdraw');
    const { min, max } = useCurrencyLimit('withdraw');
    const { startPolling, loading, onPollingEnd } = useWithdrawPolling();
    const { bankAccounts } = useWithdrawStore();
    const dispatchBalance = useWalletDispatchBalance();
    const hasWalletPassword = useWalletPasswordCheck();

    const mainBalance = useWalletMainBalance();
    const { trackFirst } = useBusinessFirebaseAnalytics();

    /**
     * H5/Android: initial `mainBalance` may be 0 (not yet loaded).
     * Avoid clamping shortcut amounts to 0 by deferring balance cap until loaded.
     */
    const [isBalanceLoaded, setIsBalanceLoaded] = useState(mainBalance > 0);
    const [
        enterPasswordModalVisible,
        { setTrue: setEnterPasswordModalVisible, setFalse: setEnterPasswordModalVisibleFalse },
    ] = useBoolean();

    useEffect(() => {
        const clickTime = Date.now();
        trackFirst(FirebaseAnalyticsEventName.FirstWithdrawPageClick, StorageEnum.AnalyticsFirstWithdrawPageClick, {
            first_withdraw_click_time: clickTime,
        });
    }, [trackFirst]);

    const formSchema = z.object({
        bankAccount: z.refine(
            () => {
                return bankAccounts?.length > 0;
            },
            { message: t('withdraw.selectError') },
        ),
        amount: z
            .string()
            .nonempty({ message: t('withdraw.inputEmptyError', { min, max }) })
            .refine((v) => Number(v) > 0, {
                message: t('withdraw.inputInvalidError', { min, max }),
            }),
        agreement: z.boolean().refine((v) => v === true, {
            message: t('withdraw.agreementError'),
        }),
    });

    // If balance isn't loaded yet (still 0), request it once.
    useEffect(() => {
        if (isBalanceLoaded) return;
        if (mainBalance > 0) {
            setIsBalanceLoaded(true);
            return;
        }
        let cancelled = false;
        dispatchBalance().finally(() => {
            if (!cancelled) setIsBalanceLoaded(true);
        });
        return () => {
            cancelled = true;
        };
    }, [dispatchBalance, isBalanceLoaded, mainBalance]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            agreement: true,
        },
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    });

    const amountValue = form.watch('amount') ?? '';

    // Effective withdraw range: currency limits are optionally capped by wallet mainBalance.
    // Keep this aligned with onShortcutClick/onAmountChanged logic.
    // If `mainBalance` is still 0 (e.g. H5/Android balance not ready), don't cap to 0,
    // otherwise shortcut list could be filtered to empty.
    const balanceCap = isBalanceLoaded && mainBalance > 0 ? mainBalance : Number.POSITIVE_INFINITY;
    const allowedMin = Math.floor(Math.min(min, balanceCap));
    const allowedMax = Math.floor(Math.min(max, balanceCap));

    // When balance becomes ready, re-clamp current input to avoid stale values.
    useEffect(() => {
        if (!isBalanceLoaded) return;
        const currentAmount = form.getValues('amount') ?? '';
        const clamped = checkAmountLimit(currentAmount, allowedMin, allowedMax);
        if (clamped !== currentAmount) form.setValue('amount', clamped);
    }, [allowedMin, allowedMax, isBalanceLoaded, form]);

    const onShortcutClick = (amount: number) => {
        const value = checkAmountLimit(`${amount}`, allowedMin, allowedMax);
        form.setValue('amount', value);
    };

    const onAmountChanged = () => {
        form.setValue('amount', checkAmountLimit(amountValue, allowedMin, allowedMax));
    };

    const createWithdraw = useMutation({
        mutationFn: (params: CreateWithdrawParams) => CreateWithdrawInterface(params),
        onSuccess: (data: CreateWithdrawResponse) => {
            Toast.success(t('withdraw.withdrawPendingToast'), { id: 'withdraw-submit' });
            if (data?.order_no) {
                form.setValue('amount', '');
                startPolling(data.order_no);
            }
            dispatchBalance();
        },
        onError: (err: ErrorReject) => {
            Toast.error(err.message, { id: 'withdraw-submit' });
        },
    });

    const { checkKycRequired } = useKycRequiredToast();

    const ensureKycVerified = () => {
        if (checkKycRequired({ ignoreSwitch: true })) {
            return true;
        }
        return false;
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!ensureKycVerified()) {
            return;
        }

        // Check if there are any receiving accounts
        if (!bankAccounts?.length) {
            Dialog.info({
                content: t('withdraw.submitNoAccountError'),
                onConfirm: () => {
                    setTab('bankAccount');
                    useUIStore.getState().openAddAccountModal();
                },
            });
            return;
        }

        // Check if wallet password is set
        if (hasWalletPassword) {
            setEnterPasswordModalVisible();
            return;
        }
        // Submit withdraw request
        createWithdraw.mutate({
            bank_account_id: Number(data.bankAccount),
            amount: Number(data.amount),
            wallet_password: '',
        });
    };

    const accountId = form.watch('bankAccount');
    useEffect(() => {
        if (bankAccounts?.length && !accountId) {
            form.setValue('bankAccount', `${bankAccounts[0]?.id}`);
        }
    }, [form, accountId, bankAccounts?.length, bankAccounts[0]?.id]);

    // Reset form when withdraw polling completes
    useEffect(() => {
        if (onPollingEnd) {
            form.setValue('amount', '');
            form.setValue('bankAccount', '');
        }
    }, [onPollingEnd, form]);

    return (
        <>
            <FormProvider {...form}>
                <form
                    key={form.formState.submitCount}
                    onSubmit={form.handleSubmit(onSubmit)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault();
                    }}
                >
                    <div className="account-card flex flex-col gap-4">
                        <div className="flex flex-col gap-y-1">
                            <MainBalance />
                            <Turnover />
                        </div>
                        <div className="flex flex-col px-2  gap-4">
                            <FormSelect
                                name="bankAccount"
                                label={t('withdraw.selectTitle')}
                                labelBold
                                fieldProps={{
                                    placeholder: t('withdraw.selectPlaceholder'),
                                    options: (bankAccounts.length &&
                                        bankAccounts.map((item) => {
                                            const label = convertBankCardNumber(item.bank_code, item.account_no);
                                            return {
                                                label,
                                                value: `${item.id}`,
                                            };
                                        })) || [{ label: t('withdraw.selectEmptyOption'), value: 'none' }],
                                }}
                            />
                            {!bankAccounts.length && (
                                <div
                                    className="w-full h-14 px-2 flex justify-center items-center gap-x-2 rounded-sm bg-surface-1 shadow-card text-brand-primary-0 cursor-pointer"
                                    onClick={() => {
                                        setTab('bankAccount');
                                    }}
                                >
                                    <PlusFilled className="size-4.5" />
                                    <span className="text-body-lg text-brand-primary-0">
                                        {t('bankAccount.addAccountBtnText')}
                                    </span>
                                </div>
                            )}
                            <FormInput
                                name="amount"
                                label={t('withdraw.inputTitle')}
                                labelBold
                                fieldProps={{
                                    className:
                                        'rounded-sm border-[0.5px] border-transparent bg-filltext-ft-a hover:bg-filltext-ft-b focus-within:border-filltext-ft-h focus-within:bg-filltext-ft-b [&_[data-slot=input]]:text-filltext-ft-h [&_[data-slot=input]]:placeholder:text-filltext-ft-h',
                                    placeholder: t('withdraw.inputPlaceholder', {
                                        currency: currencySymbolNarrow,
                                        min,
                                        max,
                                    }),
                                    type: 'number',
                                    onBlur: onAmountChanged,
                                }}
                            />
                            <FunsSelectShortCutList
                                curAmount={Number(amountValue)}
                                onShortcutClick={onShortcutClick}
                                minAmount={allowedMin}
                                maxAmount={allowedMax}
                            />
                        </div>
                        <FormCheckbox
                            name="agreement"
                            fieldProps={{ label: t('withdraw.agreement'), defaultChecked: true }}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        block
                        className="mt-4"
                        loading={form.formState.isSubmitting || createWithdraw.isPending || loading}
                    >
                        {t('withdraw.submitBtnText')}
                    </Button>
                </form>
            </FormProvider>

            <Password
                visible={enterPasswordModalVisible}
                title={t('passwordTitle')}
                placeholder={t('passwordPlaceholder')}
                confirmText={t('withdraw.submitBtnText')}
                onSubmit={(password) => {
                    if (!ensureKycVerified()) {
                        return;
                    }

                    createWithdraw.mutate({
                        bank_account_id: Number(form.getValues('bankAccount')),
                        amount: Number(form.getValues('amount')),
                        wallet_password: password,
                    });
                    setEnterPasswordModalVisibleFalse();
                }}
                onCloseModal={setEnterPasswordModalVisibleFalse}
            />
        </>
    );
};
