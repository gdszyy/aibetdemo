import { useToggle } from 'ahooks';
import { useTranslations as useCommonTranslations, useTranslations } from 'next-intl';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/button/button';
import { FormErrorMessage } from '@/components/form-error-message/form-error-message';
import { EyeClose, EyeOpen } from '@/components/icons';
import { Input } from '@/components/input/input';
import { Modal } from '@/components/modal/modal';
import { pwdVerify } from '@/utils/verifies';

interface Props {
    visible: boolean;
    /** Title */
    title: ReactNode;
    subTitle?: ReactNode;
    /** Input placeholder text */
    placeholder: string;
    /** Confirm button text */
    confirmText: string;
    /** Confirm callback */
    onSubmit: (password: string) => void;
    /** Close modal callback */
    onCloseModal: () => void;
}

const Content: FC<
    Pick<Props, 'placeholder' | 'subTitle'> & {
        error?: boolean;
        password: string;
        setPassword: (password: string) => void;
    }
> = ({ placeholder, subTitle, error, password, setPassword }) => {
    const [isVisible, { toggle }] = useToggle();
    const t = useTranslations('withdraw');

    return (
        <div className="w-full flex flex-col items-start gap-2">
            {Boolean(subTitle) && <div className="text-auxiliary-md mb-[-4px]">{subTitle}</div>}
            <Input
                className=" w-full"
                type={isVisible ? 'text' : 'password'}
                placeholder={placeholder}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                value={password}
                addonAfter={
                    <button type="button" className="px-4 h-full flex items-center cursor-pointer" onClick={toggle}>
                        {isVisible ? <EyeOpen className="text-base" /> : <EyeClose className="text-base" />}
                    </button>
                }
            />
            <FormErrorMessage errMsg={error ? t('passwordValidError') : ''} />
        </div>
    );
};

/**
 * Wallet password input modal
 */
export const Password: FC<Props> = ({ visible, onCloseModal, title, subTitle, placeholder, confirmText, onSubmit }) => {
    const tCommon = useCommonTranslations('common');
    const [password, setPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);

    useEffect(() => {
        if (!visible) {
            setPassword('');
            setPasswordValid(true);
        }
    }, [visible]);

    const handleClose = () => {
        setPassword('');
        setPasswordValid(true);
        onCloseModal();
    };

    const handleSubmit = () => {
        const valid = pwdVerify(password).result;
        setPasswordValid(valid);
        if (!valid) return;

        onSubmit(password);
    };

    return (
        <Modal visible={visible} onClose={handleClose} withBg={false} closeButton={false} maskClosable={false}>
            <div className="w-[calc(100vw-2rem)] max-w-[435px] rounded-md bg-surface-1 backdrop-blur-[5px] px-4 py-8">
                <div className="flex flex-col gap-4">
                    {Boolean(title) && <div className="text-title-md text-filltext-ft-g">{title}</div>}
                    <Content
                        subTitle={subTitle}
                        placeholder={placeholder}
                        error={!passwordValid}
                        password={password}
                        setPassword={(nextPassword) => {
                            setPassword(nextPassword);
                            if (!passwordValid) {
                                setPasswordValid(true);
                            }
                        }}
                    />
                    <div className="flex gap-[10px] justify-end">
                        <Button variant="secondary" onClick={handleClose} className="flex-1 h-10">
                            {tCommon('dialog.cancelBtnText')}
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} className="flex-1 h-10">
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
