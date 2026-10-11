-- Población completa de los 8 productos de NOCTIS URBANO en PostgreSQL

INSERT INTO products (id, name, subtitle, description, price, badge, image, available_sizes, available_colors, features, stock, category, tags)
VALUES
(
    'prod-shadow-palm-tee',
    'SHADOW HERB TEE',
    'Algodón pesado 240g / fit oversized',
    'Camiseta negra oversized confeccionada en algodón pesado peinado de 240 GSM. Diseñada con cuello cerrado reforzado en rib grueso para retener la temperatura en las noches frías de Bogotá. Estampado serigráfico en espalda de yerba oscura en tono sigilo (stealth).',
    150000,
    'LIMITADA',
    '/assets/products/tee/noctis_herb_tee.jpg',
    '["S", "M", "L", "XL"]'::jsonb,
    '[
        {"name": "Negro", "hex": "#0d0d0d", "image": "/assets/products/tee/noctis_herb_tee.jpg"},
        {"name": "Blanco", "hex": "#f0ede6", "image": "/assets/products/tee/noctis_herb_tee_blanco.png"},
        {"name": "Gris", "hex": "#8a8d91", "image": "/assets/products/tee/noctis_herb_tee_gris.png"},
        {"name": "Rojo", "hex": "#801824", "image": "/assets/products/tee/noctis_herb_tee_rojo.jpg"},
        {"name": "Verde", "hex": "#3f6b45", "image": "/assets/products/tee/noctis_herb_tee_verde.png"}
    ]'::jsonb,
    '["Algodón peinado premium 240 GSM", "Corte boxy fit hombros caídos", "Estampado tacto cero en espalda", "Confección artesanal en Bogotá"]'::jsonb,
    20,
    'Camisetas & Tops',
    '["camiseta", "tee", "oversized", "algodon", "yerba", "bogota"]'::jsonb
),
(
    'prod-andes-hoodie',
    'ANDES HEAVY HOODIE',
    'Buzo con capucha pesado 450 GSM',
    'Buzo oversized confeccionado en algodón perchado térmico de 450 gramos. Capucha estructurada de doble capa sin cordones, bolsillo canguro reforzado y corte boxy diseñado para el frío extremo y las noches capitalinas.',
    210000,
    'TÉRMICO',
    '/assets/products/hoodie/noctis_heavy_hoodie.jpg',
    '["S", "M", "L", "XL"]'::jsonb,
    '[
        {"name": "Negro", "hex": "#0d0d0d", "image": "/assets/products/hoodie/noctis_heavy_hoodie.jpg"},
        {"name": "Blanco", "hex": "#f0ede6", "image": "/assets/products/hoodie/noctis_heavy_hoodie_blanco.jpg"},
        {"name": "Gris", "hex": "#636569", "image": "/assets/products/hoodie/noctis_hoodie_gris.png"},
        {"name": "Rojo", "hex": "#b31e2b", "image": "/assets/products/hoodie/noctis_hoodie_rojo.png"},
        {"name": "Verde", "hex": "#2d603a", "image": "/assets/products/hoodie/noctis_hoodie_verde.png"}
    ]'::jsonb,
    '["Algodón perchado ultra pesado 450 GSM", "Bordado NOCTIS frontal en tono sobre tono", "Capucha doble capa estructurada", "Puños y pretina en rib grueso"]'::jsonb,
    18,
    'Hoodies & Buzos',
    '["hoodie", "buzo", "capucha", "termico", "frio", "oversized"]'::jsonb
),
(
    'prod-noctis-puffer',
    'COLD PUFFER BOGOTÁ',
    'Chaqueta acolchada impermeable corta',
    'Chaqueta puffer boxy en tejido ripstop impermeable con relleno térmico ultra ligero. Cuello alto cortaviento, cremallera sellada YKK y puños elásticos para soportar las lloviznas y el frío andino.',
    280000,
    'IMPERMEABLE',
    '/assets/products/puffer/noctis_puffer_jacket.jpg',
    '["S", "M", "L", "XL"]'::jsonb,
    '[
        {"name": "Negro", "hex": "#0d0d0d", "image": "/assets/products/puffer/noctis_puffer_jacket.jpg"},
        {"name": "Blanco", "hex": "#f0ede6", "image": "/assets/products/puffer/noctis_puffer_blanco.png"},
        {"name": "Gris", "hex": "#5f6368", "image": "/assets/products/puffer/noctis_puffer_gris.png"},
        {"name": "Rojo", "hex": "#991b1b", "image": "/assets/products/puffer/noctis_puffer_rojo.png"},
        {"name": "Verde", "hex": "#264633", "image": "/assets/products/puffer/noctis_puffer_verde.png"}
    ]'::jsonb,
    '["Tejido técnico Ripstop repelente al agua y viento", "Relleno térmico acolchado de alta retención de calor", "Cremallera frontal hermética YKK impermeable", "Silueta crop boxy con ajustadores laterales"]'::jsonb,
    12,
    'Chaquetas & Abrigos',
    '["chaqueta", "puffer", "acolchada", "impermeable", "ripstop", "bogota", "lluvia", "frio"]'::jsonb
),
(
    'prod-void-cargo',
    'VOID CARGO TÁCTICO',
    'Pantalón cargo ripstop con 6 bolsillos',
    'Pantalón cargo en sarga técnica ripstop pesada con 6 bolsillos utilitarios con solapa, argollas tácticas y cordones ajustadores en botamanga para silueta ajustable de bota recta a tapered.',
    220000,
    'UTILITARIO',
    '/assets/products/cargo/noctis_tactical_cargo.jpg',
    '["S", "M", "L", "XL"]'::jsonb,
    '[
        {"name": "Negro", "hex": "#0d0d0d", "image": "/assets/products/cargo/noctis_tactical_cargo.jpg"},
        {"name": "Blanco", "hex": "#f0ede6", "image": "/assets/products/cargo/noctis_cargo_blanco.png"},
        {"name": "Gris", "hex": "#5f6368", "image": "/assets/products/cargo/noctis_cargo_gris.png"},
        {"name": "Rojo", "hex": "#991b1b", "image": "/assets/products/cargo/noctis_cargo_rojo.png"},
        {"name": "Verde", "hex": "#264633", "image": "/assets/products/cargo/noctis_cargo_verde.png"}
    ]'::jsonb,
    '["Sarga de algodón Ripstop reforzada antidesgarro", "6 bolsillos tácticos ergonómicos con fuelle", "Aislante contra viento y asfalto húmedo", "Ajustadores elásticos en tobillos con traba"]'::jsonb,
    15,
    'Pantalones & Cargos',
    '["cargo", "pantalon", "utilitario", "bolsillos", "tactico", "void", "bogota", "ripstop", "frio"]'::jsonb
),
(
    'prod-noctis-flask',
    'TERMO NOCTIS 750ML',
    'Acero inoxidable térmico doble pared',
    'Botella térmica de doble pared en acero inoxidable 18/8 grado alimenticio con acabado electrostático y tipografía grabada a láser NOCTIS. Mantiene bebidas calientes hasta por 18 horas y frías por 24 horas. Tapa hermética con asa en paracord táctico.',
    85000,
    'ACCESORIO',
    '/assets/products/termo/noctis_termo_flask.jpg',
    '["UNICA"]'::jsonb,
    '[
        {"name": "Negro", "hex": "#0d0d0d", "image": "/assets/products/termo/noctis_termo_flask.jpg"},
        {"name": "Blanco", "hex": "#f0ede6", "image": "/assets/products/termo/noctis_termo_blanco.png"},
        {"name": "Gris", "hex": "#5f6368", "image": "/assets/products/termo/noctis_termo_gris.png"},
        {"name": "Rojo", "hex": "#991b1b", "image": "/assets/products/termo/noctis_termo_rojo.png"},
        {"name": "Verde", "hex": "#264633", "image": "/assets/products/termo/noctis_termo_verde.png"}
    ]'::jsonb,
    '["Acero inoxidable 18/8 de doble pared al vacío", "Acabado electrostático antideslizante", "Asa tejida en paracord militar", "Libre de BPA y hermético"]'::jsonb,
    30,
    'Accesorios & Equipo',
    '["termo", "botella", "agua", "termico", "acero", "flask", "bogota"]'::jsonb
),
(
    'prod-noctis-cap',
    'GORRA NOCTIS DAD CAP',
    'Gabardina de algodón pesada con bordado 3D',
    'Gorra estructurada de 6 paneles confeccionada en gabardina pesada de algodón lavado. Visera curva con costuras reforzadas, bordado frontal NOCTIS en relieve 3D y correa trasera con hebilla metálica.',
    75000,
    'EDICIÓN',
    '/assets/products/cap/noctis_cap.jpg',
    '["UNICA"]'::jsonb,
    '[
        {"name": "Negro", "hex": "#0d0d0d", "image": "/assets/products/cap/noctis_cap.jpg"},
        {"name": "Blanco", "hex": "#f0ede6", "image": "/assets/products/cap/noctis_cap_blanco.png"},
        {"name": "Gris", "hex": "#5f6368", "image": "/assets/products/cap/noctis_cap_gris.png"},
        {"name": "Rojo", "hex": "#991b1b", "image": "/assets/products/cap/noctis_cap_rojo.png"},
        {"name": "Verde", "hex": "#264633", "image": "/assets/products/cap/noctis_cap_verde.png"}
    ]'::jsonb,
    '["100% Gabardina de algodón pesado prelavado", "Bordado frontal NOCTIS en alto relieve 3D", "Cierre trasero graduable con hebilla metálica", "Banda interior absorbente"]'::jsonb,
    25,
    'Accesorios & Equipo',
    '["gorra", "cachucha", "cap", "dad cap", "bordado", "streetwear", "bogota"]'::jsonb
),
(
    'prod-noctis-umbrella',
    'SOMBRILLA SHADOW BOGOTÁ',
    'Paraguas automático reforzado cortaviento',
    'Sombrilla técnica compacta con mecanismo de apertura y cierre automático en un toque. Tejido repelente al agua de secado instantáneo con mango texturizado en fibra de carbono, varillaje reforzado de 8 puntas resistente a vientos andinos y funda protectora NOCTIS.',
    95000,
    'ANTILLUVIA',
    '/assets/products/umbrella/noctis_umbrella.jpg',
    '["UNICA"]'::jsonb,
    '[
        {"name": "Negro", "hex": "#0d0d0d", "image": "/assets/products/umbrella/noctis_umbrella.jpg"},
        {"name": "Blanco", "hex": "#f0ede6", "image": "/assets/products/umbrella/noctis_umbrella_blanco.png"},
        {"name": "Gris", "hex": "#5f6368", "image": "/assets/products/umbrella/noctis_umbrella_gris.png"},
        {"name": "Rojo", "hex": "#991b1b", "image": "/assets/products/umbrella/noctis_umbrella_rojo.png"},
        {"name": "Verde", "hex": "#264633", "image": "/assets/products/umbrella/noctis_umbrella_verde.png"}
    ]'::jsonb,
    '["Estructura de fibra de vidrio anti-inversión", "Apertura y cierre automático One-Touch", "Mango ergonómico en fibra de carbono", "Tela impermeable recubierta en teflón"]'::jsonb,
    20,
    'Accesorios & Equipo',
    '["sombrilla", "paraguas", "lluvia", "impermeable", "antiviento", "bogota"]'::jsonb
),
(
    'prod-noctis-beanie',
    'GORRO ANDES BEANIE',
    'Gorro tejido de lana acanalada térmica',
    'Gorro beanie de punto acanalado grueso confeccionado en mezcla de lana térmica ultra suave. Dobladillo ancho estructurado con etiqueta tejida en alta definición NOCTIS en contraste sobrio. Máxima retención térmica para la noche bogotana.',
    65000,
    'TÉRMICO',
    '/assets/products/beanie/noctis_beanie.jpg',
    '["UNICA"]'::jsonb,
    '[
        {"name": "Negro", "hex": "#0d0d0d", "image": "/assets/products/beanie/noctis_beanie.jpg"},
        {"name": "Blanco", "hex": "#f0ede6", "image": "/assets/products/beanie/noctis_beanie_blanco.png"},
        {"name": "Gris", "hex": "#5f6368", "image": "/assets/products/beanie/noctis_beanie_gris.png"},
        {"name": "Rojo", "hex": "#991b1b", "image": "/assets/products/beanie/noctis_beanie_rojo.png"},
        {"name": "Verde", "hex": "#264633", "image": "/assets/products/beanie/noctis_beanie_verde.png"}
    ]'::jsonb,
    '["Tejido acanalado grueso de alta densidad térmica", "Etiqueta tejida NOCTIS en parche frontal", "Elasticidad memory-fit que mantiene la forma", "Calidez superior para bajas temperaturas"]'::jsonb,
    25,
    'Accesorios & Equipo',
    '["gorro", "beanie", "lana", "tejido", "termico", "frio", "bogota"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    badge = EXCLUDED.badge,
    image = EXCLUDED.image,
    available_sizes = EXCLUDED.available_sizes,
    available_colors = EXCLUDED.available_colors,
    features = EXCLUDED.features,
    stock = EXCLUDED.stock,
    category = EXCLUDED.category,
    tags = EXCLUDED.tags;

-- Insertar pedidos de prueba en la tabla orders
INSERT INTO orders (id, order_number, reference, access_token, customer_name, customer_email, customer_phone, shipping_address, city, department, items, total, status, delivery_status, tracking_number, transaction_id, payment_method)
VALUES
(
    'ord-pg-1',
    'ORD-989338',
    'NOCTIS-M8A2-89338',
    'tok_pg_1',
    'Mateo Julian Silva',
    'mateo.silva@gmail.com',
    '3124567890',
    'Carrera 7 # 71-21 Torre B Apt 402',
    'Bogotá D.C.',
    'Cundinamarca',
    '[{"size": "L", "color": "Negro", "quantity": 1, "product": {"name": "SHADOW HERB TEE", "price": 150000}}, {"size": "XL", "color": "Negro", "quantity": 1, "product": {"name": "ANDES HEAVY HOODIE", "price": 210000}}]'::jsonb,
    360000,
    'APPROVED',
    'DESPACHADO',
    'SERVI-BOG-98214',
    'WOMPI-TRX-1092834',
    'CARD'
),
(
    'ord-pg-2',
    'ORD-442190',
    'NOCTIS-M9K3-44219',
    'tok_pg_2',
    'Valeria Gómez Restrepo',
    'valeria.gomez@hotmail.com',
    '3009876543',
    'Calle 10 # 43E-12 El Poblado',
    'Medellín',
    'Antioquia',
    '[{"size": "M", "color": "Gris", "quantity": 1, "product": {"name": "ANDES HEAVY HOODIE", "price": 210000}}]'::jsonb,
    210000,
    'APPROVED',
    'EN_PREPARACION',
    NULL,
    'WOMPI-TRX-8827311',
    'NEQUI'
),
(
    'ord-pg-3',
    'ORD-119284',
    'NOCTIS-M9Z1-11928',
    'tok_pg_3',
    'Carlos Andres Caicedo',
    'caicedo.carlos@outlook.com',
    '3156781234',
    'Avenida 6N # 28N-04 Granada',
    'Cali',
    'Valle del Cauca',
    '[{"size": "S", "color": "Blanco", "quantity": 2, "product": {"name": "SHADOW HERB TEE", "price": 150000}}]'::jsonb,
    300000,
    'PENDING',
    'CREADO',
    NULL,
    NULL,
    'PSE'
),
(
    'ord-pg-4',
    'ORD-771239',
    'NOCTIS-M7X9-77123',
    'tok_pg_4',
    'Laura Sofia Mendoza',
    'laura.mendoza@empresa.co',
    '3187654321',
    'Carrera 51B # 84-10 Altamira',
    'Barranquilla',
    'Atlántico',
    '[{"size": "M", "color": "Rojo", "quantity": 1, "product": {"name": "SHADOW HERB TEE", "price": 150000}}]'::jsonb,
    150000,
    'APPROVED',
    'ENTREGADO',
    'ENVIA-BAQ-44910',
    'WOMPI-TRX-9988221',
    'CARD'
)
ON CONFLICT (reference) DO NOTHING;
