import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from 'framer-motion';

function LoginPage() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Email Recovery State
  const [showEmailRecovery, setShowEmailRecovery] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    // Cleanup recaptcha in case of hot reload or unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number with country code.");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const fullPhoneNumber = `+91 ${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setConfirmationResult(result);
      setMessage("OTP sent successfully!");
    } catch (err) {
      console.error("Full Firebase Error:", err);
      // Display the specific error code to the user for debugging
      setError(`Failed to send OTP (${err.code}). Ensure Phone Auth is enabled in Firebase Console.`);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmationResult.confirm(otp);
      navigate('/profile');
    } catch (err) {
      console.error("Verification Error:", err);
      setError(`Invalid OTP (${err.code}). Please check and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

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

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent to your email!");
      setError('');
    } catch (err) {
      setError("Failed to send reset email. Check your address.");
    }
  };

  const handleRecoverEmail = async () => {
    if (!recoveryPhone) {
      setError("Please enter your registered phone number.");
      return;
    }

    setIsRecovering(true);
    setError('');
    setMessage('');

    try {
      // Ensure we query with the prefix space format
      const fullSearchNumber = `+91 ${recoveryPhone}`;
      const q = query(collection(db, "users"), where("phone", "==", fullSearchNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setMessage(`Success! Your registered email is: ${userData.email}`);
        setEmail(userData.email);
        setShowEmailRecovery(false);
        setLoginMethod('email');
      } else {
        setError("No account found with this phone number.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during recovery. Try again.");
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col p-6 h-full relative overflow-y-auto hide-scrollbar"
      style={{ background: '#F7F8F9' }}
    >
      <div id="recaptcha-container"></div>

      <div className="mt-4 mb-8">
        <h1 className="text-[28px] font-medium text-[#1D2226] leading-tight mb-2">
          Signin to your <br />PopX account
        </h1>
        <p className="text-[18px] text-[#1D2226] opacity-60 leading-snug">
          Select your preferred login method below.
        </p>
      </div>

      {/* Login Method Toggle */}
      <div className="flex gap-2 mb-8 bg-gray-200 p-1 rounded-lg">
        <button
          onClick={() => { setLoginMethod('email'); setError(''); setMessage(''); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginMethod === 'email' ? 'bg-white shadow-sm text-[#6C25FF]' : 'text-gray-500'}`}
        >
          Email
        </button>
        <button
          onClick={() => { setLoginMethod('otp'); setError(''); setMessage(''); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginMethod === 'otp' ? 'bg-white shadow-sm text-[#6C25FF]' : 'text-gray-500'}`}
        >
          OTP
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
      {message && <p className="text-green-600 font-medium text-sm mb-4">{message}</p>}

      <AnimatePresence mode="wait">
        {loginMethod === 'email' ? (
          <motion.div
            key="email-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div className="relative border border-[#CBCBCB] rounded-[6px] px-3 py-2 bg-white">
              <label className="absolute -top-3 left-3 bg-[#F7F8F9] px-1 text-[13px] text-[#6C25FF] font-medium">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-[14px] text-[#1D2226] outline-none bg-transparent pt-1"
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
                className="w-full text-[14px] text-[#1D2226] outline-none bg-transparent pt-1"
              />
            </div>

            <div className="flex justify-between items-center -mt-2">
              <button type="button" onClick={handleForgotPassword} className="text-[13px] text-[#6C25FF] font-medium hover:underline opacity-80">Forgot Password?</button>
              <button type="button" onClick={() => setShowEmailRecovery(true)} className="text-[13px] text-[#6C25FF] font-medium hover:underline opacity-80">Forgot Email?</button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full ${email && password ? 'bg-[#6C25FF]' : 'bg-[#CBCBCB]'} text-white py-3.5 rounded-[6px] text-center text-[16px] font-medium transition-all ${loading ? 'opacity-50' : 'hover:opacity-90 active:scale-95'}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="otp-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {!confirmationResult ? (
              <>
                <div className="relative border border-[#CBCBCB] rounded-[6px] px-3 py-2 bg-white flex items-center">
                  <label className="absolute -top-3 left-3 bg-[#F7F8F9] px-1 text-[13px] text-[#6C25FF] font-medium">
                    Phone Number
                  </label>
                  <span className="text-[14px] text-[#1D2226] font-medium pt-1 mr-1">+91</span>
                  <input 
                    type="text" 
                    placeholder="1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full text-[14px] text-[#1D2226] outline-none bg-transparent pt-1"
                  />
                </div>
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-[#6C25FF] text-white py-3.5 rounded-[6px] font-medium hover:opacity-90 active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <div className="relative border border-[#CBCBCB] rounded-[6px] px-3 py-2 bg-white">
                  <label className="absolute -top-3 left-3 bg-[#F7F8F9] px-1 text-[13px] text-[#6C25FF] font-medium">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-[14px] text-[#1D2226] outline-none bg-transparent pt-1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="w-full bg-[#6C25FF] text-white py-3.5 rounded-[6px] font-medium hover:opacity-90 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    onClick={() => setConfirmationResult(null)}
                    className="text-xs text-[#6C25FF] underline text-center"
                  >
                    Change Number
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Recovery Modal */}
      <AnimatePresence>
        {showEmailRecovery && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 bg-white z-50 p-6 flex flex-col pt-20"
          >
            <h2 className="text-xl font-bold mb-4">Recover Email</h2>
            <p className="text-sm text-gray-500 mb-8">Enter your registered phone number to find your account.</p>
            <div className="relative border border-[#CBCBCB] rounded-[6px] px-3 py-2 bg-white mb-6 flex items-center">
              <label className="absolute -top-3 left-3 bg-white px-1 text-[13px] text-[#6C25FF] font-medium">
                Phone Number
              </label>
              <span className="text-[14px] text-[#1D2226] font-medium pt-1 mr-1">+91</span>
              <input 
                type="text" 
                placeholder="1234567890" 
                value={recoveryPhone} 
                onChange={(e) => setRecoveryPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                className="w-full text-[14px] text-[#1D2226] outline-none bg-transparent pt-1" 
              />
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleRecoverEmail} className="w-full bg-[#6C25FF] text-white py-3.5 rounded-[6px] font-medium">Find My Email</button>
              <button onClick={() => setShowEmailRecovery(false)} className="w-full text-[#6C25FF] py-3.5 font-medium underline">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default LoginPage;
