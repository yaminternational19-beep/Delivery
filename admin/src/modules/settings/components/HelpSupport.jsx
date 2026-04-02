import React, { useState } from 'react';
import { Save, Mail, Phone, Clock, LifeBuoy, User, Plus } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import SettingTabs from './SettingTabs';
import ActionButtons from '../../../components/common/ActionButtons';

const HelpSupport = ({ onShowToast }) => {
    const [activeTab, setActiveTab] = useState('customer');
    
    const [supportData, setSupportData] = useState({
        customer: [
            { name: 'Customer Support', email: 'support@shipzzy.com', phone: '+1-800-555-0199', workingHours: 'Mon-Sat, 9:00 AM - 6:00 PM EST' }
        ],
        rider: [
            { name: 'Rider Support', email: 'riders@shipzzy.com', phone: '+1-800-555-0200', workingHours: '24/7 Priority Support' }
        ],
        vendor: [
            { name: 'Vendor Support', email: 'partners@shipzzy.com', phone: '+1-800-555-0300', workingHours: 'Mon-Fri, 10:00 AM - 7:00 PM EST' }
        ]
    });

    const handleChange = (idx, field, value) => {
        setSupportData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map((entry, i) =>
                i === idx ? { ...entry, [field]: value } : entry
            )
        }));
    };
    const handleAddInfo = () => {
        setSupportData(prev => ({
            ...prev,
            [activeTab]: [
                ...prev[activeTab],
                { name: '', email: '', phone: '', workingHours: '' }
            ]
        }));
    };

    const handleDelete = (idx) => {
        setSupportData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter((_, i) => i !== idx)
        }));
        onShowToast(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} support entry removed`, 'info');
    };

    const handleSave = () => {
        onShowToast(`Support settings for ${activeTab.toUpperCase()} updated!`, 'success');
    };

    const currentInfo = supportData[activeTab];

    return (
        <div className="settings-section help-support-manager" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <SettingTabs activeTab={activeTab} onTabChange={setActiveTab} showAll={false} />
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleAddInfo} 
                        style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                        <Plus size={16} /> Add info
                    </button>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleSave} 
                        style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
            <div className="settings-grid">
                {currentInfo.map((entry, idx) => (
                    <div key={idx} style={{ marginBottom: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ padding: '12px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fcfcfd' }}>
                            <h4 style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: 600 }}>{activeTab.toUpperCase()} SUPPORT RECORD #{idx + 1}</h4>
                            <ActionButtons 
                                onDelete={idx === 0 ? null : () => handleDelete(idx)}
                            />
                        </div>
                        <div className="form-fields-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', padding: '24px' }}>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>
                                    <User size={16} color="#64748b" /> Name
                                </label>
                                <input 
                                    type="text"
                                    value={entry.name}
                                    onChange={e => handleChange(idx, 'name', e.target.value)}
                                    className="form-control"
                                    placeholder="Support Name"
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>
                                    <Mail size={16} color="#64748b" /> Email
                                </label>
                                <input 
                                    type="email"
                                    value={entry.email}
                                    onChange={e => handleChange(idx, 'email', e.target.value)}
                                    className="form-control"
                                    placeholder="support@domain.com"
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontWeight: 600,
                                        color: '#334155',
                                        marginBottom: '10px'
                                    }}
                                >
                                    <Phone size={16} color="#64748b" /> Mobile Number
                                </label>

                                <PhoneInput
                                    country={'in'}
                                    value={entry.phone}
                                    onChange={(value) => handleChange(idx, 'phone', value)}
                                    enableSearch={true}
                                    containerClass="mobile-phone-input"
                                    inputClass="phone-field"
                                    buttonClass="country-dropdown-btn"
                                    dropdownClass="country-dropdown-list"
                                    placeholder="Enter phone number"
                                    inputStyle={{
                                        width: '100%',
                                        height: '44px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1'
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>
                                    <Clock size={16} color="#64748b" /> Working Hours
                                </label>
                                <input 
                                    type="text"
                                    value={entry.workingHours}
                                    onChange={e => handleChange(idx, 'workingHours', e.target.value)}
                                    className="form-control"
                                    placeholder="e.g. 24/7 or specific hours"
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <div style={{ marginTop: '0', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '10px', color: '#0ea5e9', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <LifeBuoy size={20} />
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                        These support details will be displayed specifically to <strong>{activeTab}s</strong> in their mobile app's help section.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
