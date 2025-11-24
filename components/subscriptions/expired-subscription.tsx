

'use client'

import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { DataTable } from '@/components/table/data-table'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { columns } from '@/components/table/unverified-emails/column'
import { Owner } from '@/types/owners/type'
import {expiredSubscription} from '@/lib/actions/business-owners'
import { useRouter} from "next/navigation"
import { RefreshCw } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {PageHeader} from "@/components/widgets/pageHeader";

interface Props {
    initialBusinessOwners: Owner[]
    totalElements: number
    searchParams: {
        search?: string
        page?: string
        limit?: string
    }
    breadcrumbItems: { title: string; link: string }[]
}

export function ExpiredSubscription({
                                               initialBusinessOwners,
                                               totalElements,
                                               searchParams,
                                               breadcrumbItems
                                           }: Props) {
    const [businessesOwners, setBusinessesOwners] = useState<Owner[]>(initialBusinessOwners)
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [total, setTotal] = useState(totalElements)

    const router = useRouter()

    const page = Number(searchParams.page) || 0
    const size = Number(searchParams.limit) || 10

    const handleRowClick = (owner: Owner) => {
        router.push(`/owners/${owner.id}`)
    }

    const fetchIncompleteBusinessSetup = async (showRefreshAnimation = false) => {
        if (showRefreshAnimation) {
            setIsRefreshing(true)
        } else {
            setIsLoading(true)
        }

        try {
            const data = await expiredSubscription(page, size)

            const sortedBusinesses = data.content
            setBusinessesOwners(sortedBusinesses)
            setTotal(data.totalElements)
        } catch (error) {
            console.error('Error fetching expired subscriptions:', error)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        fetchIncompleteBusinessSetup()
    }, [page, size])


    if (isLoading && !isRefreshing) {
        return (
            <div className="flex flex-col w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-6">
                <div className="flex flex-col space-y-4 md:space-y-6 mb-4 md:mb-6 w-full">
                    <Skeleton className="h-4 w-64" />
                    <div className="flex flex-col lg:flex-row items-start gap-4 lg:items-center lg:justify-between w-full">
                        <div className="flex flex-col gap-3 flex-1">
                            <Skeleton className="h-8 w-80" />
                            <Skeleton className="h-4 w-96" />
                        </div>
                        <Skeleton className="h-10 w-64" />
                    </div>
                </div>
                <Card className="w-full">
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className='flex flex-col w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
            <div className='flex flex-col space-y-4 md:space-y-6 mb-4 md:mb-6 w-full'>
                <div className='w-full mt-2'>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>

                <PageHeader
                    title="Expired Subscriptions"
                    description="Customers whose subscription has expired."
                    totalCount={total}
                    badgeColor="red"
                />
            </div>

            <div className='w-full overflow-x-auto flex-1'>
                <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200 border-0">
                    <CardContent className="p-0 sm:p-0">
                        <div className={`relative ${isRefreshing ? 'opacity-60' : ''}`}>
                            {isRefreshing && (
                                <div className="absolute inset-0 bg-white/50 dark:bg-gray-950/50 z-10 flex items-center justify-center">
                                    <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                                </div>
                            )}
                            <DataTable
                                columns={columns}
                                data={businessesOwners}
                                searchKey=''
                                total={total}
                                pageSize={size || 10}
                                showIndex={true}
                                onRowClick={handleRowClick}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}