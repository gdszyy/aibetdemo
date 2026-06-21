'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { GetCasinoGameLobbiesV2Interface } from '@/api/handlers/casino';
import { useRouter } from '@/i18n';

export default function CasinoPage() {
    const router = useRouter();

    const { data: lobbies } = useQuery({
        queryKey: ['casino', 'lobbies'],
        queryFn: GetCasinoGameLobbiesV2Interface,
    });

    useEffect(() => {
        if (!lobbies) return;
        const firstLobbyId = lobbies[0]?.id;

        if (firstLobbyId != null) {
            router.replace(`/casino/${firstLobbyId}`);
        } else {
            router.replace('/sports');
        }
    }, [lobbies, router]);

    return null;
}
