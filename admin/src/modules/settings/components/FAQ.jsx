import React, { useState } from 'react';
import { Plus, HelpCircle, Save, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import SettingTabs from './SettingTabs';

const FAQ = ({ onShowToast }) => {
    const [activeTab, setActiveTab] = useState('customer');
    const [expandedId, setExpandedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const [faqs, setFaqs] = useState({
        customer: [
            { id: 1, question: 'How do I track my order?', answer: 'You can track your order in real-time from the "Orders" section in the app.' },
            { id: 2, question: 'What are the payment methods available?', answer: 'We accept Credit/Debit cards, UPI, and Cash on Delivery.' }
        ],
        rider: [
            { id: 3, question: 'How do I start my shift?', answer: 'Go to the "Shift" tab and click the "Go Online" button.' }
        ],
        vendor: [
            { id: 4, question: 'How do I update menu items?', answer: 'Use the "Menu Management" section to add or disable items.' }
        ]
    });

    const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', category: 'customer' });
    const [editId, setEditId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleSave = () => {
        if (!newFAQ.question || !newFAQ.answer) {
            onShowToast('Please fill in both question and answer', 'warning');
            return;
        }
        if (editId) {
            // Edit mode
            setFaqs(prev => ({
                ...prev,
                [newFAQ.category]: prev[newFAQ.category].map(faq => faq.id === editId ? { ...faq, ...newFAQ } : faq)
            }));
            onShowToast('FAQ updated successfully');
        } else {
            // Add mode
            const faq = {
                id: Date.now(),
                ...newFAQ
            };
            setFaqs(prev => ({
                ...prev,
                [newFAQ.category]: [...prev[newFAQ.category], faq]
            }));
            onShowToast('FAQ added successfully');
        }
        setNewFAQ({ question: '', answer: '', category: activeTab });
        setEditId(null);
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setFaqs(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(f => f.id !== id)
        }));
        onShowToast('FAQ deleted', 'error');
    };

    return (
        <div className="faq-manager" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <SettingTabs activeTab={activeTab} onTabChange={setActiveTab} showAll={false} />
                <button 
                    className="btn btn-primary" 
                    onClick={() => { setNewFAQ({ question: '', answer: '', category: activeTab }); setEditId(null); setShowModal(true); }} 
                    style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <Plus size={16} /> Add FAQ
                </button>
            </div>

            <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs[activeTab].length === 0 && !showModal && (
                    <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <HelpCircle size={40} color="#94a3b8" style={{ marginBottom: '12px' }} />
                        <h3 style={{ color: '#475569', margin: 0 }}>No FAQs found</h3>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>Click the "Add FAQ" button to create one for this category.</p>
                    </div>
                )}

                {faqs[activeTab].map(item => (
                    <div key={item.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                        <div 
                            style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                            onClick={() => toggleExpand(item.id)}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 600 }}>{item.question}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            setEditId(item.id); 
                                            setNewFAQ({ question: item.question, answer: item.answer, category: activeTab }); 
                                            setShowModal(true); 
                                        }}
                                        style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                        style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                {expandedId === item.id ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
                            </div>
                        </div>
                        {expandedId === item.id && (
                            <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid #f1f5f9', animation: 'slideDown 0.3s ease' }}>
                                <p style={{ margin: '16px 0 0 0', fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <div 
                    style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        zIndex: 1000,
                        animation: 'fadeIn 0.2s ease'
                    }}
                    onClick={() => { setShowModal(false); setEditId(null); setNewFAQ({ question: '', answer: '', category: activeTab }); }}
                >
                    <div 
                        style={{ 
                            backgroundColor: 'white', 
                            borderRadius: '12px', 
                            padding: '24px', 
                            width: '90%', 
                            maxWidth: '500px', 
                            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
                            animation: 'slideUp 0.3s ease'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px' }}>{editId ? 'Edit FAQ' : 'Add New FAQ'}</h2>
                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label style={{ fontWeight: 600, color: '#334155', marginBottom: '8px', display: 'block' }}>Category</label>
                            <select 
                                className="form-control"
                                value={newFAQ.category}
                                onChange={(e) => setNewFAQ({...newFAQ, category: e.target.value})}
                                style={{ padding: '12px', borderRadius: '8px' }}
                            >
                                <option value="customer">Customer</option>
                                <option value="rider">Rider</option>
                                <option value="vendor">Vendor</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label style={{ fontWeight: 600, color: '#334155', marginBottom: '8px', display: 'block' }}>Question</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={newFAQ.question}
                                onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                                placeholder="Enter common question..."
                                style={{ padding: '12px', borderRadius: '8px' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ fontWeight: 600, color: '#334155', marginBottom: '8px', display: 'block' }}>Answer</label>
                            <textarea 
                                className="form-control"
                                value={newFAQ.answer}
                                onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                                placeholder="Provide detailed answer..."
                                style={{ padding: '12px', borderRadius: '8px', minHeight: '160px', minWidth: '100%', resize: 'vertical' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button 
                                className="btn btn-secondary" 
                                onClick={() => { setShowModal(false); setEditId(null); setNewFAQ({ question: '', answer: '', category: activeTab }); }}
                                style={{ padding: '8px 20px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: 500, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary" 
                                onClick={handleSave}
                                style={{ padding: '8px 24px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                            >
                                {editId ? 'Update FAQ' : 'Save FAQ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FAQ;
