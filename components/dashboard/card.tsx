import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface CardProps {
    title: string;
    description?: string;
    amount?: number;
}


export default function CardComponent({ title, amount }: CardProps) {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-2xl'>{Intl.NumberFormat().format(amount ?? 0)}</p>
                </CardContent>

            </Card>
        </div>
    )
}
