import React, { useState } from "react";
import {
  MessageCircle,
  FileText,
  Users,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useNavigate } from "react-router-dom";
import { ConfimationDialog } from "./Dialog";
import useDialog from "../hooks/useDialog";
import ProfileModal from "../components/modal/ProfileModal";
import EditProfileModal from "../components/modal/EditProfileModal";
import { useProfile } from "../types/UserContext";
import useFetch from "../hooks/useFetch";
import { ZALO_UTE_PORTAL_ACCESS_TOKEN } from "../types/constant";

interface NavBarProps {
  setSelectedSection: (section: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ setSelectedSection }) => {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("messages");
  const navigate = useNavigate();
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const {setProfile} = useProfile();
  const { get } = useFetch();
  
  const handleProfileClick = () => {
    setProfileModalVisible(true);
    setActiveSection("profile");
  };

  const handleOpenEditModal = () => {
    setProfileModalVisible(false);
    setEditProfileModalVisible(true);
  };

  const handleLogout = () => {
    showDialog();
  };

  const onConfirmLogout = () => {
    localStorage.removeItem(ZALO_UTE_PORTAL_ACCESS_TOKEN);
    setProfile(null);
    navigate("/");
    window.location.reload();
  };

  const onCancelLogout = () => {
    hideDialog();
  };

  return (
    <>
      <div className="w-16 bg-blue-500 text-white flex flex-col items-center py-6 space-y-6">
        <button
          data-tooltip-id="tooltip-profile"
          data-tooltip-content="Trang cá nhân"
          className={`focus:outline-none ${
            activeSection === "profile" ? "glow-shake" : ""
          }`}
          onClick={handleProfileClick}
        >
          <User
            size={24}
            className={`transition-transform ${
              activeSection === "profile" ? "scale-125" : "hover:scale-110"
            }`}
          />
        </button>

        <button
          data-tooltip-id="tooltip-messages"
          data-tooltip-content="Tin nhắn"
          onClick={() => {
            setSelectedSection("messages");
            setActiveSection("messages");
          }}
          className={`focus:outline-none ${
            activeSection === "messages" ? "text-yellow-400" : ""
          }`}
        >
          <MessageCircle
            size={24}
            className={`transition-transform ${
              activeSection === "messages" ? "scale-125" : "hover:scale-110"
            }`}
          />
        </button>

        <button
          data-tooltip-id="tooltip-posts"
          data-tooltip-content="Bài đăng"
          onClick={() => {
            setSelectedSection("posts");
            setActiveSection("posts");
          }}
          className={`focus:outline-none ${
            activeSection === "posts" ? "text-yellow-400" : ""
          }`}
        >
          <FileText
            size={24}
            className={`transition-transform ${
              activeSection === "posts" ? "scale-125" : "hover:scale-110"
            }`}
          />
        </button>

        <button
          data-tooltip-id="tooltip-friends"
          data-tooltip-content="Bạn bè"
          onClick={() => {
            setSelectedSection("friends");
            setActiveSection("friends");
          }}
          className={`focus:outline-none ${
            activeSection === "friends" ? "text-yellow-400" : ""
          }`}
        >
          <Users
            size={24}
            className={`transition-transform ${
              activeSection === "friends" ? "scale-125" : "hover:scale-110"
            }`}
          />
        </button>

       

        <button
          data-tooltip-id="tooltip-logout"
          data-tooltip-content="Đăng xuất"
          className="focus:outline-none mt-auto"
          onClick={handleLogout}
        >
          <LogOut size={24} className="hover:scale-110 transition-transform" />
        </button>

        <Tooltip id="tooltip-profile" style={{ zIndex: 100 }} />
        <Tooltip id="tooltip-messages" style={{ zIndex: 100 }} />
        <Tooltip id="tooltip-posts" style={{ zIndex: 100 }} />
        <Tooltip id="tooltip-friends" style={{ zIndex: 100 }} />
        <Tooltip id="tooltip-logout" style={{ zIndex: 100 }} />

        {/* Render các modals */}
      </div>
      {profileModalVisible && (
        <ProfileModal
          isVisible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          onOpenEditModal={handleOpenEditModal}
        />
      )}

      {editProfileModalVisible && (
        <EditProfileModal
          isVisible={editProfileModalVisible}
          onClose={() => setEditProfileModalVisible(false)}
          onOpenProfileModal={() => setProfileModalVisible(true)}
        />
      )}
      <ConfimationDialog
        isVisible={isDialogVisible}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn đăng xuất?"
        onConfirm={onConfirmLogout}
        onCancel={onCancelLogout}
        confirmText="Đăng xuất"
        color="red"
      />
    </>
  );
};

export default NavBar;
