"use client";
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Award, FileText, Calculator, Settings, Database } from 'lucide-react';

export default function Dashboard() {
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [stats, setStats] = useState([]);


  const chartData = alternatives.map(alt => ({
    name: alt?.employees.name,
    nilai: parseFloat(alt.total_value).toFixed(2),
  }));


  async function getDashbord() {
    try {
      const res = await fetch("/api/dashboard", { method: "GET" });
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
        const bestRanking = resJson.assessments?.find(a => a.ranking === 1);
        setAlternatives(resJson.assessments ?? []);
        setStats([
          {
            title: 'Total Employees',
            value: resJson.total_employees ?? '',
            change: '+12%',
            changeType: 'positive',
            icon: Target,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
          },
          {
            title: 'Kriteria Aktif',
            value: resJson.total_criterias ?? '',
            change: '+3 baru',
            changeType: 'positive',
            icon: TrendingUp,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
          },
          {
            title: 'Ranking Tertinggi',
            value: bestRanking?.employees.name ?? '',
            change: Number(bestRanking?.total_value).toFixed(2) ?? '',
            changeType: 'neutral',
            icon: Award,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
          },
        ])
      }
    } catch (err) {
      console.error(err);
    }
  }

  const quickMenuItems = [
    { icon: Calculator, label: 'Hitung TOPSIS', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: Database, label: 'Data Master', color: 'bg-emerald-600 hover:bg-emerald-700' },
    { icon: Settings, label: 'Pengaturan', color: 'bg-gray-600 hover:bg-gray-700' },
  ];

  useEffect(() => {
    getDashbord();
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Decision Support System</h1>
          <p className="text-gray-600">Dashboard Metode TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${stat.changeType === 'positive'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Hasil Perhitungan TOPSIS</h2>
              <p className="text-sm text-gray-600 mt-1">Peringkat berdasarkan nilai preferensi</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alternatif
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nilai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ranking
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {alternatives.map((alt) => (
                    <tr
                      key={alt.id}
                      onClick={() => setSelectedAlternative(alt.id)}
                      className={`transition-colors cursor-pointer ${selectedAlternative === alt.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{alt.employees.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${parseFloat(alt.total_value).toFixed(2) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {parseFloat(alt.total_value).toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${alt.ranking === 1
                              ? 'bg-yellow-100 text-yellow-700'
                              : alt.ranking === 2
                                ? 'bg-gray-200 text-gray-700'
                                : alt.ranking === 3
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {alt.ranking}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Visualisasi Nilai Preferensi</h2>
              <p className="text-sm text-gray-600 mt-1">Perbandingan nilai antar alternatif</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} domain={[0, 1]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="nilai" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* History Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Riwayat Perhitungan
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Terakhir diperbarui: 16 Desember 2025, 14:30 WIB
                </p>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Lihat Detail →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Cepat</h3>
            <div className="flex flex-wrap gap-3">
              {quickMenuItems.map((item, index) => (
                <button
                  key={index}
                  className={`${item.color} text-white px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 transition-all hover:shadow-md transform hover:-translate-y-0.5`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};