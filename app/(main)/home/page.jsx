'use client'

import React, { useEffect, useState } from 'react'
import OnboardingForm from './_component/Onboarding';
import Dashboard from './_component/Dashboard';
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, Zap, BarChart3, Award, CheckCircle, ListTree, Calendar, AlertTriangle } from 'lucide-react'

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

export default function Home() {
  const [onboarding, setOnboarding] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check onboarding status
        const onboardingResponse = await fetch('/api/users/onboarding-status');
        if (onboardingResponse.ok) {
          const onboardingData = await onboardingResponse.json();
          setOnboarding(onboardingData.completed);

          // If onboarding is complete, fetch industry insights
          if (onboardingData.completed) {
            try {
              const industryResponse = await fetch('/api/industry-insights');
              if (industryResponse.ok) {
                const industryData = await industryResponse.json();
                setIndustry(industryData);
              } else {
                const errorData = await industryResponse.json();
                setHasError(true);

                // Handle specific error types
                if (errorData.error === 'AI_SERVICE_UNAVAILABLE') {
                  setErrorMessage('Industry insights are temporarily unavailable due to high AI service demand. Other features are still accessible.');
                } else if (errorData.error === 'NO_INDUSTRY_SET') {
                  setErrorMessage('Please complete your profile setup to view industry insights.');
                } else {
                  setErrorMessage('Unable to load industry insights at the moment. Please try again later.');
                }
              }
            } catch (error) {
              console.error('Failed to fetch industry insights:', error);
              setHasError(true);
              setErrorMessage('Industry insights are temporarily unavailable due to high AI service demand. Other features are still accessible.');
            }
          }
        } else {
          setHasError(true);
          setErrorMessage('Failed to check onboarding status');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
        setErrorMessage('Unable to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (onboarding === false) {
    return <OnboardingForm />
  }

  // If there's an error or no industry data, show error UI
  if (hasError || !industry) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto pt-32">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Industry Insights Unavailable
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {errorMessage}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Other Features Available
              </h3>
              <p className="text-blue-700" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                You can still access interview preparation, resume builder, and resume analyzer features while we work on restoring industry insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="max-w-7xl mx-auto pt-32">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-7" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Industry Insights
          </h1>

          {/* Show warning if data might be stale */}
          {industry.isStale && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-yellow-800" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Data may not be current due to service limitations. Information shown is from the last successful update.
                </p>
              </div>
            </div>
          )}

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
              <span>Industry: {formattedIndustry()}</span>
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
                    {industry.topskills.map((skill, idx) => (
                      <div key={idx} className="text-xs font-bold text-gray-900 p-2 border-[0.5px] border-purple-500 rounded-xl" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{skill}</div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>No top skills available</p>
                )
              }
            </CardContent>
          </Card>
        </div>


        <Dashboard industry={industry} />


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <ListCard title="Key Industry Trends" items={industry.keytrends} icon={ListTree} description={"Current trends shaping the industry"} />
          <ListCard title="Recommended Skills" items={industry.recommendedskills} icon={Award} description={"Skills to consider developing"} />
        </div>
      </div>
    </div>
  );
}