"use client";
import React, { useState } from 'react';
import { Briefcase, XCircle } from 'lucide-react';
import { addCriteria } from '@/lib/features/criteriaSlice';
import { fetchWithAuth } from '@/lib/fetcher';

export default function CreateCriteria() {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: '',
    weight: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const types = [
    { value: '', label: 'Pilih Type' },
    { value: 'benefit', label: 'Benefit' },
    { value: 'cost', label: 'Cost' },
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "weight") {
      const weight = parseInt(value);
      if (weight < 0 || weight > 100) {
        setErrors({
          weight: "Bobot tidak boleh lebih dari 100 dan tidak boleh kurang dari 0"
        });
      }
    }
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  function validateForm() {
    console.log(formData);
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'NIP wajib diisi';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }
    if (!formData.type) {
      newErrors.type = 'Type wajib dipilih';
    }
    if (!formData.weight.trim()) {
      newErrors.weight = 'Weight wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit() {
    if (!validateForm()) return console.error(errors);
    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/criterias", { method: "POST", body: JSON.stringify(formData) });
      if (res.ok) {
        const resJson = await res.json();
        alert('Data karyawan berhasil disimpan!');
        setFormData({
          code: '',
          name: '',
          type: '',
          weight: '',
          description: '',
        });
        dispatch(addCriteria(resJson));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function handleCancel() {
    setFormData({
      nip: '',
      name: '',
      type: '',
      weight: '',
      description: '',
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Criteria</h1>
          <p className="text-gray-600">Lengkapi informasi criteria dengan detail yang akurat</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="space-y-6">

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                disabled={loading}
                placeholder="Masukkan nama lengkap"
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all outline-none`}
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.code}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                placeholder="Masukkan nama lengkap"
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all outline-none`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Weight
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Masukkan weight lengkap"
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all outline-none`}
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.weight}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.type ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:ring-2 focus:border-transparent transition-all outline-none appearance-none bg-white cursor-pointer`}
                  >
                    {types.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.type}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                placeholder="Masukkan description lengkap"
                className={`w-full px-4 py-3 h-20 rounded-lg border ${errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all outline-none`}
              />
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? '...Loading' : 'Save'}
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