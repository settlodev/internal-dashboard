import { Header } from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getUserWithProfile} from "@/lib/actions/user-actions";

export default async function MainLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    const user = await getUserWithProfile();
    console.log(user)
    return (
        <SidebarProvider>
            <div className="flex w-full">
                <AppSidebar />
                <main className="w-full flex-1">
                    <Header user={user}/>
                    {children}
                </main>
            </div>
        </SidebarProvider>

    )
}