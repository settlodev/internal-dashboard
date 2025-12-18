import { UUID } from "crypto"

export declare interface Subscriptions {
    id: UUID
    amount: number
    packageName: string 
}

export interface SubscriberData {
    totalSubscribers: number;
    activeSubscribers: number;
    newSubscribers: number;
    renewedSubscribers: number;
    inactiveSubscribers: number;
    churnedSubscribers: number;
    newTotalUsers:number;
}
