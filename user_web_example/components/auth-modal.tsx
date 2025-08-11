'use client';

import { useState, useEffect, ChangeEvent, FormEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import {
  Ripple,
  AuthTabs,
  TechOrbitDisplay,
} from '@/components/ui/modern-animated-sign-in';
import Resume2WebsiteAuthHero from '@/components/ui/cv2web-auth-hero';
import { useToast } from '@/components/ui/toast-container';

// Legacy RESUME2WEBSITE icons array removed - now using enhanced Resume2WebsiteAuthHero component

type AuthMode = 'signin' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userData: any) => void;
}

type FormData = {
  email: string;
  password: string;
  name?: string;
  phone?: string;
};

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
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

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = authMode === 'signin' ? '/api/v1/login' : '/api/v1/register';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(authMode === 'signup' && { 
            name: formData.name,
            phone: formData.phone 
          }),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store session data
        if (data.session_id) {
          localStorage.setItem('resume2website_session_id', data.session_id);
        }
        if (data.user) {
          localStorage.setItem('resume2website_user', JSON.stringify(data.user));
        }

        // Show welcome message
        if (authMode === 'signup') {
          showToast(`🎉 Welcome to RESUME2WEBSITE, ${data.user?.name || 'there'}! We're excited to help you create an amazing portfolio.`, 'success');
        } else {
          showToast(`Welcome back, ${data.user?.name || 'there'}! Ready to continue building your portfolio?`, 'success');
        }

        onAuthSuccess(data);
        onClose();
      } else {
        setError(data.message || 'Authentication failed');
        showToast(data.message || 'Authentication failed', 'error');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Connection failed. Please try again.');
      showToast('Connection failed. Please check your internet and try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Check if Google OAuth is properly configured
    if (!googleStatus.available) {
      if (!googleStatus.client_secret_configured) {
        setError('Google Sign-In setup incomplete. The Google Client Secret needs to be configured on the server. Please use email/password registration instead.');
        showToast('Google Sign-In requires additional server configuration. Please use email/password instead.', 'error');
        return;
      }
      setError('Google Sign-In is not available. Please use email/password registration.');
      showToast('Google Sign-In is not available', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Check if Google Client ID is configured
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      setError('Google Sign-In is not configured. Please use email/password instead.');
      setIsLoading(false);
      return;
    }
    
    // Initialize Google OAuth flow
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.append('client_id', googleClientId);
    googleAuthUrl.searchParams.append('redirect_uri', `${window.location.origin}/auth/google/callback`);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'openid email profile');
    googleAuthUrl.searchParams.append('state', 'resume2website_google_auth');
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');

    // Store auth modal state to restore after callback
    localStorage.setItem('resume2website_auth_return', 'true');

    // Redirect to Google OAuth
    window.location.href = googleAuthUrl.toString();
  };

  const switchMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setFormData({ email: '', password: '', name: '', phone: '' });
  };

  const getFormFields = () => {
    const baseFields = [
      {
        label: 'Email',
        required: true,
        type: 'email' as const,
        placeholder: 'Enter your email address',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'email'),
      },
      {
        label: 'Password',
        required: true,
        type: 'password' as const,
        placeholder: 'Enter your password',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'password'),
      },
    ];

    if (authMode === 'signup') {
      return [
        {
          label: 'Name',
          required: true,
          type: 'text' as const,
          placeholder: 'Enter your full name',
          onChange: (event: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(event, 'name'),
        },
        {
          label: 'Phone',
          required: false,
          type: 'tel' as const,
          placeholder: 'Enter your phone number (optional)',
          onChange: (event: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(event, 'phone'),
        },
        ...baseFields,
      ];
    }

    return baseFields;
  };

  const formFields = {
    header: authMode === 'signin' ? 'Welcome back' : 'Create your account',
    subHeader: authMode === 'signin' 
      ? 'Sign in to your RESUME2WEBSITE account' 
      : 'Start building your professional portfolio',
    fields: getFormFields(),
    submitButton: isLoading 
      ? (authMode === 'signin' ? 'Signing in...' : 'Creating account...') 
      : (authMode === 'signin' ? 'Sign in' : 'Create account'),
    textVariantButton: authMode === 'signin' 
      ? "Don't have an account? Sign up" 
      : "Already have an account? Sign in",
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative bg-white rounded-3xl w-full max-w-6xl h-[90vh] mx-auto shadow-2xl border border-gray-100/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex h-full">
            {/* Left Side - Enhanced RESUME2WEBSITE Hero */}
            <Resume2WebsiteAuthHero />

            {/* Right Side - Auth Form */}
            <div className="w-1/2 max-lg:w-full h-full flex flex-col justify-center items-center px-12 py-8">
              <div className="w-full max-w-md">
                <AuthTabs
                  formFields={{
                    ...formFields,
                    errorField: error || undefined,
                  }}
                  goTo={(e) => {
                    e.preventDefault();
                    switchMode();
                  }}
                  handleSubmit={handleSubmit}
                  handleGoogleLogin={handleGoogleLogin}
                />
              </div>
            </div>
          </div>

          {/* Decorative gradient border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 p-[1px] pointer-events-none -z-10">
            <div className="w-full h-full bg-white rounded-3xl"></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}