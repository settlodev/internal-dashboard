"use client"
import { CreditCard, ShoppingCart,Package,Box} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LocationActivityLogsProps {
  activityLogs: {
    latestOrderDate: string | null
    latestProductDate: string | null
    latestVariantDate: string | null
    latestStockDate: string | null
    latestStockVariantDate: string | null
    latestStockIntakeDate: string | null
    latestStaffDate: string | null
  }
}

const formatDate = (date: string | null) => {
  if (!date) return "-";
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString("en-US", options);
}

export const LocationActivity = ({ activityLogs }: LocationActivityLogsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Latest Activity Logs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Orders Card */}
        <Card className="w-[45%] lg:w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Order Creation</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDate(activityLogs.latestOrderDate)}</div>
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card className="w-[45%] lg:w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Product Creation</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDate(activityLogs.latestProductDate)}</div>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card className="w-[45%] lg:w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Product Variant Creation</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDate(activityLogs.latestVariantDate)}</div>
          </CardContent>
        </Card>

        {/* Stock Card */}
        <Card className="w-[45%] lg:w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock Creation</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDate(activityLogs.latestStockDate)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
