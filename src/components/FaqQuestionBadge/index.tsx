import { cn } from '@/utils/common';

interface FaqQuestionBadgeProps {
    active: boolean;
}

const FaqQuestionBadge = ({ active }: FaqQuestionBadgeProps) => {
    return (
        <i
            className={cn(
                'size-7 shrink-0 flex justify-center items-center rounded-full not-italic text-body-lg',
                active ? 'bg-brand-primary-0 text-on-brand' : 'bg-surface-selected text-content-primary',
            )}
        >
            Q
        </i>
    );
};

export default FaqQuestionBadge;
