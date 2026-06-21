import { z } from 'zod';

/** Create/update info Zod Schema */
export const CreateUpdateInfoSchema = z.object({
    /** Created by */
    created_by: z.string().optional(),
    /** Created at, unix timestamp */
    created_at: z.number().optional(),
    /** Updated by */
    updated_by: z.string().optional(),
    /** Updated at, unix timestamp */
    updated_at: z.number().optional(),
});

/** Create/update info */
export type CreateUpdateInfo = z.infer<typeof CreateUpdateInfoSchema>;
