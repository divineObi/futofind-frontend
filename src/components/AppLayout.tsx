import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Logo.png';
import { IconContext } from 'react-icons';
import { FiGrid, FiFileText, FiSearch, FiLogOut, FiMenu, FiX, FiBell, FiShield } from 'react-icons/fi';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  // --- Get notification data from our upgraded context ---
  const { user, logout, notifications, unreadCount, markAsRead } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // --- State for the notification dropdown visibility ---
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null); // Ref for closing dropdown on outside click

  // --- Logic to handle opening/closing and marking as read ---
  const handleBellClick = () => {
    setNotificationOpen(prev => !prev);
    // If we are opening the panel and there are unread items, mark them as read
    if (!isNotificationOpen && unreadCount > 0) {
      markAsRead();
    }
  };

  // --- Logic to close dropdown when clicking outside of it ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  let navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'My Reports', path: '/my-reports', icon: FiFileText },
    { name: 'Search Items', path: '/search', icon: FiSearch },
  ];

  if (user && user.role === 'admin') {
      navItems.unshift({ name: 'Admin Panel', path: '/admin/claims', icon: FiShield });
  }

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <NavLink key={item.name} to={item.path} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center p-3 my-2 rounded-lg transition-colors ${isActive ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
          <IconContext.Provider value={{ className: "h-5 w-5 mr-3" }}><item.icon /></IconContext.Provider>
          {item.name}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile Sidebar (no changes needed) */}
      {isSidebarOpen && (<div className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>)}
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-md w-64 p-4 transform transition-transform duration-300 z-30 lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-4"><img src={logo} alt="FutoFind" className="h-10 w-auto" /><button onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-gray-800"><FiX size={24}/></button></div>
          <nav className="flex-grow"><NavLinks /></nav>
      </aside>
      
      {/* Desktop Sidebar (no changes needed) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white shadow-md flex-shrink-0">
        <div className="p-4 border-b"><img src={logo} alt="FutoFind" className="h-12 w-auto" /></div>
        <div className="p-4"><h3 className="text-sm font-semibold text-gray-500 uppercase">Welcome</h3><p className="text-lg font-bold text-gray-800 truncate">{user?.name}</p></div>
        <nav className="flex-grow p-4"><NavLinks/></nav>
        <div className="p-4 border-t"><button onClick={handleLogout} className="w-full flex items-center p-3 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><IconContext.Provider value={{ className: "h-5 w-5 mr-3" }}><FiLogOut /></IconContext.Provider>Logout</button></div>
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* --- START: UPDATED HEADER --- */}
        <header className="bg-white shadow-sm flex items-center justify-between p-4 z-20"> {/* Increased z-index */}
          {/* Left side: Hamburger menu for mobile */}
          <div className="lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
                <FiMenu size={24} />
            </button>
          </div>
          <div className="hidden lg:block w-8"></div> {/* Placeholder */}

          {/* Right side: Notifications and User Profile */}
          <div className="flex items-center space-x-4">
            {/* --- THIS IS THE FULLY FUNCTIONAL NOTIFICATION BELL --- */}
            <div className="relative" ref={notificationRef}>
                <button onClick={handleBellClick} className="relative text-gray-600 hover:text-teal-600">
                    {/* The red dot indicator for unread notifications */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 flex items-center justify-center text-[9px] text-white bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                    <IconContext.Provider value={{ className: "h-6 w-6" }}>
                        <FiBell />
                    </IconContext.Provider>
                </button>

                {/* --- THIS IS THE NOTIFICATION DROPDOWN PANEL --- */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-xl border overflow-hidden animate-fade-in-down">
                      <div className="p-3 font-bold text-gray-800 border-b">Notifications</div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <Link 
                                to={n.link || '#'}
                                key={n._id}
                                onClick={() => setNotificationOpen(false)}
                                className={`block p-3 border-b last:border-b-0 transition-colors ${!n.isRead ? 'bg-teal-50 hover:bg-teal-100' : 'hover:bg-gray-100'}`}
                            >
                              <p className="text-sm text-gray-700">{n.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(n.createdAt).toLocaleString()}
                              </p>
                            </Link>
                          ))
                        ) : (
                          <p className="p-4 text-sm text-gray-500 text-center">You have no new notifications.</p>
                        )}
                      </div>
                      <div className="p-2 bg-gray-50 text-center">
                          <Link to="/my-reports" onClick={() => setNotificationOpen(false)} className="text-sm font-medium text-teal-600 hover:underline">
                            View All Activity
                          </Link>
                      </div>
                  </div>
                )}
            </div>
            {/* Can add a user profile dropdown here in the future */}
          </div>
        </header>
        {/* --- END: UPDATED HEADER --- */}

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto"> {/* Changed overflow to overflow-y-auto */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;