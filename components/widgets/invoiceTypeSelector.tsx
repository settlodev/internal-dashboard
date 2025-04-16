import {invoiceType } from "@/types/enum";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface InvoiceTypeSelectorProps {
    label: string;
    placeholder: string;
    isRequired?: boolean;
    value?: string;
    isDisabled?: boolean;
    description?: string;
    onChange: (value: string) => void;
    onBlur: () => void;
}
function InvoiceType({
    placeholder,
    value,
    isDisabled,
    onChange,
}: InvoiceTypeSelectorProps) {

    return (
        <Select value={value} onValueChange={onChange} disabled={isDisabled}>
              <SelectTrigger>
                    <SelectValue placeholder={placeholder ||"Select invoice type "} />
                </SelectTrigger>
            <SelectContent>
                <SelectItem key={invoiceType.Device} value={invoiceType.Device}>
                    Tablet
                </SelectItem>
                <SelectItem key={invoiceType.Subscription} value={invoiceType.Subscription}>
                   Printer
                </SelectItem>
               
            </SelectContent>
        </Select>
    )
}
export default InvoiceType