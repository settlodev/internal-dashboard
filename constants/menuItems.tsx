import { group } from "console";
import { User } from "lucide-react";

const menuItems = [
    {   group: "User Management",
        items: [
            {
                label: "users",
                href: "/",
                icon: <User className="mr-2 h-4 w-4" />
            }
        ]
    },
    {
        group:"Business",
        items: [
            {
                label: "businesses",
                href: "/businesses",
                icon: <User className="mr-2 h-4 w-4" />
            },
        ]
    },
    {
        group:"Business Location",
        items: [
            {
                label: "locations",
                href: "/locations",
                icon: <User className="mr-2 h-4 w-4" />
            },
        ]
    },
    
];

export default menuItems