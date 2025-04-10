
'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { columns } from "@/components/table/subscriptions/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import Loading from "@/components/widgets/loader";
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import { getAllSubscriptions } from "@/lib/actions/subscriptions";
import { Payment } from "@/types/location/type";
import SubscriptionAnalytics from "@/components/subscription/analytics";
import Unauthorized from "@/components/code/401";
import { FilterOption, UniversalFilters } from "@/components/filter/universalfilter";
import { DatePickerWithRange } from "@/components/widgets/date-range-picker";


const breadcrumbItems = [
  { title: "Subscriptions", link: "/subscriptions" },
]

// Define filter options as a constant or you can move this to a separate configuration file
const SUBSCRIPTION_FILTERS: FilterOption[] = [
  {
    key: "subscriptionPackageName",
    label: "Package",
    options: [
      { label: "Silver", value: "SILVER" },
      { label: "Platinum", value: "PLATINUM" },
      { label: "Diamond", value: "DIAMOND" }
    ]
  },
  {
    key: "provider",
    label: "Payment Provider",
    options: [
      { label: "Selcom", value: "selcom" },
      { label: "Settlo Cash", value: "settlo-cash" },
      {label: "Migration", value: "migration"}
    ]
  }
];

export default function Subscription() {
  const [subscriptions, setSubscriptions] = useState<Payment[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Payment[]>([])
  const [isLoading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date()
  });
  // State to track selected filters
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const fetchSubscriptions = async () => {
    try {
      const subs = await getAllSubscriptions();
      // For newest first
      const sortedSubs = subs.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
      setSubscriptions(sortedSubs);
      filterSubscriptions(subs, dateRange, selectedFilters);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const filterSubscriptions = (
    data: Payment[], 
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
        value === 'all' || sub[key as keyof Payment] === value
      );

      return isWithinDateRange && passesAdditionalFilters;
    });

    const sortedFiltered = filtered.sort((a, b) => 
      new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );

    setFilteredSubscriptions(sortedFiltered);
  }


  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    filterSubscriptions(subscriptions, dateRange, selectedFilters);
  }, [dateRange, subscriptions, selectedFilters])

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
      fallback={<Unauthorized />}>
      <div className='flex-1 space-y-2 md:p-8 pt-4 px-4'>
        <div className={`flex items-center justify-between mb-2`}>
          <div className={`relative flex-1 md:max-w-md`}>
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
          <div className="flex items-center gap-4">
            <UniversalFilters 
              filters={SUBSCRIPTION_FILTERS}
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
        </div>
        
        <SubscriptionAnalytics 
          subscriptions={subscriptions} 
          dateRange={dateRange} 
          selectedFilters={selectedFilters}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Subscriptions 
              <span className="text-sm text-muted-foreground ml-2">
                ({format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredSubscriptions}
              searchKey="locationName"
            />
          </CardContent>
        </Card>
      </div>
    </ProtectedComponent>
  );
}