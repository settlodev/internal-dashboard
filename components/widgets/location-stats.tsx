

"use client"
import { CreditCard, ShoppingCart, CheckCircle, Clock, XCircle, Wallet, Package, Layers, Box, Grid } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LocationStatisticsProps {
  statistics: {
    totalOrders: number
    totalCompletedOrders: number
    totalPendingOrders: number
    totalCanceledOrders: number
    totalTransactions: number
    totalTransactionsAmount: number
    totalProducts: number
    totalProductVariants: number
    totalStock: number
    totalStockVariants: number
  }
}

export const LocationStatistics = ({ statistics }: LocationStatisticsProps) => {
  console.log(statistics)
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Location Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Orders Card */}
        <Card className="w-[45%] lg:w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalOrders}</div>
            <div className="grid grid-cols-3 gap-2 pt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Completed
                </span>
                <span className="text-sm font-medium">{statistics.totalCompletedOrders}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-amber-500" />
                  Pending
                </span>
                <span className="text-sm font-medium">{statistics.totalPendingOrders}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground flex items-center">
                  <XCircle className="h-3 w-3 mr-1 text-red-500" />
                  Canceled
                </span>
                <span className="text-sm font-medium">{statistics.totalCanceledOrders}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card className="w-[45%] lg:w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalTransactions}</div>
            <div className="pt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Wallet className="h-3 w-3 mr-1 text-primary" />
                  Total Amount
                </span>
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "TZS",
                    minimumFractionDigits: 2,
                  }).format(statistics.totalTransactionsAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card className="w-[45%] lg:w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalProducts}</div>
            <div className="pt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Layers className="h-3 w-3 mr-1 text-primary" />
                  Product Variants
                </span>
                <span className="text-sm font-medium">{statistics.totalProductVariants}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Card */}
        <Card className="w-[45%] lg:w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalStock}</div>
            <div className="pt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Grid className="h-3 w-3 mr-1 text-primary" />
                  Stock Variants
                </span>
                <span className="text-sm font-medium">{statistics.totalStockVariants}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
