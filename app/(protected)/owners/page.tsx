'use client'
import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { columns } from '@/components/table/owners/column'
import { DataTable } from '@/components/table/data-table'
import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { Owner } from '@/types/owners/type'
import { fetchAllBusinessOwners } from '@/lib/actions/business-owners'
import Loading from '@/components/widgets/loader'
import { ProtectedComponent } from '@/components/auth/protectedComponent'
import Unauthorized from '@/components/code/401'
import BusinessOwnerSummary from '@/components/owners/business-owner-summary'
import { DatePickerWithRange } from '@/components/widgets/date-range-picker'
import { FilterOption, UniversalFilters } from '@/components/filter/universalfilter'


const breadcrumbItems = [
  { title: "Business owners", link: "/owners" },
]

const BUSINESS_OWNER_FILTERS: FilterOption[] = [
  {
    key: "isMigrated",
    label: "Migrated",
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ]
  },
  {
    key: "gender",
    label: "Gender",
    options: [
      { label: "Male", value: "MALE" },
      { label: "Female", value: "FEMALE" },
      { label: "Undisclosed", value: "UNDISCLOSED" }
    ]
  }
];

export default function page() {
  const [businessOwners, setBusinessOwners] = useState<Owner[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [filteredBusinessOwners, setFilteredBusinessOwners] = useState<Owner[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date()
  });
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const fetchBusinessOwners = async () => {
    try {
      const data = await fetchAllBusinessOwners()
      // const owners = data.filter(user => user.isOwner === true);
      const sortedOwners = data.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());

      setBusinessOwners(sortedOwners);
      // console.log("The selected Filter is", selectedFilters)
      filterBusinessOwner(sortedOwners, dateRange, selectedFilters);
    } catch (error) {
      throw error
    }
    finally {
      setIsLoading(false);
    }

  }

  const filterBusinessOwner = (
    data: Owner[],
    range: { from: Date; to: Date },
    filters: Record<string, string>
  ) => {
    const filteredOwners = data.filter(sub => {
      // Date range filter
      const isWithinDateRange =
        new Date(sub.dateCreated) >= range.from &&
        new Date(sub.dateCreated) <= range.to;

      const passesAdditionalFilters = Object.entries(filters).every(([key, value]) => {
        if (value === 'all') return true;

        if (key === 'isMigrated') {
          // Convert string "true"/"false" to boolean
          return sub[key as keyof Owner] === (value === "true");
        }

        return sub[key as keyof Owner] === value;
      });

      return isWithinDateRange && passesAdditionalFilters;
    });
    setFilteredBusinessOwners(filteredOwners);
  }
  // console.log("The filtered business owners", filteredBusinessOwners)

  useEffect(() => {
    fetchBusinessOwners()
  }, [])

  useEffect(() => {
    filterBusinessOwner(businessOwners, dateRange, selectedFilters);
  }, [dateRange, businessOwners, selectedFilters]);

  const handleDateRangeChange = (newRange: { from: Date; to: Date }) => {
    setDateRange(newRange);
  }

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
      requiredPermission="view:owners"
      loading={
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      }
      fallback={
        <Unauthorized />}
    >
      <div className='flex flex-col w-full h-full px-4 sm:px-6 md:px-8'>
        <div className='flex flex-col space-y-4 md:space-y-6 mb-3 w-full'>
          <div className='w-full mt-2'>
            <BreadcrumbNav items={breadcrumbItems} />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
            <div className='w-full col-span-1 lg:col-span-2'>
              <UniversalFilters
                filters={BUSINESS_OWNER_FILTERS}
                onFilterChange={handleFilterChange}
                selectedFilters={selectedFilters}
              />
            </div>

            <div className='w-full'>
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
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className='w-full mb-6'>
          <BusinessOwnerSummary
            owners={businessOwners}
            dateRange={dateRange}
            selectedFilters={selectedFilters}
          />
        </div>

        <div className='w-full overflow-x-auto'>
          <Card className="w-full">
            <CardContent className="p-2 sm:p-4 md:p-6">
              <DataTable
                columns={columns}
                data={filteredBusinessOwners}
                searchKey='firstName'
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedComponent>
  )
}
