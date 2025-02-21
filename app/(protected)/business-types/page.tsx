'use client'
import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { columns } from '@/components/table/business-types/column'
import { DataTable } from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBusinessTypes } from '@/lib/actions/business-types'
import { BusinessType } from '@/types/business/types'
import Link from 'next/link'
import React, { useEffect } from 'react'

const breadcrumbItems = [
  { title: "Business Types", link: "/business-types" },
]

export default function page() {
  const [businessTypes, setBusinessTypes] = React.useState<BusinessType[]>([])
  const fetchBusinessTypes = async () => {
    try {
      const types = await getBusinessTypes()
      setBusinessTypes(types)
    } catch (error) {
      throw error
    }

  }
  useEffect(() => {
    fetchBusinessTypes()
  },[])
  return (
    <div className='flex-1 p-4 space-y-2 md:p-8'>
      <div className='flex items-center justify-between mb-3'>
        <div className='relative'>
        <BreadcrumbNav items={breadcrumbItems} />
        </div>
        <Button>
          <Link href="/business-types/new">Add Business Type</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Business Types</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
          columns={columns}
          data={businessTypes}
          searchKey='name'
           />
        </CardContent>
      </Card>
    </div>
  )
}
