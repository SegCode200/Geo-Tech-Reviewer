import { FaSearch, FaBell, FaUser, FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';

const Header = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const userName = "Gilbert Obaseki";
  const userRole = "Senior Reviewer";

  return (
    <header className="gov-header sticky top-0 z-30 flex justify-between items-center flex-wrap gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-4">
      {/* Left Section - Welcome Message */}
      <div className="flex-1 min-w-0">
        <div>
          <h1 className="text-base sm:text-2xl font-bold truncate">Welcome Back</h1>
          <p className="text-xs sm:text-sm opacity-90 truncate hidden sm:block">{userName} • {userRole}</p>
          <p className="text-xs sm:text-sm opacity-90 truncate sm:hidden">{userName.split(' ')[0]}</p>
        </div>
      </div>

      {/* Middle Section - Search Bar (Hidden on mobile) */}
      <div className="hidden md:block flex-1 max-w-md mx-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search applications..."
            className="w-full pl-4 pr-10 py-2 rounded-gov bg-secondary/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white border border-secondary/30 text-sm"
          />
          <FaSearch className="absolute right-3 top-2.5 text-white/60" />
        </div>
      </div>

      {/* Right Section - Notifications and Profile */}
      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        {/* Notifications */}
        <div className="relative hidden sm:block">
          <button className="relative p-2 hover:bg-secondary rounded-gov transition-colors">
            <FaBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-1 sm:space-x-2 hover:bg-secondary px-2 sm:px-3 py-1 sm:py-2 rounded-gov transition-colors"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
              <FaUser className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">{userName.split(' ')[0]}</span>
            <FaChevronDown className="w-3 h-3 hidden sm:inline" />
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white text-gov-text rounded-gov shadow-gov-lg border border-gov-border z-50">
              <div className="p-3 sm:p-4 border-b border-gov-border">
                <p className="font-semibold text-sm">{userName}</p>
                <p className="text-xs text-gov-text-light">{userRole}</p>
              </div>
              <a href="/profile" className="block px-3 sm:px-4 py-2 text-sm hover:bg-gov-light transition-colors">Profile</a>
              <a href="/settings" className="block px-3 sm:px-4 py-2 text-sm hover:bg-gov-light transition-colors">Settings</a>
              <a href="/help" className="block px-3 sm:px-4 py-2 text-sm hover:bg-gov-light transition-colors">Help & Support</a>
              <button className="w-full text-left px-3 sm:px-4 py-2 text-sm text-accent hover:bg-gov-light transition-colors border-t border-gov-border">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;