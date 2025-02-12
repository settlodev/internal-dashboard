import { UUID } from "crypto";
import { getActiveSubscription, getLocation, getLocationSubscriptionPayments } from "@/lib/actions/location";
import LocationDetailClient from "@/components/widgets/location";


const LocationDetailPage = async ({params}: {params: {id: string}}) => {
    const location = await getLocation(params.id as UUID);
    const payments = await getLocationSubscriptionPayments(params.id as UUID);
    const activeSubscription = await getActiveSubscription(params.id as UUID);
    
    return <LocationDetailClient location={location} payments={payments} activeSubscription={activeSubscription} />;
};

export default LocationDetailPage;