'use client';

import { useEffect } from 'react';
import { MatchStatus } from '@/api/models/match';
import { useTopSports } from '@/hooks/use-sports';
import { useRouter } from '@/i18n';

export default function LiveSportsEntryPage() {
    const router = useRouter();

    const sports = useTopSports();

    useEffect(() => {
        if (!sports) return;
        const sportId = sports[0]?.sport_id;

        if (sportId != null) {
            router.replace(`/sports/${sportId}?status=${MatchStatus.Live}`);
        } else {
            router.replace('/sports');
        }
    }, [sports, router]);

    return null;
}
