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

// import DeviceForm from "@/components/forms/device_form";
import { Invoice } from "@/types/invoice/type";
import InvoiceForm from "@/components/forms/invoice_form";
import { fetchInvoiceById } from "@/lib/actions/invoice-action";

interface Params {
  params: { id: string };
}

export default async function InvoicePage({ params }: Params) {
  const isNewItem = params.id === "new";
  let item: Invoice | null | undefined = null;

  if (!isNewItem) {
    try {
      item = await fetchInvoiceById(params.id as UUID);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to load user details");
    }
  }

  const breadCrumbItems = [
    { title: "Invoices", link: "/invoices" },
    { title: isNewItem ? "New" : "Edit", link: "" },
  ];

  return (
    <div className={`flex-1 space-y-4 p-4 md:p-8 pt-6`}>
      <div className={`flex items-center justify-between mb-2`}>
        <div className={`relative flex-1 `}>
          <BreadcrumbNav items={breadCrumbItems} />
        </div>
      </div>
      <InvoiceCard isNewItem={isNewItem} item={item} />
    </div>
  );
}

const InvoiceCard = ({
  isNewItem,
  item,
}: {
  isNewItem: boolean;
  item: Invoice | null | undefined;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>
        {isNewItem ? "Create Invoice" : "Edit Invoice details"}
      </CardTitle>
      <CardDescription>
        {isNewItem ? "Fill in the details to create a new invoice " : "Edit invoice details"}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <InvoiceForm item={item} />
    </CardContent>
  </Card>
);
