
import { CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';

const messages = [
    {
        id: 1,
        type: 'email',
        subject: 'Special Offer for Retail Customers',
        audience: 'Retail Businesses',
        sent: '2024-01-15 14:30',
        recipients: 320,
        status: 'delivered',
    },
    {
        id: 2,
        type: 'sms',
        subject: 'Flash Sale Alert',
        audience: 'All Customers',
        sent: '2024-01-14 11:00',
        recipients: 1250,
        status: 'pending',
    },
    // Add more messages...
];

export default function MessageHistory() {
    const getStatusIcon = (status:any) => {
        switch (status) {
            case 'delivered':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'failed':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Send className="h-5 w-5 text-gray-500" />;
        }
    };

    const getTypeColor = (type:any) => {
        switch (type) {
            case 'email': return 'bg-red-100 text-red-800';
            case 'sms': return 'bg-green-100 text-green-800';
            case 'push': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                    Message History
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject / Message
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Audience
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Recipients
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {messages.map((msg) => (
                        <tr key={msg.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(msg.type)}`}>
                    {msg.type.toUpperCase()}
                  </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                    {msg.subject}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {/*{msg.message || 'No preview available'}*/}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {msg.audience}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {msg.sent}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {msg.recipients.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {getStatusIcon(msg.status)}
                                    <span className="ml-2 text-sm capitalize">{msg.status}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">
                                    Resend
                                </button>
                                <button className="text-gray-600 hover:text-gray-900">
                                    View Report
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}