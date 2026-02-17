"use client";

import { useState, useEffect } from "react";
import { createCategory, getCategories, deleteCategory, Category } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CategoryManager() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false); // Tambah status loading
  
  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [color, setColor] = useState("#EF4444"); 

  const fetchCats = async () => {
    const data = await getCategories();
    setCategories(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Mulai loading
    
    try {
      // Kirim data ke API
      await createCategory(name, type, color);
      
      // Jika berhasil:
      setName("");
      setIsOpen(false);
      fetchCats(); 
      router.refresh(); 
      alert("✅ Sukses! Kategori berhasil dibuat.");
      
    } catch (error: any) {
      // --- DETEKTIF ERROR ---
      // Kita ambil pesan error asli dari Server (Backend)
      const serverMessage = error.response?.data?.message || JSON.stringify(error.response?.data);
      console.error("Detail Error:", error.response);
      
      // Tampilkan ke user
      alert(`❌ Gagal: ${serverMessage || "Cek Console Browser untuk detail."}`);
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm("Yakin hapus kategori ini?")) {
      await deleteCategory(id);
      fetchCats();
      router.refresh();
    }
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-500">Daftar Kategori</h3>
        <button onClick={() => setIsOpen(true)} className="btn btn-xs btn-outline">
          + Atur Kategori
        </button>
      </div>

      {/* List Kategori */}
      <div className="flex gap-2 flex-wrap mb-4">
        {categories.length === 0 ? (
          <span className="text-xs text-gray-400 italic">Belum ada kategori. Klik '+ Atur Kategori'</span>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="badge gap-2 p-3 text-white shadow-sm border-0" style={{backgroundColor: cat.color}}>
              <span className="text-xs font-bold opacity-80 uppercase tracking-tighter">
                {cat.type === 'income' ? '(IN)' : '(OUT)'}
              </span>
              {cat.name}
              <button onClick={() => handleDelete(cat.id)} className="ml-1 hover:text-black font-bold">x</button>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah Kategori */}
      {isOpen && (
        <div className="modal modal-open bg-black/50 z-50">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Buat Kategori Baru</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              
              {/* Nama Kategori */}
              <div className="form-control">
                <label className="label-text mb-1">Nama Kategori</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Gaji, Makan, Transport" 
                  className="input input-bordered w-full" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>

              {/* Tipe (Pemasukan/Pengeluaran) */}
              <div className="form-control">
                <label className="label-text mb-1">Jenis</label>
                <select 
                  className="select select-bordered w-full" 
                  value={type} 
                  onChange={e => setType(e.target.value)}
                >
                  <option value="expense">Pengeluaran (Expense)</option>
                  <option value="income">Pemasukan (Income)</option>
                </select>
              </div>

              {/* Warna Label */}
              <div className="form-control">
                <label className="label-text mb-1">Warna Label</label>
                <div className="flex gap-3 items-center border p-2 rounded-lg">
                  <input 
                    type="color" 
                    className="h-10 w-14 cursor-pointer" 
                    value={color} 
                    onChange={e => setColor(e.target.value)} 
                  />
                  <span className="text-sm text-gray-500">{color}</span>
                </div>
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setIsOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}