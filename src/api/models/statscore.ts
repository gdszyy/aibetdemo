import { z } from 'zod';

export const StatscoreEventIdSchema = z.object({
    id: z.union([z.number(), z.string()]),
});

export type StatscoreEventId = z.infer<typeof StatscoreEventIdSchema>;
