"use client";
import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Moon, Sun } from 'lucide-react';
import Loading from '@/app/components/loading';
import UpdateEmployee from './sections/update';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEmployee, setEmployees } from '@/lib/features/employeeSlice';
import { fetchWithAuth, JWTDecode } from '@/lib/fetcher';

export default function EmployeeTable() {
  const [employee, setEmployee] = useState({});
  const [employeeId, setEmployeeId] = useState(null);
  const [show, setShow] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  const employees = useSelector((state) => state.employee.employees);
  const dispatch = useDispatch();

  const roleValidation = user && user?.role === "super_admin" || user?.role === "admin";

  function handleUpdate(id, data) {
    setEmployee(data);
    setEmployeeId(id);
    setShow(true);
  }
  function handleCancel() {
    setShow(false);
  }
  async function getEmployees() {
    setLoading(true);
    try {
      const res = await fetch("/api/employees", { method: "GET" });
      const resJson = await res.json();
      console.log(resJson);
      dispatch(setEmployees(resJson));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id) {
    if (!confirm("Apakah anda yakin ingin menghapusnya?")) return;
    try {
      const res = await fetchWithAuth(`/api/employees/${id}`, { method: "DELETE" });
      const resJson = await res.json();
      console.log(resJson);
      alert(resJson.message);
      dispatch(deleteEmployee(id));
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
    if (employees.length < 1) {
      getEmployees();
    }
    getUser();
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
            className='fixed w-[calc(100%-0px)] md:w-[calc(100%-270px)] top-0 bottom-0 right-0 z-20 overflow-scroll scroll-hidden min-h-screen bg-transparent'
          >
            <UpdateEmployee data={employee} cancel={() => handleCancel()} id={employeeId} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`min-h-screen ${bgClass} p-8 transition-colors duration-200`}>
        <div className="max-w-7xl relative z-5 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-semibold ${textPrimary} mb-2`}>Employee Management</h1>
              <p className={textSecondary}>Manage your team employee and status</p>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
              </div>

              {/* Add Criteria Button */}
              {roleValidation && <Link href="/dashboard/employees/create-employee" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium whitespace-nowrap">
                <Plus size={20} />
                Add New User
              </Link>}
            </div>
          </div>

          {/* Table */}
          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-750' : 'bg-gray-50'}>
                  <tr className={`border-b ${borderColor}`}>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Nip</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Name</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Position</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Division</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Status</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Date Create</th>
                    {roleValidation && <th className={`px-6 py-4 text-right text-xs font-semibold ${textSecondary} uppercase tracking-wider`}>Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {employees.map((employee) => (
                    <tr key={employee.id} className={`${hoverBg} transition-colors`}>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>{employee.nip}</td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {employee.name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {employee.position}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {employee.division}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${employee.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${employee.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                            }`}></span>
                          {employee.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textSecondary}`}>
                        {new Date(employee.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      {roleValidation && <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleUpdate(employee.id, employee)} className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-blue-600 transition-colors`}>
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleRemove(employee.id)} className={`p-2 ${hoverBg} rounded-lg ${textSecondary} hover:text-red-600 transition-colors`}>
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
            {loading ? <Loading /> : employees.length === 0 && (
              <div className="text-center py-12">
                <p className={`text-lg ${textSecondary}`}>No Employees found matching your filters</p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className={`mt-6 flex items-center justify-between ${textSecondary} text-sm`}>
            <p>Showing {employees.length} of {employees.length} Employees</p>
            <p>© 2024 Employee Management Dashboard</p>
          </div>
        </div>
      </div>
    </>
  );
};
