import Graph from 'graphology';
import { getAllProducts, getProductById } from '@/lib/productsStore';
import { Product } from '@/types';

export interface GraphNodeAttributes {
  type: 'product' | 'category' | 'tag';
  id: string;
  name: string;
  price?: number;
  stock?: number;
  data?: Record<string, any>;
}

export interface GraphEdgeAttributes {
  relationship: 'HAS_CATEGORY' | 'HAS_TAG' | 'SIMILAR_ATTRIBUTES';
  weight: number;
  sharedAttributes?: string[];
}

/**
 * Construye el Grafo de Conocimiento directamente desde los registros de la Base de Datos.
 * CERO heurísticas, CERO palabras clave manuales y CERO reglas fijas.
 * Toda la estructura emerge matemáticamente de los datos almacenados en la BD (categorías, tags y propiedades).
 */
export function buildNoctisKnowledgeGraph(): Graph<GraphNodeAttributes, GraphEdgeAttributes> {
  const graph = new Graph<GraphNodeAttributes, GraphEdgeAttributes>({ multi: false, type: 'undirected' });
  const products = getAllProducts();

  // 1. Crear Nodos de Productos y Nodos de Entidades (Categorías y Tags) directamente desde la BD
  products.forEach(p => {
    // Nodo de Producto
    graph.addNode(p.id, {
      type: 'product',
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      data: {
        category: p.category,
        tags: p.tags || [],
        features: p.features || [],
        availableSizes: p.availableSizes || [],
        availableColors: p.availableColors || []
      }
    });

    // Nodo y Arista de Categoría (Directo de la BD)
    if (p.category) {
      const catNodeId = `cat:${p.category.trim()}`;
      if (!graph.hasNode(catNodeId)) {
        graph.addNode(catNodeId, {
          type: 'category',
          id: catNodeId,
          name: p.category
        });
      }
      graph.addEdge(p.id, catNodeId, {
        relationship: 'HAS_CATEGORY',
        weight: 1.0
      });
    }

    // Nodos y Aristas de Tags / Atributos (Directos de la BD)
    (p.tags || []).forEach(tag => {
      const cleanTag = tag.trim().toLowerCase();
      if (!cleanTag) return;
      const tagNodeId = `tag:${cleanTag}`;
      if (!graph.hasNode(tagNodeId)) {
        graph.addNode(tagNodeId, {
          type: 'tag',
          id: tagNodeId,
          name: tag
        });
      }
      if (!graph.hasEdge(p.id, tagNodeId)) {
        graph.addEdge(p.id, tagNodeId, {
          relationship: 'HAS_TAG',
          weight: 0.8
        });
      }
    });
  });

  // 2. Conectar Productos entre sí calculando afinidad por atributos compartidos en la BD
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const pA = products[i];
      const pB = products[j];

      const tagsA = new Set((pA.tags || []).map(t => t.toLowerCase()));
      const tagsB = new Set((pB.tags || []).map(t => t.toLowerCase()));
      const sharedTags = [...tagsA].filter(t => tagsB.has(t));
      const sameCategory = pA.category && pB.category && pA.category === pB.category;

      if (sharedTags.length > 0 || sameCategory) {
        const unionSize = new Set([...tagsA, ...tagsB]).size || 1;
        const jaccardScore = sharedTags.length / unionSize;
        const totalWeight = Math.min(1.0, (sameCategory ? 0.4 : 0.0) + (jaccardScore * 0.6) + (sharedTags.length * 0.1));

        graph.addEdge(pA.id, pB.id, {
          relationship: 'SIMILAR_ATTRIBUTES',
          weight: Number(totalWeight.toFixed(2)),
          sharedAttributes: [
            ...(sameCategory ? [`Categoría: ${pA.category}`] : []),
            ...sharedTags.map(t => `Tag: ${t}`)
          ]
        });
      }
    }
  }

  return graph;
}

/**
 * Obtiene la instancia actualizada del Grafo de Conocimiento
 */
export function getKnowledgeGraph(): Graph<GraphNodeAttributes, GraphEdgeAttributes> {
  return buildNoctisKnowledgeGraph();
}

/**
 * Consulta entidades y productos relacionados en el grafo para cualquier producto de la BD
 */
export function getConnectedEntities(productIdOrName: string): Array<{
  product: Product;
  relationship: string;
  weight: number;
  sharedAttributes: string[];
}> {
  const allProducts = getAllProducts();
  const targetProd = getProductById(productIdOrName) || 
    allProducts.find(p => p.id.toLowerCase() === productIdOrName.toLowerCase() || p.name.toLowerCase().includes(productIdOrName.toLowerCase()));

  if (!targetProd) return [];

  const graph = getKnowledgeGraph();
  if (!graph.hasNode(targetProd.id)) return [];

  const neighbors = graph.neighbors(targetProd.id);
  const results: Array<{ product: Product; relationship: string; weight: number; sharedAttributes: string[] }> = [];

  neighbors.forEach(neighborId => {
    const nodeAttr = graph.getNodeAttributes(neighborId);
    if (nodeAttr.type === 'product') {
      const prod = allProducts.find(p => p.id === neighborId);
      const edge = graph.getEdgeAttributes(targetProd.id, neighborId);
      if (prod && edge) {
        results.push({
          product: prod,
          relationship: edge.relationship,
          weight: edge.weight,
          sharedAttributes: edge.sharedAttributes || []
        });
      }
    }
  });

  return results.sort((a, b) => b.weight - a.weight);
}

/**
 * Genera el contexto relacional dinámico desde la BD para el System Prompt
 */
export function getGraphPromptContext(cartProductNamesOrIds: string[]): string {
  if (!cartProductNamesOrIds || cartProductNamesOrIds.length === 0) return '';
  const relationsFound: string[] = [];

  cartProductNamesOrIds.forEach(target => {
    const connected = getConnectedEntities(target);
    if (connected.length > 0) {
      const top3 = connected.slice(0, 3);
      const relSummary = top3.map(c => `"${c.product.name}" ($${c.product.price.toLocaleString('es-CO')} COP | Afinidad: ${c.sharedAttributes.join(', ')})`).join('; ');
      relationsFound.push(`• Relaciones en BD para "${target}": ${relSummary}`);
    }
  });

  if (relationsFound.length === 0) return '';
  return `\nRELACIONES DE GRAFO (BASE DE DATOS DIRECTA):\n${relationsFound.join('\n')}\n`;
}
