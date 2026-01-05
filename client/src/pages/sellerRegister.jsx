import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
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
  Smartphone,
  Copy,
  Info,
  CreditCard
} from 'lucide-react';

// Memoized Brand Icons
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

const InputField = memo(({ icon: Icon, label, name, type = 'text', placeholder, value, onChange, showPasswordToggle, onTogglePassword }) => (
  <div className="mb-6">
    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <input
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        autoComplete="off"
        className="block w-full pl-8 pr-4 py-4 bg-transparent border-b-2 border-slate-100 text-slate-900 text-lg font-medium placeholder-slate-300 focus:outline-none focus:border-orange-500 transition-all"
        placeholder={placeholder}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-0 pr-0 flex items-center text-slate-300 hover:text-orange-500 transition-colors"
        >
          {type === 'password' ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
    </div>
  </div>
));

const VerificationBox = memo(({ code, setCode }) => {
  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 mb-8">
      {code.map((digit, idx) => (
        <input
          key={idx}
          id={`otp-${idx}`}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className="w-12 h-16 md:w-14 md:h-20 text-center text-2xl font-black bg-slate-50 border-b-4 border-slate-100 focus:border-orange-500 focus:bg-white text-slate-900 transition-all outline-none rounded-t-xl"
        />
      ))}
    </div>
  );
});

const SellerRegister = () => {  // Changed from App to SellerRegister
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState({
    email: '', 
    firstName: '', 
    lastName: '', 
    phone: '', 
    password: '', 
    confirmPassword: '', 
    agreedToTerms: false
  });

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  }, []);

  const copyNumber = useCallback(() => {
    navigator.clipboard.writeText('0207759845')
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const el = document.createElement('textarea');
        el.value = '0207759845';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-orange-100 selection:text-orange-900 overflow-hidden">
      
      {/* Visual Section */}
      <div className="relative w-full md:w-1/2 bg-slate-900 flex flex-col justify-between p-8 md:p-16 text-white overflow-hidden shrink-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg shadow-orange-500/20">
              <Store className="text-white" size={28} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">
              SHOP<span className="text-orange-500">MAX</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
            Become a <br />
            <span className="text-orange-500">Global</span> <br />
            Seller.
          </h1>
          
          <p className="text-slate-400 text-xl font-medium max-w-md leading-relaxed">
            Create your account and unlock your store dashboard in minutes.
          </p>
        </div>

        {step > 2 && (
          <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md max-w-sm">
             <div className="flex items-center gap-3 mb-2 text-orange-500">
               <Info size={20} />
               <span className="text-xs font-black uppercase tracking-widest">Fee Required</span>
             </div>
             <p className="text-slate-300 text-sm font-medium">Activation fee: <span className="text-white font-bold">50.00 GHS</span></p>
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-24 flex flex-col justify-center relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-12">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${step >= i ? 'w-20 bg-orange-500' : 'w-6 bg-slate-100'}`} />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Create Account</h2>
              <p className="text-slate-500 mb-10 font-medium">Let's start with your basic contact information.</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  type="button" 
                  className="flex items-center justify-center gap-3 py-4 border-2 border-slate-50 rounded-2xl hover:bg-slate-50 transition-all font-black text-xs uppercase tracking-widest text-slate-700"
                >
                  <GoogleIcon /> Google
                </button>
                <button 
                  type="button" 
                  className="flex items-center justify-center gap-3 py-4 border-2 border-slate-50 rounded-2xl hover:bg-slate-50 transition-all font-black text-xs uppercase tracking-widest text-slate-700"
                >
                  <FacebookIcon /> Facebook
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <InputField 
                  icon={Mail} 
                  label="Email Address" 
                  name="email" 
                  type="email" 
                  placeholder="jane@store.com" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
                <InputField 
                  icon={Phone} 
                  label="Phone Number" 
                  name="phone" 
                  type="tel" 
                  placeholder="+233 00 000 0000" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
                <button 
                  type="submit" 
                  className="w-full mt-6 bg-slate-900 hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                >
                  Next Step <ChevronRight size={18} />
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <button 
                type="button"
                onClick={() => setStep(1)} 
                className="flex items-center gap-2 text-slate-400 hover:text-orange-600 mb-6 font-black text-xs uppercase tracking-widest group transition-colors"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1" /> Back
              </button>
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Security</h2>
              <p className="text-slate-500 mb-10 font-medium">Protect your store with a strong security key.</p>

              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    icon={User} 
                    label="First Name" 
                    name="firstName" 
                    placeholder="Jane" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                  />
                  <InputField 
                    icon={User} 
                    label="Last Name" 
                    name="lastName" 
                    placeholder="Smith" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                  />
                </div>
                <InputField 
                  icon={Lock} 
                  label="Security Key" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={handleChange} 
                  showPasswordToggle 
                  onTogglePassword={() => setShowPassword(!showPassword)} 
                />
                <InputField 
                  icon={Lock} 
                  label="Confirm Key" 
                  name="confirmPassword" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                />

                <div className="py-6">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="agreedToTerms" 
                      checked={formData.agreedToTerms} 
                      onChange={handleChange} 
                      className="peer hidden" 
                    />
                    <div className="h-6 w-6 border-2 border-slate-100 rounded-lg flex items-center justify-center peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="text-sm text-slate-500 font-bold group-hover:text-slate-900 transition-colors">I accept the Seller Terms</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={!formData.agreedToTerms || formData.password !== formData.confirmPassword} 
                  className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest"
                >
                  Setup Activation
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Activation</h2>
              <p className="text-slate-500 mb-10 font-medium italic">Send 50 Cedis to the number below to activate.</p>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-xl">
                    <Smartphone className="text-blue-900" size={20} strokeWidth={2.5} />
                  </div>
                  <p className="text-lg font-black text-slate-900 uppercase">Telecel Cash (Momo)</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                    <span className="text-xs font-bold text-slate-500 uppercase">Amount</span>
                    <span className="text-xl font-black text-orange-600">50.00 GHS</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                    <span className="text-xs font-bold text-slate-500 uppercase">Merchant</span>
                    <button 
                      type="button"
                      onClick={copyNumber} 
                      className="flex items-center gap-2 group"
                    >
                      <span className="text-lg font-black text-slate-900 group-hover:text-orange-600">0207759845</span>
                      {isCopied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} className="text-slate-300" />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Reference</span>
                    <span className="text-sm font-black text-slate-900 bg-orange-100 px-3 py-1 rounded-full">
                      {formData.phone || 'Your Number'}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setStep(4)} 
                className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest"
              >
                I have paid, Enter Code
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <button 
                type="button"
                onClick={() => setStep(3)} 
                className="flex items-center gap-2 text-slate-400 hover:text-orange-600 mb-6 font-black text-xs uppercase tracking-widest group"
              >
                <ChevronLeft size={16} /> Payment Instructions
              </button>
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Verify</h2>
              <p className="text-slate-500 mb-12 font-medium">Enter the 6-digit code sent to {formData.phone}.</p>

              <VerificationBox code={otp} setCode={setOtp} />

              <div className="mb-8 p-5 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-4">
                <CreditCard className="text-orange-600 shrink-0" size={20} />
                <p className="text-xs font-bold text-orange-900/70 leading-relaxed">
                  Awaiting verification. Codes arrive within 2-5 minutes of payment to <span className="font-black">0207759845</span>.
                </p>
              </div>

              <button 
                type="button"
                disabled={otp.join('').length < 6} 
                className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest"
              >
                Activate My Store
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-green-500" /> Secure Activation
            </div>
            <Link 
  to="/login" 
  className="text-sm font-bold text-slate-400 hover:text-orange-600 transition-colors"
>
  Already a seller? Log in
</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;  // Fixed export name