import { BriefcaseBusiness, MapPin, Settings2, Users } from "lucide-react"

const data = {

    navMain: [
      {
        title: "User Management",
        url: "#",
        icon: Users,
        isActive: true,
        items: [
          {
            title: "user",
            url: "/users",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
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
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
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