"use client";
import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import Loading from '@/app/components/loading';
import { motion, AnimatePresence } from 'framer-motion';
import FormUpdatePriode from "./update";
import { useDispatch, useSelector } from 'react-redux';
import { setPriodes } from '@/lib/features/priodeSlice';

export default function PriodesTable() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  const [priode, setPriode] = useState({});
  const [priodeId, setPriodeId] = useState(null);

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const priodes = useSelector((state) => state.priode.priodes);
  const dispatch = useDispatch();

  async function getPriodes() {
    if (priodes.length > 0) return setLoading(false);
    setLoading(true);
    try {
        const res = await fetch("/api/priodes", { method: "GET" });
        if (res.ok) {
          const resJson = await res.json();
          dispatch(setPriodes(resJson));
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  }
  function handleUpdate(priode) {
    setShow(true);
    setPriode(priode);
    setPriodeId(priode.id);
  }
  function handleCancel() {
    setShow(false);
    setPriodeId(null);
    setPriode({});
  }
  useEffect(() => {
    getPriodes();
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
                <FormUpdatePriode data={priode} cancel={() => handleCancel()} id={priodeId} />
            </motion.div>
            )}
        </AnimatePresence>
    <div className={`min-h-screen ${bgClass} p-8 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-semibold ${textPrimary} mb-2`}>Priode Management</h1>
            <p className={textSecondary}>Manage priode and status</p>
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
                placeholder="Search priodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
            </div>

            {/* Add User Button */}
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium whitespace-nowrap">
              <Plus size={20} />
              Add New Priode
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-750' : 'bg-gray-50'}>
                <tr className={`border-b ${borderColor}`}>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>No</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Month</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Year</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Status</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Date Create</th>
                  <th className={`px-6 py-4 text-right text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {priodes.map((priode) => (
                  <tr key={priode.id} className={`${hoverBg} transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`font-medium ${textPrimary}`}>{priode.id}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className={`font-medium ${textPrimary}`}>{months[priode.month - 1]}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                      {priode.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${priode.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-gray-100 text-red-800 dark:bg-gray-900/30 dark:text-gray-300'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priode.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                          }`}></span>
                        {priode.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                      {new Date(priode.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleUpdate(priode)} className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-blue-600 transition-colors`}>
                          <Edit2 size={18} />
                        </button>
                        <button className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-red-600 transition-colors`}>
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
          {loading ? <div className="flex justify-center"><Loading  /></div>: priodes.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-lg ${textSecondary}`}>No priodes found matching your filters</p>
            </div>
          )}
        </div>
        {/* Footer Info */}
        <div className={`mt-6 flex items-center justify-between ${textSecondary} text-sm`}>
          <p>Showing {priodes.length} of {priodes.length} priodes</p>
          <p>© 2024 Priode Management Dashboard</p>
        </div>
      </div>
    </div>
    </>
  );
};
