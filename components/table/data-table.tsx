
"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    SortingState,
    getSortedRowModel,
    VisibilityState,
    ColumnFiltersState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import React, { useState } from "react"
import { Input } from "../ui/input"
import { useRouter, useSearchParams } from "next/navigation"



interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey: string;
    total:number;
    pageSize?:number;
    searchParams?: {
        [key: string]: string | string[] | undefined
    };
    // Replace single filterKey with array of filter configurations
    filters?: {
        key: string;
        label: string;
        options: { label: string; value: string | boolean }[];
    }[];
    // Added export options
    exportOptions?: {
        filename?: string;
        includeTimestamp?: boolean;
    };
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    filters,
    total,
    pageSize: initialPageSize = 10
}: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [sorting, setSorting] = useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    
    // Track selected filters for export description
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

    // Get page index from URL (default to 0 if not set)
    const pageIndexFromUrl = Number(searchParams.get("page")) || 0;
    const [pageIndex, setPageIndex] = useState(pageIndexFromUrl);

    // Add state for page size (default to 10)
    const [pageSize, setPageSize] = useState(initialPageSize);

    // Handle filter change for a specific filter key
    const handleFilterChange = (filterKey: string, value: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterKey]: value
        }));

        if (value === "all") {
            // Remove this filter
            setColumnFilters(prev => 
                prev.filter(filter => filter.id !== filterKey)
            );
        } else {
            // Update or add this filter
            setColumnFilters(prev => {
                const existing = prev.findIndex(filter => filter.id === filterKey);
                if (existing >= 0) {
                    const updated = [...prev];
                    updated[existing] = { id: filterKey, value };
                    return updated;
                } else {
                    return [...prev, { id: filterKey, value }];
                }
            });
        }
    }

   // Handle page changes
   const handlePaginationChange = (updater: any) => {
    const newState = typeof updater === "function" 
        ? updater({ pageIndex, pageSize })
        : updater;

    setPageIndex(newState.pageIndex);
    setPageSize(newState.pageSize);
    
    // Update URL with new page index
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', newState.pageIndex.toString());
    newSearchParams.set('limit', newState.pageSize.toString());
    
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
}


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true, 
        pageCount: Math.ceil(total / pageSize),
        filterFns: {
            exactMatch: (row, id, filterValue) => {
                return row.getValue(id) === filterValue;
            }
        },
        state: {
            sorting,
            rowSelection,
            columnFilters,
            columnVisibility,
            pagination: {
                pageIndex,
                pageSize
            }
        },
        onPaginationChange: handlePaginationChange
    })



    return (
        <div className="flex flex-col gap-2">
        {/* Search and filters section - made responsive */}
        
            <div className="w-full my-2">
                <Input
                    placeholder={`Search ...`}
                    value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(searchKey)?.setFilterValue(event.target.value)
                    }
                    className="w-full sm:max-w-sm"
                />
                
                {/* Filters in a scrollable container on mobile */}
                <div className="w-full flex flex-wrap gap-3">
                    {filters && filters.map((filter) => (
                        <div key={filter.key} className="flex items-center gap-2 min-w-fit">
                            <span className="text-sm font-medium whitespace-nowrap">{filter.label}:</span>
                            <Select 
                                value={selectedFilters[filter.key] || 'all'} 
                                onValueChange={(value) => handleFilterChange(filter.key, value)}
                            >
                                <SelectTrigger className="w-36 min-w-fit">
                                    <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {filter.options.map((option) => (
                                        <SelectItem key={option.value.toString()} value={option.value.toString()}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>
            </div>
            
        {/* Responsive table with horizontal scroll on small screens */}
        <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="whitespace-nowrap">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="max-w-xs">
                                        <div className="truncate">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
        
        {/* Improved responsive pagination controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-end sm:items-center gap-4 sm:space-x-6 lg:space-x-8 order-1 sm:order-2">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-full sm:w-auto justify-between sm:justify-center items-center">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="text-sm font-medium whitespace-nowrap px-2">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}