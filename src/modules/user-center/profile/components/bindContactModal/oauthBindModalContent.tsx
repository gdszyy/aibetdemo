'use client';

import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';
import { OAuthProvider } from '@/api/models/user';
import { Button } from '@/components/button/button';
import { Facebook } from '@/components/icons2/Facebook';
import { Google } from '@/components/icons2/Google';
import { WarningShieldOutline } from '@/components/icons2/WarningShieldOutline';
import { Modal } from '@/components/modal/modal';
import { useIsDesktop } from '@/hooks/use-media-query';
import { prepareFirebaseOAuth } from '@/libs/oauth';

interface OAuthBindModalContentProps {
    /** 弹窗是否打开。 */
    visible: boolean;
    /** 当前确认操作类型。 */
    action: 'bind' | 'unbind';
    /** 第三方账号提供方。 */
    type: OAuthProvider;
    /** 关闭弹窗。 */
    onClose: () => void;
    /** 确认执行第三方账号操作。 */
    onConfirm: (provider: OAuthProvider) => Promise<void>;
    /** 操作是否进行中。 */
    pending: boolean;
}

/** 第三方账号绑定确认弹窗，复用联系方式绑定弹窗容器样式。 */
export const OAuthBindModalContent: FC<OAuthBindModalContentProps> = ({
    visible,
    action,
    type,
    onClose,
    onConfirm,
    pending,
}) => {
    const t = useTranslations('user');
    const tCommon = useTranslations('common');
    const isDesktop = useIsDesktop();
    const [oauthReady, setOauthReady] = useState(action === 'unbind');
    const title =
        type === OAuthProvider.Google ? t('profilePage.binding.googleTitle') : t('profilePage.binding.facebookTitle');
    const providerName =
        type === OAuthProvider.Google ? t('profilePage.certification.google') : t('profilePage.certification.facebook');
    const providerIcon =
        type === OAuthProvider.Google ? <Google className="size-5" /> : <Facebook className="size-5" />;
    const handleClose = (): void => {
        // 测试要求关闭时不管否正在进行中都能关闭弹窗，所以注释掉了 pending 的判断
        // if (pending) {
        //     return;
        // }
        onClose();
    };

    const handleConfirm = (): void => {
        onConfirm(type)
            .then(onClose)
            .catch(() => undefined);
    };

    useEffect(() => {
        if (action === 'unbind') {
            setOauthReady(true);
            return;
        }

        setOauthReady(false);
        prepareFirebaseOAuth()
            .then(() => setOauthReady(true))
            .catch(() => undefined);
    }, [action]);

    return (
        <Modal visible={visible} onClose={handleClose} withBg={false} maskClosable={false} closeButton={isDesktop}>
            <div className="w-105 max-w-[calc(100vw-2rem)] rounded-md bg-surface-raised px-4 md:px-6 py-8 flex flex-col gap-6">
                {action === 'unbind' ? (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="size-15 rounded-full bg-func-lost/10 flex items-center justify-center text-func-lost">
                            <WarningShieldOutline className="size-8" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-title-md text-filltext-ft-h">
                                {t('profilePage.binding.oauthUnbindTitle')}
                            </h3>
                            <p className="text-body-sm text-filltext-ft-g">
                                {t('profilePage.binding.oauthUnbindConfirmHint', { provider: providerName })}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-2 text-center">
                            <h3 className="text-title-md text-filltext-ft-h">{title}</h3>
                            <p className="text-body-sm text-filltext-ft-g">
                                {action === 'bind'
                                    ? t('profilePage.binding.oauthConfirmHint')
                                    : t('profilePage.binding.oauthUnbindConfirmHint')}
                            </p>
                        </div>
                        <div className="h-14 rounded-sm bg-filltext-ft-a flex items-center justify-center gap-2 text-body-sm text-filltext-ft-e">
                            <span className="size-10 rounded-full bg-surface-1 flex items-center justify-center shrink-0">
                                {providerIcon}
                            </span>
                            <span className="truncate">
                                {action === 'bind'
                                    ? t('profilePage.binding.oauthAuthorizeLabel', { provider: providerName })
                                    : t('profilePage.binding.oauthUnbindLabel', { provider: providerName })}
                            </span>
                        </div>
                    </>
                )}
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        className="flex-1 h-10 min-w-20"
                        onClick={handleClose}
                        disabled={pending}
                    >
                        {tCommon('dialog.cancelBtnText')}
                    </Button>
                    <Button
                        className="flex-1 h-10 min-w-20"
                        loading={pending}
                        disabled={!oauthReady}
                        onClick={handleConfirm}
                    >
                        {tCommon('dialog.confirmBtnText')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
