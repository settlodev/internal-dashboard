// 'use client'
// import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
// import { columns } from '@/components/table/owners/column'
// import { DataTable } from '@/components/table/data-table'
// import { Card, CardContent } from '@/components/ui/card'
// import React, { useEffect, useState } from 'react'
// import { Owner } from '@/types/owners/type'
// import { searchBusinessOwners } from '@/lib/actions/business-owners'
// import Loading from '@/components/widgets/loader'
// import { ProtectedComponent } from '@/components/auth/protectedComponent'
// import Unauthorized from '@/components/code/401'
// import BusinessOwnerSummary from '@/components/owners/business-owner-summary'
// import { DatePickerWithRange } from '@/components/widgets/date-range-picker'
// import { FilterOption, UniversalFilters } from '@/components/filter/universalfilter'


// const breadcrumbItems = [
//   { title: "Business owners", link: "/owners" },
// ]

// type Params = { 
//   searchParams: Promise<{ 
//       search?: string; 
//       page?: string; 
//       limit?: string; 
//   }> 
// };

// const BUSINESS_OWNER_FILTERS: FilterOption[] = [
//   {
//     key: "isMigrated",
//     label: "Migrated",
//     options: [
//       { label: "Yes", value: "true" },
//       { label: "No", value: "false" },
//     ]
//   },
//   {
//     key: "gender",
//     label: "Gender",
//     options: [
//       { label: "Male", value: "MALE" },
//       { label: "Female", value: "FEMALE" },
//       { label: "Undisclosed", value: "UNDISCLOSED" }
//     ]
//   }
// ];

// export default function page({ searchParams }: Params) {
//   const resolvedSearchParams = await searchParams;
//   const [businessOwners, setBusinessOwners] = useState<Owner[]>([])
//   const [isLoading, setIsLoading] = useState(true);

//   const [filteredBusinessOwners, setFilteredBusinessOwners] = useState<Owner[]>([])
//   const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
//     const today = new Date();
//     return {
//       from: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), 
//       to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
//     };
//   });
//   const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});


//   const fetchBusinessOwners = async () => {
//     // const page = 0;
//     // const size = 10; 

//     const page = Number(resolvedSearchParams.page) || 0;
//     const size = Number(resolvedSearchParams.limit) || 10;
    
//     try {
//       const data = await searchBusinessOwners({page,size})

//       const sortedOwners = data.content.sort((b, a) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());

//       console.log("The sorted business owners are",sortedOwners)

//       setBusinessOwners(sortedOwners);
      
//       filterBusinessOwner(sortedOwners, dateRange, selectedFilters);
//     } catch (error) {
//       throw error
//     }
//     finally {
//       setIsLoading(false);
//     }

//   }

//   const filterBusinessOwner = (
//     data: Owner[],
//     range: { from: Date; to: Date },
//     filters: Record<string, string>
//   ) => {

//     console.log("The owners passed on the filter are",data)
  
//     const filteredOwners = data.filter(sub => {
      
//       const isWithinDateRange =
//         new Date(sub.dateCreated) >= range.from &&
//         new Date(sub.dateCreated) <= range.to;

//       const passesAdditionalFilters = Object.entries(filters).every(([key, value]) => {
//         if (value === 'all') return true;

//         if (key === 'isMigrated') {
          
//           return sub[key as keyof Owner] === (value === "true");
//         }

//         return sub[key as keyof Owner] === value;
//       });

//       return isWithinDateRange && passesAdditionalFilters;
//     });

//     console.log("The filterd business owners are as follow",filteredOwners)

//     setFilteredBusinessOwners(filteredOwners);
//   }

  
  

//   useEffect(() => {
//     fetchBusinessOwners()
//   }, [])

//   useEffect(() => {
//     filterBusinessOwner(businessOwners, dateRange, selectedFilters);
//   }, [dateRange, businessOwners, selectedFilters]);

//   const handleDateRangeChange = (newRange: { from: Date; to: Date }) => {
//     setDateRange(newRange);
//   }

//   const handleFilterChange = (filterKey: string, value: string) => {
//     setSelectedFilters(prev => ({
//       ...prev,
//       [filterKey]: value
//     }));
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-lg">
//           <Loading />
//         </div>
//       </div>
//     );
//   }
//   return (
//     <ProtectedComponent
//       requiredPermission="view:owners"
//       loading={
//         <div className="flex items-center justify-center">
//           <Loading />
//         </div>
//       }
//       fallback={
//         <Unauthorized />}
//     >
//       <div className='flex flex-col w-full h-full px-4 sm:px-6 md:px-8'>
//   <div className='flex flex-col space-y-4 md:space-y-6 mb-3 w-full'>
//     <div className='w-full mt-2'>
//       <BreadcrumbNav items={breadcrumbItems} />
//     </div>

//     {/* Filters section - converted to stack on mobile, side-by-side on larger screens */}
//     <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 w-full'>
//       <div className='w-full lg:w-1/2'>
//         <UniversalFilters
//           filters={BUSINESS_OWNER_FILTERS}
//           onFilterChange={handleFilterChange}
//           selectedFilters={selectedFilters}
//         />
//       </div>

//       <div className='w-full lg:w-1/2 lg:flex lg:justify-end'>
//         <DatePickerWithRange
//           value={{
//             from: dateRange.from,
//             to: dateRange.to
//           }}
//           onChange={(newRange) => {
//             if (newRange?.from && newRange?.to) {
//               handleDateRangeChange({ from: newRange.from, to: newRange.to });
//             }
//           }}
//           className="w-full"
//         />
//       </div>
//     </div>
//   </div>

//   <div className='w-full mb-6'>
//     <BusinessOwnerSummary
//       owners={businessOwners}
//       dateRange={dateRange}
//       selectedFilters={selectedFilters}
//     />
//   </div>

//   <div className='w-full overflow-x-auto'>
//     <Card className="w-full">
//       <CardContent className="p-2 sm:p-4 md:p-6">
//         <DataTable
//           columns={columns}
//           data={filteredBusinessOwners || businessOwners}
//           searchKey=''
//         />
//       </CardContent>
//     </Card>
//   </div>
// </div>
//     </ProtectedComponent>
//   )
// }


import Loading from '@/components/widgets/loader'
import { ProtectedComponent } from '@/components/auth/protectedComponent'
import Unauthorized from '@/components/code/401'
import { IncompleteSetup } from '@/components/incomplete-setup/incomplete-setup'
import { searchBusinessOwners, usersWithIncompleteBusinessSetup } from '@/lib/actions/business-owners';
import { BusinessOwnerComponent } from '@/components/owners/owner-component';

type Params = { 
  searchParams: Promise<{ 
      search?: string; 
      page?: string; 
      limit?: string; 
  }> 
};

const breadcrumbItems = [
  { title: "Business Owners", link: "/owners" },
]

async function Page({ searchParams }: Params) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 0;
  const size = Number(resolvedSearchParams.limit) || 10;

  try {
    const data = await searchBusinessOwners(page,size)

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
        <BusinessOwnerComponent
          initialBusinessOwners={sortedUsersWithIcomplete}
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