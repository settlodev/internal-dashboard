'use client'
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import BusinessSummary from "@/components/business/business-summary";
import Unauthorized from "@/components/code/401";
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { columns } from "@/components/table/business/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/widgets/loader";
import { fetchAllBusiness } from "@/lib/actions/business";
import { Business } from "@/types/business/types";
import { useEffect, useState } from "react";

const breadcrumbItems = [
    { title: "Businesses", link: "/businesses" },
]

export default function Dashboard() {
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [isLoading, setIsLoading] = useState(true);
const fetchBusinessTypes = async () => {
  try {
    const types = await fetchAllBusiness()
    setBusinesses(types)
    
  } catch (error) {
    throw error
  }
  finally {
    setIsLoading(false);
  }

}
useEffect(() => {
  fetchBusinessTypes()
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
       requiredPermission="view:businesses"
       loading={
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      }
       fallback={<Unauthorized />}
        >
         <div className="flex-1 space-y-2 md:p-8 pt-4">
            <div className="flex flex-col items-start justify-between mb-2">
                <div className="relative flex-1 md:max-w-md pl-2">
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>

            <BusinessSummary businesses={businesses}/>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Businesses</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable 
                    columns={columns}
                    data={businesses}
                    searchKey="name"
                    filters={[
                      {
                        key: "businessTypeName",
                        label: "Business Type",
                        options: [
                          { label: "Retail", value: "Retail" },
                          { label: "Hospitality", value: "Hospitality" },
                        ]
                      },
                      
                      // Add more filters as needed
                    ]}
                    />
                </CardContent>
            </Card>
        </div>
       </ProtectedComponent>
    );
}