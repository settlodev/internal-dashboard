'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { columns } from "@/components/table/location/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAllLocation } from "@/lib/actions/location";
import { Location } from "@/types/location/type";
import { useEffect, useState } from "react";
import Loading from "@/components/widgets/loader";
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import LocationsAnalyticsDashboard from "@/components/location/location-summary";
import Unauthorized from "@/components/code/401";
import { FilterOption, UniversalFilters } from "@/components/filter/universalfilter";
import { DatePickerWithRange } from "@/components/widgets/date-range-picker";

const breadcrumbItems = [
  { title: "Locations", link: "/locations" },
]

const LOCATION_FILTERS: FilterOption[] = [
  {
    key: "locationBusinessTypeName",
    label: "Business Type",
    options: [
      { label: "Retail", value: "Retail" },
      { label: "Hospitality", value: "Hospitality" }
    ]
  },
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
export default function Dashboard() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setLoading] = useState(true);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date()
  });
  // State to track selected filters
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const fetchBusinessLocations = async () => {
    try {
      const location = await fetchAllLocation()
      const sortedLocations = location.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
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

  // Handle filter changes
  const handleFilterChange = (filterKey: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
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
      requiredPermission="view:locations"
      loading={
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      }
      fallback={
        <Unauthorized />
      }>
      <div className="flex-1 space-y-2 md:p-8 pt-4">
        <div className="flex flex-col  justify-between mb-2 gap-3">
          <div className="relative flex-1 md:max-w-md pl-2">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
          <div className="flex  justify-between gap-4">
            <UniversalFilters
              filters={LOCATION_FILTERS}
              onFilterChange={handleFilterChange}
              selectedFilters={selectedFilters}
            />
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
          </div>
          <LocationsAnalyticsDashboard
            locations={filteredLocations}

          />

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