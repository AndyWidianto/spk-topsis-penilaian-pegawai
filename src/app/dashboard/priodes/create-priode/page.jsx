"use client";
import { addAssessmentInPriode } from '@/lib/features/assessmentSlice';
import { Calendar } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

const ModernPeriodForm = () => {
    const [formData, setFormData] = useState({
        month: '',
        year: '',
        status: 'active'
    });
    const [isDropdownOpenMonth, setIsDropdownOpenMonth] = useState(false);
    const [isDropdownOpenYear, setIsDropdownOpenYear] = useState(false);
    const [errors, setErrors] = useState({
        month: false,
        year: false,
        status: false
    });
    const refMonth = useRef(null);
    const refYear = useRef(null);

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
    const dispatch = useDispatch();

    const date = new Date();
    const years = Array.from({ length: 16 }, (_, i) => date.getFullYear() + i); // 2020 to 2035

    const handleSelect = (data) => {
        const { name, value } = data;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
        if (name === "year") {
            setIsDropdownOpenYear(false);
        }
        if (name === "month") {
            setIsDropdownOpenMonth(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {
            month: !formData.month,
            year: !formData.year,
            status: !formData.status
        };
        setErrors(newErrors);

        if (newErrors.month && newErrors.year && newErrors.status) return;
        try {
            const res = await fetch("/api/priodes", { method: "POST", body: JSON.stringify(formData) });
            const resJson = await res.json();
            alert('Form saved successfully!');
            setFormData({ month: '', year: '', status: 'active' });
            dispatch(addAssessmentInPriode(resJson));
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", (e) => {
            if (refMonth.current && !refMonth.current.contains(e.target)) {
                setIsDropdownOpenMonth(false);
            }
            if (refYear.current && !refYear.current.contains(e.target)) {
                setIsDropdownOpenYear(false);
            }
        })
    }, []);
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl p-6 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Form Penilaian Karyawan
                    </h1>
                    <p className="text-slate-600">
                        Sistem Pendukung Keputusan - Evaluasi Kinerja
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Month Field */}
                        <div className='pt-3'>
                            <div className="text-sm font-medium text-slate-700">Month*</div>
                            <div className="relative z-10" ref={refMonth}>
                                <button type="button" onClick={() => setIsDropdownOpenMonth(!isDropdownOpenMonth)} className={`flex items-center gap-2 w-full p-3 text-gray-500 rounded-md border hover:border-gray-400 ${isDropdownOpenMonth ? 'border-blue-500' : 'border-gray-300'}`}>
                                    <Calendar size={20} />
                                    {!formData.month ? 'Select Bulan' : months.find(month => month.value === formData.month).label}
                                    <svg
                                        className={`ml-auto w-5 h-5 text-slate-400 transition-transform ${isDropdownOpenMonth ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isDropdownOpenMonth ? <div className="absolute top-[55px] max-h-[200px] overflow-y-scroll scroll-hidden w-full text-gray-500 rounded-md border border-gray-300 bg-white">
                                    <ul className="flex flex-col gap-1 text-gray-600 font-medium">
                                        {months.map((month, index) => (
                                            <li key={index}>
                                                <button type="button" className='w-full p-2 text-start' onClick={() => handleSelect({ name: "month", value: month.value })}>
                                                    {month.label}
                                                </button>
                                            </li>
                                        ))}
                                        <li>List Sudah Selesai</li>
                                    </ul>
                                </div> : <></>}
                            </div>
                            {errors.month && <p className="text-red-500 text-sm mt-1">Month is required.</p>}
                        </div>

                        {/* Year Field */}
                        <div className='pt-3'>
                            <div className="text-sm font-medium text-slate-700">Year*</div>
                            <div className="relative z-5" ref={refYear}>
                                <button type="button" onClick={() => setIsDropdownOpenYear(!isDropdownOpenYear)} className={`flex items-center gap-2 w-full p-3 text-gray-500 rounded-md border hover:border-gray-400 ${isDropdownOpenYear ? 'border-blue-500' : 'border-gray-300'}`}>
                                    <Calendar size={20} />
                                    {!formData.year ? 'Select Year' : formData.year}
                                    <svg
                                        className={`ml-auto w-5 h-5 text-slate-400 transition-transform ${isDropdownOpenYear ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isDropdownOpenYear ? <div className="absolute top-[55px] max-h-[100px] overflow-y-scroll scroll-hidden w-full p-3 text-gray-500 rounded-md border border-gray-300 bg-white">
                                    <ul className="flex flex-col gap-1 text-gray-600 font-medium">
                                        {years.map((year, index) => (
                                            <li key={index}>
                                                <button type="button" className='w-full p-2 text-start' onClick={() => handleSelect({ name: "year", value: year })}>
                                                    {year}
                                                </button>
                                            </li>
                                        ))}
                                        <li>List Sudah Selesai</li>
                                    </ul>
                                </div> : <></>}
                            </div>
                            {errors.year && <p className="text-red-500 text-sm mt-1">Year is required.</p>}
                        </div>

                        {/* Status Field */}
                        <div className='pt-3'>
                            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                                Status
                            </label>
                            <input
                                type="text"
                                id="status"
                                name="status"
                                value={formData.status}
                                disabled
                                className={`w-full text-gray-600 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${errors.status ? 'border-red-500' : 'border-slate-300'
                                    }`} />
                            <p className="text-sm text-gray-600">status akan update otomatis ketika hari itu tiba</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-4 pt-10">
                            <button
                                type="submit"
                                className="w-[150px] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModernPeriodForm;