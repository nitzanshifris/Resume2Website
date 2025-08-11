'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function LinkedInCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing LinkedIn authentication...');

  useEffect(() => {
    const handleLinkedInCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'LinkedIn authentication was cancelled or failed.');
          return;
        }

        if (!code || state !== 'cv2web_linkedin_auth') {
          setStatus('error');
          setMessage('Invalid authentication response.');
          return;
        }

        // Exchange code for tokens with backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
        const response = await fetch(`${apiUrl}/api/v1/auth/linkedin/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            redirect_uri: `${window.location.origin}/auth/linkedin/callback`,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store session data
          if (data.session_id) {
            localStorage.setItem('cv2web_session_id', data.session_id);
          }
          if (data.user) {
            localStorage.setItem('cv2web_user', JSON.stringify(data.user));
          }

          setStatus('success');
          setMessage('Successfully authenticated with LinkedIn!');
          
          // Trigger storage change event for other tabs/contexts
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'cv2web_session_id',
            newValue: data.session_id
          }));
          
          // Redirect to main page after success
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setStatus('error');
          const errorMessage = data.detail || data.message || 'Authentication failed.';
          
          // Show user-friendly message for OAuth configuration issues
          if (errorMessage.includes('LinkedIn OAuth is not configured')) {
            setMessage('LinkedIn Sign-In is temporarily unavailable. Please use email/password registration instead.');
          } else {
            setMessage(errorMessage);
          }
        }
      } catch (error) {
        console.error('LinkedIn callback error:', error);
        setStatus('error');
        setMessage('An error occurred during authentication.');
      }
    };

    handleLinkedInCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col items-center justify-center space-y-4">
            {status === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <h2 className="text-xl font-semibold text-gray-900">Processing...</h2>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-green-900">Success!</h2>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-red-900">Error</h2>
              </>
            )}
            
            <p className="text-sm text-gray-600 text-center">{message}</p>
            
            {status === 'error' && (
              <button
                onClick={() => router.push('/')}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LinkedInCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <LinkedInCallbackContent />
    </Suspense>
  );
}