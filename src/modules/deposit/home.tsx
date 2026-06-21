'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useDebounceEffect, useDebounceFn } from 'ahooks';
import { useTranslations } from 'next-intl';
import { type FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';
import { CreateDepositInterface, ListChannelInterface } from '@/api/handlers/deposit';
import { isRechargeCodeActive, ValidateRechargeCodeInterface } from '@/api/handlers/recharge-code';
import type { InterfaceRequest } from '@/api/lib/types';
import { FirebaseAnalyticsEventName } from '@/api/models/analytics';
import type { DepositOrderStatus } from '@/api/models/deposit';
import type { RechargeCodeValidationResult } from '@/api/models/recharge-code';
import { Button } from '@/components/button/button';
import { DepositReward } from '@/components/DepositReward';
import { FormInput } from '@/components/form-input/form-input';
import { FormSelect } from '@/components/form-select/form-select';
import {
    DEFAULT_SHORTCUTS,
    FunsSelectShortCutList,
} from '@/components/funs-select-short-cut-list/funs-select-short-cut-list';
import { Toast } from '@/components/toast';
import { StorageEnum } from '@/constants';
import { DepositActions, generateQueryKey, ModuleKeys } from '@/constants/query-keys';
import { useBusinessFirebaseAnalytics } from '@/hooks/use-business-firebase-analytics';
import { useCurrencyLimit } from '@/hooks/use-currency-limit';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useKycRequiredToast } from '@/hooks/use-kyc-state';
import {
    useAllRechargeCodes,
    useRechargeActiveConfig,
    useRechargeCodeStore,
    useRechargeReward,
} from '@/hooks/use-recharge-code';
import { useCurrencyId } from '@/hooks/use-wallet';

import { cn } from '@/utils/common';
import { checkAmountLimit } from '../withdraw/services/utils';
import { PromoBannerPlaceholder } from './_components/promo-banner-placeholder';
import { PromoCodeInput } from './_components/promo-code-input';
import { DepositPaymentMode, type DepositPaymentView } from './_constants/payment';
import { useDepositPolling } from './_hooks/use-deposit-polling';

type DataRequest = InterfaceRequest<typeof CreateDepositInterface>;
type CreateDepositResponse = Awaited<ReturnType<typeof CreateDepositInterface>>;

const PROMO_VALIDATION_DEBOUNCE = 500;

const getCreateDepositPaymentUrl = (response: CreateDepositResponse): string => {
    return response?.pay_url || '';
};

interface DepositHomeProps {
    /** 支付承载方式：路由页跳转，弹窗态 iframe。 */
    paymentMode?: DepositPaymentMode;
    /** 创建支付链接后的回调，用于弹窗态渲染 iframe。 */
    onPaymentCreated?: (payment: DepositPaymentView) => void;
    /** 外部订单轮询启动方法，用于弹窗态避免表单卸载中断轮询。 */
    onPaymentPollingStart?: (orderNo: string) => void;
    /** 弹窗态订单轮询结束后的回调。 */
    onPaymentFinished?: (status?: DepositOrderStatus) => void;
    /** 外部轮询 loading 状态。 */
    paymentPollingLoading?: boolean;
    /** 外部轮询是否结束。 */
    paymentPollingEnded?: boolean;
    /** 外层样式。 */
    className?: string;
    /** 是否隐藏完整页面中的说明文案。 */
    compact?: boolean;
}

/** 充值表单主体，支持完整页和弹窗两种支付承载方式。 */
export const Home: FC<DepositHomeProps> = ({
    paymentMode = DepositPaymentMode.Redirect,
    onPaymentCreated,
    onPaymentPollingStart,
    onPaymentFinished,
    paymentPollingLoading,
    paymentPollingEnded,
    className,
    compact = false,
}) => {
    const { currencySymbolNarrow } = useIntlFormatter();

    const t = useTranslations('deposit');
    const { min, max } = useCurrencyLimit('deposit');
    const { startPolling, loading, onPollingEnd } = useDepositPolling({ onFinished: onPaymentFinished });
    const isPolling = paymentPollingLoading ?? loading;
    const isPollingEnded = paymentPollingEnded ?? onPollingEnd;
    const startDepositPolling = onPaymentPollingStart ?? startPolling;
    const currencyId = useCurrencyId();
    const { track, trackFirst } = useBusinessFirebaseAnalytics();

    const rechargeCodes = useAllRechargeCodes();

    const hasActivePromo = isRechargeCodeActive(rechargeCodes);

    const { data: channelOptions = [], isFetched: isChannelFetched } = useQuery({
        queryKey: generateQueryKey(ModuleKeys.DEPOSIT, DepositActions.CHANNEL_LIST),
        queryFn: () => {
            return ListChannelInterface().then((res) => {
                return res.map((v) => {
                    return {
                        label: v.platform,
                        value: v.platform,
                    };
                });
            });
        },
        staleTime: 1 * 60_000,
        placeholderData: [],
    });

    const hasChannelOptions = channelOptions.length > 0;
    const showChannelMaintenance = isChannelFetched && !hasChannelOptions;

    const formSchema = z.object({
        pay_platform: z.string().optional(),
        amount: z
            .string()
            .nonempty({ message: t('inputEmptyError', { min: min, max: max }) })
            .refine((v) => Number.isFinite(Number(v)) && Number(v) > 0, {
                message: t('inputInvalidError', { min, max }),
            })
            .refine((v) => Number(v) >= min && Number(v) <= max, {
                message: t('inputInvalidError', { min, max }),
            }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    });

    const amountValue = form.watch('amount') ?? '';

    useEffect(() => {
        const clickTime = Date.now();
        trackFirst(FirebaseAnalyticsEventName.FirstDepositPageClick, StorageEnum.AnalyticsFirstDepositPageClick, {
            first_deposit_click_time: clickTime,
        });
    }, [trackFirst]);

    // Promo code state + local validation
    const [promoCode, setPromoCode] = useState('');
    const [promoValidation, setPromoValidation] = useState<RechargeCodeValidationResult | null>(null);

    const { run: debouncedValidatePromo, cancel: cancelDebouncedValidatePromo } = useDebounceFn(
        (code: string, amount: string) => {
            if (!rechargeCodes?.length) {
                setPromoValidation(null);
                return;
            }

            setPromoValidation(
                ValidateRechargeCodeInterface(rechargeCodes, {
                    promo_code: code,
                    amount: Number(amount) || 0,
                }),
            );
        },
        { wait: PROMO_VALIDATION_DEBOUNCE },
    );

    const handlePromoCodeChange = (code: string) => {
        setPromoCode(code?.toUpperCase());
    };

    const dispatchCodes = useRechargeCodeStore((s) => s.dispatchCodes);

    useEffect(() => {
        dispatchCodes();
    }, [dispatchCodes]);

    const rechargeConfig = useRechargeActiveConfig();
    useEffect(() => {
        if (rechargeConfig) {
            setPromoCode(rechargeConfig.promo_code?.toUpperCase() || '');
        }
    }, [rechargeConfig]);

    // Re-validate when amount changes (if code exists)
    useEffect(() => {
        if (!promoCode.trim()) {
            cancelDebouncedValidatePromo();
            setPromoValidation(null);
            return;
        }
        if (!rechargeCodes?.length) {
            cancelDebouncedValidatePromo();
            setPromoValidation(null);
            return;
        }

        debouncedValidatePromo(promoCode, amountValue);

        return cancelDebouncedValidatePromo;
    }, [amountValue, cancelDebouncedValidatePromo, debouncedValidatePromo, promoCode, rechargeCodes]);

    const onShortcutClick = (amount: number) => {
        const value = checkAmountLimit(`${amount}`, min, max);
        form.setValue('amount', value);
    };

    const onAmountChanged = () => {
        const sanitized =
            Number(amountValue) === 0 ? `${amountValue}` : amountValue.replace(/^0+/, '').replace(/[^0-9]/g, '');
        form.setValue('amount', sanitized);
    };

    const createDeposit = useMutation({
        mutationFn: (params: DataRequest) => CreateDepositInterface(params),
    });

    const { checkKycRequired } = useKycRequiredToast();

    const ensureKycVerified = () => {
        if (checkKycRequired()) {
            return true;
        }

        return false;
    };

    const onSubmit = async (data: z.infer<typeof formSchema>): Promise<void> => {
        if (!ensureKycVerified()) {
            return;
        }

        if (hasChannelOptions && !data.pay_platform) {
            form.setError('pay_platform', { message: t('inputEmptyError') });
            return;
        }

        if (!data.pay_platform) {
            Toast.error(t('channelMaintenance'), { id: 'deposit-submit' });
            return;
        }

        if (!currencyId) {
            Toast.error(t('depositFailedToast'), { id: 'deposit-submit' });
            return;
        }

        const currentUrl = window.location.href;
        track(FirebaseAnalyticsEventName.DepositConfirmClick, {
            amount: Number(data.amount),
        });

        try {
            const response = await createDeposit.mutateAsync({
                pay_platform: data.pay_platform,
                amount: Number(data.amount),
                success_url: currentUrl,
                fail_url: currentUrl,
                ...(promoValidation?.valid && promoCode ? { first_recharge_code: promoCode } : {}),
            });

            dispatchCodes();

            Toast.success(t('depositPendingToast'), { id: 'deposit-submit' });
            if (paymentMode === DepositPaymentMode.Iframe) {
                const iframePaymentUrl = getCreateDepositPaymentUrl(response);

                if (!iframePaymentUrl) {
                    if (response?.order_no) {
                        startDepositPolling(response.order_no);
                    }
                    return;
                }

                onPaymentCreated?.({
                    orderNo: response.order_no,
                    payUrl: iframePaymentUrl,
                    orderExpired: response.order_expired,
                    payPlatform: data.pay_platform,
                    amount: Number(data.amount),
                });
                if (response?.order_no) {
                    startDepositPolling(response.order_no);
                }
                return;
            }
            if (response?.pay_url) {
                // Navigate to payment gateway — don't start polling (page is leaving,
                // polling will resume when user returns via success_url/fail_url)
                window.location.href = response.pay_url;
                return;
            }
            if (response?.order_no) startDepositPolling(response.order_no);
        } catch (err) {
            const message = err instanceof Error ? err.message : t('depositFailedToast');
            Toast.error(message, { id: 'deposit-submit' });
        }
    };

    // Reset form when deposit polling completes
    useEffect(() => {
        if (isPollingEnded) {
            form.setValue('amount', '');
        }
    }, [isPollingEnded, form.setValue]);

    // 输入金额变化时，实时校验金额是否在范围内
    useDebounceEffect(
        () => {
            if (amountValue) {
                form.trigger('amount');
                track(FirebaseAnalyticsEventName.DepositAmountInput, {
                    amount: Number(amountValue),
                });
            }
        },
        [amountValue, form.trigger, track],
        { wait: 500 },
    );

    const getReward = useRechargeReward();

    /** 快充金额 */
    const shortcutList: typeof DEFAULT_SHORTCUTS = useMemo(() => {
        return DEFAULT_SHORTCUTS.map((v) => {
            const reward = getReward(promoCode, v.amount);

            if (!reward) {
                return { amount: v.amount };
            }

            return {
                amount: v.amount,
                badge: <DepositReward className="-right-1 -top-1.5" variant="small" reward={reward?.reward || 0} />,
            };
        });
    }, [getReward, promoCode]);

    const channel = form.watch('pay_platform');

    useEffect(() => {
        if (!channel && channelOptions.length) {
            form.setValue('pay_platform', channelOptions[0]?.value || '');
        }
    }, [channelOptions, form.setValue, channel]);

    useEffect(() => {
        if (showChannelMaintenance) {
            form.clearErrors('pay_platform');
        }
    }, [form.clearErrors, showChannelMaintenance]);

    return (
        <FormProvider {...form}>
            <form
                key={form.formState.submitCount}
                onSubmit={form.handleSubmit(onSubmit)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault();
                }}
                className={cn('max-md:flex-1 max-md:min-h-0 max-md:flex max-md:flex-col', className)}
            >
                <div
                    className={cn(
                        'flex flex-col gap-4 max-md:flex-1 max-md:min-h-0',
                        compact ? 'bg-transparent p-0 max-md:overflow-visible' : 'account-card max-md:overflow-y-auto',
                    )}
                >
                    <div className="flex flex-col px-2 gap-4">
                        <FormSelect
                            name="pay_platform"
                            label={t('channelLabel')}
                            showError={!showChannelMaintenance}
                            fieldProps={{
                                options: channelOptions || [],
                                disabled: showChannelMaintenance,
                            }}
                        />
                        {showChannelMaintenance && (
                            <p className="text-body-sm text-func-lost">{t('channelMaintenance')}</p>
                        )}
                        <FormInput
                            name="amount"
                            label={t('amountLabel')}
                            fieldProps={{
                                className:
                                    'rounded-sm border-[0.5px] border-transparent bg-filltext-ft-a hover:bg-filltext-ft-b focus-within:border-filltext-ft-h focus-within:bg-filltext-ft-b [&_[data-slot=input]]:text-filltext-ft-h [&_[data-slot=input]]:placeholder:text-filltext-ft-h',
                                placeholder: t('inputPlaceholder', {
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
                            minAmount={min}
                            shortcutList={shortcutList}
                        />
                    </div>

                    {/* Promo code input + validation result */}
                    {hasActivePromo && (
                        <PromoCodeInput
                            value={promoCode}
                            onChange={handlePromoCodeChange}
                            validation={promoValidation}
                            isValidating={false}
                        />
                    )}

                    <div className={cn(compact && 'max-md:sticky max-md:bottom-0 max-md:z-10 max-md:pt-2')}>
                        <Button
                            type="submit"
                            variant="primary"
                            block
                            loading={form.formState.isSubmitting || createDeposit.isPending || isPolling}
                            disabled={
                                createDeposit.isPending || isPolling
                                // promoCode校验失败，不影响提交充值
                                // || (promoCode.trim() ? !promoValidation?.valid : false)
                            }
                        >
                            {t('confirmBtnText')}
                        </Button>
                    </div>

                    {/* Promotional banner placeholder */}
                    {hasActivePromo && <PromoBannerPlaceholder />}
                </div>
            </form>
        </FormProvider>
    );
};
