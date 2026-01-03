"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(formData) });
      if (!res.ok) {
        throw new Error("Login failed");
      }
      const resJson = await res.json();
      console.log("Login successful:", resJson);
      localStorage.setItem("accessToken", resJson.accessToken);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Email atau password salah!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
  }

  return (
    <>
      <div className="flex items-center justify-center align-items w-full h-screen bg-black/60">
        <div className="flex justify-between w-[60rem] border bg-white">
          {/* slider  */}
          <div className="w-0 md:w-3/5 overflow-hidden h-2xl">
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
              slidesPerView={1}
              loop
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="w-full h-full"
            >
              {slides.map(slide => (
                <SwiperSlide>
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
          {/* main content  */}
          <div className="w-full md:w-[40%] flex items-center flex-col px-10">
            {/* Header */}
            <div className="text-center w-full">
              <div className="font-bold text-xl p-10">Account</div>
              <div className="text-gray-600 text-md mb-5">Welcome to Calculate Express</div>
            </div>
            {/* Form Login */}
            <div className="p-2 pt-4 w-full">
              <form className="w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col w-full mt-4">
                  <label htmlFor="email" className='text-gray-600 text-xs'>Username or Email</label>
                  <input type="text" name="email" id="email" onChange={handleChange} className='pb-1 border-b border-gray-600 w-full focus:outline-0 focus:border-blue-600' />
                  {error && <span className="text-red-500 text-xs">{error}</span>}
                </div>
                <div className="flex flex-col w-full mt-4">
                  <label htmlFor="password" className='text-gray-600 text-xs'>Password</label>
                  <input type="password" name="password" id="password" onChange={handleChange} className='pb-1 border-b border-gray-600 w-full focus:outline-0 focus:border-blue-600' />
                </div>
                <div className="w-full text-end p-2">
                  <Link href="/forget-password" className='text-blue-600 text-sm'>Forget Password?</Link>
                </div>
                <div className="flex justify-center my-4 text-sm">
                  <button type="submit" className="p-2 px-12 rounded-full bg-gray-700 text-white">
                  {loading ? <div className='flex items-center gap-2'>
                    <div className="border-2 rounded-full w-6 h-6 animate-spin border-t-blue-600 border-r-blue-600"></div>
                    Processing
                  </div> : 'Sign In' }
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
              <div className="my-4 text-gray-500 text-sm">
                <span>new Calculate Express? <Link href="/register" className="underline text-blue-500">Create Account</Link></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}