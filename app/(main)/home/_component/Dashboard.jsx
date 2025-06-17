
"use client"

import React from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { TrendingUp, Zap, BarChart3, Award, CheckCircle, ListTree, Calendar, Target } from 'lucide-react'

const InfoCard = ({ title, content, icon, description }) => {
  const Icon = icon
  return (
    <Card className="shadow-lg transition-shadow duration-300 border-l-4 border-purple-500 bg-white group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{title}</CardTitle>
        <Icon className="w-5 h-5 text-purple-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{content}</div>
        {description && <p className="text-xs text-gray-500 pt-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{description}</p>}
      </CardContent>
    </Card>
  )
}

const ListCard = ({ title, items, icon, description }) => {
  const Icon = icon;
  return (
    <Card className="shadow-lg transition-shadow duration-300 border-l-4 border-purple-500 bg-white group">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{title}</CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {description}
          </CardDescription>
        </div>
        <Icon className="w-5 h-5 text-purple-600" />
      </CardHeader>
      <CardContent>
        {
          items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((skill, idx) => (
                <li key={idx} className="text-md font-bold text-gray-800" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <div className='h-2 w-2 rounded-lg bg-gray-700 inline-flex mr-2'></div>  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>No top skills available</p>
          )
        }
      </CardContent>
    </Card>
  )
}

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

  const formattedIndustry = (() => {
    const part = industry.industry.split('-')[1];
    const formatted =
      part
        ? part
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        : '';
    return <span className="text-gray-600">{formatted}</span>;
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>
      <div className="max-w-7xl mx-auto pt-32">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-7" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Industry Insights
          </h1>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Last Updated: {format(new Date(industry.lastupdated), "dd MMMM yyyy")}</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span>Next Update: {format(new Date(industry.nextupdate), "dd MMMM yyyy")}</span>
            </div> */}
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              <span>Industry: { formattedIndustry() }</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <InfoCard
            title="Market Outlook"
            content={industry.marketoutlook}
            icon={TrendingUp}
            description="Current market sentiment"
          />
          <InfoCard
            title="Industry Growth"
            content={`${industry.growthrate}%`}
            icon={Zap}
            description="Annual growth rate"
          />
          <InfoCard
            title="Demand Level"
            content={industry.demandlevel}
            icon={BarChart3}
            description="Market demand status"
          />
          <Card className="shadow-lg transition-shadow duration-300 border-l-4 border-purple-500 bg-white group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Top Skills</CardTitle>
              <Award className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              {
                industry.topskills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {industry.topskills.map((skill) => (
                      <div className="text-xs font-bold text-gray-900 p-2 border-[0.5px] border-purple-500 rounded-xl" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{skill}</div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>No top skills available</p>
                )
              }
            </CardContent>
          </Card>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <ListCard title="Key Industry Trends" items={industry.keytrends} icon={ListTree} description={"Current trends shaping the industry"} />
          <ListCard title="Recommended Skills" items={industry.recommendedskills} icon={Award} description={"Skills to consider developing"} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard