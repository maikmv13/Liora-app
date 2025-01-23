import { useState } from 'react';
import { useShoppingList } from '../../../hooks/useShoppingList';
import { useActiveProfile } from '../../../hooks/useActiveProfile';

export function useShoppingListState() {
  const { id: userId, isHousehold } = useActiveProfile();
  const { refreshList } = useShoppingList(userId, isHousehold);
  const [showCompleted, setShowCompleted] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');
  const [servings, setServings] = useState(2);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshList();
    } catch (error) {
      console.error('Error refreshing shopping list:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return {
    showCompleted,
    setShowCompleted,
    expandedCategories,
    setExpandedCategories,
    viewMode,
    setViewMode,
    selectedDay,
    setSelectedDay,
    servings,
    setServings,
    refreshing,
    handleRefresh
  };
}