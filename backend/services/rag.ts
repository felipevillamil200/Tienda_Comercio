import { getAllProducts } from '@/lib/productsStore';
import { Product } from '@/types';

/**
 * Normaliza una cadena eliminando acentos y convirtiéndola a minúsculas
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Búsqueda semántica y léxica optimizada sobre el catálogo de productos de NOCTIS URBANO.
 * Asigna pesos de relevancia según coincidencia en nombre, categoría, tags y descripción.
 *
 * @param query Texto de búsqueda del usuario o prompt de IA
 * @param limit Número máximo de resultados a devolver (por defecto 4)
 * @returns Lista de productos ordenados por relevancia semántica
 */
export function searchProductsSemantic(query: string, limit: number = 4): Product[] {
  const products = getAllProducts();
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return products.slice(0, limit);
  }

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const scoredProducts = products.map(product => {
    let score = 0;
    const nameNorm = normalizeText(product.name || '');
    const descNorm = normalizeText(product.description || '');
    const catNorm = normalizeText(product.category || '');
    const tagsNorm = (product.tags || []).map(t => normalizeText(t));
    const featuresNorm = (product.features || []).map(f => normalizeText(f));
    const colorsNorm = (product.availableColors || []).map(c => normalizeText(c.name || ''));

    // Coincidencia exacta de la frase completa
    if (nameNorm.includes(normalizedQuery)) score += 50;
    if (catNorm.includes(normalizedQuery)) score += 30;
    if (descNorm.includes(normalizedQuery)) score += 20;

    // Coincidencia por cada token de la consulta
    for (const token of queryTokens) {
      if (nameNorm.includes(token)) score += 15;
      if (catNorm.includes(token)) score += 10;
      if (tagsNorm.some(tag => tag.includes(token))) score += 8;
      if (colorsNorm.some(color => color.includes(token))) score += 6;
      if (descNorm.includes(token)) score += 4;
      if (featuresNorm.some(feat => feat.includes(token))) score += 3;
    }

    return { product, score };
  });

  return scoredProducts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
}
