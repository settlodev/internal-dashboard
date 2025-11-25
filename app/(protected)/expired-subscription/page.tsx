

import Loading from '@/components/widgets/loader'
import { ProtectedComponent } from '@/components/auth/protectedComponent'
import Unauthorized from '@/components/code/401'
import { expiredSubscription} from '@/lib/actions/business-owners';
import { ExpiredSubscription } from '@/components/subscriptions/expired-subscription';

type Params = { 
  searchParams: Promise<{ 
      search?: string; 
      page?: string; 
      limit?: string; 
  }> 
};

const breadcrumbItems = [
  { title: "Expired Subscription", link: "/expired-subscription" },
]

async function Page({ searchParams }: Params) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 0;
  const size = Number(resolvedSearchParams.limit) || 10;

  try {
    
    const data = await expiredSubscription(page, size)

    const customersWithExpiredSub = data.content

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
        <ExpiredSubscription
          initialBusinessOwners={customersWithExpiredSub}
          totalElements={data.totalElements}
          searchParams={resolvedSearchParams}
          breadcrumbItems={breadcrumbItems}
        />
      </ProtectedComponent>
    );
  } catch (error) {
    console.error('Error fetching business owners with subscription expired:', error);
    throw error;
  }
}

export default Page;