

'use client'

import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { DataTable } from '@/components/table/data-table'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Owner } from '@/types/owners/type'
import { trialExpired } from '@/lib/actions/business-owners'
import { columns } from '../table/no-orders/column'
import {useRouter} from "next/navigation";
import {PageHeader} from "@/components/widgets/pageHeader";

interface Props {
  initialBusinessOwners: Owner[]
  totalElements: number
  searchParams: { search?: string; page?: string; limit?: string }
  breadcrumbItems: { title: string; link: string }[]
}



export function TrialExpired({ 
  initialBusinessOwners, 
  totalElements, 
  searchParams,
  breadcrumbItems 
}: Props) {
  const [businessesOwnres, setBusinessesOwners] = useState<Owner[]>(initialBusinessOwners)
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(totalElements)
  
  const page = Number(searchParams.page) || 0
  const size = Number(searchParams.limit) || 10
    const router = useRouter()

    const handleRowClick = (owner: Owner) => {
        router.push(`/owners/${owner.id}`)
    }

  const fetchExpiredTrial = async () => {
    setIsLoading(true)
    try {
      const data = await trialExpired(page, size)
    
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
    fetchExpiredTrial()
  }, [page, size])


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
            <PageHeader
                title="Trial Subscription Expired"
                description="Customers whose trial subscription has expired."
                totalCount={total}
                badgeColor="red"
            />
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
              onRowClick={handleRowClick}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}