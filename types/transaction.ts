import { Category } from "./category";
import { TransactionType } from "./common";

export interface Transaction {
  id: string;
  type: TransactionType;
  categoryId: string;
  category?: Category;
  amount: number;
  description: string;
  transactionDate: string;
}

export interface CreateTransactionDto {
  type: string;
  categoryId: string;
  amount: number;
  description: string;
  transactionDate: string;
}