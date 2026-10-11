'use client';

import React, { useState } from 'react';
import { Product, ProductSize, ColorVariant } from '@/types';
import { X, Link2, Upload, FolderOpen } from 'lucide-react';

interface ProductFormModalProps {
  initialData: Product | null;
  categories: string[];
  onClose: () => void;
  onSave: (prod: Partial<Product>) => void;
}

export default function ProductFormModal({ 
  initialData, 
  categories, 
  onClose, 
  onSave 
}: ProductFormModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || 150000);
  const [category, setCategory] = useState(initialData?.category || categories[0] || 'Camisetas & Tops');
  const [stock, setStock] = useState(initialData?.stock || 20);
  const [badge, setBadge] = useState(initialData?.badge || '');
  const [image, setImage] = useState(initialData?.image || '/assets/products/tee/noctis_herb_tee.jpg');
  const [sizes, setSizes] = useState<ProductSize[]>(initialData?.availableSizes || ['S', 'M', 'L', 'XL']);

  const [colors, setColors] = useState<ColorVariant[]>(
    initialData?.availableColors && initialData.availableColors.length > 0
      ? initialData.availableColors
      : [
          { name: 'Negro', hex: '#0d0d0d', image: initialData?.image || '/assets/products/tee/noctis_herb_tee.jpg' },
          { name: 'Blanco', hex: '#f0ede6', image: '/assets/products/tee/noctis_herb_tee_blanco.png' },
          { name: 'Gris', hex: '#5f6368', image: '/assets/products/tee/noctis_herb_tee_gris.png' },
          { name: 'Rojo', hex: '#991b1b', image: '/assets/products/tee/noctis_herb_tee_rojo.jpg' },
          { name: 'Verde', hex: '#264633', image: '/assets/products/tee/noctis_herb_tee_verde.png' }
        ]
  );

  const toggleSize = (s: ProductSize) => {
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const updateColorImage = (colorName: string, newImage: string) => {
    setColors(prev => prev.map(c => c.name === colorName ? { ...c, image: newImage } : c));
  };

  const handleFileSelect = (colorName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateColorImage(colorName, result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      name,
      subtitle,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      badge,
      image: colors[0]?.image || image,
      availableSizes: sizes,
      availableColors: colors,
      features: initialData?.features || ['Algodón peinado premium', 'Corte boxy fit oversized']
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '680px', maxHeight: '88vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">{initialData ? 'EDITAR PRENDA' : 'NUEVO LANZAMIENTO'}</span>
            <h2>{initialData ? `Editar: ${initialData.name}` : 'Crear Producto en Catálogo'}</h2>
          </div>
          <button className="btn-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body settings-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Nombre del Producto *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej. NOCTIS OVERSIZED HOODIE" />
            </div>

            {/* Vista Previa de URL Automática */}
            <div style={{
              backgroundColor: 'rgba(255, 85, 0, 0.08)',
              border: '1px solid rgba(255, 85, 0, 0.25)',
              borderRadius: '6px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link2 size={15} color="#ff7733" />
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#ff7733', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>
                    URL Permanente (Generada Automáticamente por el Sistema):
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#ffffff', fontFamily: 'monospace' }}>
                    /producto/{initialData?.id || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'id-del-producto')}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                ✓ Indexado SEO
              </span>
            </div>

            <div className="form-group">
              <label>Subtítulo / Material *</label>
              <input type="text" required value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Ej. Algodón pesado 450 GSM / fit boxy" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Precio en COP *</label>
                <input type="number" required value={price} onChange={e => setPrice(Number(e.target.value))} />
              </div>

              <div className="form-group">
                <label>Stock Disponible *</label>
                <input type="number" required value={stock} onChange={e => setStock(Number(e.target.value))} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoría</label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Camisetas, Buzos, Accesorios..." />
              </div>

              <div className="form-group">
                <label>Insignia / Badge</label>
                <input type="text" value={badge} onChange={e => setBadge(e.target.value)} placeholder="LIMITADA, TÉRMICO, EXCLUSIVO..." />
              </div>
            </div>

            {/* SECCIÓN DE COLORES E IMÁGENES POR VARIANTE CON CARGA DE ARCHIVO LOCAL */}
            <div style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  🎨 Galería de Fotos por Color de la Prenda ({colors.length} colores)
                </label>
                <span style={{ fontSize: '0.72rem', color: '#ff7733', fontWeight: 700 }}>Puedes seleccionar imágenes de tu computadora</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {colors.map((col) => (
                  <div 
                    key={col.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Swatch & Label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '90px', flexShrink: 0 }}>
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: col.hex,
                        border: '1.5px solid rgba(255,255,255,0.4)',
                        display: 'inline-block'
                      }} />
                      <strong style={{ fontSize: '0.82rem', color: '#fff' }}>{col.name}</strong>
                    </div>

                    {/* Thumbnail Preview (Clic para abrir selector de archivos) */}
                    <label 
                      htmlFor={`file-upload-${col.name}`}
                      style={{ 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: '4px', 
                        overflow: 'hidden', 
                        background: '#0a0a0d', 
                        border: '1px solid rgba(255,255,255,0.2)', 
                        flexShrink: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Haz clic para seleccionar imagen de tu carpeta"
                    >
                      {col.image ? (
                        <img 
                          src={col.image} 
                          alt={col.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Upload size={16} color="#8e8e93" />
                      )}
                    </label>

                    {/* Input File Oculto */}
                    <input 
                      id={`file-upload-${col.name}`}
                      type="file" 
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileSelect(col.name, e)}
                    />

                    {/* Botón para Elegir Archivo de Carpeta */}
                    <label
                      htmlFor={`file-upload-${col.name}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.07)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        color: '#ffffff',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}
                    >
                      <FolderOpen size={13} />
                      <span>{col.image ? 'Cambiar Foto' : 'Elegir Archivo'}</span>
                    </label>

                    {/* Image URL / Status input */}
                    <input 
                      type="text" 
                      value={col.image?.startsWith('data:image') ? '(Archivo local cargado)' : (col.image || '')} 
                      onChange={(e) => updateColorImage(col.name, e.target.value)}
                      placeholder={`Ruta o URL foto ${col.name} (ej. /assets/products/tee/...)`}
                      style={{
                        flex: 1,
                        minWidth: '130px',
                        background: '#151419',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: col.image?.startsWith('data:image') ? '#4ade80' : '#fff',
                        fontSize: '0.78rem',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        outline: 'none'
                      }}
                    />

                    {col.image && (
                      <button
                        type="button"
                        onClick={() => updateColorImage(col.name, '')}
                        title="Quitar foto"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Tallas Disponibles</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                {(['S', 'M', 'L', 'XL', 'UNICA'] as ProductSize[]).map(s => (
                  <button 
                    type="button" 
                    key={s} 
                    onClick={() => toggleSize(s)}
                    style={{
                      padding: '6px 14px',
                      background: sizes.includes(s) ? '#bd4a2c' : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Descripción Completa</label>
              <textarea 
                rows={3} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Detalla los materiales, concepto de diseño y corte para Bogotá..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar en Catálogo</button>
          </div>
        </form>
      </div>
    </div>
  );
}
