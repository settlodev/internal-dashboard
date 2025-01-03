import { BreadcrumbNav } from "@/components/layout/breadcrumbs";

const breadcrumbItems = [
    { title: "Locations", link: "/locations" },
]
export default function Dashboard() {
    return (
            <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
                
            </div>
            </div>
    );
}