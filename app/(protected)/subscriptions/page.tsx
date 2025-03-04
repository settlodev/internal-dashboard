'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { columns } from "@/components/table/subscriptions/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Loading from "@/components/widgets/loader";
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import { getAllSubscriptions } from "@/lib/actions/subscriptions";
import { Payment } from "@/types/location/type";
import SubscriptionAnalytics from "@/components/subscription/analytics";
import Unauthorized from "@/components/code/401";

const breadcrumbItems = [
  { title: "Subscriptions", link: "/subscriptions" },
]

export default function Subscription() {
  const [subscriptions, setSubscriptions] = useState<Payment[]>([])
  const [isLoading, setLoading] = useState(true);
  const fetchSubscriptions = async () => {
    try {
      const subs = await getAllSubscriptions();
      const sortedSubs = subs.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
      // console.log("sortedSubs", sortedSubs)
      setSubscriptions(sortedSubs);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchSubscriptions()
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
      requiredPermission="view:locations"
      loading={
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      }
      fallback={<Unauthorized />}>
      <div className='flex-1 space-y-2 md:p-8 pt-4 px-4'>
        <div className={`flex items-center justify-between mb-2`}>
          <div className={`relative flex-1 md:max-w-md`}>
            <BreadcrumbNav items={breadcrumbItems} />
          </div>

        </div>
        <SubscriptionAnalytics subscriptions={subscriptions} />
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={subscriptions}
              searchKey="locationName"
              filters={[
                {
                  key: "subscriptionPackageName",
                  label: "Package",
                  options: [
                    { label: "Silver", value: "SILVER" },
                    { label: "Platinum", value: "PLATINUM" },
                    { label: "Diamond", value: "DIAMOND" }
                  ]
                },
                {
                  key: "status",
                  label: "Status",
                  options: [
                    { label: "Success", value: "SUCCESS" },
                    { label: "Failed", value: "FAIL" }
                  ]
                }
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