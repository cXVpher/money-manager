"use client";

import { useState } from "react";
import { DashboardSummary, Transaction } from "@/lib/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2'; // Ganti Pie jadi Doughnut

// Registrasi komponen Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  summary: DashboardSummary;
  transactions: Transaction[];
}

export default function DashboardStats({ summary, transactions }: Props) {
  const safeSummary = summary || { totalIncome: 0, totalExpense: 0, balance: 0 };
  const [activeChart, setActiveChart] = useState<'income' | 'expense' | 'balance' | null>(null);

  // Helper untuk format Rupiah
  const formatIDR = (num: number) => "Rp " + num.toLocaleString("id-ID");

  // --- LOGIKA DATA CHART ---
  const getChartData = () => {
    let labels: string[] = [];
    let dataValues: number[] = [];
    let bgColors: string[] = [];
    let title = "";
    let totalSum = 0; // Untuk hitung persentase

    if (activeChart === 'balance') {
      title = "Perbandingan Arus Kas";
      labels = ['Pemasukan', 'Pengeluaran'];
      dataValues = [safeSummary.totalIncome, safeSummary.totalExpense];
      bgColors = ['#10B981', '#F43F5E']; // Emerald & Rose
      totalSum = safeSummary.totalIncome + safeSummary.totalExpense;

    } else {
      title = activeChart === 'income' ? "Sumber Pemasukan" : "Detail Pengeluaran";
      const filtered = transactions.filter(t => t.type === activeChart);
      const groupedData: Record<string, number> = {};
      const categoryColors: Record<string, string> = {};

      filtered.forEach(t => {
        // Gunakan nama kategori, jika tidak ada (karena kategori dihapus) pakai "Lainnya"
        const catName = t.category?.name || "Lainnya (Kategori Dihapus)";
        const catColor = t.category?.color || "#9CA3AF"; // Abu-abu default
        
        groupedData[catName] = (groupedData[catName] || 0) + Number(t.amount);
        categoryColors[catName] = catColor;
      });

      labels = Object.keys(groupedData);
      dataValues = Object.values(groupedData);
      bgColors = labels.map(label => categoryColors[label]);
      totalSum = dataValues.reduce((a, b) => a + b, 0);
    }

    // Handle Data Kosong
    if (dataValues.length === 0 || totalSum === 0) {
      return {
        title, isEmpty: true, totalSum: 0,
        data: { labels: ["Tidak ada data"], datasets: [{ data: [1], backgroundColor: ["#E5E7EB"] }] },
        details: []
      };
    }

    // Siapkan data detail untuk legend kustom
    const details = labels.map((label, index) => ({
      label,
      value: dataValues[index],
      color: bgColors[index],
      percentage: ((dataValues[index] / totalSum) * 100).toFixed(1) + "%"
    }));
    // Urutkan dari yang terbesar
    details.sort((a, b) => b.value - a.value);

    return {
      title, isEmpty: false, totalSum,
      details,
      data: {
        labels,
        datasets: [{
          data: dataValues,
          backgroundColor: bgColors,
          borderColor: '#ffffff', // Border putih agar terlihat terpotong
          borderWidth: 3,
          hoverOffset: 10 // Efek membesar saat di-hover
        }],
      }
    };
  };

  const chartConfig = activeChart ? getChartData() : null;

  // --- OPSI CHART (Config Tampilan) ---
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%', // Membuat lubang donut lebih besar
    plugins: {
      legend: { display: false }, // Matikan legend bawaan yang jelek
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        bodyFont: { size: 14 },
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) label += ': ';
            if (context.parsed !== null) {
              // Format tooltip jadi Rupiah
              label += formatIDR(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <>
      {/* --- KARTU STATISTIK (TAMPILAN DEPAN) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <CardStat 
          title="Pemasukan" value={safeSummary.totalIncome} color="emerald" icon="💰" 
          onClick={() => setActiveChart('income')} 
        />
        <CardStat 
          title="Pengeluaran" value={safeSummary.totalExpense} color="rose" icon="💸" 
          onClick={() => setActiveChart('expense')} 
        />
        <CardStat 
          title="Saldo Akhir" value={safeSummary.balance} color="indigo" icon="🏦" 
          onClick={() => setActiveChart('balance')} isBalance 
        />
      </div>

      {/* --- POPUP MODAL CHART PREMIUM --- */}
      {activeChart && chartConfig && (
        <div className="modal modal-open bg-black/70 backdrop-blur-sm z-[999] transition-opacity">
          {/* Gunakan max-w-4xl agar modal lebih lebar */}
          <div className="modal-box max-w-4xl p-0 overflow-hidden relative bg-white rounded-2xl shadow-2xl">
            
            {/* Header Modal */}
            <div className={`p-4 flex justify-between items-center ${activeChart === 'income' ? 'bg-emerald-50' : activeChart === 'expense' ? 'bg-rose-50' : 'bg-indigo-50'}`}>
              <h3 className="font-bold text-xl flex items-center gap-2">
                <span className="text-2xl">{activeChart === 'income' ? '💰' : activeChart === 'expense' ? '💸' : '📊'}</span>
                {chartConfig.title}
              </h3>
              <button onClick={() => setActiveChart(null)} className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:bg-black/10">✕</button>
            </div>
            
            {/* Body Modal (Grid 2 Kolom) */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              
              {/* KOLOM KIRI: CHART */}
              <div className="md:col-span-3 h-72 relative flex justify-center items-center">
                <Doughnut data={chartConfig.data} options={options} />
                {/* Teks di tengah Donut */}
                {!chartConfig.isEmpty && (
                   <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                     <span className="text-sm text-gray-400 font-medium">Total</span>
                     <span className="font-bold text-lg lg:text-xl text-gray-700">{formatIDR(chartConfig.totalSum)}</span>
                   </div>
                )}
              </div>

              {/* KOLOM KANAN: CUSTOM LEGEND (DETAIL DATA) */}
              <div className="md:col-span-2 flex flex-col gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {chartConfig.isEmpty ? (
                   <div className="text-center text-gray-400 italic py-10">Belum ada data transaksi untuk ditampilkan.</div>
                ) : (
                  chartConfig.details.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                        <div className="flex flex-col truncate">
                          <span className="font-bold text-gray-700 text-sm truncate">{item.label}</span>
                          <span className="text-xs text-gray-500">{item.percentage}</span>
                        </div>
                      </div>
                      <div className="font-bold text-gray-700 text-sm flex-shrink-0 pl-2">
                        {formatIDR(item.value)}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
            
            {/* Footer Actions */}
            <div className="p-4 bg-gray-50 border-t flex justify-end">
                 <button className="btn px-6" onClick={() => setActiveChart(null)}>Tutup Laporan</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

// --- KOMPONEN KECIL UNTUK KARTU DEPAN (Supaya rapi) ---
function CardStat({ title, value, color, icon, onClick, isBalance }: any) {
  const colors = {
    emerald: { border: 'border-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-100' },
    rose: { border: 'border-rose-500', text: 'text-rose-600', bg: 'bg-rose-100' },
    indigo: { border: 'border-indigo-500', text: 'text-white', bg: 'bg-indigo-600' },
  };
  const c = colors[color as keyof typeof colors];

  return (
    <div onClick={onClick} className={`card shadow-lg cursor-pointer transform transition hover:scale-[1.02] hover:shadow-xl ${isBalance ? c.bg : `bg-white border-l-4 ${c.border}`}`}>
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`card-title text-sm ${isBalance ? 'text-indigo-100' : 'text-gray-500'}`}>{title} 🔍</h2>
            <p className={`text-2xl font-bold ${c.text}`}>
              {isBalance ? '' : color === 'emerald' ? '+' : '-'}
              Rp {(value ?? 0).toLocaleString("id-ID")}
            </p>
          </div>
          <div className={`p-3 rounded-full text-2xl ${isBalance ? 'bg-white/20' : c.bg}`}>{icon}</div>
        </div>
      </div>
    </div>
  );
}