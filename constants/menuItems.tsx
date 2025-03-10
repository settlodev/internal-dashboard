import { BriefcaseBusiness, CalendarSync, ChartColumn, MapPin, Settings2,Users } from "lucide-react"

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
          requiredPermission: "view:analytics",
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: Users,
      // isActive: true,
      items: [
        {
          title: "Owners",
          url: "/owners",
          requiredPermission: "view:owners",
        },
        {
          title: "Users",
          url: "/users",
          requiredPermission: "view:users",
        },
        {
          title: "Profile",
          url: "/profile",
          requiredPermission: "view:profile",
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
          requiredPermission: "view:businesses",
        },
        // {
        //   title: "Business Types",
        //   url: "/business-types",
        //   requiredPermission: "manage_business_types",
        // },
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
          requiredPermission: "view:locations",
        },
      ],
    },
    {
      title: "Subscriptions",
      url: "#",
      icon: CalendarSync,
      items: [
        {
          title: "Subscriptions",
          url: "/subscriptions",
          requiredPermission: "view:requests",
        },
        // {
        //   title: "Requests",
        //   url: "/requests",
        //   requiredPermission: "view:subscriptions",
        // },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Roles",
          url: "/roles",
          requiredPermission: "view:roles",
        },
        
      ],
    },
  ],
}

export default data
