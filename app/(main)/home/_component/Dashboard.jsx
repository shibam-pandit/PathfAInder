"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { BarChart3 } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{label}</p>
        {payload.map((pld, i) => (
          <p key={i} style={{ color: pld.fill, fontFamily: 'Inter, system-ui, sans-serif' }} className="text-sm">
            {`${pld.name}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(pld.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = ({ industry }) => {
  const salaryData = industry.salaryranges.map((role) => ({
    role: role.role,
    Min: role.min,
    Median: role.median,
    Max: role.max,
  }))

  

  return (



    <Card className="shadow-lg p-4 sm:p-6 mb-12 bg-white">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-center flex items-center justify-center gap-2 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <BarChart3 className="w-6 h-6 text-purple-600" />
          Salary Ranges by Role (USD)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={salaryData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="role"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'Inter, system-ui, sans-serif' }}
            />
            <YAxis
              tickFormatter={(value) => `$${value / 1000}k`}
              tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'Inter, system-ui, sans-serif' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
            <Legend wrapperStyle={{ paddingTop: '40px', fontFamily: 'Inter, system-ui, sans-serif' }} />
            <Bar dataKey="Min" fill="rgba(139, 92, 246, 0.6)" name="Minimum Salary" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Median" fill="#8b5cf6" name="Median Salary" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Max" fill="rgba(139, 92, 246, 0.8)" name="Maximum Salary" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>


  )
}

export default Dashboard