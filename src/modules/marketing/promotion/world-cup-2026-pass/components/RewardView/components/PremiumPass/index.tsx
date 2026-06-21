import Image from 'next/image';
import type { FC } from 'react';
import { cn } from '@/utils/common';
import FreeCard from '../../../../assets/free-card.png';
import HighLevelTreasure from '../../../../assets/high-level-treasure.png';
import PremiumCard from '../../../../assets/premium-card.png';
import PremiumCardLocked from '../../../../assets/premium-card-locked.png';
import Treasure from '../../../../assets/treasure.png';
import { PolygonIcon } from '../../../Polygon';

interface PremiumPassProps {
    isHighLevel: boolean;
    className?: string;
    currentLevel?: number | null;
    showCurrentLevel?: boolean;
}

export const PremiumPass: FC<PremiumPassProps> = ({
    isHighLevel,
    className,
    currentLevel,
    showCurrentLevel = false,
}) => {
    return (
        <div className={cn('flex flex-col gap-4 items-center', className)}>
            <div
                className="w-31 h-38.5 rounded-xs overflow-hidden"
                style={{
                    backgroundImage: `url(${FreeCard.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="relative h-8 w-31 flex justify-center items-center">
                <div className="z-10">
                    <PolygonIcon isHighLevel={isHighLevel} isUnlocked>
                        {showCurrentLevel && currentLevel ? (
                            currentLevel
                        ) : (
                            <Image
                                src={isHighLevel ? HighLevelTreasure.src : Treasure.src}
                                className="w-4 h-4"
                                alt="Treasure Icon"
                                width={16}
                                height={16}
                            />
                        )}
                    </PolygonIcon>
                </div>
                <div
                    className={cn(
                        'absolute w-18.5 h-1 left-15.5 top-3.5',
                        currentLevel ? (isHighLevel ? 'bg-[#009655]' : 'bg-brand-primary-4') : 'bg-[#A6A6A6]',
                    )}
                />
            </div>
            <div
                className="w-31 h-38.5 rounded-xs overflow-hidden flex justify-center items-center"
                style={{
                    backgroundImage: `url(${isHighLevel ? PremiumCard.src : PremiumCardLocked.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
        </div>
    );
};
