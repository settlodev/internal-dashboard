'use server'
import { Role } from "@/types/role/type"
import { UUID } from "crypto"
import { createClient } from "../supabase/server"
import { parseStringify } from "../utils"
import { z } from "zod"
import { RoleSchema } from "@/types/role/schema"
import {ApiResponse} from "@/types/types";
import ApiClient from "@/lib/api-client";

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

export const createRole = async (value:z.infer<typeof RoleSchema>)=> {
    const validData = RoleSchema.safeParse(value);
    if (!validData.success) {
        return parseStringify({
            responseType:"error",
            message:"Please fill all the fields before submitting",
            error: new Error(validData.error.message),
            status:400
        })
    }
    const role = {
        name: validData.data.name.toLowerCase(),
        description: validData.data.description
    }
    const supabase = await createClient()

    try {
        const { data, error } = await supabase.from('internal_roles').insert([role]).single()
        if (error) {
            console.log(error)
        }
        return parseStringify(data)
    } catch (error) {
        console.log(error)
    }
}



export async function getRoleById(id: string): Promise<Role | undefined> {
    const supabase = await createClient();
  
    try {
      // First, get the role data
      const { data: role, error: roleError } = await supabase
        .from('internal_roles')
        .select('*')
        .eq('id', id)
        .single();
  
      if (roleError) throw roleError;
  
      // Then, get all permissions with their modules
      const { data: allPermissions, error: permError } = await supabase
        .from('internal_permissions')
        .select(`
          id,
          name,
          slug,
          module:internal_modules (
            id,
            name,
            slug
          )
        `);
  
      if (permError) throw permError;
  
      // Get the role's permissions to know which ones are selected
      const { data: rolePermissions, error: rolePermError } = await supabase
        .from('internal_role_permissions')
        .select('permission_id')
        .eq('role_id', id);
  
      if (rolePermError) throw rolePermError;
  
      // Create a Set of permission IDs that are associated with the role
      const selectedPermissionIds = new Set(rolePermissions.map(rp => rp.permission_id));
  
      // Transform the permissions to include a selected status
      const formattedPermissions = allPermissions.map(permission => ({
        permission: {
          ...permission,
          isSelected: selectedPermissionIds.has(permission.id)
        }
      }));
  
      // console.log('Formatted permissions:', formattedPermissions);
  
      return parseStringify({
        ...role,
        permissions: formattedPermissions
      });
  
    } catch (error) {
      console.error('Error fetching role data:', error);
    }
  }

  export async function updateRolePermissions(
    roleId: string, 
    permissions: Record<string, boolean>  
) {
    const supabase = await createClient();

    try {
        // Fetch existing permissions
        const { data: existingPerms, error: existingError } = await supabase
            .from('internal_role_permissions')
            .select('permission_id, is_default')
            .eq('role_id', roleId);

        if (existingError) throw existingError;

        const existingPermSet = new Set(existingPerms.map(p => p.permission_id));
        const defaultPermSet = new Set(
            existingPerms.filter(p => p.is_default).map(p => p.permission_id)
        );

        const permissionsToAdd = Object.entries(permissions)
            .filter(([permId, isSelected]) => isSelected && !existingPermSet.has(permId))
            .map(([permId]) => ({ permission_id: permId, is_default: false }));

        const permissionsToRemove = Object.entries(permissions)
            .filter(([permId, isSelected]) => 
                !isSelected && 
                existingPermSet.has(permId) && 
                !defaultPermSet.has(permId)
            )
            .map(([permId]) => permId);

        // console.log("Sending to Supabase:", {
        //     role_id_param: roleId,
        //     permissions_to_add: permissionsToAdd, 
        //     permissions_to_remove: permissionsToRemove,
        // });

        // Call Supabase function
        const { error: updateError } = await supabase.rpc('update_role_permissions', {
            role_id_param: roleId,
            permissions_to_add: permissionsToAdd.length > 0 ? permissionsToAdd : null,
            permissions_to_remove: permissionsToRemove.length > 0 ? permissionsToRemove : null
        });

        if (updateError) throw updateError;

        return { success: true };

    } catch (error) {
        console.error('Error updating role permissions:', error);
        return { 
            success: false, 
            error: 'Failed to update role permissions' 
        };
    }
}

export const searchRoles = async (
): Promise<ApiResponse<Role>> => {
    const page = 0;
    const pageLimit = 500;
    try {
        const apiClient = new ApiClient();

        const query = {
            filters: [
            ],
            sorts: [
                {
                    key: "name",
                    direction: "ASC",
                },
            ],
            page: page ? page - 1 : 0,
            size: pageLimit ? pageLimit : 10,
        };

        const rolesData = await apiClient.post(
            '/api/internal/internal-roles',
            query,
        );

        return parseStringify(rolesData);
    } catch (error) {
        throw error;
    }
};
