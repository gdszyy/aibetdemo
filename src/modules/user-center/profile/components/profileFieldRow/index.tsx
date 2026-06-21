'use client';

import { useBoolean, useCountDown } from 'ahooks';
import type { FC, ReactNode } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { CopyOutlined } from '@/components/icons2/CopyOutlined';
import { RightCircleOutlined } from '@/components/icons2/RightCircleOutlined';
import { Toast } from '@/components/toast';
import { useCommonTranslations } from '@/hooks/use-translations';
import { cn } from '@/utils/common';

export interface ProfileField {
    /** 资料字段的本地化标签。 */
    label: string;
    /** 资料字段的展示值。 */
    value: ReactNode;
    /** 需要复制到剪贴板的字段值。 */
    copyValue?: string;
}

interface ProfileFieldRowProps {
    /** 需要渲染的用户资料字段。 */
    field: ProfileField;
}

/** 用户资料单行展示项。 */
export const ProfileFieldRow: FC<ProfileFieldRowProps> = ({ field }) => {
    const tCommon = useCommonTranslations();
    const [_, copy] = useCopyToClipboard();
    const [copied, copiedAction] = useBoolean(false);
    const [copyCountDown] = useCountDown({
        leftTime: copied ? 500 : undefined,
        onEnd: copiedAction.setFalse,
    });

    /** 点击复制按钮时将字段值写入剪贴板。 */
    const handleCopy = (): void => {
        if (!field.copyValue) {
            return;
        }

        copy(field.copyValue)
            .then(() => {
                copiedAction.setTrue();
            })
            .catch(() => {
                Toast.error(tCommon('message.copyFailed'), { id: 'profile-copy-failed' });
            });
    };

    return (
        <div className="flex flex-col text-body-sm min-h-15.5 gap-1 rounded-sm">
            <span className="shrink-0 text-filltext-ft-g">{field.label}</span>
            <div
                className={cn(
                    'min-w-0 px-4 h-10 bg-filltext-ft-a text-filltext-ft-f rounded-sm flex items-center gap-2',
                )}
            >
                <span className="min-w-0 flex-1 truncate">{field.value}</span>
                {field.copyValue && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={cn(
                            'flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-filltext-ft-e transition-colors hover:text-filltext-ft-g',
                            copyCountDown ? '' : 'hover:bg-filltext-ft-b',
                        )}
                    >
                        {copyCountDown ? (
                            <RightCircleOutlined className="size-4 text-func-win" />
                        ) : (
                            <CopyOutlined className="size-6" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};
