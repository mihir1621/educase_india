import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSignup = async () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update Auth Profile with Name
      await updateProfile(user, { displayName: formData.fullName });

      // 3. Store extra info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        phone: formData.phone,
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

  const InputField = ({ label, placeholder, type = "text", field, required = true }) => (
    <div className="relative border border-[#CBCBCB] rounded-[6px] px-3 py-2 bg-white">
      <label className="absolute -top-3 left-3 bg-[#F7F8F9] px-1 text-[13px] text-[#6C25FF] font-medium">
        {label}{required && <span className="text-[#DD4A3D]">*</span>}
      </label>
      <input 
        type={type} 
        placeholder={placeholder}
        value={formData[field]}
        onChange={(e) => handleInputChange(e, field)}
        className="w-full text-[14px] text-[#1D2226] outline-none placeholder:text-[#919191] bg-transparent pt-1"
      />
    </div>
  );

  return (
    <div className="flex flex-col p-6 h-full relative" style={{ background: '#F7F8F9' }}>
      <div className="mt-4 mb-8">
        <h1 className="text-[28px] font-medium text-[#1D2226] leading-tight mb-2">
          Create your <br />PopX account
        </h1>
      </div>

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      <div className="flex flex-col gap-6 pb-32">
        <InputField label="Full Name" placeholder="Marry Doe" field="fullName" />
        <InputField label="Phone number" placeholder="Marry Doe" field="phone" />
        <InputField label="Email address" placeholder="Marry Doe" type="email" field="email" />
        <InputField label="Password" placeholder="Marry Doe" type="password" field="password" />
        <InputField label="Company name" placeholder="Marry Doe" field="company" required={false} />

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
          className={`w-full bg-[#6C25FF] text-white py-3.5 rounded-[6px] text-center text-[16px] font-medium transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
