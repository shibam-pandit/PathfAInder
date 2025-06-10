import { NextResponse } from 'next/server';
import { updateUserOnboarding } from '@/lib/services/users.service';

export const POST = async (request) => {
    const { onboardingData } = await request.json();

    const { industry, bio, skills, experience } = onboardingData;
    if (!industry || !bio || !skills || experience==null) {
        return NextResponse.json(
            { message: 'All fields are required' },
            { status: 400 }
        );
    }

    try {
        const updated = await updateUserOnboarding(onboardingData);
        console.log('Onboarding data updated:', updated);
        if (!updated) {
            return NextResponse.json(
                { message: 'Failed to update onboarding data' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Onboarding data updated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating onboarding data:', error);
        return NextResponse.json(
            { message: 'Failed to update onboarding data' },
            { status: 500 }
        );
        
    }
}