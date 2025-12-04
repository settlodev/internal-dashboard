'use client'
import { Smartphone, Mail, Tablet } from 'lucide-react';
import {useState} from "react";

export default function PreviewPanel() {
    const [previewDevice, setPreviewDevice] = useState('desktop');

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Preview
            </h2>

            {/* Device Selector */}
            <div className="flex space-x-2 mb-6">
                {[
                    { id: 'mobile', label: 'Mobile', icon: Smartphone },
                    { id: 'desktop', label: 'Desktop', icon: Tablet },
                    { id: 'email', label: 'Email', icon: Mail },
                ].map((device) => {
                    const Icon = device.icon;
                    return (
                        <button
                            key={device.id}
                            onClick={() => setPreviewDevice(device.id)}
                            className={`flex-1 flex flex-col items-center p-3 rounded-lg border ${
                                previewDevice === device.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200'
                            }`}
                        >
                            <Icon className="h-5 w-5 mb-1" />
                            <span className="text-sm">{device.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Preview Content */}
            <div className={`bg-gray-100 rounded-lg p-4 ${
                previewDevice === 'mobile' ? 'max-w-xs mx-auto' : ''
            }`}>
                {previewDevice === 'mobile' ? (
                    <div className="bg-white rounded-xl p-4 shadow-inner">
                        <div className="h-6 bg-gray-300 rounded mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                ) : previewDevice === 'email' ? (
                    <div className="bg-white rounded-lg p-4">
                        <div className="border-b pb-3 mb-3">
                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Select a message type to see preview
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Recipients</span>
                    <span className="font-medium">1,250</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Cost</span>
                    <span className="font-medium text-green-600">$12.50</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Time</span>
                    <span className="font-medium">Instant</span>
                </div>
            </div>
        </div>
    );
}