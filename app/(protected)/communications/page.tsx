'use client'
import { useState } from 'react';
// import MessageHistory from './MessageHistory';
// import PreviewPanel from "@/components/messaging/preview_panel";
import AudienceSelector from "@/components/widgets/audienceSelector";
import BroadcastForm from "@/components/forms/broadcast_form";
import MessageHistory from "@/components/widgets/message_history";


export default function BroadcastManager() {
    const [activeTab, setActiveTab] = useState('compose');
    const [selectedAudience, setSelectedAudience] = useState('all');

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Broadcast Messages
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Send SMS, Email, or Push Notifications to your customers
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {['compose', 'history', 'templates'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                {activeTab === 'compose' && (
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <AudienceSelector
                                selected={selectedAudience}
                                onChange={setSelectedAudience}
                            />
                            <BroadcastForm audienceType={selectedAudience} />
                        </div>
                        {/*<div className="lg:col-span-1">*/}
                        {/*    <PreviewPanel />*/}
                        {/*</div>*/}
                    </div>
                )}

                {activeTab === 'history' && <MessageHistory />}
                {/*{activeTab === 'templates' && <TemplatesManager />}*/}
            </div>
        </div>
    );
}