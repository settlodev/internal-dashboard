"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { FollowUp} from "@/types/owners/type"

export const columns: ColumnDef<FollowUp>[] = [
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
        accessorKey:'internalProfileFirstName',
        header:'Follow Up By',
        cell: ({ row }) => {
          const firstName = row.original.internalProfileFirstName
          const lastName = row.original.internalProfileLastName
          
          return (
              <div className="flex flex-col space-y-1">
                  <div className="flex items-center">
                      <span>{firstName} {lastName}</span>
                  </div>
                  
              </div>
          )
      }
    },
   
    {
        id: "contact",
        header: "Contacted Customer",
        cell: ({ row }) => {
            const customerFirstName = row.original.userFirstName
            const customerLastName = row.original.userLastName
            const customerRemarks = row.original.remarks
            
            return (
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-1">Customer Name:</span>
                        <span>{customerFirstName} {customerLastName}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-1">Remarks:</span>
                        <span className="text-sm truncate">{customerRemarks}</span>
                    </div>
                </div>
            )
        }
    },
    {
      accessorKey: "dateCreated",
      header: "Follow Up Date",
      cell: ({ row }) => {
        const date = row.original.dateCreated;
        if (!date) return "-";
        
        try {
          return new Intl.DateTimeFormat('en-US').format(new Date(date));
        } catch {
          return "Invalid date";
        }
      }
    },
    {
      accessorKey: "nextFollowUpDate",
      header: "Next Follow Up Date",
      cell: ({ row }) => {
        const nextDate = row.original.nextFollowUpDate;
        if (!nextDate) return "-";
        
        try {
          return new Intl.DateTimeFormat('en-US').format(new Date(nextDate));
        } catch {
          return "Invalid date";
        }
      }
    }

]