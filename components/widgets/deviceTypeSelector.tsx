import { DeviceType } from "@/types/enum";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface DeviceTypeSelectorProps {
    label: string;
    placeholder: string;
    isRequired?: boolean;
    value?: string;
    isDisabled?: boolean;
    description?: string;
    onChange: (value: string) => void;
    onBlur: () => void;
}
function DeviceTypeSelector({
    placeholder,
    value,
    isDisabled,
    onChange,
}: DeviceTypeSelectorProps) {

    return (
        <Select value={value} onValueChange={onChange} disabled={isDisabled}>
              <SelectTrigger>
                    <SelectValue placeholder={placeholder ||"Select device type "} />
                </SelectTrigger>
            <SelectContent>
                <SelectItem key={DeviceType.Tablet} value={DeviceType.Tablet}>
                    Tablet
                </SelectItem>
                <SelectItem key={DeviceType.Printer} value={DeviceType.Printer}>
                   Printer
                </SelectItem>
                <SelectItem key={DeviceType.Scanner} value={DeviceType.Scanner}>
                   Scanner
                </SelectItem>
                <SelectItem key={DeviceType.CashDrawer} value={DeviceType.CashDrawer}>
                   Cash Drawer
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
export default DeviceTypeSelector