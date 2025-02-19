import { UUID } from "crypto";

export declare interface Role{
    id: UUID;
    name: string;
    description: string;
}
export interface Permission {
    id: string;
    moduleId: string;
    name: string;
    slug: string;
  }

  export declare interface RolePermissions {
    permissions: {
      permission: Permission[]; 
    }[];
  }