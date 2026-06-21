import { useBoolean, useCountDown } from 'ahooks';
import type { FunctionComponent } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { CopyOutlined } from '@/components/icons2/CopyOutlined';
import { RightCircleOutlined } from '@/components/icons2/RightCircleOutlined';
import { Toast } from '@/components/toast';
import { useCommonTranslations } from '@/hooks/use-translations';
import { useUser } from '@/stores/session-store';
import { cn } from '@/utils/common';

/** 复制用户ID */
export const CopyUserId: FunctionComponent<{
    className?: string;
}> = ({ className }) => {
    const tCommon = useCommonTranslations();
    const userId = useUser()?.uid || '';

    const [_, onCopy] = useCopyToClipboard();
    const [copied, copiedAction] = useBoolean(false);

    const [copyCountDown] = useCountDown({
        leftTime: copied ? 5000 : undefined,
        onEnd: copiedAction.setFalse,
    });

    return (
        <div
            className={cn(
                'group h-8 px-2 inline-flex items-center justify-center rounded-sm cursor-pointer bg-surface-1',
                className,
            )}
            onClick={() => {
                onCopy(userId)
                    .then(() => {
                        copiedAction.setTrue();
                    })
                    .catch((err) => {
                        console.log('==copy failed', err);
                        Toast.error(tCommon('message.copyFailed'));
                    });
            }}
        >
            <label className="text-filltext-ft-e text-auxiliary-sm">ID:</label>
            <span className="ml-1 mr-3 text-filltext-ft-g text-auxiliary-sm">{userId}</span>
            <div
                className={cn(
                    'size-6 rounded inline-flex justify-center items-center',
                    copyCountDown ? '' : 'group-hover:bg-filltext-ft-b',
                )}
            >
                {copyCountDown ? (
                    <RightCircleOutlined className="size-4 text-func-win" />
                ) : (
                    <CopyOutlined className="size-6 text-filltext-ft-e group-hover:text-filltext-ft-g" />
                )}
            </div>
        </div>
    );
};
