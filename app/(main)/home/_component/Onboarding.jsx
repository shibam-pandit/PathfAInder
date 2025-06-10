"use client";

import React, { useState } from 'react';
import { User, Briefcase, Star, FileText } from 'lucide-react';
import { industries } from '@/data/industries';
import { Toaster, toast } from '@/components/ui/sonner';
import axios from 'axios';
import { redirect } from 'next/navigation';

const OnboardingForm = () => {
    const [industry, setIndustry] = useState('');
    const [subindustry, setSubIndustry] = useState('');
    const [experience, setExperience] = useState('');
    const [skills, setSkills] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubIndustryError = (e) => {
        if (industry === '') {
            toast.error('Please select an industry first');
            return;
        }
        e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (industry === '' || subindustry === '' || experience === '' || skills === '' || bio === '') {
            setLoading(false);
            toast.error('Please fill out all fields');
            return;
        }

        if (isNaN(experience) || experience < 0 || experience > 50) {
            setLoading(false);
            toast.error('Please enter a valid number of years of experience (0-50)');
            return;
        }
        if (bio.length > 500) {
            setLoading(false);
            toast.error('Bio cannot exceed 500 characters');
            return;
        }
        if (skills.split(',').length < 2) {
            setLoading(false);
            toast.error('Please enter atleast two skills');
            return;
        }

        const onboardingData = {
            industry: industry + '-' + subindustry,
            bio: bio,
            skills: skills.split(',').map(skill => skill.trim()),
            experience: parseInt(experience, 10)
        }

        try {
            const response = await axios.post('/api/users/onboarding-update', {
                onboardingData: onboardingData
            });
            console.log('Onboarding response:', response);
            if (response.status === 200) {
                setLoading(false);
                toast.success('Onboarding completed successfully!');
                setTimeout(() => {
                  redirect('/home');
                }, 1200); // 1.2 seconds for the user to see the toast
            } else {
                setLoading(false);
                toast.error('Failed to complete onboarding. Please try again.');
            }
        } catch (error) {
            setLoading(false);
            toast.error('Failed to complete onboarding. Please try again.');
        }
    };

    return (
        <div className="py-32 min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 flex justify-center items-center p-4">
            <Toaster />
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm p-8 shadow-2xl rounded-3xl border border-purple-200/50">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
                    <p className="text-gray-600 text-sm">Help us personalize your experience with some quick details</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Industry Selection */}
                    <div className="space-y-2">
                        <label htmlFor="industry" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                            <Briefcase className="w-4 h-4 mr-2 text-purple-500" />
                            Industry
                        </label>
                        <select
                            id="industry"
                            name="industry"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 appearance-none cursor-pointer"
                            required
                        >
                            <option value="">-- Select your industry --</option>
                            {industries.map((industry) => (
                                <option key={industry.id} value={industry.name.toLowerCase()}>
                                    {industry.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sub-Industry Selection */}
                    <div className="space-y-2" onClick={handleSubIndustryError}>
                        <label htmlFor="industry" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                            <Briefcase className="w-4 h-4 mr-2 text-purple-500" />
                            Sub-Industry
                        </label>
                        <select
                            id="sub-industry"
                            name="sub-industry"
                            value={subindustry}
                            onChange={(e) => setSubIndustry(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 appearance-none cursor-pointer"
                            required
                        >
                            <option value="">-- Select your subindustry --</option>
                            {industries.find(ind => ind.name.toLowerCase() === industry)?.subIndustries.map((sub) => (
                                <option key={sub} value={sub.toLowerCase()}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Years of Experience */}
                    <div className="space-y-2">
                        <label htmlFor="experience" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                            <Star className="w-4 h-4 mr-2 text-purple-500" />
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            id="experience"
                            name="experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            min={0}
                            max={50}
                            placeholder="Enter number of years"
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="skills" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                            <FileText className="w-4 h-4 mr-2 text-purple-500" />
                            Skills
                        </label>
                        <input
                            type="text"
                            id="skills"
                            name="skills"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="e.g., JavaScript, React, Node.js, Python"
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                    </div>

                    {/* Professional Bio */}
                    <div className="space-y-2">
                        <label htmlFor="bio" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                            <User className="w-4 h-4 mr-2 text-purple-500" />
                            Professional Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            placeholder="Tell us about your professional background, achievements, and goals..."
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 resize-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {bio.length}/500 characters
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className={`w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:ring-4 focus:ring-purple-300 focus:outline-none cursor-pointer ${loading && "bg-gray-400 text-white cursor-not-allowed opacity-50"}`}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Complete Profile"}
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                            Your information is secure and will be used to enhance your experience
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OnboardingForm;