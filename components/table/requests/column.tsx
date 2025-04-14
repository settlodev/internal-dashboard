"use client"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RequestSubscription } from "@/types/location/type"


export const columns: ColumnDef<RequestSubscription>[] = [
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
        accessorKey: "location_name",
        header: ({ column }) => {
            return (
                  <Button
          variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Location
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
      accessorKey: "reference",
      header: "Reference",
  },
    
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "payment_type",
        header: "Payment Type",
    },
    {
      accessorKey: "userData",
      header: "Requested By",
      cell: ({ row }) => {
        const userData = row.getValue("userData") as { first_name: string; last_name: string } | null;
        return userData ? `${userData.first_name} ${userData.last_name}` : "";
      },
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    // {
    //     accessorKey: "approved_by",
    //     header: "Approved By",
    //     cell: ({ row }) => row.getValue("approved_by")?.name,
        
    // },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
]