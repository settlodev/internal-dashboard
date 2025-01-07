'use client'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const data = [
    { month: 'Jan', totalBusiness: 4 },
    { month: 'Feb', totalBusiness: 30 },
    { month: 'Mar', totalBusiness: 20 },
    { month: 'Apr', totalBusiness: 27 },
    { month: 'May', totalBusiness: 10 },
    { month: 'Jun', totalBusiness: 23},
    { month: 'Jul', totalBusiness: 34 },
    { month: 'Aug', totalBusiness: 4 },
    { month: 'Sep', totalBusiness: 30 },
    { month: 'Oct', totalBusiness: 20},
    { month: 'Nov', totalBusiness: 20 },
    { month: 'Dec', totalBusiness: 10 },
  ];
export default function BusinessBarChart() {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">Businesses per Month</CardTitle>
        </CardHeader>
        <CardContent>
        <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
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
  )
}
