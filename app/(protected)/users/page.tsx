import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "@/components/table/users/column";
import { searchUsers } from "@/lib/actions/user-actions";

const breadcrumbItems = [
    { title: "Users", link: "/locations" },
]
type ParamsProps = {
    searchParams: {
        [key: string]: string | undefined;
    }
}
export default async function Page({searchParams}:ParamsProps) {
    const q = searchParams.search || "";
    // const page = Number(searchParams.page) || 0;
    // const pageLimit = Number(searchParams.pageLimit);

    const data = await searchUsers(q);
    // const totalPages = Math.ceil(data.length / pageLimit);


    // const users = await fetchAllUsers()
    
    return (
            <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
            </div>
            {
                data?.length > 0 ? (
                    <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable 
                    columns={columns}
                    data={data}
                    searchKey="first_name"
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