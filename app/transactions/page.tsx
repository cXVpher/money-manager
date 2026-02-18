import { getTransactions } from "@/lib/api";
import TransactionList from "@/components/TransactionList";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="navbar bg-indigo-600 text-white shadow-lg mb-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="btn btn-ghost text-xl font-bold">
            ⬅ Kembali ke Dashboard
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Semua Riwayat Transaksi</h1>
        <TransactionList transactions={Array.isArray(transactions) ? transactions : []} />
      </main>
    </div>
  );
}