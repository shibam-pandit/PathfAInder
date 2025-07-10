import React from 'react';

const AnalyzeResult = ({ analyzeResult }) => {
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

    return (
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 h-3"></div>
            <div className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800">Resume Analysis</h3>
                    <span className="px-3 py-1 bg-teal-100 text-teal-600 text-xs font-medium rounded-full self-start sm:self-center">
                        AI Powered
                    </span>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700">ATS Compatibility</p>
                            <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                                <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${analyzeResult.atsCompatibility}%` }}></div>
                            </div>
                        </div>
                        <span className="text-teal-600 font-semibold text-sm sm:text-base flex-shrink-0">{analyzeResult.atsCompatibility}%</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700">Job Match Score</p>
                            <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                                <div className="bg-violet-500 h-2 rounded-full transition-all duration-500" style={{ width: `${analyzeResult.jobMatchScore}%` }}></div>
                            </div>
                        </div>
                        <span className="text-violet-600 font-semibold text-sm sm:text-base flex-shrink-0">{analyzeResult.jobMatchScore}%</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700">Impact Score</p>
                            <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                                <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${analyzeResult.impactScore}%` }}></div>
                            </div>
                        </div>
                        <span className="text-purple-600 font-semibold text-sm sm:text-base flex-shrink-0">{analyzeResult.impactScore}%</span>
                    </div>
                </div>

                <div className="mt-6 sm:mt-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-sm text-slate-600">
                        <span className="font-semibold text-sm sm:text-base">AI Suggestion:</span>
                        <div className="mt-2 text-xs sm:text-sm leading-relaxed">
                            {analyzeResult.aiSuggestion ? 
                                (() => {
                                    // Handle different types of aiSuggestion
                                    let suggestions = analyzeResult.aiSuggestion;
                                    
                                    // If it's an array, join it into a string
                                    if (Array.isArray(suggestions)) {
                                        suggestions = suggestions.join('\n');
                                    }
                                    
                                    // If it's not a string at this point, convert it
                                    if (typeof suggestions !== 'string') {
                                        suggestions = String(suggestions);
                                    }
                                    
                                    return suggestions.split('\n').map((paragraph, i) => (
                                        <p key={i} className="mb-2 last:mb-0">{parseMarkdownBold(paragraph)}</p>
                                    ));
                                })() : 
                                <p>No suggestions available. Your resume is already optimized!</p>
                            }
                        </div>
                    </div>
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
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-amber-800 mb-1">Disclaimer</p>
                            <p className="text-xs leading-relaxed text-amber-700">
                                This resume analysis is generated by an AI model and may occasionally produce inaccurate or inconsistent results.
                                We recommend reviewing all suggestions manually and not relying solely on the scores for job applications or career decisions.
                                For best results, pair AI insights with expert human feedback.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyzeResult;