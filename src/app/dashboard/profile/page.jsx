"use client";
import React, { useEffect, useState } from 'react';
import {
  UserCircle,
  Mail,
  User,
  CalendarDays,
  CheckCircle,
  Edit,
  Key,
  BarChart3,
  Calculator,
  Shield,
  Activity,
  Clock
} from 'lucide-react';
import { fetchWithAuth } from '@/lib/fetcher';

/*stack
- edit profile
- ubah password
*/
export default function Profile() {
  // Data dummy user
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  async function getProfile() {
    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/profile", { method: "GET" });
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
        setUser(resJson);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  // Fungsi untuk badge role
  function getRoleBadge(role) {
    const roleColors = {
      admin: "bg-red-100 text-red-800 border-red-300",
      user: "bg-blue-100 text-blue-800 border-blue-300",
      super_admin: "bg-green-100 text-green-800 border-green-300"
    };

    const colorClass = roleColors[role] || roleColors.user;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
        {role === "super_admin" ? "Manager" : role === "admin" ? "Admin" : "User"}
      </span>
    );
  };
  function formatIsoTime(isoString) {
    const now = new Date();
    const date = new Date(isoString);

    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // kurang dari 24 jam → jam
    if (diffHours < 24) {
      return `${diffHours} jam yang lalu`;
    }

    // 1–30 hari → hari
    if (diffDays <= 30) {
      return `${diffDays} hari yang lalu`;
    }

    // lebih dari 30 hari → tanggal bulan tahun
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }


  useEffect(() => {
    getProfile();
  }, [])


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Halaman */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Profile Pengguna</h1>
          <p className="text-gray-600 mt-2">Kelola informasi profil dan statistik akun Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri - Header Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Avatar & Info Dasar */}
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  {/* <img 
                    src={user?.avatar} 
                    alt={`${user?.username} avatar`}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  /> */}
                  <div className="flex items-center justify-center w-32 h-32 rounded-full border-4 border-white shadow-lg text-2xl text-blue-600 font-semibold bg-blue-200">
                    {user?.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mt-4">{user?.username}</h2>
                <div className="mt-2">
                  {getRoleBadge(user?.role)}
                </div>
                <div className="flex items-center justify-center mt-3 text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>{user?.email}</span>
                </div>
              </div>

              {/* Statistik Singkat */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Statistik Aktivitas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Data Diinput</p>
                        <p className="text-xl font-bold text-gray-800">{user?.total_input}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Calculator className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Perhitungan SPK</p>
                        <p className="text-xl font-bold text-gray-800">{user?.total_calculate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aksi */}
              {/* <div className="mt-8 space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition duration-200">
                  <Key className="w-5 h-5" />
                  Ganti Password
                </button>
              </div> */}
            </div>
          </div>

          {/* Kolom Kanan - Informasi Detail */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Informasi Detail Pengguna</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card: Informasi Akun */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <UserCircle className="w-5 h-5 mr-2 text-gray-500" />
                    Informasi Akun
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Username</label>
                      <p className="mt-1 text-gray-800 font-medium">{user?.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-gray-800 font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Role</label>
                      <div className="mt-1">
                        {getRoleBadge(user?.role)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card: Status Akun */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-gray-500" />
                    Status Akun
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Tanggal Bergabung</label>
                      <div className="flex items-center mt-1">
                        <CalendarDays className="w-5 h-5 text-gray-400 mr-2" />
                        <p className="text-gray-800 font-medium">{formatIsoTime(user?.createdAt)}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Status Akun</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user?.active
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                          }`}>
                          {user?.active ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              active
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                              inactive
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Level Akses</label>
                      <p className="mt-1 text-gray-800 font-medium flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-gray-400" />
                        Full Access
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tambahan: Deskripsi Sistem */}
              <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Tentang Sistem Pendukung Keputusan</h4>
                <p className="text-gray-600">
                  {user?.role === "super_admin" ? <>
                  Sistem ini membantu Anda dalam proses pengambilan keputusan dengan metode analisis yang terstruktur. 
                  Sebagai <span className="font-medium">Manager</span>, Anda memiliki akses penuh untuk mengelola seluruh data sistem, termasuk pengguna, 
                  karyawan, kriteria, dan assessment, melakukan perhitungan, serta melihat hasil analisis secara menyeluruh.</> :
                  user?.role === "admin" ? <>Sistem ini membantu Anda dalam proses pengambilan keputusan dengan metode analisis yang terstruktur. 
                  Sebagai <span className="font-medium">Admin</span>, Anda memiliki akses untuk mengelola data karyawan, kriteria, dan assessment, melakukan perhitungan, serta melihat 
                  hasil analisis, namun tidak memiliki akses untuk mengelola data pengguna.</> : <>
                  Sistem ini membantu Anda dalam proses pengambilan keputusan dengan metode analisis yang terstruktur. 
                  Sebagai <span className="font-medium">User</span>, Anda memiliki akses untuk melihat data, proses penilaian, dan hasil analisis tanpa dapat 
                  melakukan penambahan, perubahan, atau penghapusan data.
                  </>}
                </p>
              </div>

              {/* Tambahan: Last Activity */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-gray-500" />
                  Aktivitas Terakhir
                </h4>
                <div className="space-y-3">
                  {user?.notifications.map(notif => (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg" key={notif.id}>
                      <div className="ml-4">
                        <p className="font-medium text-gray-800">{notif.message}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatIsoTime(notif.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
