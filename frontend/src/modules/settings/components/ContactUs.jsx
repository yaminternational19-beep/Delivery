import React, { useState } from 'react';
import { Save, Building2, MapPin, Globe, Map as MapIcon, Info } from 'lucide-react';

const ContactUs = ({ onShowToast }) => {
    const [contactInfo, setContactInfo] = useState({
        companyName: 'Shipzzy Logistics Corp.',
        addressLine1: '123 Delivery Street, Suite 500',
        cityStateZip: 'New York, NY 10001',
        country: 'United States',
        mapEmbedUrl: 'https://maps.google.com/maps?q=New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onShowToast('Contact Us settings updated successfully!', 'success');
    };

    return (
        <div className="settings-section contact-us-manager" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ backgroundColor: '#f5f3ff', padding: '10px', borderRadius: '10px', color: '#7c3aed' }}>
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>Contact Information</h2>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Manage your physical office location and display details</p>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={16} /> Save Changes
                </button>
            </div>
            
            <div className="settings-grid" style={{ marginTop: '24px' }}>
                <div className="form-fields-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>
                            <Building2 size={16} color="#64748b" /> Company Legal Name
                        </label>
                        <input 
                            type="text"
                            name="companyName"
                            value={contactInfo.companyName}
                            onChange={handleChange}
                            className="form-control"
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>
                            <MapPin size={16} color="#64748b" /> Address Line
                        </label>
                        <input 
                            type="text"
                            name="addressLine1"
                            value={contactInfo.addressLine1}
                            onChange={handleChange}
                            className="form-control"
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>
                            <MapPin size={16} color="#64748b" /> City, State, Zip
                        </label>
                        <input 
                            type="text"
                            name="cityStateZip"
                            value={contactInfo.cityStateZip}
                            onChange={handleChange}
                            className="form-control"
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>
                            <Globe size={16} color="#64748b" /> Country
                        </label>
                        <input 
                            type="text"
                            name="country"
                            value={contactInfo.country}
                            onChange={handleChange}
                            className="form-control"
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                </div>

                <div className="form-group full-width" style={{ marginTop: '32px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>
                        <MapIcon size={16} color="#64748b" /> Google Maps Embed URL
                    </label>
                    <input 
                        type="url"
                        name="mapEmbedUrl"
                        value={contactInfo.mapEmbedUrl}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="https://maps.google.com/..."
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                    />
                    {contactInfo.mapEmbedUrl && (
                        <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', height: '250px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <iframe 
                                src={contactInfo.mapEmbedUrl} 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                title="Map Preview"
                                loading="lazy">
                            </iframe>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#fdf4ff', borderRadius: '12px', border: '1px solid #f5d0fe', display: 'flex', gap: '12px' }}>
                    <Info size={20} color="#a21caf" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#701a75', lineHeight: '1.5' }}>
                        <strong>Note:</strong> This address is used for billing and legal purposes. It is also displayed on consumer-facing invoices and the "Contact Us" footer of the public website.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
