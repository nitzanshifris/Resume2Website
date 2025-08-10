'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/ui/toast-container';

type AuthMode = 'signin' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userData: any) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleStatus, setGoogleStatus] = useState({ available: true, message: '', client_secret_configured: true });
  const { showToast } = useToast();

  // Check if Google OAuth is available
  useEffect(() => {
    const checkGoogleAvailability = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
        const response = await fetch(`${apiUrl}/api/v1/auth/google/status`);
        const data = await response.json();
        setGoogleStatus(data);
      } catch (error) {
        console.error('Failed to check Google OAuth availability:', error);
        setGoogleStatus({ available: false, message: 'Could not check Google OAuth status', client_secret_configured: false });
      }
    };

    checkGoogleAvailability();
  }, []);

  const handleGoogleLogin = async () => {
    if (!googleStatus.available) {
      showToast({
        title: "Google Sign-in Unavailable",
        description: googleStatus.message || "Google sign-in is currently not available",
        variant: "warning"
      });
      return;
    }
    
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
    window.location.href = `${apiUrl}/api/v1/auth/google`;
  };

  const handleEmailLogin = () => {
    // For now, we'll just show a toast. You can implement email auth later
    showToast({
      title: "Email Sign-in",
      description: "Email authentication coming soon!",
      variant: "info"
    });
  };

  const handleFacebookLogin = async () => {
    // Facebook OAuth implementation
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
    // You'll need to implement the Facebook OAuth endpoint in your backend
    showToast({
      title: "Facebook Sign-in",
      description: "Facebook authentication coming soon!",
      variant: "info"
    });
    setIsLoading(false);
  };

  const handleLinkedInLogin = async () => {
    // LinkedIn OAuth implementation
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
    // You'll need to implement the LinkedIn OAuth endpoint in your backend
    showToast({
      title: "LinkedIn Sign-in",
      description: "LinkedIn authentication coming soon!",
      variant: "info"
    });
    setIsLoading(false);
  };

  const handleSkip = () => {
    // Close the modal without authentication
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative bg-[#1a1a1a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content Container */}
          <div className="px-8 py-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">CV</span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Welcome to CV2Web
              </h2>
              <p className="text-gray-400 text-sm">
                Unlock all features by logging in
              </p>
            </div>

            {/* Auth Buttons */}
            <div className="space-y-3">
              {/* Google Sign In */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading || !googleStatus.available}
                className="w-full bg-[#2a2a2a] hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 px-4 flex items-center justify-center gap-3 transition-all duration-200 border border-gray-700 hover:border-gray-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                <span className="text-sm font-medium">
                  Continue with Google
                </span>
              </button>

              {/* Facebook Sign In */}
              <button
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="w-full bg-[#2a2a2a] hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 px-4 flex items-center justify-center gap-3 transition-all duration-200 border border-gray-700 hover:border-gray-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium">
                  Continue with Facebook
                </span>
              </button>

              {/* LinkedIn Sign In */}
              <button
                onClick={handleLinkedInLogin}
                disabled={isLoading}
                className="w-full bg-[#2a2a2a] hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 px-4 flex items-center justify-center gap-3 transition-all duration-200 border border-gray-700 hover:border-gray-600"
              >
                <Linkedin className="w-5 h-5" fill="#0A66C2" color="#0A66C2" />
                <span className="text-sm font-medium">
                  Continue with LinkedIn
                </span>
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#1a1a1a] text-gray-500">or</span>
                </div>
              </div>

              {/* Email Sign In */}
              <button
                onClick={handleEmailLogin}
                disabled={isLoading}
                className="w-full bg-[#2a2a2a] hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 px-4 flex items-center justify-center gap-3 transition-all duration-200 border border-gray-700 hover:border-gray-600"
              >
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">
                  Continue with Email
                </span>
              </button>
            </div>

            {/* Skip for now */}
            <div className="text-center mt-6">
              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-400 text-sm underline transition-colors duration-200"
              >
                Skip for now
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              By logging in, you agree to our{' '}
              <a href="#" className="text-gray-400 hover:text-gray-300 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-gray-400 hover:text-gray-300 underline">
                Privacy Policy
              </a>
            </p>
            <p className="text-xs text-gray-600 text-center mt-2">
              © 2025 CV2Web · Powered by Open WebUI
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}