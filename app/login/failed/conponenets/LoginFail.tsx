// File: /app/login/failed/page.tsx
'use client'

import React from 'react';
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

export default function LoginFailedPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('err');

  let errorMessage = 'An unknown error occurred during login.';
  if (error === '500') {
    errorMessage = 'Internal server error. Please try again later.';
  } else if (error === 'AuthApiError') {
    errorMessage = 'Authentication error. Please check your credentials and try again.';
  }

  return (
    <div className="flex justify-center p-8 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-sm w-full mt-10">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Login Error</h1>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {errorMessage}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Hint: Please make sure you open the link on the same device / browser from which you tried to sign up.
          </p>
        </div>
        <div className="mt-4">
          <Link href="/login" className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Try Login Again
            <ExternalLink size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}