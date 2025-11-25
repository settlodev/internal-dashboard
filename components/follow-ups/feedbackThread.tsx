'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { UUID } from 'crypto';
import { Skeleton } from '@/components/ui/skeleton';
import { userFollowUpThreads } from "@/lib/actions/followups/followuptypes";

interface FollowUpThread {
    id: string;
    userFirstName: string;
    userLastName: string;
    userEmail: string;
    userPhoneNumber: string;
    userGender: string;
    internalProfileFirstName: string;
    internalProfileLastName: string;
    internalFollowUpTypeName: string;
    remarks: string;
    dateCreated: string;
    nextFollowUpDate: string | null;
    previousUserFollowUpFeedbackId: string | null;
}

interface FeedbackThreadProps {
    userId: string;
}

export const FeedbackThread: React.FC<FeedbackThreadProps> = ({ userId }) => {
    const [threads, setThreads] = useState<FollowUpThread[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                setIsLoading(true);
                const data = await userFollowUpThreads(userId as UUID);
                setThreads(data || []);
            } catch (err) {
                console.error("Failed to load feedback threads:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchThreads();
    }, [userId]);

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffInDays === 1) {
            return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const formatFollowUpDate = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getFollowUpTypeColor = (typeName: string) => {
        const colorMap: { [key: string]: string } = {
            'Unverified Account': 'bg-amber-100 text-amber-800 border-amber-200',
            'Incomplete Registration': 'bg-blue-100 text-blue-800 border-blue-200',
            'Follow Up': 'bg-green-100 text-green-800 border-green-200',
            'Issue Resolution': 'bg-red-100 text-red-800 border-red-200',
        };
        return colorMap[typeName] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    if (isLoading) {
        return (
            <Card className="border-0 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                        Communication Thread
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (threads.length === 0) {
        return (
            <Card className="border-0 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                        Communication Thread
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No communication history available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                        Communication Thread
                        <Badge variant="secondary" className="ml-2">
                            {threads.length} {threads.length === 1 ? 'entry' : 'entries'}
                        </Badge>
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="h-4 w-4" />
                                Collapse
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4" />
                                Expand
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="pt-6">
                    <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-indigo-300 to-transparent dark:from-indigo-800 dark:via-indigo-700" />

                        <div className="space-y-6">
                            {threads.map((thread, index) => (
                                <div key={thread.id} className="relative pl-14">
                                    <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white dark:border-gray-900 shadow-lg z-10" />

                                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <Avatar className="h-10 w-10 border-2 border-indigo-100">
                                                        <AvatarFallback className="text-sm bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700">
                                                            {getInitials(thread.internalProfileFirstName, thread.internalProfileLastName)}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                                {thread.internalProfileFirstName} {thread.internalProfileLastName}
                                                            </p>
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-xs ${getFollowUpTypeColor(thread.internalFollowUpTypeName)}`}
                                                            >
                                                                {thread.internalFollowUpTypeName}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{formatDateTime(thread.dateCreated)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                {thread.remarks}
                                            </p>

                                            {thread.nextFollowUpDate && (
                                                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-indigo-600" />
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            Next follow-up scheduled:
                                                        </span>
                                                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                                            {formatFollowUpDate(thread.nextFollowUpDate)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {index < threads.length - 1 && (
                                        <div className="absolute left-6 top-16 w-0.5 h-6 bg-indigo-200 dark:bg-indigo-800" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="relative pl-14 mt-6">
                            <div className="absolute left-4 top-0 w-4 h-4 rounded-full bg-gray-300 border-4 border-white dark:border-gray-900" />
                            <p className="text-sm text-gray-500 italic">Start of communication history</p>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};