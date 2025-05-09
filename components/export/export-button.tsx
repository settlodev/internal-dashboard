// components/export/export-button.tsx
'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { useState } from "react";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

interface CompanyDetails {
  name: string;
  address: string[];
  taxInfo?: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
}

interface ReportSummary {
  title: string;
  items: Array<{
    label: string;
    value: string | number;
  }>;
}

interface ExportOptions {
  filename?: string;
  includeTimestamp?: boolean;
  companyDetails?: CompanyDetails;
  reportSummary?: ReportSummary;
  footerText?: string;
}

interface Column {
  id: string;
  header: string;
  accessorKey?: string;
  cell?: (props: any) => any;
  skip?: boolean;
  format?: (value: any) => string;
}

interface ExportButtonProps<T> {
  data: T[];
  columns: Column[];
  exportOptions?: ExportOptions;
  filterDescription?: string;
  summaryData?: {
    total: number;
    [key: string]: any;
  };
}

// Default company details
const DEFAULT_COMPANY = {
  name: "Settlo Technologies Ltd",
  address: [
    "8th Floor Noble Centre Building, Bagamoyo Road",
    "Dar es Salaam, Tanzania"
  ],
  taxInfo: "TAX IDENTIFICATION NUMBER (TIN): 153-112-053",
  contact: {
    phone: "+255 788 000 000",
    email: "accounts@settlo.co.tz",
    website: "www.settlo.co.tz"
  }
};

// Default footer text
const DEFAULT_FOOTER = "Kindly examine this report carefully. Any discrepancies must be reported to Settlo Technologies Ltd as soon as possible contact details/information (tech@settlo.co.tz). Please note that the information reflected could change without prior notice.";

export function ExportButton<T>({
  data,
  columns,
  exportOptions = { 
    filename: "export", 
    includeTimestamp: true,
    companyDetails: DEFAULT_COMPANY,
    footerText: DEFAULT_FOOTER
  },
  filterDescription = "",
  summaryData
}: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);
  
  // Use provided company details or defaults
  const companyDetails = exportOptions.companyDetails || DEFAULT_COMPANY;
  const footerText = exportOptions.footerText || DEFAULT_FOOTER;

  const getFilename = () => {
    const { filename, includeTimestamp } = exportOptions;
    const timestamp = includeTimestamp ? `-${new Date().toISOString().split('T')[0]}` : '';
    return `${filename}${timestamp}`;
  };

  // Helper function to format date values consistently
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Get value from row based on column definition
  const getCellValue = (row: T, column: Column): string => {
    // Skip certain columns
    if (column.skip || column.id === 'select' || column.id === 'actions') {
      return '';
    }
    
    const key = column.accessorKey || column.id;
    let value = key ? row[key as keyof T] : '';
    
    // Handle date fields
    if (key && ['dateCreated', 'subscriptionStartDate', 'subscriptionEndDate', 'date'].some(datefield => 
      key.toLowerCase().includes(datefield.toLowerCase()))) {
      return formatDate(value as string);
    }
    
    // Handle complex cells with special formatting
    if (column.format) {
      return column.format(value);
    }
    
    // Special case for business location with nested values
    if (key === 'name' && (row as any).businessName) {
      return `${(row as any).businessName}\n${value}`;
    }
    
    // Handle different types of values
    if (value === null || value === undefined) return '';
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    
    return String(value);
  };

  const getExportColumns = () => {
    return columns.filter(col => 
      col.id !== 'select' && 
      col.id !== 'actions' && 
      !col.skip
    );
  };

  const exportToCsv = async () => {
    try {
      setIsExporting(true);
      
      // Get only exportable columns
      const exportColumns = getExportColumns();
      
      // Prepare headers
      const headers = exportColumns.map(col => col.header);
      
      // Format data for CSV
      const csvData = data.map(row => 
        exportColumns.map(col => getCellValue(row, col))
      );
      
      // Create CSV content
      const csv = Papa.unparse({
        fields: headers,
        data: csvData
      });
      
      // Create Blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${getFilename()}.csv`);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPdf = async () => {
    try {
      setIsExporting(true);
      
      // Create new PDF document (landscape for more column space)
      const doc = new jsPDF({ orientation: 'landscape' });
      
      // Set fonts for better appearance
      doc.setFont("helvetica");
      
      // Add company details (left side)
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(companyDetails.name, 14, 15);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      
      let yPos = 20;
      companyDetails.address.forEach(line => {
        doc.text(line, 14, yPos);
        yPos += 5;
      });
      
      if (companyDetails.taxInfo) {
        doc.text(companyDetails.taxInfo, 14, yPos);
        yPos += 7;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text("Contact", 14, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 5;
      
      doc.text(`Phone: ${companyDetails.contact.phone}`, 14, yPos);
      yPos += 5;
      doc.text(`Email: ${companyDetails.contact.email}`, 14, yPos);
      yPos += 5;
      doc.text(`Website: ${companyDetails.contact.website}`, 14, yPos);
      
      // Add report title and summary (right side)
      const pageWidth = doc.internal.pageSize.width;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Location Report", pageWidth - 90, 15);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, pageWidth - 90, 22);
      
      if (filterDescription) {
        doc.text(`${filterDescription}`, pageWidth - 90, 29);
      }
      
      doc.text(`Total Locations: ${data.length}`, pageWidth - 90, 36);
      
      // Add custom summary data if provided
      if (summaryData) {
        let summaryYPos = 43;
        Object.entries(summaryData).forEach(([key, value]) => {
          if (key !== 'total') { // Skip the 'total' which we already displayed
            doc.text(`${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: ${value}`, pageWidth - 90, summaryYPos);
            summaryYPos += 7;
          }
        });
      }
      
      // Draw horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(14, 55, pageWidth - 14, 55);
      
      // Get only exportable columns
      const exportColumns = getExportColumns();
      
      // Prepare table headers and data
      const headers = exportColumns.map(col => col.header);
      const pdfData = data.map(row => 
        exportColumns.map(col => getCellValue(row, col))
      );
      
      // Generate table with improved formatting
      autoTable(doc, {
        head: [headers],
        body: pdfData,
        startY: 60,
        styles: { 
          fontSize: 9, 
          cellPadding: 3,
          overflow: 'linebreak', // Use linebreak instead of ellipsize for better text fitting
          cellWidth: 'wrap'
        },
        headStyles: { 
          fillColor: [66, 66, 66],
          valign: 'middle', // Center vertical alignment for headers
          halign: 'center'  // Center horizontal alignment for headers
        },
        columnStyles: {
          // Adjust column widths based on content type
          // Wider columns for text, narrower for dates and numbers
          0: { cellWidth: 'auto' }, // Business name
          1: { cellWidth: 35 },     // Email
          2: { cellWidth: 30 },     // Phone
          3: { cellWidth: 20 },     // Business Type
          4: { cellWidth: 20 },     // Subscription Status
          5: { cellWidth: 20 },     // Date columns
          6: { cellWidth: 20 },     // Date columns
          7: { cellWidth: 20 }      // Date columns
        },
        didDrawPage: () => {
          // Page numbers at bottom right
          doc.setFontSize(8);
          doc.text(
            `Page ${doc.getNumberOfPages()}`,
            doc.internal.pageSize.width - 20, 
            doc.internal.pageSize.height - 10
          );
          
          // Footer note at bottom center
          if (footerText) {
            const splitFooter = doc.splitTextToSize(
              footerText, 
              doc.internal.pageSize.width - 80
            );
            
            doc.setFontSize(8);
            doc.text(
              splitFooter,
              doc.internal.pageSize.width / 2,
              doc.internal.pageSize.height - 20,
              { align: 'center' }
            );
          }
          
          // Draw line above footer
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.5);
          doc.line(
            14, 
            doc.internal.pageSize.height - 25, 
            doc.internal.pageSize.width - 14, 
            doc.internal.pageSize.height - 25
          );
        },
        margin: { top: 60, bottom: 30 }
      });
      
      // Save PDF
      doc.save(`${getFilename()}.pdf`);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1"
          disabled={isExporting || data.length === 0}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCsv}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPdf}>
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}