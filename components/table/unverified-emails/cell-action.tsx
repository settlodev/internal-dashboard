

'use client';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal} from "lucide-react";
import { useRouter } from "next/navigation";
import { Owner } from "@/types/owners/type";

interface CellActionProps {
    data: Owner;
}

export function CellAction({ data }: CellActionProps) {
    const router = useRouter();

    return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
            onClick={() => {
                router.push(`/owners/${data?.id}`);
            }}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
            onClick={() => {
                router.push(`/owners/${data?.id}`);
            }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    );
}