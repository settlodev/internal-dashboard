'use client'
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import BusinessBarChart from "@/components/dashboard/businessBar";
import CardComponent from "@/components/dashboard/card";
import LocationBarChart from "@/components/dashboard/locationBarChart";
import UseLineChart from "@/components/dashboard/userLineChart";
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import Loading from "@/components/widgets/loader";
import { getDashboardSummaries } from "@/lib/actions/dashboard-actions";
import { SummaryResponse } from "@/types/dashboard/type";
import { useEffect, useState } from "react";

const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
]
export default function Dashboard() {
    const [stats, setStats] = useState<SummaryResponse>();
    const [isLoading, setLoading] = useState(true);
    const getSummary = async () => {
        try {
            const data = await getDashboardSummaries();
            console.log(data )
            setStats(data as SummaryResponse);
        } catch (error) {
            console.log("The error", error );
            throw error;
        }
        finally{
            setLoading(false)
        }
    }
    useEffect(() => {
        getSummary();
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
        <ProtectedComponent requiredPermission="view:analytics" fallback={<div>You are not allowed to view this page</div>}>
        <div className='flex flex-col space-y-4 md:p-8 p-4 w-full'>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>

            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4  ">
                <CardComponent title="Total Users" amount={stats?.totalUsers} />
                <CardComponent title="Total Business" amount={stats?.totalBusinesses} />
                <CardComponent title="Total Locations" amount={stats?.totalLocations} />
                <CardComponent title="Users with Active Subscription" amount={stats?.totalUsersWithActiveSubscriptions} />
                <CardComponent title="InActive Subscription" amount={stats?.totalUsersWithInActiveSubscriptions} />
                <CardComponent title="Total Subscription" amount={stats?.totalSubscriptions} />
            </div>
            <div>
                <UseLineChart data={stats?.monthlyUsersCreated ?? []} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
                <BusinessBarChart data={stats?.monthlyLocationsCreated ?? []} />
                <LocationBarChart data={stats?.monthlyLocationsCreated ?? []} />
            </div>
        </div>
        </ProtectedComponent>
     
    );
}