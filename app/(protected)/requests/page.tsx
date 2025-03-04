'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { columns } from "@/components/table/requests/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllRequestSubscription } from "@/lib/actions/location";
import { RequestSubscription } from "@/types/location/type";
import { useEffect, useState } from "react";
import Loading from "@/components/widgets/loader";
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import Unauthorized from "@/components/code/401";

const breadcrumbItems = [
    { title: "Requests", link: "/requests" },
]

export default function Dashboard() {
    const [requests, setRequest] = useState<RequestSubscription[]>([])
    const [isLoading, setLoading] = useState(true);
const fetchRequestSubscription = async () => {
  try {
    const requests = await fetchAllRequestSubscription()
    setRequest(requests)
  } catch (error) {
    throw error
  }
  finally{
    setLoading(false)
  }

}
useEffect(() => {
  fetchRequestSubscription()
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
      requiredPermissions={['view:requests', 'approve:request']}
      fallback={<Unauthorized />}>
        <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>

            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Requests for Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable 
                    columns={columns}
                    data={requests}
                    searchKey="location_name"
                    // pageSize={5}
                    />
                </CardContent>
            </Card>
        </div>
        </ProtectedComponent>
    );
}