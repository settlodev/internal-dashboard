import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { Business, columns } from "@/components/table/business/column";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const breadcrumbItems = [
    { title: "Businesses", link: "/businesses" },
]
const data: Business[] = [
    {
        id: 1,
        name: "Settlo Test",
        prefix: "1234",
        country: "Tanzania",
        totalLocations: 5,
        businessType: "Retail",
        email: "support@settlo.co.tz",
        phone: "1234567890",
        address: "123 Main St, Anytown, USA",
        vdfRegistration:"true"
    },
    {
        id: 2,
        name: "Settlo Restaurant",
        prefix: "1234",
        country: "Tanzania",
        totalLocations: 1,
        businessType: "Hospitality",
        email: "support@settlo.co.tz",
        phone: "1234567890",
        address: "Masakini, Kinondoni",
        vdfRegistration:"true"
    }
]
export default function Dashboard() {
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
                    data={data}
                    // pageSize={5}
                    />
                </CardContent>
            </Card>
        </div>
    );
}