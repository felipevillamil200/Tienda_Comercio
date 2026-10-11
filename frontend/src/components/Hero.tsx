'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero section-dark" aria-label="Campaña NOCTIS URBANO">
      <div className="hero-bg" aria-hidden="true" style={{ backgroundImage: "url('/assets/brand/FONDO GRUPO DE JOVENES.png')" }}></div>
      <div className="hero-noise" aria-hidden="true"></div>
      <div className="heat-line" aria-hidden="true"></div>
      <div className="hero-content">
        <p className="eyebrow">{t('hero.eyebrow')}</p>
        <h1>{t('hero.title')}</h1>
        <p className="hero-line">{t('hero.subtitle')}</p>
        <a className="btn btn-primary" href="#drop">
          <span>{t('hero.cta')}</span>
        </a>
      </div>
      <div className="hero-meta" aria-label="Detalles del drop">
        <span>{t('hero.dropTag')}</span>
        <span>{t('hero.cityTag')}</span>
        <span>{t('hero.editionTag')}</span>
      </div>
    </section>
  );
}
