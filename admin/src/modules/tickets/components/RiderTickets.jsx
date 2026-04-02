import React from 'react';
import TicketTable from './TicketTable';
import { mockTickets } from '../data/mockTickets';

const RiderTickets = ({ onShowToast }) => {
    const tickets = mockTickets.filter(t => t.userType === 'RIDER');
    return <TicketTable tickets={tickets} title="Rider Tickets" onShowToast={onShowToast} />;
};

export default RiderTickets;
