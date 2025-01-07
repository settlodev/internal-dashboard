import { User } from "@/types/users/type"
import { createClient } from "./supabase/server"
import { parseStringify } from "./utils"


export const fetchAllUsers = async (): Promise<User[]> => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles')  
    .select(`
        id,
        first_name,
        last_name,
        phone,
        roles (name)
      `);
    console.log("The data", data)
    if (error) {
        console.log(error)
    }
    return parseStringify(data)
}