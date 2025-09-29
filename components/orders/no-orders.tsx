
'use client'

import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { DataTable } from '@/components/table/data-table'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { DatePickerWithRange } from '@/components/widgets/date-range-picker'
import { Owner } from '@/types/owners/type'
import { businessOwnersWithNoOrder} from '@/lib/actions/business-owners'
import { columns } from '../table/no-orders/column'

interface Props {
  initialBusinessOwners: Owner[]
  totalElements: number
  searchParams: { search?: string; page?: string; limit?: string }
  breadcrumbItems: { title: string; link: string }[]
}

export function BusinessOwnersWithNoOrders({ 
  initialBusinessOwners, 
  totalElements, 
  searchParams,
  breadcrumbItems 
}: Props) {
  const [businessesOwnres, setBusinessesOwners] = useState<Owner[]>(initialBusinessOwners)
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
    const today = new Date();
    return {
      from: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), 
      to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
    };
  })
  const [total, setTotal] = useState(totalElements)
  const page = Number(searchParams.page) || 0
  const size = Number(searchParams.limit) || 10

  const fetchIncompleteBusinessSetup = async () => {
    setIsLoading(true)
    try {
      const data = await businessOwnersWithNoOrder(page, size, dateRange.from, dateRange.to)
    
      const sortedBusinesses = data.content.sort((a:any, b:any) => 
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      )
      setBusinessesOwners(sortedBusinesses)
      setTotal(data.totalElements)
    } catch (error) {
      console.error('Error fetching business owners with no Orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Add dateRange to the dependency array
  useEffect(() => {
    fetchIncompleteBusinessSetup()
  }, [page, size, dateRange]) // ← Added dateRange here

  const handleDateRangeChange = (newRange: { from: Date; to: Date }) => {
    setDateRange(newRange)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
      <div className='flex flex-col space-y-4 md:space-y-6 mb-4 md:mb-6 w-full'>
        <div className='w-full mt-2'>
          <BreadcrumbNav items={breadcrumbItems} />
        </div>

        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-start gap-4 lg:items-center lg:justify-between w-full'>
          <div className='flex flex-col gap-2 flex-1 min-w-0'>
            <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
              Users with no orders at all
            </h2>
            <p className='text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl'>
              The list of customers who have not created an order.
              {dateRange.from && dateRange.to && (
                <span className='block mt-1 text-xs'>
                  Showing results from {dateRange.from.toLocaleDateString()} to {dateRange.to.toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
          
          {/* Date Picker */}
          <div className='w-full lg:w-auto flex-shrink-0'>
            <DatePickerWithRange
              value={{
                from: dateRange.from,
                to: dateRange.to
              }}
              onChange={(newRange) => {
                if (newRange?.from && newRange?.to) {
                  handleDateRangeChange({ from: newRange.from, to: newRange.to })
                }
              }}
              className="w-full lg:w-[280px]"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className='w-full overflow-x-auto flex-1'>
        <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
            <DataTable
              columns={columns}
              data={businessesOwnres}
              searchKey='' 
              total={total}
              pageSize={size || 10}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}