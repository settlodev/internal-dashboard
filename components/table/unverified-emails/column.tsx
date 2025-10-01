"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
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
        id: "name",
        header: "Full Name",
        cell: ({ row }) => {
            const first_name = row.original.firstName
            const last_name = row.original.lastName
            
            return (
                <div className="flex space-y-1">
                    <div className="flex items-center">
                    <p className="text-xs text-black mr-1">{first_name} {last_name}</p>                    </div>
                </div>
            )
        }
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
        accessorKey:'emailVerified',
        header:"Email Verified",
        cell: ({row})=>{
            const unverified = row.getValue("emailVerified");
            if(unverified === null){
               return <p className="text-red-500">False</p>
            }
        }
    },
   
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
]