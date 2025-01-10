-- Añadir columna category a la tabla ingredients
ALTER TABLE ingredients 
ADD COLUMN IF NOT EXISTS category text;

-- Actualizar las categorías existentes
UPDATE ingredients SET category = 
  CASE 
    WHEN name IN ('Muslos de pollo', 'Pollo entero', 'Carne de cerdo picada') THEN 'Carnes'
    WHEN name IN ('Limón') THEN 'Frutas'
    WHEN name IN ('Mostaza', 'Miel', 'Tomillo', 'Romero', 'Perejil') THEN 'Condimentos'
    WHEN name IN ('Arroz', 'Harina', 'Panko') THEN 'Cereales'
    WHEN name IN ('Brócoli', 'Cebolla', 'Cebolla roja', 'Ajo', 'Pimiento rojo', 'Pimiento verde', 'Patatas') THEN 'Vegetales'
    WHEN name IN ('Salsa barbacoa', 'Vinagre balsámico') THEN 'Salsas'
    WHEN name IN ('Caldo de pollo') THEN 'Caldos'
    ELSE 'Otros'
  END; 