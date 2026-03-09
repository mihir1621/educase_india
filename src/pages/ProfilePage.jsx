import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { auth, db } from '../firebase';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfileSkeleton = () => (
  <div className="flex flex-col h-full bg-[var(--bg-main)]">
    <div className="bg-[var(--bg-surface)] px-6 py-5 shadow-sm border-b border-[var(--border-color)] border-dashed flex justify-between items-center">
      <div className="h-6 w-32 skeleton rounded"></div>
      <div className="h-4 w-12 skeleton rounded"></div>
    </div>
    <div className="p-6">
      <div className="flex gap-4 items-center mb-6">
        <div className="w-[76px] h-[76px] skeleton rounded-full"></div>
        <div className="flex flex-col gap-2">
          <div className="h-5 w-24 skeleton rounded"></div>
          <div className="h-4 w-32 skeleton rounded"></div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-8 border-b border-[var(--border-color)] border-dashed pb-6">
        <div className="h-4 w-full skeleton rounded"></div>
        <div className="h-4 w-full skeleton rounded"></div>
        <div className="h-4 w-2/3 skeleton rounded"></div>
      </div>
    </div>
  </div>
);

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full bg-[var(--bg-main)] transition-colors duration-300"
    >
      <div className="bg-[var(--bg-surface)] px-6 py-5 shadow-sm border-b border-[var(--border-color)] border-dashed flex justify-between items-center transition-colors duration-300">
        <h2 className="text-[18px] font-medium text-[var(--text-main)]">
          Account Settings
        </h2>
        <div className="flex items-center gap-4">
          <ThemeToggleButton />
          <button onClick={handleLogout} className="text-xs text-[var(--primary)] font-medium hover:underline">
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-4 items-center mb-6">
          <div className="relative w-[76px] h-[76px]">
            <img 
              src={user?.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"} 
              alt="Profile"
              className="w-full h-full rounded-full object-cover shadow-md"
            />
            <div className="absolute bottom-0 right-0 bg-[var(--primary)] dark:bg-[#CEBAFB] p-1.5 rounded-full border-2 border-[var(--bg-main)] shadow-sm">
              <Camera size={14} className="text-white dark:text-[#1D2226]" />
            </div>
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-[var(--text-main)]">
              {user?.displayName || 'User'}
            </h3>
            <p className="text-[14px] text-[var(--text-sub)]">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="border-b border-[var(--border-color)] border-dashed pb-6">
          <p className="text-[14px] text-[var(--text-main)] leading-relaxed opacity-80 mb-4">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
          </p>
          
          {userData && (
            <div className="flex flex-col gap-2 mt-4 text-[13px]">
              <div className="flex justify-between p-2 rounded bg-[var(--bg-surface)] transition-colors duration-300">
                <span className="text-[var(--text-sub)]">Phone:</span>
                <span className="text-[var(--text-main)] font-medium">{userData.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[var(--bg-surface)] transition-colors duration-300">
                <span className="text-[var(--text-sub)]">Agency:</span>
                <span className="text-[var(--text-main)] font-medium">{userData.isAgency ? 'Yes' : 'No'}</span>
              </div>
              {userData.company && (
                <div className="flex justify-between p-2 rounded bg-[var(--bg-surface)] transition-colors duration-300">
                  <span className="text-[var(--text-sub)]">Company:</span>
                  <span className="text-[var(--text-main)] font-medium">{userData.company}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProfilePage;
