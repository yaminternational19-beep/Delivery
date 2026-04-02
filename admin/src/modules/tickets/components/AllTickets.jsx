import React from 'react';
import TicketTable from './TicketTable';
import { mockTickets } from '../data/mockTickets';

const AllTickets = ({ onShowToast }) => {
    return <TicketTable tickets={mockTickets} title="All Tickets" onShowToast={onShowToast} />;
};

export default AllTickets;
