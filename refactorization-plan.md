# Plan de Refactorización Liora App

## Problemas Detectados

Después de eliminar el módulo HealthTracker, surgieron varios problemas de tipos que fueron temporalmente resueltos usando `as any` y haciendo menos estrictas las comprobaciones de tipo en `tsconfig.app.json`.

## Progreso Actual

Se han realizado los siguientes cambios:

- Actualizada la interfaz `MenuItem` para incluir la propiedad `day`
- Corregida la interfaz `Recipe` para permitir que `calories` sea de tipo `string` o `number`
- Añadida definición de `FavoriteRecipe` en `types.ts` unificada
- Actualizada la interfaz en `RecipeContext.tsx` 
- Añadida interfaz de props en `WeeklyMenu2/index.tsx`
- Actualizado el componente `Favorites/index.tsx` para aceptar props
- Corregida la firma de función en `useActiveMenu.ts`
- Eliminadas definiciones duplicadas de `FavoriteRecipe` en:
  - `src/types/index.ts`
  - `src/types/recipe.ts`
- Actualizado `useFavorites.ts` para usar la definición unificada de `FavoriteRecipe`
- Actualizado `useRequiredFavorites.ts` para usar mensajes de consola en lugar de notificaciones
- Ampliada la interfaz `Recipe` para incluir todos los campos necesarios de la implementación anterior
- Actualizado `RecipeDetail` para usar `FavoriteRecipe` correctamente
- Actualizado `RecipeCard` para aceptar tanto `Recipe` como `FavoriteRecipe`
- Actualizado `RecipeGrid` para usar correctamente los IDs de `FavoriteRecipe`
- Corregidos varios usos de `as any` en `App.tsx`
- Actualizado `MemberFavoritesList` para usar correctamente `recipe_id` de `FavoriteRecipe`
- Añadido campo `member_name` a la interfaz `FavoriteRecipe`
- Eliminado `as any` restante en la gestión del menú semanal en `App.tsx`

## Problemas Pendientes

1. **Inconsistencias en la estructura de datos**
   - Algunos componentes todavía pueden usar propiedades obsoletas
   - Hay lugares donde todavía se usa `favorite_id` en lugar de `id`

2. **Problemas de tipo restantes**
   - Todavía hay varios usos de `as any` en el código que deben ser eliminados
   - Algunas interfaces están definidas localmente y deberían ser consolidadas
   - La estricticidad de tipos está reducida en `tsconfig.app.json`

## Próximos Pasos para la Refactorización

### 1. Continuar revisando componentes que utilizan FavoriteRecipe

1. ✅ Actualizar `RecipeDetail` para usar la definición unificada de `FavoriteRecipe`
2. ✅ Actualizar `RecipeCard` para trabajar tanto con `Recipe` como con `FavoriteRecipe`
3. ✅ Revisar otros componentes como `MemberFavoritesList`, `RecipeList`, etc.

### 2. Limpiar Castings de Tipo

1. ✅ Identificar y eliminar varios usos de `as any` importantes
2. Continuar eliminando aserciones de tipo restantes en otros archivos:
   - Revisar `usePWA.ts`
   - Revisar `StaticPlate.tsx`
   - Actualizar interfaces según sea necesario para hacer más explícitos los tipos

### 3. Revisar Hooks Personalizados

1. Revisar todos los hooks personalizados para asegurar la consistencia en el uso de tipos
2. Comprobar específicamente `useShoppingList`, `useRecipes` y otros hooks importantes

### 4. Restaurar la Estricticidad de Tipos

1. Restaurar las configuraciones estrictas en `tsconfig.app.json` poco a poco
2. Probar la aplicación después de cada cambio

## Beneficios Esperados

- Mayor seguridad de tipos en toda la aplicación
- Documentación más clara a través de interfaces bien definidas
- Refactorizaciones futuras más fáciles gracias a los tipos correctos
- Detección temprana de errores durante el desarrollo

## Notas Adicionales

- Esta refactorización no debe cambiar el comportamiento de la aplicación
- Debería realizarse en una rama separada y someterse a pruebas exhaustivas antes de fusionarse
- Se recomienda realizar esta refactorización en etapas para facilitar la detección y resolución de problemas 