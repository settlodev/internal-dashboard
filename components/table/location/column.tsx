"use client"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Location } from "@/types/location/type"


export const columns: ColumnDef<Location>[] = [
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
        accessorKey: "name",
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
          const locationName = row.original.name;
  
          return (
              <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{businessName}</span>
                  <span className="font-medium text-sm">{locationName}</span>
              </div>
          )
      }
    },
    
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "locationBusinessTypeName",
        header: "Business Type",
    },
    {
      accessorKey:"subscriptionStatus",
      header:"Sub. Status"
    },
    {
      accessorKey: "subscriptionStartDate",
      header: "Sub. Start Date",
      cell: ({ row }) => {
          const date = row.getValue("subscriptionStartDate") as string | null;
          if (!date) return "-";
          return new Date(date).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          });
      }
  },
  {
    accessorKey: "subscriptionEndDate",
    header: "Sub. End Date",
    cell: ({ row }) => {
      const date = row.getValue("subscriptionEndDate") as string | null;
      if (!date) return "-";
      return new Date(date).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      });
  }
},
    {
      accessorKey: "dateCreated",
      header: "Date Created",
      cell: ({ row }) => {
          const date = new Date(row.getValue("dateCreated"));
          return date.toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          });
      }
  },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
]