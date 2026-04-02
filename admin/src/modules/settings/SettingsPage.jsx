import React, { useState } from 'react';
import Toast from '../../components/common/Toast/Toast';

import ManageContent from './components/ManageContent';
import Announcements from './components/Announcements';
import HelpSupport from './components/HelpSupport';
import FAQ from './components/FAQ';
import './Settings.css';

const SettingsPage = ({ activeTab }) => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const getTabContent = () => {
        switch (activeTab) {
            case 'manage-content':
                return {
                    title: 'Manage Content',
                    desc: 'Update platform text, terms, privacy policy, and app URLs',
                    component: <ManageContent onShowToast={showToast} />
                };
            case 'announcements':
                return {
                    title: 'Announcements',
                    desc: 'Manage global platform alert banners',
                    component: <Announcements onShowToast={showToast} />
                };
            case 'help-support':
                return {
                    title: 'Help & Support',
                    desc: 'Configure help center and emails',
                    component: <HelpSupport onShowToast={showToast} />
                };
            case 'faq':
                return {
                    title: 'FAQ Manager',
                    desc: 'Configure frequently asked questions for all user types',
                    component: <FAQ onShowToast={showToast} />
                };
            default:
                return {
                    title: 'Manage Content',
                    desc: 'Update platform text, terms, privacy policy, and app URLs',
                    component: <ManageContent onShowToast={showToast} />
                };
        }
    };

    const currentTab = getTabContent();

    return (
        <div className="settings-module management-module" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            <div className="module-intro">
                <div className="intro-content">
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{currentTab.title}</h1>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>{currentTab.desc}</p>
                </div>
            </div>

            <div className="settings-layout" style={{ display: 'block' }}>
                <div className="settings-content" style={{ width: '100%' }}>
                    {currentTab.component}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
