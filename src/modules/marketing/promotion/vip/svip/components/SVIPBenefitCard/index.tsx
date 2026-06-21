import Image from 'next/image';
import type { FC } from 'react';

interface SVIPBenefitCardProps {
    description: string;
    icon: string;
    index: number;
    title: string;
}

export const SVIPBenefitCard: FC<SVIPBenefitCardProps> = ({ description, icon, index, title }) => {
    const displayIndex = String(index + 1).padStart(2, '0');

    return (
        <div className="group h-45 md:h-40 rounded-md md:rounded-sm bg-linear-to-br from-[#3C3C3C] to-[#533612] p-px">
            <div className="relative w-full h-full overflow-hidden rounded-md md:rounded-sm bg-[#171717] p-4 pb-8 transition-colors duration-300 ease-in-out group-hover:bg-[linear-gradient(113.87deg,#3C3C3C_-7.72%,#171717_42.32%)]">
                <span className="absolute p-1 right-4 top-4 font-roboto-flex  text-[40px] font-black italic leading-none text-neutral-white-a md:text-[48px]">
                    {displayIndex}
                </span>

                <div className="relative z-10 flex size-11 items-center justify-center rounded-sm border border-neutral-white-d bg-neutral-white-a group-hover:border-func-bonus">
                    <Image alt="" aria-hidden="true" height={24} src={icon} width={24} />
                </div>

                <div className="relative z-10 mt-4">
                    <h3 className="text-neutral-white-h text-title-sm group-hover:text-func-bonus">{title}</h3>
                    <p className="mt-1 line-clamp-3 md:line-clamp-2 text-auxiliary-sm text-filltext-ft-e">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};
