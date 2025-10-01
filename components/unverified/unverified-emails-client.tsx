'use client'

import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { DataTable } from '@/components/table/data-table'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Owner } from '@/types/owners/type'
import { DatePickerWithRange } from '@/components/widgets/date-range-picker'
import { columns } from '@/components/table/unverified-emails/column'
import { searchUnverifiedBusinessOwners } from '@/lib/actions/business-owners'

import { RefreshCw} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface UnverifiedEmailsClientProps {
  initialBusinessOwners: Owner[]
  totalElements: number
  searchParams: { search?: string; page?: string; limit?: string }
  breadcrumbItems: { title: string; link: string }[]
}

export function UnverifiedEmailsClient({ 
  initialBusinessOwners, 
  totalElements, 
  searchParams,
  breadcrumbItems 
}: UnverifiedEmailsClientProps) {
  const [businessOwners, setBusinessOwners] = useState<Owner[]>(initialBusinessOwners)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
    const today = new Date();
    return {
      from: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), 
      to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
    };
  })
  const [total, setTotal] = useState(totalElements)

  const q = searchParams.search || ""
  const page = Number(searchParams.page) || 0
  const size = Number(searchParams.limit) || 10

  const fetchBusinessOwners = async (showRefreshAnimation = false) => {
    if (showRefreshAnimation) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    
    try {
      const data = await searchUnverifiedBusinessOwners({ q, page, size })

      const sortedOwners = data.content.sort((a, b) => 
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      )
      setBusinessOwners(sortedOwners)
      setTotal(data.totalElements)
    } catch (error) {
      console.error('Error fetching unverified business owners:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  

  useEffect(() => {
    fetchBusinessOwners()
  }, [q, page, size])

  const handleDateRangeChange = (newRange: { from: Date; to: Date }) => {
    setDateRange(newRange)
    // Refetch data when date range changes if needed
    // fetchBusinessOwners()
  }

 

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex flex-col w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-6">
        <div className="flex flex-col space-y-4 md:space-y-6 mb-4 md:mb-6 w-full">
          <Skeleton className="h-4 w-64" />
          <div className="flex flex-col lg:flex-row items-start gap-4 lg:items-center lg:justify-between w-full">
            <div className="flex flex-col gap-3 flex-1">
              <Skeleton className="h-8 w-80" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-64" />
          </div>
        </div>
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='flex flex-col w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
      <div className='flex flex-col space-y-4 md:space-y-6 mb-4 md:mb-6 w-full'>
        {/* Breadcrumb */}
        <div className='w-full mt-2'>
          <BreadcrumbNav items={breadcrumbItems} />
        </div>

        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-start gap-4 lg:items-center lg:justify-between w-full'>
          <div className='flex flex-col gap-2 flex-1 min-w-0'>
            <div className='flex items-center gap-3 flex-wrap'>
              <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
                Unverified Customer Emails
              </h2>
              
            </div>
            <p className='text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl'>
              Customers who haven't verified their email after registration. 
             
              {dateRange.from && dateRange.to && (
                <span className='block mt-1 text-xs text-blue-600 dark:text-blue-400'>
                  Showing data from {dateRange.from.toLocaleDateString()} to {dateRange.to.toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
            
            
            {/* Date Picker */}
            <div className='w-full sm:w-64 flex-shrink-0'>
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
                className="w-full"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Table Section */}
      <div className='w-full overflow-x-auto flex-1'>
        <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200 border-0">
          <CardContent className="p-0 sm:p-0">
            <div className={`relative ${isRefreshing ? 'opacity-60' : ''}`}>
              {isRefreshing && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-950/50 z-10 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              )}
              <DataTable
                columns={columns}
                data={businessOwners}
                searchKey='' 
                total={total}
                pageSize={size || 10}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}