# 🏛️ ARQUITECTURA TÉCNICA — NOCTIS URBANO

Esta es la estructura modular y física definitiva del proyecto **NOCTIS URBANO**.

---

## 🗺️ Mapa de Carpetas en la Raíz

```
Tienda_Comercio/
│
├── 🎨 frontend/                  -> APLICACIÓN WEB NEXT.JS COMPLETA
│   ├── src/                     -> Código fuente del frontend
│   │   ├── app/                 -> Rutas de páginas (/catalogo, /producto, /admin) y APIs
│   │   ├── components/          -> Componentes visuales (Navbar, CartDrawer, Cards, Chat)
│   │   ├── context/             -> Estado de React (CartContext: carrito y favoritos)
│   │   ├── data/                -> Catálogo local semillero (products.ts)
│   │   └── types/               -> Modelos y tipos TypeScript
│   ├── public/                  -> Fotos de productos y assets multimedia
│   ├── tailwind.config.js       -> Configuración de diseño y estilos
│   ├── tsconfig.json            -> Configuración de TypeScript del frontend
│   └── next.config.js           -> Configuración del framework Next.js
│
├── ⚙️ backend/                   -> SERVICIOS Y LÓGICA DE NEGOCIO
│   ├── ai/                      -> Motor de Inteligencia Artificial (OpenRouter + Fallbacks + Prompting)
│   ├── graph/                   -> Grafo de Conocimiento y Recomendaciones (Graphology)
│   ├── mcp/                     -> Servidor MCP (Model Context Protocol 2024-11-05)
│   ├── services/                -> Servicios independientes (Wompi, Mailer, Stores)
│   │   ├── wompi.ts             -> Firmas criptográficas SHA-256 y pagos
│   │   ├── mail.ts              -> Envío de correos y notificaciones
│   │   └── productsStore.ts     -> Gestión de inventario y stock
│   ├── db.ts                    -> Conexión a PostgreSQL (Neon Serverless)
│   └── index.ts                 -> Punto de entrada del backend
│
├── 🗄️ database/                  -> SCRIPTS Y ESQUEMAS SQL
│   ├── init.sql                 -> Tablas principales (products, orders, customers)
│   └── sync_all.sql             -> Esquema maestro con vistas y catálogo semillero
│
└── 🧪 tests/                     -> PRUEBAS AUTOMATIZADAS
    ├── ai_chat_links.test.mjs   -> Pruebas del chat de IA y favoritos
    └── mcp_e2e.test.mjs         -> Pruebas de integración del servidor MCP
```

---

## 🚀 Comandos desde la Raíz

Todos los comandos se ejecutan cómodamente desde la carpeta raíz:

- **Iniciar desarrollo**: `npm run dev` (Inicia el frontend en `http://localhost:4173/`)
- **Compilar producción**: `npm run build`
- **Iniciar producción**: `npm start`
- **Ejecutar pruebas**: `npm test`
