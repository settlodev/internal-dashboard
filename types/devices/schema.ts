import { coerce, nativeEnum, object, record, string, z } from "zod";
import { DeviceType} from "../enum";


// Define the validation schema for POS device inventory
export const posDeviceSchema = object({
  device_type: nativeEnum(DeviceType),
  brand: string().min(2, "Brand name must be at least 2 characters").max(100, "Brand name cannot exceed 100 characters"),
  model_number: string().min(2, "Model number must be at least 2 characters").max(100, "Model number cannot exceed 100 characters"),
  selling_price: coerce.number().int("Selling price must be an integer").nonnegative("Selling price cannot be negative"),
  technical_specs: record(z.string(), z.any()).optional(),  
});


