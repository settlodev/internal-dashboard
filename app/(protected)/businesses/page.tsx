'use client'
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import BusinessSummary from "@/components/business/business-summary";
import Unauthorized from "@/components/code/401";
import { FilterOption, UniversalFilters } from "@/components/filter/universalfilter";
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { columns } from "@/components/table/business/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent} from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/widgets/date-range-picker";
import Loading from "@/components/widgets/loader";
import { fetchAllBusiness } from "@/lib/actions/business";
import { Business } from "@/types/business/types";
import { useEffect, useState } from "react";

const breadcrumbItems = [
    { title: "Businesses", link: "/businesses" },
]

const BUSINESS_FILTERS: FilterOption[] = [
  {
    key: "businessTypeName",
    label: "Business Type",
    options: [
      { label: "Retail", value: "Retail" },
      { label: "Hospitality", value: "Hospitality" },
    ]
  },
];
export default function Dashboard() {
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date()
  });
  // State to track selected filters
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
const fetchBusinessTypes = async () => {
  try {
    const businessList = await fetchAllBusiness()
    const sortedBusinesses = businessList.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
    setBusinesses(sortedBusinesses)
    
  } catch (error) {
    throw error
  }
  finally {
    setIsLoading(false);
  }

}

const filterBusinesses = (
  data: Business[],
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
      value === 'all' || sub[key as keyof Business] === value
    );

    return isWithinDateRange && passesAdditionalFilters;
  });

  setFilteredBusinesses(filtered);
}

useEffect(() => {
  fetchBusinessTypes()
},[])

useEffect(() => {
  filterBusinesses(businesses, dateRange, selectedFilters);
}, [dateRange, businesses, selectedFilters])

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
       requiredPermission="view:businesses"
       loading={
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      }
       fallback={<Unauthorized />}
        >
         <div className="flex-1 space-y-2 md:p-8 pt-4">
            <div className="flex flex-col items-start justify-between mb-2">
                <div className="relative flex-1 md:max-w-md pl-2">
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
                <div className="flex  justify-between gap-4 mt-3">
            <UniversalFilters
              filters={BUSINESS_FILTERS}
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

            <BusinessSummary businesses={filteredBusinesses}/>
            </div>
            <Card>
                <CardContent>
                    <DataTable 
                    columns={columns}
                    data={filteredBusinesses}
                    searchKey="name"
                    />
                </CardContent>
            </Card>
        </div>
       </ProtectedComponent>
    );
}