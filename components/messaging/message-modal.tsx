"use client"

import React, { useState } from 'react';
import { Send, Mail, MessageSquare, Bell, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Owner } from '@/types/owners/type';

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    messageType: 'email' | 'sms' | 'push';
    selectedCustomers: Owner[];
    onSend: (type: string, content: { subject: string; body: string }) => void;
}

export function MessageModal({
                                 isOpen,
                                 onClose,
                                 messageType,
                                 selectedCustomers,
                                 onSend
                             }: MessageModalProps) {
    const [messageContent, setMessageContent] = useState({ subject: '', body: '' });

    const getMessageTypeConfig = () => {
        switch(messageType) {
            case 'email':
                return { icon: Mail, color: 'blue', label: 'Email', needsSubject: true };
            case 'sms':
                return { icon: MessageSquare, color: 'green', label: 'SMS', needsSubject: false };
            case 'push':
                return { icon: Bell, color: 'purple', label: 'Push Notification', needsSubject: true };
            default:
                return { icon: Mail, color: 'blue', label: 'Email', needsSubject: true };
        }
    };

    const config = getMessageTypeConfig();
    const Icon = config.icon;

    const handleSend = () => {
        onSend(messageType, messageContent);
        setMessageContent({ subject: '', body: '' });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <Icon className="w-6 h-6" />
                        <div>
                            <div className="text-xl font-bold">Send {config.label}</div>
                            <p className="text-sm font-normal text-muted-foreground">
                                To {selectedCustomers.length} recipient{selectedCustomers.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground mb-2">Sending to:</div>
                        <div className="flex flex-wrap gap-2">
                            {selectedCustomers.map(customer => (
                                <span key={customer.id} className="inline-flex items-center gap-1 px-2 py-1 bg-background border rounded text-sm">
                  <User className="w-3 h-3" />
                                    {customer.firstName} {customer.lastName}
                </span>
                            ))}
                        </div>
                    </div>

                    {config.needsSubject && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {messageType === 'push' ? 'Title' : 'Subject'}
                            </label>
                            <Input
                                value={messageContent.subject}
                                onChange={(e) => setMessageContent({...messageContent, subject: e.target.value})}
                                placeholder={messageType === 'push' ? 'Notification title' : 'Email subject'}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <Textarea
                            value={messageContent.body}
                            onChange={(e) => setMessageContent({...messageContent, body: e.target.value})}
                            placeholder={`Write your ${config.label.toLowerCase()} message here...`}
                            className="h-40"
                        />
                        <div className="mt-2 text-xs text-muted-foreground">
                            {messageType === 'sms' && `${messageContent.body.length}/160 characters`}
                            {messageType === 'push' && 'Keep it short and engaging for best results'}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSend}
                            disabled={!messageContent.body || (config.needsSubject && !messageContent.subject)}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Send {config.label}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}