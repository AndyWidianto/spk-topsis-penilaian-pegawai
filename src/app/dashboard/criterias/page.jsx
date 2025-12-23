"use client";
import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import UpdateCriteria from './sections/update';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCriteria, setCriterias } from '@/lib/features/criteriaSlice';
import Loading from '@/app/components/loading';
import Link from 'next/link';

export default function CriteriaTable() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [criteriaId, setCriteriaId] = useState(null);
  const [criteria, setCriteria] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const criterias = useSelector((state) => state.criteria.criterias);
  const dispatch = useDispatch();

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  const getCriterias = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/criterias", { method: "GET" });
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
        dispatch(setCriterias(resJson));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  const handleUpdate = (id, data) => {
    setCriteria(data);
    setCriteriaId(id);
    setShow(true);
  }
  const handleCancel = () => {
    setShow(false);
    setCriteria({});
    setCriteriaId(null);
  }
  const handleDelete = async (id) => {
    if (!confirm(`Apakah anda yakin ingin menghapus ${id}?`)) return;
    try {
      const res = await fetch(`/api/criterias/${id}`, { method: "DELETE" });
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
        alert(resJson.message);
        dispatch(deleteCriteria(id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (criterias.length < 1) {
      getCriterias();
    }
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
            <UpdateCriteria data={criteria} id={criteriaId} cancel={() => handleCancel()} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`min-h-screen ${bgClass} p-8 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-semibold ${textPrimary} mb-2`}>Criteria Management</h1>
              <p className={textSecondary}>Manage criteria and weight</p>
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
                  placeholder="Search criteria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
              </div>

              {/* Type Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer`}
              >
                <option value="all">All Status</option>
                <option value="benefit">Benefit</option>
                <option value="cost">Cost</option>
              </select>

              <Link href="/dashboard/criterias/create-criteria" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium whitespace-nowrap">
                <Plus size={20} />
                Add New Criteria
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-750' : 'bg-gray-50'}>
                  <tr className={`border-b ${borderColor}`}>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Code</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Name</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Weight</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Type</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Date Created</th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {criterias.map((criteria) => (
                    <tr key={criteria.id} className={`${hoverBg} transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-medium ${textPrimary}`}>{criteria.code}</span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {criteria.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-medium ${textPrimary}`}>{(criteria.weight / 100)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${criteria.type === 'benefit' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                          {criteria.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {new Date(criteria.dateCreated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleUpdate(criteria.id, criteria)} className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-blue-600 transition-colors`}>
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(criteria.id)} className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-red-600 transition-colors`}>
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
            {loading ? <><Loading /></> : criterias.length === 0 && (
              <div className="text-center py-12">
                <p className={`text-lg ${textSecondary}`}>No Criteria found matching your filters</p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className={`mt-6 flex items-center justify-between ${textSecondary} text-sm`}>
            <p>Showing {criterias.length} of {criterias.length} Criteria</p>
            <p>© 2024 Criteria Management Dashboard</p>
          </div>
        </div>
      </div>
    </>
  );
};