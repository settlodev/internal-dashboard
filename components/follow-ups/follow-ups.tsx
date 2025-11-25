
'use client'

import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { DataTable } from '@/components/table/data-table'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { DatePickerWithRange } from '@/components/widgets/date-range-picker'
import { FollowUp} from '@/types/owners/type'
import { followUpsOnCustomerFeedbacks} from '@/lib/actions/business-owners'
import { columns } from '../table/follow-ups/column'
import { Label } from '@/components/ui/label'

interface Props {
  initialFollowUps: FollowUp[]
  totalElements: number
  searchParams: { search?: string; page?: string; limit?: string }
  breadcrumbItems: { title: string; link: string }[]
}


export function FollowUpFeedback({ 
  initialFollowUps, 
  totalElements, 
  searchParams,
  breadcrumbItems 
}: Props) {
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps)
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

 

  const fetchFollowUpFeedbacks = async () => {
    setIsLoading(true)
    try {
      const data = await followUpsOnCustomerFeedbacks(page, size, dateRange.from, dateRange.to)
    
      const sortedFollowUps = data.content.sort((a:any, b:any) => 
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      )
      setFollowUps(sortedFollowUps)
      setTotal(data.totalElements)
    } catch (error) {
      console.error('Error fetching business owners with no Orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFollowUpFeedbacks()
  }, [page, size, dateRange,]) 

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
              Follow Ups on Customer Feedback
            </h2>
            <p className='text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl'>
              The list of follow ups that has been made by staff
            </p>
          </div>
          
          {/* Date Picker and Days Input */}
          <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0'>
            
            <div className='flex flex-col gap-2 w-full sm:w-auto'>
              <Label className='text-sm font-medium'>Date Range</Label>
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
      </div>

      {/* Table Section */}
      <div className='w-full overflow-x-auto flex-1'>
        <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
            <DataTable
              columns={columns}
              data={followUps}
              searchKey='' 
              total={total}
              pageSize={size || 10}
              showIndex={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}