import { 
  Transaction, 
  Category, 
  DashboardSummary, 
  CreateTransactionDto, 
  CreateCategoryDto 
} from "@/types";

const BASE_URL = "https://task-tracker-api.zeabur.app/api/v1";

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errorMessage = "Terjadi kesalahan";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
    } catch {
      errorMessage = `Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null as T;

  return res.json();
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const data = await fetcher<any>(`${BASE_URL}/categories`, { cache: "no-store" });
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error("Gagal ambil kategori:", error);
    return [];
  }
};

export const createCategory = async (payload: CreateCategoryDto) => {
  return await fetcher(`${BASE_URL}/categories`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const deleteCategory = async (id: string) => {
  return await fetcher(`${BASE_URL}/categories/${id}`, {
    method: "DELETE",
  });
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await fetcher<any>(`${BASE_URL}/transactions`, { cache: "no-store" });
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    return [];
  }
};

export const createTransaction = async (payload: CreateTransactionDto) => {
  return await fetcher(`${BASE_URL}/transactions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const deleteTransaction = async (id: string) => {
  return await fetcher(`${BASE_URL}/transactions/${id}`, {
    method: "DELETE",
  });
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const data = await fetcher<any>(`${BASE_URL}/dashboard/summary`, { cache: "no-store" });
    return data || { totalIncome: 0, totalExpense: 0, balance: 0 };
  } catch (error) {
    return { totalIncome: 0, totalExpense: 0, balance: 0 };
  }
};