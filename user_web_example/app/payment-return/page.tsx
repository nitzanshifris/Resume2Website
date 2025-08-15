import { CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

async function getSessionStatus(sessionId: string) {
  try {
    const response = await fetch(
      `http://localhost:2000/api/v1/payments/session-status/${sessionId}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch session status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching session status:', error);
    return null;
  }
}

export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;
  
  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Invalid Session
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No session ID provided
          </p>
          <Link 
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const session = await getSessionStatus(sessionId);
  
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Payment Status
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Could not retrieve your payment information
          </p>
          <Link 
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Payment successful
  if (session.payment_status === "paid" || session.status === "complete") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for your purchase. Your portfolio is now unlocked.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Amount Paid
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${((session.amount_total || 0) / 100).toFixed(2)} {session.currency?.toUpperCase()}
              </div>
            </div>

            {session.customer_email && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Receipt sent to: {session.customer_email}
              </p>
            )}

            <div className="space-y-3">
              <Link 
                href="/dashboard"
                className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Go to Dashboard
              </Link>
              <Link 
                href="/portfolio/edit"
                className="block w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Start Editing Your Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment pending
  if (session.status === "open") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Pending
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your payment is still being processed. Please check back later.
          </p>
          <Link 
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Payment failed or cancelled
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Not Completed
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your payment was not completed. Please try again.
        </p>
        <Link 
          href="/dashboard"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}