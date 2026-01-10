"use client";
import React, { useState } from 'react';
import {  Settings as SettingsIcon, User, Shield, Bell, Globe, Palette, Save, Key, Info, Moon, Sun, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const Settings = () => {
  // State untuk Pengaturan Akun
  const [accountData, setAccountData] = useState({
    fullName: 'Ahmad Rizki',
    username: 'ahmad.rizki',
    email: 'ahmad.rizki@example.com'
  });

  // State untuk Keamanan
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // State untuk Preferensi Sistem
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'id',
    notifications: true,
    autoSave: false
  });

  // Data Informasi Sistem
  const systemInfo = {
    version: 'v2.1.0',
    spkMethod: 'TOPSIS & AHP',
    lastUpdate: '15 Desember 2023',
    developedBy: 'Tim SPK'
  };

  // Handler untuk Pengaturan Akun
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler untuk Keamanan
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset error saat user mulai mengetik
    if (passwordError) setPasswordError('');
  };

  // Handler untuk Ubah Password
  const handleChangePassword = (e) => {
    e.preventDefault();
    
    // Validasi
    if (!securityData.currentPassword) {
      setPasswordError('Password lama wajib diisi');
      return;
    }
    
    if (securityData.newPassword.length < 6) {
      setPasswordError('Password baru minimal 6 karakter');
      return;
    }
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok');
      return;
    }
    
    // Simulasi berhasil
    alert('Password berhasil diubah!');
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
  };

  // Handler untuk Simpan Perubahan Akun
  const handleSaveAccount = (e) => {
    e.preventDefault();
    // Simulasi penyimpanan
    alert('Perubahan akun berhasil disimpan!');
  };

  // Handler untuk Toggle
  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Halaman */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <SettingsIcon className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Pengaturan</h1>
          </div>
          <p className="text-gray-600 ml-11">Kelola preferensi akun dan sistem SPK</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri - Pengaturan Akun & Keamanan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section: Pengaturan Akun */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-500 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-800">Pengaturan Akun</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-8">
                  Informasi pribadi dan detail kontak Anda
                </p>
              </div>

              <form onSubmit={handleSaveAccount} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={accountData.fullName}
                      onChange={handleAccountChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={accountData.username}
                      onChange={handleAccountChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                      placeholder="Masukkan username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-2" />
                      <input
                        type="email"
                        name="email"
                        value={accountData.email}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition duration-200"
                  >
                    <Save className="w-5 h-5" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>

            {/* Section: Keamanan */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-gray-500 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-800">Keamanan</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-8">
                  Ubah password dan atur keamanan akun
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Lama
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={securityData.currentPassword}
                        onChange={handleSecurityChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        placeholder="Masukkan password lama"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="newPassword"
                        value={securityData.newPassword}
                        onChange={handleSecurityChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        placeholder="Password minimal 6 karakter"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={securityData.confirmPassword}
                        onChange={handleSecurityChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        placeholder="Konfirmasi password baru"
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <p className="text-red-600 text-sm">{passwordError}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-6 rounded-lg border border-gray-300 transition duration-200"
                  >
                    <Key className="w-5 h-5" />
                    Ubah Password
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Kolom Kanan - Preferensi & Informasi Sistem */}
          <div className="space-y-6">
            {/* Section: Preferensi Sistem */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center">
                  <Palette className="w-5 h-5 text-gray-500 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-800">Preferensi Sistem</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-8">
                  Atur tampilan dan notifikasi
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Tema */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {preferences.theme === 'light' ? (
                      <Sun className="w-5 h-5 text-gray-500 mr-3" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-500 mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">Tema</p>
                      <p className="text-sm text-gray-500">Tampilan sistem</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, theme: 'light' }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition duration-200 ${
                        preferences.theme === 'light'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, theme: 'dark' }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition duration-200 ${
                        preferences.theme === 'dark'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                {/* Bahasa */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Bahasa</p>
                      <p className="text-sm text-gray-500">Bahasa antarmuka</p>
                    </div>
                  </div>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  >
                    <option value="id">Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* Notifikasi */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Notifikasi Sistem</p>
                      <p className="text-sm text-gray-500">Peringatan dan update</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePreference('notifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-200 ${
                      preferences.notifications ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                        preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto Save */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Save className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Auto Save</p>
                      <p className="text-sm text-gray-500">Simpan data otomatis</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePreference('autoSave')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-200 ${
                      preferences.autoSave ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                        preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Section: Informasi Sistem */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-md overflow-hidden border border-indigo-100">
              <div className="border-b border-indigo-100 px-6 py-4">
                <div className="flex items-center">
                  <Info className="w-5 h-5 text-indigo-600 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-800">Informasi Sistem</h2>
                </div>
                <p className="text-sm text-indigo-500 mt-1 ml-8">
                  Detail sistem SPK
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Versi Aplikasi</p>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <p className="font-semibold text-gray-800">{systemInfo.version}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Metode SPK</p>
                  <div className="flex items-center flex-wrap gap-2">
                    {systemInfo.spkMethod.split(' & ').map((method, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Terakhir Update</p>
                  <p className="font-medium text-gray-800">{systemInfo.lastUpdate}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Dikembangkan Oleh</p>
                  <p className="font-medium text-gray-800">{systemInfo.developedBy}</p>
                </div>

                <div className="pt-4 border-t border-indigo-100">
                  <p className="text-sm text-gray-500">
                    Sistem ini membantu pengambilan keputusan menggunakan metode analisis yang terstruktur dan terverifikasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;