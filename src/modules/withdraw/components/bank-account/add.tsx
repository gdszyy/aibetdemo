import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useBoolean, useDebounceEffect } from 'ahooks';
import { fromPairs, sortBy, uniq } from 'lodash-es';
import { useTranslations } from 'next-intl';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';
import { CreateBankAccountInterface as createInterface } from '@/api/handlers/bank-account';
import type { ErrorReject, InterfaceRequest } from '@/api/lib/types';
import { getRejectError } from '@/api/lib/utils';
import { Button } from '@/components/button/button';
import { FormInput } from '@/components/form-input/form-input';
import { FormSelect } from '@/components/form-select/form-select';
import { RightFilled } from '@/components/icons2/RightFilled';
import { Modal } from '@/components/modal/modal';
import type { Option } from '@/components/select/constants';
import { Toast } from '@/components/toast';
import { useUser } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { CLABE_BANKS } from '../../services/constant';
import { useWalletPasswordCheck } from '../../services/use-wallet-password-check';
import { useWithdrawStore } from '../../stores/use-withdraw-store';
import { usePageStore } from '../page-store';
import { Password } from '../password';

type DataRequest = InterfaceRequest<typeof createInterface>;

type FormField = 'account_no' | 'account_name' | 'bank_name';
type BankAccountFormKey = 'pay_platform' | 'account_type' | 'bank_code' | FormField;

/** 不同AccountType 需要的 表单项 */
const accountTypeToFormNames: Record<
    /** channel */
    string,
    Record<
        /** account type */
        string,
        FormField[]
    >
> = {
    PIX: {
        CPF: ['account_no'],
        EMAIL: ['account_no'],
        PHONE: ['account_no'],
    },
    CLABE: {
        CLABE: ['account_no', 'account_name', 'bank_name'],
    },
};

/** 不同的 channel，有不同的配置 */
const useChannelConfig = () => {
    const t = useTranslations('withdraw');

    const res: Record<
        /** channel */
        string,
        {
            accountTypeLabel: string;
        }
    > = {
        PIX: {
            accountTypeLabel: t('bankAccount.accountTypeLabel.pix'),
        },
        CLABE: {
            accountTypeLabel: t('bankAccount.accountTypeLabel.default'),
        },
    };

    const getConfig = (channel: string) => {
        return res[channel];
    };

    return { getChannelConfig: getConfig };
};

/** 不同的 account type，有不同的配置 */
const useAccountTypeConfig = () => {
    const t = useTranslations('withdraw');

    const res: Record<
        /** channel */
        string,
        Record<
            /** account type */
            string,
            {
                accountNoLabel?: string;
                accountNoPlaceholder?: string;
                accountNoValid?: (value: string) => Promise<boolean>;
            }
        >
    > = {
        PIX: {
            CPF: {
                accountNoLabel: t('bankAccount.accountNo.cpf.label'),
                accountNoPlaceholder: t('bankAccount.accountNo.cpf.placeholder'),
                // accountNoValid: async (val) => {
                //     const valid = verifyIdentityDocument(val, getRegionByCode('BR'));
                //     if (!valid) {
                //         return Promise.reject(new Error(tUser('kyc.idError', { label: 'CPF' })));
                //     }
                //     return true;
                // },
            },
            EMAIL: {
                accountNoLabel: t('bankAccount.accountNo.email.label'),
                accountNoPlaceholder: t('bankAccount.accountNo.email.placeholder'),
                // accountNoValid: async (val) => {
                //     const valid = isEmail(val);
                //     if (!valid) {
                //         return Promise.reject(new Error(t('bankAccount.accountNoError')));
                //     }
                //     return true;
                // },
            },
            PHONE: {
                accountNoLabel: t('bankAccount.accountNo.phone.label'),
                accountNoPlaceholder: t('bankAccount.accountNo.phone.placeholder'),
                // accountNoValid: async (val) => {
                //     const valid = getRegionByCode('BR')?.phonePattern?.test(val);
                //     if (!valid) {
                //         return Promise.reject(new Error(t('bankAccount.accountNoError')));
                //     }
                //     return true;
                // },
            },
        },
        CLABE: {
            CLABE: {},
        },
    };

    const getConfig = (channel: string, accountType: string) => {
        return res[channel]?.[accountType];
    };

    return { getAccountTypeConfig: getConfig };
};

/** clabe 银行 options */
const CLABE_BANK_OPTIONS = sortBy(
    CLABE_BANKS.map((v) => ({ label: v.label, value: v.label })),
    'label',
);

/** clabe 银行 map */
const CLABE_BANK_MAP = fromPairs(CLABE_BANKS.map((v) => [v.id, v.label])) as Record<string, string>;

/**
 * Add receiving account modal
 */
const Main: FC = () => {
    const t = useTranslations('withdraw');
    const { getChannelConfig } = useChannelConfig();
    const { getAccountTypeConfig } = useAccountTypeConfig();

    const { payChannels } = usePageStore();

    const onClose = useUIStore((s) => s.closeAddAccountModal);

    const user = useUser();

    const hasWalletPassword = useWalletPasswordCheck();
    const [
        enterPasswordModalVisible,
        { setTrue: setEnterPasswordModalVisible, setFalse: setEnterPasswordModalVisibleFalse },
    ] = useBoolean();

    const { dispatchBankAccounts } = useWithdrawStore();

    const allFormSchema = useRef(
        z.object({
            pay_platform: z.string().nonempty(),
            account_type: z.string().nonempty(t('bankAccount.accountTypeError')),
            bank_code: z.string().nonempty(t('bankAccount.bankCodeError')),
            account_no: z.string(),
            account_name: z.string().nonempty(t('bankAccount.holderNameError')),
            bank_name: z.string().nonempty(t('bankAccount.bankNameError')),
        }),
    );

    const [formSchema, setFormSchema] = useState(allFormSchema.current.clone());

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    // 初始化 pay_platform
    useEffect(() => {
        form.setValue('pay_platform', payChannels[0]?.platform || '');
    }, [payChannels[0]?.platform, payChannels[0], form.setValue]);

    // 监听pay_platform的值
    const payChannel = form.watch('pay_platform')?.toUpperCase();
    // 监听accountType的值
    const accountType = form.watch('account_type')?.toUpperCase();
    // 监听 accountNo 的值
    const accountNo = form.watch('account_no');

    // 当前选中的渠道
    const selectedChannel = useMemo(() => {
        return payChannels?.find((v) => v.platform.toUpperCase() === payChannel) || null;
    }, [payChannels, payChannel]);

    /** 可选的account_type列表 */
    const [accountTypeOptions, setAccountTypeOptions] = useState<Option[]>([]);
    /** 可选的bank_code列表 */
    const [bankCodeOptions, setBankCodeOptions] = useState<Option[]>([]);

    // 更换了渠道，则重置account type
    useEffect(() => {
        if (payChannel) {
            const options =
                uniq(selectedChannel?.options?.map((v) => v.account_type)).map((v) => ({
                    label: v,
                    value: v,
                })) || [];
            setAccountTypeOptions(options);
            window.requestAnimationFrame(() => {
                form.setValue('account_type', options[0]?.value || '');
            });
        } else {
            setAccountTypeOptions([]);
            form.setValue('account_type', '');
        }
    }, [selectedChannel, form, payChannel]);

    // 更换了account type，则重置 bank code
    useEffect(() => {
        if (accountType) {
            const options =
                uniq(
                    selectedChannel?.options
                        ?.filter((v) => v.account_type?.toUpperCase() === accountType)
                        ?.map((v) => v.bank_code),
                ).map((v) => ({
                    label: v,
                    value: v,
                })) || [];
            setBankCodeOptions(options);
            window.requestAnimationFrame(() => {
                form.setValue('bank_code', options[0]?.value || '');
            });
        } else {
            setBankCodeOptions([]);
            form.setValue('bank_code', '');
        }
    }, [selectedChannel, form, accountType]);

    // 更换了account type，给默认的account no
    useEffect(() => {
        if (['CPF'].includes(accountType)) {
            form.setValue('account_no', user?.id_number || '');
        } else {
            form.setValue('account_no', '');
        }
    }, [accountType, form, user?.id_number]);

    // 修改了account no，给默认的bank name
    useDebounceEffect(
        () => {
            if (payChannel === 'CLABE' && accountType === 'CLABE' && accountNo) {
                const bankCode = accountNo.slice(0, 3);
                const name = CLABE_BANK_MAP[bankCode] || '';
                if (name) {
                    form.setValue('bank_name', name);
                }
            }
        },
        [accountType, payChannel, form.setValue, accountNo],
        {
            wait: 1000,
        },
    );

    const channelConfig = getChannelConfig(payChannel);
    const accountTypeConfig = getAccountTypeConfig(payChannel, accountType);

    /** 不同AccountType需要的表单项 */
    const needFormNames = useMemo(() => {
        if (payChannel && accountType) {
            // TODO 临时方案，应该由接口返回 accountType 对应的表单项
            return accountTypeToFormNames?.[payChannel]?.[accountType] || [];
        }
        return [];
    }, [accountType, payChannel]);

    /** 表单项是否要出现 */
    const shouldShowFormItem = (formItem: (typeof needFormNames)[number]) => {
        return needFormNames.includes(formItem);
    };

    /** 根据要出现的表单项，设置formSchema */
    useEffect(() => {
        // 要保留的key
        const keepKeys: BankAccountFormKey[] = ['account_type', 'bank_code', ...needFormNames];
        let schema = allFormSchema.current.clone();
        const pickMask = Object.fromEntries(keepKeys.map((k) => [k, true])) as Partial<
            Record<BankAccountFormKey, true>
        >;
        schema = schema.pick(pickMask);
        if (keepKeys.includes('account_no')) {
            schema = schema.extend({
                account_no: z
                    .string()
                    .nonempty(t('bankAccount.accountNoError'))
                    .superRefine(async (val, ctx) => {
                        try {
                            await accountTypeConfig?.accountNoValid?.(val);
                        } catch (err) {
                            ctx.addIssue({
                                code: 'custom',
                                path: [],
                                message: getRejectError(err as ErrorReject),
                            });
                        }
                    }),
            });
        }
        setFormSchema(schema);
    }, [needFormNames, t, accountTypeConfig?.accountNoValid]);

    const createAccount = useMutation({
        mutationFn: (params?: Partial<DataRequest>) => {
            const payload = { ...form.getValues(), ...params } as DataRequest;
            return createInterface(payload);
        },
        onSuccess: () => {
            dispatchBankAccounts();
            Toast.success(t('bankAccount.addAccountSuccessToast'), { id: 'fund-account-add' });
            onClose();
        },
        onError: (err: ErrorReject) => {
            Toast.error(err.message, { id: 'fund-account-add' });
        },
    });

    const onSubmit = async () => {
        if (hasWalletPassword) {
            setEnterPasswordModalVisible();
        } else {
            await createAccount.mutateAsync({});
            form.reset();
        }
    };

    return (
        <>
            <Modal visible onClose={onClose} withBg={false}>
                <div className="w-[calc(100vw-2rem)] max-w-[420px] max-h-[calc(100vh-2rem)] overflow-y-auto flex flex-col gap-4 bg-surface-1 backdrop-blur-[15px] rounded-md p-4">
                    <h1 className="text-title-sm leading-5 text-filltext-ft-g">{t('bankAccount.addModalTitle')}</h1>
                    <FormProvider {...form}>
                        <form
                            key={form.formState.submitCount}
                            onSubmit={form.handleSubmit(onSubmit, (errors) => {
                                console.error(errors);
                            })}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex flex-col gap-2">
                                {Boolean(payChannels.length) && (
                                    <div className="flex gap-2">
                                        {payChannels.map((v) => {
                                            const isSelected = v.platform === selectedChannel?.platform;

                                            return (
                                                <div
                                                    key={v.platform}
                                                    className={cn(
                                                        'relative',
                                                        'px-4 h-8.5 inline-flex justify-center items-center rounded-xs cursor-pointer',
                                                        'border-[0.5px]',
                                                        'text-body-sm',
                                                        isSelected
                                                            ? 'border-brand-primary-0 bg-brand-primary-1 text-brand-primary-0'
                                                            : 'border-filltext-ft-c bg-surface-1 text-filltext-ft-g hover:border-filltext-ft-c hover:bg-filltext-ft-a',
                                                    )}
                                                    onClick={() => {
                                                        form.setValue('pay_platform', v.platform);
                                                    }}
                                                >
                                                    {v.platform}
                                                    {isSelected && (
                                                        <span className="absolute w-2.5 h-2.5 rounded-full -right-0.5 -top-0.5 bg-brand-primary-0 inline-flex items-center justify-center">
                                                            <RightFilled className="size-2 text-neutral-white-h" />
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <FormInput className="hidden" name="pay_platform" label="pay_platform" />
                                {Boolean(payChannel) && (
                                    <FormSelect
                                        name="account_type"
                                        label={channelConfig?.accountTypeLabel}
                                        fieldProps={{
                                            placeholder: t('bankAccount.accountTypeSelectPlaceholder'),
                                            options: accountTypeOptions,
                                        }}
                                    />
                                )}
                                {Boolean(accountType) && (
                                    <FormSelect
                                        name="bank_code"
                                        label={t('bankAccount.bankCodeLabel')}
                                        fieldProps={{
                                            placeholder: t('bankAccount.accountSubTypeSelectPlaceholder'),
                                            options: bankCodeOptions,
                                        }}
                                    />
                                )}
                                {Boolean(accountType) && (
                                    <>
                                        {shouldShowFormItem('account_no') && (
                                            <FormInput
                                                name="account_no"
                                                label={
                                                    accountTypeConfig?.accountNoLabel ||
                                                    t('bankAccount.accountNo.default.label')
                                                }
                                                fieldProps={{
                                                    type: 'text',
                                                    placeholder:
                                                        accountTypeConfig?.accountNoPlaceholder ||
                                                        t('bankAccount.accountNo.default.placeholder'),
                                                }}
                                            />
                                        )}
                                        {shouldShowFormItem('account_name') && (
                                            <FormInput
                                                name="account_name"
                                                label={t('bankAccount.holderNameTitle')}
                                                fieldProps={{ placeholder: t('bankAccount.holderNamePlaceholder') }}
                                            />
                                        )}
                                        {shouldShowFormItem('bank_name') &&
                                            (payChannel === 'CLABE' && accountType === 'CLABE' ? (
                                                <FormSelect
                                                    name="bank_name"
                                                    label={t('bankAccount.bankNameTitle')}
                                                    fieldProps={{
                                                        placeholder: t('bankAccount.bankNamePlaceholder'),
                                                        options: CLABE_BANK_OPTIONS,
                                                    }}
                                                />
                                            ) : (
                                                <FormInput
                                                    name="bank_name"
                                                    label={t('bankAccount.bankNameTitle')}
                                                    fieldProps={{
                                                        placeholder: t('bankAccount.bankNamePlaceholder'),
                                                    }}
                                                />
                                            ))}
                                    </>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                block
                                loading={form.formState.isSubmitting || createAccount.isPending}
                            >
                                {t('bankAccount.submitBtnText')}
                            </Button>
                        </form>
                    </FormProvider>
                </div>
            </Modal>
            <Password
                visible={enterPasswordModalVisible}
                title={t('passwordTitle')}
                placeholder={t('passwordPlaceholder')}
                confirmText={t('withdraw.submitBtnText')}
                onSubmit={async (password) => {
                    await createAccount.mutateAsync({
                        wallet_password: password,
                    });
                    setEnterPasswordModalVisibleFalse();
                    form.reset();
                }}
                onCloseModal={setEnterPasswordModalVisibleFalse}
            />
        </>
    );
};

export const AddAccountModal: FC = () => {
    const addAccountModalOpen = useUIStore((s) => s.addAccountModalOpen);

    if (!addAccountModalOpen) {
        return null;
    }

    return <Main />;
};
