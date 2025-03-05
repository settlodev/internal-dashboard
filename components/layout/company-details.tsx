"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import {
  DropdownMenu,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


export function CompanyDetail({ user }: Readonly<{ user: any }>) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size- items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Plus className="size-8" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Settlo Internal Dashboard
                </span>
                <span className="truncate text-xs">Signed In as: {user?.profile.role.name.toUpperCase()}</span>
                <span className="truncate text-xs">
                  Last signedIn: {user?.user.last_sign_in_at
                    ? new Date(user.user.last_sign_in_at).toLocaleString()
                    : 'Never'}
                </span>
              </div>

            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
