import { UUID } from "crypto";

export declare interface Owner  {
        id: UUID;
        firstName: string;
        lastName: string;
        avatar:string;
        bio:string;
        email: string;
        phoneNumber: string;
        region: string;
        district:string;
        ward:string;
        areaCode:string;
        identificationId:string;
        municipal:string;
        referredCodeBy: string;
        referredByCode: string;
        emailVerified: Date;
        consent: boolean;
        theme: string;
        phoneNumberVerified: Date;
        totalLocations: number;
        country: string;
        countryName: string;
        isMigrated: boolean;
        status: boolean;
        canDeleted: boolean;
        isArchived:boolean
        isOwner:boolean
        businessComplete:boolean
        locationComplete:boolean
        gender:string
        dateCreated:Date
    }