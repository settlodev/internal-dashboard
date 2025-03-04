import { UUID } from "crypto";
import { getActiveSubscription, getLocation, getLocationSubscriptionPayments } from "@/lib/actions/location";
import LocationDetailClient from "@/components/widgets/location";
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import Unauthorized from "@/components/code/401";


const LocationDetailPage = async ({params}: {params: {id: string}}) => {
    const location = await getLocation(params.id as UUID);
    const payments = await getLocationSubscriptionPayments(params.id as UUID);
    const activeSubscription = await getActiveSubscription(params.id as UUID);
    
    return (
        <ProtectedComponent 
        requiredPermission="view:business-details" 
        fallback={
            <Unauthorized />
        }
    >
        <div>
        <LocationDetailClient location={location} payments={payments} activeSubscription={activeSubscription} />
        </div>
        </ProtectedComponent>
    )
    ;
};

export default LocationDetailPage;