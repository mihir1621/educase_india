import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col p-6 h-full" style={{ background: '#F7F8F9' }}>
      <div className="mt-4 mb-10">
        <h1 className="text-[28px] font-medium text-[#1D2226] leading-tight mb-2">
          Signin to your <br />PopX account
        </h1>
        <p className="text-[18px] text-[#1D2226] opacity-60 leading-snug">
          Lorem ipsum dolor sit amet,<br />consectetur adipiscing elit,
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative border border-[#CBCBCB] rounded-[6px] px-3 py-2 bg-white">
          <label className="absolute -top-3 left-3 bg-[#F7F8F9] px-1 text-[13px] text-[#6C25FF] font-medium">
            Email Address
          </label>
          <input 
            type="email" 
            placeholder="Enter email address"
            className="w-full text-[14px] text-[#1D2226] outline-none placeholder:text-[#919191] bg-transparent pt-1"
          />
        </div>

        <div className="relative border border-[#CBCBCB] rounded-[6px] px-3 py-2 bg-white">
          <label className="absolute -top-3 left-3 bg-[#F7F8F9] px-1 text-[13px] text-[#6C25FF] font-medium">
            Password
          </label>
          <input 
            type="password" 
            placeholder="Enter password"
            className="w-full text-[14px] text-[#1D2226] outline-none placeholder:text-[#919191] bg-transparent pt-1"
          />
        </div>

        <button 
          onClick={() => navigate('/profile')}
          className="w-full bg-[#CBCBCB] text-white py-3.5 rounded-[6px] text-center text-[16px] font-medium transition-all"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
