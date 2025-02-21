'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "@/components/table/users/column";
import { fetchAllUsers, searchUsers } from "@/lib/actions/user-actions";
import { Profile, User } from "@/types/users/type";
import { useEffect, useState } from "react";
import Loading from "@/components/widgets/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import { ExpandIcon } from "lucide-react";

const breadcrumbItems = [
  { title: "Users", link: "/locations" },
]

export default function Page() {
  const [userProfile, setUserProfile] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const users = await fetchAllUsers()
      // console.log(users)
      setUserProfile(users)
    } catch (error) {
      throw error
    }
    finally {
      setIsLoading(false);
    }

  }
  useEffect(() => {
    fetchUserProfile()
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
    requiredPermission="view:users"
    loading={
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    }
    fallback={<div
    className="flex items-center justify-center min-h-screen gap-1"
    >
      {/* <ExpandIcon /> */}
      <span className=" bg-red-500 text-white py-2 px-3 rounded-sm">
      You don't have permission, please contact the admin</span>
      </div>}
  >
    <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
      <div className='flex items-center justify-between mb-3'>
        <div className='relative'>
          <BreadcrumbNav items={breadcrumbItems} />
        </div>
        <Button>
          <Link href="/users/new">Add User</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={userProfile}
            searchKey="first_name"
          />
        </CardContent>
      </Card>

    </div>
    </ProtectedComponent>
  );
}