"use client";
import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import UpdateAssessmentDetail from '../sections/updateDetail';
import { deleteAssessmentDetail, setAssessmentDetails } from '@/lib/features/assessmentDetailSlice';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/fetcher';

export default function AssessmentDetailTable() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [assessmentDetail, setAssessmentDetail] = useState({});
  const [assessmentDetailId, setAssessmentDetailId] = useState(null);

  const assessmentDetails = useSelector((state) => state.assessment_detail.assessmentDetails);
  const dispatch = useDispatch();

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  async function getAssessmentDetails() {
    setLoading(true);
    try {
      const res = await fetch("/api/assessment-details", { method: "GET" });
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
        dispatch(setAssessmentDetails(resJson));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id, data) {
    setAssessmentDetail(data);
    setAssessmentDetailId(id);
    setShow(true);
  }

  async function handleClose() {
    setShow(false);
    setAssessmentDetail({});
    setAssessmentDetailId(null);
  }

  async function handleDelete(id) {
    if (!confirm(`Apakah anda yakin ingin menghapus ${id}?`)) return;
    try {
      const res = await fetchWithAuth(`/api/assessment-details/${id}`, { method: "DELETE" });
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
        alert(resJson.message);
        dispatch(deleteAssessmentDetail(id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getAssessmentDetails();
  }, []);

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
            <UpdateAssessmentDetail data={assessmentDetail} id={assessmentDetailId} cancel={() => handleClose()} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`min-h-screen ${bgClass} p-8 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-semibold ${textPrimary} mb-2`}>User Management</h1>
              <p className={textSecondary}>Manage your team members and their roles</p>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer`}
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer`}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Add User Button */}
              <Link href="/dashboard/assessments/create-assessment-detail" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium whitespace-nowrap">
                <Plus size={20} />
                Add New Assessment Detail
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-750' : 'bg-gray-50'}>
                  <tr className={`border-b ${borderColor}`}>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Employee</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Criteria</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Nilai</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Date Created</th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {assessmentDetails.map((detail) => (
                    <tr key={detail.id} className={`${hoverBg} transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className={`font-medium ${textPrimary}`}>{detail.assessments.employees.name}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {detail.criterias.name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {detail.nilai}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {new Date(detail.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleUpdate(detail.id, detail)} className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-blue-600 transition-colors`}>
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(detail.id)} className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-red-600 transition-colors`}>
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
            {assessmentDetails.length === 0 && (
              <div className="text-center py-12">
                <p className={`text-lg ${textSecondary}`}>No users found matching your filters</p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className={`mt-6 flex items-center justify-between ${textSecondary} text-sm`}>
            <p>Showing {assessmentDetails.length} of {assessmentDetails.length} users</p>
            <p>© 2024 User Management Dashboard</p>
          </div>
        </div>
      </div>
    </>
  );
};