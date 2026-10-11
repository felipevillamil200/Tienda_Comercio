# NOCTIS URBANO — Next.js 15 + TypeScript + Wompi + AI RAG

## 📌 Descripción

**NOCTIS URBANO** es una plataforma de e-commerce moderna, ligera y de alto rendimiento para streetwear premium. 

Reconstruida completamente sobre **Next.js 15 (App Router), React 19, TypeScript y Tailwind CSS**, integrando la pasarela oficial **Wompi Colombia** (Sandbox/Producción) y un motor de **Inteligencia Artificial con RAG (Retrieval-Augmented Generation)** para asesoría de estilo y búsqueda semántica de productos.

---

## 🚀 Arquitectura y Tecnologías

- **Framework:** Next.js 15 (App Router, Server Components y API Routes).
- **Lenguaje:** TypeScript estricto con modelos tipados (`Product`, `Order`, `CartItem`).
- **UI & Estilos:** Tailwind CSS + Vanilla CSS modular con paleta brutalista streetwear.
- **Pasarela de Pagos:** Wompi Colombia (Nequi, PSE, Bancolombia, Tarjetas de Crédito/Débito) con cálculo criptográfico SHA-256 de firma de integridad y Webhooks en tiempo real.
- **IA & RAG:** Asistente conversacional (`NOCTIS AI`) y motor de búsqueda semántica vectorial por similitud coseno.
- **Gestión de Estado:** React Context API reactivo con sincronización en `localStorage`.
- **Panel Administrativo:** Dashboard de operaciones para control de pedidos y estados de despacho en `/admin`.

---

## 📂 Estructura del Proyecto

```
Tienda_Comercio/
├── database/                     # Scripts y esquemas SQL de Neon Postgres
├── tests/                        # Suite de pruebas automatizadas (Node.js test runner)
├── public/                       # Recursos estáticos e imágenes de productos
└── src/
    ├── app/                      # Páginas (Frontend) y Rutas API (Backend)
    ├── components/               # Componentes visuales React (Navbar, CartDrawer, etc.)
    ├── context/                  # Estado reactivo global (CartContext)
    ├── data/                     # Datos iniciales de catálogo
    ├── lib/                      # Servicios Backend (Gemini IA, MCP, Graphology, Wompi, DB)
    └── types/                    # Definiciones TypeScript

> Para una explicación exhaustiva de cada módulo, consulta [ARCHITECTURE.md](ARCHITECTURE.md).
```

---

## 💻 Comandos

### Iniciar el servidor local de desarrollo
```bash
npm run dev
```
La aplicación iniciará en [http://localhost:4173/](http://localhost:4173/).

### Ejecutar Pruebas Automatizadas
```bash
npm test
```

### Compilar para producción
```bash
npm run build
npm start
```

---

## 🌐 Enlaces de Acceso

- **Tienda Pública:** [http://localhost:4173/](http://localhost:4173/)
- **Panel de Administración:** [http://localhost:4173/admin](http://localhost:4173/admin)
