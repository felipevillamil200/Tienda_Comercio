'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function DropSignal() {
  const { t } = useLanguage();

  return (
    <section className="drop-signal" aria-label="Estado del lanzamiento">
      <div>
        <span>{t('drop.num')}</span>
        <strong>{t('drop.title')}</strong>
      </div>
      <p>{t('drop.desc')}</p>
      <span>{t('drop.meta')}</span>
    </section>
  );
}
