import { UUID } from "crypto";

export declare interface PosDevices{
    id: UUID,
    device_type: string|undefined,
    brand: string,
    model_number: string,
    is_available: boolean,
    selling_price: number,
    technical_specs: object,
    created_at: string,
    updated_at: string
}
