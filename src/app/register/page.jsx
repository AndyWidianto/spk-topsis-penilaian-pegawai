"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Pagination, Scrollbar } from 'swiper/modules';
import { Lock, LockOpen } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [inputConfirmPasswordIsActive, setInputComfirmPasswordIsActive] = useState(false);
  const [inputPasswordIsActive, setInputPasswordIsActive] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const slides = [
    {
      id: 1,
      name: "Penghitungan Otomatis",
      image: "/images/otomatis.jpg",
      description: "melakukan penghitungan nilai kinerja pegawai secara otomatis menggunakan metode sistem pendukung keputusan."
    },
    {
      id: 2,
      name: "Perangkingan Pegawai",
      image: "/images/tangga.jpg",
      description: "perangkingan menampilkan urutan pegawai berdasarkan nilai akhir hasil perhitungan sistem."
    },
    {
      id: 3,
      name: "Riwayat Penilaian",
      image: "/images/rekap.jpg",
      description: "riwayat penilaian menyimpan data hasil penilaian pegawai pada periode sebelumnya."
    }
  ]

  function validatePassword(password) {
    if (password.length === 0) return null;
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
  };

  function validateConfirmPassword(password, confirmPassword) {
    if (confirmPassword.length === 0) return null;
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  function validateEmail(email) {
    if (email.length === 0) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  function handleBlur(field) {
    setTouched({ ...touched, [field]: true });

    let newErrors = { ...errors };

    if (field === 'password') {
      setInputPasswordIsActive(false);
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
      setInputComfirmPasswordIsActive(false);
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

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (touched[name]) {
      let newErrors = { ...errors };

      if (name === 'password') {
        const passwordError = validatePassword(value);
        if (passwordError) newErrors.password = passwordError;
        else delete newErrors.password;

        if (formData.confirmPassword) {
          const confirmError = validateConfirmPassword(value, formData.confirmPassword);
          if (confirmError) newErrors.confirmPassword = confirmError;
          else delete newErrors.confirmPassword;
        }
      }

      if (name === 'confirmPassword') {
        const confirmError = validateConfirmPassword(formData.password, value);
        if (confirmError) newErrors.confirmPassword = confirmError;
        else delete newErrors.confirmPassword;
      }

      if (name === 'email') {
        const emailError = validateEmail(value);
        if (emailError) newErrors.email = emailError;
        else delete newErrors.email;
      }

      setErrors(newErrors);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const allTouched = {
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    };
    setTouched(allTouched);

    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Full name is required';

    const emailError = validateEmail(formData.email);
    if (!formData.email) newErrors.email = 'Email is required';
    else if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (!formData.password) newErrors.password = 'Password is required';
    else if (passwordError) newErrors.password = passwordError;

    const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (confirmError) newErrors.confirmPassword = confirmError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(formData), headers: { "Content-Type": "application/json" } });
        if (!res.ok) {
          throw new Error("Registration failed");
        }
        const resJson = await res.json();
        localStorage.setItem("accessToken", resJson.accessToken);
        router.push("/dashboard");
      } catch (err) {
        console.error("Registration failed:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  function handleGoogleSignUp() {
    console.log('Google sign up clicked');
    // Implementasi Google OAuth di sini
  };


  function getPasswordStrength() {
    const password = formData.password;
    if (password.length === 0) return null;
    if (password.length < 8) return { text: 'Weak', color: 'text-red-500' };
    if (password.length < 12) return { text: 'Medium', color: 'text-yellow-500' };
    return { text: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <>
      <div className="flex items-center justify-center align-items w-full bg-black/60">
        <div className="flex justify-between w-[60rem] border bg-white">
          <div className="w-0 md:w-3/5 overflow-hidden h-2xl">
            <Swiper
              modules={[Pagination, Scrollbar, A11y, Autoplay]}
              slidesPerView={1}
              loop
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="w-full h-full"
            >
              {slides.map(slide => (
                <SwiperSlide key={slide.id}>
                  <div className="flex items-end relative w-full h-full">
                    <img src={slide.image} alt={slide.name} className="absolute w-full h-full object-cover z-0" />
                    <div className="absolute bottom-20 z-10 flex flex-col items-center justify-center w-full px-4 text-white text-shadow-lg/30 text-shadow-black">
                      <div className="text-xl font-bold">
                        {slide.name}
                      </div>
                      <div className="text-sm text-center">
                        {slide.description}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="w-full md:w-[40%] flex items-center flex-col px-10">
            {/* Header */}
            <div className="text-center w-full">
              <div className="font-bold text-xl p-10">Create Account</div>
              <div className="text-gray-600 text-md mb-5">Welcome to Calculate Express</div>
            </div>
            {/* Form Login */}
            <div className="p-2 pt-4 w-full">
              <form className="w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col w-full mt-4">
                  <label htmlFor="username" className='text-gray-600 text-xs'>Username</label>
                  <input type="text" name="username" id="username" onChange={handleChange} className='pb-1 border-b border-gray-600 w-full focus:outline-0 focus:border-blue-600' />
                  {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
                </div>
                <div className="flex flex-col w-full mt-4">
                  <label htmlFor="email" className='text-gray-600 text-xs'>Email</label>
                  <input type="email" name="email" id="email" onChange={handleChange} className='pb-1 border-b border-gray-600 w-full focus:outline-0 focus:border-blue-600' />
                  {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>
                <div className="flex flex-col w-full mt-4">
                  <label htmlFor="password" className='text-gray-600 text-xs'>Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" id="password" onChange={handleChange} onFocus={() => setInputPasswordIsActive(true)} onBlur={() => handleBlur("password")} className='pb-1 border-b border-gray-600 w-full focus:outline-0 focus:border-blue-600' />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-0 bottom-2 transition-all duration-300 opacity-1 ${inputPasswordIsActive ? 'block' : 'hidden'} hover:block`}>
                      {showPassword ? <LockOpen size={18} /> : <Lock size={18} />}
                    </button>
                  </div>
                  {passwordStrength && <div>password: <small className={passwordStrength.color}>{passwordStrength.text}</small></div>}
                  {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                </div>
                <div className="flex flex-col w-full mt-4">
                  <label htmlFor="confirm password" className='text-gray-600 text-xs'>Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" id="confirmPassword" onChange={handleChange} onFocus={() => setInputComfirmPasswordIsActive(true)} onBlur={() => handleBlur("confirmPassword")} className='pb-1 border-b border-gray-600 w-full focus:outline-0 focus:border-blue-600' />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute right-0 bottom-2 transition-all duration-300 opacity-1 ${inputConfirmPasswordIsActive ? 'block' : 'hidden'} hover:block`}>
                      {showConfirmPassword ? <LockOpen size={18} /> : <Lock size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
                </div>
                <div className="flex justify-center my-4 text-sm">
                  <button type="submit" className="p-2 px-12 rounded-full bg-gray-700 text-white">
                    {loading ? <div className='flex items-center gap-2'>
                      <div className="border-2 rounded-full w-6 h-6 animate-spin border-t-blue-600 border-r-blue-600"></div>
                      Processing
                    </div> : 'Create Account'}
                  </button>
                </div>
              </form>
              <div className="flex items-center justify-center text-center gap-2 text-gray-300 py-4">
                <div className="border w-10"></div>
                <div className="text-xs">or</div>
                <div className="border w-10"></div>
              </div>
              <div className="pb-4">
                <Link href="/" className="flex items-center justify-center p-2 px-4">
                  <img src="/images/google.jpg" alt="icon google" className="rounded-md object-cover w-10 h-10" />
                  <div className="text-gray-500 text-sm">Sign in with Google</div>
                </Link>
              </div>
              <div className="my-4 text-gray-500 text-sm text-center">
                <span>i have an account <Link href="/login" className="underline text-blue-500">Sign In</Link></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}