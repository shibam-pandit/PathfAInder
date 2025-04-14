"use client"
import { useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function Home() {

  // Reveal elements on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show")
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el)
    })

    return () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        observer.unobserve(el)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navbar */}
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Accelerate Your Career
                  </span>
                  <br />
                  <span className="text-slate-800">With AI Guidance</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-xl">
                  Your intelligent companion for job search success. Create standout resumes, compelling cover letters,
                  and ace your interviews with confidence.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/resume-builder"
                    className="px-6 py-3 rounded-md bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium text-center"
                  >
                    Build Your Resume
                  </Link>
                  <Link
                    href="/interview-prep"
                    className="px-6 py-3 rounded-md border border-violet-600 text-violet-600 hover:bg-violet-50 font-medium text-center"
                  >
                    Prepare for Interviews
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-slate-600">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 border-2 border-white"
                      />
                    ))}
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold">4,000+</span> job seekers found success last month
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-violet-200 rounded-full filter blur-3xl opacity-50"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-200 rounded-full filter blur-3xl opacity-50"></div>

                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 h-3"></div>
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-slate-800">Resume Analysis</h3>
                      <span className="px-2 py-1 bg-teal-100 text-teal-600 text-xs font-medium rounded-full">
                        AI Powered
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
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
                        <div>
                          <p className="text-sm font-medium text-slate-700">ATS Compatibility</p>
                          <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                            <div className="bg-teal-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                          </div>
                        </div>
                        <span className="text-teal-600 font-semibold">92%</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
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
                        <div>
                          <p className="text-sm font-medium text-slate-700">Job Match Score</p>
                          <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                            <div className="bg-violet-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                          </div>
                        </div>
                        <span className="text-violet-600 font-semibold">87%</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
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
                        <div>
                          <p className="text-sm font-medium text-slate-700">Impact Score</p>
                          <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                          </div>
                        </div>
                        <span className="text-purple-600 font-semibold">78%</span>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">AI Suggestion:</span> Add more quantifiable achievements to your
                        work experience section to increase your impact score.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 reveal opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Everything You Need to Land Your Dream Job
              </h2>
              <p className="text-lg text-slate-600">
                Our AI-powered platform provides all the tools you need to navigate your job search journey with
                confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-md reveal opacity-0"
                style={{ transitionDelay: "0.1s" }}
              >
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">AI Resume Builder</h3>
                <p className="text-slate-600 mb-6">
                  Create ATS-optimized resumes tailored to specific job descriptions with our AI-powered builder that
                  highlights your most relevant skills.
                </p>
                <Link
                  href="/resume-builder"
                  className="inline-flex items-center text-violet-600 font-medium hover:text-violet-700"
                >
                  Build Your Resume
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              {/* Feature 2 */}
              <div
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-md reveal opacity-0"
                style={{ transitionDelay: "0.2s" }}
              >
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Cover Letter Assistant</h3>
                <p className="text-slate-600 mb-6">
                  Generate personalized cover letters that showcase your unique value proposition and align perfectly
                  with the company's culture and requirements.
                </p>
                <Link
                  href="/cover-letter"
                  className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700"
                >
                  Create Cover Letter
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              {/* Feature 3 */}
              <div
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-md reveal opacity-0"
                style={{ transitionDelay: "0.3s" }}
              >
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Interview Preparation</h3>
                <p className="text-slate-600 mb-6">
                  Practice with industry-specific questions, receive real-time feedback, and master the STAR method with
                  our interactive interview simulator.
                </p>
                <Link
                  href="/interview-prep"
                  className="inline-flex items-center text-amber-600 font-medium hover:text-amber-700"
                >
                  Start Practicing
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 reveal opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">How PathfAInder Works</h2>
              <p className="text-lg text-slate-600">
                Our AI-powered platform simplifies your job search process in just a few steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload Your Information",
                  description: "Import your existing resume or enter your experience, skills, and education details.",
                  color: "from-violet-500 to-purple-600",
                },
                {
                  step: "02",
                  title: "Select Your Target Role",
                  description: "Choose the job position you're applying for and add the specific job description.",
                  color: "from-teal-500 to-emerald-600",
                },
                {
                  step: "03",
                  title: "AI Optimization",
                  description:
                    "Our AI analyzes your profile against the job requirements and optimizes your application materials.",
                  color: "from-amber-500 to-orange-600",
                },
                {
                  step: "04",
                  title: "Download & Apply",
                  description: "Get your polished resume and cover letter, then track your applications in one place.",
                  color: "from-rose-500 to-pink-600",
                },
              ].map((item, index) => (
                <div key={index} className="reveal opacity-0" style={{ transitionDelay: `${0.1 * (index + 1)}s` }}>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-lg mb-4`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center reveal opacity-0">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-md bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium text-lg inline-block"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 reveal opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                More Ways PathfAInder Helps You Succeed
              </h2>
              <p className="text-lg text-slate-600">
                Comprehensive tools to support every stage of your career journey
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Job Search Tracker",
                  description: "Organize applications and set follow-up reminders to stay on top of opportunities.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  delay: "0.1s",
                },
                {
                  title: "Salary Negotiation",
                  description: "Get data-driven insights and scripts to negotiate the compensation you deserve.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  delay: "0.2s",
                },
                {
                  title: "LinkedIn Optimization",
                  description: "Enhance your profile to attract recruiters and stand out to hiring managers.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  delay: "0.3s",
                },
                {
                  title: "Mock Interviews",
                  description: "Practice with AI-simulated interviews tailored to your industry and role.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  ),
                  delay: "0.4s",
                },
                {
                  title: "Skills Assessment",
                  description: "Identify skill gaps and get personalized learning recommendations.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  ),
                  delay: "0.5s",
                },
                {
                  title: "Career Path Planning",
                  description: "Map out your long-term career goals with AI-guided roadmaps.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                  ),
                  delay: "0.6s",
                },
                {
                  title: "Personal Branding",
                  description: "Develop a consistent professional brand across all platforms.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                  ),
                  delay: "0.7s",
                },
                {
                  title: "Networking Assistant",
                  description: "Generate personalized outreach messages and follow-ups.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  ),
                  delay: "0.8s",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 reveal opacity-0"
                  style={{ transitionDelay: feature.delay }}
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 reveal opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Success Stories</h2>
              <p className="text-lg text-slate-600">
                See how PathfAInder has helped job seekers land their dream roles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "UX Designer at Google",
                  quote:
                    "After 3 months of job searching with no callbacks, I used PathfAInder to optimize my resume. Within 2 weeks, I had 5 interviews and landed my dream job at Google!",
                  delay: "0.1s",
                },
                {
                  name: "Michael Chen",
                  role: "Software Engineer at Microsoft",
                  quote:
                    "The interview preparation tool was a game-changer. I practiced with industry-specific questions and felt completely confident during my technical interviews.",
                  delay: "0.2s",
                },
                {
                  name: "Priya Patel",
                  role: "Marketing Manager at Spotify",
                  quote:
                    "The cover letter assistant helped me craft personalized letters for each application. Recruiters specifically mentioned how my cover letter stood out from other candidates.",
                  delay: "0.3s",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 reveal opacity-0"
                  style={{ transitionDelay: testimonial.delay }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600"></div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-violet-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center reveal opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Accelerate Your Career Journey?</h2>
              <p className="text-xl text-violet-100 mb-10 max-w-2xl mx-auto">
                Join thousands of job seekers who have successfully landed their dream jobs with PathfAInder's
                AI-powered guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="px-6 py-3 rounded-md bg-white text-violet-600 hover:bg-slate-100 font-medium text-center"
                >
                  Get Started for Free
                </Link>
                <Link
                  href="/demo"
                  className="px-6 py-3 rounded-md border border-white text-white hover:bg-white/10 font-medium text-center"
                >
                  Watch Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Animation Styles */}
      <style jsx global>{`
        .reveal {
          transform: translateY(20px);
          transition: all 0.8s ease;
        }
        
        .reveal.show {
          transform: translateY(0);
          opacity: 1 !important;
        }
      `}</style>
    </div>
  )
}
