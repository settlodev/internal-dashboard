'use client'

import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { DataTable } from '@/components/table/data-table'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Owner } from '@/types/owners/type'
import { DatePickerWithRange } from '@/components/widgets/date-range-picker'
import { columns } from '@/components/table/unverified-emails/column'
import { searchUnverifiedBusinessOwners } from '@/lib/actions/business-owners'
import { RefreshCw } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter, useSearchParams } from "next/navigation"

interface UnverifiedEmailsClientProps {
    initialBusinessOwners: Owner[]
    totalElements: number
    searchParams: {
        search?: string;
        page?: string;
        limit?: string;
        startDate?: string;
        endDate?: string;
    }
    breadcrumbItems: { title: string; link: string }[]
}

export function UnverifiedEmailsClient({
                                           initialBusinessOwners,
                                           totalElements,
                                           searchParams,
                                           breadcrumbItems
                                       }: UnverifiedEmailsClientProps) {
    const [businessOwners, setBusinessOwners] = useState<Owner[]>(initialBusinessOwners)
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)


    const router = useRouter()
    const urlSearchParams = useSearchParams()

    // Initialize date range from URL params or undefined (no filter)
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(() => {
        const startDateParam = searchParams.startDate;
        const endDateParam = searchParams.endDate;

        if (startDateParam && endDateParam) {
            return {
                from: new Date(startDateParam),
                to: new Date(endDateParam)
            };
        }

        return undefined;
    })

    const q = searchParams.search || ""
    const page = Number(searchParams.page) || 0
    const size = Number(searchParams.limit) || 10

    // Update URL with new search params
    const updateURL = (newParams: {
        page?: number;
    }) => {
        const params = new URLSearchParams(urlSearchParams.toString())

        if (newParams.page !== undefined) {
            params.set('page', newParams.page.toString())
        }

        router.push(`?${params.toString()}`)
    }

    const fetchBusinessOwners = async (showRefreshAnimation = false) => {
        if (showRefreshAnimation) {
            setIsRefreshing(true)
        } else {
            setIsLoading(true)
        }

        try {
            const data = await searchUnverifiedBusinessOwners({
                q,
                page,
                size,
                startDate: dateRange?.from.toISOString(),
                endDate: dateRange?.to.toISOString()
            })

            const sortedOwners = data.content.sort((a, b) =>
                new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
            )
            setBusinessOwners(sortedOwners)
        } catch (error) {
            console.error('Error fetching unverified business owners:', error)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    const handleRowClick = (owner: Owner) => {
        router.push(`/owners/${owner.id}`)
    }

    useEffect(() => {
        fetchBusinessOwners()
    }, [q, page, size, dateRange])

    const handleDateRangeChange = (newRange: { from: Date; to: Date } | undefined) => {
        if (newRange?.from && newRange?.to) {
            setDateRange(newRange)

            // Update URL with new date range and reset to page 0
            updateURL({
                page: 0
            })
        } else {
            // Clear date filter
            setDateRange(undefined)
            updateURL({
                page: 0
            })
        }
    }

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
                {/* Breadcrumb */}
                <div className='w-full mt-2'>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
                <div className='flex flex-col lg:flex-row items-start gap-6 lg:items-center lg:justify-between w-full'>
                    {/* Header Content */}
                    <div className='flex flex-col gap-3 flex-1 min-w-0'>
                        <div className='flex items-baseline gap-3 flex-wrap'>
                            <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
                                Emails Not Verified
                            </h2>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        {totalElements.toLocaleString()}
      </span>
                        </div>

                        <div className='flex flex-col gap-1.5'>
                            <p className='text-sm text-muted-foreground leading-relaxed'>
                                Customers who haven't verified their email after registration.
                            </p>

                            {dateRange?.from && dateRange?.to ? (
                                <div className='flex items-center gap-2 text-xs'>
          <span className='inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 font-medium'>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtered: {dateRange.from.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
          })} - {dateRange.to.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
          })}
          </span>
                                    <button
                                        onClick={() => handleDateRangeChange(undefined)}
                                        className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors'
                                        aria-label="Clear date filter"
                                    >
                                        Clear filter
                                    </button>
                                </div>
                            ) : (
                                <span className='inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400'>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Showing all unverified emails
        </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-3 w-full lg:w-auto'>
                        <div className='w-full sm:w-72 flex-shrink-0'>
                            <DatePickerWithRange
                                value={dateRange ? {
                                    from: dateRange.from,
                                    to: dateRange.to
                                } : undefined}
                                onChange={(newRange) => {
                                    handleDateRangeChange(newRange ? {
                                        from: newRange.from!,
                                        to: newRange.to!
                                    } : undefined)
                                }}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
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
                                data={businessOwners}
                                searchKey=''
                                total={totalElements}
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