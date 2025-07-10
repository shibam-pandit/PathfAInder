'use client'

import React, { useState } from 'react'
import MarkdownEditor from '@uiw/react-markdown-editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit3, Eye, Save, Download } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import html2pdf from 'html2pdf.js'
import { marked } from 'marked'

const CoverLetterView = ({ Content }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(Content.content) // Initialize with the content passed as prop
    const id = Content.id

    const handleSave = async () => {
        try {
            toast.loading('Saving changes...')
            const response = await axios.post('/api/cover-letter/updateContent', {
                coverLetterContent: content,
                letterId: id
            })
            if (response.status !== 200) {
                throw new Error('Failed to save changes')
            }

            toast.dismiss()
            toast.success('Cover letter updated successfully!')
        } catch (error) {
            toast.dismiss()
            console.error('Error saving cover letter:', error)
            toast.error('Failed to save cover letter. Please try again.')
        } finally {
            setIsEditing(false)
        }
    }

    const handleDownload = () => {
        toast.loading('Downloading cover letter...')
        const options = {
            margin: 1,
            filename: `cover-letter-${id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }

        const htmlContent = marked(content)

        html2pdf()
            .from(htmlContent)
            .set(options)
            .save()
            .then(() => {
                toast.dismiss()
                toast.success('Cover letter downloaded successfully!')
            })
            .catch((error) => {
                toast.dismiss()
                console.error('Error downloading cover letter:', error)
                toast.error('Failed to download cover letter. Please try again.')
            })
    }

    return (
        <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-6 sm:pb-8 px-6 sm:px-8 pt-6 sm:pt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <Edit3 className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
                            Your Cover Letter
                        </CardTitle>
                        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base font-medium border-slate-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer"
                            >
                                {isEditing ? (
                                    <>
                                        <Eye className="h-4 w-4" />
                                        Preview
                                    </>
                                ) : (
                                    <>
                                        <Edit3 className="h-4 w-4" />
                                        Edit
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base font-medium border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 cursor-pointer text-white shadow-sm border-0"
                            >
                                <Save className="h-4 w-4" />
                                Save
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8 shadow-none">
                    <div className="bg-slate-50 rounded-lg p-1 mb-6">
                        <div className="bg-white rounded-md min-h-[500px] sm:min-h-[600px]">
                            {isEditing ? (
                                <MarkdownEditor
                                    value={content}
                                    onChange={(value) => setContent(value)}
                                    height={500}
                                    style={{
                                        border: 'none',
                                        overflow: 'hidden'
                                    }}
                                />
                            ) : (
                                <div className="p-6 sm:p-8 lg:p-10 shadow-none">
                                    <MarkdownEditor.Markdown
                                        source={content}
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: '#1e293b',
                                            fontFamily: 'system-ui, -apple-system, sans-serif',
                                            fontSize: '16px',
                                            lineHeight: '1.7',
                                            width: '100%'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CoverLetterView