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

export type feedbackProp ={
  ownerId:string
}

export function FeedbackDialog({ownerId}:feedbackProp) {

  return (
    <Dialog>
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
          <RecordFeedbackForm ownerId={ownerId}/>
        </div>
       
      </DialogContent>
    </Dialog>
  )
}
