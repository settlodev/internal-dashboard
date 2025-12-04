// 'use client'
//
// import { useState, useEffect } from 'react';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { searchRoles } from '@/lib/actions/role-action';
// import {Role} from "@/types/role/type";
//
// interface RoleSelectProps {
//     label?: string;
//     placeholder?: string;
//     isRequired?: boolean;
//     value?: string;
//     isDisabled?: boolean;
//     description?: string;
//     onChange: (value: string) => void;
// }
//
// const RoleSelect: React.FC<RoleSelectProps> = ({
//                                                    placeholder,
//                                                    isRequired,
//                                                    value,
//                                                    isDisabled,
//                                                    onChange
//                                                }) => {
//     const [roles, setRoles] = useState<Role[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//
//     useEffect(() => {
//         async function loadRoles() {
//             try {
//                 setIsLoading(true);
//                 const response = await searchRoles();
//
//                 // The response should have content array
//                 if (response && response.content) {
//                     setRoles(response.content);
//                 } else {
//                     setRoles([]);
//                 }
//             } catch (error) {
//                 console.error("Error fetching roles:", error);
//                 setRoles([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         loadRoles();
//     }, []);
//
//     // Handle loading state
//     if (isLoading) {
//         return (
//             <Select disabled={true}>
//                 <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Loading roles..." />
//                 </SelectTrigger>
//             </Select>
//         );
//     }
//
//     return (
//         <Select
//             value={value}
//             disabled={isDisabled || isLoading}
//             required={isRequired}
//             onValueChange={onChange}
//         >
//             <SelectTrigger className="w-full">
//                 <SelectValue placeholder={placeholder || "Select role for user"} />
//             </SelectTrigger>
//             <SelectContent>
//                 {roles.length > 0 ? (
//                     // Use role.name as both value and key since there's no id
//                     roles.map((role) => (
//                         <SelectItem
//                             key={role.name}
//                             value={role.name}
//                         >
//                             {role.name}
//                         </SelectItem>
//                     ))
//                 ) : (
//                     <SelectItem value="no-roles" disabled>
//                         No roles available
//                     </SelectItem>
//                 )}
//             </SelectContent>
//         </Select>
//     );
// }
//
// export default RoleSelect;

'use client'

import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { searchRoles } from '@/lib/actions/role-action';
import {Role} from "@/types/role/type";

interface RoleSelectProps {
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    value?: string;
    isDisabled?: boolean;
    description?: string;
    onChange: (value: string) => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({
                                                   placeholder,
                                                   isRequired,
                                                   value,
                                                   isDisabled,
                                                   onChange
                                               }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadRoles() {
            try {
                setIsLoading(true);
                const response = await searchRoles();

                if (response && response.content) {
                    setRoles(response.content);
                } else {
                    setRoles([]);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
                setRoles([]);
            } finally {
                setIsLoading(false);
            }
        }
        loadRoles();
    }, []);

    if (isLoading) {
        return (
            <Select disabled={true}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Loading roles..." />
                </SelectTrigger>
            </Select>
        );
    }

    return (
        <Select
            value={value}
            disabled={isDisabled || isLoading}
            required={isRequired}
            onValueChange={onChange}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder || "Select role for user"} />
            </SelectTrigger>
            <SelectContent>
                {roles.length > 0 ? (
                    roles.map((role) => (
                        <SelectItem
                            key={role.id}
                            value={role.id}
                        >
                            {role.name}
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem value="no-roles" disabled>
                        No roles available
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
}

export default RoleSelect;