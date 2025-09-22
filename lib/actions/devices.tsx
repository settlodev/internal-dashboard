'use server'

import { posDeviceSchema } from "@/types/devices/schema"
import { z } from "zod"
import { createClient } from "../supabase/server"
import { parseStringify } from "../utils"
import { PosDevices } from "@/types/devices/type"

export async function fetchDevices(): Promise<PosDevices[]> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('internal_pos_devices')
            .select('*');

        if (error) {
            console.error(error);
            throw new Error(`Database error: ${error.message}`);
        }

       
        return parseStringify(data);
    } catch (error) {
        console.error('Unexpected error:', error);
        throw error; 
    }
}

export async function createDevice(values:z.infer<typeof posDeviceSchema>) {
    const validData = posDeviceSchema.safeParse(values);

    console.log(validData)

    if (!validData.success) {
        return parseStringify({
            responseType:"error",
            message:"Please fill all the fields before submitting",
            error: new Error(validData.error.message),
            status:400
        })
    }
    
   try {
    const supabase = await createClient()
    const { error } = await supabase.from('internal_pos_devices').insert([validData.data]).single()
    if (error) {
        console.error(error.message )
        throw new Error(`Database error: ${error.message}`)
    }

   } catch (error) {
    console.log("The error while creating device is",error)
    return parseStringify({
        responseType:"error",
        message:"Something went wrong",
        error: new Error("Something went wrong"),
        status:400
    })
   }
   return parseStringify({
    responseType:"success",
    message:"Device created successfully",
    status:200,
    redirect:"/devices"
   })
}

export async function updateDevice(id:string,values:z.infer<typeof posDeviceSchema>) {
    if(!id){
        return parseStringify({
            responseType:"error",
            message:"Please fill all the fields before submitting",
            error: new Error("Please fill all the fields before submitting"),
            status:400
        })
    }
    const validData = posDeviceSchema.safeParse(values);
    if (!validData.success) {
        return parseStringify({
            responseType:"error",
            message:"Please fill all the fields before submitting",
            error: new Error(validData.error.message),
            status:400
        })
    }
    
   try {
    const supabase = await createClient()
    const { error } = await supabase.from('internal_devices').update([validData.data]).single()
    if (error) {
        console.log(error)
        throw new Error(`Database error: ${error.message}`)
    }
   } catch (error) {
    
    return parseStringify({
        responseType:"error",
        message:"Something went wrong",
        error: new Error("Something went wrong"),
        status:400
    })
   }
   return parseStringify({
    responseType:"success",
    message:"Device updated successfully",
    status:200,
    redirect:"/devices"
   })
}

export async function fetchDeviceById(id: string): Promise<PosDevices | null> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('internal_pos_devices')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { 
                return null;
            }
            console.error(error);
            throw new Error(`Database error: ${error.message}`);
        }

        return parseStringify(data);
    } catch (error) {
        console.error('Unexpected error:', error);
        throw error;
    }
}