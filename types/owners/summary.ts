export interface UserSummary {
    userDetails: UserDetails;
    businessDetails: BusinessDetails[];
  }
  
  export interface UserDetails {
    id: string;
    region: string;
    emailVerified: string; 
    email: string;
    lastName: string;
    firstName: string;
    phoneNumber: string;
    dateCreated: string; 
    gender: "MALE" | "FEMALE" | "OTHER"; 
    accountNumber: string;
    district: string;
    ward: string;
    areaCode: string;
    identificationId: string;
    municipal: string;
    bio: string;
  }
  
  export interface BusinessDetails {
    id: string;
    name: string;
    businessCreationDate: string; 
    locationDetails: LocationDetails[];
    warehouseDetails: WarehouseDetails[];
  }
  
  export interface LocationDetails {
    locationId: string;
    locationName: string;
    locationCreationDate: string; 
    lastSubscriptionEndDate: string; 
    lastSubscriptionPackageName: string;
  }
  
  export interface WarehouseDetails {
    warehouseId: string;
    warehouseName: string;
    warehouseCreationDate: string; 
    lastSubscriptionEndDate: string; 
  }
  