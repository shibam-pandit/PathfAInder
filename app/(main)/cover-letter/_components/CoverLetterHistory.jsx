import React from 'react'
import { getCoverLetterHistory } from '@/lib/services/cover_letter.service';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const CoverLetterHistory = async () => {
  const coverLetterHistory = await getCoverLetterHistory();

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 text-center sm:text-left">
          Cover Letter History
        </h2>
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <span className="font-medium">Note:</span> Cover letters are automatically deleted after 10 days of creation to maintain privacy and storage efficiency.
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        {coverLetterHistory.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {coverLetterHistory.map((letter) => (
              <div
                key={letter.id}
                className="p-3 sm:p-4 lg:p-6 bg-white rounded-lg shadow hover:bg-gray-50 transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">
                    {letter.jobtitle}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 truncate">
                    at {letter.companyname}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {new Date(letter.createdat).toLocaleDateString()}
                  </p>
                </div>

                <div className="w-full sm:w-auto">
                  <form action={`/cover-letter/${letter.id}`} method="get" className="flex items-center">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-3 sm:px-4 lg:px-6 py-2 lg:py-3 bg-purple-600 text-white text-sm sm:text-base rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium cursor-pointer"
                    >
                      <span className="hidden sm:inline">View Cover Letter</span>
                      <span className="sm:hidden">View</span>
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg">No cover letters found.</p>
            <p className="text-gray-400 text-sm mt-2">Create your first cover letter to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CoverLetterHistory