import { UUID } from "crypto";

export declare interface User{
    id:UUID,
    email:string,
    roles:string,
    phone:string,
    firstName:string,
    lastName:string,
    password:string,
    status:string,
    canDeleted:boolean,
    isArchived:boolean

}