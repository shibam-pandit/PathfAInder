import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Link href="/" className="inline-block mb-4">
                            <span className="font-bold text-white text-2xl">
                                Pathf<span className="text-teal-500">AI</span>nder
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-4">
                            Your AI-powered companion for career success. Build resumes, craft cover letters, and ace your
                            interviews.
                        </p>
                        <div className="flex space-x-4">
                            {/* LinkedIn */}
                            <a href="https://www.linkedin.com/in/shibam-pandit" className="text-slate-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76 0-.97.78-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.78 1.76-1.75 1.76zm15.25 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.85-1.54 3.05 0 3.61 2.01 3.61 4.62v5.56z"/>
                                </svg>
                            </a>
                            {/* X (Twitter) */}
                            <a href="https://x.com/Shibam_Pandit" target='_blank' className="text-slate-400 hover:text-white">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M17.53 2.477h3.07l-6.72 7.68 7.92 11.366h-6.22l-4.86-6.97-5.56 6.97H2.47l7.18-7.99L2 2.477h6.38l4.36 6.26 4.79-6.26zm-1.08 16.13h1.7L7.62 4.29h-1.8l10.63 14.317z"/>
                                </svg>
                            </a>
                            <a href="https://github.com/shibam-pandit" target='_blank' className="text-slate-400 hover:text-white">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Tools</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/resume-builder" className="hover:text-white">
                                    Resume Builder
                                </Link>
                            </li>
                            <li>
                                <Link href="/cover-letter" className="hover:text-white">
                                    Cover Letter
                                </Link>
                            </li>
                            <li>
                                <Link href="/interview-prep" className="hover:text-white">
                                    Interview Prep
                                </Link>
                            </li>
                            <li>
                                <Link href="/resume-analyzer" className="hover:text-white">
                                    Resume Analyzer
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/blog" className="hover:text-white">
                                    Career Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/trending-techs" className="hover:text-white">
                                    Trending Technologies
                                </Link>
                            </li>
                            <li>
                                <Link href="/salary-guide" className="hover:text-white">
                                    Salary Guide
                                </Link>
                            </li>
                            <li>
                                <Link href="/templates" className="hover:text-white">
                                    Templates
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-white">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-white">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-400">
                    <p>© {new Date().getFullYear()} PathfAInder. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer