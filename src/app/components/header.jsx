"use client";
import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Search,
  Menu,
  X,
  User,
  Settings,
  HelpCircle,
  ChevronDown,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import { useSelector } from "react-redux";
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/fetcher';


export default function Header({ sidebarActive, actionSidebar, handleLogout, user }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [query, setQuery] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [size, setSize] = useState(800);
  const sidebars = useSelector((state) => state.sidebar.sidebars);
  const filteredSidebars = sidebars.filter(sb => sb.name.toLowerCase().includes(query ? query.toLowerCase() : ''));
  const [notifications, setNotifications] = useState([]);

  const dropdownHelpRef = useRef(null);

  function handleChange(e) {
    const value = e.target.value;
    if (!value.trim()) return setQuery(null);
    setQuery(value);
  }
  const unreadCount = notifications.filter(n => !n.read).length;
  function handleResize() {
    setSize(window.innerWidth);
  }
  async function getNotifications() {
    try {
      const res = await fetchWithAuth("/api/notifications?limit=4");
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
        setNotifications(resJson);
      }
    } catch (err) {
      console.error(err);
    }
  }
    const handleClickOutside = (event) => {
      if (dropdownHelpRef.current && !dropdownHelpRef.current.contains(event.target)) {
        setIsHelpOpen(false);
      }
    };
  useEffect(() => {
    getNotifications();
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  // Get access level info based on role
  const getAccessInfo = (role) => {
    const accessMap = {
      'super_admin': { level: 'Full Access', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
      'admin': { level: 'Manage Data', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
      'user': { level: 'Read Only', bgColor: 'bg-gray-100', textColor: 'text-gray-700' }
    };
    return accessMap[role] || accessMap['user'];
  };

  const accessInfo = getAccessInfo(user?.role);
  return (
    <header className={`fixed top-0 z-40 transition-all duration-200 ${sidebarActive ? window.innerWidth > 800 ? 'w-[calc(100%-280px)] left-[280px]' : 'w-full left-0' : 'w-full left-0'} border-b ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="pl-2 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo dan Menu Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => actionSidebar()}
              className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {sidebarActive ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Search Bar dan Menu Kanan */}
          <div className="flex items-center space-x-4">

            {/* Pencarian */}
            {size < 500 && <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
              <Search size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <input
                type="text"
                placeholder="Cari..."
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {query && <div className="absolute left-0 top-11 rounded-md shadow-sm border w-full text-start bg-white z-50">
                <ul>
                  {filteredSidebars.length > 0 ? filteredSidebars.map((item) => (
                    item.type === "group" ? item.url.map((link, index) => (
                      user && user.role === "super_admin" || user.role === "admin" ? <li key={index}>
                        <Link href={link.url} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">{link.name}</Link>
                      </li> : link.type === "public" && <li key={index}>
                        <Link href={link.url} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">{link.name}</Link>
                      </li>
                    )) : <li key={item.id}>
                      <Link href={item.url} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">{item.name}</Link>
                    </li>
                  )) : (
                    <li className="px-4 py-2 text-gray-500">Tidak ada hasil</li>
                  )}
                </ul>
              </div>}
            </div>

            {/* Toggle Dark Mode */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifikasi */}
            <div className="relative">
              <button
                className={`p-2 rounded-full relative ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Notifikasi */}
              <div className={`absolute right-0 mt-2 w-80 origin-top-right rounded-md shadow-lg py-1 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} ${isNotificationOpen ? 'block' : 'hidden'} group-hover:block`}>
                <div className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifikasi</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 ${!notification.read ? (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50') : ''} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-start">
                        <div className="ml-3">
                          <p className={`flex gap-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {`${notification.users.username} ${notification.message}`}
                            <span className={`block rounded-full ${notification.type === "success" ? 'bg-green-200 text-green-600' : 'bg-gray-200 text-gray-600'}`}>{notification.type}</span>
                          </p>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="ml-auto">
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`px-4 py-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <a href="#" className={`text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                    Lihat semua notifikasi
                  </a>
                </div>
              </div>
            </div>

            {/* Bantuan */}
            <div className="relative" ref={dropdownHelpRef}>
              <button onClick={() => setIsHelpOpen(!isHelpOpen)} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <HelpCircle size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              </button>
              {isHelpOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50">
                  <div className="p-5">
                    {/* Header Section */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="">
                        <div className="w-full flex items-center gap-2">
                          <div className="bg-blue-100 rounded-lg flex items-center justify-center p-2">
                            <Info className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Tentang Sistem
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Sistem Pendukung Keputusan ini dirancang untuk membantu Anda dalam menganalisis data dan membuat keputusan yang lebih baik berdasarkan informasi yang tersedia.
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-4"></div>

                    {/* Access Rights Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Hak Akses Anda
                      </h4>

                      <div className="space-y-2">
                        {/* User Role */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Role:</span>
                          <span className="text-sm font-medium text-gray-900">{user?.role === "super_admin" ? "Manager" : user?.role === "admin" ? "Admin" : "User"}</span>
                        </div>

                        {/* Access Level Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tingkat Akses:</span>
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${accessInfo.bgColor} ${accessInfo.textColor}`}>
                            {accessInfo.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profil User */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center">
                  {/* <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-8 w-8 rounded-full border-2 border-blue-500"
                  /> */}
                  <div className="flex items-center justify-center bg-blue-300 text-white h-8 w-8 rounded-full border-2 border-blue-500 font-semibold">
                    {user.username.split('')[0].toUpperCase()}
                  </div>
                  <div className="hidden md:block ml-3 text-left">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.role === "super_admin" ? "Manager" : user.role === "admin" ? "Admin" : "User"}</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform ${isProfileOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  />
                </div>
              </button>

              {/* Dropdown Profil */}
              {isProfileOpen && (
                <div className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg py-1 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.role === "super_admin" ? "Manager" : user.role === "admin" ? "Admin" : "User"}</p>
                  </div>
                  <Link href="/dashboard/profile" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <User size={16} className="inline mr-2" /> Profil Saya
                  </Link>
                  <Link href="/dashboard/settings" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <Settings size={16} className="inline mr-2" /> Pengaturan
                  </Link>
                  <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                  <button onClick={() => handleLogout()} className={`block px-4 py-2 w-full h-full text-start text-sm ${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}