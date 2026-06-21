'use client';

import { useLocalStorageState } from 'ahooks';
import { type FC, useEffect, useState } from 'react';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useRegionIntlLocale } from '@/i18nV2/store';
import { STORAGE_KEYS } from '@/modules/bet-slip/cart/_constants';
import { useSlipSettingsStore } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';

/**
 * 移动端自绘数字键盘（betbus 形态）。
 *
 * 用于投注金额输入，避免唤起系统键盘。内含金额显示头 + 快捷加注 + 数字 + 退格 + 完成。
 * 由 StakeInput 在移动端（useIsMobile）点击金额框时弹出，驱动同一个 onChange。
 *
 * 关键点：键盘以 fixed 弹层盖在投注单抽屉之上，输入框可能被遮住，所以键盘自带金额显示头，
 * 保证打字时始终能看到当前金额（对齐 betbus 自绘键盘）。
 */

interface NumericKeypadProps {
    /** 当前金额 */
    value: number;
    /** 金额变化回调 */
    onChange: (value: number) => void;
    /** 关闭回调 */
    onClose: () => void;
    /** 快捷加注金额（不传则取用户在投注单设置里配置的 quickBuyAmounts，与桌面一致） */
    quickStakes?: number[];
    /** 上限 */
    max?: number;
}

/** 仅保留数字 + 一个小数点 + 最多两位小数（内部统一用 "." 形式）。 */
const sanitize = (raw: string): string => {
    const cleaned = raw.replace(/[^\d.]/g, '');
    const [intPart, ...rest] = cleaned.split('.');
    return rest.length ? `${intPart}.${rest.join('').slice(0, 2)}` : intPart;
};

/** 把内部 "." 形式的草稿转成展示数字（去前导 0，回填 locale 小数分隔符，保留正在输入的尾部小数）。 */
const toNumber = (draft: string): number => Number(sanitize(draft)) || 0;

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'] as const;

export const NumericKeypad: FC<NumericKeypadProps> = ({ value, onChange, onClose, quickStakes, max }) => {
    const { currencySymbolNarrow, decimalSeparator } = useIntlFormatter();
    const locale = useRegionIntlLocale();
    const quickBuyAmounts = useSlipSettingsStore((s) => s.quickBuyAmounts);
    // 与桌面端快捷加注一致：优先用调用方传入，其次用用户配置，最后兜底默认。
    const amounts = quickStakes ?? (quickBuyAmounts?.length ? quickBuyAmounts : [10, 50, 100]);
    const [draft, setDraft] = useState(() => (value ? sanitize(String(value)) : ''));
    const [rememberStake = false, setRememberStake] = useLocalStorageState<boolean>(STORAGE_KEYS.REMEMBER_STAKE, {
        defaultValue: false,
        listenStorageChange: true,
    });

    // 外部 value 变化（如赔率变动导致 max 收紧、被钳制）时同步草稿；正在输入的尾部小数（"10."）不打断。
    useEffect(() => {
        setDraft((prev) => (Math.abs(toNumber(prev) - value) < 0.005 ? prev : value ? sanitize(String(value)) : ''));
    }, [value]);

    const commit = (next: string): void => {
        const sanitized = sanitize(next);
        const num = Number(sanitized) || 0;
        const clamped = max != null ? Math.min(num, max) : num;
        // 超过上限时把草稿也回写为钳制值，避免显示与真实金额脱节。
        setDraft(clamped !== num ? sanitize(String(clamped)) : sanitized);
        onChange(clamped);
    };

    const press = (key: string): void => {
        if (key === 'back') {
            commit(draft.slice(0, -1));
            return;
        }
        if (key === '.') {
            if (draft.includes('.')) {
                return;
            }
            commit(`${draft || '0'}.`);
            return;
        }
        commit(draft + key);
    };

    const addQuick = (amount: number): void => {
        commit(String((Number(sanitize(draft)) || 0) + amount));
    };

    // 展示金额：整数段按 locale 格式化，保留正在输入的小数尾（"10," / "10,5"）。
    const [intRaw, decRaw] = draft.split('.');
    const intLabel = Intl.NumberFormat(locale, { maximumFractionDigits: 0, useGrouping: false }).format(
        intRaw ? Number(intRaw) : 0,
    );
    const amountLabel = draft.includes('.') ? `${intLabel}${decimalSeparator}${decRaw}` : intLabel;

    return (
        <>
            <button type="button" className="fixed inset-0 z-[60] cursor-default bg-black/40" onClick={onClose} />
            <div className="fixed inset-x-0 bottom-0 z-[61] flex select-none flex-col gap-2 rounded-t-md bg-surface-1 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-floating">
                {/* 金额显示头：键盘盖住输入框时也能看到正在输入的金额 */}
                <div className="flex items-baseline justify-end gap-1 rounded-sm bg-surface-2 px-3 py-2">
                    <span className="text-body-sm text-filltext-ft-f">{currencySymbolNarrow}</span>
                    <span className="text-headline-sm font-bold text-filltext-ft-h tabular-nums">{amountLabel}</span>
                </div>
                <label className="flex h-9 items-center justify-between rounded-sm bg-surface-2 px-3">
                    <span className="text-body-sm font-medium text-filltext-ft-h">Recordar</span>
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={rememberStake}
                        onChange={(event) => setRememberStake(event.target.checked)}
                    />
                    <span
                        className={cn(
                            'relative h-5 w-9 rounded-full transition-colors',
                            rememberStake ? 'bg-brand-primary-0' : 'bg-filltext-ft-c',
                        )}
                    >
                        <span
                            className={cn(
                                'absolute top-0.5 size-4 rounded-full bg-neutral-white-h transition-transform',
                                rememberStake ? 'translate-x-[18px]' : 'translate-x-0.5',
                            )}
                        />
                    </span>
                </label>
                <div className="flex gap-2">
                    {amounts.map((amount) => (
                        <button
                            key={amount}
                            type="button"
                            onClick={() => addQuick(amount)}
                            className="flex-1 rounded-sm bg-surface-2 py-2 text-body-md font-medium text-brand-primary-3 transition-colors active:bg-surface-3"
                        >
                            +{currencySymbolNarrow}
                            {amount}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                    {KEYS.map((key) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => press(key)}
                            className="flex h-11 items-center justify-center rounded-sm bg-surface-2 text-title-sm font-bold text-filltext-ft-h transition-colors active:bg-surface-3"
                        >
                            {key === 'back' ? 'Del' : key === '.' ? decimalSeparator : key}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-sm bg-brand-primary-0 py-2.5 text-body-lg font-bold text-neutral-white-h transition-colors active:bg-brand-primary-4"
                >
                    Done
                </button>
            </div>
        </>
    );
};
