'use client';

import type { FC } from 'react';
import { IconButton } from '@/components/icon-button';
import { Fold, Unfold } from '@/components/icons';

interface CollapseToggleButtonProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

/**
 * Stacked-arrow button for toggling global collapse state.
 * Used in TournamentShell, MatchListShell, MatchDetail.
 */
export const CollapseToggleButton: FC<CollapseToggleButtonProps> = ({ isCollapsed, onToggle }) => {
    return (
        <IconButton icon={isCollapsed ? Unfold : Fold} size="lg" shape="square" variant="solid" onClick={onToggle} />
    );
};
