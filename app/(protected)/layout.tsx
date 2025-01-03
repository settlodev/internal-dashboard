import { Header } from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <div className="flex w-full">
                <AppSidebar />
                <main className="w-full flex-1">
                    <Header />
                    {children}
                </main>
            </div>
        </SidebarProvider>

    )
}