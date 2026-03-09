import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../firebase';
import { Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { motion } from 'framer-motion';

const InputField = ({ label, placeholder, type = "text", field, required = true, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = field === 'password';

  return (
    <div className="relative border border-[var(--border-color)] rounded-[6px] px-3 py-2 bg-[var(--bg-surface)] flex items-center">
      <label className="absolute -top-3 left-3 bg-[var(--bg-main)] px-1 text-[13px] text-[var(--primary)] font-medium">
        {label}{required && <span className="text-[#DD4A3D]">*</span>}
      </label>
      <input 
        type={isPasswordField ? (showPassword ? "text" : "password") : type} 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e, field)}
        autoComplete="off"
        className="w-full text-[14px] text-[var(--text-main)] outline-none bg-transparent pt-1"
      />
      {isPasswordField && (
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-[var(--text-main)] opacity-50 hover:opacity-100 transition-opacity ml-2"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

function SignupPage() {
  const navigate = useNavigate();
  const [isAgency, setIsAgency] = useState('yes');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e, field) => {
    let val = e.target.value;
    if (field === 'phone') {
      val = val.replace(/\D/g, '').slice(0, 10);
    }
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSignup = async () => {
    if (!formData.email || !formData.password || !formData.fullName || !formData.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.fullName });

      const formattedPhone = `+91 ${formData.phone}`;

      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        phone: formattedPhone,
        company: formData.company,
        isAgency: isAgency === 'yes',
        email: formData.email,
        createdAt: new Date().toISOString()
      });

      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          fullName: user.displayName,
          email: user.email,
          phone: user.phoneNumber || '',
          isAgency: false, 
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL
        });
      }
      navigate('/profile');
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("Failed to sign up with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col p-6 h-full relative bg-[var(--bg-main)] transition-colors duration-300"
    >
      <div className="mt-4 mb-8">
        <h1 className="text-[28px] font-medium text-[var(--text-main)] leading-tight mb-2">
          Create your <br />PopX account
        </h1>
      </div>

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      <div className="flex flex-col gap-6 pb-32">
        <InputField 
          label="Full Name" 
          placeholder="Marry Doe" 
          field="fullName" 
          value={formData.fullName} 
          onChange={handleInputChange} 
        />
        
        <div className="relative border border-[var(--border-color)] rounded-[6px] px-3 py-2 bg-[var(--bg-surface)] flex items-center">
          <label className="absolute -top-3 left-3 bg-[var(--bg-main)] px-1 text-[13px] text-[var(--primary)] font-medium">
            Phone number<span className="text-[#DD4A3D]">*</span>
          </label>
          <span className="text-[14px] text-[var(--text-main)] font-medium pt-1 mr-1">+91</span>
          <input 
            type="text" 
            placeholder="1234567890" 
            value={formData.phone}
            onChange={(e) => handleInputChange(e, 'phone')}
            className="w-full text-[14px] text-[var(--text-main)] outline-none bg-transparent pt-1"
          />
        </div>

        <InputField label="Email address" placeholder="marry@gmail.com" type="email" field="email" value={formData.email} onChange={handleInputChange} />
        <InputField label="Password" placeholder="••••••••" type="password" field="password" value={formData.password} onChange={handleInputChange} />
        <InputField label="Company name" placeholder="PopX Agency" field="company" required={false} value={formData.company} onChange={handleInputChange} />

        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-[var(--text-main)] font-medium">
            Are you an Agency?<span className="text-[#DD4A3D]">*</span>
          </p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="yes" checked={isAgency === 'yes'} onChange={() => setIsAgency('yes')} className="w-4 h-4 accent-[var(--primary)]" />
              <span className="text-[14px] text-[var(--text-main)]">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="no" checked={isAgency === 'no'} onChange={() => setIsAgency('no')} className="w-4 h-4 accent-[var(--primary)]" />
              <span className="text-[14px] text-[var(--text-main)]">No</span>
            </label>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <button 
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-[var(--primary)] text-white dark:text-[#1D2226] py-3.5 rounded-[6px] text-center text-[16px] font-medium transition-all"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        <div className="flex items-center gap-4 my-3 px-4">
          <div className="flex-1 h-[1px] bg-[var(--border-color)] opacity-50"></div>
          <span className="text-[12px] text-[var(--text-main)] opacity-40 uppercase">or</span>
          <div className="flex-1 h-[1px] bg-[var(--border-color)] opacity-50"></div>
        </div>

        <button 
          onClick={handleGoogleSignup}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-color)] py-3 rounded-[6px] text-[15px] font-medium text-[var(--text-main)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Signup with Google
        </button>
      </div>
    </motion.div>
  );
}

export default SignupPage;
