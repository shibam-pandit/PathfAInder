"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import ResultCard from './ResultCard';
import { useLayoutVisibility } from '@/app/providres/LayoutVisibilityContext';

const Quiz = (props) => {
  const { quizData } = props;
  const questions = quizData?.questions || [];
  const TOTAL_TIME = 10 * 60; // 10 minutes in seconds

  const [questionNumber, setQuestionNumber] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenWarning, setFullScreenWarning] = useState(false);
  const [warningTimeLeft, setWarningTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false); // New state for quiz start

  // Hide layout (navbar/footer) on mount
  const { setHideLayout } = useLayoutVisibility();
  useEffect(() => {
    setHideLayout(true); // hide navbar/footer on mount

    return () => {
      setHideLayout(false); // show them again on unmount
    };
  }, []);

  // Timer for quiz (only runs when quiz has started)
  useEffect(() => {
    if (!quizStarted || resultData || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuizHandler();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, resultData, isSubmitting]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      setFullScreenWarning(!document.fullscreenElement && quizStarted && !resultData);
      if (!document.fullscreenElement && quizStarted && !resultData) {
        setWarningTimeLeft(30);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => console.error('Failed to exit fullscreen:', err));
      }
    };
  }, [quizStarted, resultData]);

  // Warning timer for fullscreen
  useEffect(() => {
    if (fullScreenWarning && quizStarted && !resultData) {
      const warningTimer = setInterval(() => {
        setWarningTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(warningTimer);
            submitQuizHandler(); // Auto-submit if user doesn't return to fullscreen
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(warningTimer);
    }
  }, [fullScreenWarning, quizStarted, resultData]);

  // Exit fullscreen when quiz is complete
  useEffect(() => {
    if (resultData && document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.error('Failed to exit fullscreen:', err));
    }
  }, [resultData]);

  // Add reload warning handler
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Only show warning if quiz is in progress and not yet submitted
      if (!quizStarted || resultData || isSubmitting) return;

      // Standard way to show confirmation dialog
      event.preventDefault();
      event.returnValue = 'Your test will be automatically submitted if you reload. Are you sure?';

      // Modern browsers ignore custom messages, but we'll try to use the native confirm
      const confirmMessage = 'Your test will be automatically submitted if you reload. Are you sure?';

      // If user confirms reload, submit the quiz
      // Note: Most modern browsers automatically handle the confirmation dialog
      // and this block may not execute as expected due to security restrictions
      if (window.confirm(confirmMessage)) {
        submitQuizHandler();
      }

      return event.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [quizStarted, resultData, isSubmitting]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const submitQuizHandler = async () => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].correct_answer === answers[i]) {
        score++;
      }
    }

    let tip = 'Great Job! You have answered all questions correctly. Keep up the good work!';

    if (score !== questions.length) {
      const data = {
        questions: questions,
        answers: answers,
      };

      try {
        const tipResponse = await axios.post('/api/interview-prep/getImprovementTip', {
          data: data,
        });
        if (tipResponse.status !== 200 || !tipResponse.data) {
          toast.error('Failed to get improvement tip. Please try again.');
          setIsSubmitting(false);
          return;
        }
        tip = tipResponse.data.tip;
      } catch (error) {
        console.error('Error getting improvement tip:', error);
        toast.error('Failed to submit quiz. Please try again.');
        setIsSubmitting(false);
        return;
      }
    }

    const questionsWithUserAnswers = questions.map((q, i) => ({
      ...q,
      user_answer: answers[i],
    }));

    const submittedQuiz = {
      questions: questionsWithUserAnswers,
      quizscore: score,
      improvementTip: tip,
      category: quizData.category,
    };

    try {
      const response = await axios.post('/api/interview-prep/submitQuiz', {
        submittedQuiz: submittedQuiz
      });

      if (response.status === 200) {
        setResultData(response.data); // Set result data to display results
        setQuizStarted(false); // Reset quiz started state
        setAnswers([]); // Reset answers for next quiz
        setQuestionNumber(0); // Reset question number
        setIsSubmitting(false); // Reset submitting state
        toast.success(`Quiz submitted successfully! Your score is ${score} out of ${questions.length}.`);
      } else {
        toast.error("Failed to submit quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz. Please try again.");
      return;

    }
  };

  const handleFullScreenRequest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setQuizStarted(true); // Start the quiz when fullscreen is entered
      setIsFullScreen(true);
      setFullScreenWarning(false);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      toast.error('Please enable fullscreen mode to start the quiz.');
    }
  };

  const progress = (questionNumber / questions.length) * 100;

  // Start Screen
  if (!quizStarted && !resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Toaster position="top-center" richColors closeButton={false} />
        <Card className="bg-white p-8 rounded-xl shadow-xl max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Quiz</h2>
          <p className="text-gray-600 mb-6">
            This quiz consists of {questions.length} questions and must be taken in fullscreen mode.
            Click the button below to start the quiz in fullscreen.
          </p>
          <Button
            onClick={handleFullScreenRequest}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200"
          >
            Start Quiz in Fullscreen
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            You can also press <span className="font-semibold">F11</span> after clicking to enter fullscreen mode.
          </p>
        </Card>
      </div>
    );
  }

  // Submitting Screen
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">Analyzing Your Answers</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're processing your responses and preparing personalized feedback to help you improve.
            </p>
          </div>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto space-y-6">
      <Toaster position="top-center" richColors closeButton={false} />


      {/* Fullscreen Warning Overlay */}
      {fullScreenWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-white p-6 rounded-xl shadow-xl max-w-md text-center">
            <h3 className="text-xl font-bold text-red-600 mb-4">Fullscreen Mode Required</h3>
            <p className="text-gray-600 mb-4">
              Please return to fullscreen mode to continue the quiz. You have{' '}
              <span className="font-bold text-red-600">{warningTimeLeft}</span> seconds remaining.
            </p>
            <Button
              onClick={handleFullScreenRequest}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Enter Fullscreen
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Press <span className="font-semibold">F11</span> or click the button above to enter fullscreen mode.
            </p>
          </Card>
        </div>
      )}

      {!resultData && (
        <>
          {/* Fixed Timer in Top-Right Corner */}
          <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Time Left</p>
                <p className={`text-lg font-bold ${timeLeft <= 60 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-lg font-bold text-purple-600">
                  {questionNumber + 1} of {questions.length}
                </p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-gray-500 mt-2">{Math.round(progress)}% Complete</p>
          </div>

          {/* Question Card */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Question {questionNumber + 1}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  {questions.length - questionNumber - 1} remaining
                </span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 leading-relaxed">
                {questions[questionNumber]?.question}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <div className="space-y-1 mb-6">
                <Label className="text-base font-semibold text-gray-700">Select your answer:</Label>
                <p className="text-sm text-gray-500">Choose the option that best answers the question</p>
              </div>

              <RadioGroup
                onValueChange={(value) => {
                  const updatedAnswers = [...answers];
                  updatedAnswers[questionNumber] = parseInt(value);
                  setAnswers(updatedAnswers);
                }}
                value={answers[questionNumber] !== undefined ? answers[questionNumber].toString() : ''}
                className="space-y-4"
              >
                {questions[questionNumber]?.options.map((option, index) => {
                  const optionId = `q${questionNumber}_option${index}`;
                  const isSelected = answers[questionNumber] === index;

                  return (
                    <div
                      key={index}
                      className={`flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 hover:bg-gray-50 cursor-pointer ${isSelected ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <RadioGroupItem value={index.toString()} id={optionId} className="mt-0.5" />
                      <Label
                        htmlFor={optionId}
                        className={`flex-1 text-base leading-relaxed cursor-pointer ${isSelected ? 'text-purple-900 font-medium' : 'text-gray-700'
                          }`}
                      >
                        <span className="font-semibold text-gray-500 mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>

            <CardFooter className="p-8 pt-0">
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-gray-500">
                  {answers[questionNumber] !== undefined && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Answer selected</span>
                    </div>
                  )}
                </div>

                {questionNumber === questions.length - 1 ? (
                  <Button
                    onClick={submitQuizHandler}
                    disabled={answers[questionNumber] === undefined}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Finish Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={() => setQuestionNumber(questionNumber + 1)}
                    disabled={answers[questionNumber] === undefined}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Question
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </>
      )}

      {resultData && <ResultCard resultData={resultData} />}
    </div>
  );
};

export default Quiz;