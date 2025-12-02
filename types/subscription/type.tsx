import { UUID } from "crypto"

export declare interface Subscriptions {
    id: UUID
    amount: number
    packageName: string 
}

export interface SubscriberData {
    activeSubs: number;
    newSubs: number;
    renewedSubs: number;
    inactiveSubs: number;
    monthlyChurn: number;
}
