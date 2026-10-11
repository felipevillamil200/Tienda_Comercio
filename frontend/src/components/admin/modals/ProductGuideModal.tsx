'use client';

import React, { useState, useEffect } from 'react';
import { 
  Ruler, 
  Zap, 
  Box, 
  Building2, 
  Truck, 
  ClipboardList, 
  FileText, 
  Gem, 
  Wrench, 
  Check, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save, 
  X,
  ChevronDown
} from 'lucide-react';
import { ProductGuideConfig } from '@/types';
import { DEFAULT_PRODUCT_GUIDES } from '@/lib/settingsStore';

export const SVG_ICON_OPTIONS = [
  { id: 'ruler', name: 'Regla / Tallas', Icon: Ruler, color: '#ff5500' },
  { id: 'zap', name: 'Rayo / Ficha Tech', Icon: Zap, color: '#3b82f6' },
  { id: 'box', name: 'Caja / Dimensiones', Icon: Box, color: '#10b981' },
  { id: 'building', name: 'Edificio / Inmuebles', Icon: Building2, color: '#8b5cf6' },
  { id: 'truck', name: 'Vehículo / Motor', Icon: Truck, color: '#f59e0b' },
  { id: 'clipboard', name: 'Portapapeles / Guía', Icon: ClipboardList, color: '#ec4899' },
  { id: 'file', name: 'Documento / Ficha', Icon: FileText, color: '#06b6d4' },
  { id: 'gem', name: 'Diamante / Lujo', Icon: Gem, color: '#14b8a6' },
  { id: 'wrench', name: 'Herramienta / Mecánica', Icon: Wrench, color: '#eab308' }
];

export function renderGuideSvg(iconId?: string, size: number = 18, color?: string) {
  const c = color || '#ff7733';
  switch (iconId) {
    case 'zap': return <Zap size={size} color={c} />;
    case 'box': case 'dimensions': return <Box size={size} color={c} />;
    case 'building': case 'real_estate': return <Building2 size={size} color={c} />;
    case 'truck': case 'vehicle': return <Truck size={size} color={c} />;
    case 'clipboard': case 'custom': return <ClipboardList size={size} color={c} />;
    case 'file': return <FileText size={size} color={c} />;
    case 'gem': return <Gem size={size} color={c} />;
    case 'wrench': return <Wrench size={size} color={c} />;
    case 'ruler': case 'sizes':
    default: return <Ruler size={size} color={c} />;
  }
}

const PRESET_OPTIONS = [
  { key: 'sizes', name: 'Guía de Tallas & Medidas (Moda / Textil)', iconId: 'ruler' },
  { key: 'tech', name: 'Ficha Técnica & Hardware (Electrónica / Gadgets)', iconId: 'zap' },
  { key: 'dimensions', name: 'Dimensiones & Espacio (Muebles / Hogar)', iconId: 'box' },
  { key: 'real_estate', name: 'Plano & Inmuebles (Bienes Raíces)', iconId: 'building' },
  { key: 'vehicle', name: 'Ficha Mecánica (Automotriz / Vehículos)', iconId: 'truck' },
  { key: 'custom', name: 'Guía Personalizada (Libre / Universal)', iconId: 'clipboard' }
];

interface ProductGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuide?: ProductGuideConfig;
  onSave: (guide: ProductGuideConfig) => Promise<void>;
}

export default function ProductGuideModal({
  isOpen,
  onClose,
  currentGuide,
  onSave
}: ProductGuideModalProps) {
  const [guideData, setGuideData] = useState<ProductGuideConfig>(
    currentGuide || DEFAULT_PRODUCT_GUIDES.sizes
  );
  const [selectedIconId, setSelectedIconId] = useState<string>('ruler');
  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && currentGuide) {
      setGuideData(currentGuide);
      setSelectedIconId(currentGuide.buttonIcon || currentGuide.preset || 'ruler');
    }
  }, [isOpen, currentGuide]);

  if (!isOpen) return null;

  const handleSelectPreset = (presetKey: string) => {
    const template = DEFAULT_PRODUCT_GUIDES[presetKey] || DEFAULT_PRODUCT_GUIDES.sizes;
    const foundPreset = PRESET_OPTIONS.find(p => p.key === presetKey);
    const newIconId = foundPreset ? foundPreset.iconId : 'ruler';
    
    setSelectedIconId(newIconId);
    setGuideData({
      ...template,
      preset: presetKey as any,
      buttonIcon: newIconId
    });
  };

  const handleSelectIcon = (iconId: string) => {
    setSelectedIconId(iconId);
    setGuideData({
      ...guideData,
      buttonIcon: iconId
    });
    setShowIconPicker(false);
  };

  const handleAddColumn = () => {
    const newColIndex = guideData.tableHeaders.length;
    const newColName = `COLUMNA ${newColIndex + 1}`;
    const updatedHeaders = [...guideData.tableHeaders, newColName];
    const updatedRows = guideData.tableRows.map((row) => ({
      ...row,
      [`c${newColIndex}`]: '-'
    }));

    setGuideData({
      ...guideData,
      tableHeaders: updatedHeaders,
      tableRows: updatedRows
    });
  };

  const handleRemoveColumn = (colIdx: number) => {
    if (guideData.tableHeaders.length <= 1) return;
    const updatedHeaders = guideData.tableHeaders.filter((_, i) => i !== colIdx);
    const updatedRows = guideData.tableRows.map((row) => {
      const newRow: Record<string, string> = {};
      let targetI = 0;
      for (let i = 0; i < guideData.tableHeaders.length; i++) {
        if (i !== colIdx) {
          newRow[`c${targetI}`] = row[`c${i}`] || '';
          targetI++;
        }
      }
      return newRow;
    });

    setGuideData({
      ...guideData,
      tableHeaders: updatedHeaders,
      tableRows: updatedRows
    });
  };

  const handleHeaderChange = (colIdx: number, val: string) => {
    const updatedHeaders = [...guideData.tableHeaders];
    updatedHeaders[colIdx] = val;
    setGuideData({ ...guideData, tableHeaders: updatedHeaders });
  };

  const handleAddRow = () => {
    const newRow: Record<string, string> = {};
    guideData.tableHeaders.forEach((_, idx) => {
      newRow[`c${idx}`] = idx === 0 ? `Opción ${guideData.tableRows.length + 1}` : 'Medida / Dato';
    });
    setGuideData({
      ...guideData,
      tableRows: [...guideData.tableRows, newRow]
    });
  };

  const handleRemoveRow = (rowIdx: number) => {
    if (guideData.tableRows.length <= 1) return;
    const updatedRows = guideData.tableRows.filter((_, i) => i !== rowIdx);
    setGuideData({ ...guideData, tableRows: updatedRows });
  };

  const handleCellChange = (rowIdx: number, colIdx: number, val: string) => {
    const updatedRows = [...guideData.tableRows];
    updatedRows[rowIdx] = {
      ...updatedRows[rowIdx],
      [`c${colIdx}`]: val
    };
    setGuideData({ ...guideData, tableRows: updatedRows });
  };

  const handleResetPreset = () => {
    const template = DEFAULT_PRODUCT_GUIDES[guideData.preset] || DEFAULT_PRODUCT_GUIDES.sizes;
    setGuideData({ ...template });
    setSelectedIconId(template.buttonIcon || 'ruler');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...guideData,
        buttonIcon: selectedIconId
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#0f0e13',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
        overflow: 'hidden'
      }}>
        
        {/* Cabecera Superior del Modal */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#14141a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 85, 0, 0.15)',
              border: '1px solid rgba(255, 85, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff5500'
            }}>
              {renderGuideSvg(selectedIconId, 18, '#ff5500')}
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Guía del Producto & Especificaciones
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#8e8e93', margin: '2px 0 0 0' }}>
                Configura el icono SVG profesional, nombre de guía y el contenido visible en el catálogo de tu tienda
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleResetPreset}
              style={{
                background: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                color: '#facc15',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Restablecer valores por defecto"
            >
              <RotateCcw size={13} />
              <span>Restablecer</span>
            </button>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              title="Cerrar ventana"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Cuerpo del Editor */}
        <div style={{ padding: '22px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* FILA SUPERIOR: ICONO SVG A LA IZQUIERDA + LISTA/PRESET A LA DERECHA */}
          <div style={{
            backgroundColor: '#16151c',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexWrap: 'wrap'
          }}>
            {/* 1. Selector de Icono SVG */}
            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Icono SVG:
              </label>
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 85, 0, 0.15)',
                  border: '2px solid #ff5500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(255, 85, 0, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                title="Haz clic para cambiar el icono SVG profesional"
              >
                {renderGuideSvg(selectedIconId, 24, '#ff5500')}
              </button>

              {/* Popover selector de iconos SVG */}
              {showIconPicker && (
                <div style={{
                  position: 'absolute',
                  top: '64px',
                  left: 0,
                  backgroundColor: '#1f1e26',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  zIndex: 100,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.85)',
                  width: '210px'
                }}>
                  {SVG_ICON_OPTIONS.map((opt) => {
                    const isSelected = selectedIconId === opt.id;
                    const IconComp = opt.Icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectIcon(opt.id)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'rgba(255,85,0,0.25)' : 'rgba(255,255,255,0.04)',
                          border: isSelected ? '1.5px solid #ff5500' : '1px solid rgba(255,255,255,0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        title={opt.name}
                      >
                        <IconComp size={20} color={isSelected ? '#ff5500' : opt.color} />
                        <span style={{ fontSize: '0.62rem', color: isSelected ? '#ffffff' : '#a1a1aa', fontWeight: 700 }}>
                          {opt.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Lista a la derecha: Selector de Industria / Presets */}
            <div style={{ flex: '1 1 240px' }}>
              <label style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Tipo de Guía / Industria Recomendada:
              </label>
              <select
                value={guideData.preset}
                onChange={(e) => handleSelectPreset(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#0a0a0d',
                  border: '1.5px solid rgba(255, 85, 0, 0.4)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(255, 85, 0, 0.1)'
                }}
              >
                {PRESET_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key} style={{ backgroundColor: '#14141a', color: '#ffffff' }}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Nombre del Botón en Tienda */}
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Texto del Botón en Catálogo:
              </label>
              <input
                type="text"
                value={guideData.buttonLabel}
                onChange={(e) => setGuideData({ ...guideData, buttonLabel: e.target.value })}
                placeholder="Ej: Guía del Producto, Ficha Técnica..."
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}
              />
            </div>
          </div>

          {/* ÁREA DE CONTENIDO: HOJA DE DOCUMENTO CON TABLA INTEGRADA */}
          <div style={{
            backgroundColor: '#121217',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)'
          }}>
            
            {/* Barra de Herramientas del Documento */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '12px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#e5e5ea', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={15} color="#ff7733" />
                  <span>Documento de Guía & Ficha Técnica</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: '#ff7733', backgroundColor: 'rgba(255,85,0,0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                  Editable directamente
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handleAddColumn}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={13} color="#ff7733" />
                  <span>Columna</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddRow}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: 'rgba(255, 85, 0, 0.15)',
                    border: '1px solid rgba(255, 85, 0, 0.4)',
                    color: '#ff7733',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={13} />
                  <span>Fila</span>
                </button>
              </div>
            </div>

            {/* 1. Título del Modal / Documento */}
            <div>
              <label style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Título Principal del Modal:
              </label>
              <input
                type="text"
                value={guideData.modalTitle}
                onChange={(e) => setGuideData({ ...guideData, modalTitle: e.target.value })}
                placeholder="Ej: 📐 Guía del Producto & Medidas"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 900
                }}
              />
            </div>

            {/* 2. Párrafo Explicativo */}
            <div>
              <label style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Párrafo de Introducción / Recomendaciones:
              </label>
              <textarea
                rows={2}
                value={guideData.description}
                onChange={(e) => setGuideData({ ...guideData, description: e.target.value })}
                placeholder="Escribe el texto descriptivo, corte de prendas, especificaciones técnicas o consejos..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  resize: 'vertical'
                }}
              />
            </div>

            {/* 3. Hoja de Tabla Integrada */}
            <div style={{ overflowX: 'auto', backgroundColor: '#0a0a0d', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    {guideData.tableHeaders.map((header, colIdx) => (
                      <th key={colIdx} style={{ padding: '6px', textAlign: 'left', minWidth: '120px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="text"
                            value={header}
                            onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
                            style={{
                              width: '100%',
                              backgroundColor: 'rgba(255, 85, 0, 0.1)',
                              border: '1px solid rgba(255, 85, 0, 0.3)',
                              color: '#ff7733',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 900,
                              textTransform: 'uppercase'
                            }}
                          />
                          {guideData.tableHeaders.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveColumn(colIdx)}
                              title="Eliminar columna"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '2px'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                    <th style={{ width: '36px' }} />
                  </tr>
                </thead>
                <tbody>
                  {guideData.tableRows.map((row, rowIdx) => (
                    <tr key={rowIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      {guideData.tableHeaders.map((_, colIdx) => (
                        <td key={colIdx} style={{ padding: '5px' }}>
                          <input
                            type="text"
                            value={row[`c${colIdx}`] || ''}
                            onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                            style={{
                              width: '100%',
                              backgroundColor: '#14141a',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              color: '#ffffff',
                              padding: '6px 8px',
                              borderRadius: '4px',
                              fontSize: '0.78rem'
                            }}
                          />
                        </td>
                      ))}
                      <td style={{ textAlign: 'center' }}>
                        {guideData.tableRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(rowIdx)}
                            title="Eliminar fila"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#a1a1aa',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. Nota de Cierre / Pie de Página */}
            <div>
              <label style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Nota al Pie / Referencia de Garantía:
              </label>
              <input
                type="text"
                value={guideData.footerNote}
                onChange={(e) => setGuideData({ ...guideData, footerNote: e.target.value })}
                placeholder="Ej: 💡 Referencia de Modelo / Garantía de fábrica..."
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.78rem'
                }}
              />
            </div>

          </div>

        </div>

        {/* Barra de Acciones Inferior */}
        <div style={{
          padding: '16px 22px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#14141a',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#a1a1aa' }}>
            <span>Botón resultante:</span>
            <span style={{
              backgroundColor: 'rgba(255,85,0,0.15)',
              border: '1px solid rgba(255,85,0,0.3)',
              color: '#ff7733',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {renderGuideSvg(selectedIconId, 14, '#ff7733')}
              <span>{guideData.buttonLabel || 'Guía del Producto'}</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={saving}
              style={{
                padding: '9px 22px',
                backgroundColor: saveSuccess ? '#22c55e' : '#ff5500',
                border: 'none',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(255, 85, 0, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              {saveSuccess ? (
                <>
                  <Check size={16} />
                  <span>¡Guardado Exitosamente!</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{saving ? 'Guardando...' : 'Guardar y Aplicar al Catálogo'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
