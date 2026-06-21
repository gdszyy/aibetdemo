'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type FunctionComponent, useState } from 'react';
import { clearCacheData } from '@/components/tanstack-provider/services/utils';
import { delay } from '@/utils/common';

const Main1: FunctionComponent = () => {
    const { data } = useQuery({
        queryKey: ['test1'],
        queryFn: async () => {
            await delay(2000);
            return Promise.resolve(new Date().toLocaleTimeString());
        },
        staleTime: 10 * 1000,
    });

    return <span>{data}</span>;
};

const App: FunctionComponent = () => {
    const [key1, setKey1] = useState(0);
    const queryClient = useQueryClient();

    return (
        <div className="flex gap-x-4 p-20 bg-[#e6e6e6]">
            <button
                type="button"
                onClick={() => {
                    setKey1(Math.random());
                }}
            >
                hello <Main1 key={key1} />
            </button>
            <button
                type="button"
                onClick={async () => {
                    clearCacheData(queryClient);
                }}
            >
                clearCacheData
            </button>
            <button
                type="button"
                onClick={async () => {
                    queryClient.removeQueries();
                }}
            >
                removeQueries
            </button>
        </div>
    );
};

export default App;
