import { Product } from '@/types';
import { getAllProducts, saveProduct } from './productsStore';

export interface CategoryItem {
  id: string;
  name: string;
  badge?: string;
  image?: string; // Foto de la subcategoría
  productIds: string[]; // IDs de productos asociados con check
}

export interface CategoryGroup {
  id: string;
  title: string;
  icon?: 'Shirt' | 'Layers' | 'Shield' | 'Sparkles' | 'Flame' | 'Tag' | 'Compass' | 'Package' | string;
  image?: string; // Foto de portada de la sección
  items: CategoryItem[];
}

// Mapeo de rutas reales para garantizar imágenes siempre visibles
const IMAGE_FIX_MAP: Record<string, string> = {
  '/assets/products/hoodie/andes_heavy_hoodie.png': '/assets/products/hoodie/noctis_heavy_hoodie.jpg',
  '/assets/products/puffer/cold_puffer_bogota.png': '/assets/products/puffer/noctis_puffer_jacket.jpg',
  '/assets/products/cargo/void_cargo_tactico.png': '/assets/products/cargo/noctis_tactical_cargo.jpg',
  '/assets/products/flask/termo_noctis_750ml.png': '/assets/products/termo/noctis_termo_flask.jpg',
  '/assets/products/cap/gorra_noctis_dad_cap.png': '/assets/products/cap/noctis_cap.jpg',
  '/assets/products/umbrella/sombrilla_shadow_bogota.png': '/assets/products/umbrella/noctis_umbrella.jpg',
  '/assets/products/beanie/gorro_andes_beanie.png': '/assets/products/beanie/noctis_beanie.jpg'
};

function sanitizeImagePath(path?: string): string {
  if (!path) return '/assets/products/tee/noctis_herb_tee.jpg';
  return IMAGE_FIX_MAP[path] || path;
}

export const DEFAULT_CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'grp-tops',
    title: 'Prendas Superiores',
    icon: 'Shirt',
    image: '/assets/products/tee/noctis_herb_tee.jpg',
    items: [
      {
        id: 'cat-tee',
        name: 'Camisetas Oversized (240 GSM)',
        badge: 'DROP 01',
        image: '/assets/products/tee/noctis_herb_tee.jpg',
        productIds: ['prod-shadow-palm-tee']
      },
      {
        id: 'cat-hoodie',
        name: 'Hoodies & Buzos Pesados (450 GSM)',
        badge: 'TÉRMICO',
        image: '/assets/products/hoodie/noctis_heavy_hoodie.jpg',
        productIds: ['prod-andes-hoodie']
      },
      {
        id: 'cat-puffer',
        name: 'Chaquetas Puffer Ripstop',
        badge: 'IMPERMEABLE',
        image: '/assets/products/puffer/noctis_puffer_jacket.jpg',
        productIds: ['prod-noctis-puffer']
      }
    ]
  },
  {
    id: 'grp-bottoms',
    title: 'Prendas Inferiores',
    icon: 'Layers',
    image: '/assets/products/cargo/noctis_tactical_cargo.jpg',
    items: [
      {
        id: 'cat-cargo',
        name: 'Pantalones Cargo Tácticos (6 Bolsillos)',
        badge: 'UTILITARIO',
        image: '/assets/products/cargo/noctis_tactical_cargo.jpg',
        productIds: ['prod-void-cargo']
      }
    ]
  },
  {
    id: 'grp-gear',
    title: 'Equipo & Clima Bogotá',
    icon: 'Shield',
    image: '/assets/products/termo/noctis_termo_flask.jpg',
    items: [
      {
        id: 'cat-termo',
        name: 'Termos Inox Térmicos (750ml)',
        badge: '',
        image: '/assets/products/termo/noctis_termo_flask.jpg',
        productIds: ['prod-noctis-flask']
      },
      {
        id: 'cat-cap',
        name: 'Gorras Dad Cap Gabardina',
        badge: '',
        image: '/assets/products/cap/noctis_cap.jpg',
        productIds: ['prod-noctis-cap']
      },
      {
        id: 'cat-umbrella',
        name: 'Sombrillas Cortaviento Automáticas',
        badge: 'ANTILLUVIA',
        image: '/assets/products/umbrella/noctis_umbrella.jpg',
        productIds: ['prod-noctis-umbrella']
      },
      {
        id: 'cat-beanie',
        name: 'Gorros Beanie de Lana',
        badge: '',
        image: '/assets/products/beanie/noctis_beanie.jpg',
        productIds: ['prod-noctis-beanie']
      }
    ]
  }
];

declare global {
  var __noctisCategoriesStore: CategoryGroup[] | undefined;
}

export function getCategoryGroups(): CategoryGroup[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('noctis_category_groups');
      if (saved) {
        const parsed: CategoryGroup[] = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          const sanitized = parsed.map((g, gIdx) => {
            const defGroup = DEFAULT_CATEGORY_GROUPS.find(dg => dg.id === g.id) || DEFAULT_CATEGORY_GROUPS[gIdx];
            return {
              ...g,
              image: sanitizeImagePath(g.image || defGroup?.image),
              items: (g.items || []).map((it, itIdx) => {
                const defItem = defGroup?.items?.find(di => di.id === it.id) || defGroup?.items?.[itIdx];
                return {
                  ...it,
                  image: sanitizeImagePath(it.image || defItem?.image),
                  badge: it.badge !== undefined ? it.badge : (defItem?.badge || ''),
                  productIds: Array.isArray(it.productIds) && it.productIds.length > 0 
                    ? it.productIds 
                    : (defItem?.productIds || [])
                };
              })
            };
          });
          return sanitized;
        }
      }
    } catch {
      // ignore
    }
  }

  if (!global.__noctisCategoriesStore || global.__noctisCategoriesStore.length === 0) {
    global.__noctisCategoriesStore = JSON.parse(JSON.stringify(DEFAULT_CATEGORY_GROUPS));
  }
  return global.__noctisCategoriesStore || DEFAULT_CATEGORY_GROUPS;
}

export function saveCategoryGroups(groups: CategoryGroup[]): CategoryGroup[] {
  const sanitized = groups.map(g => ({
    ...g,
    image: sanitizeImagePath(g.image),
    items: (g.items || []).map(it => ({
      ...it,
      image: sanitizeImagePath(it.image),
      productIds: it.productIds || []
    }))
  }));

  global.__noctisCategoriesStore = JSON.parse(JSON.stringify(sanitized));

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('noctis_category_groups', JSON.stringify(sanitized));
      window.dispatchEvent(new Event('noctis-categories-updated'));
    } catch {
      // ignore
    }
  }

  return sanitized;
}

export function resetCategoryGroups(): CategoryGroup[] {
  const defaults = JSON.parse(JSON.stringify(DEFAULT_CATEGORY_GROUPS));
  return saveCategoryGroups(defaults);
}
