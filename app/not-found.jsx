import React from 'react'
import { Toaster } from "@/components/ui/sonner";
import Link from 'next/link';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-white to-blue-200 flex items-center justify-center p-4">
            <Toaster />
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Page Not Found
                        </h1>
                        <p className="text-sm text-gray-500">
                            Sorry, the page you are looking for does not exist.
                        </p>
                    </div>
                    <Link href="/home" className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NotFound