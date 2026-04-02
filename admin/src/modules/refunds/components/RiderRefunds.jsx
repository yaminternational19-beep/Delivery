import React from 'react';
import RefundsTable from './RefundsTable';
import { mockRefunds } from '../data/mockRefunds';

const RiderRefunds = ({ onShowToast }) => {
    const refunds = mockRefunds.filter(r => r.userType === 'RIDER');
    return <RefundsTable refunds={refunds} title="Rider Refunds" onShowToast={onShowToast} />;
};

export default RiderRefunds;
