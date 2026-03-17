import React from 'react';
import { Users, Bike, Truck, History } from 'lucide-react';

const SettingTabs = ({ activeTab, onTabChange, showAll = true }) => {
    const tabs = [
        { id: 'all', label: 'All', icon: <History size={14} />, show: showAll },
        { id: 'customer', label: 'Customers', icon: <Users size={14} />, show: true },
        { id: 'rider', label: 'Riders', icon: <Bike size={14} />, show: true },
        { id: 'vendor', label: 'Vendors', icon: <Truck size={14} />, show: true },
    ].filter(tab => tab.show);

    return (
        <div className="tab-group-pills" style={{ margin: 0 }}>
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    className={activeTab === tab.id ? 'active' : ''} 
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </div>
    );
};

export default SettingTabs;
