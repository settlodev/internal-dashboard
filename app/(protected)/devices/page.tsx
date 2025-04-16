'use client'
import { BreadcrumbNav } from '@/components/layout/breadcrumbs';
import { DataTable } from '@/components/table/data-table';
import { columns } from '@/components/table/devices/column';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Loading from '@/components/widgets/loader';
import { fetchDevices } from '@/lib/actions/devices';
import { PosDevices } from '@/types/devices/type';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const breadcrumbItems = [
    { title: "Devices", link: "/devices" },
]
export default function page() {
    const [isLoading, setLoading] = useState(true);
    const [devices, setDevices] = useState<PosDevices[]>([])
    const fetchListDevices = async () => {
        try {
          const list = await fetchDevices()
          // console.log(users)
          setDevices(list)
        } catch (error) {
          throw error
        }
        finally {
          setLoading(false);
        }
    
      }
      useEffect(() => {
        fetchListDevices()
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
    <div className="flex-1 space-y-2 md:p-8 pt-4">
    <div className='flex items-center justify-between mb-3 pl-2 pr-2'>
        <div className='relative '>
          <BreadcrumbNav items={breadcrumbItems} />
        </div>
        <Button>
          <Link href="/devices/new">Add Device</Link>
        </Button>
      </div>

    {
        devices && devices.length > 0 ? (
            <Card className="w-full">
        <CardContent className='p-4'>
        <p className="text-2xl">POS Devices</p>
            <DataTable 
            columns={columns}
            data={devices}
            searchKey="device_type"
            // filters={[
            //   {
            //     key: "device_type",
            //     label: "Device Type",
            //     options: [
            //       {label: "Tablet",value: "Tablet"},
            //       {label: "Printer",value: "Printer"}
            //     ]
            //   },
              
            //   // Add more filters as needed
            // ]}
            // pageSize={5}
            />
        </CardContent>
    </Card>
        ) : (
            <p>No devices found</p>
        )
    }
</div>
  )
}
