import { UUID } from "crypto";
import { getActiveSubscription, getLocation, getLocationActivityLogs, getLocationSubscriptionPayments, getLocationSummary } from "@/lib/actions/location";
import LocationDetailClient from "@/components/widgets/location";
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import Unauthorized from "@/components/code/401";


const LocationDetailPage = async ({params}: {params: {id: string}}) => {
    const location = await getLocation(params.id as UUID);
    const payments = await getLocationSubscriptionPayments(params.id as UUID, 0, 10);
    const activeSubscription = await getActiveSubscription(params.id as UUID);
    const statistics = await getLocationSummary(params.id as UUID);
    const activityLogs = await getLocationActivityLogs(params.id as UUID);

 
    console.log("The active subscription", activeSubscription)
    
    return (
        <ProtectedComponent 
        requiredPermission="view:business-details" 
        fallback={
            <Unauthorized />
        }
    >
        <div>
        <LocationDetailClient location={location} payments={payments} activeSubscription={activeSubscription} statistics={statistics} activityLogs={activityLogs} />
        </div>
        </ProtectedComponent>
    )
    ;
};

export default LocationDetailPage;