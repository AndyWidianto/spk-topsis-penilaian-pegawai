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
import { fetchWithAuth, JWTDecode } from '@/lib/fetcher';
import { setPriodes } from '@/lib/features/priodeSlice';
import { setCriterias } from '@/lib/features/criteriaSlice';

// Komponen utama
const TOPSISCalculator = () => {
  // State untuk data contoh
  const [normalization, setNormalization] = useState([]);
  const [distances, setDistances] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [bestValue, setBestValue] = useState(null);
  const [worstValue, setWorstValue] = useState(null);
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
  const [assessments, setAssessments] = useState([]);
  const [user, setUser] = useState(null);
  const priodes = useSelector((state) => state.priode.priodes);
  const criterias = useSelector((state) => state.criteria.criterias);
  const dispatch = useDispatch();

  const roleValidation = user && user?.role === "super_admin" || user?.role === "admin";
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function handleSelectPriode(e) {
    const id = e.target.value;
    const findPriode = priodes.find(p => p.id === Number(id));
    if (findPriode) {
      setNormalization([]);
      setBestValue(null);
      setWorstValue(null);
      setPreferences([]);
      setDistances(distances);
      setPriode(findPriode);
    }
  }
  async function getPriodes() {
    const date = new Date();
    if (!priode && priodes.length > 0) {
      const priodeNow = priodes.find(r => (r.month - 1) === date.getMonth());
      return setPriode(priodeNow)
    }
    if (priodes.length > 0) return;
    const res = await fetch("/api/priodes", { method: "GET" });
    if (res.ok) {
      const resJson = await res.json();
      const priodeNow = resJson.find(r => (r.month - 1) === date.getMonth());
      setPriode(priodeNow);
      dispatch(setPriodes(resJson));
    }
  }
  async function getCriterias() {
    if (criterias.length > 0) return;
    const res = await fetch("/api/criterias", { method: "GET" });
    if (res.ok) {
      const resJson = await res.json();
      console.log(criterias);
      dispatch(setCriterias(resJson));
    }
  }
  async function getPriode() {
    if (!priode) return;
    try {
      const res = await fetch(`/api/priodes/${priode.id}`, { method: "GET" });
      if (res.ok) {
        const resJson = await res.json();
        setAssessments(resJson.assessments);
      }
    } catch (err) {
      console.error(err);
    }
  }
  // Fungsi hitung ulang
  async function handleRecount() {
    // Logika perhitungan ulang TOPSIS dapat ditambahkan di sini
    setLoading(true);
    try {
      const data = { priode_id: priode ? priode.id : null };
      const res = await fetchWithAuth(`/api/calculate-employee-scores`, { method: "POST", body: JSON.stringify(data) });
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  // Fungsi toggle section
  function toggleSection(section) {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  async function calculateTopsis() {
    if (!priode || priode?.status !== "finished") return;
    if (assessments.length < 1 && criterias.length < 1) return;
    const bValue = {};
    const wValue = {};
    const normalisasi = [];
    const sumKuadrat = {};
    const distances = [];
    const NilaiPreferences = [];
    const totalWeight = criterias.reduce((acc, curr) => acc + curr.weight, 0);
    criterias.forEach(c => {
      assessments.forEach(ats => {
        ats.assessment_details.map(ads => {
          if (ads.criteria_id === c.id) {
            sumKuadrat[c.id] = (sumKuadrat[c.id] || 0) + ads.nilai ** 2;
          }
        });
      });
    });
    assessments.forEach(ats => {
      const matrik = ats.assessment_details.map(ads => {
        const criteria = criterias.find(c => c.id === ads.criteria_id);
        if (criteria) {
          const nilaiMatrikR = ads.nilai / Math.sqrt(sumKuadrat[criteria.id]);
          const nilaiMatrikY = nilaiMatrikR * (criteria.weight / totalWeight);
          if (criteria.type === "benefit") {
            bValue[criteria.id] = Math.max(bValue[criteria.id] ?? nilaiMatrikY, nilaiMatrikY);
            wValue[criteria.id] = Math.min(wValue[criteria.id] ?? nilaiMatrikY, nilaiMatrikY);
          } else {
            bValue[criteria.id] = Math.min(bValue[criteria.id] ?? nilaiMatrikY, nilaiMatrikY);
            wValue[criteria.id] = Math.max(wValue[criteria.id] ?? nilaiMatrikY, nilaiMatrikY);
          }
          ads.nilai_r = nilaiMatrikR;
          ads.nilai_y = nilaiMatrikY;
        }
        return { ...ads };
      });
      normalisasi.push({ id: ats.id, name: ats.employees.name, matrik: matrik });
    });
    normalisasi.forEach(n => {
      let distancePositif = 0;
      let distanceNegatif = 0;
      n.matrik.map(m => {
        distancePositif = distancePositif + (m.nilai_y - bValue[m.criteria_id]) ** 2;
        distanceNegatif = distanceNegatif + (m.nilai_y - wValue[m.criteria_id]) ** 2;
      });
      const nilaiV = distanceNegatif / (distancePositif + distanceNegatif);
      distances.push({ id: n.id, name: n.name, distance_positif: distancePositif, distance_negatif: distanceNegatif });
      NilaiPreferences.push({ id: n.id, name: n.name, distance_positif: distancePositif, distance_negatif: distanceNegatif, nilai_v: nilaiV });
    });

    setNormalization(normalisasi);
    setBestValue(bValue);
    setWorstValue(wValue);
    setPreferences(NilaiPreferences.sort((a, b) => b.nilai_v - a.nilai_v));
    setDistances(distances);
  }
  async function firstRender() {
    setLoading(true);
    try {
      await getPriodes();
      await getCriterias();
      await getPriode();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function getUser() {
    try {
      const res = await JWTDecode();
      if (res) {
        setUser(res);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    firstRender();
  }, [priode]);
  useEffect(() => {
    calculateTopsis();
  }, [assessments]);
  useEffect(() => {
    getUser();
    document.documentElement.classList.toggle("no-scroll", loading);
    return () => document.documentElement.classList.remove("no-scroll");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {loading && <div className="flex items-center justify-center fixed bg-black/60 h-full w-[calc(100%-270px)] left-[270px]">
        <div className='h-10 w-10 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin'></div>
      </div>}
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
          {roleValidation && <button onClick={handleRecount} className="p-2 px-5 rounded-md bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all mb-6">
            Recount
          </button>}
          <select name="priode" id="priode" onChange={handleSelectPriode} className="p-3 px-5 rounded-md border-gray-400 shadow-md transition-all mb-6">
            <option value="">Select Priode</option>
            {priodes && priodes.map(p => (
              <option value={p.id} key={p.id}>{months[p.month - 1]} {p.year}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-6">
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
                  {assessments.length} alternatif
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Alternatif</th>
                      {criterias.map(c => (
                        <th key={c.id} className="p-3 text-center">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map(ats => (
                      <tr key={ats.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{ats.employees.name}</td>
                        {criterias.map(c => (
                          <td key={c.id} className="p-3 text-center">
                            {ats.assessment_details.find(detail => detail.criteria_id === c.id)?.nilai}
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
                {criterias.map((c) => (
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
                        {(c.weight / criterias.reduce((sum, c) => sum + c.weight, 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Bobot</span>
                    <span className="font-bold text-blue-700">
                      {criterias.reduce((sum, c) => sum + (c.weight / criterias.reduce((sum, c) => sum + c.weight, 0)), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Proses Perhitungan */}
          {priode && priode.status === "finished" ? <div className="lg:col-span-2 space-y-6">
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
                      {criterias.map(c => (
                        <th key={c.id} className="p-3 text-center">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((alt) => (
                      <tr key={alt.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{alt.employees.name}</td>
                        {criterias.map((c) => (
                          <td key={c.id} className="p-3 text-center">
                            {alt.assessment_details.find(detail => detail.criteria_id === c.id)?.nilai}
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
                      {criterias.map(c => (
                        <th key={c.id} className="p-3 text-center">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {normalization.map((n) => (
                      <tr key={n.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{n.name}</td>
                        {criterias.map((c) => (
                          <td key={c.id} className="p-3 text-center">
                            {n.matrik.find(detail => detail.criteria_id === c.id)?.nilai_r.toFixed(4)}
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
                      {criterias.map(c => (
                        <th key={c.id} className="p-3 text-center">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {normalization.map((n) => (
                      <tr key={n.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{n.name}</td>
                        {criterias.map((c) => (
                          <td key={c.id} className="p-3 text-center">
                            {n.matrik.find(detail => detail.criteria_id === c.id)?.nilai_y.toFixed(4)}
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
                    {bestValue && criterias.map((c, index) => (
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
                    {worstValue && criterias.map((c, index) => (
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
                          {dts.distance_positif.toFixed(4)}
                        </td>
                        <td className="p-3 text-center font-medium">
                          {dts.distance_negatif.toFixed(4)}
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
                          {pfs.distance_positif.toFixed(4)}
                        </td>
                        <td className="p-3 text-center">
                          {pfs.distance_negatif.toFixed(4)}
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
                {assessments.map((item, index) => (
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
                        <h3 className="font-bold text-lg">{item.employees.name}</h3>
                        <p className="text-sm text-gray-500">
                          Nilai Preferensi: <span className="font-semibold">{Number(item.total_value).toFixed(4)}</span>
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
          </div> : <div className="text-center">Pada priode ini belum di latih</div>}
        </div>
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