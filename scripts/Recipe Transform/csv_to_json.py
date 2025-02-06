from tqdm import tqdm
import csv
import json
import re
import os

def parse_cantidad(cantidad):
    # Ajuste para manejar números decimales y fracciones
    match = re.match(r"([\d\.\/]+)\s*(\D*)", cantidad)
    if match:
        numero, unidad = match.groups()
        try:
            if '/' in numero:
                numero = eval(numero)  # Evalúa fracciones como '1/2'
            else:
                numero = float(numero) if '.' in numero else int(numero)
        except ValueError:
            return cantidad, "unidades"  # Devuelve como está si hay algún problema
        return numero, unidad.strip() if unidad else "unidades"
    else:
        return cantidad, "unidades"

def csv_to_json(csv_file_path, json_file_path):
    if not os.path.isfile(csv_file_path):
        raise FileNotFoundError(f"El archivo CSV {csv_file_path} no existe.")

    data = []
    
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        rows = list(csv_reader)
        for row in tqdm(rows, desc="Procesando recetas"):
            ingredientes = []
            for i in range(1, 21):  # Hasta 20 ingredientes
                ingrediente = row.get(f'Ingrediente_{i}', '').strip()
                cantidad_raw = row.get(f'Cantidad_{i}', '').strip()
                tipo_alimento = row.get(f'Tipo_{i}', '').strip()

                if ingrediente:
                    cantidad, unidad = parse_cantidad(cantidad_raw)
                    ingredientes.append({
                        "Nombre": ingrediente,
                        "Cantidad": cantidad,
                        "Unidad": unidad,
                        "Tipo de alimento": tipo_alimento
                    })
            
            instrucciones = {f"Paso {j}": row.get(f'Paso {j}', '').strip() for j in range(1, 7)}

            receta = {
                "Plato": row['Titulo'].strip(),
                "Acompañamiento": row['Descripcion'].strip(),
                "Fuente": row['Fuente'].strip(),
                "Tipo": row['Tipo de comida'].strip(),
                "Categoria": row['Categoria'].strip(),
                "Comensales": 2,
                "Ingredientes": ingredientes,
                "Calorias": row['Valor energético (kcal)'].strip(),
                "Valor energético (kJ)": row['Valor energético (kJ)'].strip(),
                "Grasas": row['Grasas'].strip(),
                "Saturadas": row['de las cuales saturadas'].strip(),
                "Carbohidratos": row['Carbohidratos'].strip(),
                "Azúcares": row['de los cuales azúcares'].strip(),
                "Fibra": row['Fibra'].strip(),
                "Proteínas": row['Proteínas'].strip(),
                "Tiempo de preparación": "",  # Este campo no se encuentra en los datos originales
                "Instrucciones": instrucciones,
                "Url": row['URL'].strip(),
                "PDF_Url": row['PDF_URL'].strip(),
                "image_url": row.get('image_url', '').strip()
            }
            
            data.append(receta)
    
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

# Ruta del archivo CSV en tu ordenador
csv_file_path = r"/Users/miguelmorenovizoso/Downloads/RECETARIO - RECETAS MAIK.csv"

# Ruta donde quieres guardar el archivo JSON generado
json_file_path = r"/Users/miguelmorenovizoso/Documents/Workspace/Personal/bob-bites-bot/data/recetas.json"

# Llama a la función con las rutas especificadas
csv_to_json(csv_file_path, json_file_path)
