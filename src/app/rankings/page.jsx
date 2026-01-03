"use client";
import React, { useState } from 'react';
import { Award, Printer, ArrowLeft, Trophy, User, Star, ThumbsUp, ChartLine } from 'lucide-react';

const RankingPage = () => {
    const employeeRanking = [
        { id: 1, name: "Ahmad Syafiq", position: "Manager IT", nilai: 0.9234 },
        { id: 2, name: "Budi Santoso", position: "Senior Developer", nilai: 0.8912 },
        { id: 3, name: "Citra Dewi", position: "HR Specialist", nilai: 0.8765 },
        { id: 4, name: "Dian Purnama", position: "Finance Manager", nilai: 0.8543 },
        { id: 5, name: "Eko Prasetyo", position: "Marketing Head", nilai: 0.8456 },
        { id: 6, name: "Fitri Andini", position: "Project Manager", nilai: 0.8234 },
        { id: 7, name: "Gilang Ramadhan", position: "UI/UX Designer", nilai: 0.7987 },
        { id: 8, name: "Hana Lestari", position: "Data Analyst", nilai: 0.7821 },
        { id: 9, name: "Indra Kurniawan", position: "System Admin", nilai: 0.7654 },
        { id: 10, name: "Joko Widodo", position: "Operations Head", nilai: 0.7432 },
        { id: 11, name: "Kartika Sari", position: "Content Writer", nilai: 0.7210 },
        { id: 12, name: "Lukman Hakim", position: "Network Engineer", nilai: 0.6987 },
        { id: 13, name: "Maya Indah", position: "Recruiter", nilai: 0.6789 },
        { id: 14, name: "Nina Pertiwi", position: "Accountant", nilai: 0.6543 },
        { id: 15, name: "Oki Setiawan", position: "Sales Executive", nilai: 0.6321 },
        { id: 16, name: "Putri Ayu", position: "Customer Service", nilai: 0.6123 },
        { id: 17, name: "Rizki Maulana", position: "Quality Assurance", nilai: 0.5876 },
        { id: 18, name: "Sari Dewi", position: "Office Manager", nilai: 0.5678 },
        { id: 19, name: "Tono Wijaya", position: "Logistics Staff", nilai: 0.5432 },
        { id: 20, name: "Umi Kulsum", position: "Administrative Staff", nilai: 0.5210 },
        { id: 21, name: "Vina Melinda", position: "Social Media Specialist", nilai: 0.4987 },
        { id: 22, name: "Wahyu Pratama", position: "Technical Support", nilai: 0.4765 },
        { id: 23, name: "Yuni Astuti", position: "Procurement Staff", nilai: 0.4321 },
        { id: 24, name: "Zaky Firdaus", position: "IT Support", nilai: 0.4123 }
    ];
    const sortedData = employeeRanking.sort((a, b) => b.nilai - a.nilai);

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        alert('Navigasi kembali ke halaman sebelumnya');
    };
    function getCategory(nilai) {
        if (nilai >= 0.85) {
            return {
                name: "Pegawai Terbaik",
                color: "bg-amber-100 text-amber-800 border-amber-300",
                icon: <Trophy size={20} />
            };
        } else if (nilai >= 0.70) {
            return {
                name: "Sangat Baik",
                color: "bg-emerald-100 text-emerald-800 border-emerald-300",
                icon: <Star size={20} />
            };
        } else if (nilai >= 0.55) {
            return {
                name: "Baik",
                color: "bg-blue-100 text-blue-800 border-blue-300",
                icon: <ThumbsUp size={20} />
            };
        } else {
            return {
                name: "Perlu Evaluasi",
                color: "bg-rose-100 text-rose-800 border-rose-300",
                icon: <ChartLine size={20} />
            };
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <Award className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Hasil Perankingan</h1>
                                <p className="text-gray-600 mt-1">Sistem Pendukung Keputusan</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                            >
                                <Printer className="w-4 h-4" />
                                Cetak Hasil
                            </button>
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
                <div class="container mx-auto px-4 py-8 max-w-6xl">
                    {/* Header */}
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                    <i class="fas fa-trophy text-amber-500 mr-3"></i>
                                    Hasil Perankingan Pegawai Terbaik
                                </h1>
                                <p class="text-gray-600">
                                    Periode Penilaian: Januari - Desember 2024
                                </p>
                            </div>
                            <div class="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg">
                                <i class="fas fa-calendar-alt text-blue-500"></i>
                                <div>
                                    <p class="text-sm text-gray-600">Tanggal Pengumuman</p>
                                    <p class="font-semibold text-blue-700">15 Maret 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Statistik */}
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 no-print">
                        <div class="bg-white rounded-xl shadow p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-gray-500 text-sm font-medium">Total Pegawai</p>
                                    <p class="text-2xl font-bold text-gray-800 mt-1">24</p>
                                </div>
                                <div class="bg-blue-100 p-3 rounded-full">
                                    <i class="fas fa-users text-blue-500 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-gray-500 text-sm font-medium">Pegawai Terbaik</p>
                                    <p class="text-2xl font-bold text-amber-600 mt-1">5</p>
                                </div>
                                <div class="bg-amber-100 p-3 rounded-full">
                                    <i class="fas fa-star text-amber-500 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-gray-500 text-sm font-medium">Sangat Baik</p>
                                    <p class="text-2xl font-bold text-emerald-600 mt-1">8</p>
                                </div>
                                <div class="bg-emerald-100 p-3 rounded-full">
                                    <i class="fas fa-thumbs-up text-emerald-500 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-gray-500 text-sm font-medium">Perlu Evaluasi</p>
                                    <p class="text-2xl font-bold text-rose-600 mt-1">3</p>
                                </div>
                                <div class="bg-rose-100 p-3 rounded-full">
                                    <i class="fas fa-chart-line text-rose-500 text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Ranking */}
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                        <div class="px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h2 class="text-xl font-bold text-gray-800">Daftar Ranking Pegawai</h2>
                                <p class="text-gray-600 text-sm mt-1">Diurutkan berdasarkan nilai preferensi tertinggi</p>
                            </div>
                            <div class="mt-3 md:mt-0">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    <i class="fas fa-info-circle mr-2"></i>
                                    <span id="date-range"></span>
                                </span>
                            </div>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                                            Peringkat
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Nama Pegawai
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                                            Nilai Preferensi
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-48">
                                            Kategori Penilaian
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200" id="ranking-table">
                                    {/* Data ranking akan diisi oleh JavaScript */}
                                    {sortedData.map((alt, index) => (
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="flex items-center">
                                                    {(index + 1) <= 3 ? <div class={`flex items-center justify-center w-10 h-10 rounded-full ${(index + 1) === 1 ? 'bg-amber-500' : (index + 1) === 2 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                                                        <span class="text-white font-bold">{(index + 1)}</span>
                                                    </div> : <span class="text-lg font-medium ${(index + 1) <= 10 ? 'text-blue-600' : 'text-gray-700'}">{(index + 1)}</span> }
                                                    {(index + 1) === 1 ? <span class="ml-3 px-3 py-1 text-xs font-bold bg-amber-500 text-white rounded-full">Pegawai Terbaik</span> : ''}
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="flex items-center">
                                                    <div class={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full ${(index + 1) === 1 ? 'bg-amber-100' : 'bg-blue-100'}`}>
                                                        <div class={`${(index + 1) === 1 ? 'text-amber-600' : 'fas fa-user text-blue-500'}`}>
                                                            <User size={25} />
                                                        </div>
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="text-sm font-semibold text-gray-900">{alt.name}</div>
                                                        <div class="text-sm text-gray-500">{alt.position}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class={`text-lg font-bold ${(index + 1) === 1 ? 'text-amber-600' : (index + 1) <= 5 ? 'text-blue-600' : 'text-gray-700'}`}>
                                                    {alt.nilai}
                                                </div>
                                                <div class="text-xs text-gray-500 mt-1">
                                                    {(index + 1) === 1 ? 'Nilai Tertinggi' : `#${(index + 1)} dari ${sortedData.length}`}
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getCategory(alt.nilai).color}`}>
                                                    <div className="mr-2">
                                                        {getCategory(alt.nilai).icon}
                                                    </div>
                                                    {getCategory(alt.nilai).name}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Legenda Kategori */}
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Kategori Penilaian</h3>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="flex items-center p-3 rounded-lg border border-amber-200 bg-amber-50">
                                <div class="w-3 h-3 rounded-full bg-amber-500 mr-3"></div>
                                <div>
                                    <p class="font-medium text-amber-800">Pegawai Terbaik</p>
                                    <p class="text-sm text-amber-600">Nilai ≥ 0.8500</p>
                                </div>
                            </div>

                            <div class="flex items-center p-3 rounded-lg border border-emerald-200 bg-emerald-50">
                                <div class="w-3 h-3 rounded-full bg-emerald-500 mr-3"></div>
                                <div>
                                    <p class="font-medium text-emerald-800">Sangat Baik</p>
                                    <p class="text-sm text-emerald-600">Nilai 0.7000 - 0.8499</p>
                                </div>
                            </div>

                            <div class="flex items-center p-3 rounded-lg border border-blue-200 bg-blue-50">
                                <div class="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                                <div>
                                    <p class="font-medium text-blue-800">Baik</p>
                                    <p class="text-sm text-blue-600">Nilai 0.5500 - 0.6999</p>
                                </div>
                            </div>

                            <div class="flex items-center p-3 rounded-lg border border-rose-200 bg-rose-50">
                                <div class="w-3 h-3 rounded-full bg-rose-500 mr-3"></div>
                                <div>
                                    <p class="font-medium text-rose-800">Perlu Evaluasi</p>
                                    <p class="text-sm text-rose-600">Nilai &t; 0.5500</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Tombol Aksi */}
                    <div class="flex flex-col sm:flex-row justify-center gap-4 no-print">
                        <button id="print-btn" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2">
                            <i class="fas fa-print"></i>
                            Cetak Hasil
                        </button>
                        <button id="export-btn" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2">
                            <i class="fas fa-file-export"></i>
                            Ekspor Data
                        </button>
                        <button id="back-btn" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2">
                            <i class="fas fa-arrow-left"></i>
                            Kembali ke Dashboard
                        </button>
                    </div>

                    {/* Footer */}
                    <div class="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
                        <p>© 2025 Departemen Sumber Daya Manusia. Hasil perankingan ini dihitung menggunakan metode SPK (TOPSIS).</p>
                        <p class="mt-1">Hasil ini merupakan keputusan akhir dan tidak menampilkan proses perhitungan.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RankingPage;