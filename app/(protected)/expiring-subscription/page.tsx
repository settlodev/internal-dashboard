

import Loading from '@/components/widgets/loader'
import { ProtectedComponent } from '@/components/auth/protectedComponent'
import Unauthorized from '@/components/code/401'
import { subscriptionExpiresInXDays } from '@/lib/actions/business-owners';
import { LocationSubscriptionExpiresInXDays } from '@/components/subscriptions/expires-in-x';

type Params = { 
  searchParams: Promise<{ 
      search?: string; 
      page?: string; 
      limit?: string; 
  }> 
};

const breadcrumbItems = [
  { title: "Subscription Expires In X days ", link: "/expiring-subscription" },
]

async function Page({ searchParams }: Params) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 0;
  const size = Number(resolvedSearchParams.limit) || 10;

  try {
    // Pass default 5 days for initial load
    const data = await subscriptionExpiresInXDays(page, size, undefined, undefined, 5)

    const sortedUsersWithIcomplete = data.content.sort((a:any, b:any) => 
      new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );

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
        <LocationSubscriptionExpiresInXDays
          initialBusinessOwners={sortedUsersWithIcomplete}
          totalElements={data.totalElements}
          searchParams={resolvedSearchParams}
          breadcrumbItems={breadcrumbItems}
        />
      </ProtectedComponent>
    );
  } catch (error) {
    console.error('Error fetching business owners who expires in x days:', error);
    throw error;
  }
}

export default Page;