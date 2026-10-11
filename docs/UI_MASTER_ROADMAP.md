# 🎨 Master Roadmap de Mejora UI / UX — NOCTIS URBANO

Este documento sirve como bitácora interactiva del plan de mejoras visuales y de ingeniería de diseño aplicando la trilogía de diseño senior (**Emil Kowalski**, **Impeccable** y **Taste-Skill**).

---

## 📊 Estado General de Progreso

| Tarea | Módulo / Componente | Habilidad Base | Estado |
| :--- | :--- | :--- | :---: |
| **Tarea 1** | Física de Animaciones & Micro-Interacciones en Botones y Tarjetas | Emil Kowalski | ✅ **CUMPLIDA** |
| **Tarea 2** | Hero & Vitrina Principal (Tipografía Editorial, Contraste WCAG y Micro-Gradientes) | Impeccable | ✅ **CUMPLIDA** |
| **Tarea 3** | CartDrawer & Flujo de Bolsa (Curva iOS Drawer, Transiciones Fluidas y Eliminación de Saltos) | Emil Kowalski | ✅ **CUMPLIDA** |
| **Tarea 4** | Ficha de Detalle de Producto (Selector de Tallas Táctil, Galería de Zoom y Acordeones) | Taste-Skill | ✅ **CUMPLIDA** |
| **Tarea 5** | Modales, Búsqueda y Navegación (Continuidad Espacial, Origen de Animación y Pulido Global) | Trilogía Unificada | ✅ **CUMPLIDA** |
| **Tarea 6** | Optimización Mobile & Responsive Craft (Grilla 2 Columnas, CartDrawer Fullwidth y Tipografía Adaptativa) | Trilogía Unificada | ✅ **CUMPLIDA** |

---

## 📋 Detalle de Tareas

### ✅ Tarea 1: Física de Animaciones & Micro-Interacciones (Emil Kowalski)
- [x] Tokens globales de aceleración cúbica (`--ease-out`, `--ease-spring`, `--duration-micro`) en `globals.css`.
- [x] Feedback táctil instantáneo (`transform: scale(0.97)`) al presionar cualquier botón `.btn`.
- [x] Zoom fluido de imagen en tarjetas de producto con `--ease-out` y micro-presión (`scale(0.99)`).
- [x] Clases aceleradas por GPU para Wishlist (`.product-wishlist-btn`) y selectores de color (`.product-color-swatch`).
- [x] Corrección de TypeScript e importaciones en `ProductCard.tsx` y `CustomIcons.tsx`.
- [x] Validación técnica: 10/10 pruebas pasadas en verde.

---

### ✅ Tarea 2: Hero & Vitrina Principal (Impeccable & Taste-Skill)
- [x] Píldora de eyebrow con micro-badge activo en naranja luminoso `#ff5500`, backdrop blur y tracking `0.2em`.
- [x] Jerarquía editorial y sombras multicapa cinematográficas en `h1` (`clamp(4.2rem, 12.5vw, 12.5rem)`).
- [x] Subtítulo `hero-line` con contraste de alta legibilidad WCAG AAA y sombra difusa.
- [x] Chips de metadatos `hero-meta` con micro-animación al hover y elevación en vidrio oscuro.
- [x] Pastillas de categoría de la vitrina con física de resorte y feedback activo naranja.

---

### ✅ Tarea 3: CartDrawer & Flujo de Compra (Emil Kowalski)
- [x] Integración de la curva nativa de drawer (`--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`).
- [x] Transición coordinada de backdrop blur (`backdrop-filter: blur(8px)`) sin parpadeos.
- [x] Botones de incremento/decremento de cantidad (`quantity-controls`) con feedback háptico (`scale(0.9)`).
- [x] Panel de carrito con sombra envolvente de profundidad `-12px 0 45px rgba(0,0,0,0.9)`.

---

### ✅ Tarea 4: Ficha de Detalle de Producto (Taste-Skill)
- [x] Selector de tallas con micro-escalado (`scale(1.02)`), sombra blanca activa y transiciones `--ease-spring`.
- [x] Selector de colores con micro-hover de resorte y bordes de acento dinámicos.
- [x] Botón de Guía de Medidas con micro-hover suave y apertura coordinada.
- [x] Tipografía de precio y badges de envío gratis con contraste óptimo.

---

### ✅ Tarea 5: Modales y Navegación Global (Trilogía Unificada)
- [x] Eliminada cualquier aparición desde `scale(0)`; las ventanas modales ahora emergen desde `scale(0.96)` con aceleración `--ease-spring`.
- [x] Transiciones fluidas en la barra de navegación (`.nav-links a::after`) con timing no lineal.
- [x] Contador de bolsa de compras con micro-resorte táctil.
- [x] Auditoría completa de rendimiento, 0 errores de TypeScript y 10/10 pruebas en verde.

---

### ✅ Tarea 6: Optimización Mobile & Responsive Craft (Trilogía Unificada)
- [x] Catálogo móvil optimizado en **cuadrícula de 2 columnas compacta** (`repeat(2, minmax(0, 1fr))`) con gap de 12px para experiencia nativa de app de moda.
- [x] Menú Hamburguesa rediseñado integralmente con accesos directos táctiles: **TIENDA** (todas las prendas), **COLECCIONES** (`/#collections`), **HISTORIA** (`/#about`), **CONTACTO** (`/#contacto`), **SEGUIR PEDIDO** (modal de guía interactivo) y **ASISTENTE NOCTIS AI**.
- [x] Navegación secundaria jerárquica por categorías de prendas con miniaturas y badges.
- [x] Selector de idioma (ES / EN) y acceso de inicio de sesión integrados al pie del drawer móvil.
- [x] Ficha de detalle de producto protegida contra desbordes horizontales en pantallas estrechas (`minmax(min(100%, 300px), 1fr)`) y barra de acciones (`Compartir Prenda` y botón de cierre `✕`) anclada a la derecha de forma consistente en móvil y escritorio.
- [x] Ventana flotante de chat NOCTIS AI adaptada con ancho óptimo (`calc(100vw - 20px)`) en pantallas móviles.
- [x] CartDrawer adaptado a pantalla completa (`width: 100%`) en dispositivos móviles.
- [x] Scroll horizontal fluido sin barras intrusivas en los chips de metadatos del Hero (`hero-meta`).
- [x] **AccountModal Mobile-First**: Convertido a modal de pantalla completa en `<=768px` con **Hub central Bento de 2 columnas táctil** con badges interactivos y botón de retorno **`← Menú`**, **layout de 2 columnas compacto y ergonómico** (`account-grid-2col`) y eliminación de botones de cierre redundantes.
- [x] **Navbar Mobile Actions Reorder**: Orden ergonómico y natural para navegación móvil: **`AI` → `Carrito (con badge)` → `Foto de Perfil / Login` → `Menú Hamburguesa`**.
- [x] **Catalog Luxury Controls & Filters Mobile-First**: Barra superior compacta en 1 fila (`Buscador` + `Categorías` + `Ordenar`) en móviles `<=768px`, carrusel de pastillas dinámicas con **flechas de navegación táctil izquierda y derecha (`<` y `>`)** y desplazamiento suave sin fricción.
- [x] **Mobile Floating Suite Calibrated**: Suite de widgets flotantes de alta conversión restaurada y perfectamente alineada en mobile (`WhatsApp + Asesoría Noctis Tooltip` en base, `✦ NOCTIS AI` flotante a 80px y botón `↑ Subir` a 128px) con ergonomía táctil y sin colisiones.
- [x] **WompiCheckoutModal & OrderTrackingModal Mobile-First**: Eliminados grids fijos de 2 columnas apretados; integración de `.modal-grid-2col` y selectores de medios de pago con auto-fit responsivo para evitar recortes de texto en teléfonos < 440px.
- [x] **Bogotá Night Lookbook Video**: Eliminados todos los botones de cámara debug y controles de HUD superfluos de la vista de compra, tipografía editorial reescalada responsivamente (`clamp(1.65rem, 6.5vw, 2.3rem)` en móvil) con contraste limpio y cinematográfico para disfrutar del timelapse nocturno de Bogotá al 100%.
- [x] **NOCTIS AI Mobile Header Polish**: Botón de maximizar/expandir pantalla completa (`[ ⤢ ]`) configurado exclusivamente para la versión web/escritorio (`.ai-desktop-only-btn`), optimizando el espacio del header en móvil para dejar únicamente los controles esenciales (`[+] Nuevo Chat`, `[⏱ Historial]` y `[✕ Cerrar]`).

---

### ✅ Tarea 7: Panel de Administración Mobile-First & Bento UX (NOCTIS ADMIN)
- [x] **Admin Topbar & Mobile Header (`admin-mobile-topbar`)**: Barra superior fija en `<=900px` con selector hamburguesa, logo institucional, badge de rol y botón táctil de refresco en tiempo real.
- [x] **Carrusel de Pastillas Táctiles Rápidas (`admin-mobile-pills-bar`)**: Barra horizontal deslizable con 1 toque para alternar instantáneamente entre todas las pestañas (**Pedidos**, **Catálogo**, **Inventario**, **Métricas**, **Clientes**, **Ajustes**, **BD**) con contadores activos y alertas de stock bajo en rojo.
- [x] **Sidebar Off-Canvas / Drawer Táctil**: El menú lateral se desliza como un drawer suave con *backdrop blur* oscuro, botón de cierre `✕` y auto-cierre al seleccionar cualquier pestaña.
- [x] **Tablas y Bento Grids Responsivos**: Contenedores de tablas con scroll táctil horizontal suave (`-webkit-overflow-scrolling: touch`), grids de métricas y filtros que se apilan a 2 columnas en tablets y 1 columna en teléfonos pequeños sin desbordes.
