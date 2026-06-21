import type { Metadata } from 'next';
import { BetHistory } from '@/modules/transaction/betHistory';

export async function generateMetadata(): Promise<Metadata> {
    return { title: 'Mis Apuestas' };
}

export default function SportsMyBetsPage() {
    return (
        <section className="min-h-[calc(100vh-100px)] bg-filltext-ft-b px-3 py-4 text-filltext-ft-h md:px-4">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
                <div className="flex h-[75px] items-center justify-between rounded-sm bg-[#252525] px-4">
                    <div>
                        <h1 className="text-title-md font-bold">Mis Apuestas</h1>
                        <p className="mt-1 text-body-sm text-filltext-ft-f">Historial de apuestas</p>
                    </div>
                </div>
                <BetHistory />
            </div>
        </section>
    );
}
