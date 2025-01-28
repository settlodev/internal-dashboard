import { BriefcaseBusiness, ChartColumn, MapPin, Settings2, Users } from "lucide-react"

const data = {

    navMain: [
      {
        title: "Analytics",
        url: "#",
        icon: ChartColumn,
        isActive: true,
        items: [
          {
            title: "Statistics",
            url: "/dashboard",
          },
        ]
      },
      {
        title: "User Management",
        url: "#",
        icon: Users,
        isActive: true,
        items: [
          {
            title: "owners",
            url: "/owners",
          },
          {
            title: "user",
            url: "/users",
          },
        ],
      },
      {
        title: "Business Management",
        url: "#",
        icon: BriefcaseBusiness,
        items: [
          {
            title: "Business",
            url: "/businesses",
          },
          {
            title: "Business Types",
            url: "business-types",
          },
          
        ],
      },
      {
        title: "Business Location",
        url: "#",
        icon: MapPin,
        items: [
          {
            title: "Locations",
            url: "/locations",
          },
          
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Roles",
            url: "roles",
          },
          {
            title: "Permissions",
            url: "#",
          },
          
        ],
      },
    ],
   
  }
  export default data