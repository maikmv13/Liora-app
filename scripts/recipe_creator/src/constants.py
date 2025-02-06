import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Constantes y configuraciones
OPENAI_CONFIG = {
    'SECRET_KEY': os.getenv('OPENAI_API_KEY'),
    'MAX_TOKENS': 2000,
    'MODEL': "gpt-3.5-turbo",
    'TIMEOUT': 30
}

CUISINE_TYPES = [
    'mexicana', 'española', 'japonesa', 'china', 'coreana', 'tailandesa', 'vietnamita',
    'india', 'mediterránea', 'griega', 'turca', 'libanesa', 'marroquí', 'francesa',
    'alemana', 'británica', 'americana', 'tex-mex', 'brasileña', 'peruana', 'argentina',
    'colombiana', 'venezolana', 'caribeña', 'portuguesa', 'rusa', 'polaca', 'nórdica',
    'hawaiana', 'fusión', 'fast food', 'tradicional', 'moderna', 'casera', 'callejera', 'gourmet'
]

MEAL_TYPES = ['desayuno', 'comida', 'cena', 'snack']

RECIPE_CATEGORIES = {
    'Carnes': [
        'Aves',
        'Cerdo',
        'Ternera y Vacuno',
        'Cordero',
        'Caza',
        'Casquería'
    ],
    'Pescados y Mariscos': [
        'Pescados',
        'Mariscos',
        'Cefalópodos',
        'Conservas de Mar'
    ],
    'Vegetarianas': [
        'Verduras',
        'Legumbres',
        'Arroces y Cereales',
        'Pasta',
        'Huevos'
    ],
    'Veganas': [
        'Verduras',
        'Legumbres',
        'Cereales',
        'Proteínas Vegetales',
        'Sin Gluten'
    ],
    'Ensaladas': [
        'Ensaladas Frescas',
        'Ensaladas Templadas',
        'Ensaladas de Pasta',
        'Bowls'
    ],
    'Sopas y Cremas': [
        'Sopas Calientes',
        'Sopas Frías',
        'Cremas de Verduras',
        'Caldos y Consomés'
    ],
    'Arroces y Pastas': [
        'Arroces',
        'Pastas',
        'Risottos',
        'Fideuás'
    ],
    'Postres': [
        'Tartas y Pasteles',
        'Helados y Sorbetes',
        'Frutas',
        'Sin Azúcar'
    ]
}


INGREDIENTS_BY_TYPE = {
    'Verduras Básicas': [
        'Ajo', 'Cebolla', 'Cebolla roja', 'Cebolleta',
        'Pimiento rojo', 'Pimiento verde', 'Pimiento amarillo', 'Pimientos de Padrón',
        'Tomate', 'Tomate cherry', 'Tomate pera',
        'Berenjena', 'Calabacín', 'Calabaza', 'Pepino',
        'Espárragos trigueros', 'Espárragos blancos', 'Espárragos verdes',
        'Judías verdes', 'Guisantes frescos', 'Habas frescas',
        'Tallo de apio', 'Apio', 'Puerro', 'Nabo'
    ],
    
    'Frutas y Cítricos': [
        'Naranja', 'Limón', 'Lima', 'Mandarina', 'Pomelo',
        'Manzana', 'Pera', 'Plátano', 'Piña', 'Melocotón',
        'Albaricoque', 'Ciruela', 'Higos', 'Uvas', 'Fresas',
        'Frambuesas', 'Arándanos', 'Moras'
    ],
    
    'Endulzantes y Mieles': [
        'Miel de abeja', 'Miel de romero', 'Miel de azahar', 'Miel de caña',
        'Sirope de arce', 'Sirope de agave', 'Melaza',
        'Azúcar moreno', 'Azúcar blanquilla', 'Azúcar de caña',
        'Panela', 'Stevia', 'Eritritol'
    ],
    
    'Frutos Secos y Semillas': [
        'Almendras', 'Nueces', 'Avellanas', 'Pistachos', 'Anacardos',
        'Piñones', 'Castañas', 'Nueces de macadamia', 'Nueces de Brasil',
        'Cacahuetes', 'Nueces pecanas',
        'Semillas de sésamo', 'Semillas de amapola', 'Semillas de calabaza',
        'Semillas de girasol', 'Semillas de chía', 'Semillas de lino',
        'Semillas de cáñamo', 'Semillas de mostaza',
        'Almendras laminadas', 'Almendras fileteadas', 'Almendras molidas',
        'Pistachos molidos', 'Harina de almendra'
    ],
    
    'Hierbas Frescas': [
        'Albahaca fresca', 'Perejil fresco', 'Cilantro fresco', 'Menta fresca',
        'Orégano fresco', 'Tomillo fresco', 'Romero fresco', 'Eneldo fresco',
        'Estragón fresco', 'Salvia fresca', 'Laurel fresco', 'Cebollino fresco',
        'Hierbabuena fresca', 'Melisa fresca', 'Ajedrea fresca',
        'Mezcla de hierbas frescas', 'Bouquet garni fresco'
    ],
    
    'Aceites y Grasas': [
        'Aceite de oliva', 'Aceite de girasol', 'Aceite de coco',
        'Aceite de sésamo', 'Mantequilla', 'Ghee', 'Manteca'
    ],
    
    'Bebidas y Licores': [
        'Vino blanco', 'Vino tinto', 'Vino dulce', 'Pedro Ximénez',
        'Jerez', 'Oporto', 'Marsala', 'Vermut',
        'Brandy', 'Coñac', 'Whisky', 'Ron', 'Vodka', 'Sake',
        'Licor de hierbas', 'Anís', 'Amaretto', 'Grand Marnier',
        'Cerveza rubia', 'Cerveza negra', 'Cerveza de trigo'
    ],
    # --- Carnes ---
    'Aves': [
        'Pollo entero', 'Pechuga de pollo', 'Muslos de pollo', 'Contramuslos de pollo',
        'Alas de pollo', 'Pavo entero', 'Pechuga de pavo', 'Muslos de pavo',
        'Pato', 'Pato confitado', 'Magret de pato', 'Codorniz', 'Pularda', 'Gallina'
    ],
    'Cerdo': [
        'Solomillo de cerdo', 'Lomo de cerdo', 'Costillas de cerdo', 'Panceta de cerdo',
        'Carrilleras de cerdo', 'Secreto ibérico', 'Pluma ibérica', 'Presa ibérica',
        'Cochinillo', 'Chuletas de cerdo', 'Magro de cerdo', 'Tocino', 'Papada', 
        'Codillo de cerdo', 'Paletilla de cerdo', 'Aguja de cerdo', 'Cabeza de lomo',
        'Cinta de lomo', 'Costillar de cerdo', 'Manitas de cerdo', 'Rabo de cerdo',
        'Lacón', 'Panceta ahumada', 'Bacon', 'Chasca'
    ],
    'Ternera y Vacuno': [
        'Solomillo de ternera', 'Entrecot', 'Chuletón', 'Lomo bajo', 'Lomo alto',
        'Filete de ternera', 'Medallones de ternera', 'Redondo de ternera',
        'Cadera', 'Redondo', 'Tapa', 'Contra', 'Babilla', 'Morcillo', 'Carrillera',
        'Rabo de toro', 'Osobuco', 'Falda', 'Pecho', 'Aguja', 'Espaldilla',
        'Carne para estofar', 'Carne para guisar', 'Ternera picada'
    ],
    'Cordero': [
        'Cordero', 'Chuletas de cordero', 'Pierna de cordero', 'Paletilla de cordero'
    ],
    'Carnes Picadas': [
        'Carne picada de ternera', 'Carne picada de cerdo', 'Carne picada de pollo', 'Carne picada mixta'
    ],
    'Embutidos y Curados': [
        'Jamón serrano', 'Jamón ibérico', 'Jamón ibérico de bellota', 'Jamón de recebo',
        'Jamón cocido', 'Jamón york', 'Paletilla ibérica', 'Paleta serrana',
        'Chorizo ibérico', 'Chorizo curado', 'Salchichón', 'Fuet', 'Longaniza',
        'Sobrasada', 'Morcón', 'Cecina', 'Lomo embuchado', 'Salami', 'Mortadela',
        'Pepperoni', 'Bresaola', 'Coppa', 'Speck', 'Pancetta',
        'Butifarra', 'Chorizo fresco', 'Salchicha fresca', 'Morcilla',
        'Chistorra', 'Botillo', 'Andouille'
    ],
    
    # --- Pescados y Mariscos ---
    'Pescados Blancos': [
        'Lenguado', 'Merluza', 'Lubina', 'Dorada', 'Rape', 'Bacalao', 'Róbalo',
        'Gallo', 'Rodaballo', 'Mero', 'Corvina', 'Besugo', 'Pargo',
        'San Pedro', 'Salmonete', 'Brótola', 'Pescadilla'
    ],
    'Pescados Azules': [
        'Atún', 'Salmón', 'Sardinas', 'Boquerones', 'Caballa', 'Jurel',
        'Bonito', 'Pez espada', 'Anchoas', 'Chicharro', 'Anguila',
        'Trucha', 'Palometa', 'Arenque', 'Estornino'
    ],
    'Cefalópodos': [
        'Calamares', 'Chipirones', 'Pulpo', 'Sepia'
    ],
    'Mariscos Crustáceos': [
        'Gambas', 'Langostinos', 'Cigalas', 'Nécoras', 'Centolla', 'Bogavante', 'Langosta'
    ],
    'Mariscos Moluscos': [
        'Mejillones', 'Almejas', 'Berberechos', 'Ostras', 'Vieiras', 'Navajas', 'Percebes'
    ],
    'Conservas de Pescado': [
        'Atún en conserva', 'Sardinas en aceite', 'Anchoas en aceite',
        'Mejillones en escabeche', 'Berberechos en conserva', 'Ventresca de atún'
    ],
    'Ahumados': [
        'Salmón ahumado', 'Bacalao ahumado', 'Trucha ahumada', 'Arenque ahumado'
    ],
    'Salazones': [
        'Bacalao salado', 'Mojama', 'Huevas de pescado', 'Anchoas en salazón'
    ],
    
    # --- Lácteos y Derivados ---
    'Lácteos Frescos': [
        'Leche entera', 'Leche desnatada', 'Leche semidesnatada',
        'Nata líquida', 'Nata para montar', 'Crema agria',
        'Crema de leche', 'Yogur natural', 'Yogur griego',
        'Kéfir', 'Cuajada', 'Requesón', 'Mascarpone', 'Mantequilla',
        'Mantequilla clarificada', 'Ghee'
    ],
    'Quesos Frescos': [
        'Queso fresco', 'Queso de Burgos', 'Mozzarella fresca', 'Ricotta',
        'Queso crema', 'Queso cottage', 'Queso feta', 'Queso para untar',
        'Burrata', 'Stracciatella', 'Queso panela', 'Queso de cabra fresco'
    ],
    'Quesos Curados': [
        'Queso parmesano',
        'Queso manchego',
        'Queso cheddar',
        'Queso gouda',
        'Queso emmental',
        'Queso idiazábal',
        'Queso pecorino',
        'Queso provolone',
        'Queso mahón',
        'Queso zamorano',
        'Queso comté'
    ],
    'Quesos Azules': [
        'Roquefort', 'Stilton', 'Gorgonzola', 'Blue cheese'
    ],
    'Huevos y Derivados': [
        'Huevos', 'Claras de huevo', 'Yema de huevo'
    ],
    
    # --- Panadería y Repostería ---
    'Panes Tradicionales': [
        'Pan de barra', 'Pan rústico', 'Baguette', 'Pan integral', 'Pan de molde',
        'Pan naan', 'Pan pita', 'Pan de centeno', 'Pan focaccia', 'Pan ciabatta',
        'Pan chapata', 'Pan de pueblo', 'Pan tostado', 'Pan rallado'
    ],
    'Panes Especiales': [
        'Pan sin gluten', 'Pan de centeno', 'Pan de espelta', 'Pan artesanal'
    ],
    'Bollería': [
        'Croissant', 'Danish', 'Muffins', 'Donuts', 'Pain au chocolat', 'Éclair'
    ],
    'Harinas y Masas': list(set(
        # Unión de elementos de "Harinas y Masas Básicas" y "Bases y Preparados"
        ['Harina de trigo común', 'Harina de fuerza', 'Harina integral', 'Harina de espelta',
         'Harina de centeno', 'Harina de maíz', 'Harina de arroz'] +
        ['Base para tarta', 'Masa de hojaldre', 'Masa quebrada', 'Masa brisa',
         'Masa de galletas', 'Obleas', 'Galletas molidas', 'Bizcocho genovés',
         'Plancha de bizcocho', 'Bizcochos soletilla']
    )),
    'Chocolates y Derivados': [
        'Cacao en polvo', 'Chocolate negro', 'Chocolate con leche',
        'Chocolate blanco', 'Cacao nibs', 'Chocolate sin azúcar'
    ],
    'Dulces y Confitería': [
        'Caramelo líquido', 'Sirope de chocolate', 'Sirope de caramelo',
        'Crema de chocolate y avellanas', 'Dulce de leche', 'Mermelada de fresa',
        'Mermelada de albaricoque', 'Mermelada de naranja', 'Crema de cacahuete',
        'Praliné', 'Turrón', 'Mazapán', 'Pasta de dátiles'
    ],
    'Ingredientes de Repostería': [
        'Levadura química', 'Levadura fresca', 'Levadura seca', 'Bicarbonato sódico',
        'Cremor tártaro', 'Colorante alimentario', 'Esencia de vainilla',
        'Aroma de almendra', 'Aroma de limón', 'Agar-agar', 'Gelatina en polvo',
        'Gelatina en láminas', 'Fondant', 'Pasta de azúcar', 'Azúcar glas',
        'Azúcar moreno', 'Azúcar blanquilla', 'Perlas de azúcar', 'Fideos de chocolate'
    ],
    'Cremas y Rellenos': [
        'Crema pastelera', 'Crema de mantequilla', 'Crema diplomática',
        'Crema de almendras', 'Crema de limón', 'Crema de café',
        'Ganache de chocolate', 'Trufa', 'Nata montada', 'Merengue italiano',
        'Merengue suizo', 'Buttercream'
    ],
    
    # --- Verduras y Hortalizas ---
    'Verduras de Hoja': [
        'Espinacas', 'Acelgas', 'Lechuga romana', 'Lechuga iceberg',
        'Rúcula', 'Canónigos', 'Col rizada', 'Col china', 'Escarola',
        'Endivias', 'Berros', 'Hojas de mostaza', 'Kale', 'Pak choi',
        'Hojas de remolacha', 'Hojas de nabo', 'Hojas de diente de león',
        'Brotes de alfalfa', 'Brotes de soja', 'Hojas de parra',
        'Col lisa', 'Col morada', 'Col lombarda', 'Repollo',
        'Coliflor', 'Brócoli', 'Coles de Bruselas',
        'Achicoria', 'Bimi', 'Grelos', 'Nabizas',
        'Hojas de espinaca', 'Hojas de acelga'
    ],
    'Verduras de Raíz': [
        'Zanahoria', 'Remolacha', 'Nabo', 'Rábano', 'Chirivía',
        'Boniato', 'Batata', 'Jengibre fresco', 'Cúrcuma fresca', 
        'Patata', 'Patata nueva', 'Patata roja',
        'Yuca', 'Malanga', 'Ñame', 'Topinambur',
        'Rábano daikon', 'Rábano negro', 'Colinabo', 'Apionabo'
    ],
    'Setas y Hongos': [
        'Champiñones', 'Portobello', 'Setas de ostra', 'Shiitake',
        'Setas de cardo', 'Boletus', 'Níscalos', 'Cantarelas',
        'Trufa negra', 'Trufa blanca', 'Trufa de verano',
        'Colmenillas', 'Rebozuelos', 'Pie azul',
        'Enoki', 'Maitake', 'Nameko', 'Shimeji',
        'Boletus secos', 'Shiitake secos', 'Morillas secas'
    ],
    
    # --- Condimentos ---
    'Especias y Condimentos': [
        # Especias básicas
        'Sal', 'Pimienta', 'Pimentón', 'Comino', 'Curry en polvo',
        'Azafrán', 'Nuez moscada', 'Canela', 'Cardamomo', 'Clavo',
        'Cúrcuma', 'Jengibre en polvo', 'Ajo en polvo', 'Cebolla en polvo',
        # Mezclas de especias
        'Garam masala', 'Ras el hanout', 'Cinco especias chinas', 'Hierbas provenzales',
        # Condimentos
        'Vinagre de vino', 'Vinagre balsámico', 'Salsa de soja', 'Mostaza',
        'Tabasco', 'Worcestershire', 'Mirin', 'Sake de cocina'
    ],
    'Encurtidos y Salazones': [
        'Alcaparras', 'Alcaparrones',
        'Aceitunas verdes', 'Aceitunas negras', 'Aceitunas rellenas',
        'Pepinillos', 'Cebollitas encurtidas', 'Guindillas encurtidas',
        'Pimientos encurtidos', 'Berenjenas encurtidas',
        'Anchoas en salazón', 'Anchoas en aceite'
    ],
    'Mezclas de Especias': [
        'Finas hierbas', 'Bouquet garni', 'Curry tikka masala',
        'Curry verde tailandés', 'Curry rojo tailandés', 'Tandoori masala', 'Chaat masala',
        'Panch phoron', 'Dukkah', 'Harissa', 'Chermoula', 'Advieh', 'Berbere',
        'Cajun', 'Criollo', 'Jerk', 'Piri-piri', 'Togarashi', 'Furikake', 'Sansho',
        'Sazonador italiano', 'Sazonador mexicano', 'Sazonador griego', 'Sal de hierbas',
        'Sal de ajo', 'Sal de cebolla', 'Sal ahumada', 'Sal de curry', 'Sal de trufa'
    ],
    'Salsas y Aderezos': [
        'Salsa barbacoa', 'Salsa de soja', 'Salsa teriyaki',
        'Salsa worcestershire', 'Salsa de ostras', 'Salsa hoisin',
        'Salsa sriracha', 'Tabasco', 'Mostaza Dijon',
        'Mostaza antigua', 'Mayonesa', 'Alioli',
        'Kétchup', 'Salsa de tomate', 'Salsa boloñesa',
        'Pesto', 'Guacamole', 'Hummus', 'Tahini',
        'Bechamel', 'Salsa holandesa', 'Salsa bearnesa'
    ],
    'Vinagres y Fermentados': [
        'Vinagre de manzana', 'Vinagre de vino tinto', 'Vinagre de vino blanco',
        'Vinagre balsámico', 'Vinagre de arroz', 'Vinagre de Jerez', 'Kimchi',
        'Chucrut', 'Kombucha', 'Miso rojo', 'Miso blanco', 'Tempeh fermentado',
        'Natto', 'Kéfir de agua', 'Kéfir de leche', 'Encurtidos', 'Pepinillos fermentados',
        'Aceitunas fermentadas', 'Salsa de soja fermentada', 'Amazake'
    ],
    
    # --- Otros ---
    'Proteínas Vegetales': [
        'Tofu firme', 'Tofu sedoso', 'Tofu ahumado', 'Tempeh', 'Seitán',
        'Proteína de guisante', 'Proteína de soja texturizada', 'Heura',
        'Beyond Meat', 'Jackfruit', 'Soja texturizada fina', 'Soja texturizada gruesa',
        'Proteína de arroz', 'Proteína de cáñamo', 'Proteína de calabaza',
        'Proteína de girasol', 'Quorn', 'Tempeh de garbanzos', 'Lupino texturizado',
        'Algas espirulina'
    ],
    'Endulzantes Naturales': [
        'Sirope de agave', 'Sirope de arce', 'Miel de caña', 'Eritritol', 'Azúcar de coco',
        'Stevia en polvo', 'Stevia líquida', 'Xilitol', 'Monk fruit', 'Melaza',
        'Sirope de dátil', 'Sirope de yacón', 'Miel de abeja', 'Miel de romero',
        'Miel de azahar', 'Panela', 'Azúcar mascabado', 'Azúcar de abedul',
        'Alulosa', 'Tagatosa'
    ],
    'Bebidas Vegetales y Alternativas': [
        'Leche de almendras', 'Leche de avena', 'Leche de coco', 'Leche de soja',
        'Horchata', 'Leche de arroz', 'Leche de quinoa', 'Leche de macadamia',
        'Leche de anacardos', 'Leche de alpiste', 'Leche de espelta',
        'Leche de cáñamo', 'Leche de kamut', 'Bebida de guisante', 'Bebida de avellanas',
        'Bebida de nueces', 'Bebida de mijo', 'Bebida de linaza', 'Bebida de chía',
        'Bebida de pistachos'
    ],
    'Superalimentos': [
        'Espirulina', 'Maca', 'Cacao puro', 'Bayas de goji', 'Açai',
        'Moringa', 'Camu camu', 'Chlorella', 'Matcha', 'Lúcuma',
        'Semillas de cáñamo', 'Polen de abeja', 'Propóleo', 'Hierba de trigo',
        'Ashwagandha', 'Reishi', 'Chaga', 'Cordyceps', 'Bayas de aronia', 'Semillas de chía negra'
    ],
    'Harinas y Almidones Alternativos': [
        'Harina de almendra', 'Harina de coco', 'Harina de garbanzo',
        'Harina de trigo sarraceno', 'Fécula de patata', 'Harina de quinoa',
        'Harina de amaranto', 'Harina de teff', 'Harina de sorgo',
        'Harina de castaña', 'Harina de lino', 'Harina de semillas de girasol',
        'Fécula de tapioca', 'Fécula de maíz', 'Harina de arroz integral',
        'Harina de mijo', 'Harina de avena', 'Psyllium en polvo', 'Goma xantana', 'Goma guar'
    ],
    'Arroces y Cereales': [
        'Arroz redondo', 'Arroz bomba', 'Arroz basmati', 'Arroz integral',
        'Arroz carnaroli', 'Arroz arborio', 'Arroz salvaje', 'Arroz jazmín',
        'Arroz negro', 'Arroz rojo', 'Arroz glutinoso', 'Arroz para sushi',
        'Quinoa', 'Cuscús', 'Bulgur', 'Mijo', 'Polenta',
        'Trigo sarraceno', 'Amaranto', 'Avena'
    ],
    
    'Legumbres': [
        'Garbanzos', 'Lentejas', 'Alubias blancas', 'Alubias rojas',
        'Alubias negras', 'Judías pintas', 'Guisantes secos',
        'Habas secas', 'Soja', 'Azukis', 'Edamame'
    ],
    
    'Caldos y Fondos': [
        'Caldo de pollo', 'Caldo de verduras', 'Caldo de pescado',
        'Caldo de carne', 'Fondo oscuro', 'Fumet', 'Dashi',
        'Consomé', 'Caldo de cocido', 'Caldo de jamón',
        'Caldo de vegetales'
    ],
    'Condimentos Especiales': [
        'Aceite de trufa', 'Aceite de trufa blanca', 'Aceite de trufa negra',
        'Sal trufada', 'Mantequilla trufada',
        'Caviar', 'Huevas de salmón', 'Huevas de trucha',
        'Foie gras', 'Micuit de pato',
        'Reducción de Pedro Ximénez', 'Reducción de Módena',
        'Perlas de yuzu', 'Perlas de wasabi'
    ]
}

INGREDIENT_ALIASES = {
    # Plurales
    'zanahorias': 'zanahoria',
    'cebollas': 'cebolla',
    'ajos': 'ajo',
    'pimientos': 'pimiento rojo',
    
    # Variaciones comunes
    'apio': 'tallo de apio',
    'cebolleta': 'cebolla',
    'ajo picado': 'ajo',
    'zanahoria rallada': 'zanahoria',
    
    # Cortes específicos
    'rodajas de': '',
    'filetes de': '',
    'trozos de': '',
    'picado de': '',
    'rallado de': ''
}
