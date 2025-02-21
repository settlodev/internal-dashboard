import { UUID } from "crypto";

export declare interface Role{
    id: UUID;
    name: string;
    description: string;
    permissions: RolePermissions[]
}
export interface Permission {
    id: string;
    moduleId: string;
    name: string;
    slug: string;
    module: Module;
  }

  export declare interface RolePermissions {
    [x: string]: any;
    id: any;
    isSelected: boolean;
    permissions: {
      permission: Permission[]; 
    }[];
  }

  interface Module {
    id: string;
    name: string;
    slug: string;
  }