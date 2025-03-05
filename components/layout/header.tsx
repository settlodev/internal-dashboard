"use client"

import { UserAvatar } from "./avatar";
import { useSidebar } from "../ui/sidebar";

type HeaderProps = {
  user: Awaited<ReturnType<typeof import("@/lib/actions/user-actions").getUserWithProfile>> | null
}

function HeaderToggle() {
  const { toggleSidebar } = useSidebar()
  
  return (
    <button onClick={toggleSidebar} className="md:hidden lg:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 bg-emerald-400 rounded-md">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    </button>
  )
}

export function Header({ user }: HeaderProps) {
  // console.log(user)
  return (
    <header className="flex w-full justify-between lg:justify-end items-center p-3 bg-gray-100">
      {/* <div className="flex items-center gap-2"> */}
        <HeaderToggle />
        {user && <UserAvatar user={user as any}/>}
   
    </header>
  );
}

// In a parent server component or layout
// import { userWithInSession } from "@/lib/actions/user-actions";
// import { Header } from "./header";

// export default async function Page() {
//   const user = await userWithInSession();
  
//   return (
//     <div>
//       <Header user={user} />
//       {/* Rest of your page content */}
//     </div>
//   )
// }