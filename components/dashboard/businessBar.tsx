'use client'
import React from 'react'
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface DataProp {
  endOfMonth: string;
  amount: number;
}
export default function BusinessBarChart({ data }: { data: DataProp[] }) {
  const transformedData = data.map((item: { endOfMonth: string; amount: number }) => ({
    month: new Date(item.endOfMonth).toLocaleString('default', { month: 'short', timeZone: 'UTC' }),
    totalBusiness: item.amount
  }));
  return (
   <div className='mt-4'>
       <Card>
      <CardHeader>
        <CardTitle className="text-lg">Businesses per Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={transformedData}
            margin={{
              top: 20, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalBusiness" fill="#00DBA2" name="Total Business" />
            <Line type="monotone" dataKey="target" stroke="#ff7300" name="Target" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
   </div>
  )
}
