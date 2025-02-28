'use client';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal} from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/types/users/type";
import { useState } from "react";
import { UpdatePasswordForm } from "@/components/forms/update-password-form";

interface CellActionProps {
    data: User;
}

export function CellAction({ data }: CellActionProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              router.push(`/users/${data?.id}`);
            }}
          >
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsModalOpen(true)}
          >
            Update password
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
            <DialogDescription>
              Update password for user {data.email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <UpdatePasswordForm userId={data.id} onSuccess={() => setIsModalOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}