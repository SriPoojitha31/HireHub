import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaBars,
  FaBell,
  FaBriefcase,
  FaBuilding,
  FaChevronDown,
  FaCog,
  FaHome,
  FaPlus,
  FaRocket,
  FaSearch,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaUserTie
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, api, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifRef = useRef();

  useEffect(() => {
    if (user) fetchNotifications();
    // eslint-disable-next-line
  }, [user]);

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const res = await api.get("/users/notifications");
      setNotifications(res.data.notifications || []);
    } catch (e) {
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (notifId) => {
    try {
      await api.put(`/users/notifications/${notifId}/read`);
      setNotifications(notifications.map(n => n._id === notifId ? { ...n, read: true } : n));
    } catch (e) {
      toast.error("Failed to mark as read");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotifOpen]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <FaBriefcase className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              HireHub
            </span>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link 
              to="/" 
              className="group flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:bg-blue-50"
            >
              <FaHome className="group-hover:scale-110 transition-transform" />
              Home
            </Link>
            <Link 
              to="/jobs" 
              className="group flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:bg-blue-50"
            >
              <FaSearch className="group-hover:scale-110 transition-transform" />
              Find Jobs
            </Link>
            
            {user ? (
              <>
                {user.role === "employer" && (
                  <Link 
                    to="/post-job" 
                    className="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaPlus className="group-hover:scale-110 transition-transform" />
                    Post Job
                  </Link>
                )}
                
                {/* Enhanced User Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={toggleProfile}
                    className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-gray-700">{user.name}</span>
                    <FaChevronDown className={`text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Enhanced Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 py-2 z-50 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600 capitalize flex items-center gap-2">
                              {user.role === 'employer' ? <FaBuilding /> : <FaUserTie />}
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsProfileOpen(false)}
                          className="group flex items-center gap-3 px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaHome className="text-blue-600 text-sm" />
                          </div>
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        
                        <Link 
                          to="/profile" 
                          onClick={() => setIsProfileOpen(false)}
                          className="group flex items-center gap-3 px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaUser className="text-purple-600 text-sm" />
                          </div>
                          <span className="font-medium">Profile</span>
                        </Link>
                        
                        {user.role === "jobseeker" && (
                          <Link 
                            to="/applied-jobs" 
                            onClick={() => setIsProfileOpen(false)}
                            className="group flex items-center gap-3 px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                          >
                            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <FaBriefcase className="text-emerald-600 text-sm" />
                            </div>
                            <span className="font-medium">Applied Jobs</span>
                          </Link>
                        )}
                        
                        {user.role === "employer" && (
                          <Link 
                            to="/employer-dashboard" 
                            onClick={() => setIsProfileOpen(false)}
                            className="group flex items-center gap-3 px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <FaBuilding className="text-orange-600 text-sm" />
                            </div>
                            <span className="font-medium">Employer Dashboard</span>
                          </Link>
                        )}
                        
                        <div className="border-t border-gray-200 my-2"></div>
                        
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsProfileOpen(false);
                          }}
                          className="group flex items-center gap-3 px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 w-full"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaSignOutAlt className="text-red-600 text-sm" />
                          </div>
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {user && (
              <div className="relative mr-2">
                <button
                  className="relative p-3 rounded-full hover:bg-blue-50 transition-colors"
                  onClick={() => setIsNotifOpen((v) => !v)}
                  aria-label="Notifications"
                >
                  <FaBell className="text-blue-600 text-lg" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {isNotifOpen && (
                  <div ref={notifRef} className="absolute right-0 mt-2 w-96 max-w-xs bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 py-2 z-50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-lg">Notifications</span>
                      <button onClick={fetchNotifications} className="text-blue-500 text-xs font-semibold hover:underline">Refresh</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                      {notifLoading ? (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                      ) : notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">No notifications</div>
                      ) : notifications.map((notif) => (
                        <div key={notif._id} className={`flex items-start gap-3 px-6 py-4 ${notif.read ? "bg-white" : "bg-blue-50"}`}>
                          <div className="mt-1">
                            <FaBell className={`text-lg ${notif.read ? "text-gray-300" : "text-blue-500"}`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-gray-800 text-sm font-medium">{notif.message}</div>
                            <div className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</div>
                          </div>
                          {!notif.read && (
                            <button
                              className="ml-2 text-xs text-blue-600 hover:underline"
                              onClick={() => handleMarkRead(notif._id)}
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="w-12 h-12 bg-gradient-to-r from-gray-100 to-blue-100 hover:from-blue-100 hover:to-indigo-100 rounded-2xl flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 backdrop-blur-xl border-t border-gray-200/50">
              <Link 
                to="/" 
                className="group flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl text-base font-semibold transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaHome className="text-blue-600 text-sm" />
                </div>
                Home
              </Link>
              
              <Link 
                to="/jobs" 
                className="group flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl text-base font-semibold transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaSearch className="text-emerald-600 text-sm" />
                </div>
                Find Jobs
              </Link>
              
              {user ? (
                <>
                  {user.role === "employer" && (
                    <Link 
                      to="/post-job" 
                      className="group flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl text-base font-semibold transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaPlus className="text-purple-600 text-sm" />
                      </div>
                      Post Job
                    </Link>
                  )}
                  
                  {/* User Info in Mobile */}
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 my-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to="/dashboard" 
                    className="group flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl text-base font-semibold transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaUser className="text-blue-600 text-sm" />
                    </div>
                    Dashboard
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className="group flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl text-base font-semibold transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaCog className="text-purple-600 text-sm" />
                    </div>
                    Profile
                  </Link>
                  
                  {user.role === "jobseeker" && (
                    <Link 
                      to="/applied-jobs" 
                      className="group flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl text-base font-semibold transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaBriefcase className="text-emerald-600 text-sm" />
                      </div>
                      Applied Jobs
                    </Link>
                  )}
                  
                  {user.role === "employer" && (
                    <Link 
                      to="/employer-dashboard" 
                      className="group flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl text-base font-semibold transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaBuilding className="text-orange-600 text-sm" />
                      </div>
                      Employer Dashboard
                    </Link>
                  )}
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="group flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl text-base font-semibold transition-all duration-200 w-full"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaSignOutAlt className="text-red-600 text-sm" />
                    </div>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="group flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl text-base font-semibold transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaUser className="text-blue-600 text-sm" />
                    </div>
                    Login
                  </Link>
                  
                  <Link 
                    to="/register" 
                    className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaRocket className="text-white text-sm" />
                    </div>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
