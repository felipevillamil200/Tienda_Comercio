'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Coupon } from '@/types';

interface CouponFormModalProps {
  initialData: Partial<Coupon> | null;
  onClose: () => void;
  onSave: (coup: Partial<Coupon>) => void;
}

export default function CouponFormModal({ 
  initialData, 
  onClose, 
  onSave 
}: CouponFormModalProps) {
  const [code, setCode] = useState(initialData?.code || '');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(initialData?.discountType || 'percentage');
  const [value, setValue] = useState(initialData?.value || 10);
  const [minPurchase, setMinPurchase] = useState(initialData?.minPurchase || 100000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      code: code.toUpperCase().trim(),
      discountType,
      value: Number(value),
      minPurchase: Number(minPurchase),
      active: true
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">PROMOCIÓN</span>
            <h2>Nuevo Cupón de Descuento</h2>
          </div>
          <button className="btn-close" onClick={onClose} title="Cerrar"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body settings-form">
            <div className="form-group">
              <label>Código del Cupón *</label>
              <input type="text" required value={code} onChange={e => setCode(e.target.value)} placeholder="EJ. BOGOTA20K" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Descuento</label>
                <select value={discountType} onChange={e => setDiscountType(e.target.value as any)}>
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Monto Fijo (COP)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Valor {discountType === 'percentage' ? '(%)' : '(COP)'} *</label>
                <input type="number" required value={value} onChange={e => setValue(Number(e.target.value))} />
              </div>
            </div>

            <div className="form-group">
              <label>Monto Mínimo de Compra (COP)</label>
              <input type="number" value={minPurchase} onChange={e => setMinPurchase(Number(e.target.value))} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar Cupón</button>
          </div>
        </form>
      </div>
    </div>
  );
}
