import { Product } from '@/types';
import { NOCTIS_PRODUCTS } from '@/data/products';

declare global {
  var __noctisProductsStore: Product[] | undefined;
}

export function getAllProducts(): Product[] {
  if (!global.__noctisProductsStore || global.__noctisProductsStore.length === 0) {
    global.__noctisProductsStore = JSON.parse(JSON.stringify(NOCTIS_PRODUCTS));
  } else {
    // Sync default catalog items images if NOCTIS_PRODUCTS updated
    NOCTIS_PRODUCTS.forEach(np => {
      const existing = global.__noctisProductsStore?.find(p => p.id === np.id);
      if (existing) {
        existing.image = np.image;
        existing.availableColors = np.availableColors;
      }
    });
  }
  return global.__noctisProductsStore;
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find(p => p.id === id);
}

export function saveProduct(product: Product): Product {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === product.id);
  
  if (index >= 0) {
    products[index] = { ...product };
    return products[index];
  } else {
    // Generar ID único si no viene
    const newProduct = {
      ...product,
      id: product.id || `prod-${Date.now().toString(36)}`
    };
    products.unshift(newProduct);
    return newProduct;
  }
}

export function deleteProduct(id: string): boolean {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === id);
  if (index >= 0) {
    products.splice(index, 1);
    return true;
  }
  return false;
}

export function updateProductStock(id: string, delta: number): Product | null {
  const product = getProductById(id);
  if (!product) return null;
  product.stock = Math.max(0, (product.stock || 0) + delta);
  return saveProduct(product);
}

export function resetProductsToFactory(): Product[] {
  global.__noctisProductsStore = JSON.parse(JSON.stringify(NOCTIS_PRODUCTS));
  return global.__noctisProductsStore || [];
}
