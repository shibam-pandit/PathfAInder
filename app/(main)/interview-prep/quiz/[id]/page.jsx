"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { Toaster, toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { CheckCircle2, XCircle, ArrowLeft, Award, TrendingUp, BarChart3, Clock, Target, BookOpen } from "lucide-react"
import ResultCard from "../../mock/_component/ResultCard"

const QuizHistory = () => {
  const router = useRouter()
  const params = useParams()

  const id = params?.id || null

  const [quizData, setQuizData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!id) return

      setLoading(true)
      setQuizData(null)
      try {
        const response = await axios.get(`/api/interview-prep/getQuestions?id=${id}`)

        if (response.status !== 200) {
          toast.error("Failed to fetch quiz data")
          throw new Error("Failed to fetch quiz data")
        }
        setQuizData(response.data)
      } catch (error) {
        console.error("Error fetching quiz data:", error)
        toast.error("Failed to load quiz data")
      } finally {
        setLoading(false)
      }
    }

    fetchQuizData()
  }, [id])

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-violet-50/40 to-indigo-50/30 flex justify-center items-center">
        <div className="animate-pulse text-lg font-medium text-slate-600">Loading...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-violet-50/40 to-indigo-50/30 flex justify-center items-center p-4">
        <Toaster position="top-center" richColors />
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-violet-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-purple-700">Loading Quiz Results</p>
            <p className="text-sm text-purple-600/80">Please wait while we fetch your quiz details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-violet-50/40 to-indigo-50/30 flex justify-center items-center p-4">
        <Toaster position="top-center" richColors />
        <Card className="max-w-lg mx-auto shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Quiz Not Found</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              The quiz you're looking for doesn't exist or has been removed from our system.
            </p>
            <Button
              onClick={() => router.push("/interview-prep")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Quizzes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-violet-50/40 to-indigo-50/30">
      <Toaster position="top-center" richColors />

    {/* Header Section */}
    <div className="z-10 bg-purple-100/80 backdrop-blur-md border-b border-slate-200 pt-24 sm:pt-32 mb-5 pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="hidden sm:block w-20 sm:w-24"></div>
                <div className="text-center flex-1 max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent mb-3 tracking-tight">
                        Quiz Review
                    </h1>
                    <p className="text-sm sm:text-base text-purple-700/80 mb-3 font-medium">
                        Detailed analysis of your performance
                    </p>
                    {quizData.category && (
                        <Badge
                            variant="outline"
                            className="px-3 py-1 text-sm font-medium border-purple-200 text-purple-700 bg-purple-50/50"
                        >
                            <BookOpen className="w-3 h-3 mr-1" />
                            {quizData.category}
                        </Badge>
                    )}
                </div>
                {/* Spacer for right alignment on desktop */}
                <div className="hidden sm:block w-20 sm:w-24"></div>
            </div>
        </div>
    </div>

    {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {/* Question Cards */}
            {quizData.questions.map((question, index) => {
              const isCorrect = question.user_answer === question.correct_answer

              return (
                <CarouselItem key={index} className="pl-2 md:pl-4">
                  <Card className="h-full border-0 shadow-xl bg-purple-50/20 backdrop-blur-sm rounded-2xl overflow-hidden pt-0">
                    {/* Question Header */}
                    <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6 sm:p-8 rounded-t-2xl">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge variant="secondary" className="bg-white/20 text-white border-0 px-3 py-1">
                              Question {index + 1} of {quizData.questions.length}
                            </Badge>
                            <div
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                isCorrect ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"
                              }`}
                            >
                              {isCorrect ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  Correct
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  Incorrect
                                </>
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-xl sm:text-2xl font-bold leading-relaxed">
                            {question.question}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 sm:p-8 space-y-6">
                      {/* Answer Options */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                          Answer Options
                        </h3>
                        <div className="grid gap-3">
                          {question.options.map((option, optionIndex) => {
                            const isUserAnswer = optionIndex === question.user_answer
                            const isCorrectOption = optionIndex === question.correct_answer

                            let cardClasses = "p-4 rounded-xl border-2 transition-all duration-200 "
                            let labelClasses = ""
                            let icon = null

                            if (isCorrectOption) {
                              cardClasses += "bg-emerald-50 border-emerald-200 shadow-sm"
                              labelClasses = "text-emerald-800"
                              icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            } else if (isUserAnswer && !isCorrectOption) {
                              cardClasses += "bg-red-50 border-red-200 shadow-sm"
                              labelClasses = "text-red-800"
                              icon = <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            } else {
                              cardClasses += "bg-slate-50 border-slate-200"
                              labelClasses = "text-slate-700"
                            }

                            return (
                              <div key={optionIndex} className={cardClasses}>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <p className={`font-medium ${labelClasses} leading-relaxed`}>{option}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {isUserAnswer && (
                                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                          Your Answer
                                        </span>
                                      )}
                                      {isCorrectOption && (
                                        <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                                          Correct Answer
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {icon}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                          <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                              <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">Explanation</h4>
                              <p className="text-blue-800 leading-relaxed text-sm sm:text-base">
                                {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              )
            })}

            {/* Summary Card */}
            <CarouselItem className="pl-2 md:pl-4">
              < ResultCard resultData = {quizData} />
            </CarouselItem>
          </CarouselContent>

          {/* Fixed Navigation Controls */}
          <CarouselPrevious className="fixed left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-purple-100/90 backdrop-blur-md border-2 border-purple-200 hover:bg-purple-200/90 hover:border-purple-300 shadow-xl rounded-full transition-all duration-200 cursor-pointer" />
          <CarouselNext className="fixed right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-purple-100/90 backdrop-blur-md border-2 border-purple-200 hover:bg-purple-200/90 hover:border-purple-300 shadow-xl rounded-full transition-all duration-200 cursor-pointer" />
        </Carousel>

        {/* Navigation Hint */}
        <div className="text-center mt-8 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/60 backdrop-blur-sm rounded-full border border-purple-200">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-sm text-purple-700 font-medium">Swipe or use arrows to navigate</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizHistory
