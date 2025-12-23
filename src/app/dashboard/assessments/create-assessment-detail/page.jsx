"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Search, Calendar, User, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addAssessment } from '@/lib/features/assessmentSlice';

export default function AssessmentDetailForm() {
    const [formData, setFormData] = useState({
        assessment_id: '',
        criteria_id: '',
        nilai: ''
    });
    const [assessments, setAssessments] = useState([]);
    const [criterias, setCriterias] = useState([]);
    const [errors, setErrors] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOpenCriteria, setIsDropdownOpenCriteria] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // use ref
    const refCriteria = useRef(null);
    const dispatch = useDispatch();

    const selectedCriteria = criterias.find(c => c.id === formData.criteria_id);
    const selectedAssessments = assessments.find(emp => emp.id === formData.assessment_id);
    const months = [{ value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March", }, { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" }, { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" }, { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.assessment_id) {
            newErrors.assessment_id = 'Karyawan harus dipilih';
        }

        if (!formData.criteria_id) {
            newErrors.criteria_id = 'Periode penilaian harus diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const getAssessments = async () => {
        try {
            const res = await fetch("/api/assessments", { method: "GET" });
            if (res.ok) {
                const resJson = await res.json();
                console.log(resJson);
                setAssessments(resJson);
            }
        } catch (err) {
            console.error(err);
        }
    }
    const handleSelect = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDropdownOpenCriteria(false);
        setIsDropdownOpen(false);
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === "nilai") {
            const nilai = parseInt(value);
            if (nilai > 100 || nilai < 0) {
                return setErrors({ ...errors, nilai: 'nilai tidak boleh lebih dari 100 atau kurang dari 0' })
            }
        }
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    }
    const handleClick = (e) => {
        if (refCriteria.current && !refCriteria.current.contains(e.target)) {
            setIsDropdownOpenCriteria(false);
        }
    }
    const getCriterias = async () => {
        try {
            const res = await fetch("/api/criterias", { method: "GET" });
            const resJson = await res.json();
            console.log(resJson);
            setCriterias(resJson);
        } catch (err) {
            console.error(err);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const res = await fetch("/api/assessment-details", { method: "POST", body: JSON.stringify(formData) });
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

    useEffect(() => {
        getAssessments();
        getCriterias();
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Form Assessment Detail
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
                            Detail penilaian berhasil disimpan!
                        </p>
                    </div>
                )}

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <div className="space-y-6">

                        {/* Assessment Dropdown */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Assessment <span className="text-red-500">*</span>
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
                                        <span className={selectedAssessments ? 'text-slate-800' : 'text-slate-400'}>
                                            {selectedAssessments
                                                ? `${selectedAssessments.employees.name} - Priode: ${months.find(m => m.value === selectedAssessments.priodes.month)?.label} - ${selectedAssessments.priodes.year}`
                                                : 'Pilih assessment...'}
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
                                            {assessments.length > 0 ? (
                                                assessments.map((assessment) => (
                                                    <button
                                                        key={assessment.id}
                                                        type="button"
                                                        onClick={() => handleSelect("assessment_id", assessment.id)}
                                                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${formData.assessment_id === assessment.id ? 'bg-blue-50' : ''
                                                            }`}
                                                    >
                                                        <div className="font-medium text-slate-800">{assessment.employees.name}</div>
                                                        <div className="text-sm text-slate-500">Priode: {months.find(m => m.value === assessment.priodes.month)?.label} - {assessment.priodes.year}</div>
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

                            {errors.assessment && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <span className="font-medium">⚠</span> {errors.assessment}
                                </p>
                            )}
                        </div>

                        {/* Criteria */}
                        <div className="relative" ref={refCriteria}>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Criteria <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpenCriteria(!isDropdownOpenCriteria)}
                                    className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-left flex items-center justify-between transition-all ${errors.employee
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-500'
                                        } focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
                                >
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-slate-400" />
                                        <span className={selectedCriteria ? 'text-slate-800' : 'text-slate-400'}>
                                            {selectedCriteria
                                                ? <div className='flex items-center gap-2'>{`${selectedCriteria.code}-${selectedCriteria.name}`}<span className={`block text-xs p-1 px-3 rounded-full ${selectedCriteria.type === "benefit" ? 'bg-green-200' : 'bg-red-200'}`}>{selectedCriteria.type}</span></div>
                                                : 'Pilih Criteria...'}
                                        </span>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpenCriteria ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpenCriteria && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-xl">
                                        {/* Search Input */}
                                        <div className="p-3 border-b border-slate-200">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Cari name and code..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                        </div>

                                        {/* criteria List */}
                                        <div className="max-h-64 overflow-y-auto">
                                            {criterias.length > 0 ? (
                                                criterias.map((criteria) => (
                                                    <button
                                                        key={criteria.id}
                                                        type="button"
                                                        onClick={() => handleSelect("criteria_id", criteria.id)}
                                                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${formData.criteria_id === criteria.id ? 'bg-blue-50' : ''
                                                            }`}
                                                    >
                                                        <div className="font-medium text-slate-800">{criteria.code}-{criteria.name}</div>
                                                        <div className="text-sm text-slate-500">Type: {criteria.type}</div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-8 text-center text-slate-500">
                                                    Tidak ada criteria ditemukan
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {errors.criteria && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <span className="font-medium">⚠</span> {errors.criteria}
                                </p>
                            )}
                        </div>
                        {/* Total Value */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Total Nilai <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.nilai}
                                    onChange={handleChange}
                                    name="nilai"
                                    className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-left flex items-center justify-between transition-all ${errors.nilai
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-500'
                                        } focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">
                                    / 100
                                </div>
                            </div>
                            {errors.nilai && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <span className="font-medium">⚠</span> {errors.nilai}
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