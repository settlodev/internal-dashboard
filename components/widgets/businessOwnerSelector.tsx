'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import { Owner } from "@/types/owners/type";
import { fetchAllBusinessOwners } from "@/lib/actions/business-owners";

interface BusinessOwnerSelectorProps {
    label?: string;
    placeholder: string;
    isRequired?: boolean;
    value?: string | Owner;
    isDisabled?: boolean;
    description?: string;
    onChange: (value: string | Owner) => void;
    onBlur?: () => void;
}

function BusinessOwnerSelector({
    placeholder,
    value,
    isDisabled,
    onChange,
}: BusinessOwnerSelectorProps) {
    const [businessOwners, setBusinessOwners] = useState<Owner[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadBusinessOwners() {
            try {
                setIsLoading(true);
                const getBusinessOwners = await fetchAllBusinessOwners();
                console.log("Business Owners", getBusinessOwners)
                setBusinessOwners(getBusinessOwners);
            } catch (error: any) {
                console.log("Error fetching business owners:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadBusinessOwners();
    }, []);

    // Find the selected owner to show in the select
    const selectedValue = typeof value === 'object' && value !== null ? value.id : value;

    // Handle change to pass full owner object
    const handleSelectionChange = (ownerId: string) => {
        const selectedOwner = businessOwners.find(owner => owner.id === ownerId);
        // Pass the full owner object to the parent component
        onChange(selectedOwner || ownerId);
    };

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
                        placeholder={placeholder || "Select business owner"}
                    />
                </SelectTrigger>
                <SelectContent>
                    {businessOwners.map((owner) => (
                        <SelectItem
                            key={owner.id}
                            value={owner.id}
                        >
                            {owner.firstName} {owner.lastName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default BusinessOwnerSelector