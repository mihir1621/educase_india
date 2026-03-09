import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const [isAgency, setIsAgency] = useState('yes');

  const InputField = ({ label, placeholder, type = "text" }) => (
    <div className="relative border border-[#CBCBCB] rounded-[6px] px-3 py-2 bg-white">
      <label className="absolute -top-3 left-3 bg-[#F7F8F9] px-1 text-[13px] text-[#6C25FF] font-medium">
        {label}<span className="text-[#DD4A3D]">*</span>
      </label>
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full text-[14px] text-[#1D2226] outline-none placeholder:text-[#919191] bg-transparent pt-1"
      />
    </div>
  );

  return (
    <div className="flex flex-col p-6 h-full relative" style={{ background: '#F7F8F9' }}>
      <div className="mt-4 mb-10">
        <h1 className="text-[28px] font-medium text-[#1D2226] leading-tight mb-2">
          Create your <br />PopX account
        </h1>
      </div>

      <div className="flex flex-col gap-8 pb-32">
        <InputField label="Full Name" placeholder="Marry Doe" />
        <InputField label="Phone number" placeholder="Marry Doe" />
        <InputField label="Email address" placeholder="Marry Doe" type="email" />
        <InputField label="Password" placeholder="Marry Doe" type="password" />
        <InputField label="Company name" placeholder="Marry Doe" />

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
          onClick={() => navigate('/profile')}
          className="w-full bg-[#6C25FF] text-white py-3.5 rounded-[6px] text-center text-[16px] font-medium hover:opacity-90 transition-all"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
