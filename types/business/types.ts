import { UUID } from "crypto";

export declare interface Business {
    id: UUID,
    name: string,
    prefix: string,
    email: string,
    phone: string,
    businessType: BusinessType[],
    totalLocations: number,
    country: string,
    vdfRegistration: string,
    address: string
    status: boolean
    canDeleted: boolean
    isArchived:boolean
}

export declare interface BusinessType {
    id: UUID | string,
    name: string
    status: boolean
    canDeleted: boolean
    isArchived:boolean
}