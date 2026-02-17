import axios from "axios";

const BASE_URL = "https://task-tracker-api.zeabur.app/api/v1";

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

const extractData = (response: any) => {
  const body = response.data;
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.data)) return body.data;
  return [];
};


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
  return await axios.post(`${BASE_URL}/categories`, { name, type, color });
};

export const deleteCategory = async (id: string) => {
  await axios.delete(`${BASE_URL}/categories/${id}`);
};

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

export const getDashboardSummary = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/summary`);
    return res.data || { totalIncome: 0, totalExpense: 0, balance: 0 };
  } catch (error) {
    return { totalIncome: 0, totalExpense: 0, balance: 0 };
  }
};