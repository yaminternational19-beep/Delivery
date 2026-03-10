import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportBrandsToPDF = (brands) => {
    const doc = new jsPDF("landscape");

    // Header
    doc.setFontSize(18);
    doc.text("Brands Report Export", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 30);

    const tableColumn = [
        "Brand ID", "Brand Name", "Category", "Sub-Category", "Description", "Status", "Added Date"
    ];

    const tableRows = [];

    brands.forEach(brand => {
        const brandData = [
            brand.brand_code || brand.id || "-",
            brand.name || "-",
            brand.category || "-",
            brand.subCategory || "-",
            brand.description || "-",
            brand.status || "-",
            brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : "-"
        ];
        tableRows.push(brandData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 38,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { top: 35 }
    });

    doc.save(`Brands_Report_${new Date().getTime()}.pdf`);
};

export const exportBrandsToExcel = (brands) => {
    const exportData = brands.map(brand => ({
        "Brand ID": brand.brand_code || brand.id || "-",
        "Brand Name": brand.name || "-",
        "Category": brand.category || "-",
        "Sub-Category": brand.subCategory || "-",
        "Description": brand.description || "-",
        "Logo URL": brand.logo || "-",
        "Status": brand.status || "-",
        "Added Date": brand.createdAt ? new Date(brand.createdAt).toLocaleString() : "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    // Adjust column widths
    const columnWidths = [
        { wch: 15 }, // Brand ID
        { wch: 25 }, // Brand Name
        { wch: 25 }, // Category
        { wch: 25 }, // Sub-Category
        { wch: 45 }, // Description
        { wch: 50 }, // Logo URL
        { wch: 15 }, // Status
        { wch: 25 }  // Added Date
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Brands_Data");

    XLSX.writeFile(workbook, `Brands_Export_${new Date().getTime()}.xlsx`);
};
