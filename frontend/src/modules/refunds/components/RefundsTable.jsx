import React, { useState } from 'react';
import { Search, Filter, Eye, X, CheckCircle, XCircle, ChevronLeft, ChevronRight, Square, CheckSquare, Calendar } from 'lucide-react';
import ExportActions from '../../../components/common/ExportActions';

const RefundsTable = ({ refunds, title, onShowToast }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [actionModal, setActionModal] = useState({ open: false, refund: null });
    const [adminNotes, setAdminNotes] = useState('');
    const [localRefunds, setLocalRefunds] = useState(refunds);
    
    // Pagination & Selection State
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRefunds, setSelectedRefunds] = useState([]);
    const itemsPerPage = 8;

    const filteredRefunds = localRefunds.filter(r => {
        const matchesSearch = (r.userName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                              (r.id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                              (r.orderId?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                              (r.userId?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter ? r.status === statusFilter : true;
        
        let matchesDate = true;
        if (fromDate) {
            matchesDate = matchesDate && new Date(r.date) >= new Date(fromDate);
        }
        if (toDate) {
            matchesDate = matchesDate && new Date(r.date) <= new Date(toDate);
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRefunds.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= (totalPages || 1)) {
            setCurrentPage(page);
        }
    };

    // Selection logic
    const allSelectedInCurrentPage = currentItems.length > 0 && currentItems.every(r => selectedRefunds.includes(r.id));

    const handleSelectAll = () => {
        if (allSelectedInCurrentPage) {
            setSelectedRefunds(prev => prev.filter(id => !currentItems.find(r => r.id === id)));
        } else {
            const currentIds = currentItems.map(r => r.id);
            setSelectedRefunds(prev => [...new Set([...prev, ...currentIds])]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedRefunds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleViewAction = (refund) => {
        setActionModal({ open: true, refund });
        setAdminNotes(refund.adminNotes || '');
    };

    const handleProcessRefund = (statusAction) => {
        if (statusAction !== 'Pending' && !adminNotes.trim()) {
            onShowToast('Please provide admin notes before approving or rejecting.', 'warning');
            return;
        }

        setLocalRefunds(prev => prev.map(r => {
            if (r.id === actionModal.refund.id) {
                return {
                    ...r,
                    status: statusAction,
                    adminNotes
                };
            }
            return r;
        }));

        onShowToast(`Refund ${statusAction} successfully!`, 'success');
        setActionModal({ open: false, refund: null });
    };

    const handleExport = (message, type) => {
        onShowToast(message, type);
    };

    const handleDownload = (type) => {
        onShowToast(`Downloading ${selectedRefunds.length} refunds as ${type.toUpperCase()}...`, 'success');
    };

    return (
        <div className="c-table-container">
            <div className="v-table-controls">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="c-search">
                            <Search className="search-icon" size={16} />
                            <input
                                type="text"
                                placeholder="Search Refunds..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        
                        <div className="input-with-icon" style={{ width: '150px' }}>
                            <Filter size={15} className="field-icon" />
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="filter-select"
                                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#f8fafc', fontSize: '0.9rem' }}
                            >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="date-filter-group" style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--border-color)', height: '42px' }}>
                            <Calendar size={15} color="#94a3b8" />
                            <input 
                                type="date" 
                                value={fromDate} 
                                onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
                                style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', color: '#475569', outline: 'none' }}
                            />
                            <span style={{ color: '#cbd5e1' }}>-</span>
                            <input 
                                type="date" 
                                value={toDate} 
                                onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }}
                                style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', color: '#475569', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {selectedRefunds.length > 0 && (
                            <div style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: 700 }}>
                                {selectedRefunds.length} items selected
                            </div>
                        )}
                        <ExportActions 
                            selectedCount={selectedRefunds.length} 
                            onExport={handleExport}
                            onDownload={handleDownload}
                        />
                    </div>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="dashboard-table" style={{ minWidth: '1300px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '48px', textAlign: 'center' }}>
                                <div onClick={handleSelectAll} style={{ cursor: 'pointer', display: 'inline-flex' }}>
                                    {allSelectedInCurrentPage ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} color="#94a3b8" />}
                                </div>
                            </th>
                            <th>Refund ID</th>
                            <th>Reference ID</th>
                            <th>User Name / ID</th>
                            <th>User Type</th>
                            <th>User Contact</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date Requested</th>
                            <th className="col-actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(refund => (
                            <tr key={refund.id} className={selectedRefunds.includes(refund.id) ? 'selected-row' : ''}>
                                <td style={{ textAlign: 'center' }}>
                                    <div onClick={() => handleSelectOne(refund.id)} style={{ cursor: 'pointer', display: 'inline-flex' }}>
                                        {selectedRefunds.includes(refund.id) ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} color="#94a3b8" />}
                                    </div>
                                </td>
                                <td><span style={{ fontWeight: 700, color: '#1e293b' }}>{refund.id}</span></td>
                                <td><span style={{ color: '#475569', fontSize: '13px', fontWeight: 600 }}>{refund.orderId}</span></td>
                                <td>
                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{refund.userName}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>{refund.userId}</div>
                                </td>
                                <td>
                                    <span style={{ 
                                        padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                                        background: refund.userType === 'VENDOR' ? '#eff6ff' : refund.userType === 'RIDER' ? '#f0fdf4' : '#fdf2f8',
                                        color: refund.userType === 'VENDOR' ? '#2563eb' : refund.userType === 'RIDER' ? '#166534' : '#db2777',
                                        border: `1px solid ${refund.userType === 'VENDOR' ? '#dbeafe' : refund.userType === 'RIDER' ? '#dcfce7' : '#fce7f3'}`
                                    }}>
                                        {refund.userType}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.82rem' }}>{refund.userPhone}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '1px' }}>{refund.userEmail}</div>
                                </td>
                                <td><span style={{ fontWeight: 700, color: '#0f172a' }}>${refund.amount.toFixed(2)}</span></td>
                                <td>
                                    <span className={`status-badge ${refund.status === 'Approved' ? 'status-approved' : refund.status === 'Rejected' ? 'status-blocked' : 'status-pending'}`}>
                                        {refund.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{new Date(refund.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>{new Date(refund.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </td>
                                <td className="col-actions">
                                    <button 
                                        onClick={() => handleViewAction(refund)}
                                        style={{ backgroundColor: 'white', color: '#334155', border: '1px solid #cbd5e1', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                                    >
                                        <Eye size={14} /> Action
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredRefunds.length === 0 && (
                            <tr>
                                <td colSpan="10" className="text-center p-4" style={{ color: '#94a3b8', textAlign: 'center', padding: '60px' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>No Refunds Found</div>
                                    <p style={{ fontSize: '0.9rem' }}>Try adjusting your filters or search terms.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="c-pagination">
                <span className="c-pagination-info">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRefunds.length)} of {filteredRefunds.length} entries
                </span>
                <div className="c-pagination-btns">
                    <button 
                        className="c-page-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={14} /> Prev
                    </button>
                    
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                style={{ 
                                    width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                    backgroundColor: currentPage === i + 1 ? 'var(--primary-color)' : 'white',
                                    color: currentPage === i + 1 ? 'white' : '#64748b',
                                    fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </span>

                    <button 
                        className="c-page-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Action Modal */}
            {actionModal.open && actionModal.refund && (
                <div className="modal-overlay">
                    <div className="modal-content admin-form-modal" style={{ maxWidth: '500px', width: '90%' }}>
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Refund Request Actions</h2>
                            <button className="close-btn" onClick={() => setActionModal({ open: false, refund: null })}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div>
                                        <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Refund ID</span>
                                        <strong style={{ fontSize: '15px' }}>{actionModal.refund.id}</strong>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Amount</span>
                                        <strong style={{ fontSize: '18px', color: '#0f172a' }}>${actionModal.refund.amount.toFixed(2)}</strong>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>User</span>
                                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{actionModal.refund.userName}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{actionModal.refund.userId}</div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Reference</span>
                                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{actionModal.refund.orderId}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(actionModal.refund.date).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Reason given</span>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.5', padding: '10px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                        {actionModal.refund.reason}
                                    </p>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#334155' }}>Admin Notes (Required for Action)</label>
                                <textarea 
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Enter your notes or justification here..."
                                    disabled={actionModal.refund.status !== 'Pending'}
                                    style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px', backgroundColor: actionModal.refund.status !== 'Pending' ? '#f1f5f9' : 'white' }}
                                />
                            </div>
                            
                            {actionModal.refund.status !== 'Pending' && (
                                <div style={{ marginTop: '12px', padding: '10px', borderRadius: '6px', backgroundColor: actionModal.refund.status === 'Approved' ? '#ecfdf5' : '#fef2f2', border: `1px solid ${actionModal.refund.status === 'Approved' ? '#a7f3d0' : '#fecaca'}`, color: actionModal.refund.status === 'Approved' ? '#065f46' : '#991b1b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {actionModal.refund.status === 'Approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                    This refund has been {actionModal.refund.status.toLowerCase()}.
                                </div>
                            )}
                        </div>
                        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
                            <button className="btn btn-secondary" onClick={() => setActionModal({ open: false, refund: null })}>Close</button>
                            {actionModal.refund.status === 'Pending' && (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button 
                                        className="btn btn-danger" 
                                        onClick={() => handleProcessRefund('Rejected')}
                                    >
                                        Reject Request
                                    </button>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={() => handleProcessRefund('Approved')}
                                    >
                                        Approve Refund
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RefundsTable;
