"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

export interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string | boolean }[];
}

interface UniversalFiltersProps {
  filters: FilterOption[];
  onFilterChange: (key: string, value: string) => void;
  selectedFilters?: Record<string, string>;
}

export function UniversalFilters({ 
  filters, 
  onFilterChange, 
  selectedFilters = {} 
}: UniversalFiltersProps) {
  return (
    <div className="hidden lg:flex flex-wrap items-center gap-3 w-full">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-2">
          <span className="text-sm font-medium whitespace-nowrap">{filter.label}:</span>
          <Select 
            value={selectedFilters[filter.key] || 'all'} 
            onValueChange={(value) => onFilterChange(filter.key, value)}
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
  );
}