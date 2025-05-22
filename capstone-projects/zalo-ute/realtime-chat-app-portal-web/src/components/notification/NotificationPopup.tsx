import React, { useState } from 'react';
import { BellIcon } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const NotificationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Notification Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex lg:hidden fixed top-4 right-16 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <BellIcon size={24} />
      </button>

      {/* Popup Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Popup Content */}
      <div
        className={`
          fixed right-0 top-0 h-full w-3/5 max-w-md bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <NotificationPanel />
      </div>
    </div>
  );
};

export default NotificationPopup;
