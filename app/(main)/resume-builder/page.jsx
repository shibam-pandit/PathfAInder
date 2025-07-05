import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import ResumeForm from './_components/ResumeForm'
import ResumeView from './_components/ResumeView'
import { getResume } from '@/lib/services/resume_builder.service'

const ResumeBuilder = async() => {
    const resumeData = await getResume();

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-300/20 via-gray-100 to-indigo-500/20 pt-32 lg:pt-28">
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className=' text-center break-words my-6 space-y-5'>
                    <h1 className="text-5xl font-extrabold">Resume Builder</h1>
                    <p className='text-md text-gray-500'>
                        Create a professional resume in minutes with our easy-to-use resume builder.
                    </p>
                </div>

                <Tabs defaultValue={resumeData.markdown?"View":"Form"} className="w-full max-w-6xl mx-auto py-6">
                    <TabsList className="flex w-full gap-2 bg-transparent rounded-xl shadow-lg max-w-2xl mx-auto">
                        <div className="flex w-full ">
                            <TabsTrigger
                                value="Form"
                                className="flex-1 text-lg sm:text-xl py-3 text-center font-semibold
                                    transition-colors duration-300
                                    data-[state=active]:bg-gradient-to-r
                                    data-[state=active]:from-[#6A0DAD]
                                    data-[state=active]:to-[#1D2671]
                                    data-[state=active]:text-white
                                    data-[state=inactive]:bg-gray-100
                                    data-[state=inactive]:text-gray-700
                                    rounded-l-lg
                                    cursor-pointer"
                            >
                                Form
                            </TabsTrigger>
                            <div className="w-px bg-gray-400"></div>
                            <TabsTrigger
                                value="View"
                                className="flex-1 text-lg sm:text-xl py-3 text-center font-semibold
                                    transition-colors duration-300
                                    data-[state=active]:bg-gradient-to-r
                                    data-[state=active]:from-[#FF6B6B]
                                    data-[state=active]:to-[#C83349]
                                    data-[state=active]:text-white
                                    data-[state=inactive]:bg-gray-100
                                    data-[state=inactive]:text-gray-700
                                    rounded-r-lg
                                    cursor-pointer"
                            >
                                View
                            </TabsTrigger>
                        </div>

                    </TabsList>
                    <TabsContent value="Form">
                        <div className="bg-gray-100/90 rounded-lg shadow p-6 mt-4">
                            <ResumeForm formData={resumeData.formdata} />
                        </div>
                    </TabsContent>
                    <TabsContent value="View">
                        <div className="bg-white/90 rounded-lg shadow p-6 mt-4">
                            <ResumeView resumeData={resumeData} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default ResumeBuilder