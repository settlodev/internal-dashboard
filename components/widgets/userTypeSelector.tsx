'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  interface UserTypeSelectProps {
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    value?: string;
    isDisabled?: boolean;
    description?: string;
    onChange: (value: string) => void;
  }
  
  const data = [
    {
      id: 'staff',
      name: 'Staff'
    },
    {
      id: 'not_staff',
      name: 'Not Staff'
    }
  ] as const;
  
  const UserTypeSelect: React.FC<UserTypeSelectProps> = ({
    placeholder,
    isRequired,
    value,
    isDisabled,
    onChange
  }) => {
    return (
      <Select
        value={value}
        required={isRequired}
        disabled={isDisabled}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || "Select user type"} />
        </SelectTrigger>
        <SelectContent>
          {data.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  
  export default UserTypeSelect