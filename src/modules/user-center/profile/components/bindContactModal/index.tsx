'use client';

import type { FC } from 'react';
import { OAuthProvider } from '@/api/models/user';
import { BindContactModalContent } from './bindContactModalContent';
import { OAuthBindModalContent } from './oauthBindModalContent';
import type { BindProfileType } from './types';

export type { BindContactType, BindProfileType } from './types';

interface BindContactModalProps {
    /** 弹窗是否打开。 */
    visible: boolean;
    /** 当前绑定类型。 */
    type: BindProfileType | null;
    /** 第三方账号确认操作类型。 */
    oauthAction?: 'bind' | 'unbind';
    /** 关闭弹窗。 */
    onClose: () => void;
    /** 确认绑定第三方账号。 */
    onBindOAuth?: (provider: OAuthProvider) => Promise<void>;
    /** 确认解绑第三方账号。 */
    onUnbindOAuth?: (provider: OAuthProvider) => Promise<void>;
    /** 第三方账号绑定是否进行中。 */
    oauthPending?: boolean;
}

/** 判断当前绑定类型是否为第三方账号。 */
const checkIsOAuthType = (type: BindProfileType): type is OAuthProvider => {
    return type === OAuthProvider.Google || type === OAuthProvider.Facebook;
};

/** 绑定联系方式弹窗，负责按当前绑定类型挂载表单。 */
export const BindContactModal: FC<BindContactModalProps> = ({
    visible,
    type,
    oauthAction = 'bind',
    onClose,
    onBindOAuth,
    onUnbindOAuth,
    oauthPending = false,
}) => {
    if (!type) {
        return null;
    }

    const oauthConfirmAction = oauthAction === 'bind' ? onBindOAuth : onUnbindOAuth;

    if (checkIsOAuthType(type) && oauthConfirmAction) {
        return (
            <OAuthBindModalContent
                key={type}
                visible={visible}
                action={oauthAction}
                type={type}
                onClose={onClose}
                onConfirm={oauthConfirmAction}
                pending={oauthPending}
            />
        );
    }

    if (checkIsOAuthType(type)) {
        return null;
    }

    return <BindContactModalContent key={type} visible={visible} type={type} onClose={onClose} />;
};
