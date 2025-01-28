import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataProp {
  endOfMonth: string;
  amount: number;
}

export default function UseLineChart({ data }: { data: DataProp[] }) {
  const transformedData = data.map((item) => ({
    month: new Date(item.endOfMonth).toLocaleString('default', { month: 'short', timeZone: 'UTC' }),
    totalOwners: item.amount
  }));

  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business owners per month</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={transformedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalOwners"
                stroke="#00DBA2"
                strokeWidth={2}
                name="Total Business Owners"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}