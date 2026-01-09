"use client";
import { useState, useEffect } from 'react';
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
  Moon
} from 'lucide-react';
import { useSelector } from "react-redux";
import Link from 'next/link';


export default function Header({ sidebarActive, actionSidebar, handleLogout, user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [query, setQuery] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const sidebars = useSelector((state) => state.sidebar.sidebars);
  const filteredSidebars = sidebars.filter(sb => sb.name.toLowerCase().includes(query ? query.toLowerCase() : ''));

  // Notifikasi simulasi
  const notifications = [
    { id: 1, message: "Pesanan baru diterima", time: "5 menit lalu", read: false },
    { id: 2, message: "Pembaruan sistem selesai", time: "1 jam lalu", read: true },
    { id: 3, message: "Laporan bulanan siap", time: "2 hari lalu", read: true },
  ];
  function handleChange(e) {
    const value = e.target.value;
    if (!value.trim()) return setQuery(null);
    setQuery(value);
  }
  const unreadCount = notifications.filter(n => !n.read).length;

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
                onClick={() => setIsProfileOpen(false)}
              >
                <Bell size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Notifikasi */}
              <div className={`absolute right-0 mt-2 w-80 origin-top-right rounded-md shadow-lg py-1 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} hidden group-hover:block`}>
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
                          <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{notification.message}</p>
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
            <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <HelpCircle size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            </button>

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
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.username}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
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
                    <p className="text-xs text-gray-500 truncate">{user.role}</p>
                  </div>
                  <a href="#" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <User size={16} className="inline mr-2" /> Profil Saya
                  </a>
                  <a href="#" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <Settings size={16} className="inline mr-2" /> Pengaturan
                  </a>
                  <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                  <button onClick={() => handleLogout()} className={`block px-4 py-2 w-full h-full text-start text-sm ${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className={`md:hidden pb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col space-y-3 mt-2">
              <a href="#" className={`font-medium px-3 py-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Overview</a>
              <a href="#" className={`font-medium px-3 py-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Analytics</a>
              <a href="#" className={`font-medium px-3 py-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Reports</a>
              <a href="#" className={`font-medium px-3 py-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Settings</a>

              {/* Pencarian Mobile */}
              <div className="px-3 pt-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}