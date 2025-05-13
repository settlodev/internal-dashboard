'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { columns } from "@/components/table/location/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAllLocation } from "@/lib/actions/location";
import { Location } from "@/types/location/type";
import { useEffect, useMemo, useState } from "react";
import Loading from "@/components/widgets/loader";
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import Unauthorized from "@/components/code/401";
import { DatePickerWithRange } from "@/components/widgets/date-range-picker";
import { useExportColumns } from "@/hooks/useExportColumns";
import { ExportButton } from "@/components/export/export-button";
import { Alert, AlertDescription } from "@/components/ui/alert";


const breadcrumbItems = [
  { title: "Almost Due Locations", link: "/almost-due-locations" },
];

// Default date range - last 30 days to today
const getDefaultDateRange = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  
  return {
    from: thirtyDaysAgo,
    to: today
  };
};

export default function AlmostDueLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  
  // Use our hook to get export columns
  const exportColumns = useExportColumns(columns);
  
  // Fetch locations with proper error handling
  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allLocations = await fetchAllLocation();
      // Filter for almost due locations
      const almostDueLocations = allLocations
        .filter(loc => loc.subscriptionStatus === 'ALMOST_DUE')
        .sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());
      
      setLocations(almostDueLocations);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      setError("Failed to load locations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered locations based on date range
  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      const creationDate = new Date(location.dateCreated);
      return creationDate >= dateRange.from && creationDate <= dateRange.to;
    });
  }, [locations, dateRange]);
  
  // Calculate summary statistics for export
  const summaryData = useMemo(() => {
    return {
      total: filteredLocations.length,
      almostDueSubscriptions: filteredLocations.length,
    };
  }, [filteredLocations]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDateRangeChange = (newRange: { from: Date; to: Date }) => {
    if (newRange?.from && newRange?.to) {
      setDateRange({ from: newRange.from, to: newRange.to });
    }
  };

  const getFilterDescription = () => {
    return `Subscription Status: Almost Due, Date: ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <ProtectedComponent 
      requiredPermissions={['view:locations']}
      loading={<div className="flex items-center justify-center"><Loading /></div>}
      fallback={<Unauthorized />}>
      <div className="flex-1 space-y-4 md:p-8 pt-4 pb-4">
        <div className="flex flex-col gap-4">
          <div className="relative flex-1 md:max-w-md pl-2">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <h3 className="text-xl font-semibold">Locations with Almost Due Subscriptions</h3>
            <div className="flex flex-col md:flex-row gap-2">
              <DatePickerWithRange
                value={dateRange}
                onChange={(newRange) => {
                  if (newRange?.from && newRange?.to) {
                    handleDateRangeChange({ from: newRange.from, to: newRange.to });
                  }
                }}
              />
              <ProtectedComponent requiredPermissions={['export:report']}>
                <ExportButton 
                  data={filteredLocations}
                  columns={exportColumns}
                  exportOptions={{
                    filename: "Almost Due Locations Report",
                    includeTimestamp: true,
                  }}
                  filterDescription={getFilterDescription()}
                  summaryData={{
                    total: summaryData.total,
                    "Almost Due Subscriptions": summaryData.almostDueSubscriptions,
                  }}
                />
              </ProtectedComponent>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && filteredLocations.length === 0 && (
          <Alert>
            <AlertDescription>
              No almost due locations found for the selected date range.
            </AlertDescription>
          </Alert>
        )}

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