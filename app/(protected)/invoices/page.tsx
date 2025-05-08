'use client'
import { ProtectedComponent } from '@/components/auth/protectedComponent';
import Unauthorized from '@/components/code/401';
import { BreadcrumbNav } from '@/components/layout/breadcrumbs';
import { DataTable } from '@/components/table/data-table';
import { columns } from '@/components/table/invoices/column';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Loading from '@/components/widgets/loader';
import { getCurrentUser } from '@/lib/actions/auth/signIn';
import { fetchInvoices } from '@/lib/actions/invoice-action';
import { Invoice } from '@/types/invoice/type';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const breadcrumbItems = [
    { title: "Invoices", link: "/invoices" },
]
export default function page() {
    const [isLoading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const getInvoices = async () => {
        try {
          
          const currentUser = await getCurrentUser();
        if (currentUser.user?.id) {
          const list = await fetchInvoices(currentUser.user.id, currentUser.role)
          setInvoices(list)

        }
        } catch (error) {
          throw error
        }
        finally {
          setLoading(false);
        }
    
      }

      useEffect(() => {
        getInvoices()
      }, [])

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
        requiredPermissions={['view:invoices','view:invoice-list']}
        fallback={<Unauthorized />}>
    <div className="flex-1 space-y-2 md:p-8 pt-4">
    <div className='flex items-center justify-between mb-3 pl-2 pr-2'>
        <div className='relative '>
          <BreadcrumbNav items={breadcrumbItems} />
        </div>
        <Button>
          <Link href="/invoices/new">Create Invoice</Link>
        </Button>
      </div>

    {
        invoices && invoices.length > 0 ? (
            <Card className="w-full">
        <CardContent>
        <p className="text-2xl">Invoices</p>
            <DataTable 
            columns={columns}
            data={invoices}
            searchKey="invoice_number"
            />
        </CardContent>
    </Card>
        ) : (
          <div className="flex items-center justify-center min-h-screen ">
            <p className='text-2xl p-2 bg-black text-white rounded-md '>No Invoices found</p>
          </div>
            
        )
    }
</div>
</ProtectedComponent>
  )
}
