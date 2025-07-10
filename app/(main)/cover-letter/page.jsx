import CoverLetterForm from "./_components/CoverLetterForm"
import CoverLetterHistory from "./_components/CoverLetterHistory"

const CoverLetter = () => {

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300/20 via-gray-100 to-indigo-500/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-28 lg:py-32">
        <div className="text-center mb-12 sm:mb-16 space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-800">
            Cover Letter Generator
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create a professional cover letter in minutes with our easy-to-use cover letter generator.
          </p>
        </div>
        <CoverLetterForm />
        <div className="mt-14">
          <CoverLetterHistory />
        </div>
      </div>
    </div>
  )
}

export default CoverLetter
