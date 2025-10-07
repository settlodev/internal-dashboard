'use client'

import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { DataTable } from '@/components/table/data-table'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { DatePickerWithRange } from '@/components/widgets/date-range-picker'
import { Owner } from '@/types/owners/type'
import { columns } from '../table/owners/column'
import { searchBusinessOwners } from '@/lib/actions/business-owners'

interface Props {
  initialBusinessOwners: Owner[]
  totalElements: number
  searchParams: { search?: string; page?: string; limit?: string }
  breadcrumbItems: { title: string; link: string }[]
}

export function BusinessOwnerComponent({ 
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



  const fetchAllBusinessOwners = async () => {
    setIsLoading(true)
    try {
      const data = await searchBusinessOwners(page,size,dateRange.from,dateRange.to)
    
      const sortedBusinesses = data.content.sort((a:any, b:any) => 
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      )
      setBusinessesOwners(sortedBusinesses)
      setTotal(data.totalElements)
    } catch (error) {
      console.error('Error fetching incomplete business setup:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllBusinessOwners()
  }, [page, size,dateRange.from,dateRange.to])

  const handleDateRangeChange = async(newRange: { from: Date; to: Date }) => {
    setDateRange(newRange)
    fetchAllBusinessOwners()
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
    <div className='flex flex-col w-full h-full px-4 sm:px-6 md:px-8'>
      <div className='flex flex-col space-y-4 md:space-y-6 mb-3 w-full'>
        <div className='hidden w-full mt-2'>
          <BreadcrumbNav items={breadcrumbItems} />
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-4 lg:items-center lg:justify-between w-full'>
          <div className='flex flex-col gap-2 flex-1 min-w-0'>
            <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
              Business owners
            </h2>
            <p className='text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl'>
              View and manage all registered business owners in the system
            </p>
          </div>
          <div className='mr-6'>
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

      <div className='w-full overflow-x-auto'>
        <Card className="w-full">
          <CardContent className="p-2 sm:p-4 md:p-6">
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