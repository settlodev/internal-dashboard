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
    user:{
        id: string,
        email: string,
        last_signed_in_at: string,
    },
    profile: {
        first_name: string,
        last_name: string
    }
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
                <div className="">
                <div className="flex items-center gap-1 lg:border lg:border-emerald-200 lg:rounded-md lg:px-2 lg:py-1">
                 <div className="hidden lg:flex flex-col gap-1">
                    <p className="text-sm font-bold leading-none">
                        {user?.profile?.first_name} {user?.profile?.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user?.user.email}
                    </p>
                </div>   
                <Avatar className="h-9 w-9">
                    <AvatarImage src="/favicon.png" alt="Settlo" />
                    <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
                </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 m-3">
                <DropdownMenuItem onClick={redirectToDashboard}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={ ()=> router.push(`/profile/${user?.user.id}`)}>
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
