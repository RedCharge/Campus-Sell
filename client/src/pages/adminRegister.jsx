import React, { useState, useCallback, memo } from 'react';
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
  ShieldAlert,
  UserCheck,
  Smartphone,
  Info
} from 'lucide-react';

// Memoized Input Field following the "Seller" aesthetic
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

// Memoized 6-digit Verification Box
const VerificationBox = memo(({ code, setCode }) => {
  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);
    if (value && index < 5) {
      document.getElementById(`admin-key-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`admin-key-${index - 1}`).focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 mb-8">
      {code.map((digit, idx) => (
        <input
          key={idx}
          id={`admin-key-${idx}`}
          type="password"
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

const App = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [adminKey, setAdminKey] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', phone: '', password: '', confirmPassword: '', agreedToTerms: false
  });

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-orange-100 selection:text-orange-900 overflow-hidden">
      
      {/* Visual Side (Orange/Slate theme) */}
      <div className="relative w-full md:w-1/2 bg-slate-900 flex flex-col justify-between p-8 md:p-16 text-white overflow-hidden shrink-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg shadow-orange-500/20">
              <ShieldAlert className="text-white" size={28} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">
              ADMIN<span className="text-orange-500">MAX</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
            System <br />
            <span className="text-orange-500">Access</span> <br />
            Portal.
          </h1>
          
          <p className="text-slate-400 text-xl font-medium max-w-md leading-relaxed">
            Authorized personnel only. Create your administrative account to manage system operations.
          </p>
        </div>

        <div className="relative z-10 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md max-w-sm">
          <div className="flex items-center gap-4 mb-4 text-orange-500">
            <Info size={20} />
            <span className="text-sm font-black uppercase tracking-widest">Verification Info</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Admin accounts require a <span className="text-white font-bold">6-digit Master Key</span> provided by the system owner to complete registration.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-24 flex flex-col justify-center relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-12">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${step >= i ? 'w-20 bg-orange-500' : 'w-6 bg-slate-100'}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Admin Registry</h2>
              <p className="text-slate-500 mb-10 font-medium">Enter your professional contact information.</p>

              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <InputField icon={Mail} label="Corporate Email" name="email" type="email" placeholder="admin@shopmax.com" value={formData.email} onChange={handleChange} />
                <InputField icon={Phone} label="Direct Line" name="phone" type="tel" placeholder="+233 ..." value={formData.phone} onChange={handleChange} />
                <button type="submit" className="w-full mt-6 bg-slate-900 hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
                  Next Step <ChevronRight size={18} />
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in duration-500">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-orange-600 mb-6 font-black text-xs uppercase tracking-widest group transition-colors">
                <ChevronLeft size={16} className="group-hover:-translate-x-1" /> Back
              </button>
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Security</h2>
              <p className="text-slate-500 mb-10 font-medium">Establish your unique admin credentials.</p>

              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                <div className="grid grid-cols-2 gap-4">
                  <InputField icon={User} label="First Name" name="firstName" placeholder="Admin" value={formData.firstName} onChange={handleChange} />
                  <InputField icon={User} label="Last Name" name="lastName" placeholder="User" value={formData.lastName} onChange={handleChange} />
                </div>
                <InputField icon={Lock} label="Access Key" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} showPasswordToggle onTogglePassword={() => setShowPassword(!showPassword)} />
                <InputField icon={Lock} label="Confirm Key" name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />

                <div className="py-6">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} className="peer hidden" />
                    <div className="h-6 w-6 border-2 border-slate-100 rounded-lg flex items-center justify-center peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="text-sm text-slate-500 font-bold group-hover:text-slate-900 transition-colors">I accept Admin Governance Policy</span>
                  </label>
                </div>

                <button type="submit" disabled={!formData.agreedToTerms || formData.password !== formData.confirmPassword} className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-100 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest">
                  Continue to Auth
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <button onClick={() => setStep(2)} className="flex items-center gap-2 text-slate-400 hover:text-orange-600 mb-6 font-black text-xs uppercase tracking-widest group transition-colors">
                <ChevronLeft size={16} /> Back
              </button>
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Verify</h2>
              <p className="text-slate-500 mb-10 font-medium italic">Enter your 6-digit Master Key to authorize this account.</p>

              <VerificationBox code={adminKey} setCode={setAdminKey} />

              <div className="mb-10 p-5 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-4">
                <ShieldAlert className="text-orange-600 shrink-0" size={20} />
                <p className="text-xs font-bold text-orange-900/70 leading-relaxed uppercase tracking-tighter">
                  Every attempt is logged. IP and hardware signatures are recorded for administrative security.
                </p>
              </div>

              <button 
                disabled={adminKey.join('').length < 6}
                className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-100 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3"
              >
                Authenticate Admin <UserCheck size={18} />
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <ShieldCheck size={14} className="text-green-500" /> Admin Security Level 1
             </div>
             <button className="text-sm font-bold text-slate-400 hover:text-orange-600 uppercase tracking-widest text-[10px]">Log in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;