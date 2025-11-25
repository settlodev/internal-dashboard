import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ErrorDisplay: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl max-w-md text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Failed to load profile</h2>
            <p className="text-red-700 dark:text-red-300">There was an error loading the business owner profile. Please try again later.</p>
        </div>
    </div>
);