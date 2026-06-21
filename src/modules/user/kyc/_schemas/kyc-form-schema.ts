import z from 'zod';
import { type RegionConfig, verifyIdentityDocument } from '@/i18n';

/**
 * Config required for KYC form validation
 */
export interface KYCFormLocale {
    idVerifyError: string;
    policyNeedHint: string;
    regionConfig: RegionConfig;
}

/**
 * Helper to create a required boolean field validator
 */
const createRequiredBooleanValidator = (errorMessage: string) =>
    z.boolean().refine((v) => v === true, { message: errorMessage });

/**
 * Creates KYC form validation schema with localized error messages
 * @param config - Localized error messages and current region config
 * @returns Zod validation schema
 */
export const createKYCFormSchema = (config: KYCFormLocale) => {
    return z.object({
        idNumber: z
            .string()
            .nonempty(config.idVerifyError)
            .refine((val) => verifyIdentityDocument(val, config.regionConfig), {
                message: config.idVerifyError,
            }),
        privacyPolicyAccepted: createRequiredBooleanValidator(config.policyNeedHint),
        authPolicyAccepted: createRequiredBooleanValidator(config.policyNeedHint),
    });
};

/**
 * Type inference for form values
 */
export type KYCFormValues = z.infer<ReturnType<typeof createKYCFormSchema>>;
