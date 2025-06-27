'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const UserProtectedRoute = ({ children }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="flex flex-col space-y-2 items-center justify-center min-h-screen bg-purple-50/35">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
      <p className="text-gray-700 text-lg mt-4">Loading...</p>
    </div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  return <>{children}</>
}

export default UserProtectedRoute
