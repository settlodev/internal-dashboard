

import Loading from '@/components/widgets/loader'
import { ProtectedComponent } from '@/components/auth/protectedComponent'
import Unauthorized from '@/components/code/401'
import { trialSubscriptionExpiresInXDays } from '@/lib/actions/business-owners';

import { TrialSubscriptionExpiresInXDays } from '@/components/subscriptions/trial-expires-in-x';


type Params = { 
  searchParams: Promise<{ 
      search?: string; 
      page?: string; 
      limit?: string; 
  }> 
};

const breadcrumbItems = [
  { title: "Trial Subscription Expires In X days ", link: "/trial-expires-in-x-days" },
]

async function Page({ searchParams }: Params) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 0;
  const size = Number(resolvedSearchParams.limit) || 10;


  try {
    // Pass default 5 days for initial load
    const data = await trialSubscriptionExpiresInXDays(page, size, undefined, undefined, 5)

    const sortedUsersWithTrialExpiry = data.content.sort((a:any, b:any) => 
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
        <TrialSubscriptionExpiresInXDays
          initialBusinessOwners={sortedUsersWithTrialExpiry}
          totalElements={data.totalElements}
          searchParams={resolvedSearchParams}
          breadcrumbItems={breadcrumbItems}
        />
      </ProtectedComponent>
    );
  } catch (error) {
    console.error('Error fetching business owners who trial expires in x days:', error);
    throw error;
  }
}

export default Page;