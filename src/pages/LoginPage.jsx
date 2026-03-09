import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/profile');
    } catch (err) {
      setError("Invalid email or password.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

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

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      <div className="flex flex-col gap-6">
        <div className="relative border border-[#CBCBCB] rounded-[6px] px-3 py-2 bg-white">
          <label className="absolute -top-3 left-3 bg-[#F7F8F9] px-1 text-[13px] text-[#6C25FF] font-medium">
            Email Address
          </label>
          <input 
            type="email" 
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-[14px] text-[#1D2226] outline-none placeholder:text-[#919191] bg-transparent pt-1"
          />
        </div>

        <button 
          onClick={handleLogin}
          disabled={loading}
          className={`w-full ${email && password ? 'bg-[#6C25FF]' : 'bg-[#CBCBCB]'} text-white py-3.5 rounded-[6px] text-center text-[16px] font-medium transition-all ${loading ? 'opacity-50' : 'hover:opacity-90'}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
