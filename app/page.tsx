import { getTransactions } from "@/lib/api";
import DashboardStats from "@/components/DashboardStats";
import AddTransaction from "@/components/AddTransaction";
import TransactionList from "@/components/TransactionList";
import CategoryManager from "@/components/CategoryManager";

// Agar data selalu fresh (tidak dicache server)
export const dynamic = "force-dynamic";

export default async function Home() {
  const transactions = await getTransactions();

  const summary = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  };

  if (Array.isArray(transactions)) {
    transactions.forEach((t: any) => {
      const amount = Number(t.amount) || 0;
      if (t.type === 'income') {
        summary.totalIncome += amount;
      } else {
        summary.totalExpense += amount;
      }
    });
  }
  summary.balance = summary.totalIncome - summary.totalExpense;

  return (
    <div className="min-h-screen pb-10 bg-gray-50">
      
      {/* 1. NAVBAR */}
      <div className="navbar bg-indigo-600 text-white shadow-lg mb-8">
        <div className="container mx-auto px-4">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl font-bold tracking-wider">
              💸 MoneyManager
            </a>
          </div>
          <div className="flex-none">
            <div className="avatar placeholder">
              <div className="bg-indigo-400 text-white rounded-full w-10">
                <span className="text-xs">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KONTEN UTAMA */}
      <main className="container mx-auto px-4">
        
        {/* Judul */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Keuangan</h1>
          <p className="text-gray-500 text-sm">Pantau arus kas Anda hari ini.</p>
        </div>

        {/* Statistik Row (Data dari hitungan manual) */}
        <DashboardStats summary={summary} transactions={Array.isArray(transactions) ? transactions : []} />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: Menu Aksi */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card Aksi Cepat */}
            <div className="card bg-white shadow-lg border border-gray-100">
              <div className="card-body">
                <h2 className="card-title text-gray-700 text-lg mb-4">Aksi Cepat</h2>
                <div className="flex flex-col gap-4">
                  <AddTransaction />
                  <div className="divider my-0"></div>
                  <CategoryManager />
                </div>
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: Tabel Riwayat */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">Riwayat Transaksi</h2>
              <button className="btn btn-xs btn-ghost text-indigo-600">Lihat Semua</button>
            </div>
            
            {/* Kirim data transaksi ke tabel */}
            <TransactionList transactions={Array.isArray(transactions) ? transactions : []} />
          </div>

        </div>
      </main>
    </div>
  );
}