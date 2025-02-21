import { UUID } from "node:crypto";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import React from "react";
import { Role } from "@/types/role/type";
import { getRoleById } from "@/lib/actions/role-action";
import { RoleForm } from "@/components/forms/role_form";

interface PageParams {
  params: { id: string };
}

export default async function RolePage({ params }: PageParams) {
  const isNewItem = params.id === "new";
  let item: Role | null | undefined = null;

  if (!isNewItem) {
    try {
      item = await getRoleById(params.id as UUID);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to load role details");
    }
  }

  const breadCrumbItems = [
    { title: "Role", link: "/roles" },
    { title: isNewItem ? "New" : "Edit", link: "" },
  ];

  return (
    <div className={`flex-1 space-y-4 p-4 md:p-8 pt-6`}>
      <div className={`flex items-center justify-between mb-2`}>
        <div className={`relative flex-1 `}>
          <BreadcrumbNav items={breadCrumbItems} />
        </div>
      </div>
      <RoleCard isNewItem={isNewItem} item={item} />
    </div>
  );
}

const RoleCard = ({
  isNewItem,
  item,
}: {
  isNewItem: boolean;
  item: Role | null | undefined;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>
        {isNewItem ? "Add Role" : "Edit Role details"}
      </CardTitle>
      <CardDescription>
        {isNewItem ? "Add a new role " : "Edit role details"}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <RoleForm item={item} />
    </CardContent>
  </Card>
);
