"use client";
import React, { useState } from 'react';
import { User, Briefcase, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addEmployee } from '@/lib/features/employeeSlice';
import { fetchWithAuth } from '@/lib/fetcher';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    nip: '',
    name: '',
    position: '',
    division: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const positions = [
    { value: '', label: 'Pilih Jabatan' },
    { value: 'manager', label: 'Manager' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'staff', label: 'Staff' },
    { value: 'analyst', label: 'Analyst' },
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
  ];

  const divisions = [
    { value: '', label: 'Pilih Divisi' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'it', label: 'IT Department' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' },
    { value: 'sales', label: 'Sales' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nip.trim()) {
      newErrors.nip = 'NIP wajib diisi';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }
    if (!formData.position) {
      newErrors.position = 'Jabatan wajib dipilih';
    }
    if (!formData.division) {
      newErrors.division = 'Divisi wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const res = await fetchWithAuth("/api/employees", { method: "POST", body: JSON.stringify(formData) });
        if (res.ok) {
          const resJson = await res.json();
          dispatch(addEmployee(resJson));
          alert('Data karyawan berhasil disimpan!');
          setFormData({
            nip: '',
            name: '',
            position: '',
            division: '',
            status: 'active',
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      nip: '',
      name: '',
      position: '',
      division: '',
      status: 'active',
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Data Karyawan</h1>
          <p className="text-gray-600">Lengkapi informasi karyawan dengan detail yang akurat</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="nip" className="block text-sm font-medium text-gray-700 mb-2">
                NIP (Nomor Induk Pegawai)
              </label>
              <input
                type="text"
                id="nip"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                placeholder="Contoh: 123456789"
                className={`w-full px-4 py-3 rounded-lg border ${errors.nip ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all outline-none`}
                disabled={loading}
              />
              {errors.nip && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.nip}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all outline-none`}
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.position ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:ring-2 focus:border-transparent transition-all outline-none appearance-none bg-white cursor-pointer`}
                    disabled={loading}
                  >
                    {positions.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.position}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-2">
                  Divisi
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    id="division"
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.division ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:ring-2 focus:border-transparent transition-all outline-none appearance-none bg-white cursor-pointer`}
                    disabled={loading}
                  >
                    {divisions.map((div) => (
                      <option key={div.value} value={div.value}>
                        {div.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.division && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.division}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Status Karyawan
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === 'active'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 flex items-center gap-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Aktif
                  </span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === 'inactive'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 flex items-center gap-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Tidak Aktif
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? <div className="flex items-center justify-center gap-2">
              <div className="animate-spin border-2 border-white border-t-2 border-t-blue-500 h-5 w-5 rounded-full mx-auto"></div>
                Processing
              </div> : 'Save'}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">💡 Tips:</span> Pastikan semua data telah diisi dengan benar sebelum menyimpan. Data yang tersimpan akan langsung terintegrasi dengan sistem kepegawaian.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;