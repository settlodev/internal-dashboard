import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react";
import RequestSubscriptionForm from "../forms/request_subscription_form";
import { Location } from "@/types/location/type";

export function SubscriptionDialog({location,activeSubscription}:{location:Location,activeSubscription:any}) {
const locationId = location
console.log("The location id to be passed is",locationId.id)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Plus className="w-8 h-8 text-gray-600" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Subscription</DialogTitle>
          <DialogDescription>
            You can request a subscription plan from the admin
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RequestSubscriptionForm location={location} activeSubscription={activeSubscription}/>
        </div>
       
      </DialogContent>
    </Dialog>
  )
}
