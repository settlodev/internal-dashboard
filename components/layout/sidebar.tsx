"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { CompanyDetail } from "./company-details"
import data from "@/constants/menuItems"
import { checkUserPermissions } from "@/lib/actions/auth/signIn"
import Loading from "@/app/(auth)/loading"
import { getUserWithProfile } from "@/lib/actions/user-actions"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [permissions, setPermissions] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    const fetchPermissions = async () => {
      const { permissions, error } = await checkUserPermissions()
      const user = await getUserWithProfile()

      // console.log("The permissions", permissions)
      if (error) {
        console.error("Permission error:", error)
      }
      setPermissions(permissions || [])
      setUser(user)
      setIsLoading(false)
    }

    fetchPermissions()
  }, [])

  // Filter navigation items based on user permissions
  const filteredNavItems = data.navMain
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) => !item.requiredPermission || permissions.includes(item.requiredPermission)
      ),
    }))
    .filter((category) => category.items.length > 0) // Remove empty categories

    // console.log(filteredNavItems)

  if (isLoading) return <div>
    <Loading />
  </div>

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyDetail user={user}/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>
      <SidebarFooter>
        {/* Add footer content if needed */}
        {/* <NavUser/> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
