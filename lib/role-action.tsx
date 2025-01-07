'use server'
import { Role } from "@/types/role/type"
import { createClient } from "./supabase/server"
import { parseStringify } from "./utils"
import { UUID } from "crypto"

export const fetchAllRoles = async (): Promise<Role[]> => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('roles').select('*').order('name', { ascending: true })
    if (error) {
        console.log(error)
    }
    return parseStringify(data)
}

export const getRole = async (id:UUID): Promise<Role> =>{
    const supabase = await createClient()

const {data,error} = await supabase
                     .from('roles')
                     .select('*')
                     .eq('uuid',id)
                     .single();
                 

    if(error){
        console.log(error)
    }
    return parseStringify(data)
}