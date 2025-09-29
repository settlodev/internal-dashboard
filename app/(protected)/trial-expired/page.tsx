

import Loading from '@/components/widgets/loader'
import { ProtectedComponent } from '@/components/auth/protectedComponent'
import Unauthorized from '@/components/code/401'
import { trialExpired } from '@/lib/actions/business-owners';
import { LocationSubscriptionExpiresInXDays } from '@/components/subscriptions/expires-in-x';
import { TrialExpired } from '@/components/subscriptions/trial-expired';

type Params = { 
  searchParams: Promise<{ 
      search?: string; 
      page?: string; 
      limit?: string; 
  }> 
};

const breadcrumbItems = [
  { title: "Trial Subscription Expired", link: "/trial-expired" },
]

async function Page({ searchParams }: Params) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 0;
  const size = Number(resolvedSearchParams.limit) || 10;

  try {
    // Pass default 5 days for initial load
    const data = await trialExpired(page, size, undefined, undefined)

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
        <TrialExpired
          initialBusinessOwners={sortedUsersWithIcomplete}
          totalElements={data.totalElements}
          searchParams={resolvedSearchParams}
          breadcrumbItems={breadcrumbItems}
        />
      </ProtectedComponent>
    );
  } catch (error) {
    console.error('Error fetching business owners whose trial expired:', error);
    throw error;
  }
}

export default Page;