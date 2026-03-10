import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

const BrandForm = ({ initialData, categories = [], subCategories = [], onCancel, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        subCategoryId: '',
        description: '',
        status: 'Active'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Filter sub-categories based on selected category
    // Use == (loose equality) because the API returns categoryId as a number
    // but the select element stores values as strings.
    const filteredSubCats = subCategories.filter(
        // eslint-disable-next-line eqeqeq
        sc => !formData.categoryId || sc.categoryId == formData.categoryId
    );

    useEffect(() => {
        if (initialData) {
            // Normalise IDs to strings so <select value={...}> matches <option value="..."> correctly.
            // The API can return numeric IDs but HTMLSelectElement always compares as strings.
            const catId = initialData.categoryId != null ? String(initialData.categoryId) : '';
            const subCatId = initialData.subCategoryId != null ? String(initialData.subCategoryId) : '';

            setFormData({
                name: initialData.name || '',
                categoryId: catId,
                subCategoryId: subCatId,
                description: initialData.description || '',
                status: initialData.status || 'Active'
            });

            // Show existing logo on edit
            if (initialData.logo) {
                setImagePreview(initialData.logo);
            }
        } else {
            // Reset form when switching to Add mode
            setFormData({ name: '', categoryId: '', subCategoryId: '', description: '', status: 'Active' });
            setImageFile(null);
            setImagePreview(null);
            setErrors({});
        }
    }, [initialData]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Brand name is required';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await onSave({ ...formData, imageFile });
        } catch {
            // error handled in parent
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="cat-modal-overlay">
            <div className="cat-modal-card">

                {/* Header */}
                <div className="cat-modal-header">
                    <h3>{initialData ? 'Edit Brand' : 'Add New Brand'}</h3>
                    <button className="icon-btn-sm" onClick={onCancel}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="cat-modal-body">

                        {/* Category */}
                        <div className="cat-form-group">
                            <label>Category <span style={{ color: '#ef4444' }}>*</span></label>
                            <select
                                className={`cat-input${errors.categoryId ? ' input-error' : ''}`}
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subCategoryId: '' })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    // Always use String() so the value matches string-based formData.categoryId
                                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
                        </div>

                        {/* Sub Category */}
                        <div className="cat-form-group">
                            <label>Sub Category</label>
                            <select
                                className="cat-input"
                                value={formData.subCategoryId}
                                onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                                disabled={!formData.categoryId}
                            >
                                <option value="">Select Sub Category</option>
                                {filteredSubCats.map(sc => (
                                    // Always use String() so the value matches string-based formData.subCategoryId
                                    <option key={sc.id} value={String(sc.id)}>{sc.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Brand Name */}
                        <div className="cat-form-group">
                            <label>Brand Name <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="text"
                                className={`cat-input${errors.name ? ' input-error' : ''}`}
                                placeholder="e.g. Apple, Nike"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>

                        {/* Logo Upload */}
                        <div className="cat-form-group">
                            <label>Brand Logo</label>
                            <div className="cat-upload-zone">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                />
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Logo Preview"
                                        className="cat-upload-preview"
                                    />
                                ) : (
                                    <div className="cat-upload-icon-wrapper">
                                        <Upload size={20} color="var(--primary-color)" />
                                    </div>
                                )}
                                <span className="cat-upload-text">
                                    {imagePreview ? 'Click to change logo' : 'Upload brand logo or icon'}
                                </span>
                                <span className="cat-upload-hint">SVG, PNG, JPG (max 2MB)</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="cat-form-group">
                            <label>Brand Description</label>
                            <textarea
                                className="cat-input"
                                rows="2"
                                placeholder="Brief details about the brand..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Status */}
                        <div className="cat-form-group">
                            <label>Status</label>
                            <div className="cat-status-group">
                                <label className="cat-status-option">
                                    <input
                                        type="radio"
                                        name="brandStatus"
                                        value="Active"
                                        checked={formData.status === 'Active'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    />
                                    Active
                                </label>
                                <label className="cat-status-option">
                                    <input
                                        type="radio"
                                        name="brandStatus"
                                        value="Inactive"
                                        checked={formData.status === 'Inactive'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    />
                                    Inactive
                                </label>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="cat-modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Brand'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default BrandForm;
