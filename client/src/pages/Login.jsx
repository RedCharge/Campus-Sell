import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  ChevronRight, 
  Facebook, 
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { signIn, signInWithProvider, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Email/Phone, 2: Password
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleContinue = (e) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      setError('E-mail is required.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setStep(2);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await signIn(identifier, password);
      
      if (error) {
        throw error;
      }

      // Login successful - redirect to home
      navigate('/');
      
    } catch (error) {
      console.error('Login error:', error);
      
      // User-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please verify your email address before logging in.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setError('');
      const { error } = await signInWithProvider(provider);
      
      if (error) {
        throw error;
      }
      // Social login will redirect automatically
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setError(`Failed to login with ${provider}. Please try again.`);
    }
  };

  const handleForgotPassword = async () => {
    if (!identifier.trim()) {
      setError('Please enter your email address to reset password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Note: You need to add resetPassword function to your AuthContext
      // const { error } = await resetPassword(identifier);
      // if (error) throw error;
      
      // For now, show a message
      setError('Password reset feature coming soon!');
      // alert(`Password reset instructions have been sent to ${identifier}`);
    } catch (error) {
      setError(error.message || 'Failed to send reset instructions.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fff] md:bg-[#f5f5f5] flex flex-col items-center justify-center">
        <div className="flex items-center text-3xl font-extrabold tracking-tighter mb-4">
          <span className="text-gray-800">CAMPUS</span>
          <ShoppingCart className="text-[#f68b1e] mx-1" size={28} fill="#f68b1e" />
          <span className="text-gray-800">SELL</span>
        </div>
        <Loader2 className="h-8 w-8 text-[#f68b1e] animate-spin" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff] md:bg-[#f5f5f5] flex flex-col items-center font-sans">
      
      {/* Top Logo */}
      <div className="py-8">
        <div className="flex items-center text-3xl font-extrabold tracking-tighter">
          <span className="text-gray-800">CAMPUS</span>
          <ShoppingCart className="text-[#f68b1e] mx-1" size={28} fill="#f68b1e" />
          <span className="text-gray-800">SELL</span>
        </div>
      </div>

      <div className="w-full max-w-[400px] bg-white md:rounded-lg md:shadow-sm p-6 md:p-8">
        
        {/* Step 1: Email Entry */}
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-800">Welcome to Campus Sell</h1>
              <p className="text-sm text-gray-600 mt-1">Enter your email address to log in or create an account.</p>
            </div>

            <form onSubmit={handleContinue} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Email Address*"
                  className={`w-full px-4 py-4 border-2 rounded-md outline-none transition-all ${
                    error ? 'border-red-500' : 'border-gray-200 focus:border-[#f68b1e]'
                  }`}
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-[#d93025] text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#f68b1e] hover:bg-[#e07e1b] text-white font-bold py-4 rounded shadow-md transition-all flex items-center justify-center gap-2 uppercase text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Continue <ChevronRight size={18} /></>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 mb-6 px-4">
                By continuing you agree to our <a href="#" className="text-[#f68b1e] hover:underline">Terms and Conditions</a>
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                  className="w-full border border-gray-300 py-3 rounded flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  <Facebook size={20} className="text-[#1877F2] fill-[#1877F2]" />
                  Log in with Facebook
                </button>
                <button 
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full border border-gray-300 py-3 rounded flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Log in with Google
                </button>
              </div>

              {/* Signup Link section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-4 font-semibold uppercase tracking-wider text-[11px]">New to Campus Sell?</p>
                <Link
                  to="/register"
                  className="w-full bg-white border-2 border-[#f68b1e] text-[#f68b1e] font-bold py-3 rounded hover:bg-orange-50 transition-all uppercase text-sm tracking-wide flex items-center justify-center"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Password Entry */}
        {step === 2 && (
          <>
            <button 
              onClick={() => { 
                setStep(1); 
                setError(''); 
                setPassword('');
              }}
              className="mb-4 text-[#f68b1e] hover:bg-orange-50 p-1 -ml-2 rounded-full transition-all"
              disabled={isLoading}
            >
              <ArrowLeft size={24} />
            </button>

            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-800">Welcome back</h1>
              <p className="text-sm text-gray-600 mt-1">Login for <span className="font-bold text-gray-800">{identifier}</span></p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Password*"
                  className={`w-full px-4 py-4 border-2 rounded-md outline-none transition-all pr-12 ${
                    error ? 'border-red-500' : 'border-gray-200 focus:border-[#f68b1e]'
                  }`}
                  disabled={isLoading}
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => !isLoading && setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-[#d93025] text-xs flex items-center gap-1">
                  <AlertCircle size={14} /> {error}
                </p>
              )}

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#f68b1e] border-gray-300 rounded focus:ring-[#f68b1e]"
                    disabled={isLoading}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-semibold text-[#f68b1e] hover:underline disabled:opacity-50"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#f68b1e] hover:bg-[#e07e1b] text-white font-bold py-4 rounded shadow-md transition-all flex items-center justify-center gap-2 uppercase text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-4 text-center">Don't have an account?</p>
              <Link
                to="/register"
                className="w-full border-2 border-[#f68b1e] text-[#f68b1e] font-bold py-3 rounded hover:bg-orange-50 transition-all uppercase text-sm tracking-wide flex items-center justify-center"
              >
                Create an account
              </Link>
            </div>
          </>
        )}

        <div className="mt-8">
          <p className="text-xs text-gray-400 text-center">
            For further support, you may visit the Help Center or contact our customer service team.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 pb-10 text-gray-400 font-bold text-[10px] uppercase tracking-tighter">
        <div className="flex items-center">
          <ShoppingCart size={14} className="mr-1" />
          Campus Sell
        </div>
        <div className="text-[8px] text-gray-300">
          &copy; {new Date().getFullYear()} All rights reserved
        </div>
      </div>
    </div>
  );
  
}