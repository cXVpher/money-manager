import { TransactionType } from "./common";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface CreateCategoryDto {
  name: string;
  type: string;
  color: string;
}