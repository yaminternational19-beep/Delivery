import React from 'react';
import TicketTable from './TicketTable';
import { mockTickets } from '../data/mockTickets';

const CustomerTickets = ({ onShowToast }) => {
    const tickets = mockTickets.filter(t => t.userType === 'CUSTOMER');
    return <TicketTable tickets={tickets} title="Customer Tickets" onShowToast={onShowToast} />;
};

export default CustomerTickets;
