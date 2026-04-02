import React from 'react';
import TicketTable from './TicketTable';
import { mockTickets } from '../data/mockTickets';

const VendorTickets = ({ onShowToast }) => {
    const tickets = mockTickets.filter(t => t.userType === 'VENDOR');
    return <TicketTable tickets={tickets} title="Vendor Tickets" onShowToast={onShowToast} />;
};

export default VendorTickets;
