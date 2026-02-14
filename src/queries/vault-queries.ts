// types/interface
import type { InfiniteData } from '@tanstack/react-query';
import type {
  IVaultCount,
  IVaultItem,
  IVaultItemPage,
} from '@/types/vault.interface';
import type { TCategories } from '@/types/vault.type';

export const deleteVaultItemFromInfiteQuery = (
  oldData: InfiniteData<IVaultItemPage> | undefined,
  id: string,
) => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map(page => ({
      ...page,
      password: page.password.filter(item => item._id !== id),
    })),
  };
};

export const updateInfiniteQueryVault = (
  oldData: InfiniteData<IVaultItemPage> | undefined,
  newItem: IVaultItem,
) => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page, index) => {
      if (index !== 0) return page;

      return {
        ...page,
        password: [newItem, ...(page.password ?? [])],
      };
    }),
  };
};

export const updateVaultCount = (
  oldData: IVaultCount[] | undefined,
  category: TCategories,
  operation: 'ADD' | 'SUB',
) => {
  if (!oldData) return oldData;

  return oldData.map(vault => {
    if (vault.category === category) {
      const updatedCount =
        operation === 'ADD' ? vault.count + 1 : vault.count - 1;

      return { ...vault, count: Math.max(0, updatedCount) };
    }

    return vault;
  });
};
