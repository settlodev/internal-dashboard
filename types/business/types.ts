import { UUID } from "crypto";

export declare interface Business {
    id: UUID,
    name: string,
    prefix: string,
    email: string,
    phone: string,
    businessType: BusinessType[],
    businessTypeName: string
    totalLocations: number,
    country: string,
    vfdRegistrationState: boolean,
    identificationNumber: string
    vrn:string
    serial:string
    uin:string
    receiptPrefix:string
    receiptSuffix:string
    receiptImage:string
    logo:string
    slug:string
    storeName:string
    image:string
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
    certificateOfIncorporation: string
    businessIdentificationDocument: string
    businessLicense: string
    memarts: string
    notificationPhone: string
    notificationEmailAddress: string
    description: string
    owner:UUID
    countryName: string
    allocations:Location[]
    dateCreated:Date
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