import { useActiveMenu } from './useActiveMenu';

export function useWeeklyMenu(userId?: string) {
  return useActiveMenu(userId);
} 