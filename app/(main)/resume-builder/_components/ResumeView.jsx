'use client'

import React from 'react'
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useState, useEffect } from "react";
import MDEditor from '@uiw/react-markdown-editor';
import { generateResume } from './_templates/Template_1';
import { toast, Toaster } from 'sonner';
import axios from 'axios';

const ResumeView = ({ resumeData }) => {
  if (!resumeData || !resumeData.formdata) {
    return <div>No resume data available</div>;
  }

  const [markdown, setMarkdown] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(
    () => {
      if (resumeData.markdown) {
        setMarkdown(resumeData.markdown);
      } else {
      const generatedMarkdown = generateResume(resumeData.formdata);
      setMarkdown(generatedMarkdown);
      }
    }, [resumeData.formdata, resumeData.markdown])

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
      <Toaster position="top-center" richColors closeButton={false} />
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
    </div>
  );
}

export default ResumeView