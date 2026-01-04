"use client";
import React, { useEffect, useState } from 'react';
import { Award, Printer, ArrowLeft, Trophy, User, Star, ThumbsUp, ChartLine, Users2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    const [priode, setPriode] = useState(null);
    const [loading, setLoading] = useState(false);
    const sortedData = employeeRanking.sort((a, b) => b.nilai - a.nilai);
    const router = useRouter();
    const totalBestEmployee = priode?.assessments.filter(ats => Number(ats.total_value) > 0.85).length ?? 0;
    const totalVeryGoodEmployee = priode?.assessments.filter(ats => Number(ats.total_value) > 0.70 && Number(ats.total_value) < 0.85).length ?? 0;
    const totalGoodEmployee = priode?.assessments.filter(ats => Number(ats.total_value) > 0.55 && Number(ats.total_value) < 0.70).length ?? 0;
    const totalNeedEvaluation = priode?.assessments.filter(ats => Number(ats.total_value) < 0.55).length ?? 0;
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    async function getPriodeFinished() {
        setLoading(true);
        try {
            const res = await fetch("/api/priodes/last-finished", { method: "GET" });
            if (res.ok) {
                const resJson = await res.json();
                console.log(resJson);
                setPriode(resJson);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    function handlePrint() {
        const container = document.getElementById("container");
        if (container) {
            container.print();
        }
    };
    function handleBack() {
        router.back();
    };
    function getCategory(nilai) {
        nilai = Number(nilai);
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

    useEffect(() => {
        getPriodeFinished();
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="mx-auto">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 p-3 rounded-lg">
                                    <Award className="w-8 h-8 text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                        Hasil Perankingan Pegawai Terbaik Bulan Ini
                                    </h1>
                                    <p className="text-gray-600">
                                        Periode Penilaian: {months[priode?.month - 1]} {priode?.year}
                                    </p>
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
                    {loading ? <div className="flex items-center justify-center w-full h-full"><div className="rounded-full h-11 w-11 border-4 animate-spin border-gray-300 border-t-blue-600"></div></div> : 
                    <div className="" id="container">
                        {/* Informasi Statistik */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 no-print">
                            <div className="bg-white rounded-xl shadow p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Total Pegawai</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{priode?.assessments.length}</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full text-blue-500">
                                        <Users2 size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Pegawai Terbaik</p>
                                        <p className="text-2xl font-bold text-amber-600 mt-1">{totalBestEmployee}</p>
                                    </div>
                                    <div className="bg-amber-100 p-3 rounded-full text-amber-500">
                                        <Trophy size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Sangat Baik</p>
                                        <p className="text-2xl font-bold text-emerald-600 mt-1">{totalVeryGoodEmployee}</p>
                                    </div>
                                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-500">
                                        <ThumbsUp size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Perlu Evaluasi</p>
                                        <p className="text-2xl font-bold text-rose-600 mt-1">{totalNeedEvaluation}</p>
                                    </div>
                                    <div className="bg-rose-100 p-3 rounded-full text-rose-500">
                                        <ChartLine size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabel Ranking */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                            <div className="px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Daftar Ranking Pegawai</h2>
                                    <p className="text-gray-600 text-sm mt-1">Diurutkan berdasarkan nilai preferensi tertinggi</p>
                                </div>
                                <div className="mt-3 md:mt-0">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        <i className="fas fa-info-circle mr-2"></i>
                                        <span id="date-range"></span>
                                    </span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                                                Peringkat
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Nama Pegawai
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                                                Nilai Preferensi
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-48">
                                                Kategori Penilaian
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200" id="ranking-table">
                                        {/* Data ranking akan diisi oleh JavaScript */}
                                        {priode && priode.assessments.map((alt, index) => (
                                            <tr key={alt.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {(index + 1) <= 3 ? <div className={`flex items-center justify-center w-10 h-10 rounded-full ${(index + 1) === 1 ? 'bg-amber-500' : (index + 1) === 2 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                                                            <span className="text-white font-bold">{(index + 1)}</span>
                                                        </div> : <span className={`text-lg font-medium ${(index + 1) <= 10 ? 'text-blue-600' : 'text-gray-700'}`}>{(index + 1)}</span>}
                                                        {(index + 1) === 1 ? <span className="hidden md:block ml-3 px-3 py-1 text-xs font-bold bg-amber-500 text-white rounded-full">Pegawai Terbaik</span> : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full ${(index + 1) === 1 ? 'bg-amber-100' : 'bg-blue-100'}`}>
                                                            <div className={`${(index + 1) === 1 ? 'text-amber-600' : 'fas fa-user text-blue-500'}`}>
                                                                <User size={25} />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-semibold text-gray-900">{alt.employees.name}</div>
                                                            <div className="text-sm text-gray-500">{alt.employees.position}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-lg font-bold ${(index + 1) === 1 ? 'text-amber-600' : (index + 1) <= 5 ? 'text-blue-600' : 'text-gray-700'}`}>
                                                        {Number(alt.total_value).toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {(index + 1) === 1 ? 'Nilai Tertinggi' : `#${(index + 1)} dari ${priode?.assessments.length ?? 0}`}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getCategory(alt.total_value).color}`}>
                                                        <div className="mr-2">
                                                            {getCategory(alt.total_value).icon}
                                                        </div>
                                                        {getCategory(alt.total_value).name}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Legenda Kategori */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Kategori Penilaian</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="flex items-center p-3 rounded-lg border border-amber-200 bg-amber-50">
                                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-3"></div>
                                    <div>
                                        <p className="font-medium text-amber-800">Pegawai Terbaik</p>
                                        <p className="text-sm text-amber-600">Nilai ≥ 0.8500</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 rounded-lg border border-emerald-200 bg-emerald-50">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-3"></div>
                                    <div>
                                        <p className="font-medium text-emerald-800">Sangat Baik</p>
                                        <p className="text-sm text-emerald-600">Nilai 0.7000 - 0.8499</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 rounded-lg border border-blue-200 bg-blue-50">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                                    <div>
                                        <p className="font-medium text-blue-800">Baik</p>
                                        <p className="text-sm text-blue-600">Nilai 0.5500 - 0.6999</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 rounded-lg border border-rose-200 bg-rose-50">
                                    <div className="w-3 h-3 rounded-full bg-rose-500 mr-3"></div>
                                    <div>
                                        <p className="font-medium text-rose-800">Perlu Evaluasi</p>
                                        <p className="text-sm text-rose-600">Nilai {'<'} 0.5500</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Tombol Aksi */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 no-print">
                            <button id="export-btn" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2">
                                <i className="fas fa-file-export"></i>
                                Ekspor Data
                            </button>
                            <Link href="/dashboard" className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2">
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>}

                    {/* Footer */}
                    <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
                        <p>© 2025 Departemen Sumber Daya Manusia. Hasil perankingan ini dihitung menggunakan metode SPK (TOPSIS).</p>
                        <p className="mt-1">Hasil ini merupakan keputusan akhir dan tidak menampilkan proses perhitungan.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RankingPage;