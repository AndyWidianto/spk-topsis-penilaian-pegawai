"use client";
import React, { useEffect, useState } from 'react';
import {
  Calculator,
  Award,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Table as TableIcon,
  TrendingUp,
  CheckCircle,
  Info
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWithAuth } from '@/lib/fetcher';
import { setPriodes } from '@/lib/features/priodeSlice';

// Komponen utama
const TOPSISCalculator = () => {
  // State untuk data contoh
  const [alternatives, setAlternatives] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [normalization, setNormalization] = useState([]);
  const [distances, setDistances] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [bestValue, setBestValue] = useState({});
  const [worstValue, setWorstValue] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    decisionMatrix: true,
    normalization: false,
    weightedMatrix: false,
    idealSolution: false,
    distances: false,
    preferences: true
  });
  const [loading, setLoading] = useState(false);
  const [priode, setPriode] = useState(null);
  const priodes = useSelector((state) => state.priode.priodes);
  const dispatch = useDispatch();

  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getPriodes = async () => {
    let nowPriode = null;
    try {
      if (priodes.length > 0) {
        nowPriode = priodes[0];
        return setPriode(priodes[0])
      };
      const res = await fetch("/api/priodes", { method: "GET" });
      if (res.ok) {
        const resJson = await res.json();
        setPriode(resJson[0]);
        dispatch(setPriodes(resJson));
        nowPriode = resJson[0];
      }
    } catch (err) {
      console.error(err);
    } finally {
        const dataStorage = localStorage.getItem(`priode-${nowPriode.id}`);
        const data = JSON.parse(dataStorage);
        setAlternatives(data.alternatives ?? []);
        setCriteria(data.criterias ?? []);
        setNormalization(data.matrix_normalization ?? []);
        setDistances(data.distances ?? []);
        setPreferences(data.preferences ?? []);
        setBestValue(data.best_value ?? []);
        setWorstValue(data.worst_value ?? []);
    }
  }
  // Fungsi hitung ulang
  const handleRecount = async () => {
    // Logika perhitungan ulang TOPSIS dapat ditambahkan di sini
    setLoading(true);
    try {
      const data = { priode_id: priode ? priode.id : null };
      const res = await fetchWithAuth(`/api/calculate-employee-scores`, { method: "POST", body: JSON.stringify(data) });
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
        localStorage.setItem(`priode-${priode.id}`, JSON.stringify(resJson.data));
        setAlternatives(resJson.data.alternatives);
        setCriteria(resJson.data.criterias);
        setDistances(resJson.distances);
        setPreferences(resJson.data.preferences);
        setNormalization(resJson.data.matrix_normalization);
        setBestValue(resJson.data.best_value);
        setWorstValue(resJson.data.worst_value);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  // Fungsi toggle section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    getPriodes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-10">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Perhitungan TOPSIS <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">{priode ? `${months[priode.month - 1]} ${priode.year}` : ''}</span>
            </h1>
          </div>
          <p className="text-gray-600">
            Sistem Pendukung Keputusan menggunakan metode TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleRecount} className="p-2 px-5 rounded-md bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all mb-6">
            Menghitung Ulang
          </button>
          <select name="priode" id="priode" className="p-3 px-5 rounded-md border-gray-400 shadow-md transition-all mb-6">
            <option value="">Select Priode</option>
            {priodes && priodes.map(p => (
              <option defaultValue={p.id} key={p.id} selected={p.id === priode.id}>{months[p.month - 1]} {p.year}</option>
            ))}
          </select>
        </div>
        {priode && priode.status === "finished" ? <div className="grid grid-cols-1 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Data Alternatif */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TableIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Data Alternatif
                  </h2>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {alternatives.length} alternatif
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Alternatif</th>
                      {criteria.map(c => (
                        <th key={c.id} className="p-3 text-center">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {alternatives.map(alt => (
                      <tr key={alt.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{alt.name}</td>
                        {criteria.map(c => (
                          <td key={c.id} className="p-3 text-center">
                            {alt.detail.find(detail => detail.criteria_id === c.id)?.nilai}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kriteria dan Bobot */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Kriteria & Bobot
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {criteria.map((c, index) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{c.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({c.id})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${c.type === 'benefit'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {c.type === 'benefit' ? 'Benefit' : 'Cost'}
                      </span>
                      <span className="font-bold text-blue-700">
                        {c.weight.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Bobot</span>
                    <span className="font-bold text-blue-700">
                      {criteria.reduce((sum, c) => sum + c.weight, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Proses Perhitungan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proses 1: Matriks Keputusan */}
            <SectionCard
              title="1. Matriks Keputusan (X)"
              description="Matriks awal berisi nilai setiap alternatif pada setiap kriteria."
              isExpanded={expandedSections.decisionMatrix}
              onToggle={() => toggleSection('decisionMatrix')}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Alternatif</th>
                      {criteria.map(c => (
                        <th key={c.id} className="p-3 text-center">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {alternatives.map((alt) => (
                      <tr key={alt.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{alt.name}</td>
                        {criteria.map((c) => (
                          <td key={c.id} className="p-3 text-center">
                            {alt.detail.find(detail => detail.criteria_id === c.id)?.nilai}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Proses 2: Normalisasi Matriks */}
            <SectionCard
              title="2. Normalisasi Matriks (R)"
              description="Matriks yang telah dinormalisasi menggunakan metode vektor Euclidean."
              isExpanded={expandedSections.normalization}
              onToggle={() => toggleSection('normalization')}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Alternatif</th>
                      {criteria.map(c => (
                        <th key={c.id} className="p-3 text-center">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {normalization.map((n) => (
                      <tr key={n.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{n.name}</td>
                        {criteria.map((c) => (
                          <td key={c.id} className="p-3 text-center">
                            {n.details.find(detail => detail.criteria_id === c.id)?.total_r.toFixed(4)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Proses 3: Matriks Normalisasi Terbobot */}
            <SectionCard
              title="3. Matriks Normalisasi Terbobot (Y)"
              description="Matriks normalisasi yang telah dikalikan dengan bobot kriteria."
              isExpanded={expandedSections.weightedMatrix}
              onToggle={() => toggleSection('weightedMatrix')}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Alternatif</th>
                      {criteria.map(c => (
                        <th key={c.id} className="p-3 text-center">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {normalization.map((n) => (
                      <tr key={n.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{n.name}</td>
                        {criteria.map((c) => (
                          <td key={c.id} className="p-3 text-center">
                            {n.details.find(detail => detail.criteria_id === c.id)?.total.toFixed(4)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Proses 4: Solusi Ideal */}
            <SectionCard
              title="4. Solusi Ideal Positif (A⁺) dan Negatif (A⁻)"
              description="Menentukan solusi ideal positif dan negatif berdasarkan jenis kriteria."
              isExpanded={expandedSections.idealSolution}
              onToggle={() => toggleSection('idealSolution')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Solusi Ideal Positif (A⁺)
                  </h4>
                  <div className="space-y-2">
                    {criteria.map((c, index) => (
                      <div key={c.id} className="flex justify-between items-center">
                        <span>{c.name}</span>
                        <span className="font-bold">
                          {bestValue[c.id].toFixed(4)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Solusi Ideal Negatif (A⁻)
                  </h4>
                  <div className="space-y-2">
                    {criteria.map((c, index) => (
                      <div key={c.id} className="flex justify-between items-center">
                        <span>{c.name}</span>
                        <span className="font-bold">
                          {worstValue[c.id].toFixed(4)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Proses 5: Jarak ke Solusi Ideal */}
            <SectionCard
              title="5. Jarak ke Solusi Ideal (D⁺ dan D⁻)"
              description="Menghitung jarak Euclidean setiap alternatif terhadap solusi ideal positif dan negatif."
              isExpanded={expandedSections.distances}
              onToggle={() => toggleSection('distances')}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Alternatif</th>
                      <th className="p-3 text-center text-blue-700">D⁺ (Jarak ke A⁺)</th>
                      <th className="p-3 text-center text-red-700">D⁻ (Jarak ke A⁻)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distances.map((dts, index) => (
                      <tr key={dts.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{dts.name}</td>
                        <td className="p-3 text-center font-medium">
                          {dts.distance_plus.toFixed(4)}
                        </td>
                        <td className="p-3 text-center font-medium">
                          {dts.distance_min.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Proses 6: Nilai Preferensi */}
            <SectionCard
              title="6. Nilai Preferensi (V)"
              description="Menghitung nilai preferensi berdasarkan jarak terhadap solusi ideal."
              isExpanded={expandedSections.preferences}
              onToggle={() => toggleSection('preferences')}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Alternatif</th>
                      <th className="p-3 text-center">D⁺</th>
                      <th className="p-3 text-center">D⁻</th>
                      <th className="p-3 text-center font-bold text-green-700">Nilai Preferensi (V)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preferences.map((pfs, index) => (
                      <tr key={pfs.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{pfs.name}</td>
                        <td className="p-3 text-center">
                          {pfs.distance_plus.toFixed(4)}
                        </td>
                        <td className="p-3 text-center">
                          {pfs.distance_min.toFixed(4)}
                        </td>
                        <td className="p-3 text-center font-bold text-green-700 text-lg">
                          {pfs.nilai_v.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Hasil Perankingan */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border-2 border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Hasil Perankingan
                  </h2>
                </div>
                <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                  Rekomendasi Terbaik
                </div>
              </div>

              <div className="space-y-4">
                {preferences.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${item.ranking === 1
                        ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 shadow-md'
                        : 'bg-white hover:shadow'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold
                        ${item.ranking === 1
                          ? 'bg-yellow-500 text-white'
                          : item.ranking === 2
                            ? 'bg-gray-400 text-white'
                            : item.ranking === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-gray-200 text-gray-700'
                        }
                      `}>
                        {item.ranking}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Nilai Preferensi: <span className="font-semibold">{item.nilai_v.toFixed(4)}</span>
                        </p>
                      </div>
                    </div>

                    {item.ranking === 1 && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">REKOMENDASI</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Keterangan Algoritma TOPSIS */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold">Alur Metode TOPSIS</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-medium">1. Normalisasi</div>
                    <p className="text-gray-600">Membuat matriks normalisasi</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <div className="font-medium">2. Pembobotan</div>
                    <p className="text-gray-600">Mengalikan dengan bobot kriteria</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <div className="font-medium">3. Perankingan</div>
                    <p className="text-gray-600">Menghitung jarak dan nilai preferensi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : <><div className="text-center">Pada priode ini belum di latih</div></>}
      </div>
    </div>
  );
};

// Komponen Section Card yang dapat di-expand/collapse
const SectionCard = ({ title, description, children, isExpanded, onToggle }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              {title.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-200 rounded-lg">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t pt-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default TOPSISCalculator;