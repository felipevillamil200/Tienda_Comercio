'use client';

import React from 'react';
import RealisticFogCanvas from './RealisticFogCanvas';
import { useLanguage } from '@/context/LanguageContext';

export default function IdentitySection() {
  const { t } = useLanguage();

  return (
    <section className="identity split-section" id="about">
      <div className="identity-copy">
        <p className="kicker">{t('identity.kicker')}</p>
        <h2>
          {t('identity.h2_1')}<br />
          {t('identity.h2_2')}
        </h2>
        <p style={{ whiteSpace: 'pre-line' }}>
          {t('identity.p_lead').replace(/ \/ /g, '\n')}
        </p>
        <p style={{ marginTop: '16px', fontSize: '0.95rem', color: 'var(--muted)', lineHeight: '1.6' }}>
          {t('identity.p_body')}
        </p>
      </div>
      <figure className="identity-image">
        <img
          src="/assets/brand/monserrate_noche.jpg"
          alt="Monserrate iluminado de noche sobre la niebla y panorámica de Bogotá"
        />
        <RealisticFogCanvas />
        <figcaption>
          {t('identity.caption')}
        </figcaption>
      </figure>
    </section>
  );
}

