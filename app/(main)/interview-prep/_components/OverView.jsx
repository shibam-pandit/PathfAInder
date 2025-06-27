import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { Trophy, Target, Calendar, TrendingUp } from 'lucide-react';

const calculateAverageScore = (quizData) => {
    if (!quizData || quizData.length === 0) return 0;
    const totalScore = quizData.reduce((sum, quiz) => {
        return sum + (quiz.quizscore || 0);
    }, 0);
    let avg = (totalScore / quizData.length).toFixed(2);
    let percentage = (avg * 100) / 10;

    return percentage;
}

const getHighestScore = (quizData) => {
    if (!quizData || quizData.length === 0) return 0;
    return Math.max(...quizData.map(quiz => quiz.quizscore || 0));
}

const getRecentQuizzes = (quizData) => {
    if (!quizData || quizData.length === 0) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return quizData.filter(quiz => {
        if (!quiz.createdat) return false;
        const quizDate = quiz.createdat instanceof Date 
            ? quiz.createdat 
            : quiz.createdat.seconds 
                ? new Date(quiz.createdat.seconds * 1000)
                : new Date(quiz.createdat);
        return quizDate >= thirtyDaysAgo;
    }).length;
}

const OverView = ({ quizData }) => {
    const averageScore = calculateAverageScore(quizData);
    const highestScore = getHighestScore(quizData);
    const recentQuizzes = getRecentQuizzes(quizData);

    const stats = [
        {
            title: "Total Quizzes",
            value: quizData.length,
            icon: Calendar,
            color: "from-blue-500 to-cyan-500",
            bgColor: "from-blue-50 to-cyan-50",
            description: "Completed assessments"
        },
        {
            title: "Average Score",
            value: `${averageScore.toFixed(1)}%`,
            icon: Target,
            color: "from-purple-500 to-indigo-500",
            bgColor: "from-purple-50 to-indigo-50",
            description: "Overall performance"
        },
        {
            title: "Best Score",
            value: highestScore,
            icon: Trophy,
            color: "from-yellow-500 to-orange-500",
            bgColor: "from-yellow-50 to-orange-50",
            description: "Highest achievement"
        },
        {
            title: "Recent Activity",
            value: recentQuizzes,
            icon: TrendingUp,
            color: "from-green-500 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50",
            description: "Last 30 days"
        }
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                // Extract color for the icon from the gradient
                const iconColor = stat.color.includes("purple") ? "#8B5CF6" : 
                                 stat.color.includes("blue") ? "#3B82F6" : 
                                 stat.color.includes("yellow") ? "#F59E0B" : 
                                 "#10B981"; // green default
                
                return (
                    <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden pt-0"
                    >
                        <div className={`h-2 bg-gradient-to-r ${stat.color} rounded-t-lg`}></div>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}>
                                    <IconComponent 
                                        className="w-6 h-6" 
                                        stroke={iconColor} 
                                        strokeWidth={2}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}

export default OverView