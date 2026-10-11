'use client';

import React, { useState, useEffect } from 'react';
import { CategoryGroup, CategoryItem, getCategoryGroups, saveCategoryGroups, resetCategoryGroups, DEFAULT_CATEGORY_GROUPS } from '@/lib/categoriesStore';
import { Product } from '@/types';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  Check, 
  CheckSquare, 
  Square, 
  Upload, 
  ZoomIn, 
  Pencil, 
  Layers,
  HelpCircle,
  Info,
  Link2,
  ExternalLink
} from 'lucide-react';

export default function AdminCategoriesManagerModal({
  isOpen,
  onClose,
  products,
  onCategoriesSaved
}: {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onCategoriesSaved?: () => void;
}) {
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Product Zoom Lightbox State
  const [zoomedProduct, setZoomedProduct] = useState<Product | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.5);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Floating hover preview state
  const [hoverProduct, setHoverProduct] = useState<{ product: Product; x: number; y: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getCategoryGroups();
      setGroups(JSON.parse(JSON.stringify(current)));
    }
  }, [isOpen, products]);

  if (!isOpen) return null;

  const handleGroupTitleChange = (groupIndex: number, title: string) => {
    setGroups(prev => {
      const next = [...prev];
      next[groupIndex] = { ...next[groupIndex], title };
      return next;
    });
  };

  const handleGroupImageUpload = (groupIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setGroups(prev => {
          const next = [...prev];
          next[groupIndex] = { ...next[groupIndex], image: result };
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleItemImageUpload = (groupIndex: number, itemIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setGroups(prev => {
          const next = [...prev];
          const items = [...next[groupIndex].items];
          items[itemIndex] = { ...items[itemIndex], image: result };
          next[groupIndex] = { ...next[groupIndex], items };
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleItemNameChange = (groupIndex: number, itemIndex: number, name: string) => {
    setGroups(prev => {
      const next = [...prev];
      const items = [...next[groupIndex].items];
      items[itemIndex] = { ...items[itemIndex], name };
      next[groupIndex] = { ...next[groupIndex], items };
      return next;
    });
  };

  const handleItemBadgeChange = (groupIndex: number, itemIndex: number, badge: string) => {
    setGroups(prev => {
      const next = [...prev];
      const items = [...next[groupIndex].items];
      items[itemIndex] = { ...items[itemIndex], badge };
      next[groupIndex] = { ...next[groupIndex], items };
      return next;
    });
  };

  // Obtener todos los IDs de productos que tienen check en esta sección
  const getGroupProductIds = (group: CategoryGroup): string[] => {
    const ids = new Set<string>();
    (group.items || []).forEach(it => {
      (it.productIds || []).forEach(id => ids.add(id));
    });
    return Array.from(ids);
  };

  // Marcar / Desmarcar producto con check en la sección
  const handleToggleGroupProduct = (groupIndex: number, productId: string) => {
    setGroups(prev => {
      const next = [...prev];
      const group = next[groupIndex];
      const groupProductIds = getGroupProductIds(group);
      const isCurrentlyChecked = groupProductIds.includes(productId);

      if (isCurrentlyChecked) {
        // Desmarcar producto
        const updatedItems = group.items.map(it => ({
          ...it,
          productIds: (it.productIds || []).filter(id => id !== productId)
        }));
        next[groupIndex] = { ...group, items: updatedItems };
      } else {
        // Marcar producto en la subcategoría correspondiente
        const prod = products.find(p => p.id === productId);
        let assigned = false;
        
        const updatedItems = group.items.map(it => {
          if (!assigned) {
            const itLower = it.name.toLowerCase();
            const prodLower = (prod?.name || '').toLowerCase();
            const isMatch = 
              (itLower.includes('camiseta') && prodLower.includes('tee')) ||
              (itLower.includes('hoodie') && prodLower.includes('hoodie')) ||
              (itLower.includes('chaqueta') && prodLower.includes('puffer')) ||
              (itLower.includes('cargo') && prodLower.includes('cargo')) ||
              (itLower.includes('termo') && prodLower.includes('termo')) ||
              (itLower.includes('gorra') && prodLower.includes('dad cap')) ||
              (itLower.includes('sombrilla') && prodLower.includes('sombrilla')) ||
              (itLower.includes('beanie') && prodLower.includes('beanie')) ||
              (!it.productIds || it.productIds.length === 0);

            if (isMatch) {
              assigned = true;
              return {
                ...it,
                productIds: Array.from(new Set([...(it.productIds || []), productId])),
                image: it.image || prod?.image
              };
            }
          }
          return it;
        });

        if (!assigned && updatedItems.length > 0) {
          updatedItems[0] = {
            ...updatedItems[0],
            productIds: Array.from(new Set([...(updatedItems[0].productIds || []), productId]))
          };
        } else if (!assigned && updatedItems.length === 0) {
          updatedItems.push({
            id: `cat-${Date.now()}`,
            name: prod?.name || 'Nueva Prenda',
            badge: prod?.badge || '',
            image: prod?.image || '/assets/products/tee/noctis_herb_tee.jpg',
            productIds: [productId]
          });
        }

        next[groupIndex] = { ...group, items: updatedItems };
      }
      return next;
    });
  };

  const handleAddGroup = () => {
    const newGroup: CategoryGroup = {
      id: `grp-${Date.now()}`,
      title: 'Nueva Sección',
      icon: 'Tag',
      image: '/assets/products/tee/noctis_herb_tee.jpg',
      items: [
        {
          id: `cat-${Date.now()}`,
          name: 'Nueva Categoría',
          badge: '',
          image: '/assets/products/tee/noctis_herb_tee.jpg',
          productIds: []
        }
      ]
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const handleDeleteGroup = (groupIndex: number) => {
    if (confirm('¿Eliminar esta sección?')) {
      setGroups(prev => prev.filter((_, idx) => idx !== groupIndex));
    }
  };

  const handleAddItem = (groupIndex: number) => {
    const newItem: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: 'Nueva Subcategoría',
      badge: '',
      image: '/assets/products/tee/noctis_herb_tee.jpg',
      productIds: []
    };
    setGroups(prev => {
      const next = [...prev];
      next[groupIndex] = {
        ...next[groupIndex],
        items: [...next[groupIndex].items, newItem]
      };
      return next;
    });
  };

  const handleDeleteItem = (groupIndex: number, itemIndex: number) => {
    setGroups(prev => {
      const next = [...prev];
      next[groupIndex] = {
        ...next[groupIndex],
        items: next[groupIndex].items.filter((_, idx) => idx !== itemIndex)
      };
      return next;
    });
  };

  const handleSave = () => {
    saveCategoryGroups(groups);
    setSaveSuccess(true);
    if (onCategoriesSaved) onCategoriesSaved();
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (confirm('¿Restablecer las categorías originales del catálogo?')) {
      const res = resetCategoryGroups();
      setGroups(JSON.parse(JSON.stringify(res)));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(10px)'
        }}
      />

      {/* Modal Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '92vh',
          backgroundColor: '#0f0f11',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '16px',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          color: '#ffffff',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Layers size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#ffffff' }}>
                Gestor de Tienda & Categorías
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#a1a1aa' }}>
                Selecciona con checks qué productos pertenecen a cada sección del catálogo.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Botón de Ayuda (?) para el Dueño */}
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              aria-label="Guía de uso para el administrador"
              title="Haz clic aquí para ver la guía y para qué sirve cada sección"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)';
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <HelpCircle size={18} style={{ color: '#ffffff' }} />
            </button>

            {/* Botón de Cierre (X) */}
            <button
              type="button"
              className="client-close-btn"
              onClick={onClose}
              title="Cerrar"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Secciones */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {groups.map((group, groupIdx) => {
            const groupImage = group.image || (products.length > 0 ? products[0].image : '/assets/products/tee/noctis_herb_tee.jpg');
            const groupProductIds = getGroupProductIds(group);

            return (
              <div
                key={group.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '12px',
                  padding: '18px'
                }}
              >
                {/* 1. Header de la Sección */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  
                  {/* Foto de Portada */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '46px',
                        height: '46px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1.5px solid rgba(255, 255, 255, 0.3)',
                        backgroundColor: '#141416',
                        flexShrink: 0
                      }}
                    >
                      <img
                        src={groupImage}
                        alt={group.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/assets/products/tee/noctis_herb_tee.jpg';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <label
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          opacity: 0,
                          transition: 'opacity 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                        title="Cambiar foto de sección"
                      >
                        <Upload size={14} style={{ color: '#ffffff' }} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleGroupImageUpload(groupIdx, e)}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Upload size={11} style={{ color: '#ffffff' }} />
                      <span>Cambiar Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGroupImageUpload(groupIdx, e)}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  {/* Título de la Sección */}
                  <div style={{ flex: '1 1 240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={group.title}
                      onChange={(e) => handleGroupTitleChange(groupIdx, e.target.value)}
                      placeholder="Nombre de la sección..."
                      style={{
                        width: '100%',
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: '#ffffff',
                        padding: '8px 34px 8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.92rem',
                        fontWeight: 800
                      }}
                    />
                    <Pencil
                      size={14}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        color: '#ffffff',
                        opacity: 0.8,
                        pointerEvents: 'none'
                      }}
                    />
                  </div>

                  {/* Contador de checks */}
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#ffffff'
                    }}
                  >
                    {groupProductIds.length} {groupProductIds.length === 1 ? 'prenda marcada' : 'prendas marcadas'}
                  </div>

                  {/* Botón Eliminar Sección */}
                  <button
                    type="button"
                    onClick={() => handleDeleteGroup(groupIdx)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#a1a1aa',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.76rem',
                      fontWeight: 700
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a1a1aa')}
                  >
                    <Trash2 size={13} />
                    <span>Eliminar</span>
                  </button>
                </div>

                {/* 2. Cuadrícula de Checks de Productos para esta Sección */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    Marca con check los productos que van en "{group.title}":
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '8px'
                    }}
                  >
                    {products.map((p) => {
                      const isChecked = groupProductIds.includes(p.id);
                      const thumbImage = p.availableColors?.[0]?.image || p.image;

                      return (
                        <div
                          key={p.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            backgroundColor: isChecked ? 'rgba(255, 255, 255, 0.1)' : '#18181b',
                            border: isChecked ? '1.5px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onClick={() => handleToggleGroupProduct(groupIdx, p.id)}
                        >
                          {/* Casilla Checkbox */}
                          <div style={{ color: isChecked ? '#ffffff' : '#71717a', display: 'flex', alignItems: 'center' }}>
                            {isChecked ? (
                              <CheckSquare size={18} style={{ color: '#ffffff' }} />
                            ) : (
                              <Square size={18} style={{ color: '#52525b' }} />
                            )}
                          </div>

                          {/* Miniatura */}
                          <div
                            style={{
                              position: 'relative',
                              width: '36px',
                              height: '36px',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              backgroundColor: '#0a0a0c',
                              flexShrink: 0
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setZoomedProduct(p);
                            }}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoverProduct({ product: p, x: rect.right + 12, y: rect.top - 40 });
                            }}
                            onMouseLeave={() => setHoverProduct(null)}
                            title="Clic para zoom"
                          >
                            <img
                              src={thumbImage}
                              alt={p.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>

                          {/* Título y Precio */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                              <div
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  color: '#ffffff',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {p.name}
                              </div>

                              <a
                                href={`/producto/${p.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                title={`Ver página pública: /producto/${p.id}`}
                                style={{
                                  color: '#ff7733',
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '2px',
                                  opacity: 0.8,
                                  transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
                              >
                                <ExternalLink size={12} />
                              </a>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: isChecked ? '#ffffff' : '#a1a1aa', fontWeight: 700 }}>
                              ${p.price.toLocaleString('es-CO')} COP
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Subcategorías y Badges (Visualización y edición limpia del menú) */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    Categorías y Etiquetas que ve el cliente:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {group.items.map((item, itemIdx) => {
                      const itemImage = item.image || groupImage;

                      return (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#141416',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '6px 10px'
                          }}
                        >
                          {/* Miniatura Subcategoría */}
                          <div
                            style={{
                              position: 'relative',
                              width: '30px',
                              height: '30px',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              flexShrink: 0
                            }}
                          >
                            <img
                              src={itemImage}
                              alt={item.name}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/assets/products/tee/noctis_herb_tee.jpg';
                              }}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <label
                              style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: 0,
                                transition: 'opacity 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                            >
                              <Upload size={10} style={{ color: '#ffffff' }} />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleItemImageUpload(groupIdx, itemIdx, e)}
                                style={{ display: 'none' }}
                              />
                            </label>
                          </div>

                          {/* Nombre editable con lápiz */}
                          <div style={{ flex: '1 1 200px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleItemNameChange(groupIdx, itemIdx, e.target.value)}
                              placeholder="Nombre de subcategoría..."
                              style={{
                                width: '100%',
                                backgroundColor: '#1c1c1f',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#ffffff',
                                padding: '4px 26px 4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 700
                              }}
                            />
                            <Pencil
                              size={11}
                              style={{
                                position: 'absolute',
                                right: '8px',
                                color: '#ffffff',
                                opacity: 0.8,
                                pointerEvents: 'none'
                              }}
                            />
                          </div>

                          {/* Badge Pill */}
                          <div style={{ width: '130px' }}>
                            <input
                              type="text"
                              value={item.badge || ''}
                              onChange={(e) => handleItemBadgeChange(groupIdx, itemIdx, e.target.value)}
                              placeholder="BADGE (DROP 01)..."
                              style={{
                                width: '100%',
                                backgroundColor: item.badge ? 'rgba(255, 255, 255, 0.12)' : '#1c1c1f',
                                border: item.badge ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#ffffff',
                                padding: '4px 6px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase'
                              }}
                            />
                          </div>

                          {/* Eliminar Item */}
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(groupIdx, itemIdx)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#71717a',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
                            title="Eliminar categoría"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}

                    {/* Botón Añadir Subcategoría */}
                    <button
                      type="button"
                      onClick={() => handleAddItem(groupIdx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px dashed rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: '#a1a1aa',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#a1a1aa')}
                    >
                      <Plus size={12} />
                      <span>Añadir otra categoría a "{group.title}"</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Botón Crear Sección */}
          <button
            type="button"
            onClick={handleAddGroup}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1.5px dashed rgba(255, 255, 255, 0.25)',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>+ Crear Nueva Sección de Tienda</span>
          </button>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#a1a1aa',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} />
            <span>Restablecer por Defecto</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                border: 'none',
                color: '#000000',
                padding: '9px 20px',
                borderRadius: '6px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              {saveSuccess ? (
                <>
                  <Check size={15} />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>GUARDAR CAMBIOS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Hover Preview */}
      {hoverProduct && (
        <div
          style={{
            position: 'fixed',
            left: `${Math.min(hoverProduct.x, window.innerWidth - 260)}px`,
            top: `${Math.max(20, Math.min(hoverProduct.y, window.innerHeight - 300))}px`,
            width: '240px',
            backgroundColor: '#0a0a0c',
            border: '2px solid #ffffff',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95)',
            zIndex: 100000,
            pointerEvents: 'none'
          }}
        >
          <div style={{ width: '100%', height: '180px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#000000' }}>
            <img
              src={hoverProduct.product.availableColors?.[0]?.image || hoverProduct.product.image}
              alt={hoverProduct.product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontWeight: 900, fontSize: '0.82rem', color: '#ffffff' }}>{hoverProduct.product.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 800, marginTop: '2px' }}>
              ${hoverProduct.product.price.toLocaleString('es-CO')} COP
            </div>
          </div>
        </div>
      )}

      {/* Visor Lightbox */}
      {zoomedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100002,
            backgroundColor: 'rgba(0, 0, 0, 0.94)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setZoomedProduct(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '800px',
              width: '100%',
              backgroundColor: '#0c0c0e',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                {zoomedProduct.name}
              </h3>
              <button
                type="button"
                className="client-close-btn"
                onClick={() => setZoomedProduct(null)}
                title="Cerrar"
                aria-label="Cerrar vista"
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '440px',
                backgroundColor: '#050505',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={zoomedProduct.availableColors?.[0]?.image || zoomedProduct.image}
                alt={zoomedProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div
              style={{
                padding: '12px 18px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '0.76rem', color: '#a1a1aa' }}>{zoomedProduct.subtitle}</span>
              <span style={{ fontSize: '0.94rem', fontWeight: 900, color: '#ffffff' }}>
                ${zoomedProduct.price.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Independiente de Ayuda (?) para el Dueño */}
      {showHelp && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100010,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setShowHelp(false)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '680px',
              backgroundColor: '#111114',
              border: '1.5px solid rgba(255, 255, 255, 0.22)',
              borderRadius: '16px',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              color: '#ffffff'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal de Ayuda */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255, 255, 255, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}
                >
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#ffffff' }}>
                    Guía de Uso del Gestor de Categorías
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#a1a1aa' }}>
                    Aprende cómo organizar tus secciones y sincronizar tu catálogo al 100%.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowHelp(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Contenido en Tarjetas */}
            <div
              style={{
                padding: '22px 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '14px',
                maxHeight: '65vh',
                overflowY: 'auto'
              }}
            >
              {/* Card 1: Portada y Título */}
              <div
                style={{
                  backgroundColor: '#17171b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '14px'
                }}
              >
                <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📸 1. Portada y Título de Sección</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#d4d4d8', lineHeight: '1.45' }}>
                  Define los <strong>bloques principales</strong> del menú del cliente (ej. <em>Prendas Superiores</em>, <em>Prendas Inferiores</em>, <em>Equipo & Clima Bogotá</em>). Puedes cambiar la foto de portada y editar el título con el lápiz ✏️.
                </p>
              </div>

              {/* Card 2: Checks de Productos */}
              <div
                style={{
                  backgroundColor: '#17171b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '14px'
                }}
              >
                <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>☑️ 2. Asignación con Checks [✓]</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#d4d4d8', lineHeight: '1.45' }}>
                  Marca qué prendas de tu catálogo pertenecen a cada sección. Si marcas <strong>3 checks</strong> (Camiseta, Hoodie, Chaqueta Puffer), el cliente verá exactamente esos 3 productos en esa sección.
                </p>
              </div>

              {/* Card 3: Categorías y Badges */}
              <div
                style={{
                  backgroundColor: '#17171b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '14px'
                }}
              >
                <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏷️ 3. Subcategorías y Badges (Etiquetas)</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#d4d4d8', lineHeight: '1.45' }}>
                  Son las líneas específicas que lee el comprador (ej. <em>Camisetas Oversized</em>) y sus sellos comerciales como <strong>DROP 01</strong>, <strong>TÉRMICO</strong>, <strong>IMPERMEABLE</strong> o <strong>ANTILLUVIA</strong>.
                </p>
              </div>

              {/* Card 4: Zoom y Guardado */}
              <div
                style={{
                  backgroundColor: '#17171b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '14px'
                }}
              >
                <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔍 4. Lupa HD y Guardado en Vivo</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#d4d4d8', lineHeight: '1.45' }}>
                  Haz clic o pasa el ratón sobre cualquier foto para inspeccionar la prenda en alta resolución. Al presionar <strong>GUARDAR CAMBIOS</strong>, el menú del cliente se actualiza al instante en tiempo real.
                </p>
              </div>
            </div>

            {/* Footer con Botón Entendido */}
            <div
              style={{
                padding: '14px 24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                style={{
                  background: '#ffffff',
                  border: 'none',
                  color: '#000000',
                  padding: '8px 22px',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 12px rgba(255, 255, 255, 0.15)'
                }}
              >
                ¡Entendido, volver al gestor!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
