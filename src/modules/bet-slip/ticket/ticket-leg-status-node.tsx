'use client';

import type { FC } from 'react';
import { match } from 'ts-pattern';
import { cn } from '@/utils/common';
import { TicketDisplayStatus } from './ticket.types';

interface TicketLegStatusNodeOptions {
    /** 串关票整体状态，影响 pending-in-lost 等特殊节点样式 */
    cardStatus?: TicketDisplayStatus;
    /** 是否存在未结算腿（混合 pending 卡） */
    hasPendingSelection?: boolean;
}

/** 赢单勾选图标（与 ParlayLeg 一致） */
const CheckIcon: FC = () => (
    <svg className="shrink-0" width="8" height="7" viewBox="0 0 8.183 6.469" fill="none">
        <path
            d="M0.7 3.984L3.08 5.769M3.144 5.762L7.483 0.7"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
        />
    </svg>
);

/** 输单叉号图标 */
const CrossIcon: FC = () => (
    <svg className="shrink-0" width="7" height="7" viewBox="0 0 7.209 7.4" fill="none">
        <path d="M6.509 6.7L0.7 0.7M0.7 6.7L6.508 0.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

/** 待结算弧形图标 */
const PendingCircleIcon: FC = () => (
    <svg className="shrink-0 animate-spin" width="8" height="8" viewBox="0 0 8 8.00001" fill="none">
        <path
            d="M7.334 3.153c.3-.077.609.105.642.412.077.7-.032 1.412-.321 2.061A4 4 0 11.733 1.692c.518-.734 1.269-1.272 2.13-1.527a3.95 3.95 0 012.086-.051c.3.073.44.403.326.69a.65.65 0 01-.744-.636 3.95 3.95 0 00-1.349-.085c-.446.084-.868.306-1.188.635A3.05 3.05 0 001.124 4.151c.034.646.285 1.262.711 1.748a3.05 3.05 0 004.796-.299c.187-.42.27-.875.245-1.328-.017-.31.158-.614.458-.69z"
            fill="currentColor"
        />
    </svg>
);

/** 走水空心圆图标 */
const VoidCircleIcon: FC = () => (
    <svg className="shrink-0" width="8" height="8" viewBox="0 0 8 8" fill="none">
        <circle cx="4" cy="4" r="3.35" stroke="currentColor" strokeWidth="1.3" />
    </svg>
);

/** 半赢短横线图标 */
const DashIcon: FC = () => (
    <svg className="shrink-0" width="6" height="2" viewBox="0 0 6 2" fill="none">
        <path d="M1 1H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

const getTicketLegStatusNodeContext = (
    status: TicketDisplayStatus,
    options?: TicketLegStatusNodeOptions,
): { isPendingInLostCard: boolean; isLossInMixedPendingCard: boolean } => {
    const cardStatus = options?.cardStatus;
    const hasPendingSelection = options?.hasPendingSelection ?? false;
    const isPendingInLostCard = cardStatus === TicketDisplayStatus.Lost && status === TicketDisplayStatus.Pending;
    const isLoss = status === TicketDisplayStatus.Lost || status === TicketDisplayStatus.HalfLost;
    const isLossInMixedPendingCard = cardStatus === TicketDisplayStatus.Lost && hasPendingSelection && isLoss;

    return { isPendingInLostCard, isLossInMixedPendingCard };
};

/** 时间轴节点内图标（Open / Settled 串关腿复用） */
export const TicketLegStatusIcon: FC<{
    status: TicketDisplayStatus;
    cardStatus?: TicketDisplayStatus;
    hasPendingSelection?: boolean;
}> = ({ status, cardStatus, hasPendingSelection }) => {
    const { isPendingInLostCard } = getTicketLegStatusNodeContext(status, { cardStatus, hasPendingSelection });

    return match({ status, isPendingInLostCard })
        .with({ isPendingInLostCard: true }, () => <div className="size-2 rounded-full bg-func-void" />)
        .with({ status: TicketDisplayStatus.Pending }, () => <PendingCircleIcon />)
        .with({ status: TicketDisplayStatus.Void }, () => <VoidCircleIcon />)
        .with({ status: TicketDisplayStatus.Won }, () => <CheckIcon />)
        .with({ status: TicketDisplayStatus.HalfWon }, () => <DashIcon />)
        .with({ status: TicketDisplayStatus.Lost }, () => <CrossIcon />)
        .with({ status: TicketDisplayStatus.HalfLost }, () => <CrossIcon />)
        .with({ status: TicketDisplayStatus.Crediting }, () => <PendingCircleIcon />)
        .exhaustive();
};

/** 时间轴圆点节点（规则弹窗 Contribution 行复用） */
export const TicketLegStatusNode: FC<{
    status: TicketDisplayStatus;
    cardStatus?: TicketDisplayStatus;
    hasPendingSelection?: boolean;
    className?: string;
}> = ({ status, cardStatus, hasPendingSelection, className }) => {
    const { isPendingInLostCard, isLossInMixedPendingCard } = getTicketLegStatusNodeContext(status, {
        cardStatus,
        hasPendingSelection,
    });

    const nodeClassName = match({ status, isPendingInLostCard })
        .with({ status: TicketDisplayStatus.Won }, () => 'border-func-win bg-surface-1 text-func-win')
        .with({ status: TicketDisplayStatus.HalfWon }, () => 'border-func-win bg-surface-1 text-func-win')
        .with({ status: TicketDisplayStatus.Lost }, () =>
            cn(
                'border-func-lost',
                isLossInMixedPendingCard
                    ? 'bg-func-lost-solid text-neutral-white-h shadow-[0_0_4px_var(--func-lost)]'
                    : 'bg-surface-1 text-func-lost',
            ),
        )
        .with({ status: TicketDisplayStatus.HalfLost }, () =>
            cn(
                'border-func-lost/75',
                isLossInMixedPendingCard
                    ? 'bg-surface-1 text-func-lost shadow-[0_0_4px_var(--func-lost)]'
                    : 'bg-surface-1 text-func-lost',
            ),
        )
        .with({ status: TicketDisplayStatus.Void }, () => 'border-func-void bg-surface-1 text-func-void')
        .with(
            { status: TicketDisplayStatus.Pending, isPendingInLostCard: false },
            () => 'border-func-pending bg-surface-1 text-func-pending',
        )
        .with(
            { status: TicketDisplayStatus.Pending, isPendingInLostCard: true },
            () => 'border-func-void bg-surface-1 text-func-void',
        )
        .with({ status: TicketDisplayStatus.Crediting }, () => 'border-func-pending bg-surface-1 text-func-pending')
        .exhaustive();

    return (
        <div
            className={cn(
                'flex size-5 shrink-0 items-center justify-center overflow-clip rounded-full border-[0.25px]',
                nodeClassName,
                className,
            )}
        >
            <TicketLegStatusIcon status={status} cardStatus={cardStatus} hasPendingSelection={hasPendingSelection} />
        </div>
    );
};
