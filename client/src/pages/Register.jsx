import React, { useState, useCallback, memo, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Store, 
  ArrowUpRight,
  AlertCircle,
  CheckCircle,
  ShoppingCart,
  LogIn
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Memoized Icons to prevent re-renders
const GoogleIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.5 12.2c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.7-2.3 3.5v2.9h3.7c2.2-2 3.6-5 3.6-8.5z" fill="#4285F4"/>
    <path d="M12 24c3.2 0 6-1.1 8-2.9l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.3 0-6.1-2.2-7.1-5.2H1.2v3.1C3.2 21.3 7.3 24 12 24z" fill="#34A853"/>
    <path d="M4.9 14.2c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2V6.7H1.2C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.3l3.7-3.1z" fill="#FBBC05"/>
    <path d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.7l3.7 3.1c1-3 3.8-5 7.1-5z" fill="#EA4335"/>
  </svg>
));

const FacebookIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.03 4.39 11.02 10.12 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87v2.24h3.32l-.53 3.49h-2.79v8.44C19.61 23.09 24 18.1 24 12.07z" fill="#1877F2"/>
  </svg>
));

// Memoized Input Field for performance
const InputField = memo(({ 
  icon: Icon, 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  showPasswordToggle, 
  onTogglePassword, 
  required = true,
  error,
  disabled = false 
}) => (
  <div className="mb-6">
    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete="off"
        disabled={disabled}
        className={`block w-full pl-8 pr-4 py-4 bg-transparent border-b-2 ${error ? 'border-red-500' : 'border-slate-100'} text-slate-900 text-lg font-medium placeholder-slate-300 focus:outline-none focus:border-orange-500 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-0 flex items-center text-slate-300 hover:text-orange-500 transition-colors disabled:opacity-50"
        >
          {type === 'password' ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
    </div>
    {error && (
      <p className="mt-2 text-xs text-red-600 flex items-center">
        <AlertCircle className="w-3 h-3 mr-1" /> 
        {error}
      </p>
    )}
  </div>
));

const Register = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState({});

  // Auto-redirect timer for success page
  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSuccess, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  }, [errors, apiError]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const validateStep1 = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{8,}$/;
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (e.g., +1234567890).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required.';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First Name must be at least 2 characters.';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required.';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last Name must be at least 2 characters.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms and Conditions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const password = formData.password;
      const firstName = formData.firstName.trim();
      const lastName = formData.lastName.trim();
      const phone = formData.phone.trim();

      console.log('Attempting to register:', { email, firstName, lastName, phone });

      // STEP 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            full_name: `${firstName} ${lastName}`
          }
        }
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        throw authError;
      }

      console.log('Auth successful:', authData);

      // STEP 2: Create profile in a separate table (if it exists)
      if (authData.user) {
        try {
          // First, check if profiles table exists
          const { error: tableCheckError } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);

          if (tableCheckError && tableCheckError.code === '42P01') {
            // Table doesn't exist, we'll just use auth metadata
            console.log('Profiles table not found, using auth metadata only');
          } else {
            // Create profile in profiles table
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: authData.user.id,
                email: email,
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                full_name: `${firstName} ${lastName}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              });

            if (profileError) {
              console.error('Profile creation error:', profileError);
              // Continue anyway - auth succeeded
            } else {
              console.log('Profile created successfully');
            }
          }
        } catch (profileErr) {
          console.error('Profile setup error:', profileErr);
          // Continue with auth success
        }
      }

      // STEP 3: Store in localStorage for immediate access
      localStorage.setItem('current_user', JSON.stringify({
        id: authData.user?.id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        fullName: `${firstName} ${lastName}`,
        role: 'user',
        isVerified: false
      }));

      // STEP 4: Save registration in localStorage (backup)
      const existingRegistrations = JSON.parse(localStorage.getItem('user_registrations') || '[]');
      existingRegistrations.push({
        id: authData.user?.id || Date.now().toString(),
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        registeredAt: new Date().toISOString()
      });
      localStorage.setItem('user_registrations', JSON.stringify(existingRegistrations));

      // Save the registered email for success message
      setRegisteredEmail(email);
      
      // Show success state
      setIsSuccess(true);
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      console.error('Registration catch error:', error);
      
      // Better error messages
      if (error.message.includes('User already registered') || 
          error.message.includes('already registered') ||
          error.message.includes('duplicate')) {
        setApiError('An account with this email already exists. Please login instead.');
      } else if (error.message.includes('password') || 
                error.message.includes('Password') ||
                error.message.includes('weak')) {
        setApiError('Password is too weak. Please use a stronger password (min 8 chars, uppercase, lowercase, numbers).');
      } else if (error.message.includes('email') || 
                error.message.includes('Email') ||
                error.message.includes('invalid')) {
        setApiError('Invalid email address. Please check and try again.');
      } else if (error.message.includes('network') || 
                error.message.includes('fetch') || 
                error.message.includes('Network') ||
                error.message.includes('offline')) {
        setApiError('Network error. Please check your connection and try again.');
      } else {
        setApiError(error.message || 'Registration failed. Please try again.');
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border-t-8 border-green-500">
          
          {/* Logo */}
          <div className="flex justify-center items-center gap-1 mb-6">
            <div className="flex items-center text-2xl font-extrabold tracking-tighter">
              <span className="text-slate-900">SHOP</span>
              <ShoppingCart className="text-orange-500 mx-1.5 w-6 h-6" strokeWidth={2.5} />
              <span className="text-slate-900">MAX</span>
            </div>
          </div>

          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12" />
          </div>
          
          {/* Success Message */}
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tighter">Registration Successful!</h2>
          
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 rounded-full mb-4">
              <Mail className="w-7 h-7" />
            </div>
            
            <p className="text-slate-700 text-base mb-3">
              Welcome to ShopMax, <span className="font-black text-slate-900">{formData.firstName}</span>!
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left mb-6">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-base">
                <CheckCircle2 className="w-4.5 h-4.5 text-green-500" />
                Your Registration Details
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-medium text-slate-600">Email:</span>
                  <span className="text-sm font-bold text-slate-900">{registeredEmail || formData.email}</span>
                </div>
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-medium text-slate-600">Phone:</span>
                  <span className="text-sm font-bold text-slate-900">{formData.phone}</span>
                </div>
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-medium text-slate-600">Name:</span>
                  <span className="text-sm font-bold text-slate-900">{formData.firstName} {formData.lastName}</span>
                </div>
              </div>
            </div>
            
            {/* Email Verification Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-left mb-6">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2 text-base">
                <AlertCircle className="w-4.5 h-4.5" />
                Verify Your Email Address
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white border border-blue-300 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-600 text-sm font-black">1</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">Check your inbox</p>
                    <p className="text-xs text-slate-600">We sent an email to:</p>
                    <p className="text-sm font-black text-slate-900 mt-1">{registeredEmail || formData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white border border-blue-300 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-600 text-sm font-black">2</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">Click the verification link</p>
                    <p className="text-xs text-slate-600">Open the email and click the confirmation button</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-blue-100">
                <p className="text-xs text-blue-700 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>Can't find the email? Check your spam folder.</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/login')} 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-4 rounded-2xl shadow-lg transition duration-200 uppercase tracking-widest flex items-center justify-center gap-3 text-sm"
            >
              <LogIn className="w-5 h-5" />
              Go to Login
            </button>
            
            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Redirecting automatically in <span className="font-black text-orange-500">{countdown}</span> seconds
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="text-xs text-orange-500 hover:underline font-medium mt-2"
              >
                Click here to skip
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500 px-4">
          <p>Need help? Contact support@shopmax.com</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} ShopMax. All rights reserved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-orange-100 selection:text-orange-900 overflow-hidden">
      
      {/* Visual Section */}
      <div className="relative w-full md:w-1/2 bg-slate-900 flex flex-col justify-between p-8 md:p-16 text-white overflow-hidden shrink-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-60 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg shadow-orange-500/20">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">
              SHOP<span className="text-orange-500">MAX</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
            EXPERIENCE <br />
            <span className="text-orange-500">BETTER</span> <br />
            SHOPPING.
          </h1>
          
          <p className="text-slate-400 text-xl font-medium max-w-md leading-relaxed">
            The most powerful marketplace in your pocket. Join 5M+ users worldwide.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-8">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map(i => (
              <img key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="avatar" />
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-orange-500 flex items-center justify-center text-xs font-black">
              +1k
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Trusted by global shoppers
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-24 flex flex-col justify-center relative overflow-y-auto">
        
        <div className="absolute top-8 right-8 md:top-12 md:right-16 z-20">
          <button 
            onClick={() => navigate('/seller-register')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-orange-50 text-slate-900 hover:text-orange-600 rounded-full font-black text-xs uppercase tracking-widest transition-all border border-slate-100 shadow-sm group">
  <Store size={16} />
  <span>Become a Seller</span>
  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
</button>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-12">
            <div className={`h-1.5 rounded-full transition-all duration-700 ${step >= 1 ? 'w-24 bg-orange-500' : 'w-8 bg-slate-100'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-700 ${step >= 2 ? 'w-24 bg-orange-500' : 'w-8 bg-slate-100'}`} />
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {apiError}
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Start Journey</h2>
              <p className="text-slate-500 mb-12 font-medium">Enter your credentials to create your secure profile.</p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <button 
                  type="button"
                  className="flex items-center justify-center gap-3 py-4 border-2 border-slate-50 rounded-2xl hover:bg-slate-50 hover:border-slate-100 transition-all font-black text-xs uppercase tracking-widest text-slate-700"
                  onClick={() => setApiError('Google OAuth not implemented yet')}
                >
                  <GoogleIcon /> Google
                </button>
                <button 
                  type="button"
                  className="flex items-center justify-center gap-3 py-4 border-2 border-slate-50 rounded-2xl hover:bg-slate-50 hover:border-slate-100 transition-all font-black text-xs uppercase tracking-widest text-slate-700"
                  onClick={() => setApiError('Facebook OAuth not implemented yet')}
                >
                  <FacebookIcon /> Facebook
                </button>
              </div>

              <div className="relative mb-10 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative px-6 bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Or use email</span>
              </div>

              <form onSubmit={nextStep}>
                <InputField 
                  icon={Mail} 
                  label="Your Email" 
                  name="email" 
                  type="email" 
                  placeholder="hello@example.com" 
                  value={formData.email} 
                  onChange={handleChange}
                  error={errors.email}
                  disabled={isLoading}
                />
                
                <InputField 
                  icon={Phone} 
                  label="Phone Number" 
                  name="phone" 
                  type="tel" 
                  placeholder="+234 000 000 0000" 
                  value={formData.phone} 
                  onChange={handleChange}
                  error={errors.phone}
                  disabled={isLoading}
                />
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full mt-10 bg-slate-900 hover:bg-orange-600 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black py-5 rounded-2xl shadow-2xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Validating...</span>
                    </div>
                  ) : (
                    <>
                      Continue <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in duration-500">
              <button 
                onClick={prevStep} 
                disabled={isLoading}
                className="flex items-center gap-2 text-slate-400 hover:text-orange-600 mb-6 font-black text-xs uppercase tracking-widest transition-colors group disabled:opacity-50"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Go Back
              </button>
              
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Identity</h2>
              <p className="text-slate-500 mb-12 font-medium">Finalize your profile details and set your password.</p>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField 
                    icon={User} 
                    label="First Name" 
                    name="firstName" 
                    placeholder="Jane" 
                    value={formData.firstName} 
                    onChange={handleChange}
                    error={errors.firstName}
                    disabled={isLoading}
                  />
                  
                  <InputField 
                    icon={User} 
                    label="Last Name" 
                    name="lastName" 
                    placeholder="Smith" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    error={errors.lastName}
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-2">
                  <InputField 
                    icon={Lock} 
                    label="Security Key" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Minimum 8 characters" 
                    value={formData.password} 
                    onChange={handleChange}
                    error={errors.password}
                    showPasswordToggle 
                    onTogglePassword={togglePasswordVisibility}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-slate-500 -mt-2 mb-4">Must contain uppercase, lowercase, and numbers.</p>
                </div>
                
                <InputField 
                  icon={Lock} 
                  label="Confirm Key" 
                  name="confirmPassword" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Retype password" 
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  showPasswordToggle 
                  onTogglePassword={togglePasswordVisibility}
                  disabled={isLoading}
                />

                <div className="py-6">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="agreedToTerms" 
                      checked={formData.agreedToTerms} 
                      onChange={handleChange} 
                      disabled={isLoading}
                      className="peer hidden" 
                    />
                    <div className={`h-6 w-6 border-2 ${errors.agreedToTerms ? 'border-red-500' : 'border-slate-100'} rounded-lg flex items-center justify-center peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all ${isLoading ? 'opacity-50' : ''}`}>
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="text-sm text-slate-500 font-bold group-hover:text-slate-900 transition-colors">
                      Accept <a href="#" className="text-orange-600 hover:underline">Terms & Privacy</a>
                    </span>
                  </label>
                  {errors.agreedToTerms && (
                    <p className="mt-2 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" /> 
                      {errors.agreedToTerms}
                    </p>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || !formData.agreedToTerms || !formData.password || formData.password !== formData.confirmPassword} 
                  className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black py-5 rounded-2xl shadow-2xl transition-all uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Account...</span>
                    </div>
                  ) : 'Create My Profile'}
                </button>
              </form>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-green-500" />
              <span>Verified 256-Bit</span>
            </div>
            <p className="text-sm font-bold text-slate-400">
              Member? <button onClick={() => navigate('/login')} className="text-orange-600 hover:underline transition-all">Log in here</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;