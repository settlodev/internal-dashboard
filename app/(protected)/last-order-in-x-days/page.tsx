
import Loading from '@/components/widgets/loader'
import { ProtectedComponent } from '@/components/auth/protectedComponent'
import Unauthorized from '@/components/code/401'
import { businessOwnersWithLastOrderPlacedInXDays,} from '@/lib/actions/business-owners';
import { BusinessOwnersWithLastOrdersPlacedInXDays } from '@/components/orders/last-orders';

type Params = { 
  searchParams: Promise<{ 
      search?: string; 
      page?: string; 
      limit?: string; 
  }> 
};

const breadcrumbItems = [
  { title: "Have not placed order", link: "/no-orders" },
]

async function Page({ searchParams }: Params) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 0;
  const size = Number(resolvedSearchParams.limit) || 10;

  try {
    const data = await businessOwnersWithLastOrderPlacedInXDays(page, size, undefined, undefined, 5)

    const sortedUsersWithLastBusinessOrder = data.content.sort((a:any, b:any) => 
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
        <BusinessOwnersWithLastOrdersPlacedInXDays
          initialBusinessOwners={sortedUsersWithLastBusinessOrder}
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