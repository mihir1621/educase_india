import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { motion } from 'framer-motion';

const InputField = ({ label, placeholder, type = "text", field, required = true, value, onChange }) => (
  <div className="relative border border-[#CBCBCB] rounded-[6px] px-3 py-2 bg-white">
    <label className="absolute -top-3 left-3 bg-[#F7F8F9] px-1 text-[13px] text-[#6C25FF] font-medium">
      {label}{required && <span className="text-[#DD4A3D]">*</span>}
    </label>
    <input 
      type={type} 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e, field)}
      autoComplete="off"
      className="w-full text-[14px] text-[#1D2226] outline-none placeholder:text-[#919191] bg-transparent pt-1"
    />
  </div>
);

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

      // Save phone with standard +91 format
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

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col p-6 h-full relative" 
      style={{ background: '#F7F8F9' }}
    >
      <div className="mt-4 mb-8">
        <h1 className="text-[28px] font-medium text-[#1D2226] leading-tight mb-2">
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
        
        {/* Adjusted Phone Input with fixed +91 */}
        <div className="relative border border-[#CBCBCB] rounded-[6px] px-3 py-2 bg-white flex items-center">
          <label className="absolute -top-3 left-3 bg-[#F7F8F9] px-1 text-[13px] text-[#6C25FF] font-medium">
            Phone number<span className="text-[#DD4A3D]">*</span>
          </label>
          <span className="text-[14px] text-[#1D2226] font-medium pt-1 mr-1">+91</span>
          <input 
            type="text" 
            placeholder="1234567890" 
            value={formData.phone}
            onChange={(e) => handleInputChange(e, 'phone')}
            className="w-full text-[14px] text-[#1D2226] outline-none placeholder:text-[#919191] bg-transparent pt-1"
          />
        </div>

        <InputField 
          label="Email address" 
          placeholder="marry@gmail.com" 
          type="email" 
          field="email" 
          value={formData.email} 
          onChange={handleInputChange} 
        />
        <InputField 
          label="Password" 
          placeholder="••••••••" 
          type="password" 
          field="password" 
          value={formData.password} 
          onChange={handleInputChange} 
        />
        <InputField 
          label="Company name" 
          placeholder="PopX Agency" 
          field="company" 
          required={false} 
          value={formData.company} 
          onChange={handleInputChange} 
        />

        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-[#1D2226] font-medium">
            Are you an Agency?<span className="text-[#DD4A3D]">*</span>
          </p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="agency" 
                value="yes" 
                checked={isAgency === 'yes'} 
                onChange={() => setIsAgency('yes')}
                className="w-4 h-4 accent-[#6C25FF]"
              />
              <span className="text-[14px] text-[#1D2226]">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="agency" 
                value="no" 
                checked={isAgency === 'no'} 
                onChange={() => setIsAgency('no')}
                className="w-4 h-4 accent-[#6C25FF]"
              />
              <span className="text-[14px] text-[#1D2226]">No</span>
            </label>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <button 
          onClick={handleSignup}
          disabled={loading}
          className={`w-full bg-[#6C25FF] text-white py-3.5 rounded-[6px] text-center text-[16px] font-medium transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-95'}`}
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </div>
    </motion.div>
  );
}

export default SignupPage;
