'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { columns } from "@/components/table/location/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllLocation } from "@/lib/actions/location";
import { Location } from "@/types/location/type";
import { useEffect, useState } from "react";
import Loading from "@/components/widgets/loader";
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import LocationsAnalyticsDashboard from "@/components/location/location-summary";
import Unauthorized from "@/components/code/401";

const breadcrumbItems = [
    { title: "Locations", link: "/locations" },
]

export default function Dashboard() {
    const [locations, setLocations] = useState<Location[]>([])
    const [isLoading, setLoading] = useState(true);
const fetchBusinessLocations = async () => {
  try {
    const location = await fetchAllLocation()
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
    fallback={
      <Unauthorized />
    }>
        <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
            <div className="flex flex-col items-start justify-between mb-2 gap-3">
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
                <LocationsAnalyticsDashboard locations={locations} />

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
                      {
                        key: "subscriptionStatus",
                        label: "Subscription Status",
                        options: [
                          {label: "Trial",value: "TRIAL"},
                          {label: "Expired",value: "EXPIRED"},
                          {label: "Active",value: "OK"},
                          {label: "Pending",value: "PENDING"},
                          {label: "Due",value: "DUE"},
                          {label:"Almost Due",value:"ALMOST_DUE"}
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