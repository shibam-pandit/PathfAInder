import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, TrendingUp, Award, ArrowRight } from 'lucide-react'
import { redirect } from 'next/navigation'

const ResultCard = (props) => {
    const { resultData } = props;
    
    const scorePercentage = Math.round((resultData.quizscore / resultData.questions.length) * 100);
    const isExcellent = scorePercentage >= 90;
    const isGood = scorePercentage >= 70;
    const needsImprovement = scorePercentage < 70;

    const getScoreColor = () => {
        if (isExcellent) return 'text-green-600';
        if (isGood) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadgeVariant = () => {
        if (isExcellent) return 'default';
        if (isGood) return 'secondary';
        return 'destructive';
    };

    const getScoreIcon = () => {
        if (isExcellent) return <Award className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />;
        if (isGood) return <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />;
        return <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />;
    };

    const getPerformanceMessage = () => {
        if (isExcellent) return "Outstanding Performance!";
        if (isGood) return "Good Job!";
        return "Keep Practicing!";
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8 sm:mb-14 break-words"> Quiz Result Summary </h1>
            {/* Main Result Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 rounded-2xl overflow-hidden pt-0">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 sm:py-8 rounded-t-2xl">
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                            <div className="mb-2 sm:mb-0">{getScoreIcon()}</div>
                            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold sm:ml-3">
                                {getPerformanceMessage()}
                            </CardTitle>
                        </div>
                    </div>
                    <p className="text-center text-purple-100 text-base sm:text-lg">
                        You&apos;ve completed your mock interview quiz
                    </p>
                </CardHeader>
                
                <CardContent className="p-8">
                    {/* Score Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-4">
                            <div className="text-center">
                                <div className={`text-4xl font-bold ${getScoreColor()}`}>
                                    {resultData.quizscore}
                                </div>
                                <div className="text-2xl text-gray-600">
                                    / {resultData.questions.length}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center space-x-4 mb-4">
                            <Badge variant={getScoreBadgeVariant()} className="px-4 py-2 text-lg font-semibold">
                                {scorePercentage}% Score
                            </Badge>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{scorePercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                                className={`h-4 rounded-full transition-all duration-1000 ${
                                    isExcellent ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                    isGood ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                    'bg-gradient-to-r from-red-500 to-red-600'
                                }`}
                                style={{ width: `${scorePercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Improvement Tip */}
                    {resultData.improvementtip && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 mb-8">
                            <div className="flex items-start space-x-3">
                                <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-purple-900 mb-2">
                                        Personalized Improvement Tip
                                    </h3>
                                    <p className="text-purple-800 leading-relaxed">
                                        {resultData.improvementtip}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="text-2xl font-bold text-green-600">
                                {resultData.quizscore}
                            </div>
                            <div className="text-sm text-gray-600">Correct Answers</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="text-2xl font-bold text-red-600">
                                {resultData.questions.length - resultData.quizscore}
                            </div>
                            <div className="text-sm text-gray-600">Incorrect Answers</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                            onClick={() => redirect(`/interview-prep/quiz/${resultData.id}`)}
                        >
                            View Detailed Review
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button 
                            variant="outline" 
                            className="border-2 border-purple-200 text-purple-700 hover:bg-purple-200 font-semibold px-8 py-3 rounded-xl transition-all duration-200 cursor-pointer"
                            onClick={() => redirect('/interview-prep')}
                        >
                            Take Another Quiz
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Motivational Message */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl">
                <CardContent className="p-6 text-center">
                    <p className="text-purple-800 font-medium text-lg">
                        {isExcellent ? "🎉 Excellent work! You're well-prepared for your interview!" :
                         isGood ? "👍 Good progress! A bit more practice and you'll be ready!" :
                         "💪 Keep practicing! Every attempt makes you stronger!"}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default ResultCard