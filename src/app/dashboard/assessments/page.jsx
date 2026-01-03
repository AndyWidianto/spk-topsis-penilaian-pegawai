"use client";
import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import UpdateAssessment from './sections/updateAssessment';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAssessmentInPriode, setPriode } from '@/lib/features/assessmentSlice';
import Loading from '@/app/components/loading';
import { setPriodes } from '@/lib/features/priodeSlice';
import { setCriterias } from '@/lib/features/criteriaSlice';
import Link from 'next/link';

export default function AssessmentTable() {
  const [assessment, setAssessment] = useState({});
  const [assessmentId, setAssessmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const priode = useSelector((state) => state.assessment.priode);
  const priodes = useSelector((state) => state.priode.priodes);
  const criterias = useSelector((state) => state.criteria.criterias);
  const dispatch = useDispatch();

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  const months = [{ value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March", }, { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" }, { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" }, { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }];

  const getPriodeId = async (id) => {
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
  const getPriodeLast = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/priodes/last`, { method: "GET" });
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
  const getPriode = async () => {
    if (priode?.id === priode?.id && priode?.assessments.length > 0) return;
    if (priode?.id) {
      return await getPriodeId();
    }
    await getPriodeLast();
  }
  const handleUpdate = (id, data) => {
    setAssessment({ ...data, priode_id: priode?.id });
    setAssessmentId(id);
    setShow(true);
  }
  const handleCancel = () => {
    setAssessment({});
    setAssessmentId(null);
    setShow(false);
  }
  const handleDelete = async (id) => {
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

  const getPriodes = async () => {
    if (priodes.length > 0) return;
    try {
      const res = await fetch("/api/priodes", { method: "GET" });
      const resJson = await res.json();
      dispatch(setPriodes(resJson));
    } catch (err) {
      console.error(err);
    }
  }
  const handleSelectPriode = (priode) => {
    getPriodeId(priode.id);
    setIsDropdownOpen(false);
  }
  const getCriterias = async () => {
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
  useEffect(() => {
    getPriode();
    getPriodes();
    getCriterias();
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
            className='fixed w-[calc(100%-270px)] top-0 bottom-0 right-0 z-20 overflow-scroll scroll-hidden min-h-screen bg-transparent'
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
            className='fixed w-[calc(100%-270px)] top-0 bottom-0 right-0 z-20 overflow-scroll scroll-hidden min-h-screen bg-transparent'
          >
            <div className="flex flex-col items-center justify-center w-full h-full bg-[#0a0a0a2f]">
              <div className="flex justify-end w-[500px]">
                <button onClick={() => setIsDropdownOpen(false)} className='p-2 font-bold text-gray-800'><X size={20} /></button>
              </div>
              <div className="bg-gray-50 w-[450px] p-2 rounded-md">
                <h2 className="text-xl font-semi">Select Tanggal dan Tahun</h2>
                <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet.</p>
                <ul className='max-h-[250px] overflow-scroll scroll-hidden'>
                  {priodes.map(priode => (
                    <li key={priode.id}><button onClick={() => handleSelectPriode(priode)} className="w-full p-2 hover:bg-gray-100">{months.find(m => m.value === priode.month)?.label}-{priode.year}</button></li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>)}
      </AnimatePresence>
      <div className={`min-h-screen ${bgClass} p-8 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-semibold ${textPrimary} mb-2`}>Assessment Management</h1>
              <p className={textSecondary}>Manage assessments</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-lg ${inputBg} ${textPrimary} ${hoverBg} transition-colors`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
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
              <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className='p-3 rounded-xl text-gray-600 px-4'>{priode ? `${months.find(m => m.value === priode.month)?.label}-${priode.year}` : 'Select Priode'}</button>

              {/* Add Assessment Button */}
              <Link href="/dashboard/create-assessment" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium whitespace-nowrap">
                <Plus size={20} />
                Add New Assessment
              </Link>
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
                    <th className={`px-6 py-4 text-right text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Actions</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleUpdate(assessment.id, assessment)} className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-blue-600 transition-colors`}>
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(assessment.id)} className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-red-600 transition-colors`}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
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
