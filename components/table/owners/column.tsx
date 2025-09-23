"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CellAction } from "./cell-action"
import { Owner } from "@/types/owners/type"

export const columns: ColumnDef<Owner>[] = [
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
        accessorKey: "firstName",
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
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        id: "contact",
        header: "Contact",
        cell: ({ row }) => {
            const email = row.original.email
            const phoneNumber = row.original.phoneNumber
            
            return (
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-1">Phone:</span>
                        <span>{phoneNumber || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-1">Email:</span>
                        <span className="text-sm truncate">{email || "N/A"}</span>
                    </div>
                </div>
            )
        }
    },
    {
      accessorKey: "isMigrated",
      header: "Migrated",
    },
    {
        accessorKey: "gender",
        header: "Gender"
    },
    {
        accessorKey: "dateCreated",
        header: "Date Registered",
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
      accessorKey: "referredByCode",
      header: "Referral Code" 
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
]