'use client'
import { Users, Tag, Filter, Globe } from 'lucide-react';
import {useState} from "react";

const audienceOptions = [
    { id: 'all', label: 'All Customers', icon: Globe, count: 1250 },
    { id: 'segment', label: 'Segment', icon: Filter, count: null },
    { id: 'business', label: 'By Business Type', icon: Tag, count: null },
    { id: 'manual', label: 'Manual Selection', icon: Users, count: null },
];

const businessTypes = [
    { id: 'retail', label: 'Retail', count: 320 },
    { id: 'restaurant', label: 'Restaurant', count: 180 },
    { id: 'service', label: 'Service Business', count: 210 },
    { id: 'ecommerce', label: 'E-commerce', count: 95 },
    { id: 'other', label: 'Other', count: 445 },
];

export default function AudienceSelector({ selected, onChange }:{ selected: any, onChange: any }) {
    const [selectedBusinessTypes, setSelectedBusinessTypes] = useState([]);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Audience
            </h2>

            {/* Audience Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {audienceOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                        <button
                            key={option.id}
                            onClick={() => onChange(option.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                                selected === option.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <Icon className="h-5 w-5 text-gray-600" />
                                {option.count && (
                                    <span className="text-sm font-medium text-gray-500">
                    {option.count}
                  </span>
                                )}
                            </div>
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                {option.label}
              </span>
                        </button>
                    );
                })}
            </div>

            {/* Business Type Filter (Conditional) */}
            {selected === 'business' && (
                <div className="border-t pt-6 mt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                        Select Business Types
                    </h3>
                    <div className="space-y-2">
                        {businessTypes.map((type) => (
                            <label
                                key={type.id}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        // checked={selectedBusinessTypes.includes(type.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                // setSelectedBusinessTypes([...selectedBusinessTypes, type.id]);
                                            } else {
                                                setSelectedBusinessTypes(
                                                    selectedBusinessTypes.filter(id => id !== type.id)
                                                );
                                            }
                                        }}
                                        className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <span className="ml-3 text-gray-900">{type.label}</span>
                                </div>
                                <span className="text-sm text-gray-500">{type.count} users</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Audience Summary */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-900">
                            Selected: {selected === 'all' ? 'All Customers' : 'Custom Segment'}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                            {selected === 'all'
                                ? '1,250 customers will receive this message'
                                : selectedBusinessTypes.length > 0
                                    ? `${selectedBusinessTypes.reduce((acc, type) => {
                                        const business = businessTypes.find(b => b.id === type);
                                        return acc + (business?.count || 0);
                                    }, 0)} customers selected`
                                    : 'Select business types to see audience size'
                            }
                        </p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View Audience Details →
                    </button>
                </div>
            </div>
        </div>
    );
}