'use client'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react"
import { signOut} from "@/lib/actions/auth/signIn"
import { useRouter } from "next/navigation"

interface userProps {
    displayName?:string,
    email?:string
}
export function UserAvatar({user}:{user: userProps}) {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut()
    }

    const redirectToDashboard = () => {
        router.push("/dashboard")
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-1">
                 <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">
                        {user?.displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                    </p>
                </div>   
                <Avatar className="h-9 w-9">
                    <AvatarImage src="/favicon.png" alt="Settlo" />
                    <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 m-3">
                <DropdownMenuItem onClick={redirectToDashboard}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={ ()=> router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4 " color="red" />
                    <span className="text-red-600"> Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
