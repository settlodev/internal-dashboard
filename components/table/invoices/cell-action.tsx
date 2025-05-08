'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import { Invoice } from "@/types/invoice/type";
import { ProtectedComponent } from "@/components/auth/protectedComponent";

interface CellActionProps {
    data: Invoice;
}

export function CellAction({ data }: CellActionProps) {
   
    const router = useRouter();

    return (
        <>
         <ProtectedComponent 
        requiredPermissions={['view:invoice-actions']}
        >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/invoices/details/${data?.id}`)}>
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/invoices/${data?.id}`)}>
                        Edit Invoice
                    </DropdownMenuItem>
                   
                    {/* <DropdownMenuItem onClick={() => handleDeleteUser(data.id)} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
            </ProtectedComponent> 
        </>
    );
}
