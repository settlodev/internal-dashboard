'use client'
// import {ApiResponse} from "@/types/types";
import {UUID} from "node:crypto";
import {notFound} from "next/navigation";
// import {isNotFoundError} from "next/dist/client/components/not-found";
// import BreadcrumbsNav from "@/components/layouts/breadcrumbs-nav";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { UserForm } from "@/components/forms/user/user-form";
import React from "react";



export default async function UserPage({params}:{params:{id:string}}){

    // const { id } = params; // Directly access params
    const isNewItem =  "new";
    // let item: <Addon> | null = null;

    // if(!isNewItem){
    //     try{
    //         const item = await  (params.id as UUID);
    //         if(item.totalElements == 0) notFound();
    //     }
    //     catch (error){
    //         if(isNotFoundError(error)) throw error;

    //         throw new Error("Failed to load addon details");
    //     }
    // }

    const breadCrumbItems=[{title:"User",link:"/addons"},
        {title: isNewItem ? "New":"Edit",link:""}]

    return(
        <div className={`flex-1 space-y-4 p-4 md:p-8 pt-6`}>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 `}>
                    <BreadcrumbNav items={breadCrumbItems}/>
                </div>
            </div>
            <UserCard isNewItem={isNewItem}/>
        </div>
    )
}

const UserCard =({isNewItem}:{
    isNewItem:boolean,
    // item: Addon | null | undefined
}) =>(
    <Card>
       <CardHeader>
           <CardTitle>
               {isNewItem ? "Add User" : "Edit User details"}
           </CardTitle>
           <CardDescription>
               {isNewItem ? "Add a new user ": "Edit user details"}
           </CardDescription>
       </CardHeader>
        <CardContent>
            <UserForm />
        </CardContent>
    </Card>
)
