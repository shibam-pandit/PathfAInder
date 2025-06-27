"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, Clock, Target, TrendingUp } from "lucide-react"
import { redirect } from "next/navigation"

const formatDate = (dateInput) => {
  try {
    let date
    if (dateInput instanceof Date) {
      date = dateInput
    } else if (typeof dateInput === "object" && dateInput.seconds) {
      date = new Date(dateInput.seconds * 1000)
    } else {
      date = new Date(dateInput)
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return "Invalid Date"
  }
}

const getScoreColor = (score) => {
  if (score >= 8) return "from-green-500 to-emerald-500"
  if (score >= 6) return "from-yellow-500 to-orange-500"
  return "from-red-500 to-pink-500"
}

const getScoreBg = (score) => {
  if (score >= 8) return "bg-green-50 border-green-200"
  if (score >= 6) return "bg-yellow-50 border-yellow-200"
  return "bg-red-50 border-red-200"
}

const getScoreRating = (score) => {
  if (score >= 8) return "Excellent"
  if (score >= 6) return "Good"
  return "Needs Improvement"
}

const PreviousQuizes = ({ quizData = [] }) => {
  if (quizData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">No Quiz History</h3>
        <p className="text-gray-500">Your completed quizzes will appear here</p>
      </div>
    )
  }

  const handleViewDetails = (quizId) => {
    redirect(`/interview-prep/quiz/${quizId}`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
      {quizData.map((quiz, index) => {
        const score = quiz.quizscore ?? 0
        const scoreColor = getScoreColor(score)
        const scoreBg = getScoreBg(score)
        const rating = getScoreRating(score)
        const percentage = Math.round((score / 10) * 100)

        return (
          <Card
            key={index}
            className="group hover:shadow-lg transition-all duration-300 rounded-2xl border-0 shadow-sm bg-white hover:-translate-y-1 cursor-pointer"
            onClick={() => handleViewDetails(quiz.id || `quiz-${index}`)}
          >
            <CardContent className="p-5 lg:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${scoreColor}`}></div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-sm lg:text-sm truncate">
                    {quiz.category || "General"} Quiz
                  </h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-2 h-8 w-8 sm:h-8 sm:w-8 lg:h-8 lg:w-8 rounded-lg sm:opacity-0 sm:group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Score Display */}
              <div className="text-center mb-4 sm:mb-5 lg:mb-6">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl border-2 ${scoreBg} mb-3`}
                >
                  <div className="text-center">
                    <div className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-900">{score}</div>
                    <div className="text-xs text-gray-500">/ 10</div>
                  </div>
                </div>
                {/* <div
                  className={`inline-block px-3 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-1 rounded-full text-sm font-medium bg-gradient-to-r ${scoreColor} text-white mb-2`}
                >
                  {percentage}%
                </div> */}
                <p className="text-sm text-gray-600 font-medium">{rating}</p>
              </div>

              {/* Stats */}
              <div className="space-y-2 sm:space-y-2 lg:space-y-3 mb-4">
                <div className="flex items-center justify-between text-xs sm:text-xs lg:text-sm">
                  <div className="flex items-center space-x-1 sm:space-x-1 lg:space-x-2 text-gray-600">
                    <Calendar className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                    <span>Completed</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatDate(quiz.createdat)}</span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-xs lg:text-sm">
                  <div className="flex items-center space-x-1 sm:space-x-1 lg:space-x-2 text-gray-600">
                    <Target className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                    <span>Accuracy</span>
                  </div>
                  <span className="font-medium text-gray-900">{percentage}%</span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-xs lg:text-sm">
                  <div className="flex items-center space-x-1 sm:space-x-1 lg:space-x-2 text-gray-600">
                    <TrendingUp className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                    <span>Performance</span>
                  </div>
                  <span className="font-medium text-gray-900">{rating}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${scoreColor} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default PreviousQuizes
