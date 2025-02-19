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

// export async function getUserPermissions(userId: string): Promise<string[]> {
//     const supabase = await createClient();
  
//     const { data, error } = await supabase
//       .from('internal_user_roles')
//       .select(`
//         role:internal_roles (
//           id,
//           name,
//           permissions:internal_role_permissions (
//             permission:internal_permissions (
//               id,
//               name,
//               slug,
//               module:internal_modules (
//                 id,
//                 name,
//                 slug
//               )
//             )
//           )
//         )
//       `)
//       .eq('user_id', userId)
  
//     if (error) throw error
  
//     // Flatten permissions from all roles
//     const permissions = new Set<string>()
//     data?.forEach(({ role }) => {
//       role.permissions.forEach(({ permission }) => {
//         permissions.add(permission.slug)
//       })
//     })
    
    
  
//     return parseStringify(Array.from(permissions));
//   }

//   export async function hasPermission(userPermissions: string[], requiredPermission: string) {
//     return userPermissions.includes(requiredPermission)
//   }