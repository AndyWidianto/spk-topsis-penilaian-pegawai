"use client";
import React from 'react';
import {
  Chart as ChartJS, // Menggunakan alias ChartJS untuk menghindari konflik nama
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// 1. Daftarkan elemen yang diperlukan untuk Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 2. Siapkan data dan opsi konfigurasi
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom', // Posisi legenda: 'top', 'bottom', 'left', 'right'
    },
    title: {
      display: true,
      text: 'Data Penjualan Bulanan',
    },
  },
  maintainAspectRatio: false, // Memungkinkan Anda mengontrol ukuran dengan CSS/tinggi parent
};

const labels = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli'];

const data = {
  labels,
  datasets: [
    {
      label: 'Penjualan',
      data: [12, 19, 3, 5, 2, 3, 10], // Data Anda di sini
      backgroundColor: 'rgba(53, 162, 235, 0.5)', // Warna batang
    },
    {
        label: 'Pengeluaran',
        data: [2, 5, 8, 1, 6, 9, 3], // Data Anda di sini
        backgroundColor: 'rgba(255, 99, 132, 0.5)', // Warna batang
      },
  ],
};


// 3. Komponen React yang merender grafik
const GrafikBatang = () => {
  // Komponen <Bar /> menerima properti 'data' dan 'options'
  return (
    <div style={{ width: '100%', height: '400px' }}>
        <Bar options={options} data={data} />
    </div>
  );
};

export default GrafikBatang;
