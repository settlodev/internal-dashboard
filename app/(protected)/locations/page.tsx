'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { columns } from "@/components/table/location/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllBusiness } from "@/lib/actions/business";
import { fetchAllLocation } from "@/lib/actions/location";
import { Location } from "@/types/location/type";
import { useEffect, useState } from "react";
import Loading from "@/components/widgets/loader";
import { ProtectedComponent } from "@/components/auth/protectedComponent";

const breadcrumbItems = [
    { title: "Locations", link: "/locations" },
]

export default function Dashboard() {
    const [locations, setLocations] = useState<Location[]>([])
    const [isLoading, setLoading] = useState(true);
const fetchBusinessLocations = async () => {
  try {
    const location = await fetchAllLocation()
    // console.log('The locations are', location)
    setLocations(location)
  } catch (error) {
    throw error
  }
  finally{
    setLoading(false)
  }

}
useEffect(() => {
  fetchBusinessLocations()
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
    requiredPermission="view:locations"
    loading={
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    }
    fallback={<div
    className="flex items-center justify-center min-h-screen gap-1"
    ></div>}>
        <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>

            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Locations</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable 
                    columns={columns}
                    data={locations}
                    searchKey="name"
                    filters={[
                      {
                        key: "locationBusinessTypeName",
                        label: "Business Type",
                        options: [
                          {label: "Retail",value: "Retail"},
                          {label: "Hospitality",value: "Hospitality"}
                        ]
                      },
                      
                      // Add more filters as needed
                    ]}
                    // pageSize={5}
                    />
                </CardContent>
            </Card>
        </div>
        </ProtectedComponent>
    );
}