'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";

import { PosDevices } from "@/types/devices/type";
import { fetchDevices } from "@/lib/actions/devices";

interface Props {
    label?: string;
    placeholder: string;
    isRequired?: boolean;
    value?: string | PosDevices;
    isDisabled?: boolean;
    description?: string;
    onChange: (value: string | PosDevices) => void;
    onBlur?: () => void;
}
function DeviceSelector({
    placeholder,
    value,
    isDisabled,
    onChange,
}: Props) {
    const [devices, setDevices] = useState<PosDevices[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadBusinessOwners() {
            try {
                setIsLoading(true);
                const deviceList = await fetchDevices();
                setDevices(deviceList);
            } catch (error: any) {
                console.log("Error fetching devices:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadBusinessOwners();
    }, []);

    const selectedValue = typeof value === 'object' && value !== null ? value.id : value;

    const handleSelectionChange = (deviceId: string) => {
        const selectedDevice = devices.find(device => device.id === deviceId);
        // Pass the full owner object to the parent component
        onChange(selectedDevice || deviceId);
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
                    placeholder={placeholder || "Select device"}
                />
            </SelectTrigger>
            <SelectContent>
                {devices.map((device) => (
                    <SelectItem
                        key={device.id}
                        value={device.id}
                    >
                      {device.brand}{" "}{device.device_type}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        
    </div>
    )
}
export default DeviceSelector