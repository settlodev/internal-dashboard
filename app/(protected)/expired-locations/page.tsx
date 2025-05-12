'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { columns } from "@/components/table/location/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAllLocation } from "@/lib/actions/location";
import { Location } from "@/types/location/type";
import { useEffect,useMemo,useState } from "react";
import Loading from "@/components/widgets/loader";
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import Unauthorized from "@/components/code/401";
import { FilterOption } from "@/components/filter/universalfilter";
import { DatePickerWithRange } from "@/components/widgets/date-range-picker";
import { useExportColumns } from "@/hooks/useExportColumns";
import { ExportButton } from "@/components/export/export-button";

const breadcrumbItems = [
  { title: "Locations", link: "/locations" },
]

const LOCATION_FILTERS: FilterOption[] = [
  
  {
    key: "subscriptionStatus",
    label: "Subscription Status",
    options: [
      { label: "Trial", value: "TRIAL" },
      { label: "Expired", value: "EXPIRED" },
      { label: "Active", value: "OK" },
      { label: "Pending", value: "PENDING" },
      { label: "Due", value: "DUE" },
      { label: "Almost Due", value: "ALMOST_DUE" }
    ]
  },
];
export default function ExpiredLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setLoading] = useState(true);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date()
  });
  // State to track selected filters
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  
  // Use our hook to get export columns
  const exportColumns = useExportColumns(columns);
  
  // Calculate summary statistics for export
  const summaryData = useMemo(() => {
    if (!filteredLocations.length) return { total: 0 };
    
  
    // Count locations by subscription status
    const bySubscriptionStatus = filteredLocations.reduce((acc, location) => {
      const status = location.subscriptionStatus || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: filteredLocations.length,
      bySubscriptionStatus,
      expiredSubscriptions: bySubscriptionStatus.EXPIRED || 0
    };
  }, [filteredLocations]);

  const fetchBusinessLocations = async () => {
    try {
      const location = await fetchAllLocation()
      const expiredLocations = location.filter(loc => loc.subscriptionStatus === 'EXPIRED');
      const sortedLocations = expiredLocations.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());
      console.log(sortedLocations)
      setLocations(sortedLocations)
    } catch (error) {
      throw error
    }
    finally {
      setLoading(false)
    }
  }

  const filterLocations = (
    data: Location[],
    range: { from: Date; to: Date },
    filters: Record<string, string>
  ) => {
    const filtered = data.filter(sub => {
      // Date range filter
      const isWithinDateRange =
        new Date(sub.dateCreated) >= range.from &&
        new Date(sub.dateCreated) <= range.to;

      // Additional filters
      const passesAdditionalFilters = Object.entries(filters).every(([key, value]) =>
        value === 'all' || sub[key as keyof Location] === value
      );

      return isWithinDateRange && passesAdditionalFilters;
    });

    setFilteredLocations(filtered);
  }

  useEffect(() => {
    fetchBusinessLocations()
  }, [])

  useEffect(() => {
    filterLocations(locations, dateRange, selectedFilters);
  }, [dateRange, locations, selectedFilters])

  const handleDateRangeChange = (newRange: { from: Date; to: Date }) => {
    setDateRange(newRange);
  }


  const getFilterDescription = () => {
    const activeFilters = Object.entries(selectedFilters)
      .filter(([_, value]) => value !== 'all')
      .map(([key, value]) => {
        const filterDef = LOCATION_FILTERS.find(f => f.key === key);
        const optionLabel = filterDef?.options.find(o => o.value.toString() === value)?.label;
        return `${filterDef?.label || key}: ${optionLabel || value}`;
      });
    
    // Add date range to filter description
    const dateRangeStr = `Date: ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`;
    
    return [...activeFilters, dateRangeStr].join(', ');
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">
          <Loading />
        </div>
      </div>
    );
  }
  return (
    <ProtectedComponent 
        requiredPermissions={['view:locations']}
      loading={
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      }
      fallback={
        <Unauthorized />
      }>
      <div className="flex-1 space-y-2 md:p-8 pt-4 pb-4">
        <div className="flex flex-col  justify-between mb-2 gap-3">
          <div className="relative flex-1 md:max-w-md pl-2">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
          <div className="flex  justify-between gap-4">

            <h3 className="font-semibold">List of Locations Expired</h3>
          <div className="flex justify-end gap-2">
           <DatePickerWithRange
              value={{
                from: dateRange.from,
                to: dateRange.to
              }}
              onChange={(newRange) => {
                if (newRange?.from && newRange?.to) {
                  handleDateRangeChange({ from: newRange.from, to: newRange.to });
                }
              }}
            />
             <ProtectedComponent 
        requiredPermissions={['export:report']}>
           <ExportButton 
              data={filteredLocations}
              columns={exportColumns}
              exportOptions={{
                filename: "Locations Report",
                includeTimestamp: true,
              }}
              filterDescription={getFilterDescription()}
              summaryData={{
                total: summaryData.total,
                "Expired Subscriptions": summaryData.expiredSubscriptions,
                
              }}
            />
            </ProtectedComponent>
          </div>
          </div>
           {/* For standalone usage */}
          
         

        </div>

        <Card className="w-full">
          <CardContent>

            <DataTable
              columns={columns}
              data={filteredLocations}
              searchKey="name"
            />
          </CardContent>
        </Card>
      </div>
    </ProtectedComponent>
  );
}