import BusinessBarChart from "@/components/dashboard/businessBar";
import CardComponent from "@/components/dashboard/card";
import LocationBarChart from "@/components/dashboard/locationBarChart";
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";

const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
]
export default function Dashboard() {
    return (
        <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>

            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-col-4">
                <CardComponent title="Total Business"  amount={30}/>
                <CardComponent title="Total Locations"  amount={100}/>
                <CardComponent title="Total Subscription"  amount={80}/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <BusinessBarChart/>
            <LocationBarChart/>
            </div>
        </div>
    );
}