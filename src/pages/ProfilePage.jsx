import React from 'react';
import { Camera } from 'lucide-react';

function ProfilePage() {
  return (
    <div className="flex flex-col h-full" style={{ background: '#F7F8F9' }}>
      {/* Header bar */}
      <div className="bg-white px-6 py-5 shadow-sm border-b border-[#CBCBCB] border-dashed">
        <h2 className="text-[18px] font-medium text-[#1D2226]">
          Account Settings
        </h2>
      </div>

      <div className="p-6">
        <div className="flex gap-4 items-center mb-6">
          <div className="relative w-[76px] h-[76px]">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150" 
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-[#6C25FF] p-1.5 rounded-full border border-white">
              <Camera size={14} className="text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-[#1D2226]">
              Marry Doe
            </h3>
            <p className="text-[14px] text-[#1D2226] opacity-60">
              Marry@Gmail.com
            </p>
          </div>
        </div>

        <p className="text-[14px] text-[#1D2226] leading-relaxed opacity-80 mb-8 border-b border-[#CBCBCB] border-dashed pb-6">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;
