'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UpdatePasswordForm } from "@/components/forms/update-password-form";
import { deleteUser } from "@/lib/actions/auth/signIn";
import { User } from "@/types/users/type";

interface CellActionProps {
    data: User;
}

export function CellAction({ data }: CellActionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDeleteUser = async (userId: string) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete user ${data.email}? This action cannot be undone.`
        );

        if (!confirmDelete) return;

        setIsDeleting(true);
        const response = await deleteUser(userId);

        if (!response.error) {
            alert(`User ${data.email} has been deleted successfully.`);
            router.refresh(); // Refresh the list after deletion
        } else {
            alert(`Failed to delete user: ${response.error}`);
        }
        setIsDeleting(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/users/${data?.id}`)}>
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                        Update password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteUser(data.id)} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Password Update Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Password</DialogTitle>
                        <DialogDescription>Update password for user {data.email}</DialogDescription>
                    </DialogHeader>
                    <UpdatePasswordForm userId={data.id} />
                </DialogContent>
            </Dialog>
        </>
    );
}
