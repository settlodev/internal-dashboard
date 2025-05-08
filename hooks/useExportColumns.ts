// hooks/useExportColumns.ts
import { ColumnDef } from "@tanstack/react-table";

interface ExportColumn {
  id: string;
  header: string;
  accessorKey?: string;
  format?: (value: any) => string;
  skip?: boolean;
}

export function useExportColumns<T>(columns: ColumnDef<T, any>[]): ExportColumn[] {
  // Map table columns to export columns
  return columns
    .filter(col => {
      const id = String(col.id || '');
      // Skip select and actions columns
      return id !== 'select' && id !== 'actions';
    })
    .map(column => {
      // Get the accessorKey from the column definition
      const accessorKey = 'accessorKey' in column ? column.accessorKey : undefined;
      const id = String(accessorKey || column.id || '');
      const headerValue = column.header;
      
      // Get header text for different header types
      let headerText = id;
      if (typeof headerValue === 'string') {
        headerText = headerValue;
      } else if (column.id === 'name') {
        headerText = 'Business Location';
      }

      // Create format function for date fields
      let format;
      if (id.includes('date') || id.includes('Date')) {
        format = (value: any) => {
          if (!value) return '';
          try {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });
          } catch (e) {
            return String(value);
          }
        };
      }

      // Modified export hook for the "name" column
      if (id === 'name') {
        format = (value: any, row?: any) => {
          // When exporting to PDF, we need to ensure we're accessing businessName correctly
          if (row && row.businessName) {
            // Direct access if available
            return `${row.businessName}\n${row.name || value}`;
          } else if (row && row.original && row.original.businessName) {
            // Access via row.original structure
            return `${row.original.businessName}\n${row.original.name}`;
          } else if (typeof value === 'object' && value && value.businessName) {
            // Access if value itself is an object containing businessName
            return `${value.businessName}\n${value.name}`;
          }
          // Fallback to just the location name
          return String(value || '');
        };
      }

      return {
        id,
        header: headerText,
        accessorKey: accessorKey as string,
        format
      };
    });
}