'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";

import { Subscription } from "@/types/location/type";
import { fetchSubscriptions } from "@/lib/actions/subscriptions";
import { Subscriptions } from "@/types/subscription/type";

interface Props {
    label?: string;
    placeholder: string;
    isRequired?: boolean;
    value?: string | Subscription;
    isDisabled?: boolean;
    description?: string;
    onChange: (value: string | Subscription) => void;
    onBlur?: () => void;
}
function SubscriptionPackageSelector({
    placeholder,
    value,
    isDisabled,
    onChange,
}: Props) {
    const [packages, setPackage] = useState<Subscriptions[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadSubscriptionPackages() {
            try {
                setIsLoading(true);
                const packageList = await fetchSubscriptions();
                setPackage(packageList);
            } catch (error: any) {
                console.log("Error fetching devices:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadSubscriptionPackages();
    }, []);

    const selectedValue = typeof value === 'object' && value !== null ? value.id : value;
    const handleSelectionChange = (packageId: string) => {
        const selectedPackage = packages.find((subscriptionPackage) => subscriptionPackage.id === packageId);
        // Pass the full owner object to the parent component
        if (selectedPackage) {
            onChange(selectedPackage as unknown as Subscription);
        } else {
            onChange(packageId);
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
                    placeholder={placeholder || "Select package"}
                />
            </SelectTrigger>
            <SelectContent>
                {packages.map((subscriptionPackage) => (
                    <SelectItem
                        key={subscriptionPackage.id}
                        value={subscriptionPackage.id}
                    >
                        {subscriptionPackage.packageName}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        
    </div>
    )
}
export default SubscriptionPackageSelector