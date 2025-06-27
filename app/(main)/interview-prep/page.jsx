import React from 'react'
import { getQuizHistoryByUserId } from '@/lib/services/interview_prep.service'
import OverView from './_components/OverView';
import PastScoreCard from './_components/PastScoreCard';
import PreviousQuizes from './_components/PreviousQuizes';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Award, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

const InterviewPage = async () => {
  const quizData = await getQuizHistoryByUserId();
  if (!quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center shadow-xl border-0">
          <CardContent className="pt-6">
            <BookOpen className="w-16 h-16 mx-auto text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Quiz Data Found</h2>
            <p className="text-gray-500">Start your interview preparation journey today!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const startQuiz = async () => {
    'use server';
    redirect('/interview-prep/mock');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8 pt-32">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Award className="w-10 h-10 text-white" />
          </div> */}
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-900 to-indigo-900 bg-clip-text text-transparent my-4">
            Interview Preparation Dashboard
          </h1>
          {/* <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-7" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Interview Preparation Dashboard
          </h1> */}
          <p className="text-md text-gray-600 max-w-2xl mx-auto mb-8">
            Track your progress, analyze your performance, and master your interview skills
          </p>

          {/* Start New Quiz Button */}
          <div className="flex justify-center lg:justify-end py-5">
            <form action={startQuiz}>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Start New Quiz
              </Button>
            </form>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="mb-12">
          <OverView quizData={quizData} />
        </div>

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Past Scores Chart */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden pt-0">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
                  <p className="text-purple-100">Track your improvement over time</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <PastScoreCard quizData={quizData} />
            </div>
          </Card>


          {/* Previous Quizzes */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden pt-0">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Quiz History</h2>
                  <p className="text-indigo-100">Review past attempts</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <PreviousQuizes quizData={quizData} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InterviewPage