import { Recipe, MenuItem } from '../types';

export const MOCK_RECIPES: Recipe[] = [
    {
        id: '1',
        name: 'Ensalada Mediterránea con Garbanzos',
        description: 'Una ensalada fresca y nutritiva con pepino, tomates cherry, aceitunas kalamata y garbanzos.',
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        servings: 2,
        prep_time: '15 min',
        meal_type: 'comida',
        category: 'Ensaladas',
        calories: '350',
        proteins: '12g',
        carbohydrates: '45g',
        fats: '15g',
        recipe_ingredients: [
            { id: 'ri1', recipe_id: '1', ingredient_id: 'i1', quantity: 1, unit: 'unidad', ingredients: { id: 'i1', name: 'Pepino', category: 'Vegetales y Legumbres' } },
            { id: 'ri2', recipe_id: '1', ingredient_id: 'i2', quantity: 200, unit: 'gramo', ingredients: { id: 'i2', name: 'Tomates cherry', category: 'Vegetales y Legumbres' } },
            { id: 'ri3', recipe_id: '1', ingredient_id: 'i3', quantity: 1, unit: 'unidad', ingredients: { id: 'i3', name: 'Garbanzos cocidos', category: 'Vegetales y Legumbres' } }
        ],
        instructions: { '1': 'Lavar y picar los pepinos y tomates cherry.', '2': 'Enjuagar los garbanzos cocidos.', '3': 'Mezclar todos los ingredientes en un bol grande.', '4': 'Aliñar con aceite de oliva virgen extra, limón y sal.' },
        tags: ['Saludable', 'Vegano', 'Rápido']
    } as any,
    {
        id: '2',
        name: 'Pollo al Curry con Arroz Integral',
        description: 'Tiernos trozos de pechuga de pollo en una salsa cremosa de curry servidos con arroz integral.',
        image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
        servings: 4,
        prep_time: '35 min',
        meal_type: 'comida',
        category: 'Aves',
        calories: '520',
        proteins: '35g',
        carbohydrates: '60g',
        fats: '18g',
        recipe_ingredients: [
            { id: 'ri4', recipe_id: '2', ingredient_id: 'i4', quantity: 2, unit: 'unidad', ingredients: { id: 'i4', name: 'Pechuga de pollo', category: 'Carnicería' } },
            { id: 'ri5', recipe_id: '2', ingredient_id: 'i5', quantity: 200, unit: 'mililitro', ingredients: { id: 'i5', name: 'Leche de coco', category: 'Líquidos y Caldos' } },
            { id: 'ri6', recipe_id: '2', ingredient_id: 'i6', quantity: 200, unit: 'gramo', ingredients: { id: 'i6', name: 'Arroz integral', category: 'Cereales y Derivados' } }
        ],
        instructions: { '1': 'Saltear el pollo en cubos hasta que esté dorado.', '2': 'Añadir cebolla, ajo y especias de curry.', '3': 'Verter leche de coco y dejar reducir.', '4': 'Servir sobre una cama de arroz integral cocido.' },
        tags: ['Proteico', 'Saciante']
    } as any,
    {
        id: '3',
        name: 'Tostada de Aguacate y Huevo Poché',
        description: 'El desayuno clásico renovado con pan de masa madre, aguacate cremoso y huevo a baja temperatura.',
        image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8',
        servings: 1,
        prep_time: '10 min',
        meal_type: 'desayuno',
        category: 'Huevos',
        calories: '280',
        proteins: '15g',
        carbohydrates: '22g',
        fats: '16g',
        recipe_ingredients: [
            { id: 'ri7', recipe_id: '3', ingredient_id: 'i7', quantity: 1, unit: 'unidad', ingredients: { id: 'i7', name: 'Aguacate', category: 'Frutas' } },
            { id: 'ri8', recipe_id: '3', ingredient_id: 'i8', quantity: 1, unit: 'unidad', ingredients: { id: 'i8', name: 'Huevo', category: 'Otras Categorías' } },
            { id: 'ri9', recipe_id: '3', ingredient_id: 'i9', quantity: 1, unit: 'rebanada', ingredients: { id: 'i9', name: 'Pan de masa madre', category: 'Cereales y Derivados' } }
        ],
        instructions: { '1': 'Tostar la rebanada de pan.', '2': 'Aplastar el aguacate con un poco de lima y sal.', '3': 'Preparar el huevo poché en agua hirviendo.', '4': 'Montar la tostada y añadir semillas de sésamo.' },
        tags: ['Desayuno', 'Energético']
    } as any,
    {
        id: '4',
        name: 'Salmón a la Plancha con Espárragos',
        description: 'Filete de salmón fresco cocinado en su punto con espárragos trigueros al dente.',
        image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
        servings: 2,
        prep_time: '20 min',
        meal_type: 'cena',
        category: 'Pescados',
        calories: '410',
        proteins: '32g',
        carbohydrates: '10g',
        fats: '28g',
        recipe_ingredients: [
            { id: 'ri10', recipe_id: '4', ingredient_id: 'i10', quantity: 2, unit: 'unidad', ingredients: { id: 'i10', name: 'Filete de salmón', category: 'Pescadería' } },
            { id: 'ri11', recipe_id: '4', ingredient_id: 'i11', quantity: 1, unit: 'unidad', ingredients: { id: 'i11', name: 'Espárragos trigueros', category: 'Vegetales y Legumbres' } }
        ],
        instructions: { '1': 'Sellar el salmón por el lado de la piel.', '2': 'Cocinar los espárragos con un chorrito de aceite.', '3': 'Añadir rodajas de limón para aromatizar.', '4': 'Emplatar y disfrutar caliente.' },
        tags: ['Omega-3', 'Cena Ligera']
    } as any,
    {
        id: '5',
        name: 'Smoothie Bowl de Frutos Rojos',
        description: 'Un bol refrescante lleno de antioxidantes con base de yogur griego y toppings crujientes.',
        image_url: 'https://images.unsplash.com/photo-1494597564530-897f5a211ce7',
        servings: 1,
        prep_time: '5 min',
        meal_type: 'desayuno',
        category: 'Otros',
        calories: '320',
        proteins: '18g',
        carbohydrates: '40g',
        fats: '12g',
        recipe_ingredients: [
            { id: 'ri12', recipe_id: '5', ingredient_id: 'i12', quantity: 125, unit: 'gramo', ingredients: { id: 'i12', name: 'Frutos rojos', category: 'Frutas' } },
            { id: 'ri13', recipe_id: '5', ingredient_id: 'i13', quantity: 1, unit: 'unidad', ingredients: { id: 'i13', name: 'Yogur griego', category: 'Lácteos, Huevos y Derivados' } }
        ],
        instructions: { '1': 'Batir los frutos rojos congelados con el yogur.', '2': 'Verter en un bol ancho.', '3': 'Decorar con granola, chía y fruta fresca.' },
        tags: ['Antioxidante', 'Vistoso']
    } as any,
    {
        id: '6',
        name: 'Pasta Primavera con Verduras',
        description: 'Espaguetis al dente salteados con calabacín, zanahoria y guisantes frescos.',
        image_url: 'https://images.unsplash.com/photo-1473093226795-af9932fe5855',
        servings: 3,
        prep_time: '25 min',
        meal_type: 'comida',
        category: 'Pastas y Arroces',
        calories: '450',
        proteins: '14g',
        carbohydrates: '65g',
        fats: '10g',
        recipe_ingredients: [
            { id: 'ri14', recipe_id: '6', ingredient_id: 'i14', quantity: 250, unit: 'gramo', ingredients: { id: 'i14', name: 'Pasta', category: 'Cereales y Derivados' } },
            { id: 'ri15', recipe_id: '6', ingredient_id: 'i15', quantity: 1, unit: 'unidad', ingredients: { id: 'i15', name: 'Calabacín', category: 'Vegetales y Legumbres' } }
        ],
        instructions: { '1': 'Cocer la pasta.', '2': 'Saltear las verduras.', '3': 'Mezclar y añadir parmesano.' },
        tags: ['Vegetariano', 'Familiar']
    } as any,
    {
        id: '7',
        name: 'Tacos de Lentejas',
        description: 'Una alternativa vegetal a los tacos tradicionales, llenos de sabor y fibra.',
        image_url: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
        servings: 4,
        prep_time: '30 min',
        meal_type: 'cena',
        category: 'Legumbres',
        calories: '380',
        proteins: '18g',
        carbohydrates: '50g',
        fats: '14g',
        recipe_ingredients: [
            { id: 'ri16', recipe_id: '7', ingredient_id: 'i16', quantity: 1, unit: 'unidad', ingredients: { id: 'i16', name: 'Lentejas cocidas', category: 'Vegetales y Legumbres' } },
            { id: 'ri17', recipe_id: '7', ingredient_id: 'i17', quantity: 4, unit: 'unidad', ingredients: { id: 'i17', name: 'Tortillas de maíz', category: 'Cereales y Derivados' } }
        ],
        instructions: { '1': 'Cocinar las lentejas.', '2': 'Calentar tortillas.', '3': 'Montar con aguacate.' },
        tags: ['Vegano', 'Sin Gluten']
    } as any,
    {
        id: '8',
        name: 'Pancakes de Avena',
        description: 'Tortitas esponjosas sin azúcar refinado, perfectas para desayunar.',
        image_url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93',
        servings: 2,
        prep_time: '15 min',
        meal_type: 'desayuno',
        category: 'Otros',
        calories: '310',
        proteins: '10g',
        carbohydrates: '45g',
        fats: '8g',
        recipe_ingredients: [
            { id: 'ri18', recipe_id: '8', ingredient_id: 'i18', quantity: 100, unit: 'gramo', ingredients: { id: 'i18', name: 'Avena en copos', category: 'Cereales y Derivados' } },
            { id: 'ri19', recipe_id: '8', ingredient_id: 'i19', quantity: 1, unit: 'unidad', ingredients: { id: 'i19', name: 'Plátano', category: 'Frutas' } }
        ],
        instructions: { '1': 'Triturar ingredientes.', '2': 'Cocinar a la plancha.', '3': 'Servir con miel.' },
        tags: ['Sin Azúcar', 'Fit']
    } as any,
    {
        id: '9',
        name: 'Bowl de Quinoa y Atún',
        description: 'Atún fresco marcado a la plancha sobre base de quinoa.',
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        servings: 2,
        prep_time: '25 min',
        meal_type: 'comida',
        category: 'Pescados',
        calories: '480',
        proteins: '38g',
        carbohydrates: '35g',
        fats: '18g',
        recipe_ingredients: [
            { id: 'ri20', recipe_id: '9', ingredient_id: 'i20', quantity: 200, unit: 'gramo', ingredients: { id: 'i20', name: 'Atún fresco', category: 'Pescadería' } },
            { id: 'ri21', recipe_id: '9', ingredient_id: 'i21', quantity: 100, unit: 'gramo', ingredients: { id: 'i21', name: 'Quinoa', category: 'Cereales y Derivados' } }
        ],
        instructions: { '1': 'Cocer quinoa.', '2': 'Marcar atún.', '3': 'Aliñar con soja.' },
        tags: ['Gourmet', 'Proteína']
    } as any,
    {
        id: '10',
        name: 'Hummus de Remolacha',
        description: 'Un snack colorido y saludable.',
        image_url: 'https://images.unsplash.com/photo-1541529086526-db283c563270',
        servings: 4,
        prep_time: '10 min',
        meal_type: 'snack',
        category: 'Otros',
        calories: '150',
        proteins: '6g',
        carbohydrates: '18g',
        fats: '7g',
        recipe_ingredients: [
            { id: 'ri22', recipe_id: '10', ingredient_id: 'i22', quantity: 1, unit: 'unidad', ingredients: { id: 'i22', name: 'Garbanzos', category: 'Vegetales y Legumbres' } },
            { id: 'ri23', recipe_id: '10', ingredient_id: 'i23', quantity: 1, unit: 'unidad', ingredients: { id: 'i23', name: 'Remolacha cocida', category: 'Vegetales y Legumbres' } }
        ],
        instructions: { '1': 'Triturar garbanzos y remolacha.', '2': 'Añadir tahini y limón.', '3': 'Servir frío.' },
        tags: ['Snack', 'Detox']
    } as any,
    {
        id: '11',
        name: 'Lasaña de Berenjena',
        description: 'Láminas de berenjena asada con espinacas.',
        image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3',
        servings: 4,
        prep_time: '45 min',
        meal_type: 'comida',
        category: 'Otros',
        calories: '380',
        proteins: '14g',
        carbohydrates: '25g',
        fats: '22g',
        recipe_ingredients: [
            { id: 'ri24', recipe_id: '11', ingredient_id: 'i24', quantity: 2, unit: 'unidad', ingredients: { id: 'i24', name: 'Berenjena', category: 'Vegetales y Legumbres' } },
            { id: 'ri25', recipe_id: '11', ingredient_id: 'i25', quantity: 300, unit: 'gramo', ingredients: { id: 'i25', name: 'Espinacas frescas', category: 'Vegetales y Legumbres' } }
        ],
        instructions: { '1': 'Asar berenjena.', '2': 'Preparar el relleno.', '3': 'Hornear.' },
        tags: ['Bajo en Carbohidratos', 'Vegano']
    } as any,
    {
        id: '12',
        name: 'Crema de Calabaza',
        description: 'Reconfortante con jengibre y coco.',
        image_url: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a',
        servings: 3,
        prep_time: '30 min',
        meal_type: 'cena',
        category: 'Otros',
        calories: '220',
        proteins: '4g',
        carbohydrates: '30g',
        fats: '10g',
        recipe_ingredients: [
            { id: 'ri26', recipe_id: '12', ingredient_id: 'i26', quantity: 500, unit: 'gramo', ingredients: { id: 'i26', name: 'Calabaza', category: 'Vegetales y Legumbres' } },
            { id: 'ri27', recipe_id: '12', ingredient_id: 'i27', quantity: 1, unit: 'unidad', ingredients: { id: 'i27', name: 'Jengibre', category: 'Condimentos y Especias' } }
        ],
        instructions: { '1': 'Sofreír verduras.', '2': 'Cocer con caldo.', '3': 'Triturar con coco.' },
        tags: ['Light', 'Cena']
    } as any,
    {
        id: '13',
        name: 'Muesli Bircher',
        description: 'Avena remojada con manzana.',
        image_url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf',
        servings: 1,
        prep_time: '5 min',
        meal_type: 'desayuno',
        category: 'Otros',
        calories: '340',
        proteins: '12g',
        carbohydrates: '50g',
        fats: '12g',
        recipe_ingredients: [
            { id: 'ri28', recipe_id: '13', ingredient_id: 'i18', quantity: 50, unit: 'gramo', ingredients: { id: 'i18', name: 'Avena en copos', category: 'Cereales y Derivados' } },
            { id: 'ri29', recipe_id: '13', ingredient_id: 'i29', quantity: 1, unit: 'unidad', ingredients: { id: 'i29', name: 'Manzana', category: 'Frutas' } }
        ],
        instructions: { '1': 'Remojar avena.', '2': 'Añadir fruta rallada.', '3': 'Aliñar con canela.' },
        tags: ['Healthy', 'Breakfast']
    } as any,
    {
        id: '14',
        name: 'Pizza Fit de Coliflor',
        description: 'Base ligera y deliciosa.',
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
        servings: 2,
        prep_time: '40 min',
        meal_type: 'cena',
        category: 'Otros',
        calories: '390',
        proteins: '22g',
        carbohydrates: '15g',
        fats: '28g',
        recipe_ingredients: [
            { id: 'ri30', recipe_id: '14', ingredient_id: 'i30', quantity: 1, unit: 'unidad', ingredients: { id: 'i30', name: 'Coliflor', category: 'Vegetales y Legumbres' } },
            { id: 'ri31', recipe_id: '14', ingredient_id: 'i31', quantity: 2, unit: 'unidad', ingredients: { id: 'i31', name: 'Mozzarella fresca', category: 'Lácteos, Huevos y Derivados' } }
        ],
        instructions: { '1': 'Preparar base.', '2': 'Añadir toppings.', '3': 'Hornear.' },
        tags: ['Low Carb', 'Pizza']
    } as any,
    {
        id: '15',
        name: 'Risotto de Setas y Trufa',
        description: 'Cremoso arroz con aroma a bosque.',
        image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
        servings: 2,
        prep_time: '30 min',
        meal_type: 'comida',
        category: 'Pastas y Arroces',
        calories: '420',
        proteins: '8g',
        carbohydrates: '60g',
        fats: '15g',
        recipe_ingredients: [
            { id: 'ri32', recipe_id: '15', ingredient_id: 'i32', quantity: 200, unit: 'gramo', ingredients: { id: 'i32', name: 'Arroz arborio', category: 'Cereales y Derivados' } },
            { id: 'ri33', recipe_id: '15', ingredient_id: 'i33', quantity: 150, unit: 'gramo', ingredients: { id: 'i33', name: 'Setas variadas', category: 'Vegetales y Legumbres' } }
        ],
        instructions: { '1': 'Sofreír cebolla y setas.', '2': 'Añadir arroz y caldo poco a poco.', '3': 'Mantecar con parmesano y aceite de trufa.' },
        tags: ['Vegetariano', 'Gourmet']
    } as any,
    {
        id: '16',
        name: 'Poke Bowl de Salmón',
        description: 'Arroz de sushi con salmón marinado y edamame.',
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        servings: 1,
        prep_time: '20 min',
        meal_type: 'comida',
        category: 'Pescados',
        calories: '510',
        proteins: '28g',
        carbohydrates: '55g',
        fats: '14g',
        recipe_ingredients: [
            { id: 'ri34', recipe_id: '16', ingredient_id: 'i34', quantity: 150, unit: 'gramo', ingredients: { id: 'i34', name: 'Salmón fresco', category: 'Pescadería' } },
            { id: 'ri35', recipe_id: '16', ingredient_id: 'i35', quantity: 100, unit: 'gramo', ingredients: { id: 'i35', name: 'Arroz de sushi', category: 'Cereales y Derivados' } }
        ],
        instructions: { '1': 'Marinar salmón.', '2': 'Cocer arroz.', '3': 'Montar bowl con toppings.' },
        tags: ['Fresco', 'Trendy']
    } as any,
    {
        id: '17',
        name: 'Shakshuka con Feta',
        description: 'Huevos escalfados en salsa de tomate picante.',
        image_url: 'https://images.unsplash.com/photo-1590412200988-a436bb7050a4',
        servings: 2,
        prep_time: '25 min',
        meal_type: 'desayuno',
        category: 'Huevos',
        calories: '320',
        proteins: '18g',
        carbohydrates: '15g',
        fats: '22g',
        recipe_ingredients: [
            { id: 'ri36', recipe_id: '17', ingredient_id: 'i36', quantity: 4, unit: 'unidad', ingredients: { id: 'i36', name: 'Huevos', category: 'Otras Categorías' } },
            { id: 'ri37', recipe_id: '17', ingredient_id: 'i37', quantity: 500, unit: 'gramo', ingredients: { id: 'i37', name: 'Tomate triturado', category: 'Vegetales y Legumbres' } }
        ],
        instructions: { '1': 'Preparar salsa especiada.', '2': 'Escalfar huevos encima.', '3': 'Añadir feta y cilantro.' },
        tags: ['Middle East', 'Spicy']
    } as any,
    {
        id: '18',
        name: 'Dorada al Horno con Patatas',
        description: 'Plato tradicional de pescado al horno.',
        image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
        servings: 2,
        prep_time: '40 min',
        meal_type: 'cena',
        category: 'Pescados',
        calories: '450',
        proteins: '35g',
        carbohydrates: '30g',
        fats: '18g',
        recipe_ingredients: [
            { id: 'ri38', recipe_id: '18', ingredient_id: 'i38', quantity: 1, unit: 'unidad', ingredients: { id: 'i38', name: 'Dorada', category: 'Pescadería' } },
            { id: 'ri39', recipe_id: '18', ingredient_id: 'i39', quantity: 2, unit: 'unidad', ingredients: { id: 'i39', name: 'Patatas', category: 'Vegetales y Legumbres' } }
        ],
        instructions: { '1': 'Cortar patatas panadera.', '2': 'Colocar pescado encima.', '3': 'Hornear con limón.' },
        tags: ['Saludable', 'Clásico']
    } as any,
    {
        id: '19',
        name: 'Gnocchi con Pesto de Albahaca',
        description: 'Gnocchi de patata suaves con salsa casera.',
        image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
        servings: 3,
        prep_time: '20 min',
        meal_type: 'comida',
        category: 'Pastas y Arroces',
        calories: '480',
        proteins: '10g',
        carbohydrates: '70g',
        fats: '18g',
        recipe_ingredients: [
            { id: 'ri40', recipe_id: '19', ingredient_id: 'i40', quantity: 500, unit: 'gramo', ingredients: { id: 'i40', name: 'Gnocchi', category: 'Cereales y Derivados' } },
            { id: 'ri41', recipe_id: '19', ingredient_id: 'i41', quantity: 50, unit: 'gramo', ingredients: { id: 'i41', name: 'Albahaca fresca', category: 'Vegetales y Legumbres' } }
        ],
        instructions: { '1': 'Cocer gnocchi.', '2': 'Preparar pesto.', '3': 'Mezclar y servir.' },
        tags: ['Italiano', 'Rápido']
    } as any,
    {
        id: '20',
        name: 'Tofu Salteado con Brócoli',
        description: 'Plato vegano rico en proteínas y fibra.',
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        servings: 2,
        prep_time: '25 min',
        meal_type: 'comida',
        category: 'Otros',
        calories: '310',
        proteins: '22g',
        carbohydrates: '15g',
        fats: '18g',
        recipe_ingredients: [
            { id: 'ri42', recipe_id: '20', ingredient_id: 'i42', quantity: 250, unit: 'gramo', ingredients: { id: 'i42', name: 'Tofu firme', category: 'Otras Categorías' } },
            { id: 'ri43', recipe_id: '20', ingredient_id: 'i43', quantity: 1, unit: 'unidad', ingredients: { id: 'i43', name: 'Brócoli', category: 'Vegetales y Legumbres' } }
        ],
        instructions: { '1': 'Prensar tofu.', '2': 'Saltear con brócoli.', '3': 'Salsear con soja y jengibre.' },
        tags: ['Vegano', 'Fitness']
    } as any
];

export const MOCK_WEEKLY_MENU: MenuItem[] = [
    // Lunes
    { menu_id: 'm1', day: 'Lunes', meal: 'desayuno', recipe: MOCK_RECIPES[2] } as any,
    { menu_id: 'm1', day: 'Lunes', meal: 'comida', recipe: MOCK_RECIPES[1] } as any,
    { menu_id: 'm1', day: 'Lunes', meal: 'snack', recipe: MOCK_RECIPES[9] } as any,
    { menu_id: 'm1', day: 'Lunes', meal: 'cena', recipe: MOCK_RECIPES[3] } as any,
    // Martes
    { menu_id: 'm1', day: 'Martes', meal: 'desayuno', recipe: MOCK_RECIPES[4] } as any,
    { menu_id: 'm1', day: 'Martes', meal: 'comida', recipe: MOCK_RECIPES[5] } as any,
    { menu_id: 'm1', day: 'Martes', meal: 'snack', recipe: MOCK_RECIPES[9] } as any,
    { menu_id: 'm1', day: 'Martes', meal: 'cena', recipe: MOCK_RECIPES[6] } as any,
    // Miércoles
    { menu_id: 'm1', day: 'Miércoles', meal: 'desayuno', recipe: MOCK_RECIPES[7] } as any,
    { menu_id: 'm1', day: 'Miércoles', meal: 'comida', recipe: MOCK_RECIPES[14] } as any,
    { menu_id: 'm1', day: 'Miércoles', meal: 'snack', recipe: MOCK_RECIPES[9] } as any,
    { menu_id: 'm1', day: 'Miércoles', meal: 'cena', recipe: MOCK_RECIPES[11] } as any,
    // Jueves
    { menu_id: 'm1', day: 'Jueves', meal: 'desayuno', recipe: MOCK_RECIPES[12] } as any,
    { menu_id: 'm1', day: 'Jueves', meal: 'comida', recipe: MOCK_RECIPES[8] } as any,
    { menu_id: 'm1', day: 'Jueves', meal: 'snack', recipe: MOCK_RECIPES[9] } as any,
    { menu_id: 'm1', day: 'Jueves', meal: 'cena', recipe: MOCK_RECIPES[13] } as any,
    // Viernes
    { menu_id: 'm1', day: 'Viernes', meal: 'desayuno', recipe: MOCK_RECIPES[16] } as any,
    { menu_id: 'm1', day: 'Viernes', meal: 'comida', recipe: MOCK_RECIPES[10] } as any,
    { menu_id: 'm1', day: 'Viernes', meal: 'snack', recipe: MOCK_RECIPES[9] } as any,
    { menu_id: 'm1', day: 'Viernes', meal: 'cena', recipe: MOCK_RECIPES[17] } as any,
    // Sábado
    { menu_id: 'm1', day: 'Sábado', meal: 'desayuno', recipe: MOCK_RECIPES[4] } as any,
    { menu_id: 'm1', day: 'Sábado', meal: 'comida', recipe: MOCK_RECIPES[15] } as any,
    { menu_id: 'm1', day: 'Sábado', meal: 'snack', recipe: MOCK_RECIPES[9] } as any,
    { menu_id: 'm1', day: 'Sábado', meal: 'cena', recipe: MOCK_RECIPES[18] } as any,
    // Domingo
    { menu_id: 'm1', day: 'Domingo', meal: 'desayuno', recipe: MOCK_RECIPES[7] } as any,
    { menu_id: 'm1', day: 'Domingo', meal: 'comida', recipe: MOCK_RECIPES[19] } as any,
    { menu_id: 'm1', day: 'Domingo', meal: 'snack', recipe: MOCK_RECIPES[9] } as any,
    { menu_id: 'm1', day: 'Domingo', meal: 'cena', recipe: MOCK_RECIPES[6] } as any,
];

export const MOCK_FAVORITES: any[] = MOCK_RECIPES.slice(0, 8).map(recipe => ({
    id: `fav-${recipe.id}`,
    created_at: new Date().toISOString(),
    last_cooked: null,
    notes: 'Excelente receta para el día a día.',
    rating: 5,
    tags: recipe.tags,
    user_id: 'showcase-user',
    recipe_id: recipe.id,
    name: recipe.name,
    servings: recipe.servings,
    image_url: recipe.image_url,
    calories: recipe.calories,
    category: recipe.category,
    prep_time: recipe.prep_time
}));
