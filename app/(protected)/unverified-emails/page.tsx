
import Loading from '@/components/widgets/loader'
import { ProtectedComponent } from '@/components/auth/protectedComponent'
import Unauthorized from '@/components/code/401'
import { searchUnverifiedBusinessOwners } from '@/lib/actions/business-owners'
import { UnverifiedEmailsClient } from '@/components/unverified/unverified-emails-client'

type Params = {
    searchParams: Promise<{
        search?: string;
        page?: string;
        limit?: string;
        startDate?: string;
        endDate?: string;
    }>
};

const breadcrumbItems = [
    { title: "Unverified emails", link: "/unverified-emails" },
]

async function Page({ searchParams }: Params) {
    const resolvedSearchParams = await searchParams;
    const q = resolvedSearchParams.search || "";
    const page = Number(resolvedSearchParams.page) || 0;
    const size = Number(resolvedSearchParams.limit) || 10;
    const startDate = resolvedSearchParams.startDate;
    const endDate = resolvedSearchParams.endDate;

    try {
        const data = await searchUnverifiedBusinessOwners({
            q,
            page,
            size,
            startDate,
            endDate
        });

        return (
            <ProtectedComponent
                requiredPermission="view:owners"
                loading={
                    <div className="flex items-center justify-center">
                        <Loading />
                    </div>
                }
                fallback={<Unauthorized />}
            >
                <UnverifiedEmailsClient
                    initialBusinessOwners={data.content}
                    totalElements={data.totalElements}
                    searchParams={resolvedSearchParams}
                    breadcrumbItems={breadcrumbItems}
                />
            </ProtectedComponent>
        );
    } catch (error) {
        console.error('Error fetching unverified business owners:', error);
        throw error;
    }
}

export default Page;