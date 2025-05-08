// Define the device types as a union of string literals for type safety
export enum DeviceType{
   Tablet = "Tablet",
    Scanner ="Scanner",
    Printer ="Printer",
    CashDrawer ="Cash Drawer",
}
  
  // Define the status types
export enum  Status {
    Available = "Available",
    Unavailable = "Unavailable",
    Reserved = "Reserved",
    Defective = "Defective"
}
      
  // Define the condition types
export enum  Condition {
    New = "New",
    Refurbished = "Refurbished",
    OpenBox = "Open Box",
    Used = "Used",
    Damaged = "Damaged",
   
}

export enum invoiceStatus{
    Pending = "Pending",
    Paid = "Paid",
    Cancelled = "Cancelled",
    Sent = "Sent",
    Draft = "Draft",
    Overdue = "Overdue",
}

export enum invoiceType{
    Device = "Device",
    Subscription = "Subscription",
}