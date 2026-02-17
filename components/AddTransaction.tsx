"use client";

import { useState, useEffect } from "react";
import { createTransaction, getCategories, Category } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AddTransaction() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // State Form
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // Load Kategori saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      getCategories().then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        // Set tanggal default hari ini (YYYY-MM-DD)
        setDate(new Date().toISOString().split('T')[0]);
      });
    }
  }, [isOpen]);

  // Filter kategori berdasarkan tipe (Income/Expense)
  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTransaction({
        type,
        categoryId,
        amount: Number(amount), // Pastikan Number
        description,
        transactionDate: date // Format YYYY-MM-DD
      });

      setIsOpen(false);
      setAmount("");
      setDescription("");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert("Gagal menyimpan! Pastikan semua kolom terisi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold border-none shadow-md flex items-center gap-2 justify-center"
        onClick={() => setIsOpen(true)}
      >
        <span>➕</span> Catat Transaksi Baru
      </button>

      {isOpen && (
        <div className="modal modal-open bg-black/60 backdrop-blur-sm z-50">
          <div className="modal-box shadow-2xl">
            <h3 className="font-bold text-xl mb-6 text-center border-b pb-2">Catat Transaksi Baru</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* PERBAIKAN TOMBOL PILIHAN */}
              <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 rounded-lg">
                <button type="button" 
                  className={`btn border-0 ${type === 'income' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-transparent text-gray-500 hover:bg-gray-200'}`}
                  onClick={() => { setType('income'); setCategoryId(""); }}
                >
                  💰 Pemasukan
                </button>
                <button type="button" 
                  className={`btn border-0 ${type === 'expense' ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-transparent text-gray-500 hover:bg-gray-200'}`}
                  onClick={() => { setType('expense'); setCategoryId(""); }}
                >
                  💸 Pengeluaran
                </button>
              </div>

              {/* DROPDOWN KATEGORI */}
              <div className="form-control">
                <select 
                  className="select select-bordered w-full text-base"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Pilih Kategori {type === 'income' ? 'Pemasukan' : 'Pengeluaran'} --</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {/* Pesan Error jika kosong */}
                {filteredCategories.length === 0 && (
                  <div className="alert alert-warning mt-2 text-xs py-2">
                    <span>⚠️ Belum ada kategori <b>{type}</b>. Silakan buat di menu "Daftar Kategori" diatas.</span>
                  </div>
                )}
              </div>

              {/* ... (Input tanggal, nominal, deskripsi - biarkan sama seperti sebelumnya) ... */}
              
              <input type="date" className="input input-bordered" value={date} onChange={(e) => setDate(e.target.value)} required />
              <input type="number" placeholder="Nominal (Rp)" className="input input-bordered" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              <input type="text" placeholder="Keterangan (Opsional)" className="input input-bordered" value={description} onChange={(e) => setDescription(e.target.value)} />

              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary px-8" disabled={loading || !categoryId}>
                  {loading ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}