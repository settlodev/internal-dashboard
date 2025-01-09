import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface CardProps {
    title: string;
    description?: string;
    amount: number;
}


export default function CardComponent({ title, description, amount }: CardProps) {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{amount}</p>
                </CardContent>

            </Card>
        </div>
    )
}
