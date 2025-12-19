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
    "newTotalLocations": number,
    "totalLocationSubscriptions": number,
    "activeLocationSubscriptions": number,
    "inactiveLocationSubscriptions": number,
    "newLocationSubscriptions": number,
    "renewedLocationSubscriptions": number,
    "churnedLocationSubscriptions": number,
    "newTotalWarehouses": number,
    "totalWarehouseSubscriptions": number,
    "activeWarehouseSubscriptions": number,
    "inactiveWarehouseSubscriptions": number,
    "renewedWarehouseSubscriptions": number,
    "newWarehouseSubscriptions": number,
    "churnedWarehouseSubscriptions": number
}
