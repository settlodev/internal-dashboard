'use client'
import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { columns } from '@/components/table/owners/column'
import { DataTable } from '@/components/table/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBusinessTypes } from '@/lib/actions/business-types'
import { BusinessType } from '@/types/business/types'
import React, { useEffect, useState } from 'react'
import { Owner } from '@/types/owners/type'
import { fetchAllBusinessOwners } from '@/lib/actions/business-owners'
import Loading from '@/components/widgets/loader'
import { ProtectedComponent } from '@/components/auth/protectedComponent'

const breadcrumbItems = [
  { title: "Business owners", link: "/owners" },
]
export default function page() {
  const [businessOwners, setBusinessOwners] = useState<Owner[]>([])
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchBusinessOwners = async () => {
    try {
      const owners = await fetchAllBusinessOwners()
      setBusinessOwners(owners)
    } catch (error) {
      throw error
    }
    finally {
      setIsLoading(false);
    }
  
  }
  useEffect(() => {
    fetchBusinessOwners()
  },[])
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
    fallback={<div
    className="flex items-center justify-center min-h-screen gap-1"></div>}
    >
    <div className='flex-1 p-4 space-y-2 md:p-8'>
      <div className='flex items-center justify-between mb-3'>
        <div className='relative'>
        <BreadcrumbNav items={breadcrumbItems} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Business Owners</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
          columns={columns}
          data={businessOwners}
          searchKey='firstName'
         
          filters={[
            {
              key: "isMigrated",
              label: "Business Owners",
              options: [
                {label: "Migrated",value: "true"},
                {label: "New",value: "false"}
              ]
            },
            
            // Add more filters as needed
          ]}
           />
        </CardContent>
      </Card>
    </div>
    </ProtectedComponent>
  )
}
