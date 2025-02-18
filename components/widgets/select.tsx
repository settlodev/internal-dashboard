"use client";

import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    value?: string;
    isDisabled?: boolean;
    onChange: (value: string) => void;
}

const paymentMeans = [
    { value: "cash", label: "Cash" },
    { value: "bank", label: "Bank" },
    { value: "mobile", label: "Mobile Money" },
    { value: "lipa", label: "Lipa" },
];

const PaymentMeansSelector: React.FC<Props> = ({
    value,
    isDisabled,
    onChange,
}) => {
    return (
        <div className="space-y-2">
            <Select
                defaultValue={value}
                disabled={isDisabled}
                value={value}
                onValueChange={onChange}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment means" />
                </SelectTrigger>
                <SelectContent>
                    {paymentMeans.map((mean) => (
                        <SelectItem key={mean.value} value={mean.value}>
                            {mean.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default PaymentMeansSelector;
