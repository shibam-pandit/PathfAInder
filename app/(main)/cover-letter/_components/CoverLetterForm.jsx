"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, Briefcase, Sparkles, ChevronDown, Lightbulb } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

const CoverLetterForm = () => {
  const router = useRouter()
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [jobDesc, setJobDesc] = useState("")
  const [resume, setResume] = useState(null)
  const [selectedTone, setSelectedTone] = useState("formal")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Tones configuration - easily extensible
  const tones = [
    {
      id: "formal",
      name: "Formal",
      description: "Professional and traditional tone",
      icon: Briefcase
    },
    {
      id: "casual",
      name: "Casual",
      description: "Friendly and conversational tone",
      icon: Sparkles
    },
    {
      id: "creative",
      name: "Creative",
      description: "Innovative and expressive tone",
      icon: Lightbulb
    }
  ]

  // Get current selected tone object
  const currentTone = tones.find(tone => tone.id === selectedTone)

  // Get available tones (excluding the selected one)
  const availableTones = tones.filter(tone => tone.id !== selectedTone)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const maxSize = 4 * 1024 * 1024 // 4MB in bytes
      if (file.size > maxSize) {
        toast.error("File size exceeds 4MB limit. Please upload a smaller file.")
        e.target.value = null
        return
      }
      setResume(file)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!jobTitle || !companyName || !jobDesc || !resume) {
      toast.error("Please fill in all required fields.")
      return
    }
    toast.loading("Generating cover letter...")
    setIsLoading(true)

    const formData = new FormData()
    formData.append("jobTitle", jobTitle)
    formData.append("companyName", companyName)
    formData.append("jobDescription", jobDesc)
    formData.append("tone", selectedTone)
    formData.append("resume", resume)

    try {
      const response = await axios.post("/api/cover-letter", formData);
      if (response.status !== 200 || !response.data) {
        throw new Error("Failed to generate cover letter")
      }

      // Extract the ID from the response and navigate to the cover letter page
      const { id } = response.data
      if (!id) {
        throw new Error("No ID returned from server")
      }

      toast.dismiss()
      toast.success("Cover letter generated successfully!")
      
      // Navigate to the cover letter page
      router.push(`/cover-letter/${id}`)
    } catch (error) {
      console.error("Error generating cover letter:", error)
      toast.error("Failed to generate cover letter. Please try again.")
    } finally {
      toast.dismiss()
      setIsLoading(false)
      setJobTitle("")
      setCompanyName("")
      setJobDesc("")
      setResume(null)
      setSelectedTone("formal")
      setIsDropdownOpen(false)
    }
  }

  return (
    <>
      {/* Form Section */}
      <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 sm:pb-10 px-6 sm:px-8 pt-8 sm:pt-10">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center justify-center gap-3 flex-wrap">
                <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
                <span>Generate Your Cover Letter</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 sm:px-8 lg:px-10 pb-8 sm:pb-10">
              <form onSubmit={submitHandler} className="space-y-8 sm:space-y-10">
                {/* Job Title and Company Name Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="jobTitle" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Job Title
                    </Label>
                    <Input
                      id="jobTitle"
                      type="text"
                      placeholder="e.g., Software Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                      className="h-12 sm:h-14 text-base border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="companyName" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="e.g., Google"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="h-12 sm:h-14 text-base border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-3">
                  <Label htmlFor="jobDesc" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Job Description
                  </Label>
                  <Textarea
                    id="jobDesc"
                    placeholder="Paste the full job description here..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    required
                    className="min-h-[140px] sm:min-h-[160px] text-base resize-none border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200"
                  />
                </div>

                {/* Resume Upload */}
                <div className="space-y-3">
                  <Label htmlFor="resume" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Resume
                  </Label>
                  <div className="relative">
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      required
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className={`block w-full p-6 sm:p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 hover:border-purple-400 hover:bg-purple-50/50 ${resume ? 'border-green-400 bg-green-50/50' : 'border-slate-300'
                        }`}
                    >
                      <div className="text-center">
                        {resume ? (
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                            <div className="text-center sm:text-left">
                              <p className="font-medium text-green-700 text-base sm:text-lg break-all">{resume.name}</p>
                              <p className="text-sm sm:text-base text-green-600 mt-1">File uploaded successfully</p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-12 w-12 sm:h-14 sm:w-14 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-600 font-medium text-base sm:text-lg">Click to upload your resume</p>
                            <p className="text-sm sm:text-base text-slate-500 mt-2">or drag and drop your file here</p>
                            <p className="text-xs sm:text-sm text-slate-400 mt-3">Supports PDF, DOC, and DOCX files (Max 4MB)</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Tone Toggle */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Writing Tone
                  </Label>
                  <div className="relative">
                    <div
                      className="flex items-center justify-between p-4 sm:p-5 bg-slate-50 rounded-t-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <div className="flex items-center gap-3">
                        <currentTone.icon className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-slate-800 text-base">{currentTone.name}</p>
                          <p className="text-sm text-slate-600">{currentTone.description}</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Dropdown Options */}
                    {isDropdownOpen && availableTones.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-b-lg shadow-lg z-10 overflow-hidden">
                        {availableTones.map((tone) => (
                          <div
                            key={tone.id}
                            className="p-4 sm:p-5 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
                            onClick={() => {
                              setSelectedTone(tone.id)
                              setIsDropdownOpen(false)
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <tone.icon className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="font-medium text-slate-800 text-base">{tone.name}</p>
                                <p className="text-sm text-slate-600">{tone.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating Cover Letter...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" />
                      Generate Cover Letter
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
    </>
  )
}

export default CoverLetterForm