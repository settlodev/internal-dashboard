import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { fetchAllRoles } from "@/lib/role-action";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "@/components/table/roles/column";

const breadcrumbItems = [
    { title: "Roles", link: "/roles" },
]
export default async function Dashboard() {

    const roles = await fetchAllRoles()

    return (
            <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
                
            </div>
            {
                roles.length > 0 ? (
                    <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Roles</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable 
                    columns={columns}
                    data={roles}
                    searchKey="name"
                    // pageSize={5}
                    />
                </CardContent>
            </Card>
                ) : (
                    <p>No roles found</p>
                )
            }

            </div>
    );
}