import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { fetchAllUsers } from "@/lib/user-actions";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "@/components/table/users/column";

const breadcrumbItems = [
    { title: "Users", link: "/locations" },
]
export default async function Page() {

    const users = await fetchAllUsers()
    
    return (
            <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
            </div>
            {
                users?.length > 0 ? (
                    <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable 
                    columns={columns}
                    data={users}
                    />
                </CardContent>
            </Card>
                ) : (
                    <div className="flex items-center justify-center min-h-screen">
                        <p>No user found</p>
                    </div>
                )
            }
            </div>
    );
}