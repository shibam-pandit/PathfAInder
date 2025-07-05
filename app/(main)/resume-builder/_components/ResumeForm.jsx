'use client'

import React, { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react' // Import Sparkles icon from lucide-react
import axios from 'axios'
import { Toaster, toast } from 'sonner'

const ResumeForm = ({ formData }) => {
    const [loading, setLoading] = useState(false);
    const [basicInfo, setBasicInfo] = useState({
        name: '',
        email: '',
        contactNumber: '',
        github: '',
        linkedin: '',
        portfolio: ''
    });

    const [professionalSummary, setProfessionalSummary] = useState('');

    const [workExperiences, setWorkExperiences] = useState([]);

    const [projects, setProjects] = useState([]);

    const [education, setEducation] = useState([]);

    const [skills, setSkills] = useState([]);

    const [achievements, setAchievements] = useState([]);

    const [customSections, setCustomSections] = useState([]);

    const [newSectionName, setNewSectionName] = useState('');

    // Initialize form data if provided
    useEffect(() => {
        setBasicInfo(formData.basicInfo || {});
        setProfessionalSummary(formData.professionalSummary || '');
        setWorkExperiences(formData.workExperiences || []);
        setProjects(formData.projects || []);
        setEducation(formData.education || []);
        setSkills(formData.skills || []);
        setAchievements(formData.achievements || []);
        setCustomSections(formData.customSections || []);
        setNewSectionName('');
    }, [formData]);

    const handleAddExperience = () => {
        if (workExperiences.length >= 5) {
            return;
        }

        setWorkExperiences(prev => [
            ...prev,
            {
                id: Date.now(), // Use timestamp as unique id
                jobTitle: '',
                companyName: '',
                startDate: '',
                endDate: '',
                currentlyWorkingHere: false,
                responsibilities: ''
            }
        ]);
    };

    const handleRemoveExperience = (id) => {
        setWorkExperiences(prev => prev.filter(exp => exp.id !== id));
    };

    const handleExperienceChange = (id, field, value) => {
        setWorkExperiences(prev =>
            prev.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        );
    };

    const toggleCurrentlyWorking = (id) => {
        setWorkExperiences(prev =>
            prev.map(exp =>
                exp.id === id ?
                    { ...exp, currentlyWorkingHere: !exp.currentlyWorkingHere, endDate: !exp.currentlyWorkingHere ? '' : exp.endDate }
                    : exp
            )
        );
    };

    const handleAddProjects = () => {
        if (projects.length >= 5) {
            return;
        }

        setProjects(prev => [
            ...prev,
            {
                id: Date.now(), // Use timestamp as unique id
                projectTitle: '',
                githubLink: '',
                liveDemoLink: '',
                technologiesUsed: [],
                projectDescription: ''
            }
        ]);
    };

    const handleRemoveProject = (id) => {
        setProjects(prev => prev.filter(exp => exp.id !== id));
    };

    const handleProjectChange = (id, field, value) => {
        setProjects(projects.map(proj =>
            proj.id === id ? { ...proj, [field]: value } : proj
        ));
    };

    const handleAddEducation = () => {
        if (education.length >= 5) {
            return;
        }

        setEducation(prev => [
            ...prev,
            {
                id: Date.now(),
                institution: '',
                degree: '',
                fieldOfStudy: '',
                startYear: '',
                graduationYear: '',
                cgpa: ''
            }
        ]);
    };

    const handleRemoveEducation = (id) => {
        setEducation(education.filter(edu => edu.id !== id));
    };

    const handleEducationChange = (id, field, value) => {
        setEducation(education.map(edu =>
            edu.id === id ? { ...edu, [field]: value } : edu
        ));
    };

    const handleAddCustomSection = () => {
        if (!newSectionName.trim()) return;

        setCustomSections(prev => [
            ...prev,
            {
                id: Date.now(),
                name: newSectionName,
                content: ''
            }
        ]);
        setNewSectionName('');
    };

    const handleRemoveCustomSection = (id) => {
        setCustomSections(prev => prev.filter(section => section.id !== id));
    };

    const handleCustomSectionChange = (id, field, value) => {
        setCustomSections(prev =>
            prev.map(section =>
                section.id === id ? { ...section, [field]: value } : section
            )
        );
    };

    // Update how achievements are stored and handled
    const handleAchievementChange = (e) => {
        const text = e.target.value;
        setAchievements(text.split('\n'));
    };

    // Generate content handler - simplified to only take field parameter
    const handleGenerateContent = async (field, id = null) => {
        try {
            // Show loading toast
            toast.loading('Generating content...');

            let currentContent = '';
            let requestType = field;

            // Determine the current content and request type based on field
            if (field === 'professionalSummary') {
                currentContent = professionalSummary;
            } else if (field === 'workExperience') {
                const experience = workExperiences.find(exp => exp.id === id);
                currentContent = experience.responsibilities;
            } else if (field === 'projectDescription') {
                const project = projects.find(proj => proj.id === id);
                currentContent = project.projectDescription;
            } else if (field === 'achievements') {
                currentContent = achievements.join('\n');
            } else if (field === 'customSection') {
                const section = customSections.find(sec => sec.id === id);
                currentContent = section.content;
                requestType = section.name; // For custom sections, use section name as type
            }

            // Make API request
            const response = await axios.post('/api/resume-builder/aiImprovedText', {
                type: requestType,
                currentContent
            });

            // Dismiss loading toast
            toast.dismiss();

            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to generate content');
            }

            const { improvedText } = response.data;

            console.log(`For field: ${field}, generated text:`, improvedText);

            // Update the appropriate state based on field type
            if (field === 'professionalSummary') {
                setProfessionalSummary(improvedText);
                toast.success('Professional summary generated!');
            } else if (field === 'workExperience') {
                setWorkExperiences(prev =>
                    prev.map(exp =>
                        exp.id === id
                            ? { ...exp, responsibilities: improvedText }
                            : exp
                    )
                );
                toast.success('Work experience content generated!');
            } else if (field === 'projectDescription') {
                setProjects(prev =>
                    prev.map(proj =>
                        proj.id === id
                            ? { ...proj, projectDescription: improvedText }
                            : proj
                    )
                );
                toast.success('Project description generated!');
            } else if (field === 'achievements') {
                // Split by newlines, remove empty lines, but don't trim to preserve spaces
                const achievementLines = improvedText.split('\n').filter(line => line.length > 0);
                setAchievements(achievementLines);
                toast.success('Achievements list generated!');
            } else if (field === 'customSection') {
                setCustomSections(prev =>
                    prev.map(section =>
                        section.id === id
                            ? { ...section, content: improvedText }
                            : section
                    )
                );
                toast.success('Custom section content generated!');
            }

        } catch (error) {
            // Dismiss loading toast and show error
            toast.dismiss();
            console.error('Error generating content:', error);
            toast.error('Failed to generate content. Please try again.');
        }
    };


    const submitHandler = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        toast.loading('Generating resume...');

        const formData = {
            basicInfo,
            professionalSummary,
            education,
            workExperiences,
            projects,
            skills,
            achievements,
            customSections
        };

        try {
            const response = await axios.post('/api/resume-builder', formData);
            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to submit resume');
            }

            console.log(response);

            toast.dismiss();
            toast.success('Resume submitted successfully!');
            setTimeout(() => {
                toast.info('You can view your resume in the "View" tab.');
            }, 1000);
            setLoading(false);

        } catch (error) {
            setLoading(false);
            toast.dismiss();
            console.error('Error submitting form:', error);
            toast.error('Failed to submit resume. Please try again.');
        }
    }

    return (
        <div className=''>
            <Toaster position="top-center" richColors closeButton={false} />
            <form className="space-y-4" onSubmit={submitHandler}>
                <h3 className="text-2xl font-bold text-gray-800 col-span-2 py-2 pt-5">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 space-x-12">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="First Last"
                            value={basicInfo.name}
                            onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="abc@ex.com"
                            value={basicInfo.email}
                            onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">Contact Number</label>
                        <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="+91 123456789"
                            value={basicInfo.contactNumber}
                            onChange={(e) => setBasicInfo({ ...basicInfo, contactNumber: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">GitHub</label>
                        <input
                            type="url"
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="https://github.com/username"
                            value={basicInfo.github}
                            onChange={(e) => setBasicInfo({ ...basicInfo, github: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">LinkedIn</label>
                        <input
                            type="url"
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="https://linkedin.com/username"
                            value={basicInfo.linkedin}
                            onChange={(e) => setBasicInfo({ ...basicInfo, linkedin: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">Portfolio</label>
                        <input
                            type="url"
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="https://portfolio.com"
                            value={basicInfo.portfolio}
                            onChange={(e) => setBasicInfo({ ...basicInfo, portfolio: e.target.value })}
                        />
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 col-span-2 pt-5 mt-10">Professional Summary</h3>
                <div className="relative">
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows="4"
                        placeholder="Write a brief summary about your professional background, skills, and career goals."
                        value={professionalSummary}
                        onChange={(e) => setProfessionalSummary(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-3 bottom-3 p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md transition-all duration-200 cursor-pointer flex items-center"
                        onClick={() => handleGenerateContent('professionalSummary')}
                        title="Enhance using AI"
                    >
                        <Sparkles className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex flex-col justify-between gap-5 items-start pt-5 mt-10">
                    <h3 className="text-2xl font-bold text-gray-800">Work Experience</h3>
                    {workExperiences.length === 0 && (
                        <button
                            type="button"
                            className="px-3 py-2 bg-indigo-800 text-white rounded-md shadow hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-colors duration-200"
                            onClick={handleAddExperience}
                        >
                            Add Experience
                        </button>
                    )}
                </div>

                <div>
                    {workExperiences.map((experience, index) => (
                        <div key={experience.id} className={`space-y-4 pb-6 mb-6 ${index < workExperiences.length - 1 ? "border-b" : ""}`}>
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold text-gray-700">Experience {index + 1}</h4>
                                <button
                                    type="button"
                                    className="px-2 py-1 text-red-600 hover:text-red-800 focus:outline-none cursor-pointer transition-colors duration-200"
                                    onClick={() => handleRemoveExperience(experience.id)}
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Job Title</label>
                                    <input
                                        type="text"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Software Engineer"
                                        value={experience.jobTitle}
                                        onChange={(e) => handleExperienceChange(experience.id, 'jobTitle', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                                    <input
                                        type="text"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Tech Company"
                                        value={experience.companyName}
                                        onChange={(e) => handleExperienceChange(experience.id, 'companyName', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                                    <input
                                        type="date"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={experience.startDate}
                                        onChange={(e) => handleExperienceChange(experience.id, 'startDate', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">End Date</label>
                                    <input
                                        type="date"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={experience.currentlyWorkingHere}
                                        value={experience.endDate}
                                        onChange={(e) => handleExperienceChange(experience.id, 'endDate', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type='checkbox'
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                    checked={experience.currentlyWorkingHere}
                                    onChange={() => toggleCurrentlyWorking(experience.id)}
                                />
                                <label className="text-sm font-medium text-gray-700 ml-2">
                                    Currently Working Here
                                </label>
                            </div>

                            <div className="relative">
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    rows="4"
                                    placeholder="Describe your responsibilities and achievements in this role."
                                    value={experience.responsibilities}
                                    onChange={(e) => handleExperienceChange(experience.id, 'responsibilities', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 bottom-3 p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md transition-all duration-200 cursor-pointer flex items-center"
                                    onClick={() => handleGenerateContent('workExperience', experience.id)}
                                    title="Enhance using AI"
                                >
                                    <Sparkles className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {workExperiences.length > 0 && workExperiences.length < 5 && (
                        <div className='flex justify-end mt-4 text-sm'>
                            <button
                                type="button"
                                className="px-3 py-2 bg-indigo-800 text-white rounded-md shadow hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-colors duration-200"
                                onClick={handleAddExperience}
                            >
                                Add Another Experience
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-5 justify-between items-start pt-5 mt-10">
                    <h3 className="text-2xl font-bold text-gray-800">Projects</h3>
                    {projects.length === 0 && (
                        <button
                            type="button"
                            className="px-3 py-2 bg-indigo-800 text-white rounded-md shadow hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-colors duration-200"
                            onClick={handleAddProjects}
                        >
                            Add Project
                        </button>
                    )}
                </div>

                <div>
                    {projects.map((project, index) => (
                        <div key={project.id} className={`space-y-4 pb-6 mb-6 ${index < projects.length - 1 ? "border-b" : ""}`}>
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold text-gray-700">Project {index + 1}</h4>
                                <button
                                    type="button"
                                    className="px-2 py-1 text-red-600 hover:text-red-800 focus:outline-none cursor-pointer transition-colors duration-200"
                                    onClick={() => handleRemoveProject(project.id)}
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Project Title</label>
                                    <input
                                        type="text"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="ToDo App"
                                        value={project.projectTitle}
                                        onChange={(e) => handleProjectChange(project.id, 'projectTitle', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Technologies Used(Comma Separated)</label>
                                    <input
                                        type="text"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="JavaScript, React, Node.js"
                                        value={project.technologiesUsed.join(', ')}
                                        onChange={(e) => handleProjectChange(project.id, 'technologiesUsed', e.target.value.split(',').map(tech => tech.trim()))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">GitHub Link</label>
                                    <input
                                        type="url"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="https://github.com/usernaame/project"
                                        value={project.githubLink}
                                        onChange={(e) => handleProjectChange(project.id, 'githubLink', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Live Demo Link</label>
                                    <input
                                        type="url"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="https://live-demo.com"
                                        value={project.liveDemoLink}
                                        onChange={(e) => handleProjectChange(project.id, 'liveDemoLink', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2"
                                    rows="4"
                                    placeholder="Describe your project features, challenges faced, and outcomes."
                                    value={project.projectDescription}
                                    onChange={(e) => handleProjectChange(project.id, 'projectDescription', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 bottom-3 p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md transition-all duration-200 cursor-pointer flex items-center"
                                    onClick={() => handleGenerateContent('projectDescription', project.id)}
                                    title="Enhance using AI"
                                >
                                    <Sparkles className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {projects.length > 0 && projects.length < 5 && (
                        <div className='flex justify-end mt-4 text-sm'>
                            <button
                                type="button"
                                className="px-3 py-2 bg-indigo-800 text-white rounded-md shadow hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-colors duration-200"
                                onClick={handleAddProjects}
                            >
                                Add Another Project
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-5 justify-between items-start pt-5 mt-10">
                    <h3 className="text-2xl font-bold text-gray-800">Education</h3>
                    {education.length === 0 && (
                        <button
                            type="button"
                            className="px-3 py-2 bg-indigo-800 text-white rounded-md shadow hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-colors duration-200"
                            onClick={handleAddEducation}
                        >
                            Add Education
                        </button>
                    )}
                </div>

                <div>
                    {education.map((edu, index) => (
                        <div key={edu.id} className={`space-y-4 pb-6 mb-6 ${index < education.length - 1 ? "border-b" : ""}`}>
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold text-gray-700">Education {index + 1}</h4>
                                <button
                                    type="button"
                                    className="px-2 py-1 text-red-600 hover:text-red-800 focus:outline-none cursor-pointer transition-colors duration-200"
                                    onClick={() => handleRemoveEducation(edu.id)}
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Institution</label>
                                    <input
                                        type="text"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="University/College Name"
                                        value={edu.institution}
                                        onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Degree</label>
                                    <input
                                        type="text"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Bachelor's, Master's, etc."
                                        value={edu.degree}
                                        onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Field of Study</label>
                                    <input
                                        type="text"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Computer Science, Engineering, etc."
                                        value={edu.fieldOfStudy}
                                        onChange={(e) => handleEducationChange(edu.id, 'fieldOfStudy', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">CGPA</label>
                                    <input
                                        type="text"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="e.g., 8.0"
                                        value={edu.cgpa}
                                        onChange={(e) => handleEducationChange(edu.id, 'cgpa', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Start Year</label>
                                    <input
                                        type="number"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="e.g., 2022"
                                        value={edu.startYear}
                                        onChange={(e) => handleEducationChange(edu.id, 'startYear', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Graduation Year</label>
                                    <input
                                        type="number"
                                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="e.g., 2026"
                                        value={edu.graduationYear}
                                        onChange={(e) => handleEducationChange(edu.id, 'graduationYear', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {education.length > 0 && education.length < 5 && (
                        <div className='flex justify-end mt-4 text-sm'>
                            <button
                                type="button"
                                className="px-3 py-2 bg-indigo-800 text-white rounded-md shadow hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-colors duration-200"
                                onClick={handleAddEducation}
                            >
                                Add Another Education
                            </button>
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 col-span-2 pt-5 mt-10">Skills</h3>
                <div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">Skills (Comma Separated)</label>
                        <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="JavaScript, React, Node.js"
                            value={skills.join(', ')}
                            onChange={(e) => setSkills(e.target.value.split(',').map(skill => skill.trim()))}
                        />
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 col-span-2 pt-5 mt-10">Achievements</h3>
                <div className="relative flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">Achievements (Write each on a new line)</label>
                    <textarea
                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder={`Award 1\nAward 2\nAward 3`}
                        rows={4}
                        value={achievements.join('\n')}
                        onChange={handleAchievementChange}
                    />
                    <button
                        type="button"
                        className="absolute right-3 bottom-3 p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md transition-all duration-200 cursor-pointer flex items-center"
                        onClick={() => handleGenerateContent('achievements')}
                        title="Enhance using AI"
                    >
                        <Sparkles className="h-4 w-4" />
                    </button>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 col-span-2 pt-5 mt-10">Custom Sections</h3>
                <div className="space-y-6">
                    {customSections.map((section) => (
                        <div key={section.id} className="space-y-4 border-b pb-6 last:border-b-0">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold text-gray-700">{section.name}</h4>
                                <button
                                    type="button"
                                    className="px-2 py-1 text-red-600 hover:text-red-800 focus:outline-none cursor-pointer transition-colors duration-200"
                                    onClick={() => handleRemoveCustomSection(section.id)}
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="relative">
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    rows="4"
                                    placeholder="Add your content here..."
                                    value={section.content}
                                    onChange={(e) => handleCustomSectionChange(section.id, 'content', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 bottom-3 p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md transition-all duration-200 cursor-pointer flex items-center"
                                    onClick={() => handleGenerateContent('customSection', section.id)}
                                    title="Enhance using AI"
                                >
                                    <Sparkles className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-end gap-4">
                        <div className="flex-grow flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">New Section Name</label>
                            <input
                                type="text"
                                className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="e.g., Certifications, Volunteer Work, Languages"
                                value={newSectionName}
                                onChange={(e) => setNewSectionName(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            className="px-3 py-2 bg-indigo-800 text-white rounded-md shadow hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={handleAddCustomSection}
                            disabled={!newSectionName.trim()}
                        >
                            Add Section
                        </button>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-800 text-white rounded-md shadow hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        Generate Resume
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ResumeForm