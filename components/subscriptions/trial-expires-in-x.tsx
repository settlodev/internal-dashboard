

'use client'

import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { DataTable } from '@/components/table/data-table'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Owner } from '@/types/owners/type'
import { trialSubscriptionExpiresInXDays } from '@/lib/actions/business-owners'
import { columns } from '../table/no-orders/column'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {useRouter} from "next/navigation";

interface Props {
  initialBusinessOwners: Owner[]
  totalElements: number
  searchParams: { search?: string; page?: string; limit?: string }
  breadcrumbItems: { title: string; link: string }[]
}

interface DaysFormValues {
  daysBeforeExpiry: number
}

export function TrialSubscriptionExpiresInXDays({ 
  initialBusinessOwners, 
  totalElements, 
  searchParams,
  breadcrumbItems 
}: Props) {
  const [businessesOwnres, setBusinessesOwners] = useState<Owner[]>(initialBusinessOwners)
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(totalElements)
  const [daysValue, setDaysValue] = useState<number>(5)
  const page = Number(searchParams.page) || 0
  const size = Number(searchParams.limit) || 10
    const router = useRouter()

    const handleRowClick = (owner: Owner) => {
        router.push(`/owners/${owner.id}`)
    }

  const { register, handleSubmit, formState: { errors }} = useForm<DaysFormValues>({
    defaultValues: {
      daysBeforeExpiry: 5
    }
  })

  const fetchTrialSubscriptionExpiresInXDays = async (days: number) => {
    setIsLoading(true)
    try {
      const data = await trialSubscriptionExpiresInXDays(page, size, days)
    
      const sortedBusinesses = data.content
      setBusinessesOwners(sortedBusinesses)
      setTotal(data.totalElements)
    } catch (error) {
      console.error('Error fetching business owners with no Orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrialSubscriptionExpiresInXDays(daysValue)
  }, [page, size,daysValue])

  const onSubmit = (data: DaysFormValues) => {
    setDaysValue(data.daysBeforeExpiry || 5)
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

            <div className='flex flex-col gap-3 flex-1 min-w-0'>
                <div className='flex items-baseline gap-3 flex-wrap'>
                    <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
                        Trial Subscription expires in {daysValue} days
                    </h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-red-300`}>
                        {total}
                    </span>
                </div>

                <div className='flex flex-col gap-1.5'>
                    <p className='text-sm text-muted-foreground leading-relaxed'>
                        The list of customers whose trial subscription expires in {daysValue} days.
                    </p>

                </div>
            </div>
          
          {/* Date Picker and Days Input */}
          <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col sm:flex-row gap-3 items-end'>
              <div className='flex flex-col gap-2 w-full sm:w-auto'>
                <Label htmlFor="daysBeforeExpiry" className='text-sm font-medium'>
                  Days Before Expiry
                </Label>
                <div className='flex gap-2'>
                  <Input
                    id="daysBeforeExpiry"
                    type="number"
                    min="1"
                    placeholder="Enter days"
                    className="w-full sm:w-[140px]"
                    {...register('daysBeforeExpiry', {
                      required: 'Days is required',
                      min: { value: 1, message: 'Minimum 1 day' },
                      valueAsNumber: true
                    })}
                  />
                  <Button type="submit" size="default">
                    Apply
                  </Button>
                </div>
                {errors.daysBeforeExpiry && (
                  <span className='text-xs text-red-500'>{errors.daysBeforeExpiry.message}</span>
                )}
              </div>
            </form>
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
              searchKey='name'
              total={total}
              pageSize={size || 10}
              onRowClick={handleRowClick}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}