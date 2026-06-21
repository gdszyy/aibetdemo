import { cn } from '@/utils/common';

interface FaqQuestionBadgeProps {
    active: boolean;
}

const FaqQuestionBadge = ({ active }: FaqQuestionBadgeProps) => {
    return (
        <i
            className={cn(
                'size-7 shrink-0 flex justify-center items-center rounded-full text-neutral-white-h not-italic text-body-lg',
                active
                    ? 'bg-[linear-gradient(135deg,#FFB199_3.12%,#FF0844_96.88%)]'
                    : 'bg-[linear-gradient(135deg,#D8E9FF_3.12%,#638ABD_96.88%)]',
            )}
        >
            Q
        </i>
    );
};

export default FaqQuestionBadge;
