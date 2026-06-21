import type { FC } from 'react';
import { match } from 'ts-pattern';
import { BetType } from '@/api/models/cart';
import type { OutcomeModel } from '@/api/models/market';
import type { Order } from '@/api/models/order';
import { useIsDesktop } from '@/hooks/use-media-query';
import { getUniqueSelectionId } from '@/modules/bet-slip/_logic/cart-sync';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { DRAWER_CARD_WIDTH } from '../_constants/constants';
import { ParlayTicket } from './parlay-ticket';
import { Ticket } from './ticket';

export interface TicketContainerProps {
    order: Order;
}

export const TicketContainer: FC<TicketContainerProps> = ({ order }) => {
    const isDesktop = useIsDesktop();

    return (
        <div
            className="mx-auto flex w-full flex-col gap-2"
            style={{
                width: isDesktop ? DRAWER_CARD_WIDTH : '100%',
            }}
        >
            {match(order.bet_type)
                .with(BetType.Single, () =>
                    order.selections.map((selection) => {
                        return (
                            <Ticket
                                key={getUniqueSelectionId({
                                    eventId: selection.event_id,
                                    marketId: parseInt(selection.market_id, 10),
                                    productId: selection.product,
                                    specifiers: selection.specifiers,
                                    outcome: {
                                        id: selection.outcome_id,
                                    } as OutcomeModel,
                                } as OddsEntity)}
                                data={selection}
                                order={order}
                            />
                        );
                    }),
                )
                .otherwise(() => (
                    <ParlayTicket key={order.bet_id} order={order} />
                ))}
        </div>
    );
};
