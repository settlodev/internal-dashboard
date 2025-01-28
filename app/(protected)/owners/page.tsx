'use client'
import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { columns } from '@/components/table/owners/column'
import { DataTable } from '@/components/table/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBusinessTypes } from '@/lib/actions/business-types'
import { BusinessType } from '@/types/business/types'
import React, { useEffect } from 'react'
import { Owner } from '@/types/owners/type'
import { fetchAllBusinessOwners } from '@/lib/actions/business-owners'

const breadcrumbItems = [
  { title: "Business owners", link: "/owners" },
]
export default function page() {
  const [businessOwners, setBusinessOwners] = React.useState<Owner[]>([])
  
  const fetchBusinessOwners = async () => {
    try {
      const owners = await fetchAllBusinessOwners()
      setBusinessOwners(owners)
    } catch (error) {
      throw error
    }
  
  }
  useEffect(() => {
    fetchBusinessOwners()
  },[])
  return (
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
          searchKey='name'
           />
        </CardContent>
      </Card>
    </div>
  )
}
