export const dynamic = "force-dynamic";  // This page should always be dynamic to reflect the latest cover letter data


import React from 'react'
import { getCoverLetterById } from '@/lib/services/cover_letter.service';
import CoverLetterView from '../_components/CoverLetterView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CoverLetterViewById = async ({ params }) => {
    const { id } = await params;
    const coverLetter = await getCoverLetterById(id);

    return (
        <div className="max-w-5xl mx-auto py-20 sm:py-24 md:py-28 lg:py-32">
            <form className="mb-8" action={`/cover-letter`} method="get">
            <Button
                className="mb-4 hover:text-purple-600 transition-colors duration-200 cursor-pointer"
                type="submit"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            </form>
            <CoverLetterView Content={coverLetter} />
        </div>
    )
}

export default CoverLetterViewById