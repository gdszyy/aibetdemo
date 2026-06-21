interface ChampionHandicapSectionTitleProps {
    title: string;
    subtitle?: string;
}

export const ChampionHandicapSectionTitle = ({ title, subtitle }: ChampionHandicapSectionTitleProps) => (
    <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 px-5">
            <div className="size-2 shrink-0 rounded-full bg-(--ch-green)" />
            <h2 className="text-headline-sm text-filltext-ft-h">{title}</h2>
            <div className="size-2 shrink-0 rounded-full bg-(--ch-green)" />
        </div>
        {subtitle && <p className="mt-1 text-body-sm text-filltext-ft-f">{subtitle}</p>}
    </div>
);
