import React from 'react';
import RefundsTable from './RefundsTable';
import { mockRefunds } from '../data/mockRefunds';

const CustomerRefunds = ({ onShowToast }) => {
    const refunds = mockRefunds.filter(r => r.userType === 'CUSTOMER');
    return <RefundsTable refunds={refunds} title="Customer Refunds" onShowToast={onShowToast} />;
};

export default CustomerRefunds;
