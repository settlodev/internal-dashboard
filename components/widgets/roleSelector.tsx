'use client'
import { Role } from '@/types/role/type';
import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { fetchAllRoles } from '@/lib/actions/role-action';

  interface RoleSelectProps {
    label?:string;
    placeholder?:string;
    isRequired?:boolean;
    value?:string;
    isDisabled?:boolean;
    description?:string;
    onChange: (value: string) => void;
  }
const RoleSelect: React.FC<RoleSelectProps>=({
  placeholder,
  isRequired,
  value,
  isDisabled,
  onChange

})=> {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
useEffect(() => {
  async function loadRoles() {
      try {
          setIsLoading(true);
          const fetchedRoles = await fetchAllRoles();
          setRoles(fetchedRoles);
      } catch (error) {
          console.log("Error fetching roles:", error);
      } finally {
          setIsLoading(false);
      }
  }
  loadRoles();
}, []);

  return (
    <Select
    defaultValue={value}
    disabled={isDisabled || isLoading}
    value={value}
    required={isRequired}
    onValueChange={onChange}
    >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={placeholder || "Select role for user"} />
    </SelectTrigger>
    <SelectContent>
                    {roles.map((role) => (
                        <SelectItem
                            key={role.id}
                            value={role.id}
                        >
                            {role.name}
                        </SelectItem>
                    ))}
                </SelectContent>
    </Select>
  );
}

export default RoleSelect
