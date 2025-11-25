'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import RecordFeedbackForm from "../forms/feedback_form";
import { useState } from "react";

export type feedbackProp = {
    ownerId: string
}

export function FeedbackDialog({ ownerId }: feedbackProp) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="text-xs font-medium" variant='outline'>Record Feedback</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Record Feedback</DialogTitle>
                    <DialogDescription>
                        Please leave remark of what you have speak to the customer.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <RecordFeedbackForm
                        ownerId={ownerId}
                        onSuccess={() => setOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}