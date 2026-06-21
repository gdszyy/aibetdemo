'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useState } from 'react';
import { OAuthProvider } from '@/api/models/user';
import { User } from '@/components/icons';
import { useUser } from '@/stores/session-store';
import type { BindProfileType } from './components/bindContactModal';
import { BindContactModal } from './components/bindContactModal';
import { CertificationItem, type CertificationItemData } from './components/certificationItem';
import { type ProfileField, ProfileFieldRow } from './components/profileFieldRow';
import { useOauthBindActions } from './hooks/useOauthBindActions';
import { useUserBindActions } from './hooks/useUserBindActions';

/** 账号中心用户资料页 */
export const UserProfile: FC = () => {
    const t = useTranslations('user');
    const user = useUser();
    const { data: bindings } = useUserBindActions();
    const { bindAction: bindOAuthAction, unbindAction: unbindOAuthAction } = useOauthBindActions();
    const [bindingType, setBindingType] = useState<BindProfileType | null>(null);
    const [unbindingType, setUnbindingType] = useState<OAuthProvider | null>(null);
    const emptyText = t('profilePage.empty');
    const displayName = user?.nickname || user?.username || emptyText;
    const email = bindings?.email_value || user?.email || emptyText;
    const phone = bindings?.mobile_value || user?.phone || emptyText;
    const google = bindings?.google_value || emptyText;
    // const facebook = bindings?.facebook_value || emptyText;
    const isEmailLinked = bindings?.email ?? email !== emptyText;
    const isPhoneLinked = bindings?.mobile ?? phone !== emptyText;
    const isGoogleLinked = bindings?.google ?? false;
    // const isFacebookLinked = bindings?.facebook ?? false;
    const pendingOAuthProvider = bindOAuthAction.variables ?? unbindOAuthAction.variables ?? null;

    const personalFields: ProfileField[] = [
        { label: t('profilePage.fields.uid'), value: user?.uid || emptyText, copyValue: user?.uid },
        { label: t('profilePage.fields.username'), value: user?.username || emptyText, copyValue: user?.username },
    ];

    const certificationItems: CertificationItemData[] = [
        {
            type: 'email',
            value: email,
            status: isEmailLinked ? 'linked' : 'unlinked',
            bindType: 'email',
        },
        {
            type: 'mobile',
            value: phone,
            status: isPhoneLinked ? 'linked' : 'unlinked',
            bindType: 'mobile',
        },
        {
            type: OAuthProvider.Google,
            value: google,
            status: isGoogleLinked ? 'linked' : 'unlinked',
            oauthProvider: OAuthProvider.Google,
        },
        // {
        //     type: OAuthProvider.Facebook,
        //     value: facebook,
        //     status: isFacebookLinked ? 'linked' : 'unlinked',
        //     oauthProvider: OAuthProvider.Facebook,
        // },
    ];

    return (
        <>
            <div className="grid w-full grid-cols-1 gap-4 @xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                <section className="account-card px-4 py-6 flex min-w-0 flex-col gap-4">
                    <div className="flex w-full shrink-0 items-center justify-center overflow-hidden rounded-full">
                        {user?.avatar ? (
                            <Image
                                src={user.avatar}
                                alt=""
                                width={80}
                                height={80}
                                className="size-20 object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="flex justify-center items-center size-20 md:size-20 bg-filltext-ft-b rounded-full">
                                <User className="size-14 text-filltext-ft-e" />
                            </div>
                        )}
                    </div>
                    <div className="w-full shrink-0 text-center">
                        <h3 className="truncate text-title-sm md:text-body-lg text-filltext-ft-h">{displayName}</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        {personalFields.map((field) => (
                            <ProfileFieldRow key={field.label} field={field} />
                        ))}
                    </div>
                </section>

                <section className="account-card px-3 py-4 md:p-4 flex min-w-0 flex-col gap-4">
                    <h2 className="md:text-body-md text-body-lg text-filltext-ft-h">
                        {t('profilePage.certificationTitle')}
                    </h2>
                    <div className="flex flex-col gap-2 md:gap-4">
                        {certificationItems.map((item) => (
                            <CertificationItem
                                key={item.type}
                                item={item}
                                onBindContact={setBindingType}
                                onBindOAuth={setBindingType}
                                onUnbindOAuth={setUnbindingType}
                                pending={
                                    Boolean(item.oauthProvider) &&
                                    pendingOAuthProvider === item.oauthProvider &&
                                    (bindOAuthAction.isPending || unbindOAuthAction.isPending)
                                }
                            />
                        ))}
                    </div>
                </section>
            </div>
            <BindContactModal
                visible={bindingType !== null}
                type={bindingType}
                onClose={() => {
                    setBindingType(null);
                }}
                onBindOAuth={bindOAuthAction.mutateAsync}
                oauthPending={bindOAuthAction.isPending}
            />
            <BindContactModal
                visible={unbindingType !== null}
                type={unbindingType}
                oauthAction="unbind"
                onClose={() => {
                    setUnbindingType(null);
                }}
                onUnbindOAuth={unbindOAuthAction.mutateAsync}
                oauthPending={unbindOAuthAction.isPending}
            />
        </>
    );
};
