"use client"

import React, { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Quiz from './_component/Quiz'
import { Toaster, toast } from 'sonner'

const Mock = () => {
    const router = useRouter()

    const [userPrompt, setUserPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const [quizData, setQuizData] = useState(null)

    const StartQuiz = async () => {
        setLoading(true);

        if (!userPrompt || userPrompt.trim() === '') {
            toast.error('Please enter a job description or topics to practice.');
            setLoading(false);
            return;
        }

        if (userPrompt.length > 1000) {
            toast.error('Job description is too long. Please limit it to 1000 characters.');
            setLoading(false);
            return;
        }

        try {
            const result = await axios.post('/api/interview-prep/getQuestions', {
                userPrompt
            });
            
            if (!result.data || result.status !== 200) {
                alert('No questions found for the provided prompt. Please try again with a different prompt.');
                setLoading(false);
                return;
            }

            if (result.data.valid === false) {
                toast.error('Invalid job description. Please try to mention the skills you want the quiz on.');
                setLoading(false);
                return;
            }

            setQuizData(result.data);
            toast.success('Quiz started successfully!');
            setLoading(false);

        } catch (error) {
            console.error('Error starting quiz:', error);
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200 pt-28 pb-12'>
            <Toaster position='top-center' richColors closeButton={false} />
            {!quizData ? (
                <div className='container mx-auto px-4 py-8 max-w-6xl'>
                    {/* Header Section */}
                    {/* <div className='flex items-center gap-4 mb-5'>
                        <button
                            className='flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-105'
                            onClick={() => router.push('/interview')}
                        >
                            <ArrowLeft className='w-5 h-5' />
                            <span className='font-medium hover:underline cursor-pointer'>Back</span>
                        </button>
                    </div> */}

                    {/* Hero Section */}
                    <div className='text-center mb-14'>
                        <h1 className='text-5xl font-bold bg-gradient-to-r from-purple-900 to-indigo-900 bg-clip-text text-transparent mb-4 animate-fade-in'>
                            Ace Your Next Interview
                        </h1>
                        
                        <p className='text-md text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in'>
                            Practice with AI-generated questions tailored to your job description. 
                            Get ready to impress your interviewer with confidence.
                        </p>
                    </div>

                    {/* Main Input Section */}
                    <div className='max-w-4xl mx-auto mt-10'>
                        <div className='bg-white/80 backdrop-blur-sm border border-purple-200 rounded-3xl p-8 shadow-xl'>
                            <div className='mb-6'>
                                <h2 className='text-2xl font-bold text-gray-800 mb-2'>Start Your Practice Session</h2>
                                <p className='text-gray-600'>Paste your job description or specify the topics you'd like to practice</p>
                            </div>

                            <div className='space-y-12 mt-10'>
                                <div className='relative'>
                                    <textarea
                                        className='w-full h-48 p-6 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 resize-none text-gray-700 placeholder-gray-400 bg-white/70 backdrop-blur-sm'
                                        onChange={(e) => setUserPrompt(e.target.value)}
                                        placeholder='✨ Paste your job description here or describe the topics you want to practice...'
                                        value={userPrompt}
                                    />
                                    <div className='absolute bottom-4 right-4 text-sm text-gray-400'>
                                        {userPrompt.length}/1000 characters
                                    </div>
                                </div>

                                <button
                                    className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer'
                                    } text-white shadow-lg`}
                                    onClick={StartQuiz}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className='flex items-center justify-center gap-3'>
                                            <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                            <span>Generating Your Quiz...</span>
                                        </div>
                                    ) : (
                                        <div className='flex items-center justify-center gap-3'>
                                            <Zap className='w-5 h-5' />
                                            <span>Start Interview Practice</span>
                                        </div>
                                    )}
                                </button>
                            </div>

                            {/* Tips Section */}
                            <div className='mt-8 p-6 bg-purple-50 rounded-2xl border border-purple-100'>
                                <h3 className='font-semibold text-purple-800 mb-3'>💡 Pro Tips:</h3>
                                <ul className='space-y-2 text-sm text-purple-700'>
                                    <li className='flex items-start gap-2'>
                                        <span className='text-purple-500 mt-0.5'>•</span>
                                        <span>Be specific about the role, technologies, and skills mentioned in the job description</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <span className='text-purple-500 mt-0.5'>•</span>
                                        <span>Focus on the key skills and technologies relevant to the job</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Features Cards */}
                    <div className='grid md:grid-cols-3 gap-6 mb-12 mt-30'>
                        <div className='bg-white/70 backdrop-blur-sm border border-purple-200 rounded-2xl p-6 hover:shadow-xl  transition-all duration-300'>
                            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4'>
                                <BookOpen className='w-6 h-6 text-purple-600' />
                            </div>
                            <h3 className='font-semibold text-gray-800 mb-2'>Tailored Questions</h3>
                            <p className='text-gray-600 text-sm'>Questions generated based on your specific job description and requirements</p>
                        </div>

                        <div className='bg-white/70 backdrop-blur-sm border border-purple-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300'>
                            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4'>
                                <Zap className='w-6 h-6 text-purple-600' />
                            </div>
                            <h3 className='font-semibold text-gray-800 mb-2'>Instant Results</h3>
                            <p className='text-gray-600 text-sm'>Get immediate feedback and detailed explanations for each question</p>
                        </div>

                        <div className='bg-white/70 backdrop-blur-sm border border-purple-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300'>
                            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4'>
                                <Target className='w-6 h-6 text-purple-600' />
                            </div>
                            <h3 className='font-semibold text-gray-800 mb-2'>Focused Practice</h3>
                            <p className='text-gray-600 text-sm'>Practice specific skills and topics you need to master</p>
                        </div>
                    </div>

                    
                </div>
            ) : (
                <Quiz quizData={quizData} setQuizData={setQuizData} />
            )}
        </div>
    )
}

export default Mock