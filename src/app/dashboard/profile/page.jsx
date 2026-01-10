import React from 'react';
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

const Profile = () => {
  // Data dummy user
  const user = {
    fullName: "Ahmad Rizki",
    username: "ahmad.rizki",
    email: "ahmad.rizki@example.com",
    role: "Admin",
    joinDate: "15 Maret 2023",
    status: "Aktif",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad",
    stats: {
      dataInput: 42,
      spkCalculations: 18
    }
  };

  // Fungsi untuk badge role
  const getRoleBadge = (role) => {
    const roleColors = {
      Admin: "bg-red-100 text-red-800 border-red-300",
      User: "bg-blue-100 text-blue-800 border-blue-300",
      Manager: "bg-green-100 text-green-800 border-green-300"
    };
    
    const colorClass = roleColors[role] || roleColors.User;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
        {role}
      </span>
    );
  };

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
                  <img 
                    src={user.avatar} 
                    alt={`${user.fullName} avatar`}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="absolute bottom-2 right-2">
                    <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mt-4">{user.fullName}</h2>
                <div className="mt-2">
                  {getRoleBadge(user.role)}
                </div>
                <div className="flex items-center justify-center mt-3 text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>{user.email}</span>
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
                        <p className="text-xl font-bold text-gray-800">{user.stats.dataInput}</p>
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
                        <p className="text-xl font-bold text-gray-800">{user.stats.spkCalculations}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aksi */}
              <div className="mt-8 space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition duration-200">
                  <Key className="w-5 h-5" />
                  Ganti Password
                </button>
              </div>
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
                      <p className="mt-1 text-gray-800 font-medium">{user.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-gray-800 font-medium">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Role</label>
                      <div className="mt-1">
                        {getRoleBadge(user.role)}
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
                        <p className="text-gray-800 font-medium">{user.joinDate}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Status Akun</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'Aktif' 
                            ? 'bg-green-100 text-green-800 border border-green-300' 
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {user.status === 'Aktif' ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              {user.status}
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                              {user.status}
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
                  Sistem ini membantu Anda dalam proses pengambilan keputusan dengan metode analisis yang terstruktur. 
                  Sebagai <span className="font-medium">{user.role}</span>, Anda memiliki akses untuk mengelola data, 
                  melakukan perhitungan, dan melihat hasil analisis.
                </p>
              </div>

              {/* Tambahan: Last Activity */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-gray-500" />
                  Aktivitas Terakhir
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Calculator className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">Perhitungan SPK Metode AHP</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        2 jam yang lalu
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <BarChart3 className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">Input Data Alternatif</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Kemarin, 14:30
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;