-- Primero limpiamos las tablas existentes
DELETE FROM recipe_ingredients;
DELETE FROM recipes;
DELETE FROM ingredients;

-- Insertar ingredientes únicos
INSERT INTO ingredients (name, category) VALUES
('Dorada', 'Pescadería'),
('Tomate', 'Vegetales y Legumbres'),
('Cebolla', 'Vegetales y Legumbres'),
('Espárragos', 'Vegetales y Legumbres'),
('Judías verdes', 'Vegetales y Legumbres'),
('Champiñones', 'Vegetales y Legumbres'),
('Pimiento', 'Vegetales y Legumbres'),
('Langostinos cocidos', 'Pescadería'),
('Pimientos asados', 'Vegetales y Legumbres'),
('Huevo cocido', 'Lácteos, Huevos y Derivados'),
('Tofu', 'Otras Categorías'),
('Calabacín', 'Vegetales y Legumbres'),
('Maíz', 'Vegetales y Legumbres'),
('Pisto de verduras', 'Vegetales y Legumbres'),
('Huevo', 'Lácteos, Huevos y Derivados'),
('Garbanzos', 'Otras Categorías'),
('Espinacas', 'Vegetales y Legumbres'),
('Pechuga de pollo', 'Carnicería'),
('Zanahoria', 'Vegetales y Legumbres'),
('Calabaza', 'Vegetales y Legumbres'),
('Queso Feta', 'Otras Categorías'),
('Carne picada', 'Carnicería'),
('Pan rallado', 'Cereales y Derivados'),
('Huevos', 'Otras Categorías'),
('Ajo', 'Vegetales y Legumbres'),
('Perejil', 'Condimentos y Especias'),
('Tomate frito', 'Vegetales y Legumbres'),
('Azúcar', 'Condimentos y Especias'),
('Orégano', 'Condimentos y Especias'),
('Albahaca fresca', 'Vegetales y Legumbres'),
('Caldo de pollo', 'Líquidos y Caldos'),
('Fresas', 'Frutas'),
('Lechuga', 'Vegetales y Legumbres'),
('Tomate cherry', 'Vegetales y Legumbres'),
('Queso feta', 'Otras Categorías'),
('Almendras laminadas', 'Frutos Secos'),
('Arándanos secos', 'Frutos Secos'),
('Limón', 'Frutas'),
('Menta fresca', 'Condimentos y Especias'),
('Pimiento rojo', 'Vegetales y Legumbres'),
('Eneldo', 'Condimentos y Especias'),
('Pan de molde', 'Cereales y Derivados'),
('Jamón York', 'Charcutería'),
('Queso', 'Otras Categorías'),
('Mantequilla', 'Otras Categorías'),
('Gulas', 'Pescadería'),
('Gambas', 'Pescadería'),
('Soja texturizada', 'Otras Categorías'),
('Pavo', 'Carnicería'),
('Boniato', 'Vegetales y Legumbres'),
('Canónigos', 'Vegetales y Legumbres'),
('Chuleta de cerdo', 'Carnicería'),
('Queso de cabra', 'Otras Categorías'),
('Nueces', 'Frutos Secos'),
('Pasas', 'Frutos Secos'),
('Vinagre balsámico', 'Salsas y Aderezos'),
('Miel', 'Condimentos y Especias'),
('Guisantes', 'Vegetales y Legumbres'),
('Jamón serrano', 'Charcutería'),
('Vino blanco', 'Salsas y Aderezos'),
('Brócoli', 'Vegetales y Legumbres'),
('Salmón', 'Pescadería'),
('Ensaladilla rusa', 'Vegetales y Legumbres'),
('Mayonesa', 'Salsas y Aderezos'),
('AOVE (Aceite de oliva virgen extra)', 'Salsas y Aderezos'),
('Vinagre', 'Salsas y Aderezos'),
('Arroz integral', 'Cereales y Derivados'),
('Verduras variadas', 'Vegetales y Legumbres'),
('Pollo', 'Carnicería'),
('Pimiento verde', 'Vegetales y Legumbres'),
('Tortillas de trigo', 'Cereales y Derivados'),
('Comino en polvo', 'Condimentos y Especias'),
('Guacamole', 'Salsas y Aderezos'),
('Queso rallado', 'Otras Categorías'),
('Macarrones', 'Cereales y Derivados'),
('Apio', 'Vegetales y Legumbres'),
('Queso parmesano', 'Otras Categorías'),
('Chorizo', 'Carnicería'),
('Brotes de espinacas', 'Vegetales y Legumbres'),
('Patatas', 'Vegetales y Legumbres'),
('Caldo de verduras', 'Líquidos y Caldos'),
('Queso crema', 'Otras Categorías'),
('Cogollos de lechuga', 'Vegetales y Legumbres'),
('Bacon', 'Carnicería'),
('Vinagre de vino tinto', 'Salsas y Aderezos'),
('Berenjena', 'Vegetales y Legumbres'),
('Raxo', 'Carnicería'),
('Pimentón', 'Condimentos y Especias'),
('Lomo de cerdo', 'Carnicería'),
('Romero', 'Condimentos y Especias'),
('Pan de hamburguesa', 'Cereales y Derivados'),
('Queso cheddar', 'Otras Categorías'),
('Cebolla roja', 'Vegetales y Legumbres'),
('Mostaza', 'Condimentos y Especias'),
('Kétchup', 'Salsas y Aderezos'),
('Arroz', 'Cereales y Derivados'),
('Salsa de soja', 'Salsas y Aderezos'),
('guisantes', 'Vegetales y Legumbres'),
('Brotes de soja', 'Vegetales y Legumbres'),
('Pan de chapata', 'Cereales y Derivados'),
('Pesto de albahaca', 'Condimentos y Especias'),
('Puerro', 'Vegetales y Legumbres'),
('Tomillo', 'Condimentos y Especias'),
('Azafrán', 'Condimentos y Especias'),
('Espaguetis', 'Cereales y Derivados'),
('Jengibre', 'Condimentos y Especias'),
('Cacahuetes salados', 'Frutos Secos'),
('Nachos', 'Otras Categorías'),
('Jalapeños', 'Condimentos y Especias'),
('Aceitunas negras', 'Vegetales y Legumbres'),
('Cilantro fresco', 'Vegetales y Legumbres'),
('Crema agria', 'Otras Categorías'),
('Placas de lasaña', 'Cereales y Derivados'),
('Espinacas frescas', 'Vegetales y Legumbres'),
('Bechamel', 'Salsas y Aderezos'),
('Bonito', 'Pescadería'),
('Caldo de pescado', 'Líquidos y Caldos'),
('Laurel', 'Condimentos y Especias'),
('Masa quebrada', 'Cereales y Derivados'),
('Nata líquida', 'Otras Categorías'),
('Nuez moscada', 'Condimentos y Especias'),
('Muslos de pollo', 'Carnicería'),
('Harina', 'Cereales y Derivados'),
('Lentejas', 'Vegetales y Legumbres'),
('Sazonador barbacoa', 'Condimentos y Especias'),
('Salsa barbacoa', 'Salsas y Aderezos'),
('Langostinos', 'Pescadería'),
('Pepino', 'Vegetales y Legumbres'),
('Maíz dulce', 'Vegetales y Legumbres'),
('Chili en escamas', 'Condimentos y Especias'),
('Vinagramore de vino tinto', 'Otras Categorías'),
('Cilantro', 'Condimentos y Especias'),
('Lima', 'Frutas'),
('Manzana', 'Frutas'),
('Queso griego', 'Otras Categorías'),
('Carne de ternera', 'Carnicería'),
('Caldo de ternera', 'Líquidos y Caldos'),
('Filetes de Ternera', 'Carnicería'),
('Masa de pizza', 'Cereales y Derivados'),
('Queso mozzarella', 'Otras Categorías'),
('Ingredientes al gusto', 'Otras Categorías'),
('Judías', 'Vegetales y Legumbres'),
('Morcilla', 'Charcutería'),
('Panceta', 'Carnicería'),
('Caldo de carne', 'Líquidos y Caldos'),
('Gnocchi', 'Cereales y Derivados'),
('Cebollino', 'Vegetales y Legumbres'),
('Orégano para el aderezo', 'Condimentos y Especias'),
('Pollo entero', 'Carnicería'),
('Leche', 'Líquidos y Caldos'),
('Pecorino', 'Otras Categorías'),
('Bacalao desmigado', 'Pescadería'),
('Pan duro', 'Cereales y Derivados'),
('Lomo', 'Carnicería'),
('Pan de brioche', 'Cereales y Derivados'),
('Rúcula', 'Vegetales y Legumbres'),
('Especias', 'Condimentos y Especias'),
('Solomillo de cerdo', 'Carnicería'),
('Setas', 'Vegetales y Legumbres'),
('Panko', 'Cereales y Derivados'),
('Bonito en lata', 'Pescadería'),
('Aceite de oliva', 'Aceites'),
('Sal', 'Condimentos y Especias'),
('Pimienta', 'Condimentos y Especias'),
('Mejillones', 'Pescadería'),
('Calamares', 'Pescadería'),
('Merluza', 'Pescadería'),
('Brécol', 'Vegetales y Legumbres'),
('Patata', 'Vegetales y Legumbres'),
('Trigueros', 'Vegetales y Legumbres'),
('Jamón picado', 'Carnicería'),
('Colacao', 'Otras Categorías'),
('Hogaza de chía quinoa', 'Cereales y Derivados'),
('Café', 'Cafés e infusiones'),
('Mermelada de arándanos', 'Confituras'),
('Zumo de naranja', 'Frutas'),
('Avellanas', 'Frutos Secos'),
('Jamón cocido', 'Charcutería') ON CONFLICT (name) DO NOTHING;

-- Insertar recetas
INSERT INTO recipes (
    name, side_dish, meal_type, category, servings,
    calories, energy_kj, fats, saturated_fats, carbohydrates,
    sugars, fiber, proteins, sodium, prep_time, instructions,
    url, pdf_url, image_url, cuisine_type
) VALUES
(
    'Dorada a la plancha con ensalada de tomate',
    'cebolla y espárragos',
    'comida',
    'Pescados',
    4,
    '239',
    '1000',
    '10',
    '2',
    '10',
    '5',
    '6',
    '25',
    '0',
    '25 minutos',
    '{"Paso 1": "Sazona la dorada con sal y pimienta", "Paso 2": "Cocina la dorada a la plancha con un poco de aceite de oliva hasta que est\u00e9 dorada y cocida", "Paso 3": "Lava y corta los tomates en gajos", "Paso 4": "Pela y corta la cebolla en rodajas finas", "Paso 5": "Cocina los esp\u00e1rragos en agua hirviendo con sal durante 5-7 minutos, luego escurre y enfr\u00eda", "Paso 6": "Mezcla los tomates, cebolla y esp\u00e1rragos en un bol. Ali\u00f1a con aceite de oliva, vinagre, sal y pimienta al gusto"}'::jsonb,
    '',
    '',
    'https://www.65ymas.com/uploads/s1/11/68/68/2/5-dorada-a-la-plancha-con-ensalada-ligera-2_1_621x621.jpeg',
    'otra'
),
(
    'Judías salteadas con champiñones pimineto',
    'y langostinos cocidos',
    'comida',
    'Pescados',
    4,
    '250',
    '1050',
    '10',
    '2',
    '20',
    '5',
    '6',
    '20',
    '0',
    '25 minutos',
    '{"Paso 1": "Lava y corta las jud\u00edas verdes en trozos peque\u00f1os", "Paso 2": "Limpia y corta los champi\u00f1ones en l\u00e1minas", "Paso 3": "Lava y corta el pimiento en tiras", "Paso 4": "En una sart\u00e9n grande, calienta aceite de oliva y saltea las jud\u00edas verdes durante 5-7 minutos", "Paso 5": "A\u00f1ade los champi\u00f1ones y el pimiento y cocina hasta que est\u00e9n tiernos", "Paso 6": "A\u00f1ade los langostinos cocidos y saltea durante 2-3 minutos m\u00e1s."}'::jsonb,
    '',
    '',
    'https://img.freepik.com/fotos-premium/salteado-pollo-pimientos-judias-verdes_2829-16907.jpg',
    'otra'
),
(
    'Ensalada de pimientos asados y tomate',
    'con cebolla y  huevo cocido',
    'cena',
    'Vegetariano',
    4,
    '263',
    '1100',
    '15',
    '3',
    '20',
    '10',
    '6',
    '12',
    '0',
    '20 minutos',
    '{"Paso 1": "Asa los pimientos en el horno hasta que la piel est\u00e9 negra y se desprenda f\u00e1cilmente", "Paso 2": "Pela los pimientos y c\u00f3rtalos en tiras", "Paso 3": "Lava y corta los tomates en gajos", "Paso 4": "Pela y corta la cebolla en rodajas finas", "Paso 5": "Cuece los huevos en agua hirviendo durante 10 minutos y p\u00e9lalos", "Paso 6": "Mezcla los pimientos asados, tomates, cebolla y huevo cocido cortado en rodajas. Ali\u00f1a con aceite de oliva, vinagre, sal y pimienta al gusto y sirve"}'::jsonb,
    '',
    '',
    'https://images.ecestaticos.com/k62z5t7_RujErYkVQONgxq3a7nY=/130x11:1219x828/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F901%2F1f6%2Ff5a%2F9011f6f5a7a45fc2e0b8ee2a8cd8edc8.jpg',
    'otra'
),
(
    'Tofu con pimiento calabacín',
    'y maiz a la plancha',
    'comida',
    'Vegetariano',
    4,
    '263',
    '1100',
    '15',
    '2',
    '20',
    '5',
    '5',
    '15',
    '0',
    '20 minutos',
    '{"Paso 1": "Lava y corta el pimiento y el calabac\u00edn en trozos peque\u00f1os", "Paso 2": "Escurre el ma\u00edz enlatado", "Paso 3": "En una sart\u00e9n grande, calienta aceite de oliva y saltea el tofu hasta que est\u00e9 dorado", "Paso 4": "A\u00f1ade el pimiento y el calabac\u00edn a la sart\u00e9n y cocina hasta que est\u00e9n tiernos", "Paso 5": "A\u00f1ade el ma\u00edz y cocina durante 2-3 minutos m\u00e1s", "Paso 6": "Salpimienta al gusto y mezcla bien."}'::jsonb,
    '',
    '',
    'https://images.aws.nestle.recipes/original/2024_10_28T08_37_28_badun_images.badun.es_ensalada_de_tofu_y_calabacin_a_la_plancha.jpg',
    'otra'
),
(
    'Pisto de verduras',
    'con huevo a la plancha',
    'cena',
    'Vegetariano',
    4,
    '286',
    '1200',
    '20',
    '5',
    '20',
    '10',
    '8',
    '15',
    '0',
    '35 minutos',
    '{"Paso 1": "Lava y corta en dados los pimientos, calabacines, berenjenas y tomates", "Paso 2": "Pela y pica finamente la cebolla y los ajos", "Paso 3": "En una sart\u00e9n grande, calienta aceite de oliva y sofr\u00ede la cebolla y el ajo hasta que est\u00e9n dorados", "Paso 4": "A\u00f1ade las verduras cortadas y cocina a fuego medio durante 20-25 minutos, removiendo ocasionalmente", "Paso 5": "Salpimienta al gusto y cocina hasta que las verduras est\u00e9n tiernas", "Paso 6": "Mientras tanto, cocina los huevos a la plancha con un poco de aceite. Sirve el pisto caliente con los huevos a la plancha encima"}'::jsonb,
    '',
    '',
    'https://mariaalcazar.com/wp-content/uploads/2018/10/huevo-frito-pisto-garbanzos-e1671788198343.jpg',
    'otra'
),
(
    'Garbanzos',
    'con espinacas',
    'comida',
    'Vegetariano',
    4,
    '286',
    '1200',
    '5',
    '1',
    '40',
    '5',
    '10',
    '15',
    '0',
    '35 minutos',
    '{"Paso 1": "Remoja los garbanzos en agua durante la noche", "Paso 2": "Cocina los garbanzos en agua hirviendo con sal hasta que est\u00e9n tiernos", "Paso 3": "Lava y corta las espinacas", "Paso 4": "En una sart\u00e9n grande, calienta aceite de oliva y saltea las espinacas hasta que est\u00e9n tiernas", "Paso 5": "A\u00f1ade los garbanzos cocidos a la sart\u00e9n y mezcla bien", "Paso 6": "Salpimienta al gusto y cocina durante 5-7 minutos m\u00e1s."}'::jsonb,
    '',
    '',
    'https://recetasveganas.net/wp-content/uploads/2019/01/garbanzos-espinacas-receta-vegetariana-andaluza-tradicional.jpg',
    'otra'
),
(
    'Pechugas de pollo al horno con calabaza',
    'zanahoria y queso feta',
    'comida',
    'Aves',
    4,
    '290',
    '1200',
    '15',
    '5',
    '15',
    '5',
    '4',
    '20',
    '0',
    '1 hora',
    '{"Paso 1": "Precalienta el horno a 200\u00baC", "Paso 2": "Corta la calabaza y las Zanahoria en trozos peque\u00f1os", "Paso 3": "Coloca las pechugas de pollo en una bandeja de horno y sazona con sal y pimienta", "Paso 4": "A\u00f1ade la calabaza y las Zanahoria alrededor del pollo", "Paso 5": "Roc\u00eda con aceite de oliva y hornea durante 25-30 minutos o hasta que el pollo est\u00e9 cocido y las verduras est\u00e9n tiernas", "Paso 6": "Espolvorea el queso feta desmenuzado por encima antes de servir"}'::jsonb,
    '',
    '',
    'https://media.istockphoto.com/id/1007485590/es/foto/muslos-de-pollo-asado-con-calabaza-y-zanahoria.jpg?s=1024x1024&w=is&k=20&c=4QoIrgPAp8DZ9c0XJDQTjIT68Qkb3a_PW9U-0RI-Aw4=',
    'otra'
),
(
    'Albóndigas de Carne Caseras',
    'en Tomate frito',
    'comida',
    'Carnes',
    4,
    '290',
    '1200',
    '10',
    '3',
    '30',
    '5',
    '4',
    '20',
    '0',
    '1 hora',
    '{"Paso 1": "En un bol, mezcla la carne picada, el pan rallado, el Huevos, el ajo picado, el perejil, la sal y la pimienta", "Paso 2": "Forma alb\u00f3ndigas con la mezcla y fr\u00edelas en una sart\u00e9n con aceite de oliva hasta que est\u00e9n doradas", "Paso 3": "Retira las alb\u00f3ndigas y en la misma sart\u00e9n sofr\u00ede la cebolla picada hasta que est\u00e9 transparente", "Paso 4": "A\u00f1ade el Tomate frito, el az\u00facar, el or\u00e9gano y el caldo de pollo", "Paso 5": "Cocina a fuego lento durante 20 minutos", "Paso 6": "A\u00f1ade las alb\u00f3ndigas a la salsa y cocina durante 10 minutos m\u00e1s"}'::jsonb,
    '',
    '',
    'https://jetextramar.com/wp-content/uploads/2021/06/receta-de-alb%C3%B3ndigas-de-carne-con-tomate-frito-casero.jpg',
    'otra'
),
(
    'Ensalada Creativa',
    'con fruta variada',
    'cena',
    'Ensaladas',
    4,
    '290',
    '1200',
    '10',
    '3',
    '25',
    '4',
    '3',
    '20',
    '0',
    '20 minutos',
    '{"Paso 1": "Lava y corta la lechuga y los tomates cherry", "Paso 2": "En una ensaladera, mezcla la lechuga, los tomates cherry, el queso feta desmenuzado, las almendras y los ar\u00e1ndanos secos", "Paso 3": "En un bol peque\u00f1o, mezcla el aceite de oliva, el zumo de lim\u00f3n, la sal y la pimienta", "Paso 4": "A\u00f1ade el ali\u00f1o a la ensalada y mezcla bien antes de servir", "Paso 5": "Decora con hojas de menta fresca", "Paso 6": ""}'::jsonb,
    '',
    '',
    'https://jetextramar.com/wp-content/uploads/2021/06/receta-de-alb%C3%B3ndigas-de-carne-con-tomate-frito-casero.jpg',
    'otra'
),
(
    'Salmón en Papillote',
    'con Verduras y Limón',
    'cena',
    'Pescados',
    4,
    '290',
    '1200',
    '15',
    '3',
    '15',
    '5',
    '4',
    '20',
    '0',
    '30 minutos',
    '{"Paso 1": "Precalienta el horno a 180\u00baC", "Paso 2": "Corta el calabac\u00edn, el pimiento y la zanahoria en juliana", "Paso 3": "Coloca cada filete de salm\u00f3n en una hoja de papel de horno", "Paso 4": "A\u00f1ade las verduras, el ajo picado, rodajas de lim\u00f3n, sal, pimienta y eneldo sobre el salm\u00f3n", "Paso 5": "Roc\u00eda con aceite de oliva y cierra los paquetes de papel de horno", "Paso 6": "Hornea durante 20 minutos. Abre los paquetes con cuidado antes de servir"}'::jsonb,
    '',
    '',
    'https://lacocinadefrabisa.lavozdegalicia.es/wp-content/uploads/2018/06/salmon-papillote-1.jpg',
    'otra'
),
(
    'Sándwiches Gourmet de Jamón y Queso',
    'con Huevos',
    'cena',
    'Fast Food',
    4,
    '300',
    '1250',
    '15',
    '5',
    '30',
    '6',
    '4',
    '10',
    '0',
    '20 minutos',
    '{"Paso 1": "Unta las rebanadas de pan con mantequilla y mostaza", "Paso 2": "Coloca el jam\u00f3n serrano y el queso brie en dos rebanadas de pan y cubre con las otras dos rebanadas", "Paso 3": "Cocina los s\u00e1ndwiches en una sart\u00e9n hasta que est\u00e9n dorados por ambos lados", "Paso 4": "En una cacerola, hierve agua y a\u00f1ade una pizca de sal", "Paso 5": "Pocha los Huevos durante 3-4 minutos hasta que las claras est\u00e9n firmes", "Paso 6": "Sirve los s\u00e1ndwiches con los Huevos pochados por encima"}'::jsonb,
    '',
    '',
    'https://imag.bonviveur.com/presentacion-final-de-los-sandwiches-al-horno-con-huevo.jpg',
    'otra'
),
(
    'Revuelto de Huevos con Gulas',
    'Champiñones y Gambas',
    'cena',
    'Vegetariano',
    4,
    '300',
    '1250',
    '20',
    '5',
    '5',
    '3',
    '2',
    '25',
    '0',
    '20 minutos',
    '{"Paso 1": "En una sart\u00e9n, calienta el aceite de oliva y a\u00f1ade el ajo picado", "Paso 2": "A\u00f1ade los champi\u00f1ones y cocina hasta que est\u00e9n tiernos", "Paso 3": "Agrega las gambas y las gulas y cocina durante 3-4 minutos", "Paso 4": "Bate los Huevos con sal y pimienta", "Paso 5": "Vierte los Huevos en la sart\u00e9n y cocina a fuego lento, removiendo constantemente", "Paso 6": "A\u00f1ade el Perejil picado y sirve caliente"}'::jsonb,
    '',
    '',
    'https://www.divinacocina.es/wp-content/uploads/2017/11/huevos-gulas-gambones-v2.jpg',
    'otra'
),
(
    'Soja texturizada',
    'con pisto de verduras',
    'comida',
    'Vegetariano',
    4,
    '310',
    '1300',
    '10',
    '1',
    '30',
    '10',
    '8',
    '25',
    '0',
    '25 minutos',
    '{"Paso 1": "Hidrata la soja texturizada en agua caliente durante 10-15 minutos", "Paso 2": "Escurre bien la soja texturizada", "Paso 3": "Prepara el pisto de verduras lavando y cortando las verduras en cubos peque\u00f1os", "Paso 4": "En una sart\u00e9n grande, calienta aceite de oliva y sofr\u00ede la cebolla y el ajo hasta que est\u00e9n dorados", "Paso 5": "A\u00f1ade las verduras y cocina a fuego medio durante 20-25 minutos", "Paso 6": "A\u00f1ade la soja texturizada a la sart\u00e9n y mezcla bien. Salpimienta al gusto y cocina durante 5-7 minutos m\u00e1s"}'::jsonb,
    '',
    '',
    'https://productimages.etrusted.com/products/prt-d8e0ce4a-3bce-4e8c-89ec-a4e8242931be/341/original.jpg',
    'otra'
),
(
    'Pavo a la plancha con ',
    'boniato pimiento y canonigos',
    'comida',
    'Carnes',
    4,
    '334',
    '1400',
    '10',
    '2',
    '30',
    '10',
    '8',
    '30',
    '0',
    '30 minutos',
    '{"Paso 1": "Pela y corta el boniato en cubos peque\u00f1os", "Paso 2": "Cocina el boniato en agua hirviendo con sal hasta que est\u00e9 tierno", "Paso 3": "Lava y corta el pimiento en tiras", "Paso 4": "Sazona el pavo con sal y pimienta", "Paso 5": "Cocina el pavo a la plancha con un poco de aceite de oliva hasta que est\u00e9 dorado y cocido", "Paso 6": "En una sart\u00e9n, saltea el pimiento hasta que est\u00e9 tierno. Mezcla el boniato cocido con el pimiento y los can\u00f3nigos en un bol"}'::jsonb,
    '',
    '',
    'https://fotografias.antena3.com/clipping/cmsimages01/2022/11/10/A84FA7B7-6013-4C93-8012-E25A95E8C662/receta-baja-grasa-pavo-mostaza-uvas-boniato-karlos-arguinano_69.jpg?crop=1200,675,x0,y64&width=1280&height=720&optimize=low&format=jpg',
    'otra'
),
(
    'Chuleta de cerdo',
    'con calabacín a la plancha',
    'comida',
    'Carnes',
    4,
    '358',
    '1500',
    '20',
    '7',
    '10',
    '2',
    '5',
    '30',
    '0',
    '25 minutos',
    '{"Paso 1": "Sazona las chuletas de cerdo con sal y pimienta", "Paso 2": "Cocina las chuletas a la plancha con un poco de aceite de oliva hasta que est\u00e9n doradas y cocidas", "Paso 3": "Lava y corta los calabacines en rodajas gruesas", "Paso 4": "Cocina los calabacines a la plancha con un poco de aceite de oliva hasta que est\u00e9n dorados y tiernos", "Paso 5": "Salpimienta al gusto los calabacines", "Paso 6": "Sirve las chuletas de cerdo con los calabacines a la plancha."}'::jsonb,
    '',
    '',
    'https://us.images.westend61.de/0000262748pw/chuleta-de-cerdo-con-calabacin-a-la-plancha-ODF000422.jpg',
    'otra'
),
(
    'Ensalada Templada con Lechuga',
    'Queso de Cabra y Setas',
    'cena',
    'Ensaladas',
    4,
    '360',
    '1500',
    '15',
    '4',
    '35',
    '6',
    '4',
    '15',
    '0',
    '15 minutos',
    '{"Paso 1": "Lava y corta la lechuga y los tomates cherry", "Paso 2": "En una ensaladera, mezcla la lechuga, los tomates cherry, el queso feta desmenuzado, las almendras y los ar\u00e1ndanos secos", "Paso 3": "En un bol peque\u00f1o, mezcla el aceite de oliva, el zumo de lim\u00f3n, la sal y la pimienta", "Paso 4": "A\u00f1ade el ali\u00f1o a la ensalada y mezcla bien antes de servir", "Paso 5": "Decora con hojas de menta fresca", "Paso 6": ""}'::jsonb,
    '',
    '',
    'https://www.recetasderechupete.com/wp-content/uploads/2010/07/Ensalada-de-setas-y-queso-de-cabra-1200x828.jpg',
    'otra'
),
(
    'Guisantes Salteados',
    'con Jamón serrano y Cebolla Caramelizada',
    'cena',
    'Legumbres',
    4,
    '360',
    '1500',
    '15',
    '3',
    '40',
    '5',
    '6',
    '15',
    '0',
    '30 minutos',
    '{"Paso 1": "Pela y corta la cebolla en juliana", "Paso 2": "En una sart\u00e9n, calienta una cucharada de aceite de oliva y a\u00f1ade la cebolla con una pizca de sal y el az\u00facar", "Paso 3": "Cocina a fuego lento hasta que la cebolla est\u00e9 caramelizada", "Paso 4": "En otra sart\u00e9n, calienta el aceite de oliva restante y a\u00f1ade el ajo picado", "Paso 5": "A\u00f1ade los guisantes y saltea durante 5 minutos", "Paso 6": "Agrega el Jam\u00f3n serrano cortado en tiras y el vino blanco. Cocina durante 2 minutos m\u00e1s y a\u00f1ade la cebolla caramelizada antes de servir"}'::jsonb,
    '',
    '',
    'https://cdn0.recetasgratis.net/es/posts/8/5/4/guisantes_con_jamon_y_cebolla_59458_orig.jpg',
    'otra'
),
(
    'Salmón a la Plancha',
    'con Brócoli al Vapor',
    'cena',
    'Pescados',
    4,
    '360',
    '1500',
    '20',
    '4',
    '10',
    '2',
    '4',
    '35',
    '0',
    '20 minutos',
    '{"Paso 1": "Cocina el br\u00f3coli al vapor durante 5-7 minutos", "Paso 2": "Sazona los filetes de salm\u00f3n con sal y pimienta", "Paso 3": "Calienta el aceite de oliva en una sart\u00e9n y cocina el salm\u00f3n durante 4-5 minutos por cada lado", "Paso 4": "Sirve el salm\u00f3n con el br\u00f3coli al vapor y rodajas de lim\u00f3n", "Paso 5": "", "Paso 6": ""}'::jsonb,
    '',
    '',
    'https://content-cocina.lecturas.com/medio/2023/07/06/salmon-al-horno-con-brecol_22dd3d5e_1200x1200.jpg',
    'otra'
),
(
    'Revuelto de Brócoli',
    'con Pimiento rojo y Calabacín',
    'cena',
    'Vegetariano',
    4,
    '360',
    '1500',
    '15',
    '3',
    '30',
    '6',
    '5',
    '20',
    '0',
    '25 minutos',
    '{"Paso 1": "Precalienta el horno a 180\u00baC", "Paso 2": "Estira la masa quebrada y col\u00f3cala en un molde para quiche", "Paso 3": "Corta el calabac\u00edn en rodajas y la cebolla en juliana", "Paso 4": "En una sart\u00e9n, calienta el aceite de oliva y sofr\u00ede la cebolla y el calabac\u00edn hasta que est\u00e9n tiernos", "Paso 5": "En un bol, bate los Huevos con la nata l\u00edquida, el queso rallado, sal, pimienta y nuez moscada", "Paso 6": "A\u00f1ade las verduras a la mezcla de Huevos y vierte sobre la masa quebrada. Hornea durante 35-40 minutos o hasta que la quiche est\u00e9 dorada y cuajada"}'::jsonb,
    '',
    '',
    'https://d36fw6y2wq3bat.cloudfront.net/recipes/salteado-de-pavo-brocoli-y-pimiento-rojo/900/salteado-de-pavo-brocoli-y-pimiento-rojo_version_1651567280.jpg',
    'otra'
),
(
    'Ensaladilla rusa con huevo cocido',
    'cucharadita de mayonesa AOVE y vinagre',
    'cena',
    'Vegetariano',
    4,
    '382',
    '1600',
    '30',
    '4',
    '20',
    '5',
    '6',
    '10',
    '0',
    '30 minutos',
    '{"Paso 1": "Pela y corta las patatas y zanahorias en cubos peque\u00f1os", "Paso 2": "Cocina las patatas, zanahorias y guisantes en agua hirviendo con sal hasta que est\u00e9n tiernos", "Paso 3": "Cuece los huevos en agua hirviendo durante 10 minutos y p\u00e9lalos", "Paso 4": "Enfriar las verduras y los huevos en agua fr\u00eda", "Paso 5": "Pica finamente los huevos cocidos y mezcla con las verduras", "Paso 6": "A\u00f1ade mayonesa, aceite de oliva virgen extra (AOVE) y vinagre al gusto. Mezcla todo bien, salpimienta y sirve fr\u00edo"}'::jsonb,
    '',
    '',
    'https://rinconesandalucia.com/wp-content/uploads/2024/11/DALL%C2%B7E-2024-11-18-16.47.58-A-cutaway-shot-of-Spanish-Potato-Salad-Ensaladilla-Rusa-showcasing-a-large-scoop-being-taken-out-of-the-salad-revealing-the-creamy-mixture-of-dice-768x768.webp',
    'otra'
),
(
    'Arroz integral con pavo',
    'y verduras',
    'comida',
    'Carnes',
    4,
    '382',
    '1600',
    '8',
    '2',
    '50',
    '5',
    '8',
    '25',
    '0',
    '40 minutos',
    '{"Paso 1": "Cocina el arroz integral en agua hirviendo con sal seg\u00fan las instrucciones del paquete", "Paso 2": "Corta el pavo en tiras o cubos peque\u00f1os", "Paso 3": "Lava y corta las verduras (pimiento, calabac\u00edn, zanahoria) en trozos peque\u00f1os", "Paso 4": "En una sart\u00e9n grande, calienta aceite de oliva y saltea el pavo hasta que est\u00e9 dorado y cocido", "Paso 5": "A\u00f1ade las verduras y cocina hasta que est\u00e9n tiernas", "Paso 6": "Mezcla el arroz cocido con el pavo y las verduras en la sart\u00e9n. Salpimienta al gusto y sirve caliente"}'::jsonb,
    '',
    '',
    'https://www.hola.com/horizon/landscape/71da074cc4bf-arroz-verduras-pavo-t.jpg',
    'otra'
),
(
    'Poke de Pollo',
    'con Arroz Integral y Verduras',
    'comida',
    'Aves',
    4,
    '382',
    '1600',
    '10',
    '2',
    '50',
    '5',
    '8',
    '25',
    '0',
    '30 minutos',
    '{"Paso 1": "Cocina el arroz integral en agua hirviendo con sal seg\u00fan las instrucciones del paquete", "Paso 2": "Corta el pollo en tiras o cubos peque\u00f1os y sazona con sal y pimienta", "Paso 3": "Cocina el pollo a la plancha con un poco de aceite de oliva hasta que est\u00e9 dorado y cocido", "Paso 4": "Lava y corta las verduras (pepino, zanahoria, aguacate) en trozos peque\u00f1os", "Paso 5": "En un bol grande, mezcla el arroz cocido, el pollo y las verduras", "Paso 6": "Ali\u00f1a con salsa de soja, aceite de s\u00e9samo y semillas de s\u00e9samo al gusto. Sirve fr\u00edo o a temperatura ambiente"}'::jsonb,
    '',
    '',
    'https://i2.wp.com/foodografo.com/wp-content/uploads/2018/05/poke-bowl-0407.jpg?fit=1280%2C850&ssl=1',
    'otra'
),
(
    'Fajitas de Pollo',
    'con Relleno Variado',
    'cena',
    'Fast Food',
    4,
    '430',
    '1800',
    '15',
    '3',
    '45',
    '6',
    '6',
    '25',
    '0',
    '30 minutos',
    '{"Paso 1": "Corta la pechuga de pollo en tiras y sazona con sal, pimienta y comino", "Paso 2": "En una sart\u00e9n grande, calienta el aceite de oliva y cocina el pollo hasta que est\u00e9 dorado", "Paso 3": "A\u00f1ade los Pimiento rojo y la cebolla cortados en tiras y cocina hasta que est\u00e9n tiernos", "Paso 4": "Calienta las tortillas en una sart\u00e9n o microondas", "Paso 5": "Sirve el pollo y las verduras en las tortillas", "Paso 6": "Acompa\u00f1a con guacamole, Tomate frito, queso rallado y lechuga"}'::jsonb,
    '',
    '',
    'https://cdn.recetasderechupete.com/wp-content/uploads/2014/05/fajitas_pollo.jpg',
    'otra'
),
(
    'Pasta con salsa boloñesa',
    'de carne picada con tomate y cebolla',
    'comida',
    'Pastas y Arroces',
    4,
    '430',
    '1800',
    '15',
    '5',
    '55',
    '10',
    '5',
    '25',
    '0',
    '45 minutos',
    '{"Paso 1": "Cocina la pasta seg\u00fan las instrucciones del paquete", "Paso 2": "En una sart\u00e9n, cocina el bacon hasta que est\u00e9 crujiente y retira el exceso de grasa", "Paso 3": "Bate los Huevos en un bol y mezcla con el queso parmesano rallado", "Paso 4": "A\u00f1ade el ajo picado a la sart\u00e9n con el bacon y cocina brevemente", "Paso 5": "Escurre la pasta y m\u00e9zclala r\u00e1pidamente con la mezcla de Huevos y queso", "Paso 6": "Agrega el bacon y mezcla bien"}'::jsonb,
    '',
    '',
    'https://imag.bonviveur.com/espaguetis-a-la-bolonesa.jpg',
    'otra'
),
(
    'Macarrones con chorizo',
    'y sofrito de tomate con cebolla',
    'comida',
    'Pastas y Arroces',
    4,
    '430',
    '1800',
    '20',
    '7',
    '50',
    '8',
    '3',
    '20',
    '0',
    '30 minutos',
    '{"Paso 1": "Cocina los macarrones seg\u00fan las instrucciones del paquete", "Paso 2": "Mientras se cocinan los macarrones, corta el chorizo en rodajas y pica finamente la cebolla y el ajo", "Paso 3": "En una sart\u00e9n grande, calienta el aceite de oliva a fuego medio y a\u00f1ade la cebolla y el ajo", "Paso 4": "Sofr\u00ede hasta que la cebolla est\u00e9 transparente", "Paso 5": "A\u00f1ade el chorizo a la sart\u00e9n y cocina durante unos 5 minutos hasta que est\u00e9 dorado", "Paso 6": "Agrega el Tomate frito, sal, pimienta y or\u00e9gano y cocina a fuego lento durante 10 minutos"}'::jsonb,
    '',
    '',
    'https://monjamonymas.com/cdn/shop/articles/Macarrones_1.png?v=1708593396',
    'otra'
),
(
    'Crema de espinacas con bacon',
    'con cogollos frescos de lechuga aderezados',
    'cena',
    'Sopas y Cremas',
    4,
    '448',
    '1876',
    '21.7',
    '9.2',
    '31.5',
    '7.5',
    '3.3',
    '14.3',
    '0',
    '35 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Pela las Patatas y c\u00f3rtalas en dados de 2 cm. Pela la cebolla, div\u00eddela en dos y c\u00f3rtala en tiras finas. Corta los cogollos de lechuga por la mitad a lo largo, luego, apoya la parte plana y corta en tiras finas.", "Paso 2": "En una olla, calienta un chorrito de aceite a fuego medio-alto. Luego, saltea el bacon durante 3-5 min, hasta que quede dorado y crujiente. Retira de la olla y reserva. Puedes retirar el excedente de grasa de la olla si hay demasiada.", "Paso 3": "En la olla, calienta un chorrito de aceite a fuego medio. Luego, agrega la cebolla junto con una pizca de sal y cocina 4-5 min, removiendo frecuentemente, hasta que quede transparente. Luego, agrega la Patatas y cocina 2 min m\u00e1s.", "Paso 4": "A\u00f1ade a la olla el agua (ver cantidad en ingredientes) y el Caldo de verduras en polvo y salpimienta. Remueve y lleva a ebullici\u00f3n. Cuando hierva, baja a fuego medio y cocina 15-20 min, con la olla tapada, moviendo de vez en cuando, hasta que la\u00a0Patatas est\u00e9 tierna.", "Paso 5": "En la olla, agrega las espinacas y la mitad de la lechuga troceada y cocina 2-3 min m\u00e1s a fuego medio, hasta que las espinacas se reduzcan en tama\u00f1o. Luego, agrega el queso crema y remueve para que se funda e integre. Con un t\u00farmix, tritura hasta obtener una crema homog\u00e9nea. Prueba y recitifica de sal y pimienta.", "Paso 6": "En una ensaladera, mezcla el vinagre de vino tinto (ver cantidad en ingredientes), un chorrito de aceite, sal y pimienta. Luego, agrega la lechuga troceada restante y mezcla bien. Sirve la crema de espinacas y lechuga en platos hondos y agrega encima el bacon crujiente y la lechuga aderezada."}'::jsonb,
    'https://www.hellofresh.es/recipes/crema-espinacas-bacon-lechuga-6616b8d29064812f61712c81',
    'https://www.hellofresh.es/recipecards/card/6616b8d29064812f61712c81-es-ES.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y24_R14_W22_ES_ESCLCP22013-2_edit_color_MAIN_high-3303cf05.jpg',
    'otra'
),
(
    'Parrillada Verduras',
    'con raxo',
    'comida',
    'Carnes',
    4,
    '450',
    '1900',
    '25',
    '4',
    '40',
    '6',
    '7',
    '12',
    '0',
    '45 minutos',
    '{"Paso 1": "Precalienta la parrilla a fuego medio-alto", "Paso 2": "Corta las verduras en rodajas y m\u00e9zclalas con aceite de oliva, sal y pimienta", "Paso 3": "Asa las verduras en la parrilla durante unos 10 minutos o hasta que est\u00e9n tiernas", "Paso 4": "Mientras tanto, en una sart\u00e9n, calienta aceite de oliva y a\u00f1ade el ajo picado", "Paso 5": "A\u00f1ade el raxo a la sart\u00e9n y cocina hasta que est\u00e9 dorado", "Paso 6": "Sazona con piment\u00f3n, sal y pimienta antes de servir con las verduras"}'::jsonb,
    '',
    '',
    'https://www.divinacocina.es/wp-content/uploads/parrillada-de-verduras-platoD.jpg',
    'otra'
),
(
    'Rollitos de Lomo de Cerdo',
    'con Queso y Jamón serrano',
    'comida',
    'Carnes',
    4,
    '450',
    '1900',
    '25',
    '8',
    '30',
    '4',
    '2',
    '30',
    '0',
    '40 minutos',
    '{"Paso 1": "Precalienta el horno a 200\u00baC", "Paso 2": "Coloca una loncha de queso y una de Jam\u00f3n serrano sobre cada filete de lomo", "Paso 3": "Enrolla los filetes y aseg\u00faralos con palillos", "Paso 4": "Calienta el aceite de oliva en una sart\u00e9n y dora los rollitos por todos lados", "Paso 5": "A\u00f1ade el ajo picado, el vino blanco y el caldo de pollo a la sart\u00e9n", "Paso 6": "Coloca los rollitos en una fuente para horno, a\u00f1ade el romero y hornea durante 20 minutos"}'::jsonb,
    '',
    '',
    'https://content-cocina.lecturas.com/medio/2022/10/13/rollitos_de_jamon_con_queso_y_maiz_fcd72aad_600x600.jpg',
    'otra'
),
(
    'Hamburguesas con Pan Artesano',
    'Lechuga Tomate y Queso de cabra',
    'cena',
    'Fast Food',
    4,
    '475',
    '2000',
    '25',
    '8',
    '40',
    '6',
    '5',
    '20',
    '0',
    '30 minutos',
    '{"Paso 1": "Lava y corta la lechuga y el tomate", "Paso 2": "En una ensaladera, mezcla la lechuga, el tomate, el queso de cabra desmenuzado, las nueces y las pasas", "Paso 3": "En un bol peque\u00f1o, mezcla el aceite de oliva, el vinagre bals\u00e1mico, la miel, la sal y la pimienta", "Paso 4": "A\u00f1ade el ali\u00f1o a la ensalada y mezcla bien antes de servir", "Paso 5": "", "Paso 6": ""}'::jsonb,
    '',
    '',
    'https://i.blogs.es/ca9e83/hamburguesa-queso-cabra-1/450_1000.jpg',
    'otra'
),
(
    'Arroz',
    'con Verduras Salteadas',
    'cena',
    'Otros',
    4,
    '475',
    '2000',
    '25',
    '10',
    '40',
    '6',
    '5',
    '20',
    '0',
    '25 minutos',
    '{"Paso 1": "Cocina el arroz seg\u00fan las instrucciones del paquete y reserva", "Paso 2": "Corta todas las verduras en juliana", "Paso 3": "En una sart\u00e9n grande, calienta el aceite de oliva y a\u00f1ade el ajo picado", "Paso 4": "A\u00f1ade las verduras y saltea a fuego medio-alto hasta que est\u00e9n tiernas pero crujientes", "Paso 5": "Agrega los guisantes y los brotes de soja y cocina durante 2 minutos m\u00e1s", "Paso 6": "A\u00f1ade el arroz cocido a la sart\u00e9n y mezcla bien"}'::jsonb,
    '',
    '',
    'https://www.hola.com/horizon/landscape/60ad55eaa6f3-arroz-verduras-adobe-t.jpg?im=Resize=(1200)',
    'otra'
),
(
    'Crema suave de calabacín eneldo y queso crema',
    'con picatostes caseros y tostadas al pesto',
    'cena',
    'Sopas y Cremas',
    4,
    '493',
    '2063',
    '18.52',
    '4.9',
    '63.41',
    '8.32',
    '2.47',
    '15.16',
    '0',
    '30 minutos',
    '{"Paso 1": "Precalienta el horno a 200\u00b0C. En un cazo, pon a calentar el agua\u00a0(ver cantidad en ingredientes)\u00a0y el Caldo de verduras en polvo, deja que hierva. Luego, retira del fuego y reserva. Pela y pica el\u00a0ajo (ver cantidad en ingredientes). Corta el calabac\u00edn en cubitos. Separa la parte verde del puerro de la blanca.\u00a0Corta la parte blanca de manera longitudinal y, luego, c\u00f3rtalo en rodajas finas. Deshoja el eneldo y c\u00f3rtalo en trozos grandes.", "Paso 2": "En una olla, pon un chorrito de aceite de oliva y el ajo picado. Calienta a fuego medio durante 1-2 min o hasta que se dore. Agrega\u00a0el puerro y el calabac\u00edn, luego, saltea durante 6-8 min. Agrega el caldo, baja el fuego y deja que hierva a fuego lento tapado durante 5-6 min.", "Paso 3": "Mientras tanto, corta la mitad del pan de chapata en cubos y la otra mitad en rebanadas de 1 cm de grosor. Coloca las rebanadas en una bandeja de horno con papel de horno y extiende la mitad del pesto de albahaca por encima. Agrega un chorrito de aceite de oliva y hornea durante 8-10 min.", "Paso 4": "Calienta un chorrito de aceite de oliva en una sart\u00e9n a fuego medio y dora los cubos de pan chapata\u00a0durante 6-7 min. Sazona con sal y pimienta al gusto.", "Paso 5": "Tritura la crema con la ayuda de una t\u00farmix hasta que quede suave. Agrega el resto del pesto a la crema y mezcla bien.", "Paso 6": "Vierte la crema en platos hondos y agrega el queso crema, luego, espolvorea el eneldo y a\u00f1ade los picatostes. Coloca las rebanadas de chapata con pesto a un lado."}'::jsonb,
    'https://www.hellofresh.es/recipes/crema-suave-de-calabacin-eneldo-y-queso-crema-6373c33e6875fac468eeba6e',
    'https://www.hellofresh.es/recipecards/card/crema-suave-de-calabacin-eneldo-y-queso-crema-6373c33e6875fac468eeba6e-b22e3e69.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF190730_R03_W36_NL_R1654_Main_high-3f7a3615.jpg',
    'otra'
),
(
    'Salmón al horno con vinagreta de miel',
    'acompañado de verduras asadas',
    'comida',
    'Pescados',
    4,
    '499',
    '2087',
    '13.6',
    '2.4',
    '41',
    '16',
    '3.5',
    '25',
    '0',
    '30 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Precalienta el horno a 220\u00baC. Corta el\u00a0boniato por la mitad y, luego, en dados de 2 cm. Retira los extremos del calabac\u00edn y c\u00f3rtalo por la mitad a lo largo. Luego, corta cada mitad en medias lunas de 1 cm. Pela la\u00a0cebolla, div\u00eddela en dos y c\u00f3rtala en tiras de 2 cm. Separa con las manos las capas de la cebolla.", "Paso 2": "Coloca las verduras en una bandeja de horno con papel de horno y agrega los tomates cherry, el\u00a0Tomillo y el ajo\u00a0(ver cantidad en ingredientes). Agrega un chorrito de aceite, salpimienta y mezcla para que las verduras queden bien aderezadas. Hornea en el estante superior durante 15 min.", "Paso 3": "En un bol peque\u00f1o, agrega el vinagre bals\u00e1mico, la miel y\u00a0un chorrito de\u00a0aceite. Salpimienta y mezcla bien, hasta que quede una vinagreta homog\u00e9nea.", "Paso 4": "Salpimienta el\u00a0salm\u00f3n. Cuando las verduras se hayan horneado 15 min,\u00a0remueve para que se cocinen uniformemente. Luego, agrega el\u00a0salm\u00f3n sobre las verduras\u00a0y cocina todo junto 10 min m\u00e1s, hasta que las verduras est\u00e9n tiernas y el salm\u00f3n quede completamente cocinado.", "Paso 5": "Cuando las verduras y el salm\u00f3n est\u00e9n listos, retira el ajo asado, p\u00e9lalo y agr\u00e9galo al bol de la vinagreta. Con ayuda de un tenedor, tritura el ajo y remueve, de forma que se integre con la salsa.", "Paso 6": "Sirve las\u00a0verduras asadas en la base de los platos y agrega encima el salm\u00f3n. Acaba el plato agregando encima la vinagreta de ajo asado al gusto."}'::jsonb,
    'https://www.hellofresh.es/recipes/salmon-vinagreta-miel-verduras-6616b8de17fb871fe34f4a49',
    '',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R13_W18_ES_ESCLCF14193-2_Main__15high-dbf07fbf.jpg',
    'otra'
),
(
    'Zorza de Raxo',
    'con Patatas y Pimiento rojo Fritos',
    'comida',
    'Carnes',
    4,
    '500',
    '2100',
    '30',
    '10',
    '40',
    '5',
    '4',
    '25',
    '0',
    '40 minutos',
    '{"Paso 1": "Corta el br\u00f3coli en floretes y cocina al vapor hasta que est\u00e9 tierno", "Paso 2": "Corta el pimiento y el calabac\u00edn en tiras", "Paso 3": "En una sart\u00e9n, calienta el aceite de oliva y a\u00f1ade el ajo picado", "Paso 4": "Agrega el pimiento y el calabac\u00edn y cocina hasta que est\u00e9n tiernos", "Paso 5": "A\u00f1ade el br\u00f3coli cocido", "Paso 6": "Bate los Huevos con sal y pimienta y a\u00f1ade a la sart\u00e9n. Cocina a fuego lento, removiendo constantemente, hasta que los Huevos est\u00e9n cuajados"}'::jsonb,
    '',
    '',
    'https://content-cocina.lecturas.com/medio/2024/10/08/raxo-con-patatas-y-pimientos-de-padron-istock-1417855218-editada_6ec1ee23_241008104212_1200x1200.jpg',
    'otra'
),
(
    'Paella de Pollo',
    '',
    'comida',
    'Pastas y Arroces',
    4,
    '500',
    '2100',
    '20',
    '5',
    '50',
    '8',
    '3',
    '25',
    '0',
    '1 hora',
    '{"Paso 1": "En una paellera, calienta el aceite de oliva y sofr\u00ede el pollo hasta que est\u00e9 dorado", "Paso 2": "A\u00f1ade el pimiento y el ajo picados y sofr\u00ede hasta que est\u00e9n tiernos", "Paso 3": "Agrega el Tomate frito, el piment\u00f3n y el azafr\u00e1n y cocina por unos minutos", "Paso 4": "A\u00f1ade el arroz y mezcla bien para que se impregne de los sabores", "Paso 5": "Vierte el caldo de pollo caliente y lleva a ebullici\u00f3n", "Paso 6": "Reduce el fuego y cocina a fuego lento durante 20 minutos o hasta que el arroz est\u00e9 cocido y el l\u00edquido se haya absorbido"}'::jsonb,
    '',
    '',
    'https://content-cocina.lecturas.com/medio/2018/07/19/paella-clasica-de-verduras-y-pollo_8c2ffa40_600x600.jpg',
    'otra'
),
(
    'Pasta a la carbonara tradicional',
    'con bacon y queso parmesano',
    'comida',
    'Pastas y Arroces',
    4,
    '500',
    '2100',
    '25',
    '10',
    '45',
    '5',
    '3',
    '20',
    '0',
    '30 minutos',
    '{"Paso 1": "Cocina la pasta seg\u00fan las instrucciones del paquete", "Paso 2": "En una sart\u00e9n, cocina el bacon hasta que est\u00e9 crujiente y retira el exceso de grasa", "Paso 3": "Bate los Huevos en un bol y mezcla con el queso parmesano rallado", "Paso 4": "A\u00f1ade el ajo picado a la sart\u00e9n con el bacon y cocina brevemente", "Paso 5": "Escurre la pasta y m\u00e9zclala r\u00e1pidamente con la mezcla de Huevos y queso", "Paso 6": "Agrega el bacon y mezcla bien"}'::jsonb,
    '',
    '',
    'https://www.lavanguardia.com/files/og_thumbnail/uploads/2019/03/01/5e9983bbc0a88.jpeg',
    'otra'
),
(
    'Wrap de cogollos con pollo marinado',
    'y zanahoria con salsa de mostaza y miel',
    'cena',
    'Fast Food',
    4,
    '515',
    '2153',
    '19.6',
    '2.3',
    '23.2',
    '11.9',
    '2.6',
    '33.4',
    '0',
    '25 minutos',
    '{"Paso 1": "Pela y ralla el ajo (ver cantidad en ingredientes). Ralla el jengibre y ponlo en un bol junto con el ajo, la salsa de soja, un chorrito de aceite y un chorrito de vinagre de vino. A\u00f1ade la Pechuga de pollo y deja que marine durante 10 min. Pela y ralla la zanahoria.", "Paso 2": "Pela la cebolla, div\u00eddela en dos y corta una mitad (doble para 4p) en tiras finas. Luego, ponla en un bol con el vinagre de vino (ver cantidad en ingredientes) y un poco de sal. Deja que marine hasta el emplatado. Pica los cacahuetes finamente.", "Paso 3": "Corta la base de los cogollos de lechuga y separa las hojas con cuidado. En un bol mediano, mezcla la\u00a0mayonesa con la mostaza y la miel. A\u00f1ade la zanahoria rallada, salpimienta y m\u00e9zclalo bien. En una sart\u00e9n, calienta un chorrito de aceite a fuego medio. Una vez caliente, agrega el pollo\u00a0y cocina 5-6 min, hasta que est\u00e9 dorado y bien cocinado en el interior.", "Paso 4": "Sobre cada cogollo de lechuga, pon un poco de zanahoria rallada en salsa y cubre con\u00a0el\u00a0pollo marinado y la cebolla encurtida al gusto. Acaba con los cacahuetes picados.", "Paso 5": "", "Paso 6": ""}'::jsonb,
    'https://www.hellofresh.es/recipes/wrap-de-cogollos-con-pollo-marinado-64146dbe6b23cefedf01c9e9',
    'https://www.hellofresh.es/recipecards/card/wrap-de-cogollos-con-pollo-marinado-64146dbe6b23cefedf01c9e9-70b168fa.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R12_W09_ES_ESQCC13705-2_Main_high-c0e05330.jpg',
    'otra'
),
(
    'Nachos Gourmet',
    'con Queso Fundido Tomate frito y Guacamole',
    'cena',
    'Fast Food',
    4,
    '525',
    '2200',
    '30',
    '10',
    '45',
    '8',
    '4',
    '25',
    '0',
    '20 minutos',
    '{"Paso 1": "Precalienta el horno a 180\u00baC", "Paso 2": "Coloca los nachos en una bandeja para horno y cubre con queso rallado", "Paso 3": "Hornea durante 5-10 minutos o hasta que el queso est\u00e9 fundido", "Paso 4": "Pica la cebolla roja, los jalape\u00f1os y las aceitunas", "Paso 5": "Sirve los nachos con la Tomate frito, guacamole, cebolla, jalape\u00f1os, aceitunas, cilantro y crema agria", "Paso 6": "Exprime el lim\u00f3n sobre los nachos antes de servir"}'::jsonb,
    '',
    '',
    'https://www.recetasnestle.com.mx/sites/default/files/styles/recipe_detail_desktop_new/public/srh_recipes/50c1c0272a6d12f7c80e5108b05e9506.jpg?itok=TzErp7Rl',
    'otra'
),
(
    'Lasaña de carne picada ',
    'con espinacas y queso de cabra',
    'comida',
    'Pastas y Arroces',
    4,
    '525',
    '2200',
    '30',
    '12',
    '40',
    '6',
    '4',
    '25',
    '0',
    '1 hora',
    '{"Paso 1": "Precalienta el horno a 180\u00baC", "Paso 2": "Cocina las placas de lasa\u00f1a seg\u00fan las instrucciones del paquete y res\u00e9rvalas", "Paso 3": "En una sart\u00e9n, calienta el aceite de oliva a fuego medio y a\u00f1ade la cebolla y el ajo picados", "Paso 4": "Sofr\u00ede hasta que la cebolla est\u00e9 transparente", "Paso 5": "A\u00f1ade la carne picada y cocina hasta que est\u00e9 dorada, luego agrega el Tomate frito, sal, pimienta y or\u00e9gano, y cocina a fuego lento durante 10 minutos", "Paso 6": "A\u00f1ade las espinacas y cocina hasta que se hayan reducido"}'::jsonb,
    '',
    '',
    'https://valledearas.com/wordpress/wp-content/uploads/2023/04/lasana-espinacas-queso-cabra.jpg',
    'otra'
),
(
    'Marmitako de Bonito',
    'con Patatas y Pimiento rojo',
    'comida',
    'Pescados',
    4,
    '525',
    '2200',
    '30',
    '8',
    '45',
    '6',
    '5',
    '25',
    '0',
    '1 hora y 30 minutos',
    '{"Paso 1": "Pela y corta las Patatas en trozos", "Paso 2": "En una cazuela, calienta el aceite de oliva y sofr\u00ede la cebolla y el ajo picados", "Paso 3": "A\u00f1ade los Pimiento rojo cortados en tiras y sofr\u00ede hasta que est\u00e9n tiernos", "Paso 4": "Agrega el Tomate frito, el piment\u00f3n y la hoja de laurel", "Paso 5": "A\u00f1ade las Patatas y el caldo de pescado", "Paso 6": "Cocina a fuego lento durante 30-40 minutos o hasta que las Patatas est\u00e9n tiernas"}'::jsonb,
    '',
    '',
    'https://i.blogs.es/34fb2d/marmitako/450_1000.jpg',
    'otra'
),
(
    'Quiche de Calabacín al horno',
    'con Huevos y Queso',
    'cena',
    'Vegetariano',
    4,
    '525',
    '2200',
    '30',
    '12',
    '40',
    '6',
    '4',
    '20',
    '0',
    '1 hora',
    '{"Paso 1": "Precalienta el horno a 220\u00baC", "Paso 2": "Estira las masas de pizza sobre una bandeja de horno", "Paso 3": "Distribuye el Tomate frito sobre las masas y sazona con sal, pimienta y or\u00e9gano", "Paso 4": "A\u00f1ade el queso mozzarella y los ingredientes al gusto", "Paso 5": "Roc\u00eda con aceite de oliva", "Paso 6": "Hornea durante 15-20 minutos o hasta que las pizzas est\u00e9n doradas y crujientes"}'::jsonb,
    '',
    '',
    'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/B53E4C66-A174-4ABE-81E0-B2827AF1E5FB/Derivates/F65156E4-2F78-4918-8AF3-8F544994239B.jpg',
    'otra'
),
(
    'Pollo al limón con tomillo',
    'y Arroz',
    'comida',
    'Aves',
    4,
    '531',
    '2223',
    '6.68',
    '1.55',
    '79.21',
    '10.73',
    '0.49',
    '38.46',
    '0',
    '1 hora',
    '{"Paso 1": "Precalienta el horno a 180\u00baC. Pela la cebolla y c\u00f3rtala por la mitad, luego, corta una mitad (doble para 4p) en trozos de 3 cm. Corta el br\u00f3coli por la mitad. De una mitad (doble para 4p), retira el tronco y c\u00f3rtalo en floretes. Pela y pica el ajo (ver cantidad en ingredientes) y res\u00e9rvalo en un bol grande.", "Paso 2": "Corta el lim\u00f3n por la mitad y expr\u00edmelo en el bol con el ajo. Agrega la mostaza, la , la miel, el\u00a0tomillo, un chorrito de aceite, el agua para la salsa (ver cantidad en ingredientes) y la harina (ver cantidad en ingredientes). Sazona con sal y pimienta y m\u00e9zclalo todo junto.", "Paso 3": "Agrega los muslos de pollo al bol y m\u00e9zclalo todo bien para que se impregne la salsa. Pon el pollo en una bandeja de horno con papel de horno, junto con la salsa.", "Paso 4": "Coloca la cebolla y los floretes de br\u00f3coli alrededor de la bandeja. Pon la bandeja en el estante del medio del horno y coc\u00ednalo 30-35 min, hasta que el pollo est\u00e9 totalmente cocinado, las verduras est\u00e9n tiernas y la salsa quede espesa y suave.", "Paso 5": "Llena un cazo con el agua para el arroz (ver cantidad en ingredientes)\u00a0y a\u00f1ade el arroz y sal al gusto. Cuando hierva, baja el fuego y tapa el cazo. Deja cocinar 11-13 min y remueve de vez en cuando. Una vez cocinado, remueve el arroz con la ayuda de un tenedor para separar los granos y res\u00e9rvalo en el cazo tapado.", "Paso 6": "Cuando todas las elaboraciones est\u00e9n listas, pon el pollo al lim\u00f3n con sus verduras en la mitad de un plato, luego, sirve el arroz en la otra mitad."}'::jsonb,
    'https://www.hellofresh.es/recipes/pollo-limon-arroz-verduras-6373c35108cf0b02479225cf',
    'https://www.hellofresh.es/recipecards/card/pollo-limon-arroz-verduras-6373c35108cf0b02479225cf-39969b5d.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF221011_R10_W47_ES_MB_Main_high-a494edc0.jpg',
    'otra'
),
(
    'Estofado casero de lentejas',
    'con chorizo salteado, Patatas y pimentón',
    'comida',
    'Sopas y Cremas',
    4,
    '535',
    '2240',
    '14',
    '5',
    '71.7',
    '12',
    '8.2',
    '26.7',
    '0',
    '1 hora y 15 minutos',
    '{"Paso 1": "Pela y pica finamente el ajo (ver cantidad en ingredientes). Pela la cebolla, div\u00eddela en dos y corta una mitad (doble para 4p) en daditos peque\u00f1os.\u00a0Corta las Patatas en dados de 2-3 cm.", "Paso 2": "En una olla grande, calienta un chorrito de\u00a0aceite a fuego medio-alto. Cuando est\u00e9 caliente, a\u00f1ade el Chorizo y saltea 1 min, hasta que se dore. Retira de la olla y reserva en un bol. En la misma olla, agrega el ajo y cocina 1-2 min, hasta que se dore.", "Paso 3": "Cuando el ajo est\u00e9 dorado, agrega la cebolla y una pizca de sal y cocina 4-5 min, hasta que quede transparente. Mientras tanto, retira la parte verde del puerro. Luego, corta la parte blanca en rodajas finas. Agrega el puerro a la olla y cocina 3-4 min, hasta que se ablande.", "Paso 4": "Agrega el piment\u00f3n a la olla y remueve por un momento. Luego, agrega el\u00a0Tomate frito, cocina 1 min y agrega la Patatas. Mezcla todo bien para que se integren los ingredientes. Agrega el agua (ver cantidad en ingredientes) y el Caldo de verduras en polvo. Remueve bien y lleva a ebullici\u00f3n.", "Paso 5": "Una vez hierva, baja el fuego y cocina 18-20 min, hasta que las Patatas est\u00e9n tiernas. Mientras tanto, escurre las lentejas con ayuda de un colador. Cuando queden 5 min para que las Patatas est\u00e9n listas, agrega las lentejas y el chorizo a la olla y cocina durante el tiempo restante.", "Paso 6": "Sirve el estofado de lentejas, chorizo y Patatas entre los platos hondos."}'::jsonb,
    'https://www.hellofresh.es/recipes/estofado-lentejas-chorizo-Patatas-63ca9c0f812a821893bf04ee',
    'https://www.hellofresh.es/recipecards/card/estofado-lentejas-chorizo-Patatas-63ca9c0f812a821893bf04ee-306479e0.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R01_W14_ES_ESCCL0000-2_Main_19_R_high-ca85252b.jpg',
    'otra'
),
(
    'Muslos de pollo asados a la barbacoa',
    'con verduras y Patatas al horno',
    'comida',
    'Aves',
    4,
    '538',
    '2250',
    '10.6',
    '5',
    '48.6',
    '12.7',
    '2.6',
    '32.6',
    '0',
    '1 hora y 20 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Precalienta el horno a 220\u00baC. En un bol grande, agrega los\u00a0muslos de pollo,\u00a0la mitad del sazonador barbacoa, un chorrito de aceite,\u00a0sal y pimienta. Con las manos, extiende el aderezo por el pollo y reserva hasta el paso 4.", "Paso 2": "Corta las\u00a0Patatas por la mitad a lo largo, luego, apoya la Patatas por la parte plana y corta en gajos de 1-2 cm de grosor. Corta el pimiento por la mitad y qu\u00edtale las semillas. Luego, c\u00f3rtalo en cuadrados de 2 cm. Retira los extremos del calabac\u00edn y c\u00f3rtalo por la mitad a lo largo. Luego, corta cada mitad en medias lunas de 0,5-1 cm.", "Paso 3": "Coloca el calabac\u00edn, el pimiento y las Patatas en una bandeja de horno con papel de horno y agrega el\u00a0sazonador barbacoa restante, un chorrito de aceite, sal y pimienta. Mezcla para que quede bien aderezado y hornea durante 10 min.", "Paso 4": "Cuando las verduras se hayan horneado 10 min, dales la vuelta. Luego, agrega el pollo a la misma bandeja de horno, sobre las verduras, y cocina 15-17 min m\u00e1s, hasta que el pollo est\u00e9 dorado y bien cocinado por dentro. Da la vuelta a mitad de cocci\u00f3n.", "Paso 5": "En un bol peque\u00f1o, agrega la salsa barbacoa y el queso crema. Salpimienta,\u00a0agrega un chorrito de aceite y remueve bien con ayuda de unas varillas, de forma que quede una salsa lisa.", "Paso 6": "Divide el pollo a la barbacoa, las verduras\u00a0y las Patatas asadas entre los platos. Sirve la crema de salsa barbacoa a un lado para acompa\u00f1ar tu plato al gusto."}'::jsonb,
    'https://www.hellofresh.es/recipes/pollo-asado-barbacoa-verduras-Patatas-65b1399bd1da3988cdd84f41',
    'https://www.hellofresh.es/recipecards/card/65b1399bd1da3988cdd84f41.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R07_W30_ES_ESFC0134-5_Main_6_Replace_cutted_chicken_edit_high-a1f3c495.jpg',
    'otra'
),
(
    'Pollo al ajillo',
    'con Arroz y Perejil',
    'comida',
    'Aves',
    4,
    '539',
    '2256',
    '5',
    '1.4',
    '71.1',
    '4.2',
    '0.4',
    '30.4',
    '0',
    '30 minutos',
    '{"Paso 1": "Llena un cazo con el agua para el arroz (ver cantidad en ingredientes) y a\u00f1ade el arroz y sal al gusto. Cuando hierva, baja a fuego medio-bajo y tapa el cazo. Deja cocinar 11-13 min y remueve de vez en cuando. Una vez cocinado, remueve el arroz con la ayuda de un tenedor para separar los granos y res\u00e9rvalo en el cazo tapado.", "Paso 2": "Pela y corta a l\u00e1minas el ajo (ver cantidad en ingredientes). Pela y pica la Cebolla. En una olla grande, calienta un chorrito de aceite a fuego medio. Una vez caliente, agrega los Muslos de pollo, salpimienta y cocina 5-7 min, hasta que est\u00e9n dorados y bien cocinados en el interior.", "Paso 3": "Cuando el pollo est\u00e9 listo, agrega el ajo laminado y cocina 1 min. Luego, agrega la Cebolla y cocina 3-4 min. A\u00f1ade el vinagre bals\u00e1mico, la mitad del tomillo (doble para 4p), el caldo de pollo en polvo y la harina (ver cantidad en ingredientes) y cocina 1 min. Luego, agrega el\u00a0agua para la salsa (ver cantidad en ingredientes) y mezcla todo bien. Cocina todo junto 2-3 min a fuego medio-alto. Salpimienta al gusto.", "Paso 4": "Pica finamente la mitad del\u00a0perejil (doble para 4p). Agrega la mitad del perejil picado a la olla y mezcla bien. Reparte el Arroz entre los platos y sirve el pollo al ajillo a un lado. Espolvorea el perejil picado restante al gusto.", "Paso 5": "", "Paso 6": ""}'::jsonb,
    'https://www.hellofresh.es/recipes/pollo-al-ajillo-640f51570565a60137055b72',
    'https://www.hellofresh.es/recipecards/card/pollo-al-ajillo-640f51570565a60137055b72-1d98e696.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R12_W13_ES_ESCC13934-3_Main_high-cae829cb.jpg',
    'otra'
),
(
    'Salmón al horno con salsa de champiñones',
    'acompañado de puré de Patatas con ajo confitado',
    'cena',
    'Pescados',
    4,
    '553',
    '2315',
    '17.9',
    '5.9',
    '41',
    '4.9',
    '0',
    '27.5',
    '0',
    '35 minutos',
    '{"Paso 1": "Precalienta el horno a 220\u00baC. Pela las Patatas y c\u00f3rtalas en dados de 2 cm. En una olla, agrega las Patatas, c\u00fabrelas con agua y a\u00f1ade una pizca de sal. Lleva a ebullici\u00f3n y cocina, a fuego medio, 13-15 min o hasta que est\u00e9n blandas. Luego, esc\u00farrelas y ponlas de nuevo en la olla. A\u00f1ade un chorrito de aceite o la mantequilla (ver cantidad en ingredientes) y salpimienta. Con la ayuda de un pasapur\u00e9s, aplasta las\u00a0Patatas hasta conseguir un pur\u00e9.", "Paso 2": "Pela el ajo (ver cantidad en ingredientes) y col\u00f3calo sobre un papel de aluminio. Luego, agrega un chorrito de aceite y envuelve el ajo con el papel de aluminio. Cocina en el horno durante 10-12 min, hasta que est\u00e9 blando. Una vez cocinado, aplasta con un tenedor y a\u00f1adelo al pur\u00e9 de Patatas. Remueve bien para integrar.", "Paso 3": "Limpia los champi\u00f1ones con la ayuda de un pa\u00f1o h\u00famedo. Retira y desecha el extremo del pie de los champi\u00f1ones. Luego, c\u00f3rtalos por la mitad y haz l\u00e1minas finas. Coloca el salm\u00f3n en una bandeja de horno con papel de horno y agrega un chorrito de aceite y salpimienta. Cocina en el estante superior del horno durante 12-15 min, hasta que est\u00e9 bien cocinado.", "Paso 4": "Pela y pica el\u00a0Ajo\u00a0(ver cantidad en ingredientes). En una sart\u00e9n, agrega un chorrito de aceite junto con el Ajo. Calienta a fuego medio y cocina 1-2 min o hasta que se dore. Agrega los champi\u00f1ones y sube a fuego alto. Cocina durante 4-5 min, hasta que se doren. Salpimienta al gusto.", "Paso 5": "Deshoja y pica la mitad del eneldo (doble para 4p). Agrega a la sart\u00e9n el\u00a0agua (ver cantidad en ingredientes) y lleva a ebullici\u00f3n. Cocina 2-3 min, hasta que se reduzca la salsa. Retira del fuego y agrega el queso crema y la mitad del eneldo picado. Salpimienta y remueve.", "Paso 6": "Sirve el pur\u00e9 de Patatas con ajo\u00a0en la base de los platos y agrega el salm\u00f3n encima. Cubre con la salsa de champi\u00f1ones y decora con el eneldo restante al gusto."}'::jsonb,
    'https://www.hellofresh.es/recipes/salmon-horno-salsa-champinones-pure-63f785bfbbe06d8c7489ce06',
    'https://www.hellofresh.es/recipecards/card/salmon-horno-salsa-champinones-pure-63f785bfbbe06d8c7489ce06-714f16a9.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF200907_R04_W43_UK_R3896-1_MB_main_remove_yellow_bits_high-8b697c5a.jpg',
    'otra'
),
(
    'Poke de langostinos con mayonesa de soja',
    'con pepino encurtido, maíz y Arroz',
    'comida',
    'Fast Food',
    4,
    '560',
    '2341',
    '12.9',
    '1.9',
    '68',
    '5.6',
    '1.1',
    '24.2',
    '0',
    '30 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Llena un cazo con el\u00a0agua (ver cantidad en ingredientes), a\u00f1ade el arroz y sal al gusto y lleva a ebullici\u00f3n con el cazo tapado. Cuando hierva, baja a fuego medio-bajo y deja cocinar 11-13 min, removiendo ocasionalmente. Una vez cocinado, remueve el arroz con la ayuda de un tenedor para separar los granos y res\u00e9rvalo en el cazo tapado.", "Paso 2": "Retira los extremos del pepino y c\u00f3rtalo por la mitad a lo largo. Luego, retira las semillas con ayuda de una cuchara, de forma que la parte interior del pepino quede ligeramente hueca. Corta en medias lunas de 0,5-1 cm. Coloca el pepino en un bol y agrega chili en escamas al gusto, el vinagre de vino tinto y el az\u00facar (ver cantidad en ingredientes de ambos). Agrega sal, remueve y reserva hasta el emplatado.", "Paso 3": "Seca los langostinos con papel de cocina. En una sart\u00e9n, calienta un chorrito de aceite a fuego medio-alto. Cuando el aceite est\u00e9 caliente, agrega los langostinos, salpimienta y cocina 1-2 min, moviendo ocasionalmente, hasta que se doren. Cuando est\u00e9n listos, retira y reserva.", "Paso 4": "Escurre el ma\u00edz. En un bol, mezcla la\u00a0salsa de soja y la mayonesa. Sirve el Arroz en la base de los boles y agrega encima los langostinos salteados, el ma\u00edz y el pepino encurtido, previamente escurrido. A\u00f1ade sobre el poke la mayonesa de soja al gusto.", "Paso 5": "", "Paso 6": ""}'::jsonb,
    'https://www.hellofresh.es/recipes/poke-langostinos-pepino-maiz-6616b8e39064812f61712cbb',
    '',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R11_W35_ES_ESCCLPF16373-2_Main_high-dc9c228d.jpg',
    'otra'
),
(
    'Salmón al horno con manzana asada',
    'con zanahoria encurtida y mayonesa de cilantro y lima',
    'cena',
    'Pescados',
    4,
    '571',
    '2389',
    '29.4',
    '4.3',
    '37.7',
    '23.2',
    '11.2',
    '20.6',
    '0',
    '40 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Precalienta el horno a 200\u00baC. Corta la manzana por la mitad y retira el coraz\u00f3n, luego, apoya por la parte plana y corta cada mitad en 4 gajos. Coloca los gajos de\u00a0manzana en una bandeja de horno con papel de horno y a\u00f1ade encima un chorrito de aceite. Salpimienta y remueve. Hornea a media altura durante 12 min.", "Paso 2": "Ralla la piel de media lima (doble para 4p). Pela la\u00a0zanahoria y, con la ayuda del pelador, haz cintas a lo largo. Coloca las cintas de zanahoria en un bol y agrega el zumo de la mitad de la lima (doble para 4p) y el az\u00facar (ver cantidad en ingredientes). Remueve y reserva hasta el emplatado.", "Paso 3": "Salpimienta el salm\u00f3n. Cuando la\u00a0manzana se haya horneado por 12 min, da la vuelta para que se cocine de manera uniforme. Coloca el salm\u00f3n con la piel hacia abajo en la bandeja de horno, junto a la manzana, y hornea 10-12 min m\u00e1s, hasta que la manzana est\u00e9 tierna y dorada y el salm\u00f3n quede completamente cocinado.", "Paso 4": "Deshoja y pica el cilantro. En un bol peque\u00f1o, agrega la mitad del cilantro picado, la mayonesa y ralladura de lima al gusto. Salpimienta y remueve bien.", "Paso 5": "En otro bol peque\u00f1o, agrega el cilantro restante, un chorrito de aceite, sal y pimienta al gusto. Luego, remueve bien.", "Paso 6": "Cuando est\u00e9n listos, sirve el salm\u00f3n a un lado de los platos y cubre con el cilantro aderezado. Acompa\u00f1a con las cintas encurtidas de zanahoria y la manzana asada. Finalmente, a\u00f1ade la mayonesa de cilantro y lima en el plato.\n\u00a0\nSAB\u00cdAS QUE: Una vez la manzana est\u00e1 abierta, sumergirla en agua con lim\u00f3n evitar\u00e1 que se oxide, proceso tambi\u00e9n conocido como pardeamiento enzim\u00e1tico."}'::jsonb,
    'https://www.hellofresh.es/recipes/salmon-manzana-zanahoria-mayonesa-6616b8d39064812f61712c8f',
    'https://www.hellofresh.es/recipecards/card/6616b8d39064812f61712c8f-es-ES.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y24_R18_W22_ES_ESPCCLF14554-2_edit_apples_Main_high-2c460f37.jpg',
    'otra'
),
(
    'Pollo asado con Patatas y queso griego',
    'con verduras horneadas en su jugo y pimentón',
    'comida',
    'Aves',
    4,
    '577',
    '2415',
    '17.1',
    '9.6',
    '48.4',
    '9.8',
    '2.1',
    '37.7',
    '0',
    '1 hora y 30 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Precalienta el horno a 220\u00baC. Corta las\u00a0Patatas por la mitad a lo largo, luego, apoya la Patatas por la parte plana y corta en gajos de 1-2 cm de grosor. Pela la cebolla, div\u00eddela en dos y c\u00f3rtala en tiras de 2 cm. Corta el\u00a0pimiento por la mitad, quita las semillas y corta en tiras de 1 cm.", "Paso 2": "Coloca la Patatas en gajos, la cebolla, el pimiento y el ajo sin pelar (ver cantidad en ingredientes) en una bandeja de horno con papel de horno. Agrega la mitad del Tomillo, el\u00a0piment\u00f3n ahumado y\u00a0un chorrito de aceite. Salpimienta y remueve para que el aderezo se reparta bien. Hornea a media altura durante 15 min.", "Paso 3": "Seca los muslos de pollo, salpimienta y agrega un chorrito de aceite y el Tomillo restante. Cuando las verduras se hayan horneado 15 min, remueve para que se cocinen de forma uniforme. Luego, sobre las verduras,\u00a0coloca los\u00a0muslos de pollo. Hornea 15-17 min m\u00e1s, hasta que el\u00a0pollo quede bien hecho y las verduras, tiernas.", "Paso 4": "Mientras tanto, desmenuza con las manos el\u00a0queso griego en trozos medianos.", "Paso 5": "Cuando el pollo y los vegetales est\u00e9n listos, retira la piel del ajo y des\u00e9chala. Aplasta el ajo asado y m\u00e9zclalo con los jugos que queden en la bandeja. Luego, remueve para que las\u00a0verduras y el pollo queden sazonados.", "Paso 6": "Sirve el pollo asado con Patatas y verduras en platos y agrega encima los jugos que hayan quedado en la bandeja de horno. Agrega el queso griego al gusto sobre el plato."}'::jsonb,
    'https://www.hellofresh.es/recipes/pollo-asado-Patatas-queso-verduras-65d8b0dfe15fd4f7b093a41a',
    'https://www.hellofresh.es/recipecards/card/65d8b0dfe15fd4f7b093a41a.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y24_R02_W01_ES_ESCFC0065-8_MAIN__13high-81510f7d.jpg',
    'otra'
),
(
    'Pechuga de pollo con almendras laminadas',
    'sobre guiso de verduras al estilo marroquí',
    'comida',
    'Aves',
    4,
    '587',
    '2456',
    '5.5',
    '0.5',
    '59.4',
    '16.9',
    '0',
    '34.4',
    '0',
    '40 minutos',
    '{"Paso 1": "Pela la cebolla, div\u00eddela en dos y corta una mitad (doble para 4p) en daditos peque\u00f1os. Pela las Patatas y troc\u00e9alas en dados de 2-3 cm. Pela la zanahoria y c\u00f3rtala por la mitad a lo largo. Luego, corta cada mitad en medias lunas de 0,5-1 cm.\u00a0En una olla, calienta un chorrito de aceite a fuego medio. Luego, agrega la\u00a0cebolla y una pizca de sal y saltea 1 min.", "Paso 2": "En la olla, agrega las Patatas, la zanahoria y el  y cocina durante 1 min m\u00e1s. Vierte en la olla el agua\u00a0(ver cantidad en ingredientes) y agrega el Caldo de verduras en polvo. Lleva a ebullici\u00f3n, luego, cocina a fuego bajo, con la olla tapada, durante 20-25 min. Remueve regularmente.", "Paso 3": "En una sart\u00e9n, calienta un chorrito de\u00a0aceite a fuego medio. Agrega las\u00a0almendras laminadas y cocina 2 min, hasta que se doren. Luego, retira de la sart\u00e9n y reserva. En la sart\u00e9n, calienta un chorrito de\u00a0aceite a fuego medio. Una vez caliente, agrega el\u00a0pollo, salpimienta y cocina 3-4 min por lado, hasta que est\u00e9 bien cocinado en el interior.", "Paso 4": "Agrega de nuevo las almendras tostadas a la sart\u00e9n con el pollo y cocina 1 min a fuego bajo. Remueve para que los ingredientes se integren. Reserva fuera de la sart\u00e9n cuando est\u00e9 listo.", "Paso 5": "Corta el\u00a0tomate por la mitad y, luego, corta cada parte en 4 gajos. Cuando queden 5 min para que las verduras de la olla est\u00e9n listas, agrega el Tomate frito y cocina, sin tapa, los 5 min restantes. En el \u00faltimo momento, a\u00f1ade el\u00a0tomate en gajos y la miel. Salpimienta y remueve para que todo se integre.", "Paso 6": "Deshoja la mitad del perejil (doble para 4p) y p\u00edcalo en trozos grandes. Sirve el\u00a0guiso de verduras en la base de los platos y coloca la pechuga de pollo con almendras tostadas a un lado. Espolvorea perejil picado al gusto sobre el plato."}'::jsonb,
    'https://www.hellofresh.es/recipes/pechuga-de-pollo-con-almendras-laminadas-6458df7874ba2c58f3c09781',
    'https://www.hellofresh.es/recipecards/card/6458df7874ba2c58f3c09781.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF221222_R13_W06_ES_ESFCLC0040-2_KB_Main_high-a33d811d.jpg',
    'otra'
),
(
    'Ropa Vieja de Ternera',
    'con Patatas y Zanahoria Glaseadas',
    'comida',
    'Carnes',
    4,
    '600',
    '2500',
    '30',
    '10',
    '45',
    '8',
    '6',
    '35',
    '0',
    '1 hora y 30 minutos',
    '{"Paso 1": "En una sart\u00e9n grande, calienta el aceite de oliva y sofr\u00ede la cebolla y el ajo picados", "Paso 2": "A\u00f1ade la carne de ternera desmenuzada y cocina hasta que est\u00e9 dorada", "Paso 3": "Agrega el Tomate frito, sal, pimienta y la hoja de laurel y cocina a fuego lento durante 30 minutos", "Paso 4": "Pela y corta las Patatas en trozos grandes y cocina en agua con sal hasta que est\u00e9n tiernas", "Paso 5": "En otra sart\u00e9n, derrite la mantequilla y a\u00f1ade las Zanahoria cortadas en rodajas y el az\u00facar y cocina hasta que las Zanahoria est\u00e9n glaseadas", "Paso 6": "Sirve la ropa vieja de ternera acompa\u00f1ada de las Patatas y las Zanahoria glaseadas"}'::jsonb,
    '',
    '',
    'https://www.vidactual.com/rcpmaker/wp-content/uploads/2020/06/ropavieja-1.jpg',
    'otra'
),
(
    'Filetes de ternera a la plancha',
    'con tortilla de Patatas',
    'comida',
    'Carnes',
    4,
    '600',
    '2500',
    '35',
    '10',
    '40',
    '5',
    '5',
    '30',
    '0',
    '40 minutos',
    '{"Paso 1": "Pela y corta las Patatas y la cebolla en rodajas finas", "Paso 2": "Fr\u00ede las Patatas y la cebolla en abundante aceite de oliva hasta que est\u00e9n tiernas", "Paso 3": "Escurre las Patatas y cebolla y m\u00e9zclalas con los Huevos batidos y sal", "Paso 4": "En una sart\u00e9n con un poco de aceite, cocina la mezcla a fuego medio hasta que cuaje por un lado. Da la vuelta y cocina por el otro lado", "Paso 5": "Sazona los filetes de ternera con sal y pimienta", "Paso 6": "Cocina los filetes en una plancha caliente durante unos 3 minutos por cada lado o hasta el punto deseado"}'::jsonb,
    '',
    '',
    'https://i.ytimg.com/vi/O3Xv3Mnk1Nk/sddefault.jpg',
    'otra'
),
(
    'Pizzas Artesanales con Tomate',
    'Queso e Ingredientes al gusto',
    'cena',
    'Fast Food',
    4,
    '600',
    '2500',
    '35',
    '15',
    '45',
    '8',
    '3',
    '25',
    '0',
    '30 minutos',
    '{"Paso 1": "Forma las hamburguesas con la carne picada y sazona con sal y pimienta", "Paso 2": "Cocina las hamburguesas en una sart\u00e9n con aceite de oliva hasta que est\u00e9n doradas", "Paso 3": "Tosta ligeramente los panes de hamburguesa", "Paso 4": "Coloca la lechuga, el tomate en rodajas, la cebolla en aros y el queso de cabra sobre los panes", "Paso 5": "A\u00f1ade la hamburguesa cocida y cubre con la otra mitad del pan", "Paso 6": "Sirve con mostaza y k\u00e9tchup al gusto"}'::jsonb,
    '',
    '',
    'https://www.laespanolaaceites.com/wp-content/uploads/2019/06/pizza-con-tomate-albahaca-y-mozzarella.jpg',
    'otra'
),
(
    'Fabada Asturiana Tradicional',
    'con Chorizo Morcilla y Panceta',
    'comida',
    'Legumbres',
    4,
    '600',
    '2500',
    '35',
    '12',
    '45',
    '10',
    '6',
    '30',
    '0',
    '2 horas',
    '{"Paso 1": "Remoja las fabes en agua durante la noche anterior", "Paso 2": "En una cazuela grande, calienta el aceite de oliva y sofr\u00ede la cebolla y el ajo picados", "Paso 3": "A\u00f1ade el chorizo, la morcilla y la panceta cortados en trozos", "Paso 4": "Agrega las fabes, el piment\u00f3n, la hoja de laurel y el caldo de carne", "Paso 5": "Cocina a fuego lento durante 2 horas o hasta que las fabes est\u00e9n tiernas", "Paso 6": "Ajusta la sal antes de servir"}'::jsonb,
    '',
    '',
    'https://content-cocina.lecturas.com/medio/2022/10/20/paso_a_paso_para_realizar_fabada_asturiana_al_estilo_tradicional_resultado_final_d3f02f0a_1280x720.jpg',
    'otra'
),
(
    'Gnocchis con vinagreta de bacon',
    'con tomates cherry en salsa de queso al tomillo',
    'comida',
    'Pastas y Arroces',
    4,
    '609',
    '2547',
    '22.5',
    '9',
    '65.4',
    '3.6',
    '5.7',
    '15.5',
    '0',
    '25 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! En un cazo, agrega abundante agua junto con una pizca de sal y lleva a ebullici\u00f3n. Mientras tanto, corta los tomates cherry por la mitad. En la sart\u00e9n, calienta un chorrito de\u00a0aceite a fuego medio-alto y saltea el bacon 3-4 min, hasta que est\u00e9 dorado. Cuando el bacon est\u00e9 listo, retira de la sart\u00e9n y reserva en un bol. Retira el exceso de grasa de la sart\u00e9n.", "Paso 2": "Cuando el agua del cazo hierva, agrega los gnocchis (ver cantidad en ingredientes) y cocina 2 min. Una vez listos, reserva el\u00a0agua de la cocci\u00f3n (ver cantidad en ingredientes), luego, escurre con ayuda de un colador. En la sart\u00e9n, calienta un chorrito de\u00a0aceite a fuego medio-alto. Agrega los tomates cherry, salpimienta y saltea 2-3 min, removiendo, hasta que se doren.", "Paso 3": "En la sart\u00e9n, a\u00f1ade el bacon cocinado, la mitad del vinagre bals\u00e1mico (doble para 4p), el queso crema\u00a0y el Tomillo y mezcla bien. Luego, agrega el agua de cocci\u00f3n reservada y cocina a fuego medio-alto 3 min, removiendo ocasionalmente, hasta que la salsa se reduzca ligeramente.\n\u00a0\nSAB\u00cdAS QUE: El almid\u00f3n que contiene el agua de cocci\u00f3n de la pasta ayudar\u00e1 a que te quede una salsa m\u00e1s espesa.", "Paso 4": "Cuando la salsa haya espesado, agrega a la sart\u00e9n los gnocchis cocidos y remueve bien. Prueba y rectifica de sal y pimienta. Sirve los\u00a0gnocchis con bacon y tomates cherry en platos.", "Paso 5": "", "Paso 6": ""}'::jsonb,
    'https://www.hellofresh.es/recipes/gnocchis-vinagreta-bacon-cherry-65d8b0c7e15fd4f7b093a38b',
    'https://www.hellofresh.es/recipecards/card/65d8b0c7e15fd4f7b093a38b.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R03_W20_ES_ESQCP14738-2_Main_4_high-31a3545f.jpg',
    'otra'
),
(
    'Vichyssoise con manzana caramelizada',
    'y champiñones salteados al pesto',
    'cena',
    'Sopas y Cremas',
    4,
    '615',
    '2572',
    '30.1',
    '13.4',
    '56.7',
    '26.5',
    '2.7',
    '12.1',
    '0',
    '30 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Pela y pica el\u00a0ajo (ver cantidad en ingredientes). Pela la cebolla, div\u00eddela en dos y c\u00f3rtala en daditos peque\u00f1os. Retira las ra\u00edces y el extremo verde del puerro y des\u00e9chalos. C\u00f3rtalo por la mitad a lo largo y, luego, corta en medias lunas finas. Corta la manzana por la mitad y retira el coraz\u00f3n. Luego, corta en dados de 1 cm.", "Paso 2": "En una olla, a\u00f1ade un chorrito de aceite y el ajo. Calienta a fuego medio y cocina 1-2 min. Luego, agrega la cebolla, el puerro y una pizca de sal y cocina 5-6 min, removiendo, hasta que las\u00a0verduras empiecen a ablandarse. Agrega la nata l\u00edquida, el Caldo de verduras\u00a0y el agua (ver cantidad en ingredientes). Salpimienta, mezcla y tapa la olla. Lleva a ebullici\u00f3n, luego, cocina a fuego medio-bajo 6-7 min, hasta que las\u00a0verduras est\u00e9n blandas.", "Paso 3": "Mientras tanto, calienta una sart\u00e9n antiadherente a fuego medio. Agrega la manzana, la nuez moscada,\u00a0el az\u00facar (ver cantidad en ingredientes)\u00a0y un chorrito de agua. Cocina 3 min con la tapa puesta y, luego, 3 min sin tapar, hasta que la manzana se haya oscurecido y est\u00e9 caramelizada. Cuando est\u00e9 lista, reserva en un plato.", "Paso 4": "Limpia los champi\u00f1ones con la ayuda de un pa\u00f1o h\u00famedo. Retira y desecha el extremo del pie de los champi\u00f1ones. Luego, c\u00f3rtalos en cuartos. En la sart\u00e9n, calienta un chorrito de aceite a fuego medio. Luego, agrega los champi\u00f1ones\u00a0y el pesto de albahaca y saltea 3-4 min, removiendo para que los champi\u00f1ones\u00a0queden cubiertos por el pesto. Prueba y salpimienta al gusto.", "Paso 5": "Cuando las verduras de la olla se hayan cocinado, trit\u00faralas con la ayuda de un t\u00farmix, de manera que quede una crema lisa. Prueba la crema y rectifica de sal y pimienta. Pica la mitad del\u00a0cebollino (doble para 4p).", "Paso 6": "Sirve la vichyssoise en platos hondos y agrega encima la manzana caramelizada. Espolvorea el cebollino picado al gusto sobre la crema. Sirve los champi\u00f1ones\u00a0al pesto en un bol junto a tu plato para acompa\u00f1ar la vichyssoise."}'::jsonb,
    'https://www.hellofresh.es/recipes/vichyssoise-manzana-champinones-pesto-6584baafc6869ff77feaec81',
    'https://www.hellofresh.es/recipecards/card/6584baafc6869ff77feaec81.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R15_W51_ES_ESVVCL13450-6_Main_PR_high-a61fc085.jpg',
    'otra'
),
(
    'Lasaña de calabacín y carne de ternera',
    'con queso gratinado',
    'comida',
    'Pastas y Arroces',
    4,
    '617',
    '2582',
    '31.7',
    '14.1',
    '26.3',
    '13.2',
    '0.5',
    '40.5',
    '0',
    '1 hora',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Precalienta el horno a 220\u00baC con la opci\u00f3n de gratinar. Pela y pica el\u00a0ajo (ver cantidad en ingredientes). Pela y ralla la zanahoria. Pela la cebolla, div\u00eddela en dos y corta una mitad (doble para 4p) en daditos peque\u00f1os.\u00a0Retira los extremos del calabac\u00edn y c\u00f3rtalo en rodajas de 0,5-1 cm.", "Paso 2": "En una sart\u00e9n, agrega un chorrito de aceite junto con el ajo. Calienta a fuego medio y cocina 1-2 min o hasta que se dore. Agrega la cebolla, la zanahoria y una pizca de sal y rehoga durante 4-5 min o hasta que las\u00a0verduras empiecen a abladarse. En otra sart\u00e9n, calienta un chorrito de aceite a fuego medio. Salpimienta las rodajas de calabac\u00edn y cocina 2 min por lado, hasta que se doren ligeramente.", "Paso 3": "Salpimienta la carne de ternera y a\u00f1\u00e1dela a la sart\u00e9n con la cebolla y la zanahoria. Cocina durante 2-3 min o hasta que empiece a dorarse, removiendo para desmenuzar la carne. Agrega la mitad del tomate frito (doble para 4p) y el\u00a0or\u00e9gano (ver cantidad en ingredientes) y mezcla bien. Cocina durante 5-6 min, hasta que la salsa espese ligeramente.", "Paso 4": "Reparte un chorrito de aceite en la base de una fuente para horno. Coloca una capa de rodajas de calabac\u00edn y cubre con el\u00a0sofrito de verduras, carne y tomate. Repite el proceso dos veces m\u00e1s, de manera que tengas tres capas de calabac\u00edn y una \u00faltima capa de sofrito de tomate y carne.", "Paso 5": "Agrega el\u00a0queso rallado sobre la lasa\u00f1a. Hornea durante 10-12 min, hasta que el queso se gratine.", "Paso 6": "Cuando la lasa\u00f1a est\u00e9 lista, s\u00e1cala del horno y espolvorea el or\u00e9gano para el aderezo (ver cantidad en ingredientes) al gusto por encima. Sirve porciones de\u00a0lasa\u00f1a de calabac\u00edn y carne de ternera en los platos."}'::jsonb,
    'https://www.hellofresh.es/recipes/lasana-de-calabacin-y-carne-de-ternera-649f374b27a2eef57c938592',
    'https://www.hellofresh.es/recipecards/card/649f374b27a2eef57c938592.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R07_W08_ES_ESCL193-113425-2_Main_oregano_high-2ce4c900.jpg',
    'otra'
),
(
    'Pollo asado al horno ',
    'con Patatas y Pimiento rojo',
    'comida',
    'Aves',
    4,
    '620',
    '2595',
    '35',
    '10',
    '35',
    '7',
    '6',
    '45',
    '0',
    '1 hora 30 minutos',
    '{"Paso 1": "Precalienta el horno a 200\u00baC", "Paso 2": "Pela las Patatas y c\u00f3rtalas en trozos grandes", "Paso 3": "Corta los Pimiento rojo en tiras", "Paso 4": "Pela y pica los ajos", "Paso 5": "Coloca el pollo en una bandeja de horno, roc\u00eda con aceite de oliva, sal y pimienta, e introduce medio lim\u00f3n en el interior del pollo", "Paso 6": "Mezcla las Patatas y los Pimiento rojo con aceite de oliva, sal y pimienta y col\u00f3calos alrededor del pollo"}'::jsonb,
    '',
    '',
    'https://cocinaconnoelia.com/wp-content/uploads/2024/01/Cuartos-de-pollo-asado-con-patatas-scaled.webp',
    'otra'
),
(
    'Crema casera de zanahoria y langostinos',
    'acompañada de pan con queso crema al cebollino',
    'cena',
    'Sopas y Cremas',
    4,
    '621',
    '2599',
    '15.3',
    '8.5',
    '72.6',
    '17.9',
    '7.3',
    '30.7',
    '0',
    '40 minutos',
    '{"Paso 1": "Pela y pica el\u00a0ajo (ver cantidad en ingredientes). Pela la cebolla, div\u00eddela en dos y c\u00f3rtala en daditos peque\u00f1os. En una olla, agrega un chorrito de aceite y la mitad del ajo. Calienta a fuego medio y cocina 1-2 min. Luego, a\u00f1ade la cebolla y cocina 4-5 min. Pela la zanahoria y c\u00f3rtala por la mitad a lo largo. Luego, corta cada mitad en medias lunas de 0,5-1 cm. Cuando la\u00a0cebolla est\u00e9 transparente, a\u00f1ade la zanahoria y cocina 2-3 min.", "Paso 2": "En la olla, a\u00f1ade el agua (ver cantidad en ingredientes), la leche y el Caldo de verduras en polvo a la olla. Lleva a ebullici\u00f3n, luego, baja a fuego medio y cubre con una tapa, salpimienta al gusto. Cocina 20-25 min, hasta que las Zanahoria est\u00e9n tiernas. Remueve ocasionalmente.", "Paso 3": "Mientras tanto, pica finamente la mitad del cebollino (doble para 4p) y pon la mitad en un bol. A\u00f1ade 2/3 queso crema,\u00a0salpimienta y mezcla bien, de forma que quede una salsa homog\u00e9nea.", "Paso 4": "Abre el\u00a0pan de chapata y tu\u00e9stalo en la tostadora hasta que est\u00e9 ligeramente dorado. Luego, unta la crema de queso al cebollino sobre los panes.", "Paso 5": "Seca los langostinos con papel de cocina. Cuando queden 2 min para que la\u00a0zanahoria est\u00e9 tierna, en una sart\u00e9n, calienta un chorrito de aceite a fuego medio-alto. Cuando el aceite est\u00e9 caliente, agrega los langostinos, el ajo restante, salpimienta y cocina 1-2 min, hasta que se doren. Cuando est\u00e9n listos, retira y reserva.", "Paso 6": "Cuando la zanahoria est\u00e9 tierna, agrega el contenido de la olla a la jarra medidora junto con el queso crema restante y tritura con ayuda de un t\u00farmix hasta que quede una crema lisa y suave. Salpimienta al gusto. Sirve la\u00a0crema de Zanahoria en platos hondos, agrega encima los\u00a0langostinos\u00a0y espolvorea\u00a0el cebollino picado al gusto. Sirve el pan con queso crema al cebollino como acompa\u00f1amiento."}'::jsonb,
    'https://www.hellofresh.es/recipes/crema-casera-de-zanahoria-y-langostinos-6347efe6bb36093c54997957',
    '',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF221010_R05_W49_ES_ESCFCL0149-1_KB_Main3_erase_the_nuts_edit_high-3547db5f.jpg',
    'otra'
),
(
    'Risotto de espinacas con crujiente de queso',
    'con nueces tostadas y queso pecorino',
    'comida',
    'Pastas y Arroces',
    4,
    '632',
    '2643',
    '13.9',
    '4.4',
    '97.2',
    '4.1',
    '2',
    '17.8',
    '0',
    '40 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! En una olla, agrega el agua (ver cantidad en ingredientes) y sal y lleva a ebullici\u00f3n. Luego, agrega casi todas las espinacas y cocina 1 min. Conservando el agua en la olla, retira las espinacas con una ara\u00f1a o espumadera y col\u00f3calas en una jarra medidora. Agrega la Mantequilla (ver cantidad en ingredientes) y sal y tritura con un t\u00farmix.", "Paso 2": "En la olla con el agua, agrega el Caldo de verduras en polvo y mant\u00e9n caliente a fuego bajo. Calienta una sart\u00e9n antiadherente a fuego medio sin aceite. Reparte el queso italiano en dos peque\u00f1os montones en la sart\u00e9n, dejando un espacio entre ellos. Cocina durante 2 min, dales la vuelta con ayuda de una esp\u00e1tula y cocina 2 min m\u00e1s, hasta conseguir dos piezas de queso tostado y crujiente.", "Paso 3": "Calienta la sart\u00e9n a fuego medio sin aceite y tuesta las\u00a0nueces 2-3 min, luego, retira de la sart\u00e9n. Pela y pica finamente la Cebolla. En la sart\u00e9n, calienta un chorrito de aceite a fuego medio. Agrega la Cebolla y cocina 2-3 min, removiendo frecuentemente, hasta que se dore. Luego, a\u00f1ade el Arroz y cocina a fuego medio-alto 1-2 min m\u00e1s, mientras remueves.", "Paso 4": "Agrega dos cucharones del Caldo de verduras de la olla a la sart\u00e9n con el arroz y remueve, hasta que el arroz absorba el caldo. Repite el proceso agregando cucharones de caldo cada vez que el arroz lo absorba, hasta que el arroz est\u00e9 cocido. El proceso deber\u00eda tomar 19-22 min y el arroz debe quedar cremoso, no seco.", "Paso 5": "Cuando el arroz est\u00e9 listo, retira la sart\u00e9n del fuego y agrega la salsa de espinacas. Mezcla bien para integrar. Luego, agrega el\u00a0pecorino y la mantequilla (ver cantidad en ingredientes) y mezcla de nuevo para mantecar el risotto y que quede\u00a0untuoso. Prueba y rectifica de sal y pimienta.\n\u00a0\nSAB\u00cdAS QUE: Mantecar es una t\u00e9cnica culinaria que consiste en agregar una grasa, en forma de queso y/o mantequilla, al risotto para que quede meloso.", "Paso 6": "Pica las nueces tostadas y trocea el crujiente de queso. Sirve el\u00a0risotto de espinacas y pecorino en platos y agrega encima las nueces tostadas, las hojas de espinacas reservadas y el crujiente de queso."}'::jsonb,
    'https://www.hellofresh.es/recipes/risotto-espinacas-queso-nueces-6616b8c99064812f61712c57',
    'https://www.hellofresh.es/recipecards/card/6616b8c99064812f61712c57-es-ES.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y24_R09_W22_ES_ESFVV23162-2_Main_high-ea064313.jpg',
    'otra'
),
(
    'Croquetas Artesanales de Jamón',
    'con Bechamel Cremosa',
    'cena',
    'Fast Food',
    4,
    '670',
    '2800',
    '40',
    '14',
    '50',
    '10',
    '7',
    '35',
    '0',
    '1 hora y 30 minutos',
    '{"Paso 1": "Pica finamente el jam\u00f3n serrano y la cebolla", "Paso 2": "En una sart\u00e9n, derrite la mantequilla con el aceite de oliva y sofr\u00ede la cebolla. A\u00f1ade la harina y cocina durante 2-3 minutos", "Paso 3": "A\u00f1ade la leche poco a poco, removiendo constantemente hasta obtener una bechamel espesa", "Paso 4": "Agrega el jam\u00f3n, la nuez moscada, la sal y la pimienta", "Paso 5": "Deja enfriar la mezcla en el frigor\u00edfico durante al menos 1 hora. Forma croquetas con la masa, p\u00e1salas por Huevos batido y pan rallado", "Paso 6": "Fr\u00ede las croquetas en aceite caliente hasta que est\u00e9n doradas"}'::jsonb,
    '',
    '',
    'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/F9D4BA2E-255F-417A-8C7C-C2DEAFA8B351/Derivates/265B15E9-7DC7-4DE3-9F70-2BD602C54BB1.jpg',
    'otra'
),
(
    'Migas de bacalao',
    'con bechamel',
    'cena',
    'Pescados',
    4,
    '670',
    '2800',
    '40',
    '14',
    '50',
    '10',
    '7',
    '35',
    '0',
    '45 minutos',
    '{"Paso 1": "Remoja el pan duro en la leche hasta que est\u00e9 blando", "Paso 2": "En una sart\u00e9n, calienta el aceite de oliva y sofr\u00ede los ajos picados", "Paso 3": "A\u00f1ade el bacalao desmigado y cocina hasta que est\u00e9 dorado", "Paso 4": "En otra sart\u00e9n, derrite la mantequilla y a\u00f1ade la harina", "Paso 5": "Cocina durante 2-3 minutos y a\u00f1ade la leche poco a poco", "Paso 6": "Remueve hasta obtener una bechamel espesa y a\u00f1ade la nuez moscada, sal y pimienta"}'::jsonb,
    '',
    '',
    'https://img-global.cpcdn.com/recipes/35b1d3120d7f0701/1200x630cq70/photo.jpg',
    'otra'
),
(
    'Lomo con cebolla caramelizada y queso',
    'acompañado de Patatas y cintas de calabacín al tomillo',
    'comida',
    'Carnes',
    4,
    '696',
    '2910',
    '23.9',
    '10.2',
    '43.7',
    '6.9',
    '1.3',
    '34',
    '0',
    '50 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Precalienta el horno a 220\u00baC. Corta las\u00a0Patatas por la mitad a lo largo, luego,\u00a0corta en gajos de 1-2 cm de grosor. Col\u00f3calos en una bandeja de horno con papel de horno y agrega un chorrito de aceite, sal y pimienta. Mezcla para que las Patatas queden bien aderezadas. Hornea 20-25 min o hasta que est\u00e9n doradas. Da la vuelta a mitad de cocci\u00f3n.", "Paso 2": "Pela la cebolla, div\u00eddela en dos y corta una mitad (doble para 4p) en tiras finas. En una sart\u00e9n, calienta un chorrito de aceite a fuego medio-alto. Una vez caliente, agrega la cebolla y una pizca de sal y cocina 2-3 min. Luego, a\u00f1ade el vinagre bals\u00e1mico y el az\u00facar (ver cantidad en ingredientes) y cocina a fuego medio-bajo 5-6 min m\u00e1s, removiendo frecuentemente, hasta que se oscurezca y quede caramelizada. Retira y reserva fuera de la sart\u00e9n.", "Paso 3": "En la sart\u00e9n, calienta un chorrito de aceite a fuego medio-alto. Luego, agrega la Lomo, salpimienta y cocina 2 min por un lado. Luego, cocina 1 min m\u00e1s por el otro lado, hasta que se dore.", "Paso 4": "Agrega la cebolla caramelizada sobre cada Lomo. Luego, cubre con la mitad del queso rallado (doble para 4p), presionando un poco para que se adhiera. Tapa la sart\u00e9n y deja que el queso rallado se funda a fuego medio durante 2 min. Retira de la sart\u00e9n cuando el queso se haya fundido y el lomo quede bien hecho.", "Paso 5": "Haz cintas a lo largo del calabac\u00edn con la ayuda de un pelador. En la sart\u00e9n, calienta un chorrito de\u00a0aceite a fuego medio. Una vez caliente, agrega las cintas de calabac\u00edn y adereza con el Tomillo, sal y pimienta al gusto. Cocina a fuego alto durante 2-3 min, removiendo ocasionalmente, hasta que las\u00a0cintas queden doradas.", "Paso 6": "Sirve la Lomo\u00a0con cebolla caramelizada y queso fundido en platos y acompa\u00f1a con las Patatas al horno y el\u00a0calabac\u00edn al tomillo."}'::jsonb,
    'https://www.hellofresh.es/recipes/lomo-cebolla-queso-Patatas-calabacin-6616b8d617fb871fe34f49f6',
    '',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF221011_R01_W47_ES_MB_Main_edit_cheeddar_high-3ebaa2b3.jpg',
    'otra'
),
(
    'Salmorejo tradicional casero',
    'con crujiente de jamón serrano y picatostes',
    'cena',
    'Sopas y Cremas',
    4,
    '711',
    '2975',
    '6.7',
    '1.9',
    '57.4',
    '13',
    '2.5',
    '22.8',
    '0',
    '20 minutos',
    '{"Paso 1": "Precalienta el horno a 200\u00baC. Corta los tomates por la mitad y, luego, en trozos grandes. Pela y corta la\u00a0Cebolla en trozos grandes. Corta el pimiento por la mitad y qu\u00edtale las semillas. Luego, c\u00f3rtalo en cuadrados de 2-3 cm. Pela el ajo (ver cantidad en ingredientes). En un bol grande, a\u00f1ade los tomates,\u00a0el pimiento, el ajo y la Cebolla.", "Paso 2": "Corta la mitad del pan de chapata en trozos de 2-3 cm y a\u00f1\u00e1delo al bol con las verduras. A\u00f1ade un chorrito generoso de aceite, el vinagre bals\u00e1mico (ver cantidad en ingredientes) y un poco de sal. Mezcla bien para que el pan se impregne del aceite y todos los jugos.", "Paso 3": "Corta el pan de chapata restante en dados de 1 cm y col\u00f3calos en una mitad de una bandeja de horno con papel de horno. Agrega un chorrito de aceite, salpimienta y remueve para que queden bien aderezados.", "Paso 4": "En la otra parte de la bandeja, agrega las Jam\u00f3n serrano. Hornea a media altura durante 7-8 min, hasta que los picatostes est\u00e9n dorados y el jam\u00f3n est\u00e9 crujiente. A mitad de cocci\u00f3n, voltea las lonchas de\u00a0jam\u00f3n con unas pinzas.", "Paso 5": "Agrega la mitad de la mezcla de verduras y pan en una jarra medidora grande junto al agua (ver cantidad en ingredientes). Tritura con un t\u00farmix hasta que quede\u00a0l\u00edquido y homog\u00e9neo. Luego, agrega el resto de la\u00a0mezcla y tritura de nuevo. Agrega un chorrito generoso de aceite y sal.", "Paso 6": "Con ayuda de un colador fino, cuela el salmorejo mientras presionas con un cuchar\u00f3n, de forma que se deseche lo m\u00ednimo posible.\u00a0Sirve el salmorejo en platos y agrega encima\u00a0picatostes al gusto y jam\u00f3n crujiente troceado. Acaba el plato con un chorrito de aceite de oliva."}'::jsonb,
    'https://www.hellofresh.es/recipes/salmorejo-tradicional-casero-64788ae4904daffe76f26a31',
    'https://www.hellofresh.es/recipecards/card/64788ae4904daffe76f26a31.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R14_W28_ES_ESQCCLFP14604-2_Main_high-8fdfde26.jpg',
    'otra'
),
(
    'Hamburguesa casera de ternera',
    'acompañada de ensalada de rúcula y tomate',
    'cena',
    'Fast Food',
    4,
    '712',
    '2978',
    '39.4',
    '15.7',
    '35.9',
    '7.3',
    '0',
    '34.8',
    '0',
    '30 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! En un bol mediano, agrega la\u00a0Carne picada y\u00a0el or\u00e9gano (ver cantidad en ingredientes). Salpimienta y mezcla bien. Forma una hamburguesa de 1-2 cm de grosor por persona.", "Paso 2": "Pon a calentar una sart\u00e9n a fuego medio-alto. Cuando est\u00e9 caliente, agrega un chorrito de aceite. A\u00f1ade las hamburguesas y cocina durante 2-3 min por lado o hasta que est\u00e9n doradas por fuera y bien hechas por dentro.", "Paso 3": "Mientras tanto, mezcla en un bol peque\u00f1o el queso crema,\u00a0la mayonesa y un chorrito de agua. Salpimienta y mezcla bien, de forma que quede una salsa cremosa y lisa.", "Paso 4": "Abre los Pan de brioche y tu\u00e9stalos en una tostadora, hasta que queden dorados y ligeramente crujientes.", "Paso 5": "Corta el tomate por la mitad, luego, corta en cubos peque\u00f1os. En una ensaladera, mezcla el tomate y la r\u00facula. Agrega el vinagre de vino tinto (ver cantidad en ingredientes), un chorrito de aceite y salpimienta. Mezcla bien para que la ensalada quede bien aderezada.", "Paso 6": "Extiende la mayonesa de queso crema en la base del pan. Agrega encima la hamburguesa y ensalada al gusto.\u00a0Luego, t\u00e1palo con la parte superior del pan. Sirve la ensalada restante a un lado como acompa\u00f1amiento."}'::jsonb,
    'https://www.hellofresh.es/recipes/hamburguesa-casera-de-ternera-con-mayonesa-64d2595eb199bd79fa716da1',
    'https://www.hellofresh.es/recipecards/card/64d2595eb199bd79fa716da1.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R06_W40_ES_ESFQB0078-8_Main_high-6ccaff23.jpg',
    'otra'
),
(
    'Judías verdes con sofrito',
    'de pimiento y cebolla',
    'comida',
    'Legumbres',
    4,
    '75',
    '314',
    '3.5',
    '0.5',
    '9',
    '4',
    '3.5',
    '2',
    '0',
    '30 minutos',
    '{"Paso 1": "Lava y corta las jud\u00edas verdes en trozos de aproximadamente 4 cm", "Paso 2": "Pela y pica finamente la cebolla y el ajo", "Paso 3": "Corta el pimiento rojo y el pimiento verde en tiras finas", "Paso 4": "En una sart\u00e9n grande, calienta el aceite de oliva y a\u00f1ade la cebolla y el ajo picados", "Paso 5": "Sofr\u00ede durante unos 5 minutos hasta que la cebolla est\u00e9 transparente", "Paso 6": "A\u00f1ade los Pimiento rojo a la sart\u00e9n y contin\u00faa cocinando durante unos 10 minutos hasta que los Pimiento rojo est\u00e9n tiernos"}'::jsonb,
    '',
    '',
    'https://content-cocina.lecturas.com/medio/2024/07/09/judias-verdes-a-la-extremena_c1acdc2c_240709092218_600x600.jpg',
    'otra'
),
(
    'Arroz frito con lomo de cerdo',
    'y verduras en salsa de soja',
    'comida',
    'Pastas y Arroces',
    4,
    '805',
    '3368',
    '30.3',
    '9.6',
    '91.7',
    '29.5',
    '0',
    '31',
    '0',
    '30 minutos',
    '{"Paso 1": "Llena un cazo con el agua\u00a0(ver cantidad en ingredientes) y a\u00f1ade una pizca de sal al gusto. T\u00e1palo y ll\u00e9valo a ebullici\u00f3n. Cuando hierva, a\u00f1ade el arroz, baja el fuego a medio-bajo y t\u00e1palo de nuevo. Deja cocinar 12 min y remueve de vez en cuando. Una vez cocinado, d\u00e9jalo reposar con la tapa durante al menos 10 min. Despu\u00e9s, remueve el arroz con la ayuda de un tenedor para separar los granos y res\u00e9rvalo en el cazo tapado.", "Paso 2": "Corta el lomo de cerdo en tiras de 1-2 cm. En un bol, pon el lomo de cerdo junto con las\u00a0especias tailandesas, salpimienta y mezcla bien. Pela y pica el ajo (ver cantidad en ingredientes). Ralla el jengibre. Pela la\u00a0cebolla y corta una mitad (doble para 4p) en tiras finitas. Corta el pimiento por la mitad y qu\u00edtale las semillas. C\u00f3rtalo en cuadrados de 1-2 cm. Corta el Ajo en rodajas muy finas, reserva la parte verde en un bol aparte.", "Paso 3": "En una sart\u00e9n, pon un chorrito de aceite y calienta a fuego medio. Luego, agrega el lomo de cerdo y deja que se dore 4-6 min. Ret\u00edralo y reserva en el bol.", "Paso 4": "En la misma sart\u00e9n, agrega el ajo y el jengibre, calienta a fuego medio. Cocina 1-2 min, hasta que se doren. Agrega la cebolla, la parte blanca del Ajo y el pimiento. Cocina 5-6 min, hasta que la cebolla est\u00e9 transparente y el pimiento tierno. Bate el Huevos (ver cantidad en ingredientes) en un bol.", "Paso 5": "Agrega a la sart\u00e9n la salsa de soja, la Salsa de soja y el cerdo\u00a0y remueve todo bien. Luego, a\u00f1ade el arroz. Sube el fuego y saltea todo durante 1 min. Agrega el Huevos batido, mezcla todo bien y cocina 1 min m\u00e1s.", "Paso 6": "Sirve el arroz frito en boles y espolvorea la parte verde del Ajo por encima."}'::jsonb,
    'https://www.hellofresh.es/recipes/arroz-frito-con-lomo-de-cerdo-638a20cb16676f814583bbda',
    'https://www.hellofresh.es/recipecards/card/arroz-frito-cerdo-verduras-638a20cb16676f814583bbda-9f4b9740.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y23_R02_W07_ES_ESC0178-2_Main_high-cf7946c6.jpg',
    'otra'
),
(
    'Solomillo de cerdo con salsa cremosa de setas',
    'acompañado de arroz y judías verdes salteadas',
    'comida',
    'Carnes',
    4,
    '808',
    '3381',
    '25.7',
    '13.3',
    '75.4',
    '9.2',
    '3.2',
    '38.2',
    '0',
    '45 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Llena un cazo con el agua (ver cantidad en ingredientes), a\u00f1ade el arroz\u00a0y sal al gusto y lleva a ebullici\u00f3n con el cazo tapado. Cuando hierva, baja a fuego medio-bajo y deja cocinar 11-13 min, removiendo ocasionalmente. Una vez cocinado, remueve el arroz con la ayuda de un tenedor para separar los granos y res\u00e9rvalo en el cazo tapado.", "Paso 2": "Pela la cebolla, div\u00eddela en dos y c\u00f3rtala en daditos peque\u00f1os. Pela y pica el ajo (ver cantidad en ingredientes).\u00a0En una sart\u00e9n, agrega un chorrito de aceite y el ajo. Calienta a fuego medio y cocina 1-2 min. A\u00f1ade la cebolla y sal y cocina 4-5 min, removiendo. Agrega el Setas y saltea a fuego medio-alto 5 min m\u00e1s, removiendo regularmente, hasta que se doren.\nSAB\u00cdAS QUE: Para que las setas no suelten agua, deben cocinarse en una sart\u00e9n muy caliente para que sus poros se sellen.", "Paso 3": "Cuando las setas est\u00e9n doradas, retira 1/3 de la sart\u00e9n y reserva hasta el emplatado. En la sart\u00e9n con las setas restantes, agrega la nata l\u00edquida y lleva a ebullici\u00f3n. Luego, cocina a fuego medio 4-5 min, removiendo frecuentemente, hasta que la salsa se reduzca y espese. Luego, vierte la salsa en la jarra medidora y tritura con un t\u00farmix hasta que\u00a0lisa y homog\u00e9nea. Prueba y rectifica de sal y pimienta.", "Paso 4": "Retira las puntas de las jud\u00edas verdes y c\u00f3rtalas en tercios. En una sart\u00e9n, calienta un chorrito de aceite a fuego alto. Luego, agrega las jud\u00edas verdes y cocina 1-2 min. Agrega un chorrito de agua, tapa la sart\u00e9n y cocina a fuego medio 4-5 min, hasta que queden tiernas.\u00a0Salpimienta al gusto y retira de la sart\u00e9n.", "Paso 5": "En la sart\u00e9n, calienta un chorrito de aceite a fuego medio. Luego, agrega el solomillo de cerdo, salpimienta y cocina 8-9 min, gir\u00e1ndolo para que quede cocinado por todas partes y deje de estar rosado en el interior. Cuando est\u00e9 listo, retira de la sart\u00e9n y reserva. Agrega la salsa de setas a la sart\u00e9n y calienta a fuego bajo durante 1 min.", "Paso 6": "Sirve el arroz y las jud\u00edas verdes salteadas a un lado de los platos, por separado, y coloca el solomillo de cerdo al otro lado. Cubre el solomillo con la salsa de setas y agrega encima las setas reservadas."}'::jsonb,
    'https://www.hellofresh.es/recipes/solomillo-cerdo-salsa-setas-arroz-6616b8ce17fb871fe34f49e2',
    'https://www.hellofresh.es/recipecards/card/6616b8ce17fb871fe34f49e2-es-ES.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y24_R16_W22_ES_ESSGP21356-2_edit_rice_-1_Main_high-046b8ee3.jpg',
    'otra'
),
(
    'Hamburguesa casera de cerdo y perejil',
    'con cebolla caramelizada y Boniato',
    'cena',
    'Fast Food',
    4,
    '956',
    '4001',
    '49.5',
    '18.1',
    '89.6',
    '13.1',
    '0.2',
    '42.7',
    '0',
    '45 minutos',
    '{"Paso 1": "Precalienta el horno a 220\u00baC. Corta las Patatas por la mitad a lo largo, luego, apoya la Patatas por la parte plana y corta en gajos de 1-2 cm de grosor. Col\u00f3calos en una bandeja de horno con papel de horno y agrega un chorrito de aceite, sal y pimienta. Mezcla para que las Patatas queden bien aderezadas. Hornea durante 20-25 min o hasta que est\u00e9n doradas. Dales la vuelta a mitad de cocci\u00f3n.", "Paso 2": "Pela la\u00a0cebolla y corta una mitad (doble para 4p) en tiras finas. En una sart\u00e9n, calienta un chorrito de aceite a fuego medio-bajo. Una vez caliente, agrega la cebolla y una pizca de sal. Coc\u00ednala, removiendo regularmente, unos 8-10 min o hasta que empiece a coger color. A\u00f1ade el az\u00facar (ver cantidad en ingredientes) y cocina durante 1-2 min o hasta que se caramelice. Reserva la cebolla en un bol y limpia la sart\u00e9n.", "Paso 3": "Deshoja y pica la mitad del\u00a0perejil (doble para 4p) en trozos grandes. En un bol, mezcla la carne de cerdo, el perejil picado, el panko,\u00a0sal y pimienta. Luego, forma 1 hamburguesa\u00a0de 1-2 cm de grosor por persona.", "Paso 4": "En la sart\u00e9n, calienta un chorrito de aceite a fuego medio. Cuando est\u00e9 caliente, cocina las hamburguesas 3-4 min por lado, hasta que queden doradas por fuera y bien hechas por dentro. En un bol peque\u00f1o, mezcla el ketchup y la mayonesa.", "Paso 5": "Cuando las hamburguesas est\u00e9n listas, abre los panes de brioche y col\u00f3calos en una bandeja de horno hacia arriba. Agrega el queso rallado sobre los panes de brioche y hornea en el estante superior\u00a0durante 4-5 min, hasta que el queso se derrita y el pan se dore.", "Paso 6": "Sobre la parte inferior de cada panecillo, agrega la hamburguesa de cerdo y cubre con la cebolla caramelizada. Tapa con la parte superior de los panes. Sirve las hamburguesas en platos y acompa\u00f1a con los gajos de Patatas al horno. Sirve la salsa de ketchup y mayonesa a un lado y agr\u00e9gala a tu gusto."}'::jsonb,
    'https://www.hellofresh.es/recipes/hamburguesa-casera-de-cerdo-y-perejil-64788add6eb29dbe8bbed5dc',
    'https://www.hellofresh.es/recipecards/card/64788add6eb29dbe8bbed5dc.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF200722_R10_W37_CA_RT0486-6_KB_Main_pork_burger_high-4cd1f9cb.jpg',
    'otra'
),
(
    'Hamburguesa de ternera con confitura de fresa',
    'con salsa casera de queso griego y ajo',
    'cena',
    'Fast Food',
    4,
    '1022',
    '4276',
    '46.4',
    '21.9',
    '88.9',
    '22.2',
    '5.4',
    '44.8',
    '0',
    '45 minutos',
    '{"Paso 1": "\u00a1Aseg\u00farate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Precalienta el horno a 220\u00baC. Pela y ralla el Ajo (ver cantidad en ingredientes). En un bol peque\u00f1o, agrega el ajo y\u00a0un chorrito generoso de aceite. Salpimienta y mezcla. Corta las Patatas por la mitad a lo largo, luego, apoya la Patatas por la parte plana y corta en gajos de 1-2 cm de grosor.", "Paso 2": "Coloca los gajos de Patatas en una bandeja de horno con papel de horno, agrega encima el aceite de ajo y mezcla para que las Patatas queden aderezadas. A\u00f1ade el ajo (ver cantidad en ingredientes) sin pelar en un lado de la bandeja de horno. Hornea durante 20-25 min o hasta que las Patatas est\u00e9n doradas. Dales la vuelta a mitad de cocci\u00f3n.", "Paso 3": "En un bol, agrega la\u00a0mayonesa, el queso griego y pimienta al gusto. Mezcla bien con varillas para que no queden grumos y la\u00a0salsa quede homog\u00e9nea. En un bol mediano, a\u00f1ade la Carne picada y salpimenta al gusto. Mezcla bien, luego, con las manos, forma una hamburguesa de 1-2 cm de grosor por persona.", "Paso 4": "Calienta una sart\u00e9n a fuego medio. Cuando est\u00e9 caliente, agrega un chorrito de\u00a0aceite. Luego, agrega las hamburguesas y cocina durante 2-3 min por lado o hasta que est\u00e9n doradas por fuera y bien hechas por dentro. Cuando est\u00e9n listas, reparte sobre cada hamburguesa la confitura de fresa. Apaga el fuego y tapa la sart\u00e9n, para mentenerlo caliente.", "Paso 5": "Abre los panes de brioche negros y coloca cada parte hacia arriba en una bandeja de horno con papel de horno. Tuesta los panes durante 3-4 min, hasta que queden dorados. Cuando las Patatas est\u00e9n listas, s\u00e1calas del horno. Pela el ajo asado y agr\u00e9galo al bol con la salsa de queso griego. Con ayuda de un tenedor, aplasta el ajo y remueve hasta conseguir una salsa homog\u00e9nea.", "Paso 6": "Deshoja los cogollos de lechuga. En la base de los panes de brioche, agrega salsa de queso griego y ajo asado. Luego, a\u00f1ade la hamburguesa con confitura de fresa y hojas de lechuga al gusto. Cubre con la otra parte del pan y sirve en platos. A\u00f1ade las Patatas asadas como acompa\u00f1amiento. Si te sobra lechuga, puedes aderezarla con aceite, sal y pimienta y servirla tambi\u00e9n como acompa\u00f1amiento."}'::jsonb,
    'https://www.hellofresh.es/recipes/hamburguesa-de-ternera-con-confitura-de-fresa-65c236c5600bb8e53d74e724',
    'https://www.hellofresh.es/recipecards/card/65c236c5600bb8e53d74e724.pdf',
    'https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1900/hellofresh_s3/image/HF_Y24_R21_W14_ES_ESSGL21052-3_Main__3_high-2d95515e.jpg',
    'otra'
),
(
    'Sopa de Verduras',
    'con Zanahoria Patatas y Apio',
    'cena',
    'Otros',
    4,
    '143',
    '600',
    '5',
    '1',
    '20',
    '6',
    '3',
    '4',
    '0',
    '1 hora',
    '{"Paso 1": "Pela y corta las Zanahoria, las Patatas y el apio en trozos", "Paso 2": "Pica finamente la cebolla, el ajo y el tomate", "Paso 3": "En una olla grande, calienta el aceite de oliva y sofr\u00ede la cebolla y el ajo", "Paso 4": "A\u00f1ade las Zanahoria, las Patatas, el apio y el tomate", "Paso 5": "Vierte el caldo de verduras y a\u00f1ade la hoja de laurel", "Paso 6": "Cocina a fuego lento durante 45 minutos o hasta que las verduras est\u00e9n tiernas"}'::jsonb,
    '',
    '',
    'https://sivarious.com/wp-content/uploads/2020/12/sopa-de-verduras.jpg',
    'otra'
),
(
    'Judías verdes con huevo cocido',
    'y bonito',
    'cena',
    'Vegetariano',
    4,
    '190',
    '800',
    '7',
    '2',
    '10',
    '5',
    '6',
    '20',
    '0',
    '25 minutos',
    '{"Paso 1": "Lava y corta las jud\u00edas verdes en trozos peque\u00f1os", "Paso 2": "Cocina las jud\u00edas en agua hirviendo con sal durante 10-15 minutos", "Paso 3": "Cuece los huevos en agua hirviendo durante 10 minutos y p\u00e9lalos", "Paso 4": "Escurre las jud\u00edas y col\u00f3calas en un bol grande", "Paso 5": "A\u00f1ade los huevos cocidos cortados en rodajas y el bonito en lata desmenuzado", "Paso 6": "Ali\u00f1a con aceite de oliva, sal y pimienta al gusto, mezcla bien y sirve"}'::jsonb,
    '',
    '',
    'https://cdn0.recetasgratis.net/es/posts/8/6/2/judias_verdes_con_jamon_y_huevo_cocido_59268_orig.jpg',
    'otra'
),
(
    'Tortilla de Espinacas',
    'con Cebolla Caramelizada',
    'cena',
    'Vegetariano',
    4,
    '191',
    '800',
    '11',
    '3',
    '14',
    '5',
    '4',
    '9',
    '0',
    '30 minutos',
    '{"Paso 1": "Pela y corta la cebolla en juliana", "Paso 2": "En una sart\u00e9n, calienta una cucharada de aceite de oliva y a\u00f1ade la cebolla con una pizca de sal y el az\u00facar", "Paso 3": "Cocina a fuego lento hasta que la cebolla est\u00e9 caramelizada", "Paso 4": "En otra sart\u00e9n, calienta el aceite de oliva restante y a\u00f1ade las espinacas", "Paso 5": "Cocina hasta que las espinacas est\u00e9n tiernas", "Paso 6": "Bate los Huevos con sal y pimienta y a\u00f1ade a la sart\u00e9n con las espinacas. Cocina a fuego lento, removiendo constantemente, hasta que los Huevos est\u00e9n cuajados"}'::jsonb,
    '',
    '',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfez4plg_wddHvt2CR9nwfna9vdDCXJbhE2g&s',
    'otra'
),
(
    'Ensalada de lechuga con tomate cebolla',
    'esparragos y mejillones',
    'cena',
    'Vegetariano',
    4,
    '215',
    '900',
    '5',
    '1',
    '15',
    '7',
    '6',
    '25',
    '0',
    '15 minutos',
    '{"Paso 1": "Lava y corta la lechuga en trozos grandes", "Paso 2": "Lava y corta los tomates en gajos", "Paso 3": "Pela y corta la cebolla en rodajas finas", "Paso 4": "Cocina los esp\u00e1rragos en agua hirviendo con sal durante 5-7 minutos, luego escurre y enfr\u00eda", "Paso 5": "Abre la lata de mejillones y esc\u00farrelos bien", "Paso 6": "Mezcla todos los ingredientes en un bol grande. Ali\u00f1a con aceite de oliva, vinagre, sal y pimienta al gusto, mezcla bien y sirve"}'::jsonb,
    '',
    '',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw-JWLMATheBSUNBOKRVgEB65hB0AJsz0LwUpkgEOjkgostLAaT__h2d3kWrcSdj_NFUI&usqp=CAU',
    'otra'
),
(
    'Ensalada de Pollo Gourmet',
    'con Lechuga Tomate y Cebolla Roja',
    'cena',
    'Ensaladas',
    4,
    '215',
    '900',
    '12',
    '2',
    '25',
    '8',
    '6',
    '4',
    '0',
    '25 minutos',
    '{"Paso 1": "Cocina la pechuga de pollo a la plancha y c\u00f3rtala en tiras", "Paso 2": "Lava y corta la lechuga y el tomate", "Paso 3": "Corta la cebolla roja en aros finos", "Paso 4": "En una ensaladera, mezcla la lechuga, el tomate, la cebolla y el pollo", "Paso 5": "En un bol peque\u00f1o, mezcla el aceite de oliva, el vinagre, la mostaza, la miel, la sal y la pimienta", "Paso 6": "A\u00f1ade el ali\u00f1o a la ensalada y mezcla bien antes de servir"}'::jsonb,
    '',
    '',
    'https://www.justspices.es/media/recipe/ensalada-pollo.jpg',
    'otra'
),
(
    'Crema de Verduras ',
    'con picatostes',
    'cena',
    'Sopas y Cremas',
    4,
    '215',
    '900',
    '12',
    '2',
    '25',
    '8',
    '6',
    '4',
    '0',
    '40 minutos',
    '{"Paso 1": "Pela y corta las Zanahoria, las Patatas, el apio, la cebolla y el calabac\u00edn en trozos", "Paso 2": "Pica finamente el ajo", "Paso 3": "En una olla grande, calienta el aceite de oliva y sofr\u00ede la cebolla y el ajo hasta que est\u00e9n dorados", "Paso 4": "A\u00f1ade las Zanahoria, las Patatas, el apio y el calabac\u00edn a la olla", "Paso 5": "Vierte el caldo de verduras y lleva a ebullici\u00f3n", "Paso 6": "Cocina a fuego lento durante 20-25 minutos o hasta que las verduras est\u00e9n tiernas"}'::jsonb,
    '',
    '',
    'https://content-cocina.lecturas.com/medio/2021/01/14/pure-vegetal-con-picatostes_09bddd15_600x600.jpg',
    'otra'
),
(
    'Calamares a la plancha',
    'con rúcula y tomate',
    'comida',
    'Pescados',
    4,
    '215',
    '900',
    '10',
    '2',
    '10',
    '5',
    '3',
    '20',
    '0',
    '30 minutos',
    '{"Paso 1": "Limpia los calamares y c\u00f3rtalos en anillas", "Paso 2": "Sazona los calamares con sal y pimienta", "Paso 3": "Cocina los calamares a la plancha con un poco de aceite de oliva hasta que est\u00e9n dorados y cocidos", "Paso 4": "Lava y corta los tomates en gajos", "Paso 5": "Lava la r\u00facula y col\u00f3cala en un bol", "Paso 6": "Mezcla los tomates con la r\u00facula. Ali\u00f1a con aceite de oliva, vinagre, sal y pimienta al gusto"}'::jsonb,
    '',
    '',
    'https://delicooks.com/wp-content/uploads/2021/02/recetas-calamares-a-la-plancha-con-tomates-y-hierbas.jpg',
    'otra'
),
(
    'Merluza al vapor con brécol ',
    'zanahoria y patata',
    'cena',
    'Pescados',
    4,
    '227',
    '950',
    '5',
    '1',
    '30',
    '5',
    '8',
    '20',
    '0',
    '30 minutos',
    '{"Paso 1": "Pela y corta las patatas en rodajas gruesas, y las zanahorias en bastones", "Paso 2": "Lava y corta el br\u00e9col en ramilletes peque\u00f1os", "Paso 3": "Coloca las patatas, zanahorias y br\u00e9col en una vaporera", "Paso 4": "Cocina al vapor durante 15-20 minutos hasta que las verduras est\u00e9n tiernas", "Paso 5": "Mientras tanto, sazona la merluza con sal y pimienta", "Paso 6": "Coloca la merluza en la vaporera durante los \u00faltimos 10 minutos de cocci\u00f3n de las verduras. Sirve la merluza con las verduras al vapor y ali\u00f1a con un chorrito de aceite de oliva"}'::jsonb,
    '',
    '',
    'https://imag.bonviveur.com/degustando-merluza-al-vapor.jpg',
    'otra'
),
(
    'Revuelto de trigueros ',
    'con gambas',
    'cena',
    'Pescados',
    4,
    '227',
    '950',
    '15',
    '3',
    '5',
    '2',
    '3',
    '20',
    '0',
    '20 minutos',
    '{"Paso 1": "Lava y corta los esp\u00e1rragos trigueros en trozos peque\u00f1os", "Paso 2": "Pela y limpia las gambas", "Paso 3": "En una sart\u00e9n grande, calienta aceite de oliva y saltea los esp\u00e1rragos durante 5-7 minutos", "Paso 4": "A\u00f1ade las gambas y cocina hasta que est\u00e9n rosadas y cocidas", "Paso 5": "Bate los huevos en un bol y salpimienta al gusto", "Paso 6": "Vierte los huevos batidos en la sart\u00e9n con los esp\u00e1rragos y gambas. Cocina a fuego medio, removiendo constantemente, hasta que los huevos est\u00e9n cuajados"}'::jsonb,
    '',
    '',
    'https://cocinandoentreolivos.com/wp-content/uploads/2021/05/Revuelto-de-esparragos-con-gambas-10.jpg',
    'otra'
),
(
    'Pollo salteado',
    'con champiñones',
    'comida',
    'Carnes',
    4,
    '287',
    '1200',
    '12',
    '3',
    '6',
    '2',
    '3',
    '40',
    '0',
    '30 minutos',
    '{"Paso 1": "Troceamos el pollo en tiras m\u00e1s o menos gruesas, o en dados, seg\u00fan tu gusto. Lo salpimentamos.", "Paso 2": "En una sart\u00e9n al fuego ponemos un fondo de aceite con la hoja de laurel. A\u00f1adimos el ajo fileteado y cuando empiece a tomar color ponemos el pollo y subimos un poco el fuego. Vamos removiendo para que el pollo se suelte y se vaya dorando por igual.", "Paso 3": "Cuando tome color ponemos los champi\u00f1ones y seguimos removiendo un par de minutos. Servimos el pollo salteado con champi\u00f1ones al momento con el perejil picado.", "Paso 4": "Si quieres que el plato tenga m\u00e1s salsa puedes rehogar un cuarto de cebolla junto con los ajos y a\u00f1adir un chorrito de vino junto con los champi\u00f1ones. En cuanto se evapore el alcohol retiras y puedes servir.", "Paso 5": "", "Paso 6": ""}'::jsonb,
    'https://www.divinacocina.es/pollo-salteado-con-champinones/',
    '',
    'https://img-global.cpcdn.com/recipes/f1c447766f8e30d3/680x482cq70/salteado-de-pollo-y-champinones-foto-principal.jpg',
    'otra'
),
(
    'Guisantes estofados',
    'con huevo',
    'comida',
    'Legumbres',
    4,
    '250',
    '1050',
    '10',
    '2',
    '20',
    '5',
    '7',
    '14',
    '0',
    '31 minutos',
    '{"Paso 1": "Rehogamos la cebolla y ajos picados en aceite sin que se quemen. A\u00f1adimos el jam\u00f3n, laurel y la harina, damos unas vueltas y ponemos el vino.", "Paso 2": "Dejamos evaporar el alcohol, removiendo, e incorporamos los guisantes y agua que los cubra, y la sal o pastilla de caldo.", "Paso 3": "Dejamos hacer hasta que est\u00e9n tiernos, a\u00f1adiendo a media cocci\u00f3n el perejil picado. Si usas guisantes congelados, el guiso debe estar listo en unos 15 minutos. Para guisantes frescos, depende del producto, pero puede tardar hasta una media hora.", "Paso 4": "Para servir los guisantes estofados podemos cuajarles un huevo (como en la foto), o servirlos como una perfecta guarnici\u00f3n de salchichas, huevos fritos y carnes a la plancha.", "Paso 5": "", "Paso 6": ""}'::jsonb,
    'https://www.divinacocina.es/guisantes-estofados/',
    '',
    'https://aprendiendoacocinar.es/_imgup/209/guisantes_en_amarillo_para_rota_al_dia.jpg',
    'otra'
),
(
    'Champiñones rellenos',
    'de gambas y jamón',
    'comida',
    'Legumbres',
    4,
    '220',
    '920',
    '8',
    '2',
    '5',
    '2',
    '2',
    '25',
    '0',
    '32 minutos',
    '{"Paso 1": "", "Paso 2": "", "Paso 3": "", "Paso 4": "", "Paso 5": "", "Paso 6": ""}'::jsonb,
    'https://www.divinacocina.es/champinones-rellenos/',
    '',
    'https://cdn.blogsthermomix.es/media/Posts/attachments/9ae021aebfc605c4d76102c51f64c2c6.jpg',
    'otra'
),
(
    'Colacao con tostadas',
    'de aceite y miel',
    'desayuno',
    'Desayuno',
    4,
    '358',
    '1500',
    '11',
    '2',
    '55',
    '20',
    '4',
    '6',
    '0',
    '10 minutos',
    '{"Paso 1": "Hacemos el colacao", "Paso 2": "Tostamos la rebanada de hogaza", "Paso 3": "A\u00f1adimos el aceite y la miel", "Paso 4": "Si quieres que el plato tenga m\u00e1s salsa puedes rehogar un cuarto de cebolla junto con los ajos y a\u00f1adir un chorrito de vino junto con los champi\u00f1ones. En cuanto se evapore el alcohol retiras y puedes servir.", "Paso 5": "", "Paso 6": ""}'::jsonb,
    '',
    '',
    'https://s3.ppllstatics.com/ideal/www/multimedia/201809/19/media/cortadas/aceite-k4AH-U60958277367BjC-624x385@Ideal.jpg',
    'otra'
),
(
    'Café con tostadas',
    'de mantequilla y mermelada',
    'desayuno',
    'Desayuno',
    4,
    '334',
    '1400',
    '15',
    '5',
    '45',
    '22',
    '3',
    '4',
    '0',
    '10 minutos',
    '{"Paso 1": "Hacemos el caf\u00e9 con leche", "Paso 2": "Tostamos la rebanada de hogaza", "Paso 3": "A\u00f1adimos la mantequilla y la mermelada", "Paso 4": "", "Paso 5": "", "Paso 6": ""}'::jsonb,
    '',
    '',
    'https://img.freepik.com/fotos-premium/comida-desayuno-continental-servida-tostadas-cafe-mermelada-mantequilla-deliciosa-mesa-cafe_220770-1901.jpg',
    'otra'
),
(
    'Fruta con frutos secos',
    'zumo, café y fiambre',
    'desayuno',
    'Desayuno',
    4,
    '430',
    '1800',
    '18',
    '4',
    '40',
    '25',
    '6',
    '20',
    '0',
    '15 minutos',
    '{"Paso 1": "Hacemos el caf\u00e9 con leche", "Paso 2": "Tostamos la rebanada de hogaza", "Paso 3": "Hacemos el zumo", "Paso 4": "Ponemos la mesa con el caf\u00e9, los frutos secos, el zumo y la rebanada de hogaza con el jam\u00f3n encima", "Paso 5": "", "Paso 6": ""}'::jsonb,
    '',
    '',
    'https://pereznoesraton.com/wp-content/uploads/2023/01/Depositphotos_179449018_L-1.jpeg',
    'otra'
),
(
    'Frutos secos',
    'y zumo',
    'snack',
    'Snack',
    4,
    '406',
    '1700',
    '16',
    '2',
    '50',
    '30',
    '5',
    '8',
    '0',
    '10 minutos',
    '{"Paso 1": "", "Paso 2": "", "Paso 3": "", "Paso 4": "", "Paso 5": "", "Paso 6": ""}'::jsonb,
    '',
    '',
    'https://img.freepik.com/fotos-premium/avena-pasas-miel-zumo-naranja-manzanas-verdes-frutos-secos_76255-237.jpg',
    'otra'
),
(
    'Sartén de huevos',
    'con gulas y langostinos',
    'comida',
    'Huevos',
    4,
    '335',
    '1400',
    '18',
    '4',
    '3',
    '1',
    '2',
    '35',
    '0',
    '30 minutos',
    '{"Paso 1": "Preparamos un majado con el ajo pelado y el perejil.", "Paso 2": "En una sart\u00e9n ponemos un poco de aceite y cuando est\u00e9 caliente cascamos sobre la sart\u00e9n los huevos. Salpimentamos y dejamos que cuajen a nuestro gusto. Antes de retirar espolvoreamos con un poco de piment\u00f3n dulce. Reservamos.", "Paso 3": "A\u00f1adimos un poco m\u00e1s de aceite si es necesario y ponemos el majado. Al momento, pasados unos 30 segundos, a\u00f1adimos las gulas y los langostinos o gambones. Van a saltear m\u00e1s o menos un minuto, hasta que las colas de gamb\u00f3n o langostinos est\u00e9n al punto.", "Paso 4": "Para montar el plato, servimos las gulas por encima de los huevos en un plato o bandeja de servicio. Si quieres servir en la sart\u00e9n, acomoda los huevos entre las gulas y langostinos y sirve al momento. Si lo prefieres puedes romper los huevos troceando con cuchillo y tenedor sobre el salteado de gulas y langostinos.", "Paso 5": "Tambi\u00e9n puedes preparar primero el salteado y retirar. En la misma sart\u00e9n haces luego los huevos y cuando est\u00e9n a punto pones las gulas y langostinos por encima con un poco de piment\u00f3n y sirves al momento.", "Paso 6": ""}'::jsonb,
    'https://www.divinacocina.es/sarten-huevos-gulas-langostinos/',
    '',
    'https://www.divinacocina.es/wp-content/uploads/2017/11/huevos-gulas-gambones-H.jpg',
    'otra'
);

-- Relacionar ingredientes con recetas
WITH recipe_Dorada_a_la_plancha_con_ensalada_de_tomate AS (
            SELECT id FROM recipes WHERE name = 'Dorada a la plancha con ensalada de tomate'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Dorada_a_la_plancha_con_ensalada_de_tomate),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Dorada', 400, 'gramo'),
    ('Tomate', 2, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Espárragos', 150, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Judías_salteadas_con_champiñones_pimineto AS (
            SELECT id FROM recipes WHERE name = 'Judías salteadas con champiñones pimineto'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Judías_salteadas_con_champiñones_pimineto),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Judías verdes', 300, 'gramo'),
    ('Champiñones', 200, 'gramo'),
    ('Pimiento', 1, 'unidad'),
    ('Langostinos cocidos', 200, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Ensalada_de_pimientos_asados_y_tomate AS (
            SELECT id FROM recipes WHERE name = 'Ensalada de pimientos asados y tomate'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Ensalada_de_pimientos_asados_y_tomate),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pimientos asados', 200, 'gramo'),
    ('Tomate', 2, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Huevo cocido', 2, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Tofu_con_pimiento_calabacín AS (
            SELECT id FROM recipes WHERE name = 'Tofu con pimiento calabacín'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Tofu_con_pimiento_calabacín),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Tofu', 300, 'gramo'),
    ('Pimiento', 1, 'unidad'),
    ('Calabacín', 2, 'unidad'),
    ('Maíz', 200, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pisto_de_verduras AS (
            SELECT id FROM recipes WHERE name = 'Pisto de verduras'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pisto_de_verduras),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pisto de verduras', 400, 'gramo'),
    ('Huevo', 2, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Garbanzos AS (
            SELECT id FROM recipes WHERE name = 'Garbanzos'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Garbanzos),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Garbanzos', 400, 'gramo'),
    ('Espinacas', 200, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pechugas_de_pollo_al_horno_con_calabaza AS (
            SELECT id FROM recipes WHERE name = 'Pechugas de pollo al horno con calabaza'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pechugas_de_pollo_al_horno_con_calabaza),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pechuga de pollo', 400, 'gramo'),
    ('Zanahoria', 4, 'unidad'),
    ('Calabaza', 1, 'unidad'),
    ('Queso Feta', 2, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Albóndigas_de_Carne_Caseras AS (
            SELECT id FROM recipes WHERE name = 'Albóndigas de Carne Caseras'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Albóndigas_de_Carne_Caseras),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Carne picada', 500, 'gramo'),
    ('Pan rallado', 50, 'gramo'),
    ('Huevos', 1, 'unidad'),
    ('Ajo', 1, 'unidad'),
    ('Perejil', 0.5, 'unidad'),
    ('Tomate frito', 200, 'gramo'),
    ('Cebolla', 1, 'unidad'),
    ('Azúcar', 1, 'cucharadita'),
    ('Orégano', 1, 'cucharadita'),
    ('Albahaca fresca', 1, 'cucharada'),
    ('Caldo de pollo', 100, 'mililitro')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Ensalada_Creativa AS (
            SELECT id FROM recipes WHERE name = 'Ensalada Creativa'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Ensalada_Creativa),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Fresas', 100, 'gramo'),
    ('Lechuga', 100, 'gramo'),
    ('Tomate cherry', 100, 'gramo'),
    ('Queso feta', 50, 'gramo'),
    ('Almendras laminadas', 30, 'gramo'),
    ('Arándanos secos', 30, 'gramo'),
    ('Limón', 1, 'unidad'),
    ('Menta fresca', 1, 'cucharada')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Salmón_en_Papillote AS (
            SELECT id FROM recipes WHERE name = 'Salmón en Papillote'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Salmón_en_Papillote),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Calabacín', 1, 'unidad'),
    ('Pimiento rojo', 0.5, 'unidad'),
    ('Zanahoria', 1, 'unidad'),
    ('Limón', 1, 'unidad'),
    ('Ajo', 1, 'unidad'),
    ('Eneldo', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Sándwiches_Gourmet_de_Jamón_y_Queso AS (
            SELECT id FROM recipes WHERE name = 'Sándwiches Gourmet de Jamón y Queso'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Sándwiches_Gourmet_de_Jamón_y_Queso),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pan de molde', 4, 'rebanada'),
    ('Jamón York', 100, 'gramo'),
    ('Queso', 50, 'gramo'),
    ('Huevos', 2, 'unidad'),
    ('Mantequilla', 1, 'cucharada')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Revuelto_de_Huevos_con_Gulas AS (
            SELECT id FROM recipes WHERE name = 'Revuelto de Huevos con Gulas'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Revuelto_de_Huevos_con_Gulas),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Huevos', 4, 'unidad'),
    ('Gulas', 100, 'gramo'),
    ('Champiñones', 100, 'gramo'),
    ('Gambas', 100, 'gramo'),
    ('Ajo', 1, 'unidad'),
    ('Perejil', 0.5, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Soja_texturizada AS (
            SELECT id FROM recipes WHERE name = 'Soja texturizada'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Soja_texturizada),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Soja texturizada', 200, 'gramo'),
    ('Pisto de verduras', 400, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pavo_a_la_plancha_con_ AS (
            SELECT id FROM recipes WHERE name = 'Pavo a la plancha con '
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pavo_a_la_plancha_con_),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pavo', 300, 'gramo'),
    ('Boniato', 200, 'gramo'),
    ('Pimiento', 1, 'unidad'),
    ('Canónigos', 100, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Chuleta_de_cerdo AS (
            SELECT id FROM recipes WHERE name = 'Chuleta de cerdo'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Chuleta_de_cerdo),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Chuleta de cerdo', 400, 'gramo'),
    ('Calabacín', 2, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Ensalada_Templada_con_Lechuga AS (
            SELECT id FROM recipes WHERE name = 'Ensalada Templada con Lechuga'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Ensalada_Templada_con_Lechuga),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Lechuga', 100, 'gramo'),
    ('Tomate', 1, 'unidad'),
    ('Queso de cabra', 50, 'gramo'),
    ('Nueces', 30, 'gramo'),
    ('Pasas', 30, 'gramo'),
    ('Vinagre balsámico', 1, 'cucharada'),
    ('Champiñones', 200, 'gramo'),
    ('Miel', 1, 'cucharada')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Guisantes_Salteados AS (
            SELECT id FROM recipes WHERE name = 'Guisantes Salteados'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Guisantes_Salteados),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Guisantes', 200, 'gramo'),
    ('Jamón serrano', 50, 'gramo'),
    ('Cebolla', 1, 'unidad'),
    ('Azúcar', 1, 'cucharadita'),
    ('Ajo', 1, 'unidad'),
    ('Vino blanco', 50, 'mililitro')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Salmón_a_la_Plancha AS (
            SELECT id FROM recipes WHERE name = 'Salmón a la Plancha'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Salmón_a_la_Plancha),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Brócoli', 200, 'gramo'),
    ('Limón', 1, 'unidad'),
    ('Salmón', 500, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Revuelto_de_Brócoli AS (
            SELECT id FROM recipes WHERE name = 'Revuelto de Brócoli'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Revuelto_de_Brócoli),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Brócoli', 200, 'gramo'),
    ('Pimiento rojo', 1, 'unidad'),
    ('Calabacín', 1, 'unidad'),
    ('Huevos', 4, 'unidad'),
    ('Ajo', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Ensaladilla_rusa_con_huevo_cocido AS (
            SELECT id FROM recipes WHERE name = 'Ensaladilla rusa con huevo cocido'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Ensaladilla_rusa_con_huevo_cocido),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Ensaladilla rusa', 400, 'gramo'),
    ('Huevo cocido', 2, 'unidad'),
    ('Mayonesa', 2, 'cucharadita'),
    ('AOVE (Aceite de oliva virgen extra)', 2, 'cucharada'),
    ('Vinagre', 1, 'cucharada')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Arroz_integral_con_pavo AS (
            SELECT id FROM recipes WHERE name = 'Arroz integral con pavo'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Arroz_integral_con_pavo),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Arroz integral', 200, 'gramo'),
    ('Pavo', 300, 'gramo'),
    ('Verduras variadas', 400, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Poke_de_Pollo AS (
            SELECT id FROM recipes WHERE name = 'Poke de Pollo'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Poke_de_Pollo),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pollo', 300, 'gramo'),
    ('Arroz integral', 200, 'gramo'),
    ('Verduras variadas', 400, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Fajitas_de_Pollo AS (
            SELECT id FROM recipes WHERE name = 'Fajitas de Pollo'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Fajitas_de_Pollo),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pechuga de pollo', 200, 'gramo'),
    ('Pimiento rojo', 1, 'unidad'),
    ('Pimiento verde', 1, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Tortillas de trigo', 4, 'unidad'),
    ('Comino en polvo', 1, 'cucharadita'),
    ('Guacamole', 100, 'gramo'),
    ('Queso rallado', 50, 'gramo'),
    ('Lechuga', 100, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pasta_con_salsa_boloñesa AS (
            SELECT id FROM recipes WHERE name = 'Pasta con salsa boloñesa'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pasta_con_salsa_boloñesa),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Macarrones', 200, 'gramo'),
    ('Carne picada', 200, 'gramo'),
    ('Tomate frito', 200, 'gramo'),
    ('Cebolla', 1, 'unidad'),
    ('Ajo', 1, 'unidad'),
    ('Zanahoria', 1, 'unidad'),
    ('Apio', 1, 'unidad'),
    ('Orégano', 1, 'cucharadita'),
    ('Queso parmesano', 50, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Macarrones_con_chorizo AS (
            SELECT id FROM recipes WHERE name = 'Macarrones con chorizo'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Macarrones_con_chorizo),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Macarrones', 200, 'gramo'),
    ('Chorizo', 100, 'gramo'),
    ('Tomate frito', 200, 'gramo'),
    ('Cebolla', 1, 'unidad'),
    ('Ajo', 1, 'unidad'),
    ('Orégano', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Crema_de_espinacas_con_bacon AS (
            SELECT id FROM recipes WHERE name = 'Crema de espinacas con bacon'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Crema_de_espinacas_con_bacon),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Brotes de espinacas', 1, 'unidad'),
    ('Patatas', 200, 'gramo'),
    ('Caldo de verduras', 1, 'sobre'),
    ('Queso crema', 1, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Cogollos de lechuga', 220, 'gramo'),
    ('Bacon', 100, 'gramo'),
    ('Vinagre de vino tinto', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Parrillada_Verduras AS (
            SELECT id FROM recipes WHERE name = 'Parrillada Verduras'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Parrillada_Verduras),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pimiento rojo', 2, 'unidad'),
    ('Calabacín', 1, 'unidad'),
    ('Berenjena', 1, 'unidad'),
    ('Champiñones', 200, 'gramo'),
    ('Cebolla', 1, 'unidad'),
    ('Raxo', 200, 'gramo'),
    ('Ajo', 1, 'unidad'),
    ('Pimentón', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Rollitos_de_Lomo_de_Cerdo AS (
            SELECT id FROM recipes WHERE name = 'Rollitos de Lomo de Cerdo'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Rollitos_de_Lomo_de_Cerdo),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Lomo de cerdo', 4, 'unidad'),
    ('Queso', 100, 'gramo'),
    ('Jamón serrano', 100, 'gramo'),
    ('Ajo', 1, 'unidad'),
    ('Vino blanco', 50, 'mililitro'),
    ('Caldo de pollo', 100, 'mililitro'),
    ('Romero', 0.5, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Hamburguesas_con_Pan_Artesano AS (
            SELECT id FROM recipes WHERE name = 'Hamburguesas con Pan Artesano'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Hamburguesas_con_Pan_Artesano),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Carne picada', 200, 'gramo'),
    ('Pan de hamburguesa', 2, 'unidad'),
    ('Lechuga', 1, 'unidad'),
    ('Tomate', 1, 'unidad'),
    ('Queso cheddar', 100, 'gramo'),
    ('Cebolla roja', 0.5, 'unidad'),
    ('Mostaza', 1, 'cucharadita'),
    ('Kétchup', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Arroz AS (
            SELECT id FROM recipes WHERE name = 'Arroz'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Arroz),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Arroz', 200, 'gramo'),
    ('Pimiento rojo', 0.5, 'unidad'),
    ('Pimiento verde', 0.5, 'unidad'),
    ('Zanahoria', 1, 'unidad'),
    ('Calabacín', 1, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Salsa de soja', 2, 'cucharada'),
    ('Ajo', 1, 'unidad'),
    ('guisantes', 50, 'gramo'),
    ('Brotes de soja', 50, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Crema_suave_de_calabacín_eneldo_y_queso_crema AS (
            SELECT id FROM recipes WHERE name = 'Crema suave de calabacín eneldo y queso crema'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Crema_suave_de_calabacín_eneldo_y_queso_crema),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pan de chapata', 2, 'unidad'),
    ('Eneldo', 1, 'unidad'),
    ('Pesto de albahaca', 50, 'gramo'),
    ('Caldo de verduras', 1, 'sobre'),
    ('Calabacín', 1, 'unidad'),
    ('Queso crema', 2, 'unidad'),
    ('Puerro', 1, 'unidad'),
    ('Ajo', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Salmón_al_horno_con_vinagreta_de_miel AS (
            SELECT id FROM recipes WHERE name = 'Salmón al horno con vinagreta de miel'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Salmón_al_horno_con_vinagreta_de_miel),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Tomate cherry', 125, 'gramo'),
    ('Calabacín', 1, 'unidad'),
    ('Cebolla roja', 1, 'unidad'),
    ('Tomillo', 0.5, 'unidad'),
    ('Salmón', 200, 'gramo'),
    ('Miel', 2, 'cucharada'),
    ('Vinagre balsámico', 1, 'sobre'),
    ('Boniato', 200, 'gramo'),
    ('Ajo', 2, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Zorza_de_Raxo AS (
            SELECT id FROM recipes WHERE name = 'Zorza de Raxo'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Zorza_de_Raxo),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Raxo', 200, 'gramo'),
    ('Patatas', 300, 'gramo'),
    ('Pimiento verde', 2, 'unidad'),
    ('Ajo', 1, 'unidad'),
    ('Pimentón', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Paella_de_Pollo AS (
            SELECT id FROM recipes WHERE name = 'Paella de Pollo'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Paella_de_Pollo),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Arroz', 200, 'gramo'),
    ('Pechuga de pollo', 200, 'gramo'),
    ('Pimiento rojo', 1, 'unidad'),
    ('Tomate frito', 200, 'gramo'),
    ('guisantes', 100, 'gramo'),
    ('Ajo', 2, 'unidad'),
    ('Caldo de pollo', 500, 'mililitro'),
    ('Azafrán', 1, 'pizca'),
    ('Pimentón', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pasta_a_la_carbonara_tradicional AS (
            SELECT id FROM recipes WHERE name = 'Pasta a la carbonara tradicional'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pasta_a_la_carbonara_tradicional),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Espaguetis', 200, 'gramo'),
    ('Bacon', 100, 'gramo'),
    ('Huevos', 2, 'unidad'),
    ('Queso parmesano', 50, 'gramo'),
    ('Ajo', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Wrap_de_cogollos_con_pollo_marinado AS (
            SELECT id FROM recipes WHERE name = 'Wrap de cogollos con pollo marinado'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Wrap_de_cogollos_con_pollo_marinado),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Salsa de soja', 1, 'sobre'),
    ('Jengibre', 1, 'unidad'),
    ('Cogollos de lechuga', 220, 'gramo'),
    ('Zanahoria', 1, 'unidad'),
    ('Miel', 2, 'cucharada'),
    ('Mayonesa', 2, 'sobre'),
    ('Mostaza', 1, 'sobre'),
    ('Cebolla roja', 0.5, 'unidad'),
    ('Pechuga de pollo', 250, 'gramo'),
    ('Cacahuetes salados', 20, 'gramo'),
    ('Ajo', 1, 'unidad'),
    ('Vinagre de vino tinto', 2, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Nachos_Gourmet AS (
            SELECT id FROM recipes WHERE name = 'Nachos Gourmet'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Nachos_Gourmet),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Nachos', 200, 'gramo'),
    ('Queso rallado', 100, 'gramo'),
    ('Tomate frito', 100, 'gramo'),
    ('Guacamole', 100, 'gramo'),
    ('Jalapeños', 50, 'gramo'),
    ('Cebolla roja', 0.5, 'unidad'),
    ('Aceitunas negras', 50, 'gramo'),
    ('Cilantro fresco', 1, 'cucharada'),
    ('Crema agria', 50, 'gramo'),
    ('Limón', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Lasaña_de_carne_picada_ AS (
            SELECT id FROM recipes WHERE name = 'Lasaña de carne picada '
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Lasaña_de_carne_picada_),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Placas de lasaña', 6, 'unidad'),
    ('Carne picada', 200, 'gramo'),
    ('Espinacas frescas', 100, 'gramo'),
    ('Queso de cabra', 100, 'gramo'),
    ('Tomate frito', 200, 'gramo'),
    ('Cebolla', 1, 'unidad'),
    ('Ajo', 1, 'unidad'),
    ('Orégano', 1, 'cucharadita'),
    ('Bechamel', 200, 'mililitro'),
    ('Queso rallado', 50, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Marmitako_de_Bonito AS (
            SELECT id FROM recipes WHERE name = 'Marmitako de Bonito'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Marmitako_de_Bonito),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Bonito', 200, 'gramo'),
    ('Patatas', 300, 'gramo'),
    ('Pimiento rojo', 1, 'unidad'),
    ('Pimiento verde', 1, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Ajo', 2, 'unidad'),
    ('Tomate frito', 200, 'gramo'),
    ('Caldo de pescado', 500, 'mililitro'),
    ('Pimentón', 1, 'cucharadita'),
    ('Laurel', 1, 'hoja')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Quiche_de_Calabacín_al_horno AS (
            SELECT id FROM recipes WHERE name = 'Quiche de Calabacín al horno'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Quiche_de_Calabacín_al_horno),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Masa quebrada', 1, 'unidad'),
    ('Calabacín', 1, 'unidad'),
    ('Huevos', 3, 'unidad'),
    ('Nata líquida', 200, 'mililitro'),
    ('Queso rallado', 100, 'gramo'),
    ('Cebolla', 1, 'unidad'),
    ('Nuez moscada', 1, 'pizca')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pollo_al_limón_con_tomillo AS (
            SELECT id FROM recipes WHERE name = 'Pollo al limón con tomillo'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pollo_al_limón_con_tomillo),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Muslos de pollo', 280, 'gramo'),
    ('Limón', 1, 'unidad'),
    ('Mostaza', 1, 'sobre'),
    ('Miel', 2, 'cucharada'),
    ('Arroz', 150, 'gramo'),
    ('Brócoli', 250, 'gramo'),
    ('Tomillo', 0.5, 'unidad'),
    ('Cebolla roja', 0.5, 'unidad'),
    ('Harina', 10, 'gramo'),
    ('Ajo', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Estofado_casero_de_lentejas AS (
            SELECT id FROM recipes WHERE name = 'Estofado casero de lentejas'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Estofado_casero_de_lentejas),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Lentejas', 340, 'gramo'),
    ('Cebolla roja', 0.5, 'unidad'),
    ('Puerro', 1, 'unidad'),
    ('Caldo de verduras', 1, 'sobre'),
    ('Pimentón', 1, 'sobre'),
    ('Patatas', 320, 'gramo'),
    ('Chorizo', 100, 'gramo'),
    ('Tomate frito', 30.09, 'gramo'),
    ('Ajo', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Muslos_de_pollo_asados_a_la_barbacoa AS (
            SELECT id FROM recipes WHERE name = 'Muslos de pollo asados a la barbacoa'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Muslos_de_pollo_asados_a_la_barbacoa),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Muslos de pollo', 280, 'gramo'),
    ('Patatas', 400, 'gramo'),
    ('Pimiento rojo', 1, 'unidad'),
    ('Calabacín', 1, 'unidad'),
    ('Sazonador barbacoa', 1, 'sobre'),
    ('Salsa barbacoa', 1, 'sobre'),
    ('Queso crema', 2, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pollo_al_ajillo AS (
            SELECT id FROM recipes WHERE name = 'Pollo al ajillo'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pollo_al_ajillo),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Muslos de pollo', 250, 'gramo'),
    ('Caldo de pollo', 1, 'sobre'),
    ('Arroz', 150, 'gramo'),
    ('Vinagre balsámico', 1, 'sobre'),
    ('Perejil', 0.5, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Tomillo', 0.5, 'unidad'),
    ('Ajo', 3, 'unidad'),
    ('Harina', 20, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Salmón_al_horno_con_salsa_de_champiñones AS (
            SELECT id FROM recipes WHERE name = 'Salmón al horno con salsa de champiñones'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Salmón_al_horno_con_salsa_de_champiñones),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Salmón', 200, 'gramo'),
    ('Patatas', 400, 'gramo'),
    ('Champiñones', 250, 'gramo'),
    ('Eneldo', 0.5, 'unidad'),
    ('Queso crema', 2, 'unidad'),
    ('Ajo', 3, 'unidad'),
    ('Mantequilla', 1, 'cucharada')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Poke_de_langostinos_con_mayonesa_de_soja AS (
            SELECT id FROM recipes WHERE name = 'Poke de langostinos con mayonesa de soja'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Poke_de_langostinos_con_mayonesa_de_soja),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Langostinos', 150, 'gramo'),
    ('Arroz', 150, 'gramo'),
    ('Mayonesa', 3, 'sobre'),
    ('Salsa de soja', 1, 'sobre'),
    ('Pepino', 1, 'unidad'),
    ('Maíz dulce', 140, 'gramo'),
    ('Chili en escamas', 1, 'sobre'),
    ('Azúcar', 1, 'cucharadita'),
    ('Vinagramore de vino tinto', 4, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Salmón_al_horno_con_manzana_asada AS (
            SELECT id FROM recipes WHERE name = 'Salmón al horno con manzana asada'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Salmón_al_horno_con_manzana_asada),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Salmón', 200, 'gramo'),
    ('Mayonesa', 5, 'sobre'),
    ('Cilantro', 1, 'unidad'),
    ('Lima', 0.5, 'unidad'),
    ('Manzana', 2, 'unidad'),
    ('Zanahoria', 2, 'unidad'),
    ('Azúcar', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pollo_asado_con_Patatas_y_queso_griego AS (
            SELECT id FROM recipes WHERE name = 'Pollo asado con Patatas y queso griego'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pollo_asado_con_Patatas_y_queso_griego),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Queso griego', 100, 'gramo'),
    ('Muslos de pollo', 280, 'gramo'),
    ('Pimiento rojo', 1, 'unidad'),
    ('Cebolla roja', 1, 'unidad'),
    ('Patatas', 400, 'gramo'),
    ('Tomillo', 0.5, 'unidad'),
    ('Pimentón', 1, 'sobre'),
    ('Ajo', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pechuga_de_pollo_con_almendras_laminadas AS (
            SELECT id FROM recipes WHERE name = 'Pechuga de pollo con almendras laminadas'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pechuga_de_pollo_con_almendras_laminadas),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pechuga de pollo', 200, 'gramo'),
    ('Almendras laminadas', 15, 'gramo'),
    ('Perejil', 0.5, 'unidad'),
    ('Cebolla', 0.5, 'unidad'),
    ('Zanahoria', 1, 'unidad'),
    ('Tomate', 2, 'unidad'),
    ('Tomate frito', 1, 'sobre'),
    ('Patatas', 400, 'gramo'),
    ('Miel', 2, 'cucharada'),
    ('Caldo de verduras', 1, 'sobre')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Ropa_Vieja_de_Ternera AS (
            SELECT id FROM recipes WHERE name = 'Ropa Vieja de Ternera'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Ropa_Vieja_de_Ternera),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Carne de ternera', 200, 'gramo'),
    ('Patatas', 300, 'gramo'),
    ('Zanahoria', 3, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Ajo', 2, 'unidad'),
    ('Tomate frito', 200, 'gramo'),
    ('Laurel', 1, 'hoja'),
    ('Caldo de ternera', 200, 'mililitro'),
    ('Azúcar', 1, 'cucharadita'),
    ('Mantequilla', 1, 'cucharada')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Filetes_de_ternera_a_la_plancha AS (
            SELECT id FROM recipes WHERE name = 'Filetes de ternera a la plancha'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Filetes_de_ternera_a_la_plancha),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Filetes de Ternera', 2, 'unidad'),
    ('Patatas', 300, 'gramo'),
    ('Cebolla', 1, 'unidad'),
    ('Huevos', 3, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pizzas_Artesanales_con_Tomate AS (
            SELECT id FROM recipes WHERE name = 'Pizzas Artesanales con Tomate'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pizzas_Artesanales_con_Tomate),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Masa de pizza', 2, 'unidad'),
    ('Tomate frito', 200, 'gramo'),
    ('Queso mozzarella', 200, 'gramo'),
    ('Orégano', 1, 'cucharadita'),
    ('Ingredientes al gusto', 200, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Fabada_Asturiana_Tradicional AS (
            SELECT id FROM recipes WHERE name = 'Fabada Asturiana Tradicional'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Fabada_Asturiana_Tradicional),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Judías', 200, 'gramo'),
    ('Chorizo', 1, 'unidad'),
    ('Morcilla', 1, 'unidad'),
    ('Panceta', 100, 'gramo'),
    ('Cebolla', 1, 'unidad'),
    ('Ajo', 2, 'unidad'),
    ('Pimentón', 1, 'cucharadita'),
    ('Laurel', 1, 'hoja'),
    ('Caldo de carne', 500, 'mililitro')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Gnocchis_con_vinagreta_de_bacon AS (
            SELECT id FROM recipes WHERE name = 'Gnocchis con vinagreta de bacon'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Gnocchis_con_vinagreta_de_bacon),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Gnocchi', 380, 'gramo'),
    ('Tomate cherry', 125, 'gramo'),
    ('Vinagre balsámico', 0.5, 'sobre'),
    ('Bacon', 100, 'gramo'),
    ('Queso crema', 2, 'unidad'),
    ('Tomillo', 0.5, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Vichyssoise_con_manzana_caramelizada AS (
            SELECT id FROM recipes WHERE name = 'Vichyssoise con manzana caramelizada'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Vichyssoise_con_manzana_caramelizada),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Puerro', 2, 'unidad'),
    ('Manzana', 1, 'unidad'),
    ('Caldo de verduras', 1, 'sobre'),
    ('Nata líquida', 200, 'mililitro'),
    ('Cebolla', 1, 'unidad'),
    ('Pesto de albahaca', 50, 'gramo'),
    ('Nuez moscada', 1, 'sobre'),
    ('Cebollino', 0.5, 'unidad'),
    ('Champiñones', 250, 'gramo'),
    ('Ajo', 1, 'unidad'),
    ('Azúcar', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Lasaña_de_calabacín_y_carne_de_ternera AS (
            SELECT id FROM recipes WHERE name = 'Lasaña de calabacín y carne de ternera'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Lasaña_de_calabacín_y_carne_de_ternera),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Calabacín', 1, 'unidad'),
    ('Carne picada', 250, 'gramo'),
    ('Cebolla', 0.5, 'unidad'),
    ('Zanahoria', 1, 'unidad'),
    ('Queso rallado', 60, 'gramo'),
    ('Tomate frito', 200, 'gramo'),
    ('Ajo', 1, 'unidad'),
    ('Orégano', 1, 'cucharadita'),
    ('Orégano para el aderezo', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pollo_asado_al_horno_ AS (
            SELECT id FROM recipes WHERE name = 'Pollo asado al horno '
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pollo_asado_al_horno_),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pollo entero', 1500, 'gramo'),
    ('Patatas', 800, 'gramo'),
    ('Pimiento rojo', 2, 'unidad'),
    ('Pimiento verde', 2, 'unidad'),
    ('Romero', 0.5, 'unidad'),
    ('Tomillo', 0.5, 'unidad'),
    ('Limón', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Crema_casera_de_zanahoria_y_langostinos AS (
            SELECT id FROM recipes WHERE name = 'Crema casera de zanahoria y langostinos'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Crema_casera_de_zanahoria_y_langostinos),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Zanahoria', 2, 'unidad'),
    ('Caldo de verduras', 1, 'sobre'),
    ('Langostinos', 150, 'gramo'),
    ('Cebollino', 0.5, 'unidad'),
    ('Pan de chapata', 2, 'unidad'),
    ('Queso crema', 2, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Leche', 200, 'mililitro'),
    ('Ajo', 2, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Risotto_de_espinacas_con_crujiente_de_queso AS (
            SELECT id FROM recipes WHERE name = 'Risotto de espinacas con crujiente de queso'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Risotto_de_espinacas_con_crujiente_de_queso),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Brotes de espinacas', 1, 'unidad'),
    ('Arroz', 225, 'gramo'),
    ('Cebolla', 2, 'unidad'),
    ('Caldo de verduras', 2, 'sobre'),
    ('Pecorino', 40, 'gramo'),
    ('Nueces', 20, 'gramo'),
    ('Mantequilla', 2, 'cucharada')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Croquetas_Artesanales_de_Jamón AS (
            SELECT id FROM recipes WHERE name = 'Croquetas Artesanales de Jamón'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Croquetas_Artesanales_de_Jamón),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Jamón serrano', 100, 'gramo'),
    ('Leche', 500, 'mililitro'),
    ('Harina', 100, 'gramo'),
    ('Mantequilla', 50, 'gramo'),
    ('Cebolla', 1, 'unidad'),
    ('Nuez moscada', 1, 'pizca'),
    ('Huevos', 2, 'unidad'),
    ('Pan rallado', 100, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Migas_de_bacalao AS (
            SELECT id FROM recipes WHERE name = 'Migas de bacalao'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Migas_de_bacalao),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Bacalao desmigado', 200, 'gramo'),
    ('Pan duro', 100, 'gramo'),
    ('Leche', 200, 'mililitro'),
    ('Ajo', 2, 'unidad'),
    ('Harina', 30, 'gramo'),
    ('Mantequilla', 30, 'gramo'),
    ('Nuez moscada', 1, 'pizca')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Lomo_con_cebolla_caramelizada_y_queso AS (
            SELECT id FROM recipes WHERE name = 'Lomo con cebolla caramelizada y queso'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Lomo_con_cebolla_caramelizada_y_queso),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Lomo', 2, 'unidad'),
    ('Patatas', 400, 'gramo'),
    ('Cebolla', 0.5, 'unidad'),
    ('Vinagre balsámico', 1, 'sobre'),
    ('Queso rallado', 30, 'gramo'),
    ('Calabacín', 1, 'unidad'),
    ('Tomillo', 0.5, 'unidad'),
    ('Azúcar', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Salmorejo_tradicional_casero AS (
            SELECT id FROM recipes WHERE name = 'Salmorejo tradicional casero'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Salmorejo_tradicional_casero),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Tomate', 4, 'unidad'),
    ('Jamón serrano', 80, 'gramo'),
    ('Pimiento rojo', 1, 'unidad'),
    ('Pan de chapata', 2, 'unidad'),
    ('Vinagre balsámico', 1.5, 'sobre'),
    ('Cebolla', 1, 'unidad'),
    ('Ajo', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Hamburguesa_casera_de_ternera AS (
            SELECT id FROM recipes WHERE name = 'Hamburguesa casera de ternera'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Hamburguesa_casera_de_ternera),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Carne picada', 250, 'gramo'),
    ('Pan de brioche', 2, 'unidad'),
    ('Tomate', 1, 'unidad'),
    ('Rúcula', 50, 'gramo'),
    ('Mayonesa', 3, 'sobre'),
    ('Queso crema', 1, 'unidad'),
    ('Orégano', 1, 'cucharadita'),
    ('Vinagre de vino tinto', 2, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Judías_verdes_con_sofrito AS (
            SELECT id FROM recipes WHERE name = 'Judías verdes con sofrito'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Judías_verdes_con_sofrito),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Judías', 250, 'gramo'),
    ('Pimiento rojo', 0.5, 'unidad'),
    ('Pimiento verde', 0.5, 'unidad'),
    ('Cebolla', 0.5, 'unidad'),
    ('Ajo', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Arroz_frito_con_lomo_de_cerdo AS (
            SELECT id FROM recipes WHERE name = 'Arroz frito con lomo de cerdo'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Arroz_frito_con_lomo_de_cerdo),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Arroz', 150, 'gramo'),
    ('Lomo de cerdo', 250, 'gramo'),
    ('Cebolla', 0.5, 'unidad'),
    ('Pimiento rojo', 1, 'unidad'),
    ('Jengibre', 0.5, 'unidad'),
    ('Salsa de soja', 3, 'sobre'),
    ('Especias', 1, 'sobre'),
    ('Ajo', 2, 'unidad'),
    ('Huevos', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Solomillo_de_cerdo_con_salsa_cremosa_de_setas AS (
            SELECT id FROM recipes WHERE name = 'Solomillo de cerdo con salsa cremosa de setas'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Solomillo_de_cerdo_con_salsa_cremosa_de_setas),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Solomillo de cerdo', 250, 'gramo'),
    ('Setas', 1, 'unidad'),
    ('Nata líquida', 200, 'mililitro'),
    ('Cebolla', 1, 'unidad'),
    ('Judías', 100, 'gramo'),
    ('Arroz', 150, 'gramo'),
    ('Ajo', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Hamburguesa_casera_de_cerdo_y_perejil AS (
            SELECT id FROM recipes WHERE name = 'Hamburguesa casera de cerdo y perejil'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Hamburguesa_casera_de_cerdo_y_perejil),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pan de brioche', 2, 'unidad'),
    ('Panko', 25, 'gramo'),
    ('Mayonesa', 3, 'sobre'),
    ('Kétchup', 1, 'sobre'),
    ('Carne picada', 250, 'gramo'),
    ('Cebolla', 0.5, 'unidad'),
    ('Perejil', 0.5, 'unidad'),
    ('Patatas', 400, 'gramo'),
    ('Queso rallado', 60, 'gramo'),
    ('Azúcar', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Hamburguesa_de_ternera_con_confitura_de_fresa AS (
            SELECT id FROM recipes WHERE name = 'Hamburguesa de ternera con confitura de fresa'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Hamburguesa_de_ternera_con_confitura_de_fresa),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pan de brioche', 2, 'unidad'),
    ('Queso', 100, 'gramo'),
    ('Cogollos de lechuga', 220, 'gramo'),
    ('Carne picada', 250, 'gramo'),
    ('Ajo', 2, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Sopa_de_Verduras AS (
            SELECT id FROM recipes WHERE name = 'Sopa de Verduras'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Sopa_de_Verduras),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Zanahoria', 2, 'unidad'),
    ('Patatas', 300, 'gramo'),
    ('Apio', 2, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Ajo', 2, 'unidad'),
    ('Caldo de verduras', 1, 'litro'),
    ('Laurel', 1, 'hoja'),
    ('Tomate', 1, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Judías_verdes_con_huevo_cocido AS (
            SELECT id FROM recipes WHERE name = 'Judías verdes con huevo cocido'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Judías_verdes_con_huevo_cocido),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Judías verdes', 300, 'gramo'),
    ('Huevos', 2, 'unidad'),
    ('Bonito en lata', 1, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Aceite de oliva', 2, 'cucharada'),
    ('Sal', 1, 'pizca'),
    ('Pimienta', 1, 'pizca')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Tortilla_de_Espinacas AS (
            SELECT id FROM recipes WHERE name = 'Tortilla de Espinacas'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Tortilla_de_Espinacas),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Espinacas frescas', 200, 'gramo'),
    ('Huevos', 4, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Azúcar', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Ensalada_de_lechuga_con_tomate_cebolla AS (
            SELECT id FROM recipes WHERE name = 'Ensalada de lechuga con tomate cebolla'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Ensalada_de_lechuga_con_tomate_cebolla),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Lechuga', 1, 'unidad'),
    ('Tomate', 2, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Espárragos', 150, 'gramo'),
    ('Mejillones', 200, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Ensalada_de_Pollo_Gourmet AS (
            SELECT id FROM recipes WHERE name = 'Ensalada de Pollo Gourmet'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Ensalada_de_Pollo_Gourmet),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pechuga de pollo', 200, 'gramo'),
    ('Lechuga', 100, 'gramo'),
    ('Tomate', 1, 'unidad'),
    ('Cebolla roja', 0.5, 'unidad'),
    ('Vinagre de vino tinto', 1, 'cucharada'),
    ('Mostaza', 1, 'cucharadita'),
    ('Miel', 1, 'cucharada')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Crema_de_Verduras_ AS (
            SELECT id FROM recipes WHERE name = 'Crema de Verduras '
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Crema_de_Verduras_),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Calabacín', 3, 'unidad'),
    ('Puerro', 0.5, 'unidad'),
    ('Zanahoria', 3, 'unidad'),
    ('Patatas', 300, 'gramo'),
    ('Cebolla', 1, 'unidad'),
    ('Ajo', 2, 'unidad'),
    ('Caldo de verduras', 500, 'mililitro'),
    ('Nata líquida', 50, 'mililitro'),
    ('Perejil', 0.5, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Calamares_a_la_plancha AS (
            SELECT id FROM recipes WHERE name = 'Calamares a la plancha'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Calamares_a_la_plancha),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Calamares', 400, 'gramo'),
    ('Rúcula', 100, 'gramo'),
    ('Tomate', 2, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Merluza_al_vapor_con_brécol_ AS (
            SELECT id FROM recipes WHERE name = 'Merluza al vapor con brécol '
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Merluza_al_vapor_con_brécol_),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Merluza', 400, 'gramo'),
    ('Brécol', 200, 'gramo'),
    ('Zanahoria', 2, 'unidad'),
    ('Patata', 2, 'unidad'),
    ('Aceite de oliva', 2, 'cucharada'),
    ('Sal', 1, 'pizca'),
    ('Pimienta', 1, 'pizca')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Revuelto_de_trigueros_ AS (
            SELECT id FROM recipes WHERE name = 'Revuelto de trigueros '
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Revuelto_de_trigueros_),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Trigueros', 200, 'gramo'),
    ('Gambas', 200, 'gramo'),
    ('Huevos', 2, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Pollo_salteado AS (
            SELECT id FROM recipes WHERE name = 'Pollo salteado'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Pollo_salteado),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Pechuga de pollo', 200, 'gramo'),
    ('Champiñones', 200, 'gramo'),
    ('Ajo', 2, 'unidad'),
    ('Perejil', 1, 'cucharadita'),
    ('Pimienta', 1, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Guisantes_estofados AS (
            SELECT id FROM recipes WHERE name = 'Guisantes estofados'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Guisantes_estofados),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Guisantes', 400, 'gramo'),
    ('Harina', 1, 'cucharadita'),
    ('Cebolla', 1, 'unidad'),
    ('Ajo', 3, 'unidad'),
    ('Vino blanco', 1, 'vaso'),
    ('Mantequilla', 1, 'cucharadita'),
    ('Aceite de oliva', 1, 'cucharadita'),
    ('Jamón picado', 75, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Champiñones_rellenos AS (
            SELECT id FROM recipes WHERE name = 'Champiñones rellenos'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Champiñones_rellenos),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Champiñones', 12, 'unidad'),
    ('Langostinos', 12, 'unidad'),
    ('Cebolla', 1, 'unidad'),
    ('Pimiento rojo', 0.25, 'unidad'),
    ('Harina', 1, 'cucharadita'),
    ('Mantequilla', 1, 'cucharadita'),
    ('Leche', 100, 'unidad')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Colacao_con_tostadas AS (
            SELECT id FROM recipes WHERE name = 'Colacao con tostadas'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Colacao_con_tostadas),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Colacao', 400, 'mililitro'),
    ('Aceite de oliva', 20, 'gramo'),
    ('Miel', 2, 'cucharadita'),
    ('Hogaza de chía quinoa', 2, 'rebanada')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Café_con_tostadas AS (
            SELECT id FROM recipes WHERE name = 'Café con tostadas'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Café_con_tostadas),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Café', 400, 'mililitro'),
    ('Mantequilla', 20, 'gramo'),
    ('Mermelada de arándanos', 2, 'cucharadita'),
    ('Hogaza de chía quinoa', 2, 'rebanada')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Fruta_con_frutos_secos AS (
            SELECT id FROM recipes WHERE name = 'Fruta con frutos secos'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Fruta_con_frutos_secos),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Zumo de naranja', 400, 'mililitro'),
    ('Café', 400, 'mililitro'),
    ('Avellanas', 40, 'gramo'),
    ('Nueces', 40, 'gramo'),
    ('Hogaza de chía quinoa', 2, 'rebanada'),
    ('Jamón cocido', 80, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Frutos_secos AS (
            SELECT id FROM recipes WHERE name = 'Frutos secos'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Frutos_secos),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Zumo de naranja', 400, 'mililitro'),
    ('Nueces', 60, 'gramo'),
    ('Avellanas', 60, 'gramo')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

WITH recipe_Sartén_de_huevos AS (
            SELECT id FROM recipes WHERE name = 'Sartén de huevos'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_Sartén_de_huevos),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES
    ('Huevos', 4, 'unidad'),
    ('Langostinos', 8, 'unidad'),
    ('Gulas', 150, 'gramo'),
    ('Ajo', 2, 'unidad'),
    ('Aceite de oliva', 2, 'cucharada'),
    ('Pimienta', 0.25, 'cucharadita')
) AS ing(name, quantity, unit)
JOIN ingredients i ON i.name = ing.name
ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

