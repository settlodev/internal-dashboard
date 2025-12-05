'use client'
import { useState } from 'react';
import {
    MessageSquare,
    Mail,
    Bell,
    Paperclip,
    Smile,
    Send,
    Clock
} from 'lucide-react';

export default function BroadcastForm({ audienceType } :{ audienceType :any }) {
    const [messageType, setMessageType] = useState('email');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [schedule, setSchedule] = useState('now');
    const [scheduledTime, setScheduledTime] = useState('');

    const messageTypes = [
        { id: 'email', label: 'Email', icon: Mail, color: 'text-red-500' },
        { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-green-500' },
        { id: 'push', label: 'Push Notification', icon: Bell, color: 'text-purple-500' },
    ];

    const handleSend = async () => {
        // API call to send broadcast
        const payload = {
            audienceType,
            messageType,
            subject,
            message,
            schedule,
            scheduledTime: schedule === 'later' ? scheduledTime : undefined,
        };

        // Add your API call here
        console.log('Sending:', payload);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Message Type Selection */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Message Type
                </h3>
                <div className="flex space-x-4">
                    {messageTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.id}
                                onClick={() => setMessageType(type.id)}
                                className={`flex items-center px-4 py-2 rounded-lg border ${
                                    messageType === type.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <Icon className={`h-5 w-5 mr-2 ${type.color}`} />
                                <span className="font-medium">{type.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Subject Line (for Email) */}
            {messageType === 'email' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Subject Line
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter subject line"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            )}

            {/* Message Editor */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-900">
                        Message Content
                    </label>
                    <div className="text-sm text-gray-500">
                        {message.length} characters
                        {messageType === 'sms' && ` • ${160 - message.length} remaining`}
                    </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <div className="border-b p-2 bg-gray-50 flex space-x-2">
                        <button className="p-2 hover:bg-gray-200 rounded">
                            <Paperclip className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded">
                            <Smile className="h-4 w-4 text-gray-600" />
                        </button>
                        <div className="flex-1"></div>
                        <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1">
                            Insert Variable
                        </button>
                    </div>

                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                            messageType === 'sms'
                                ? 'Type your SMS message here... (160 character limit)'
                                : messageType === 'email'
                                    ? 'Type your email message here...'
                                    : 'Type your push notification message here...'
                        }
                        rows={messageType === 'sms' ? 4 : 8}
                        maxLength={messageType === 'sms' ? 160 : undefined}
                        className="w-full p-4 resize-none focus:outline-none"
                    />
                </div>

                {/* Message Type Specific Tips */}
                {messageType === 'sms' && (
                    <p className="mt-2 text-sm text-gray-500">
                        💡 SMS messages have a 160 character limit. Keep it concise!
                    </p>
                )}
                {messageType === 'push' && (
                    <p className="mt-2 text-sm text-gray-500">
                        💡 Push notifications should be short and actionable (max 240 characters)
                    </p>
                )}
            </div>

            {/* Scheduling */}
            <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Schedule
                </h3>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            checked={schedule === 'now'}
                            onChange={() => setSchedule('now')}
                            className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Send Now</span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            checked={schedule === 'later'}
                            onChange={() => setSchedule('later')}
                            className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Schedule for Later</span>
                    </label>
                </div>

                {schedule === 'later' && (
                    <div className="mt-4">
                        <input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
                <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Save as Template
                </button>
                <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {schedule === 'now' ? (
                        <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Now
                        </>
                    ) : (
                        <>
                            <Clock className="h-4 w-4 mr-2" />
                            Schedule
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}