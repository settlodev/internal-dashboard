import { UUID } from "crypto"
import { boolean } from "zod"

export declare interface Location{
    id: UUID,
    name:string,
    phone:string,
    email:string,
    city:string,
    region:string,
    street:string,
    address:string,
    description:string,
    image:string,
    openingTime: string
    closingTime: string
    business: UUID,
    locationBusinessType:string,
    locationBusinessTypeName:string,
    subscriptionStatus:string,
    settings:Settings
    status: boolean,
    canDelete: boolean,
    isArchived: boolean
}

export declare interface Settings{
    id: UUID
    minimumSettlementAmount: number,
    systemPasscode:string,
    currencyCode: string,
    reportsPasscode: string,
    ecommerceEnabled: boolean,
    enableNotifications: boolean,
    useRecipe: boolean
    usePasscode: boolean
    useDepartments:boolean
    useCustomPrice:boolean
    useWarehouse: boolean
    useShifts: boolean,
    showPosProductQuantity:boolean
    useKds:boolean
    locationId:UUID,
    canDelete: boolean,
    isDefault: boolean,
    isActive: boolean,
    isArchived: boolean
       
         
}