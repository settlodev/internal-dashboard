'use client'
import React, { useState } from 'react';
import { 
    CircleCheckIcon, 
    CircleXIcon, 
    ClockIcon, 
    UserIcon, 
    MapPinIcon, 
    TagIcon, 
    InfoIcon 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequestSubscriptionById, approveSubscriptionRequest, rejectSubscriptionRequest } from '@/lib/actions/location';
import { BreadcrumbNav } from '@/components/layout/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';


const STATUS_CONFIG = {
    'pending': { 
        color: 'text-yellow-500', 
        icon: ClockIcon, 
        label: 'Pending Approval' 
    },
    'approved': { 
        color: 'text-green-500', 
        icon: CircleCheckIcon, 
        label: 'Approved' 
    },
    'rejected': { 
        color: 'text-red-500', 
        icon: CircleXIcon, 
        label: 'Rejected' 
    }
};

const RequestSubscriptionDetailPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [request, setRequest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, setIsPending] = useState(false);

    // Fetch data on component mount
    React.useEffect(() => {
        const fetchRequest = async () => {
            try {
                const requestedSubscription = await getRequestSubscriptionById(params.id);
                console.log("The fetched request", requestedSubscription)
                setRequest(requestedSubscription);
                setIsLoading(false);
            } catch (error) {
                // toast.error('Failed to fetch subscription request');
                setIsLoading(false);
            }
        };

        fetchRequest();
    }, [params.id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleApprove = async () => {
        setIsPending(true);
        try {
            await approveSubscriptionRequest(params.id,request);
            // toast.success('Subscription request approved');
            router.push('/requests');
        } catch (error) {
            // toast.error('Failed to approve subscription request');
        } finally {
            setIsPending(false);
        }
    };

    const handleReject = async () => {
        setIsPending(true);
        try {
            await rejectSubscriptionRequest(params.id);
            // toast.success('Subscription request rejected');
            router.push('/requests');
        } catch (error) {
            // toast.error('Failed to reject subscription request');
        } finally {
            setIsPending(false);
        }
    };

    // Breadcrumb items
    const breadcrumbItems = [
        { title: "Requests", link: "/requests" },
        { title: "Details", link: "" },
    ];

    // If loading, show a loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If no request found
    if (!request) {
        return <div>No subscription request found</div>;
    }

    // Determine status configuration
    const StatusConfig = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
    const StatusIcon = StatusConfig.icon;

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className={`flex items-center justify-between mb-4`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
            </div>
            <Card className="shadow-xl">
                <CardContent>
                    <Card className="mt-4">
                        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                            <CardTitle className="flex items-center space-x-3">
                                <StatusIcon className={`w-8 h-8 ${StatusConfig.color}`} />
                                <span>Subscription Request Details</span>
                            </CardTitle>
                            <Badge 
                                variant="outline" 
                                className={`${StatusConfig.color} border-2 font-bold`}
                            >
                                {StatusConfig.label}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div>
                                    <div className="space-y-4">
                                        <DetailRow 
                                            icon={TagIcon} 
                                            label="Reference Number" 
                                            value={request.reference} 
                                        />
                                        <DetailRow 
                                            icon={UserIcon} 
                                            label="Quantity" 
                                            value={request.quantity.toString()} 
                                        />
                                        <DetailRow 
                                            icon={MapPinIcon} 
                                            label="Location" 
                                            value={request.location} 
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div>
                                    <div className="space-y-4">
                                        <DetailRow 
                                            icon={InfoIcon} 
                                            label="Payment Type" 
                                            value={request.payment_type} 
                                        />
                                        <DetailRow 
                                            icon={ClockIcon} 
                                            label="Requested At" 
                                            value={formatDate(request.created_at)} 
                                        />
                                        {request.description && (
                                            <DetailRow 
                                                icon={InfoIcon} 
                                                label="Description" 
                                                value={request.description} 
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex space-x-4 justify-end">
                                <div className="flex h-5 items-center space-x-4 mt-10">
                                    
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={handleReject}
                                            disabled={isPending}
                                            className="text-red-500 hover:bg-red-50 px-4 py-2 rounded"
                                        >
                                            Reject
                                        </button>
                                        <Separator orientation="vertical" />
                                        <button 
                                            onClick={handleApprove}
                                            disabled={isPending}
                                            className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded"
                                        >
                                            {isPending ? 'Processing...' : 'Approve'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
};

// Reusable component for detail rows
const DetailRow = ({ 
    icon: Icon, 
    label, 
    value 
}: { 
    icon: React.ComponentType<{className?: string}>, 
    label: string, 
    value: string 
}) => (
    <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-gray-500" />
        <div>
            <p className="text-sm text-gray-600 font-medium">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);

export default RequestSubscriptionDetailPage;