'use client'
import React from 'react'
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';


interface DataProp {
  endOfMonth: string;
  amount: number;
}
export default function LocationBarChart({ data }: { data: DataProp[] }) {
  console.log("The monthly business locations", data)
  const transformedData = data.map((item: { endOfMonth: string; amount: number }) => ({
    month: new Date(item.endOfMonth).toLocaleString('default', { month: 'short', timeZone: 'UTC' }),
    totalLocations: item.amount
  }));
  return (
   <div className='mt-4'>
       <Card>
      <CardHeader>
        <CardTitle className="text-lg">Business Locations per Month</CardTitle>
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
            <Bar dataKey="totalLocations" fill="#00DBA2" name="Total Locations" />
            <Line type="monotone" dataKey="target" stroke="#ff7300" strokeWidth={2} opacity={0.5} name="Target" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
   </div>
  )
}
