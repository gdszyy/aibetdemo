'use client';

import { useTranslations } from 'next-intl';
import type { FC, ReactNode } from 'react';
import type { OAuthProvider } from '@/api/models/user';
import { Email } from '@/components/icons2/Email';
import { Facebook } from '@/components/icons2/Facebook';
import { Google } from '@/components/icons2/Google';
import { Phone } from '@/components/icons2/Phone';
import { RightCircleOutlined } from '@/components/icons2/RightCircleOutlined';
import type { BindContactType, BindProfileType } from '../bindContactModal';

export interface CertificationItemData {
    /** 认证项目类型。 */
    type: BindProfileType;
    /** 认证项目当前值。 */
    value: string;
    /** 认证状态，决定展示样式。 */
    status: 'linked' | 'unlinked';
    /** 当前页面支持发起联系方式绑定的类型。 */
    bindType?: BindContactType;
    /** 当前页面支持发起第三方绑定/解绑的提供方。 */
    oauthProvider?: OAuthProvider;
}

interface CertificationItemProps {
    /** 认证展示项。 */
    item: CertificationItemData;
    /** 点击联系方式绑定按钮的回调。 */
    onBindContact: (type: BindContactType) => void;
    /** 点击第三方绑定按钮的回调。 */
    onBindOAuth: (provider: OAuthProvider) => void;
    /** 点击第三方解绑按钮的回调。 */
    onUnbindOAuth: (provider: OAuthProvider) => void;
    /** 当前行操作是否进行中。 */
    pending: boolean;
}

/** 个人资料页认证展示项。 */
export const CertificationItem: FC<CertificationItemProps> = ({ item, onBindContact, onBindOAuth, pending }) => {
    const t = useTranslations('user');
    const handleBindClick = (): void => {
        if (item.bindType) {
            onBindContact(item.bindType);
            return;
        }
        if (item.oauthProvider) {
            onBindOAuth(item.oauthProvider);
        }
    };
    const providerNames: Record<CertificationItemData['type'], string> = {
        email: t('profilePage.certification.email'),
        mobile: t('profilePage.certification.phone'),
        google: t('profilePage.certification.google'),
        facebook: t('profilePage.certification.facebook'),
    };
    const providerIcons: Record<CertificationItemData['type'], ReactNode> = {
        email: <Email className="size-5" />,
        mobile: <Phone className="size-5 text-brand-primary-0" />,
        google: <Google className="size-5" />,
        facebook: <Facebook className="size-5" />,
    };

    return (
        <div className="group flex flex-row justify-between px-4 py-2 rounded-sm max-md:border max-md:border-filltext-ft-b hover:bg-filltext-ft-a">
            <div className="flex gap-2">
                <div className="w-10 h-10 flex justify-center items-center bg-filltext-ft-a group-hover:bg-surface-1 rounded-full">
                    {providerIcons[item.type]}
                </div>
                <div className="flex flex-col justify-center">
                    <span className="text-body-lg text-filltext-ft-g">{providerNames[item.type]}</span>
                    <span className="text-body-sm text-filltext-ft-f"> {item.value}</span>
                </div>
            </div>
            {item.status === 'unlinked' ? (
                <div className="flex gap-2 items-center justify-end">
                    <div className="text-body-md text-filltext-ft-e max-md:hidden">
                        {t('profilePage.certification.notLinked')}
                    </div>
                    {(item.bindType || item.oauthProvider) && (
                        <button
                            type="button"
                            onClick={handleBindClick}
                            disabled={pending}
                            className="px-2 h-6 bg-brand-primary-0 hover:bg-brand-primary-4 text-auxiliary-md text-on-brand rounded-full"
                        >
                            {t('profilePage.certification.linkNow')}
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex gap-2 items-center justify-end">
                    <div className="flex gap-1 justify-center items-center text-func-win">
                        <RightCircleOutlined className="size-3 max-md:size-3.5" />
                        <span className="text-body-md max-md:hidden">{t('profilePage.certification.verified')}</span>
                    </div>
                    {/* {item.oauthProvider && (
                        <button
                            type="button"
                            onClick={handleUnbindClick}
                            disabled={pending}
                            className="text-body-md text-filltext-ft-e hover:text-func-lost transition-colors"
                        >
                            {t('profilePage.certification.unlink')}
                        </button>
                    )} */}
                </div>
            )}
        </div>
    );
};
