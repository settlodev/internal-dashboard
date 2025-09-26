
'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import { searchFollowUpTypes } from "@/lib/actions/followups/followuptypes";

export type FollowUpType = {
  id: string;
  name: string;
}

interface Props {
    label?: string;
    placeholder: string;
    isRequired?: boolean;
    value?: string | FollowUpType;
    isDisabled?: boolean;
    description?: string;
    onChange: (value: string | FollowUpType) => void;
    onBlur?: () => void;
}
function FollowUpTypeSelector({
    placeholder,
    value,
    isDisabled,
    onChange,
}: Props) {
    const [followUpType, setFollowUpType] = useState<FollowUpType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadFollowUpTypes() {
            try {
                setIsLoading(true);
                const followUpList = await searchFollowUpTypes();
                setFollowUpType(followUpList);
            } catch (error: any) {
                console.log("Error fetching followups:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadFollowUpTypes();
    }, []);

    const selectedValue = typeof value === 'object' && value !== null ? value.id : value;
    const handleSelectionChange = (followupId: string) => {
        const selectedType = followUpType.find((followUpType) => followUpType.id === followupId);
        
        if (selectedType) {
            onChange(selectedType as unknown as FollowUpType);
        } else {
            onChange(followupId);
        }
    }
    return (
        
        <div className="space-y-2">
        <Select
            defaultValue={selectedValue}
            disabled={isDisabled || isLoading}
            value={selectedValue}
            onValueChange={handleSelectionChange}
        >
            <SelectTrigger className="w-full">
                <SelectValue
                    placeholder={placeholder || "Select follow up type"}
                />
            </SelectTrigger>
            <SelectContent>
                {followUpType.map((type) => (
                    <SelectItem
                        key={type.id}
                        value={type.id}
                    >
                        {type.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        
    </div>
    )
}
export default FollowUpTypeSelector