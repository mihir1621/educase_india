import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../firebase';
import { Eye, EyeOff } from 'lucide-react';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  signInWithPopup
} from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from 'framer-motion';

function LoginPage() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [showEmailRecovery, setShowEmailRecovery] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
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
      console.error(err);
      setError(`Failed to send OTP (${err.code}).`);
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
      setError(`Invalid OTP (${err.code}).`);
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
      setMessage("Password reset link sent!");
      setError('');
    } catch (err) {
      setError("Failed to send reset email.");
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
      const fullSearchNumber = `+91 ${recoveryPhone}`;
      const q = query(collection(db, "users"), where("phone", "==", fullSearchNumber));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setMessage(`Found! Email: ${userData.email}`);
        setEmail(userData.email);
        setShowEmailRecovery(false);
        setLoginMethod('email');
      } else {
        setError("No account found with this phone.");
      }
    } catch (err) {
      setError("Recovery error.");
    } finally {
      setIsRecovering(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If it's a new user via Google, create their document
        await setDoc(userDocRef, {
          fullName: user.displayName,
          email: user.email,
          phone: user.phoneNumber || '',
          isAgency: false, // Default for social login
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL
        });
      }
      navigate('/profile');
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("Failed to sign in with Google.");
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
      className="flex flex-col p-6 h-full relative overflow-y-auto hide-scrollbar bg-[var(--bg-main)] transition-colors duration-300"
    >
      <div id="recaptcha-container"></div>

      <div className="mt-4 mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-[28px] font-medium text-[var(--text-main)] leading-tight mb-2">
            Signin to your <br />PopX account
          </h1>
          <p className="text-[18px] text-[var(--text-main)] opacity-60 leading-snug">
            Choose your login method.
          </p>
        </div>
        <ThemeToggleButton />
      </div>

      <div className="flex gap-2 mb-8 bg-[var(--border-color)] p-1 rounded-lg transition-colors duration-300">
        <button 
          onClick={() => { setLoginMethod('email'); setError(''); setMessage(''); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginMethod === 'email' ? 'bg-[var(--bg-surface)] shadow-sm text-[var(--primary)]' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Email
        </button>
        <button 
          onClick={() => { setLoginMethod('otp'); setError(''); setMessage(''); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginMethod === 'otp' ? 'bg-[var(--bg-surface)] shadow-sm text-[var(--primary)]' : 'text-gray-500 dark:text-gray-400'}`}
        >
          OTP
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
      {message && <p className="text-green-600 font-medium text-sm mb-4">{message}</p>}

      <AnimatePresence mode="wait">
        {loginMethod === 'email' ? (
          <motion.div key="email-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
            <div className="relative border border-[var(--border-color)] rounded-[6px] px-3 py-2 bg-[var(--bg-surface)]">
              <label className="absolute -top-3 left-3 bg-[var(--bg-main)] px-1 text-[13px] text-[var(--primary)] font-medium">Email Address</label>
              <input type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-[14px] text-[var(--text-main)] outline-none bg-transparent pt-1" />
            </div>
            <div className="relative border border-[var(--border-color)] rounded-[6px] px-3 py-2 bg-[var(--bg-surface)] flex items-center">
              <label className="absolute -top-3 left-3 bg-[var(--bg-main)] px-1 text-[13px] text-[var(--primary)] font-medium">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full text-[14px] text-[var(--text-main)] outline-none bg-transparent pt-1" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[var(--text-main)] opacity-50 hover:opacity-100 transition-opacity ml-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-between items-center -mt-2">
              <button type="button" onClick={handleForgotPassword} className="text-[13px] text-[var(--primary)] font-medium hover:underline">Forgot Password?</button>
              <button type="button" onClick={() => setShowEmailRecovery(true)} className="text-[13px] text-[var(--primary)] font-medium hover:underline">Forgot Email?</button>
            </div>
            <button onClick={handleLogin} disabled={loading} className={`w-full ${email && password ? 'bg-[var(--primary)] text-white dark:text-[#1D2226]' : 'bg-[var(--border-color)] text-white'} py-3.5 rounded-[6px] text-center text-[16px] font-medium transition-all`}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-[1px] bg-[var(--border-color)]"></div>
              <span className="text-[14px] text-[var(--text-main)] opacity-40">or login with</span>
              <div className="flex-1 h-[1px] bg-[var(--border-color)]"></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-color)] py-3 rounded-[6px] text-[15px] font-medium text-[var(--text-main)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </motion.div>
        ) : (
          <motion.div key="otp-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
            {!confirmationResult ? (
              <>
                <div className="relative border border-[var(--border-color)] rounded-[6px] px-3 py-2 bg-[var(--bg-surface)] flex items-center">
                  <label className="absolute -top-3 left-3 bg-[var(--bg-main)] px-1 text-[13px] text-[var(--primary)] font-medium">Phone Number</label>
                  <span className="text-[14px] text-[var(--text-main)] font-medium pt-1 mr-1">+91</span>
                  <input type="text" placeholder="1234567890" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full text-[14px] text-[var(--text-main)] outline-none bg-transparent pt-1" />
                </div>
                <button onClick={handleSendOTP} disabled={loading} className="w-full bg-[var(--primary)] text-white dark:text-[#1D2226] py-3.5 rounded-[6px] font-medium transition-all disabled:opacity-50">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <div className="relative border border-[var(--border-color)] rounded-[6px] px-3 py-2 bg-[var(--bg-surface)]">
                  <label className="absolute -top-3 left-3 bg-[var(--bg-main)] px-1 text-[13px] text-[var(--primary)] font-medium">Enter OTP</label>
                  <input type="text" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full text-[14px] text-[var(--text-main)] outline-none bg-transparent pt-1" />
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={handleVerifyOTP} disabled={loading} className="w-full bg-[var(--primary)] text-white dark:text-[#1D2226] py-3.5 rounded-[6px] font-medium transition-all disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEmailRecovery && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="absolute inset-0 bg-[var(--bg-main)] z-50 p-6 flex flex-col pt-20 transition-colors duration-300">
            <h2 className="text-xl font-bold mb-4 text-[var(--text-main)]">Recover Email</h2>
            <div className="relative border border-[var(--border-color)] rounded-[6px] px-3 py-2 bg-[var(--bg-surface)] mb-6 flex items-center">
              <label className="absolute -top-3 left-3 bg-[var(--bg-main)] px-1 text-[13px] text-[var(--primary)] font-medium">Phone Number</label>
              <span className="text-[14px] text-[var(--text-main)] font-medium pt-1 mr-1">+91</span>
              <input type="text" placeholder="1234567890" value={recoveryPhone} onChange={(e) => setRecoveryPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full text-[14px] text-[var(--text-main)] outline-none bg-transparent pt-1" />
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleRecoverEmail} className="w-full bg-[var(--primary)] text-white dark:text-[#1D2226] py-3.5 rounded-[6px] font-medium transition-all">Find My Email</button>
              <button onClick={() => setShowEmailRecovery(false)} className="w-full text-[var(--primary)] py-3.5 font-medium underline">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default LoginPage;
