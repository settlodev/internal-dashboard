import { BriefcaseBusiness,ChartColumn, MapPin, Receipt, Settings2,Tablet,Users } from "lucide-react"

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
      title: "Business Owners",
      url: "#",
      icon: Users,
      // isActive: true,
      items: [
        {
          title: "Owners",
          url: "/owners",
          requiredPermission: "view:owners",
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
      ],
    },
    {
      title: "Business Location",
      url: "#",
      icon: MapPin,
      items: [
        {
          title: "All Locations",
          url: "/locations",
          requiredPermission: "view:locations",
        },
        {
          title: "Trial Locations",
          url: "/trial-locations",
          requiredPermission: "view:locations",
        },
        {
          title: "Almost Due Locations",
          url: "/almost-due-locations",
          requiredPermission: "view:locations",
        },
        {
          title: "Due Locations",
          url: "/due-locations",
          requiredPermission: "view:locations",
        },
        {
          title: "Expired Locations",
          url: "/expired-locations",
          requiredPermission: "view:locations",
        },
      ],
    },
    // {
    //   title: "Subscriptions",
    //   url: "#",
    //   icon: CalendarSync,
    //   items: [
    //     {
    //       title: "Subscriptions",
    //       url: "/subscriptions",
    //       requiredPermission: "view:subscriptions",
    //     },
    //     {
    //       title: "Requests",
    //       url: "/requests",
    //       requiredPermission: "view:requests",
    //     },
    //   ],
    // },
    {
      title: "Invoices",
      url: "#",
      icon: Receipt,
      items: [
        {
          title: "invoices",
          url: "/invoices",
          requiredPermission: "view:invoices",
        },
       
      ],
    },
    {
      title: "Devices",
      url: "#",
      icon: Tablet,
      items: [
        {
          title: "Devices",
          url: "/devices",
          requiredPermission: "view:devices",
        },
      ],
    },
    {
      title: "Staff Management",
      url: "#",
      icon: Users,
      // isActive: true,
      items: [
        
        {
          title: "Staffs",
          url: "/users",
          requiredPermission: "view:users",
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
          url: "/roles",
          requiredPermission: "view:roles",
        },
        
      ],
    },
  ],
}

export default data
