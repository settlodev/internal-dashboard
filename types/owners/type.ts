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


    export declare interface FollowUp{
        id:string,
        nextFollowUpDate:Date,
        remarks:string,
        userId:string,
        internalProfileId:string,
        internalFollowupId:string,
        userFirstName:string,
        userLastName:string,
        userPhone:string,
        userEmail:string,
        internalProfileFirstName:string
        internalProfileLastName:string,
        internalFollowUpTypeName:string,
        dateCreated:string
    }

   