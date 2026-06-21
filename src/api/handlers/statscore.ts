import { uofFetcher } from '@/api/client';
import { type StatscoreEventId, StatscoreEventIdSchema } from '@/api/models/statscore';

export interface GetStatscoreEventIdParams {
    event_id: string;
}

/** Get the real STATSCORE event id for a match event_id. */
export const GetStatscoreEventIdInterface = (params: GetStatscoreEventIdParams) => {
    return uofFetcher.get<StatscoreEventId>('/v1/ls/livescorepro', params, {
        withAuth: false,
        schema: StatscoreEventIdSchema,
        label: 'GetStatscoreEventId',
    });
};
