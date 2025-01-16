export function useMenuState(userId?: string) {
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');
  const [currentMenuId, setCurrentMenuId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<ExtendedWeeklyMenuDB | null>(null);
  
  // ... otros estados

  const handleRecipeSelect = useCallback(async (recipe: Recipe | null, day: string, meal: MealType) => {
    try {
      if (!activeMenu?.id) {
        throw new Error('No hay un menú activo');
      }

      await handleUpdateMenuRecipe(activeMenu.id, day, meal, recipe?.id);
      
      // Recargar el menú activo después de la actualización
      const updatedMenu = await getActiveMenu(userId);
      if (updatedMenu) {
        setActiveMenu(updatedMenu);
        const menuItems = await convertDBToMenuItems(updatedMenu);
        // Actualizar el estado local
        onAddToMenu(menuItems);
      }
    } catch (error) {
      console.error('Error selecting recipe:', error);
    }
  }, [activeMenu, userId, onAddToMenu]);

  return {
    selectedDay,
    setSelectedDay,
    currentMenuId,
    setCurrentMenuId,
    activeMenu,
    setActiveMenu,
    handleRecipeSelect,
    // ... otros valores
  };
} 