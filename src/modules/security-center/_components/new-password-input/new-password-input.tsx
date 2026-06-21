import { useDebounce } from 'ahooks';
import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormPassword } from '@/components/form-password/form-password';
import { cn } from '@/utils/common';
import { pwdVerify } from '@/utils/verifies';

interface VerifyItem {
    /* Label */
    label: string;
    /* Check key */
    check: string;
    /* Status */
    status: boolean;
}

/**
 * New password input component
 * Validates password requirements in real-time as user types
 */
export const NewPasswordInput: FC<{ label: string; placeholder: string }> = ({ label, placeholder }) => {
    const t = useTranslations('user');
    const { control } = useFormContext();
    const formValue = useWatch({ control, name: 'newPwd' });
    const [inputStr, setinputStr] = useState('');
    const debouncedValue = useDebounce(inputStr, { wait: 200 });

    const [verifies, setVerifies] = useState<VerifyItem[]>([
        {
            label: t('securityCenter.newPwdVerifyHint.length'),
            check: 'len',
            status: false,
        },
        {
            label: t('securityCenter.newPwdVerifyHint.letter'),
            check: 'letter',
            status: false,
        },
        {
            label: t('securityCenter.newPwdVerifyHint.number'),
            check: 'number',
            status: false,
        },
        {
            label: t('securityCenter.newPwdVerifyHint.specialChar'),
            check: 'specialChar',
            status: false,
        },
    ]);

    // Sync local state when form value changes
    useEffect(() => {
        setinputStr(formValue || '');
    }, [formValue]);

    useEffect(() => {
        if (debouncedValue) {
            const { len, letter, number, specialChar } = pwdVerify(debouncedValue);
            setVerifies((prev) => {
                const newVerifies = [...prev];
                newVerifies.forEach((verify) => {
                    if (verify.check === 'len') verify.status = len;
                    else if (verify.check === 'letter') verify.status = letter;
                    else if (verify.check === 'number') verify.status = number;
                    else if (verify.check === 'specialChar') verify.status = specialChar;
                });
                return newVerifies;
            });
        } else {
            // Reset all validation states when input is empty
            setVerifies((prev) => {
                return prev.map((verify) => ({ ...verify, status: false }));
            });
        }
    }, [debouncedValue]);

    return (
        <div className="flex flex-col gap-1 px-4 ">
            <FormPassword
                label={label}
                name="newPwd"
                fieldProps={{
                    placeholder: placeholder,
                }}
            />
            {/* Real-time password requirement validation indicators */}
            <div className="flex flex-col gap-1">
                {verifies.map((verify) => (
                    <div key={verify.label} className="flex items-center gap-2">
                        <div
                            className={cn(
                                'size-1 rounded-full',
                                verify.status ? 'bg-func-win' : inputStr ? 'bg-func-lost' : 'bg-filltext-ft-e',
                            )}
                        />
                        <span
                            className={cn(
                                'text-auxiliary-sm',
                                verify.status ? 'text-func-win' : inputStr ? 'text-func-lost' : 'text-filltext-ft-e',
                            )}
                        >
                            {verify.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
