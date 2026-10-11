-- ===================================================================
-- NOCTIS URBANO - Esquema Completo con Roles y Usuarios en PostgreSQL
-- ===================================================================

-- 1. Tabla de Usuarios y Roles (SuperAdmin, Admin, Cliente)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'CLIENTE', -- 'SUPERADMIN' | 'ADMIN' | 'CLIENTE'
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVO', -- 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO'
    phone VARCHAR(50),
    city VARCHAR(100),
    department VARCHAR(100),
    address TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Tabla de Productos (Catálogo)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    badge VARCHAR(50),
    image TEXT NOT NULL,
    available_sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    available_colors JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    stock INT NOT NULL DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- 3. Tabla de Pedidos / Órdenes
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    reference VARCHAR(100) UNIQUE NOT NULL,
    access_token VARCHAR(100) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'CREADO',
    tracking_number VARCHAR(100),
    transaction_id VARCHAR(100),
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery ON orders(delivery_status);

-- 4. Tabla de Cupones de Descuento
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage',
    value NUMERIC(10, 2) NOT NULL,
    min_purchase NUMERIC(12, 2) DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    expires_at DATE,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 5. Tabla de Configuración de la Tienda (Singleton)
CREATE TABLE IF NOT EXISTS store_settings (
    id INT PRIMARY KEY DEFAULT 1,
    announcement_text TEXT NOT NULL,
    announcement_active BOOLEAN DEFAULT TRUE,
    free_shipping_threshold NUMERIC(12, 2) DEFAULT 250000,
    standard_shipping_cost NUMERIC(12, 2) DEFAULT 15000,
    support_email VARCHAR(255) DEFAULT 'contacto@noctisurbano.com',
    support_phone VARCHAR(50) DEFAULT '+57 300 123 4567',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_single_row CHECK (id = 1)
);

-- ===================================================================
-- DATOS INICIALES (USUARIOS CON ROLES, CATÁLOGO, PEDIDOS, CUPONES)
-- ===================================================================

-- 1. Usuarios del Sistema (SuperAdmin, Admin y Clientes)
INSERT INTO users (id, email, name, role, status, phone, city, department, last_login)
VALUES
(
    'usr-superadmin',
    'superadmin@noctisurbano.com',
    'Director General Noctis (Dueño)',
    'SUPERADMIN',
    'ACTIVO',
    '+57 300 999 8888',
    'Bogotá D.C.',
    'Cundinamarca',
    NOW()
),
(
    'usr-admin-ops',
    'admin@noctisurbano.com',
    'Administrador de Operaciones & Logística',
    'ADMIN',
    'ACTIVO',
    '+57 310 123 4567',
    'Bogotá D.C.',
    'Cundinamarca',
    NOW() - INTERVAL '2 hours'
),
(
    'usr-client-1',
    'mateo.silva@gmail.com',
    'Mateo Julian Silva',
    'CLIENTE',
    'ACTIVO',
    '3124567890',
    'Bogotá D.C.',
    'Cundinamarca',
    NOW() - INTERVAL '1 day'
),
(
    'usr-client-2',
    'valeria.gomez@hotmail.com',
    'Valeria Gómez Restrepo',
    'CLIENTE',
    'ACTIVO',
    '3009876543',
    'Medellín',
    'Antioquia',
    NOW() - INTERVAL '3 days'
),
(
    'usr-client-3',
    'caicedo.carlos@outlook.com',
    'Carlos Andres Caicedo',
    'CLIENTE',
    'ACTIVO',
    '3156781234',
    'Cali',
    'Valle del Cauca',
    NOW() - INTERVAL '5 days'
),
(
    'usr-client-4',
    'laura.mendoza@empresa.co',
    'Laura Sofia Mendoza',
    'CLIENTE',
    'ACTIVO',
    '3187654321',
    'Barranquilla',
    'Atlántico',
    NOW() - INTERVAL '7 days'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    phone = EXCLUDED.phone,
    city = EXCLUDED.city;
