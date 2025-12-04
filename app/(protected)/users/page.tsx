'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "@/components/table/users/column";
import {searchStaffProfile} from "@/lib/actions/user-actions";
import { User } from "@/types/users/type";
import { useEffect, useState } from "react";
import Loading from "@/components/widgets/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import Unauthorized from "@/components/code/401";

const breadcrumbItems = [
  { title: "Users", link: "/locations" },
]

export default function Page() {
  const [userProfile, setUserProfile] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const users = await searchStaffProfile()
      setUserProfile(users.content)
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
    fallback={
      <Unauthorized />}
  >
    <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
      <div className='flex items-center justify-between mb-3 pl-2 pr-2'>
        <div className='relative '>
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
            searchKey="firstName"
            total={100}
            pageSize={10}
          />
        </CardContent>
      </Card>

    </div>
    </ProtectedComponent>
  );
}