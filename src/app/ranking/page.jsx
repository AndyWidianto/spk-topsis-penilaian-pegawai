"use client";
import React, { useState, useMemo } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

export default function EmployeeRanking() {
  const [employees] = useState([
    { name: "Andi Wijaya", score: 0.92 },
    { name: "Budi Santoso", score: 0.87 },
    { name: "Citra Dewi", score: 0.85 },
    { name: "Dedi Kurniawan", score: 0.82 },
    { name: "Eka Pratama", score: 0.78 },
    { name: "Fitri Rahmawati", score: 0.75 },
    { name: "Gina Lestari", score: 0.71 },
    { name: "Hadi Permana", score: 0.68 }
  ]);

  const sortedEmployees = useMemo(() => {
    return [...employees].sort((a, b) => b.score - a.score);
  }, [employees]);

  const getCategory = (score) => {
    if (score >= 0.85) return { text: "Sangat Baik", color: "bg-green-100 text-green-800" };
    if (score >= 0.70) return { text: "Baik", color: "bg-blue-100 text-blue-800" };
    return { text: "Cukup", color: "bg-yellow-100 text-yellow-800" };
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
            {rank}
          </div>
          <Trophy className="text-yellow-500 w-6 h-6" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
            {rank}
          </div>
          <Medal className="text-gray-400 w-5 h-5" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
            {rank}
          </div>
          <Award className="text-orange-500 w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg">
        {rank}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Peringkat Pegawai
          </h1>
          <p className="text-gray-600">
            Evaluasi kinerja berdasarkan nilai akhir tertinggi
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Peringkat</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama Pegawai</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Nilai Akhir</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.map((employee, index) => {
                  const rank = index + 1;
                  const category = getCategory(employee.score);
                  const isTopRank = rank === 1;

                  return (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 transition-all duration-200 hover:bg-gray-50 ${
                        isTopRank ? 'bg-gradient-to-r from-yellow-50 to-amber-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        {getRankBadge(rank)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${isTopRank ? 'text-lg text-yellow-800' : 'text-gray-800'}`}>
                          {employee.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-2xl font-bold ${isTopRank ? 'text-yellow-600' : 'text-gray-700'}`}>
                          {(employee.score * 100).toFixed(0)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">/ 100</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${category.color}`}>
                          {category.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {sortedEmployees.map((employee, index) => {
            const rank = index + 1;
            const category = getCategory(employee.score);
            const isTopRank = rank === 1;

            return (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg p-5 transition-all duration-200 hover:shadow-xl ${
                  isTopRank ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  {getRankBadge(rank)}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.color}`}>
                    {category.text}
                  </span>
                </div>
                <h3 className={`font-bold mb-2 ${isTopRank ? 'text-xl text-yellow-800' : 'text-lg text-gray-800'}`}>
                  {employee.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Nilai Akhir:</span>
                  <span className={`text-3xl font-bold ${isTopRank ? 'text-yellow-600' : 'text-gray-700'}`}>
                    {(employee.score * 100).toFixed(0)}
                    <span className="text-sm text-gray-500 ml-1">/ 100</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Total Pegawai: <span className="font-semibold text-gray-700">{employees.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}