import { getTransactions } from "@/lib/api";
import { Transaction } from "@/types";
import DashboardStats from "@/components/DashboardStats";
import AddTransaction from "@/components/AddTransaction";
import TransactionList from "@/components/TransactionList";
import CategoryManager from "@/components/CategoryManager";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const transactions: Transaction[] = await getTransactions();

  const summary = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  };

  if (Array.isArray(transactions)) {
    transactions.forEach((t) => {
      const amount = Number(t.amount) || 0;
      if (t.type === 'income') {
        summary.totalIncome += amount;
      } else {
        summary.totalExpense += amount;
      }
    });
  }
  summary.balance = summary.totalIncome - summary.totalExpense;

  const recentTransactions = Array.isArray(transactions) 
    ? [...transactions].reverse().slice(0, 5) 
    : [];

  return (
    <div className="min-h-screen pb-10 bg-gray-50">
      
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

      <main className="container mx-auto px-4">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Keuangan</h1>
          <p className="text-gray-500 text-sm">Pantau arus kas Anda hari ini.</p>
        </div>

        <DashboardStats summary={summary} transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            
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

          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">Riwayat Terkini</h2>
              
              <Link 
                href="/transactions" 
                className="btn btn-xs btn-ghost text-indigo-600 hover:bg-indigo-50"
              >
                Lihat Semua ({transactions.length}) 👉
              </Link>
            </div>
            
            <TransactionList transactions={recentTransactions} />
          </div>

        </div>
      </main>
    </div>
  );
}