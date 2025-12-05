import { UUID } from "node:crypto";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { UserForm } from "@/components/forms/user/user-form";
import React from "react";
import { Profile} from "@/types/users/type";
import {getUserProfileById} from "@/lib/actions/user-actions";

interface UserPageParams {
  params: { id: string };
}

export default async function UserPage({ params }: UserPageParams) {
  const isNewItem = params.id === "new";
  let item: Profile | null | undefined = null;

  if (!isNewItem) {
    try {
      item  = await getUserProfileById(params.id as UUID);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to load user details");
    }
  }

  const breadCrumbItems = [
    { title: "User", link: "/users" },
    { title: isNewItem ? "New" : "Edit", link: "" },
  ];

  return (
    <div className={`flex-1 space-y-4 p-4 md:p-8 pt-6`}>
      <div className={`flex items-center justify-between mb-2`}>
        <div className={`relative flex-1 `}>
          <BreadcrumbNav items={breadCrumbItems} />
        </div>
      </div>
      <UserCard isNewItem={isNewItem} item={item} />
    </div>
  );
}

const UserCard = ({
  isNewItem,
  item,
}: {
  isNewItem: boolean;
  item: Profile | null | undefined;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>
        {isNewItem ? "Add User" : "Edit User details"}
      </CardTitle>
      <CardDescription>
        {isNewItem ? "Add a new user " : "Edit user details"}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <UserForm item={item} />
    </CardContent>
  </Card>
);
