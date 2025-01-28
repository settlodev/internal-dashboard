'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { columns } from "@/components/table/business/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllBusiness } from "@/lib/actions/business";
import { Business } from "@/types/business/types";
import { useEffect, useState } from "react";

const breadcrumbItems = [
    { title: "Businesses", link: "/businesses" },
]

export default function Dashboard() {
    const [businesses, setBusinesses] = useState<Business[]>([])
const fetchBusinessTypes = async () => {
  try {
    const types = await fetchAllBusiness()
    setBusinesses(types)
  } catch (error) {
    throw error
  }

}
useEffect(() => {
  fetchBusinessTypes()
},[])
    return (
        <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>

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
                    // pageSize={5}
                    />
                </CardContent>
            </Card>
        </div>
    );
}