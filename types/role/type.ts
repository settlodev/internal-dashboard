import { UUID } from "crypto";

export declare interface Role{
    id: UUID;
    name: string;
    description: string;
    // permissions: string[];
}