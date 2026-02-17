import axios from "axios";

const BASE_URL = "https://task-tracker-api.zeabur.app/api/v1";

// --- INTERFACES ---
export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  categoryId: string;
  category?: Category;
  amount: number;
  description: string;
  transactionDate: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// --- HELPER: PENGAMBIL DATA PINTAR ---
// Fungsi ini otomatis mencari array data dimanapun ia bersembunyi
const extractData = (response: any) => {
  const body = response.data;
  // Cek apakah data langsung array, atau dibungkus di properti 'data'
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.data)) return body.data;
  return [];
};

// --- FUNGSI API ---

// 1. KATEGORI
export const getCategories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/categories`);
    console.log("Cek Data Kategori:", res.data); // Kita intip di console
    return extractData(res);
  } catch (error) {
    console.error("Gagal ambil kategori:", error);
    return [];
  }
};

export const createCategory = async (name: string, type: string, color: string) => {
  // Langsung return response agar error bisa ditangkap di component
  return await axios.post(`${BASE_URL}/categories`, { name, type, color });
};

export const deleteCategory = async (id: string) => {
  await axios.delete(`${BASE_URL}/categories/${id}`);
};

// 2. TRANSAKSI
export const getTransactions = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/transactions`);
    return extractData(res);
  } catch (error) {
    return [];
  }
};

export const createTransaction = async (payload: any) => {
  return await axios.post(`${BASE_URL}/transactions`, payload);
};

export const deleteTransaction = async (id: string) => {
  await axios.delete(`${BASE_URL}/transactions/${id}`);
};

// 3. DASHBOARD
export const getDashboardSummary = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/summary`);
    // Pastikan return object aman (tidak null)
    return res.data || { totalIncome: 0, totalExpense: 0, balance: 0 };
  } catch (error) {
    return { totalIncome: 0, totalExpense: 0, balance: 0 };
  }
};