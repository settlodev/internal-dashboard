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

interface NavItem {
  title: string;
  url: string;
  requiredPermission?: string;
}

interface NavCategory {
  title: string;
  url: string;
  icon: any;
  items: NavItem[];
  isActive?: boolean;
}

interface PermissionsResponse {
  role_id: string;
  is_admin: boolean;
  role_name: string;
  permissions: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
  }>;
  permission_slugs: string[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userPermissions, setUserPermissions] = React.useState<PermissionsResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { permissions, error } = await checkUserPermissions()
        const user = await getUserWithProfile()

        if (error) {
          console.error("Permission error:", error)
        }

        setUserPermissions(permissions as PermissionsResponse)
        setUser(user)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter navigation items based on user permissions
  const filteredNavItems = React.useMemo(() => {
    if (!userPermissions) return []

    return data.navMain
        .map((category: NavCategory) => ({
          ...category,
          items: category.items.filter((item: NavItem) => {
            // If no permission required, always show
            if (!item.requiredPermission) return true

            // If user is admin, show everything
            if (userPermissions.is_admin) return true

            // Check if user has the required permission slug
            return userPermissions.permission_slugs?.includes(item.requiredPermission) || false
          }),
        }))
        .filter((category) => category.items.length > 0)
  }, [userPermissions])

  if (isLoading) {
    return (
        <div className="h-screen flex items-center justify-center">
          <Loading />
        </div>
    )
  }

  return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <CompanyDetail user={user} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={filteredNavItems} />
        </SidebarContent>
        <SidebarFooter>
          {/* Footer content if needed */}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  )
}