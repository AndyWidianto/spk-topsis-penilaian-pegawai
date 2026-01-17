"use client";
import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import UpdateAssessment from './sections/updateAssessment';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAssessmentInPriode, setPriode } from '@/lib/features/assessmentSlice';
import Loading from '@/app/components/loading';
import { setPriodes } from '@/lib/features/priodeSlice';
import { setCriterias } from '@/lib/features/criteriaSlice';
import Link from 'next/link';
import { JWTDecode } from '@/lib/fetcher';

export default function AssessmentTable() {
  const [assessment, setAssessment] = useState({});
  const [assessmentId, setAssessmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const priode = useSelector((state) => state.assessment.priode);
  const priodes = useSelector((state) => state.priode.priodes);
  const criterias = useSelector((state) => state.criteria.criterias);
  const dispatch = useDispatch();

  const roleValidation = user && user?.role === "super_admin" || user?.role === "admin";

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  async function getPriodeId(id) {
    if (priode && priode.id === id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/priodes/${id}`, { method: "GET" });
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
        dispatch(setPriode(resJson));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function getPriodeNow() {
    setLoading(true);
    try {
      const date = new Date();
      const res = await fetch(`/api/priodes?month=${date.getMonth() + 1}&year=${date.getFullYear()}`, { method: "GET" });
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson[0]);
        dispatch(setPriode(resJson[0]));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function getPriode() {
    if (priode && priode.assessments.length > 0) return;
    if (priode && priode.id) {
      return await getPriodeId(priode.id);
    }
    await getPriodeNow();
  }
  function handleUpdate(id, data) {
    setAssessment({ ...data, priode_id: priode?.id });
    setAssessmentId(id);
    setShow(true);
  }
  function handleCancel() {
    setAssessment({});
    setAssessmentId(null);
    setShow(false);
  }
  async function handleDelete(id) {
    if (!confirm(`Apakah anda yakin ingin menghapus ${id}?`)) return;
    try {
      const res = await fetchWithAuth(`/api/assessments/${id}`, { method: "DELETE" })
      if (res.ok) {
        const resJson = await res.json();
        alert(resJson.message);
        dispatch(deleteAssessmentInPriode(id));
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function getPriodes() {
    if (priodes.length > 0) return;
    try {
      const res = await fetch("/api/priodes", { method: "GET" });
      const resJson = await res.json();
      dispatch(setPriodes(resJson));
    } catch (err) {
      console.error(err);
    }
  }
  function handleSelectPriode(e) {
    const id = e.target.value;
    console.log(id);
    if (id.trim()) {
      getPriodeId(Number(id));
      setIsDropdownOpen(false);
    }
  }
  async function getCriterias() {
    if (criterias.length > 0) return;
    try {
      const res = await fetch("/api/criterias", { method: "GET" });
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
        dispatch(setCriterias(resJson));
      }
    } catch (err) {
      console.error(err);
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
    getPriode();
    getPriodes();
    getCriterias();
    getUser();
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("no-scroll", isDropdownOpen);
    return () => document.documentElement.classList.remove("no-scroll");
  }, [isDropdownOpen, show]);

  return (
    <>
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className='fixed w-[calc(100%-0px)] md:w-[calc(100%-270px)] top-0 bottom-0 right-0 z-20 overflow-scroll scroll-hidden min-h-screen bg-transparent'
          >
            <UpdateAssessment data={assessment} id={assessmentId} cancel={() => handleCancel()} />
          </motion.div>
        )}
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className='fixed w-[calc(100%-0px)] md:w-[calc(100%-270px)] top-0 bottom-0 right-0 z-20 overflow-scroll scroll-hidden min-h-screen bg-transparent'
          >
            <div className="flex flex-col items-center justify-center w-full h-full bg-[#0a0a0a2f]">
              <div
                className={`relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${isDropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}
                role="dialog" aria-modal="true" aria-labelledby="modal-title"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
                    Pilih Periode
                  </h2>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
                    aria-label="Tutup modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  <label
                    htmlFor="periode-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Periode Penilaian
                  </label>
                  <select
                    id="periode-select"
                    value={months[priode.month - 1] ?? ''}
                    onChange={handleSelectPriode}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-700 cursor-pointer hover:border-gray-400"
                  >
                    <option value="">Select Priode</option>
                    {priodes.map((p, index) => (
                      <option key={index} value={index + 1}>
                        {months[p.month - 1]} {p.year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>)}
      </AnimatePresence>
      <div className={`min-h-screen ${bgClass} p-8 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-3xl font-semibold ${textPrimary} mb-2`}>Assessment Management</h1>
                <span className="block bg-blue-100 p-1 text-blue-600 rounded-md">{priode ? `${months[priode.month - 1]} ${priode.year}` : ''}</span>
              </div>
              <p className={textSecondary}>Manage assessments</p>
            </div>
          </div>

          {/* Controls */}
          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} p-6 mb-6`}>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={20} />
                <input
                  type="text"
                  placeholder="Search assessment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
              </div>

              {/* Role Filter */}
              <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className='py-2.5 rounded-lg text-white px-4 bg-blue-600'>Select Priode</button>

              {/* Add Assessment Button */}
              {roleValidation && <Link href="/dashboard/create-assessment" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium whitespace-nowrap">
                <Plus size={20} />
                Add New Assessment
              </Link>}
            </div>
          </div>

          {/* Table */}
          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-750' : 'bg-gray-50'}>
                  <tr className={`border-b ${borderColor}`}>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>No.</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Employee</th>
                    {criterias.map(criteria => (
                      <th key={criteria.id} className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>{criteria.name}({criteria.weight})</th>
                    ))}
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Status</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Date Created</th>
                    {roleValidation && <th className={`px-6 py-4 text-right text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {priode?.assessments.map((assessment, index) => (
                    <tr key={assessment.id} className={`${hoverBg} transition-colors`}>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {index + 1}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {assessment.employees.name}
                      </td>
                      {assessment.assessment_details.map(detail => (
                        <td key={detail.id} className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                          {detail.nilai}
                        </td>
                      ))}
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        <div className="flex items-center justify-center gap-1 text-sm rounded-full bg-green-200">
                          <span className="h-1 5 w-1 5 rounded-full bg-green-600"></span>
                          {priode?.status}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {new Date(assessment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      {roleValidation && <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleUpdate(assessment.id, assessment)} className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-blue-600 transition-colors`}>
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(assessment.id)} className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-red-600 transition-colors`}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Empty State */}
            {loading ? <Loading /> : priode?.assessments.length === 0 && (
              <div className="text-center py-12">
                <p className={`text-lg ${textSecondary}`}>No assessments found matching your filters</p>
              </div>
            )}
          </div>
          {/* Footer Info */}
          <div className={`mt-6 flex items-center justify-between ${textSecondary} text-sm`}>
            <p>Showing {priode?.assessments.length} of {priode?.assessments.length} assessments</p>
            <p>© 2024 Assessment Management Dashboard</p>
          </div>
        </div>
      </div>
    </>
  );
};
