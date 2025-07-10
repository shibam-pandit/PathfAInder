import React from 'react'
import { getQuizHistoryByUserId } from '@/lib/services/interview_prep.service'
import OverView from './_components/OverView';
import PastScoreCard from './_components/PastScoreCard';
import PreviousQuizes from './_components/PreviousQuizes';
import { Card } from '@/components/ui/card';
import { TrendingUp, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

const InterviewPage = async () => {
  let quizData = null;
  let hasQuizDataError = false;
  
  try {
    quizData = await getQuizHistoryByUserId();
  } catch (error) {
    console.error("Failed to fetch quiz data:", error);
    hasQuizDataError = true;
    // Don't show toast on server side - this will be handled on client side if needed
  }

  const startQuiz = async () => {
    'use server';
    redirect('/interview-prep/mock');
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300/20 via-gray-100 to-indigo-500/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-28 lg:py-32">
        <div className="text-center mb-12 sm:mb-16 space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-800">
            Interview Prep Dashboard
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Track your progress, analyze your performance, and prepare for your next interview.
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
          {quizData ? (
            <OverView quizData={quizData} />
          ) : (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden p-6">
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {hasQuizDataError ? "Unable to load quiz data" : "No quiz data available"}
                </h3>
                <p className="text-gray-500">
                  {hasQuizDataError 
                    ? "There was an error fetching your quiz history. You can still start a new quiz." 
                    : "Start your first quiz to see your progress overview here."}
                </p>
              </div>
            </Card>
          )}
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
              {quizData ? (
                <PastScoreCard quizData={quizData} />
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {hasQuizDataError ? "Performance data unavailable" : "No performance data yet"}
                  </h3>
                  <p className="text-gray-500">
                    {hasQuizDataError 
                      ? "Unable to load your performance analytics at the moment." 
                      : "Complete your first quiz to see your performance trends."}
                  </p>
                </div>
              )}
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
              {quizData ? (
                <PreviousQuizes quizData={quizData} />
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {hasQuizDataError ? "Quiz history unavailable" : "No quiz history yet"}
                  </h3>
                  <p className="text-gray-500">
                    {hasQuizDataError 
                      ? "Unable to load your quiz history at the moment." 
                      : "Your completed quizzes will appear here after you take your first quiz."}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InterviewPage