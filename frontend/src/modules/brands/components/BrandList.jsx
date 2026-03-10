import React, { useState } from 'react';
import {
    Search, Filter, ListTree,
    CheckSquare, Square, ChevronLeft, ChevronRight, Layers
} from 'lucide-react';
import ActionButtons from '../../../components/common/ActionButtons';
import ExportActions from '../../../components/common/ExportActions';
import { exportBrandsToPDF, exportBrandsToExcel } from '../services/export.service';

const BrandList = ({
    brands = [],
    categories = [],
    subCategories = [],
    pagination = null,
    loading = false,
    onEdit,
    onDelete,
    onToggleStatus,
    onRefresh,
    showToast
}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [subCategoryFilter, setSubCategoryFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // ── Helpers ──────────────────────────────────────────────────
    // Use == (loose) because API returns numeric IDs but select stores strings
    // eslint-disable-next-line eqeqeq
    const getCategoryName = (catId) => {
        // eslint-disable-next-line eqeqeq
        const cat = categories.find(c => c.id == catId);
        return cat ? cat.name : catId || '-';
    };

    const getSubCategoryName = (scId) => {
        // eslint-disable-next-line eqeqeq
        const sc = subCategories.find(s => s.id == scId);
        return sc ? sc.name : scId || '-';
    };

    // Sub-categories filtered by selected category — use == to handle number vs string
    const filteredSubCatOptions = subCategories.filter(sc =>
        // eslint-disable-next-line eqeqeq
        categoryFilter === 'All' || sc.categoryId == categoryFilter
    );

    // ── Selection ─────────────────────────────────────────────────
    const toggleSelectAll = () => {
        if (selectedRows.length === brands.length && brands.length > 0) {
            setSelectedRows([]);
        } else {
            setSelectedRows(brands.map(b => b.id));
        }
    };

    const toggleSelectRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    // ── API-driven handlers  ───────────────────────────────────────
    const handlePageChange = (newPage) => {
        onRefresh({
            page: newPage,
            search: searchQuery,
            status: statusFilter === 'All' ? '' : statusFilter,
            categoryId: categoryFilter === 'All' ? '' : categoryFilter,
            subCategoryId: subCategoryFilter === 'All' ? '' : subCategoryFilter
        });
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        onRefresh({
            page: 1,
            search: value,
            status: statusFilter === 'All' ? '' : statusFilter,
            categoryId: categoryFilter === 'All' ? '' : categoryFilter,
            subCategoryId: subCategoryFilter === 'All' ? '' : subCategoryFilter
        });
    };

    const handleStatusFilter = (e) => {
        const value = e.target.value;
        setStatusFilter(value);
        onRefresh({
            page: 1,
            search: searchQuery,
            status: value === 'All' ? '' : value,
            categoryId: categoryFilter === 'All' ? '' : categoryFilter,
            subCategoryId: subCategoryFilter === 'All' ? '' : subCategoryFilter
        });
    };

    const handleCategoryFilter = (e) => {
        const value = e.target.value;
        setCategoryFilter(value);
        setSubCategoryFilter('All');
        onRefresh({
            page: 1,
            search: searchQuery,
            status: statusFilter === 'All' ? '' : statusFilter,
            categoryId: value === 'All' ? '' : value,
            subCategoryId: ''
        });
    };

    const handleSubCategoryFilter = (e) => {
        const value = e.target.value;
        setSubCategoryFilter(value);
        onRefresh({
            page: 1,
            search: searchQuery,
            status: statusFilter === 'All' ? '' : statusFilter,
            categoryId: categoryFilter === 'All' ? '' : categoryFilter,
            subCategoryId: value === 'All' ? '' : value
        });
    };

    // ── Export ────────────────────────────────────────────────────
    const handleExportDownload = (type) => {
        const selectedData = brands.filter(b => selectedRows.includes(b.id));

        if (selectedData.length === 0) {
            showToast('Please select at least one record to export', 'warning');
            return;
        }

        try {
            if (type === 'pdf') {
                exportBrandsToPDF(selectedData);
                showToast(`Exported ${selectedData.length} records as PDF successfully!`, 'success');
            } else if (type === 'excel') {
                exportBrandsToExcel(selectedData);
                showToast(`Exported ${selectedData.length} records as Excel successfully!`, 'success');
            }
        } catch (error) {
            console.error('Export Error:', error);
            showToast('Failed to generate export file. Please try again.', 'error');
        }
    };

    return (
        <div className="brand-table-container">

            {/* ── Controls Bar ── */}
            <div className="brand-table-controls">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>

                    {/* Search */}
                    <div className="brand-search">
                        <Search className="search-icon" size={16} />
                        <input
                            type="text"
                            placeholder="Search by brand name or ID..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="input-with-icon" style={{ width: '190px' }}>
                        <Layers size={15} className="field-icon" />
                        <select
                            value={categoryFilter}
                            onChange={handleCategoryFilter}
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sub-Category Filter */}
                    <div className="input-with-icon" style={{ width: '190px' }}>
                        <ListTree size={15} className="field-icon" />
                        <select
                            value={subCategoryFilter}
                            onChange={handleSubCategoryFilter}
                            disabled={categoryFilter === 'All'}
                        >
                            <option value="All">All Sub-Categories</option>
                            {filteredSubCatOptions.map(sc => (
                                <option key={sc.id} value={sc.id}>{sc.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="input-with-icon" style={{ width: '150px' }}>
                        <Filter size={15} className="field-icon" />
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilter}
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Export */}
                <ExportActions
                    selectedCount={selectedRows.length}
                    onExport={showToast}
                    onDownload={handleExportDownload}
                />
            </div>

            {/* ── Bulk Selection Bar ── */}
            {selectedRows.length > 0 && (
                <div className="c-bulk-bar">
                    <span>
                        {selectedRows.length} {selectedRows.length === 1 ? 'brand' : 'brands'} selected
                    </span>
                    <button onClick={() => setSelectedRows([])}>Clear Selection</button>
                </div>
            )}

            {/* ── Table ── */}
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th style={{ width: '48px' }}>
                            <div
                                onClick={toggleSelectAll}
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                {selectedRows.length === brands.length && brands.length > 0
                                    ? <CheckSquare size={17} color="var(--primary-color)" />
                                    : <Square size={17} color="#94a3b8" />
                                }
                            </div>
                        </th>
                        <th style={{ width: '60px' }}>Logo</th>
                        <th>Brand ID</th>
                        <th>Brand Name</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                Loading...
                            </td>
                        </tr>
                    ) : brands.length === 0 ? (
                        <tr>
                            <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                No brands found.
                            </td>
                        </tr>
                    ) : (
                        brands.map((item) => (
                            <tr
                                key={item.id}
                                className={selectedRows.includes(item.id) ? 'selected-row' : ''}
                            >
                                {/* Checkbox */}
                                <td>
                                    <div
                                        onClick={() => toggleSelectRow(item.id)}
                                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                        {selectedRows.includes(item.id)
                                            ? <CheckSquare size={17} color="var(--primary-color)" />
                                            : <Square size={17} color="#94a3b8" />
                                        }
                                    </div>
                                </td>

                                {/* Logo */}
                                <td>
                                    <div className="category-icon-box" style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.logo
                                            ? <img src={item.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : '🏷️'
                                        }
                                    </div>
                                </td>

                                {/* Brand ID */}
                                <td>
                                    <span className="cat-id-badge">{item.brand_code || item.id}</span>
                                </td>

                                {/* Brand Name */}
                                <td>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontWeight: 700,
                                        fontSize: '0.88rem',
                                        color: '#6d28d9',
                                        background: '#ede9fe',
                                        padding: '3px 10px',
                                        borderRadius: '20px',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {item.name}
                                    </span>
                                </td>

                                {/* Category */}
                                <td>
                                    <span style={{
                                        display: 'inline-block',
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        color: '#1d4ed8',
                                        background: '#dbeafe',
                                        padding: '3px 10px',
                                        borderRadius: '20px',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {item.category || getCategoryName(item.categoryId)}
                                    </span>
                                </td>

                                {/* Sub Category */}
                                <td>
                                    <span style={{
                                        display: 'inline-block',
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        color: '#0f766e',
                                        background: '#ccfbf1',
                                        padding: '3px 10px',
                                        borderRadius: '20px',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {item.subCategory || getSubCategoryName(item.subCategoryId) || '-'}
                                    </span>
                                </td>

                                {/* Description */}
                                <td>
                                    <div style={{
                                        fontSize: '0.82rem',
                                        color: '#64748b',
                                        maxWidth: '200px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: '1.45',
                                        wordBreak: 'break-word'
                                    }}>
                                        {item.description || '-'}
                                    </div>
                                </td>

                                {/* Status */}
                                <td>
                                    <span className={`badge ${item.status === 'Active' ? 'success' : 'error'}`}>
                                        {item.status}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td>
                                    <ActionButtons
                                        onEdit={() => onEdit?.(item)}
                                        onToggleStatus={() => onToggleStatus?.(item)}
                                        onDelete={() => onDelete?.(item)}
                                        isActive={item.status === 'Active'}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* ── Pagination ── */}
            {pagination && (
                <div className="c-pagination">
                    <span className="c-pagination-info">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.totalRecords)} of{' '}
                        {pagination.totalRecords} brands
                    </span>
                    <div className="c-pagination-btns">
                        <button
                            className="c-page-btn"
                            disabled={!pagination.hasPrevPage}
                            onClick={() => handlePageChange(pagination.page - 1)}
                        >
                            <ChevronLeft size={14} /> Prev
                        </button>
                        <button
                            className="c-page-btn"
                            disabled={!pagination.hasNextPage}
                            onClick={() => handlePageChange(pagination.page + 1)}
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BrandList;
