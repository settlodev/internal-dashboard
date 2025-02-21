"use client"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User } from "@/types/users/type"

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "user_type",
    header: "User Type",
  },
  {
    accessorKey: "role[0].name",
    header: "Role",

    cell: ({ row }) => {
      const role = row.original.role
      console.log(role)
      return (
        <div className="flex flex-col">
          <div className="font-medium">{role?.name}</div>
        </div>
      )
    }
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]