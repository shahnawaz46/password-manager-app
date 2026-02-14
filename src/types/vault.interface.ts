// types/interface
import type { TCategories } from './vault.type';

export interface IVaultItem {
  _id?: string;
  name: string;
  userName: string;
  password: string;
  category: TCategories;
}

export interface IVaultItemPage {
  next: string;
  password: IVaultItem[];
}

export interface IVaultCount {
  category: TCategories;
  count: number;
}
