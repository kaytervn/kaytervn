import React, { useState, useEffect } from "react";
import { remoteUrl } from "../../types/constant";
import { UserCircle, Phone, Mail, Book, X, Calendar } from "lucide-react";
import { getDate } from "../../types/utils";
import { Profile } from "../../models/profile/Profile";

interface ProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
    profileData: Profile | null; 
  }
  

interface UserProfile {
  displayName: string;
  email: string;
  phone: string;
  studentId: string;
  bio: string;
  avatarUrl: string;
  birthDate: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isVisible, onClose, profileData }) => {
    if (!isVisible || !profileData) return null;
  
    const InfoItem = ({
      icon: Icon,
      label,
      value,
    }: {
      icon: any;
      label: string;
      value: string;
    }) => (
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div className="bg-blue-100 p-2 rounded-full">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-medium text-gray-800">{value || "Chưa có"}</p>
        </div>
      </div>
    );
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl w-11/12 md:w-[480px] p-6 relative shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
          <button
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={onClose}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
  
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">
            Thông tin cá nhân
          </h2>
  
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <img
                src={profileData.avatarUrl || "https://via.placeholder.com/112"}
                alt="Avatar"
                className="rounded-full w-28 h-28 object-cover border-4 border-blue-100 shadow-lg"
              />
            </div>
  
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {profileData.displayName || "Chưa có tên"}
            </h3>
  
            <div className="w-full space-y-3">
              <InfoItem icon={Mail} label="Email" value={profileData.email} />
              {/* <InfoItem icon={Phone} label="Số điện thoại" value={profileData} /> */}
              {/* <InfoItem icon={UserCircle} label="MSSV" value={profileData.} /> */}
              <InfoItem icon={Calendar} label="Ngày sinh" value={profileData.birthDate} />
              <InfoItem icon={Book} label="Tiểu sử" value={profileData.bio} />
            </div>
          </div>
        </div>
      </div>
    );
  };
  

export default ProfileModal;
