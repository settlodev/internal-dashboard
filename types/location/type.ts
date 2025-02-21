import { UUID } from "crypto"

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

export declare interface ActiveSubscription{
    id:UUID,
    startDate:Date,
    endDate:Date,
    subscriptionStatus:string,
    location:UUID
    active:boolean
    isTrial:boolean
    status:boolean
    canDelete: boolean
    isArchived: boolean
    subscription:Subscription
}

export declare interface Subscription{
    id:UUID,
    amount:number,
    discount:number,
    packageName:string,
    packageCode:string,
    isDefault:boolean
    status:boolean
    canDelete: boolean
    isArchived: boolean
    subscriptionFeatures:SubscriptionFeature[]
    includedSubscriptions:IncludedSubscriptions[]
    extraFeatures:ExtraFeature[]
}
export declare interface SubscriptionFeature{
    id:UUID,
    name:string,
    code:string
    status:boolean
    canDelete: boolean
    isArchived: boolean
}

export declare interface IncludedSubscriptions{
    packageName:string,
    packageCode:string
}

export declare interface ExtraFeature{
    id:UUID,
    name:string,
    code:string
    status:boolean
    canDelete: boolean
    isArchived: boolean
}
export declare interface RequestSubscription{
    id:UUID,
    reference:string,
    quantity:number,
    description:string,
    payment_type:string,
    location:UUID
    user_id:UUID
    approved_by:UUID
    status:string,
    canDelete: boolean
    isArchived: boolean,
    created_at:string
}