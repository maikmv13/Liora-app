# MiCocina - Planificador de Menú Semanal

## Descripción del Proyecto

MiCocina es una aplicación web moderna para la planificación de menús semanales y gestión de listas de compra. Desarrollada con React, TypeScript y Supabase, ofrece una experiencia fluida para organizar las comidas semanales y generar automáticamente listas de compra.

## Estructura del Proyecto

```
/home/project/
├── src/                      # Código fuente principal
│   ├── components/          # Componentes de React
│   │   ├── Favorites/      # Gestión de recetas favoritas
│   │   ├── Login/         # Autenticación de usuarios
│   │   ├── Profile/       # Perfil de usuario y gestión
│   │   ├── ShoppingList/   # Lista de compra
│   │   └── WeeklyMenu2/    # Planificador de menú semanal
│   ├── hooks/              # Hooks personalizados de React
│   ├── lib/                # Configuración de librerías
│   ├── services/           # Servicios y lógica de negocio
│   ├── types/              # Definiciones de TypeScript
│   └── utils/              # Utilidades y helpers
├── supabase/               # Configuración de Supabase
│   └── migrations/         # Migraciones de la base de datos
└── public/                 # Archivos estáticos
```

### Componentes Principales

#### `/src/components/Favorites`
Gestión completa de recetas favoritas:
- `EditRecipeModal.tsx`: Editor de recetas favoritas con campos personalizables
- `NewRecipeModal.tsx`: Formulario para crear nuevas recetas
- `RecipeCard.tsx`: Visualización de recetas con acciones rápidas
- `index.tsx`: Vista principal de favoritos con filtros y búsqueda

#### `/src/components/Login`
Sistema de autenticación:
- `index.tsx`: Formulario de inicio de sesión con soporte para usuarios y nutricionistas

#### `/src/components/Profile`
Gestión de perfil de usuario:
- `AddRecipeForm.tsx`: Formulario para que nutricionistas añadan recetas
- `ProfileHeader.tsx`: Información básica del usuario
- `ProfileStats.tsx`: Estadísticas de uso
- `ProfileActivity.tsx`: Registro de actividad reciente
- `ProfileAchievements.tsx`: Sistema de logros

#### `/src/components/ShoppingList`
Sistema avanzado de lista de compra:
- `CategoryGroup.tsx`: Agrupación de items por categoría
- `EmptyState.tsx`: Vista cuando la lista está vacía
- `Progress.tsx`: Barra de progreso de compra
- `ShoppingItemRow.tsx`: Item individual con acciones
- `index.tsx`: Vista principal con filtros y organización

#### `/src/components/WeeklyMenu2`
Planificador de menú mejorado:
- `DayCard.tsx`: Tarjeta de día con comidas
- `DesktopView.tsx`: Vista optimizada para escritorio
- `MobileView.tsx`: Vista adaptativa para móviles
- `TodayCard.tsx`: Resumen del día actual
- `RecipeSelectorSidebar.tsx`: Selector de recetas
- `MenuHistory.tsx`: Historial de menús anteriores

### Servicios y Lógica de Negocio

#### `/src/services`
- `menuGenerator.ts`: Generación automática de menús balanceados
- `recipes.ts`: Gestión de recetas y búsqueda
- `shoppingList.ts`: Generación y gestión de lista de compra
- `storage.ts`: Gestión de archivos e imágenes
- `weeklyMenu.ts`: Operaciones CRUD para menús semanales

### Hooks Personalizados

#### `/src/hooks`
- `useActiveMenu.ts`: Estado del menú activo
- `useFavorites.ts`: Gestión de recetas favoritas
- `useMenuActions.ts`: Acciones del menú semanal
- `useMenuState.ts`: Estado global del menú
- `useRecipes.ts`: Obtención y filtrado de recetas
- `useShoppingList.ts`: Estado de la lista de compra

### Utilidades

#### `/src/utils`
- `categorizeIngredient.ts`: Categorización automática de ingredientes
- `categoryColors.ts`: Sistema de colores por categoría
- `getUnitPlural.ts`: Pluralización de unidades de medida
- `menuRules.ts`: Reglas para generación de menús

## Requisitos del Sistema

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta en Supabase

## Configuración del Entorno

1. Clonar el repositorio:
```bash
git clone <repositorio>
cd micocina
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Actualizar `.env` con las credenciales de Supabase:
```
VITE_SUPABASE_URL=<tu-url>
VITE_SUPABASE_ANON_KEY=<tu-key>
```

## Nuevas Características

### Sistema de Autenticación
- Soporte para usuarios y nutricionistas
- Perfiles personalizados
- Gestión de sesiones

### Menú Semanal Mejorado
- Vista adaptativa móvil/escritorio
- Historial de menús
- Generación automática inteligente
- Exportación a WhatsApp

### Lista de Compra Avanzada
- Categorización automática
- Progreso de compra
- Agrupación por días
- Sincronización en tiempo real

### Gestión de Recetas
- Sistema de favoritos
- Valoraciones y notas
- Historial de uso
- Información nutricional

## Uso de la API

### Menú Semanal
```typescript
// Generar nuevo menú
const menu = await generateCompleteMenu(recipes);

// Restaurar menú anterior
await restoreMenu(menuId);

// Obtener historial
const history = await getMenuHistory();
```

### Lista de Compra
```typescript
// Generar lista
const list = generateShoppingList(menuItems);

// Marcar item
await toggleItem(itemName, day);

// Actualizar lista
await refreshList();
```

## Consideraciones para Desarrollo

### Base de Datos
- Usar migraciones para cambios estructurales
- Respetar políticas RLS existentes
- Mantener integridad referencial

### Frontend
- Seguir patrones de diseño establecidos
- Mantener compatibilidad móvil
- Utilizar hooks personalizados

### Seguridad
- Validar entradas de usuario
- Respetar políticas de autenticación
- Mantener restricciones RLS

## Tecnologías Principales

- React 18
- TypeScript
- Vite 6.2.2
- Tailwind CSS
- Supabase
- Lucide React (iconos)
- TanStack Virtual (virtualización)

## Notas de Actualización

Se han actualizado las dependencias del proyecto para abordar vulnerabilidades de seguridad. Se recomienda probar la aplicación para asegurar que todas las funcionalidades operan correctamente tras la actualización de Vite a la versión 6.2.2.

## Documentación Adicional

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)