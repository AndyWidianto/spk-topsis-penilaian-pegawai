"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Search, Calendar, User, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addAssessment } from '@/lib/features/assessmentSlice';

export default function AssessmentForm() {
  const [formData, setFormData] = useState({
    employee_id: '',
    total_value: 0,
    priode_id: '',
    ranking: 1
  });
  const [employees, setEmployees] = useState([]);
  const [priodes, setPriodes] = useState([]);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenPriode, setIsDropdownOpenPriode] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // use ref
  const refPriode = useRef(null);

  //dispatch
  const dispatch = useDispatch();


  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.nip.includes(searchQuery)
  );

  const months = [
    {
      value: 1,
      label: "January"
    },
    {
      value: 2,
      label: "February"
    },
    {
      value: 3,
      label: "March",
    },
    {
      value: 4,
      label: "April"
    },
    {
      value: 5,
      label: "May"
    },
    {
      value: 6,
      label: "June"
    },
    {
      value: 7,
      label: "July"
    },
    {
      value: 8,
      label: "August"
    },
    {
      value: 9,
      label: "September"
    },
    {
      value: 10,
      label: "October"
    },
    {
      value: 11,
      label: "November"
    },
    {
      value: 12,
      label: "December"
    }
  ];

  const selectedEmployee = employees.find(emp => emp.id === formData.employee_id);
  const selectedPriode = priodes.find(p => p.id === formData.priode_id);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id) {
      newErrors.employee_id = 'Karyawan harus dipilih';
    }

    if (!formData.priode_id) {
      newErrors.priode_id = 'Periode penilaian harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (!validateForm()) return;
    try {
      const res = await fetch("/api/assessments", { method: "POST", body: JSON.stringify(formData) });
      if (res.ok) {
        const resJson = await res.json();
        dispatch(addAssessment(resJson));
        setSubmitted(true);
        console.log('Form submitted:', formData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const getEmployees = async () => {
    try {
      const res = await fetch("/api/employees", { method: "GET" });
      const resJson = await res.json();
      console.log(resJson);
      setEmployees(resJson);
    } catch (err) {
      console.error(err);
    }
  }

  const getPriodes = async () => {
    try {
      const res = await fetch("/api/priodes", { method: "GET" });
      const resJson = await res.json();
      console.log(resJson);
      setPriodes(resJson);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDropdownOpenPriode(false);
    setIsDropdownOpen(false);
    if (errors.employee) {
      setErrors({ ...errors, employee: '' });
    }
    if (errors.priode_id) {
      setErrors({ ...errors, priode_id: '' });
    }
    console.log(formData);
  }

  const handleClick = (e) => {
    if (refPriode.current && !refPriode.current.contains(e.target)) {
      setIsDropdownOpenPriode(false);
    }
  }

  useEffect(() => {
    getEmployees();
    getPriodes();
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Form Penilaian Karyawan
          </h1>
          <p className="text-slate-600">
            Sistem Pendukung Keputusan - Evaluasi Kinerja
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium">
              Penilaian berhasil disimpan!
            </p>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="space-y-6">

            {/* Employee Dropdown */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Karyawan <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-left flex items-center justify-between transition-all ${errors.employee
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-slate-200 hover:border-slate-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-400" />
                    <span className={selectedEmployee ? 'text-slate-800' : 'text-slate-400'}>
                      {selectedEmployee
                        ? `${selectedEmployee.name} - NIP: ${selectedEmployee.nip}`
                        : 'Pilih karyawan...'}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-xl">
                    {/* Search Input */}
                    <div className="p-3 border-b border-slate-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Cari nama atau NIP..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    {/* Employee List */}
                    <div className="max-h-64 overflow-y-auto">
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((emp) => (
                          <button
                            key={emp.id}
                            type="button"
                            onClick={() => handleSelect("employee_id", emp.id)}
                            className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${formData.employee === emp.id ? 'bg-blue-50' : ''
                              }`}
                          >
                            <div className="font-medium text-slate-800">{emp.name}</div>
                            <div className="text-sm text-slate-500">NIP: {emp.nip}</div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-slate-500">
                          Tidak ada karyawan ditemukan
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {errors.employee && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="font-medium">⚠</span> {errors.employee}
                </p>
              )}
            </div>

            {/* Total Value */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Total Nilai
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.total_value}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-800 font-semibold text-lg cursor-not-allowed"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">
                  / 100
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Nilai total dihitung otomatis dari sistem
              </p>
            </div>

            {/* Periode */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Periode Penilaian <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={refPriode}>
                <button type="button" onClick={() => setIsDropdownOpenPriode(!isDropdownOpenPriode)} className='flex items-center gap-2 w-full p-3 rounded-md border-2 border-slate-200'>
                  <Calendar size={20} />
                  {formData.priode_id ? `${months.find(m => m.value === selectedPriode.month).label}-${selectedPriode.year}` : 'Select Priode'}
                </button>
                {isDropdownOpenPriode && <div className="absolute w-full p-1 top-[60px] overflow-scroll scroll-hidden rounded-md bg-white border-2 border-slate-200 max-h-[150px]">
                  <ul>
                    {priodes.map(priode => (
                      <li key={priode.id}>
                        <button type="button" onClick={() => handleSelect("priode_id", priode.id)} className='text-start p-2 w-full'>{months.find(m => m.value === priode.month).label}-{priode.year}</button>
                      </li>
                    ))}
                  </ul>
                </div>}
              </div>

              {errors.periode && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="font-medium">⚠</span> {errors.periode}
                </p>
              )}
            </div>

          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 active:scale-95"
            >
              Simpan Penilaian
            </button>
          </div>
        </form>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Pastikan semua data telah terisi dengan benar sebelum menyimpan</p>
        </div>
      </div>
    </div>
  );
};