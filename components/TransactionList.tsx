"use client";

import { Transaction, deleteTransaction } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if(confirm("Hapus data ini?")) {
      await deleteTransaction(id);
      router.refresh();
    }
  }

  return (
    <div className="card bg-white shadow-xl">
      <div className="card-body p-0">
        <div className="overflow-x-auto rounded-xl">
          <table className="table table-zebra w-full">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="py-4">Tanggal</th>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th className="text-right">Nominal</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 italic">
                    Belum ada transaksi tercatat.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="font-medium text-gray-500">{t.transactionDate}</td>
                    <td>
                      <span className={`badge border-0 font-bold text-white p-3 ${
                        t.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}>
                        {t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                    </td>
                    <td className="text-gray-700 font-medium">{t.description || "-"}</td>
                    <td className={`text-right font-bold text-lg ${
                      t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="text-center">
                      <button 
                        onClick={() => handleDelete(t.id)} 
                        className="btn btn-sm btn-ghost text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}