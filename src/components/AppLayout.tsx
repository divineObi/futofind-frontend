import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { IconContext, type IconType } from 'react-icons';
import { FiGrid, FiFileText, FiSearch, FiLogOut, FiMenu, FiBell, FiShield } from 'react-icons/fi';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, notifications, unreadCount, markAsRead } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // --- All handler functions remain the same ---
  const handleBellClick = () => {
    setNotificationOpen(prev => !prev);
    if (!isNotificationOpen && unreadCount > 0) {
      markAsRead();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // --- DEFINE THE NAVIGATION ARRAY (NO CHANGE HERE) ---
  let navItems: { name: string; path: string; Icon: IconType }[] = [
    { name: 'Dashboard', path: '/dashboard', Icon: FiGrid },
    { name: 'My Reports', path: '/my-reports', Icon: FiFileText },
    { name: 'Search Items', path: '/search', Icon: FiSearch },
  ];

  if (user && user.role === 'admin') {
      navItems.unshift({ name: 'Admin Panel', path: '/admin/claims', Icon: FiShield });
  }

  // --- START THE RETURN STATEMENT ---
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* --- START MOBILE SIDEBAR (WITH BRUTE-FORCE FIX) --- */}
      {isSidebarOpen && (<div className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>)}
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-md w-64 p-4 transform transition-transform duration-300 z-30 lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-4">
            <img src={logo} alt="FutoFind" className="h-10 w-auto" />
            <button onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-gray-800 p-2">
             X
            </button>
          </div>
          <nav className="flex-grow">
              {/* WE ARE WRITING THE MAP FUNCTION DIRECTLY HERE */}
              {navItems.map((item) => {
                  const { Icon } = item; // De-structure here
                  return (
                      <NavLink key={item.name} to={item.path} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center p-3 my-2 rounded-lg transition-colors ${isActive ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
                          <IconContext.Provider value={{ className: "h-5 w-5 mr-3" }}>
                              <Icon />
                          </IconContext.Provider>
                          {item.name}
                      </NavLink>
                  );
              })}
          </nav>
      </aside>
      
      {/* --- START DESKTOP SIDEBAR (WITH BRUTE-FORCE FIX) --- */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white shadow-md flex-shrink-0">
        <div className="p-4 border-b"><img src={logo} alt="FutoFind" className="h-12 w-auto" /></div>
        <div className="p-4"><h3 className="text-sm font-semibold text-gray-500 uppercase">Welcome</h3><p className="text-lg font-bold text-gray-800 truncate">{user?.name}</p></div>
        <nav className="flex-grow p-4">
            {/* WE ARE REPEATING THE MAP FUNCTION DIRECTLY HERE */}
            {navItems.map((item) => {
                const { Icon } = item; // De-structure here
                return (
                    <NavLink key={item.name} to={item.path} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center p-3 my-2 rounded-lg transition-colors ${isActive ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
                        <IconContext.Provider value={{ className: "h-5 w-5 mr-3" }}>
                            <Icon />
                        </IconContext.Provider>
                        {item.name}
                    </NavLink>
                );
            })}
        </nav>
        <div className="p-4 border-t"><button onClick={handleLogout} className="w-full flex items-center p-3 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><IconContext.Provider value={{ className: "h-5 w-5 mr-3" }}><FiLogOut /></IconContext.Provider>Logout</button></div>
      </aside>
      
      {/* The main content area and header remain exactly the same as the working version */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm flex items-center justify-between p-4 z-20">
            <div className="lg:hidden">
                <button onClick={() => setSidebarOpen(true)} className="text-gray-700"><FiMenu size={24} /></button>
            </div>
            <div className="hidden lg:block w-8"></div>
            <div className="flex items-center space-x-4" ref={notificationRef}>
                <div className="relative">
                    <button onClick={handleBellClick} className="relative text-gray-600 hover:text-teal-600">
                        {unreadCount > 0 && (<span className="absolute -top-1 -right-1 h-3 w-3 flex items-center justify-center text-[9px] text-white bg-red-500 rounded-full border-2 border-white"></span>)}
                        <IconContext.Provider value={{ className: "h-6 w-6" }}><FiBell /></IconContext.Provider>
                    </button>
                    {isNotificationOpen && ( <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-xl border overflow-hidden animate-fade-in-down">{/* ... dropdown content ... */}</div>)}
                </div>
            </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;