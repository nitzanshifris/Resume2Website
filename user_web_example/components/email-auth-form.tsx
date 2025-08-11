'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/toast-container';

type AuthMode = 'signin' | 'signup';

interface EmailAuthFormProps {
  mode: AuthMode;
  onBack: () => void;
  onAuthSuccess: (userData: any) => void;
  onClose: () => void;
}

export default function EmailAuthForm({ mode, onBack, onAuthSuccess, onClose }: EmailAuthFormProps) {
  const [authMode, setAuthMode] = useState<AuthMode>(mode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    if (authMode === 'signup') {
      if (!name) {
        showToast('Please enter your name', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      
      if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
      const endpoint = authMode === 'signup' ? '/api/v1/register' : '/api/v1/login';
      
      const body = authMode === 'signup' 
        ? { email, password, name, phone: phone || null }
        : { email, password };
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || `${authMode === 'signup' ? 'Registration' : 'Login'} failed`);
      }
      
      // Store session
      if (data.session_id) {
        localStorage.setItem('cv2web_session_id', data.session_id);
        localStorage.setItem('cv2web_user', JSON.stringify(data.user));
      }
      
      showToast(
        `${authMode === 'signup' ? 'Registration' : 'Login'} successful!`,
        'success'
      );
      
      // Call success callback
      onAuthSuccess(data.user);
      
      // Close modal
      setTimeout(() => {
        onClose();
      }, 500);
      
    } catch (error: any) {
      console.error(`${authMode} error:`, error);
      showToast(
        error.message || `${authMode === 'signup' ? 'Registration' : 'Login'} failed`,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to options</span>
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
        </h3>
        <p className="text-gray-400 text-sm">
          {authMode === 'signup' 
            ? 'Sign up to save and manage your portfolios'
            : 'Sign in to access your portfolios'
          }
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {authMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={authMode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-11 pr-11 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {authMode === 'signup' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl py-3 font-medium hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {authMode === 'signup' ? 'Creating Account...' : 'Signing In...'}
            </span>
          ) : (
            authMode === 'signup' ? 'Create Account' : 'Sign In'
          )}
        </button>
      </form>

      {/* Toggle Auth Mode */}
      <div className="text-center mt-6 pt-6 border-t border-gray-800">
        <p className="text-gray-400 text-sm">
          {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
        </p>
        <button
          onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mt-1 transition-colors"
        >
          {authMode === 'signup' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </motion.div>
  );
}