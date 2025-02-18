'use server'
import { Role } from "@/types/role/type"
import { UUID } from "crypto"
import { createClient } from "../supabase/server"
import { parseStringify } from "../utils"

export const fetchAllRoles = async (): Promise<Role[]> => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('internal_roles').select('*').order('name', { ascending: true })
    if (error) {
        console.log(error)
    }
    return parseStringify(data)
}

export const getRole = async (id:UUID): Promise<Role> =>{
    const supabase = await createClient()

const {data,error} = await supabase
                     .from('internal_roles')
                     .select('*')
                     .eq('uuid',id)
                     .single();
                 

    if(error){
        console.log(error)
    }
    return parseStringify(data)
}