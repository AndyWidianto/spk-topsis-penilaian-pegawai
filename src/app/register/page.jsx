"use client";
import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validatePassword = (password) => {
    if (password.length === 0) return null;
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (confirmPassword.length === 0) return null;
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const validateEmail = (email) => {
    if (email.length === 0) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    let newErrors = { ...errors };
    
    if (field === 'password') {
      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
      else delete newErrors.password;
      
      if (formData.confirmPassword) {
        const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
        if (confirmError) newErrors.confirmPassword = confirmError;
        else delete newErrors.confirmPassword;
      }
    }
    
    if (field === 'confirmPassword') {
      const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
      if (confirmError) newErrors.confirmPassword = confirmError;
      else delete newErrors.confirmPassword;
    }
    
    if (field === 'email') {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
      else delete newErrors.email;
    }
    
    setErrors(newErrors);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    if (touched[field]) {
      let newErrors = { ...errors };
      
      if (field === 'password') {
        const passwordError = validatePassword(value);
        if (passwordError) newErrors.password = passwordError;
        else delete newErrors.password;
        
        if (formData.confirmPassword) {
          const confirmError = validateConfirmPassword(value, formData.confirmPassword);
          if (confirmError) newErrors.confirmPassword = confirmError;
          else delete newErrors.confirmPassword;
        }
      }
      
      if (field === 'confirmPassword') {
        const confirmError = validateConfirmPassword(formData.password, value);
        if (confirmError) newErrors.confirmPassword = confirmError;
        else delete newErrors.confirmPassword;
      }
      
      if (field === 'email') {
        const emailError = validateEmail(value);
        if (emailError) newErrors.email = emailError;
        else delete newErrors.email;
      }
      
      setErrors(newErrors);
    }
  };

  const handleSubmit = () => {
    const allTouched = {
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true
    };
    setTouched(allTouched);

    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    const emailError = validateEmail(formData.email);
    if (!formData.email) newErrors.email = 'Email is required';
    else if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (!formData.password) newErrors.password = 'Password is required';
    else if (passwordError) newErrors.password = passwordError;
    
    const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (confirmError) newErrors.confirmPassword = confirmError;
    
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Registration attempt:', formData);
      // Implementasi register logic di sini
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up clicked');
    // Implementasi Google OAuth di sini
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return null;
    if (password.length < 8) return { text: 'Weak', color: 'text-red-500' };
    if (password.length < 12) return { text: 'Medium', color: 'text-yellow-500' };
    return { text: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Sign up to get started</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                onKeyPress={handleKeyPress}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.fullName && touched.fullName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none`}
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && touched.fullName && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <XCircle className="h-4 w-4 mr-1" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                onKeyPress={handleKeyPress}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <XCircle className="h-4 w-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                onKeyPress={handleKeyPress}
                className={`block w-full pl-10 pr-10 py-3 border ${
                  errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                )}
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between">
              {errors.password && touched.password ? (
                <p className="text-sm text-red-500 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              ) : passwordStrength ? (
                <p className={`text-sm ${passwordStrength.color} flex items-center`}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {passwordStrength.text}
                </p>
              ) : (
                <p className="text-sm text-gray-500">At least 8 characters</p>
              )}
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                onKeyPress={handleKeyPress}
                className={`block w-full pl-10 pr-10 py-3 border ${
                  errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                )}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <XCircle className="h-4 w-4 mr-1" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start">
            <div className="flex items-center h-5 mt-1">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <label htmlFor="acceptTerms" className="ml-3 text-sm text-gray-600">
              I accept the{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Terms and Conditions
              </a>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-500 flex items-center">
              <XCircle className="h-4 w-4 mr-1" />
              {errors.acceptTerms}
            </p>
          )}

          {/* Register Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Create Account
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or sign up with</span>
          </div>
        </div>

        {/* Google Sign Up Button */}
        <button
          onClick={handleGoogleSignUp}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Sign up with Google</span>
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold transition">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}