import React from 'react'
import { getServerSession } from "next-auth";
import { checkOnboardingCompleteStatus } from '@/lib/services/users.service'
import OnboardingForm from './_component/Onboarding';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className='min-h-screen flex items-center justify-center text-2xl font-bold'>
        Please log in to access your home page.
      </div>
    );
  }

  let onboarding = await checkOnboardingCompleteStatus(userId);
  console.log('Onboarding status:', onboarding);
  if(onboarding === false) {
      return <OnboardingForm userId={userId} />
  }

  return (
    <div className='min-h-screen flex items-center justify-center text-2xl font-bold'>
      Home
    </div>
  );
}