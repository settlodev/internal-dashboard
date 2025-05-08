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
import DeviceForm from "@/components/forms/device_form";
import { PosDevices } from "@/types/devices/type";
import { fetchDeviceById } from "@/lib/actions/devices";

interface Params {
  params: { id: string };
}

export default async function DevicePage({ params }: Params) {
  const isNewItem = params.id === "new";
  let item: PosDevices | null | undefined = null;

  if (!isNewItem) {
    try {
      item = await fetchDeviceById(params.id as UUID);
      console.log("The item", item)
    } catch (error) {
      
      throw new Error("Failed to load device details");
    }
  }

  const breadCrumbItems = [
    { title: "Devices", link: "/devices" },
    { title: isNewItem ? "New" : "Edit", link: "" },
  ];

  return (
    <div className={`flex-1 space-y-4 p-4 md:p-8 pt-6`}>
      <div className={`flex items-center justify-between mb-2`}>
        <div className={`relative flex-1 `}>
          <BreadcrumbNav items={breadCrumbItems} />
        </div>
      </div>
      <DeviceCard isNewItem={isNewItem} item={item} />
    </div>
  );
}

const DeviceCard = ({
  isNewItem,
  item,
}: {
  isNewItem: boolean;
  item: PosDevices | null | undefined;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>
        {isNewItem ? "Add Device" : "Edit Device details"}
      </CardTitle>
      <CardDescription>
        {isNewItem ? "Add a new device " : "Edit device details"}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <DeviceForm item={item} />
    </CardContent>
  </Card>
);
