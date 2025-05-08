"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Payment } from "@/types/location/type"
import { CellAction } from "./cell-action"


export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    
    {
      accessorKey: "locationName",
      header: ({ column }) => {
          return (
                <Button
        variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Business Location
                  <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
          )
      },
      cell: ({ row }) => {
        const businessName = row.original.businessName;
        const locationName = row.original.locationName;

        return (
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{businessName}</span>
                <span className="font-medium text-sm">{locationName}</span>
            </div>
        )
    }
  },
    
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "quantity",
        header: "Month(s)",
    },
    {
        accessorKey: "subscriptionPackageName",
        header: "Subscription Package",
    },
    {
      accessorKey: "provider",
      header: "Provider",
    },
    {
      accessorKey: "dateCreated",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("dateCreated") as string;
        const formatted = Intl.DateTimeFormat('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }).format(new Date(date));
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <div className={`py-1 px-2 text-white rounded-sm items-center ${status === "SUCCESS" ? "bg-emerald-500" : "bg-red-500"}`}>
            {String(status)}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} />,
  },
  
]