import React, { useState, useMemo, useEffect } from 'react';
import { 
    Megaphone, 
    Users, 
    Bike, 
    Truck, 
    Search, 
    X, 
    Plus,
    History,
    MoreVertical,
    CheckCircle2,
    Clock,
    User,
    Send,
    Filter,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2,
    RotateCcw
} from 'lucide-react';
import SettingTabs from './SettingTabs';

const Announcements = ({ onShowToast }) => {
    const [view, setView] = useState('list'); // 'list' or 'create'
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'customer', 'rider', 'vendor'
    const [activeMenu, setActiveMenu] = useState(null);
    
    // Pagination State
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0
    });

    // Broadcast State
    const [targetType, setTargetType] = useState('ALL');
    const [targetDetail, setTargetDetail] = useState('ALL');
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Notification History (Expanded for pagination)
    const [history] = useState([
        { id: '1', title: 'Weekend Promo', message: 'Enjoy 50% off on all deliveries this weekend!', targetedTo: 'All Members', date: '2024-03-15T10:00:00Z', status: 'Sent' },
        { id: '2', title: 'KYC Reminder', message: 'Please update your KYC documents by Monday.', targetedTo: 'All Vendors', date: '2024-03-14T14:30:00Z', status: 'Sent' },
        { id: '3', title: 'App Update', message: 'New version of the app is live. Please update.', targetedTo: 'John Doe (Rider)', date: '2024-03-12T09:15:00Z', status: 'Sent' },
        { id: '4', title: 'Flash Sale', message: 'Flash sale starting in 1 hour!', targetedTo: 'All Members', date: '2024-03-11T08:00:00Z', status: 'Sent' },
        { id: '5', title: 'Safety Gear', message: 'Riders, please ensure you are wearing your safety gear.', targetedTo: 'All Riders', date: '2024-03-10T11:00:00Z', status: 'Sent' },
        { id: '6', title: 'New Partner', message: 'Welcome our new partner: FreshMart!', targetedTo: 'All Members', date: '2024-03-09T16:00:00Z', status: 'Sent' },
        { id: '7', title: 'Service Interruption', message: 'Scheduled maintenance this Sunday midnight.', targetedTo: 'All Members', date: '2024-03-08T22:00:00Z', status: 'Sent' },
    ]);

    const mockEntities = {
        VENDOR: [
            { id: 'V1', name: 'Global Foods', email: 'v1@example.com' },
            { id: 'V2', name: 'Fresh Mart', email: 'v2@example.com' },
        ],
        RIDER: [
            { id: 'R1', name: 'John Doe', email: 'john@example.com' },
            { id: 'R2', name: 'Sarah Smith', email: 'sarah@example.com' },
        ],
        CUSTOMER: [
            { id: 'C1', name: 'Alice Brown', email: 'alice@example.com' },
            { id: 'C2', name: 'Bob Wilson', email: 'bob@example.com' },
        ]
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSend = () => {
        if (!title.trim() || !message.trim()) {
            onShowToast('Please enter both a title and message', 'warning');
            return;
        }
        onShowToast(`Announcement "${title}" broadcasted successfully!`, 'success');
        setMessage('');
        setTitle('');
        setView('list');
    };

    const filterHistory = () => {
        if (activeTab === 'all') return history;
        return history.filter(h => h.targetedTo.toLowerCase().includes(activeTab));
    };

    const filteredHistory = filterHistory();

    // Pagination Logic
    const paginatedHistory = useMemo(() => {
        const start = (pagination.page - 1) * pagination.limit;
        const end = start + pagination.limit;
        return filteredHistory.slice(start, end);
    }, [filteredHistory, pagination.page, pagination.limit]);

    // Update Pagination Stats
    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            total: filteredHistory.length,
            totalPages: Math.ceil(filteredHistory.length / prev.limit)
        }));
        if (pagination.page > Math.ceil(filteredHistory.length / pagination.limit) && filteredHistory.length > 0) {
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    }, [filteredHistory.length, pagination.limit]);

    const handleAction = (e, action, item) => {
        e.stopPropagation();
        setActiveMenu(null);
        if (action === 'edit') {
            setTitle(item.title);
            setMessage(item.message);
            setView('create');
            onShowToast(`Editing: ${item.title}`, 'info');
        } else if (action === 'delete') {
            onShowToast(`Announcement deleted.`, 'error');
        } else if (action === 'resend') {
            onShowToast(`Announcement resent successfully!`, 'success');
        }
    };

    const renderList = () => (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <SettingTabs activeTab={activeTab} onTabChange={setActiveTab} />
                <button 
                    className="btn btn-primary" 
                    onClick={() => { setTitle(''); setMessage(''); setView('create'); }} 
                    style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <Plus size={16} /> New Broadcast
                </button>
            </div>

            <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '400px' }}>
                {paginatedHistory.map(item => (
                    <div key={item.id} className="history-item" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'fit-content' }}>
                                <Megaphone size={24} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{item.title}</h4>
                                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#475569', lineHeight: '1.5', maxWidth: '600px' }}>{item.message}</p>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={12} color="#64748b" />
                                        </div>
                                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{item.targetedTo}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Clock size={14} color="#94a3b8" />
                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#f0fdf4', padding: '2px 10px', borderRadius: '20px', fontWeight: 700, border: '1px solid #dcfce7' }}>{item.status}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(activeMenu === item.id ? null : item.id);
                                }}
                                style={{ border: 'none', background: '#f8fafc', color: '#94a3b8', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <MoreVertical size={18} />
                            </button>
                            
                            {activeMenu === item.id && (
                                <div className="action-dropdown" style={{ 
                                    position: 'absolute', 
                                    right: 0, 
                                    top: '100%', 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '10px', 
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
                                    zIndex: 10,
                                    width: '160px',
                                    padding: '6px',
                                    marginTop: '8px',
                                    animation: 'fadeIn 0.2s ease'
                                }}>
                                    <button onClick={(e) => handleAction(e, 'edit', item)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#334155', fontWeight: 500, borderRadius: '6px', textAlign: 'left' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <Edit2 size={16} color="#64748b" /> Edit Message
                                    </button>
                                    <button onClick={(e) => handleAction(e, 'resend', item)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#334155', fontWeight: 500, borderRadius: '6px', textAlign: 'left' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <RotateCcw size={16} color="#64748b" /> Resend Push
                                    </button>
                                    <div style={{ borderTop: '1px solid #f1f5f9', margin: '6px 0' }}></div>
                                    <button onClick={(e) => handleAction(e, 'delete', item)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#ef4444', fontWeight: 600, borderRadius: '6px', textAlign: 'left' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <Trash2 size={16} color="#ef4444" /> Delete Record
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="c-pagination" style={{ borderTop: '1px solid #e2e8f0', background: '#f8fafc', padding: '20px', borderRadius: '0 0 12px 12px', marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="c-pagination-info" style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                    Showing <strong style={{ color: '#1e293b' }}>{Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}</strong> to <strong style={{ color: '#1e293b' }}>{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of <strong style={{ color: '#1e293b' }}>{pagination.total}</strong> broadcasts
                </span>
                <div className="c-pagination-btns" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        className="c-page-btn"
                        disabled={pagination.page === 1}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: pagination.page === 1 ? '#f1f5f9' : 'white', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', fontSize: '0.88rem', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'white', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-color)' }}>{pagination.page}</span>
                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>{pagination.totalPages || 1}</span>
                    </div>
                    <button
                        className="c-page-btn"
                        disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: pagination.page === pagination.totalPages ? '#f1f5f9' : 'white', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer', fontSize: '0.88rem', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderCreate = () => (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button 
                        onClick={() => setView('list')} 
                        style={{ 
                            background: '#f1f5f9', 
                            border: '1px solid #e2e8f0', 
                            color: '#475569', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    >
                        <ArrowLeft size={18} /> Back to List
                    </button>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Create New Broadcast</h2>
                </div>
                <button className="btn btn-primary" onClick={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '8px' }}>
                    <Send size={18} /> Send Announcement
                </button>
            </div>

            <div className="announcement-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="message-box">
                    <div className="form-group" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontWeight: 600, color: '#334155', marginBottom: '8px', display: 'block' }}>Broadcast Title</label>
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="e.g. Flash Sale Alert!"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ fontSize: '15px', padding: '12px', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontWeight: 600, color: '#334155', marginBottom: '8px', display: 'block' }}>Announcement Message</label>
                            <textarea 
                                className="form-control"
                                placeholder="Type your detailed message here... This will be sent as a push notification."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                style={{ flex: 1, minHeight: '300px', fontSize: '15px', padding: '20px', lineHeight: '1.6', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="target-sidebar" style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                     <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                        <Filter size={15} /> Select Audience
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <SettingTabs 
                            activeTab={targetType.toLowerCase()} 
                            onTabChange={(tab) => setTargetType(tab.toUpperCase())} 
                        />
                    </div>

                    {targetType !== 'ALL' && (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            <button className={`tab-btn ${targetDetail === 'ALL' ? 'active' : ''}`} onClick={() => setTargetDetail('ALL')} style={{ flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', border: targetDetail === 'ALL' ? '1px solid var(--primary-color)' : '1px solid #e2e8f0', backgroundColor: targetDetail === 'ALL' ? '#eff6ff' : 'white', fontWeight: 600 }}>All</button>
                            <button className={`tab-btn ${targetDetail === 'SPECIFIC' ? 'active' : ''}`} onClick={() => setTargetDetail('SPECIFIC')} style={{ flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', border: targetDetail === 'SPECIFIC' ? '1px solid var(--primary-color)' : '1px solid #e2e8f0', backgroundColor: targetDetail === 'SPECIFIC' ? '#eff6ff' : 'white', fontWeight: 600 }}>Specific</button>
                        </div>
                    )}

                    {targetDetail === 'SPECIFIC' && targetType !== 'ALL' && (
                        <div className="specific-search" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '200px' }}>
                            <div style={{ position: 'relative', borderBottom: '1px solid #f1f5f9' }}>
                                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input type="text" placeholder="Search..." style={{ width: '100%', padding: '10px 10px 10px 36px', border: 'none', fontSize: '13px', outline: 'none' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', maxHeight: '350px' }}>
                                {(mockEntities[targetType] || []).map(entity => (
                                    <div 
                                        key={entity.id} 
                                        onClick={() => setSelectedEntity(entity)} 
                                        style={{ 
                                            padding: '12px', 
                                            fontSize: '13px', 
                                            cursor: 'pointer', 
                                            borderBottom: '1px solid #f8fafc',
                                            backgroundColor: selectedEntity?.id === entity.id ? '#f0f4ff' : 'transparent',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={(e) => !selectedEntity || selectedEntity.id !== entity.id ? e.currentTarget.style.backgroundColor = '#f8fafc' : null}
                                        onMouseOut={(e) => !selectedEntity || selectedEntity.id !== entity.id ? e.currentTarget.style.backgroundColor = 'transparent' : null}
                                    >
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{entity.name}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>{entity.id} • {entity.email}</div>
                                    </div>
                                ))}
                                {/* Mocking more items for scroll behavior test */}
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <div key={i} style={{ padding: '12px', fontSize: '13px', borderBottom: '1px solid #f8fafc', opacity: 0.5 }}>
                                        <div style={{ fontWeight: 600 }}>Mock User {i + 4}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '11px' }}>ID: USER_{100 + i}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Summary</h4>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                            <CheckCircle2 size={14} style={{ color: '#22c55e', marginRight: '6px', verticalAlign: 'middle' }} />
                            {targetDetail === 'ALL' ? `Broadcast to All ${targetType === 'ALL' ? 'Members' : targetType + 's'}` : `Message to: ${selectedEntity?.name || '...'}`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="announcements-container">
            {view === 'list' ? renderList() : renderCreate()}
        </div>
    );
};

export default Announcements;
