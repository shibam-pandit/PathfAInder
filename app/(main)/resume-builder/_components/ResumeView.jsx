'use client'

import React from 'react'
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useState, useEffect, useRef } from "react";
import MDEditor from '@uiw/react-markdown-editor';
import { generateResume } from './_templates/Template_1';
import { toast, Toaster } from 'sonner';
import axios from 'axios';

const ResumeView = ({ resumeData }) => {
  if (!resumeData || !resumeData.formdata) {
    return <div>No resume data available</div>;
  }

  // Helper function to parse markdown bold text
  const parseMarkdownBold = (text) => {
    if (!text) return text;
    
    // Split by ** and process each part
    const parts = text.split('**');
    return parts.map((part, index) => {
      // Every odd index (1, 3, 5...) should be bold
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  const [markdown, setMarkdown] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showATSPanel, setShowATSPanel] = useState(false);
  const [atsScore, setAtsScore] = useState(null);
  const [atsFeedback, setAtsFeedback] = useState(null);
  const [atsAnalysisDate, setAtsAnalysisDate] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const atsPanelRef = useRef(null);

  useEffect(
    () => {
      if (resumeData.markdown) {
        setMarkdown(resumeData.markdown);
      } else {
        const generatedMarkdown = generateResume(resumeData.formdata);
        setMarkdown(generatedMarkdown);
      }
    }, [resumeData.formdata, resumeData.markdown])

  useEffect(() => {
    const fetchAtsScore = async () => {
      setAnalyzing(true);
      try {
        const response = await axios.get('/api/resume-builder/atsAnalysis');
        if (response.status !== 200) {
          throw new Error("Failed to fetch ATS analysis");
        }
        const data = response.data;
        setAtsScore(data.atsscore || null);
        setAtsFeedback(data.feedback || null);
        // Store the date string as is
        setAtsAnalysisDate(data.updatedat || null);
        console.log("Previous ATS analysis fetched:", data.updatedat);
      } catch (error) {
        console.error("Error getting previous ats analysis:", error);
        toast.error("Failed to get previous ATS analysis. Please try again.");
      } finally {
        setAnalyzing(false);
      }
    };
    fetchAtsScore();
  }, []);

  // Close ATS panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (atsPanelRef.current && !atsPanelRef.current.contains(event.target)) {
        setShowATSPanel(false);
      }
    }

    if (showATSPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showATSPanel]);

  const handleSave = async () => {
    try {
      toast.loading("Saving resume...");
      const response = await axios.post('/api/resume-builder/saveMarkdown', { markdown });
      if (response.status !== 200) {
        throw new Error("Failed to save resume");
      }
      toast.dismiss();
      toast.success("Resume saved successfully!");
    } catch (error) {
      toast.dismiss();
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume. Please try again.");
    }
  };

  const handleAnalyzeATS = async () => {
    try {
      setAnalyzing(true);
      setShowATSPanel(true);

      // You'll need to create this API endpoint
      const response = await axios.post('/api/resume-builder/atsAnalysis', {
        markdown
      });

      if (response.status !== 200) {
        throw new Error("Failed to analyze resume");
      }

      setAtsScore(response.data.atsscore || null);
      setAtsFeedback(response.data.feedback || null);
      // Store the date string as is
      setAtsAnalysisDate(response.data.updatedat || null);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const name = `${resumeData.formdata.basicInfo.name?.split(" ").join("_")}_Resume.pdf` || "";
  const handleDownloadPDF = async () => {
    try {
      toast.loading("Downloading PDF...");
      const response = await axios.post(
        '/api/resume-builder/downloadPdf',
        { html: markdown },  // send your generated resume HTML
        {
          responseType: 'blob' // important to receive the PDF correctly
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();

      toast.dismiss();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  return (
    <div className="relative w-full">
      <div className={`absolute top-2 right-2 flex flex-col sm:flex-row gap-2 z-10 ${editMode ? 'w-auto' : 'w-auto'}`}>
        {!editMode ? (
          <>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 sm:px-3 rounded flex items-center text-xs sm:text-sm cursor-pointer"
              onClick={handleSave}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span className="hidden sm:inline">Save</span>
              <span className="inline sm:hidden">Save</span>
            </button>

            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-1 px-2 sm:px-3 rounded flex items-center text-xs sm:text-sm cursor-pointer"
              onClick={handleDownloadPDF}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Download PDF</span>
              <span className="inline sm:hidden">PDF</span>
            </button>

            <button
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1 px-2 sm:px-3 rounded flex items-center text-xs sm:text-sm cursor-pointer"
              onClick={() => setShowATSPanel(!showATSPanel)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="hidden sm:inline">ATS Score</span>
              <span className="inline sm:hidden">ATS</span>
            </button>
          </>
        ) : null}

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 sm:px-3 rounded flex items-center text-xs sm:text-sm cursor-pointer"
          onClick={() => setEditMode(!editMode)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {editMode ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            )}
          </svg>
          {editMode ? 'Preview' : 'Edit'}
        </button>
      </div>

      {editMode ? (
        <div className="wmde-markdown-var w-full">
          <MarkdownEditor
            value={markdown}
            onChange={setMarkdown}
            className="w-full h-full mx-auto"
          />
        </div>
      ) : (
        <div className="p-6 bg-white w-full" data-color-mode="light">
          <MDEditor.Markdown
            source={markdown}
            style={{
              padding: '20px',
              backgroundColor: 'white',
              color: 'black',
              width: '100%'
            }}
          />
        </div>
      )}




      {/* ATS Score Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${showATSPanel ? 'translate-x-0' : 'translate-x-full'
          }`}
        ref={atsPanelRef}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Resume ATS Analysis</h3>
            <button
              onClick={() => setShowATSPanel(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {analyzing ? (
            <div className="flex flex-col items-center justify-center h-80">
              <div className="w-12 h-12 border-4 border-t-amber-600 border-b-amber-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Analyzing your resume...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          ) : atsScore ? (
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Your ATS Score</p>
                <div className="flex items-center">
                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${atsScore >= 80 ? 'bg-green-500' :
                          atsScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${atsScore}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 font-bold text-lg">{atsScore}%</span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">Feedback & Recommendations</h4>
                <div className="prose prose-sm">
                  {atsFeedback ? (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {(() => {
                        // Handle different types of atsFeedback
                        let feedback = atsFeedback;
                        
                        // If it's an array, join it into a string
                        if (Array.isArray(feedback)) {
                          feedback = feedback.join('\n');
                        }
                        
                        // If it's not a string at this point, convert it
                        if (typeof feedback !== 'string') {
                          feedback = String(feedback);
                        }
                        
                        return feedback.split('\n').map((paragraph, i) => (
                          <p key={i} className="mb-2">{parseMarkdownBold(paragraph)}</p>
                        ));
                      })()}
                    </div>
                  ) : (
                    <p className="text-gray-500">No feedback available</p>
                  )}
                </div>
              </div>

              {atsAnalysisDate && (
                <div className="mt-4 text-sm text-gray-500">
                  Last analyzed: {(() => {
                    const date = new Date(atsAnalysisDate);
                    const istTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
                    const hours = istTime.getHours().toString().padStart(2, '0');
                    const minutes = istTime.getMinutes().toString().padStart(2, '0');
                    return `${istTime.getDate()}-${istTime.getMonth() + 1}-${istTime.getFullYear()} ${hours}:${minutes}`;
                  })()}
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={handleAnalyzeATS}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded flex items-center justify-center cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Re-analyze Resume
                </button>
              </div>

              {/* Disclaimer Warning */}
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-3">
                        <svg
                            className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-amber-800 mb-1">Disclaimer</p>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                This resume analysis is generated by an AI model and may occasionally produce inaccurate or inconsistent results.
                                We recommend reviewing all suggestions manually and not relying solely on the scores for job applications or career decisions.
                                For best results, pair AI insights with expert human feedback.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Check how ATS-friendly your resume is</h4>
              <p className="text-gray-600 mb-6">Get scored against applicant tracking systems and receive tailored recommendations</p>
              <button
                onClick={handleAnalyzeATS}
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg"
              >
                Analyze My Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeView