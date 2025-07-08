
'use client'

import React, { useState } from 'react'
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import AnalyzeResult from './_component/AnalyzeResult';
import { ArrowLeft, Upload, FileText, Briefcase, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const ResumeAnalyzer = () => {
    const [analyzeResult, setAnalyzeResult] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDesc, setJobDesc] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            toast.error('Please upload a resume file.');
            return;
        }

        setIsLoading(true);
        toast.loading('Analyzing your resume...');

        try {
            const formData = new FormData();
            formData.append('resume', resumeFile);
            formData.append('jobDesc', jobDesc);
            const response = await axios.post('/api/resume-analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status !== 200) {
                throw new Error('Failed to analyze resume');
            }

            setAnalyzeResult(response.data);
            toast.dismiss();
            setResumeFile(null);
            setJobDesc('');
            toast.success('Resume analysis completed successfully!');
        } catch (error) {
            toast.dismiss();
            console.error('Error analyzing resume:', error);
            toast.error('Server error. Failed to analyze resume. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Check file size (4MB limit)
            const maxSize = 4 * 1024 * 1024; // 4MB in bytes
            if (file.size > maxSize) {
                toast.error('File size must be less than 4MB. Please choose a smaller file.');
                e.target.value = ''; // Clear the input
                return;
            }
            
            setResumeFile(file);
            toast.success(`File "${file.name}" uploaded successfully!`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-300/20 via-gray-100 to-indigo-500/20">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12'>

                {analyzeResult && (
                    <div className='mb-6 sm:mb-8'>
                        <Button
                            onClick={() => setAnalyzeResult(null)}
                            variant="ghost"
                            className='flex items-center text-slate-600 hover:text-purple-600 transition-all duration-200 group cursor-pointer text-sm sm:text-base'
                        >
                            <ArrowLeft className='mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200' />
                            Back to Analysis Form
                        </Button>
                    </div>
                )}

                {/* Hero Section */}
                <div className='text-center my-8 sm:my-12'>
                    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-5">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">Resume Analyzer</h1>
                        <p className='text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4'>
                            Get AI-powered insights to optimize your resume for applicant tracking systems (ATS)
                            and increase your chances of landing your dream job.
                        </p>
                    </div>
                </div>

                {!analyzeResult ? (
                    <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center pb-6 sm:pb-8 px-4 sm:px-6">
                            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center justify-center gap-2 flex-wrap">
                                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                <span>Upload Your Resume</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                            <form onSubmit={submitHandler} className="space-y-6 sm:space-y-8">
                                {/* File Upload Section */}
                                <div className="space-y-3">
                                    <label htmlFor="resumeFile" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        Resume File (PDF, DOCX)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="resumeFile"
                                            accept=".pdf,.docx"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            required
                                        />
                                        <label
                                            htmlFor="resumeFile"
                                            className={`block w-full p-4 sm:p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 ${resumeFile ? 'border-green-400 bg-green-50/50' : 'border-slate-300'
                                                }`}
                                        >
                                            <div className="text-center">
                                                {resumeFile ? (
                                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                                        <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                                                        <div className="text-center sm:text-left">
                                                            <p className="font-medium text-green-700 text-sm sm:text-base break-all">{resumeFile.name}</p>
                                                            <p className="text-xs sm:text-sm text-green-600">File uploaded successfully</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-3" />
                                                        <p className="text-slate-600 font-medium text-sm sm:text-base">Click to upload your resume</p>
                                                        <p className="text-xs sm:text-sm text-slate-500 mt-1">or drag and drop your file here</p>
                                                        <p className="text-xs text-slate-400 mt-2">Supports PDF and DOCX files (Max 4MB)</p>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Job Description Section */}
                                <div className="space-y-3">
                                    <label htmlFor="jobDesc" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        Job Description (Optional)
                                    </label>
                                    <Textarea
                                        id="jobDesc"
                                        placeholder="Paste the complete job description here to get more targeted analysis and recommendations..."
                                        className="min-h-24 sm:min-h-32 resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 text-sm sm:text-base"
                                        value={jobDesc}
                                        onChange={(e) => setJobDesc(e.target.value)}
                                    />
                                    <p className="text-xs text-slate-500">
                                        Adding a job description helps provide more specific recommendations for your resume.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                                            <span className="text-sm sm:text-base">Analyzing Resume...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                                            <span className="text-sm sm:text-base">Analyze Resume</span>
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <AnalyzeResult analyzeResult={analyzeResult} />
                )}
            </div>
        </div>
    )
}

export default ResumeAnalyzer
