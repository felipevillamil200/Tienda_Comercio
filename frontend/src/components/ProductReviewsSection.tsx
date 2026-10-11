'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Star, 
  Camera, 
  Video, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  X, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  UploadCloud,
  Play
} from 'lucide-react';

export interface ReviewMedia {
  type: 'image' | 'video';
  url: string;
}

export interface ProductReview {
  id: string;
  author: string;
  city?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  likes?: number;
  media?: ReviewMedia[];
}

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
}

export default function ProductReviewsSection({ productId, productName }: ProductReviewsSectionProps) {
  const { lang, t } = useLanguage();
  const isSpanish = lang === 'ES';

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeMediaLightbox, setActiveMediaLightbox] = useState<ReviewMedia | null>(null);

  // Form states
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number>(0);
  const [formName, setFormName] = useState<string>('');
  const [formCity, setFormCity] = useState<string>('');
  const [formComment, setFormComment] = useState<string>('');
  const [formMedia, setFormMedia] = useState<ReviewMedia[]>([]);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cargar opiniones reales por ID de producto (Limpiando datos falsos previos)
  useEffect(() => {
    if (!productId) return;
    try {
      const storageKey = `noctis_reviews_${productId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filtrar cualquier reseña simulada de prueba antigua
          const realReviews = parsed.filter(
            (r: any) => r && r.id && !r.id.startsWith('rev-def') && !r.id.startsWith('rev-1') && !r.id.startsWith('rev-2') && !r.id.startsWith('rev-3') && !r.id.startsWith('rev-4')
          );
          setReviews(realReviews);
          localStorage.setItem(storageKey, JSON.stringify(realReviews));
          return;
        }
      }
      
      // Estado real por defecto: Sin opiniones falsas
      setReviews([]);
    } catch {
      setReviews([]);
    }
  }, [productId, productName]);

  // Cargar nombre de usuario autenticado si existe
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('noctis_client_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.name && !formName) {
          setFormName(parsed.name);
        }
        if (parsed.city && !formCity) {
          setFormCity(parsed.city);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Manejador de subida de archivos (Fotos y Videos con FileReader)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Límite de tamaño: 25MB para videos/fotos
      if (file.size > 25 * 1024 * 1024) {
        alert(isSpanish ? 'El archivo es demasiado grande (máx 25MB).' : 'File is too large (max 25MB).');
        return;
      }

      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setFormMedia((prev) => [
            ...prev,
            {
              type: isVideo ? 'video' : 'image',
              url: event.target!.result as string
            }
          ]);
        }
      };

      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  const handleRemoveMedia = (index: number) => {
    setFormMedia((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim() || !formName.trim()) return;

    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      author: formName.trim(),
      city: formCity.trim() || 'Bogotá D.C.',
      rating: formRating,
      date: isSpanish ? 'Hoy' : 'Today',
      comment: formComment.trim(),
      verified: true,
      likes: 1,
      media: formMedia.length > 0 ? [...formMedia] : undefined
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);

    try {
      localStorage.setItem(`noctis_reviews_${productId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowForm(false);
      setFormComment('');
      setFormMedia([]);
    }, 1800);
  };

  // Cargar likes locales guardados
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem(`noctis_review_likes_${productId}`);
      if (savedLikes) {
        setLikedReviews(JSON.parse(savedLikes));
      }
    } catch {
      // ignore
    }
  }, [productId]);

  const handleLikeReview = (reviewId: string) => {
    const isCurrentlyLiked = Boolean(likedReviews[reviewId]);
    const updatedLiked = { ...likedReviews, [reviewId]: !isCurrentlyLiked };
    setLikedReviews(updatedLiked);

    try {
      localStorage.setItem(`noctis_review_likes_${productId}`, JSON.stringify(updatedLiked));
    } catch {
      // ignore
    }

    setReviews((prev) => {
      const updated = prev.map((r) => {
        if (r.id === reviewId) {
          const currentCount = r.likes || 0;
          const newLikes = isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;
          return { ...r, likes: newLikes };
        }
        return r;
      });

      try {
        localStorage.setItem(`noctis_reviews_${productId}`, JSON.stringify(updated));
      } catch {
        // ignore
      }

      return updated;
    });
  };

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const totalWithMedia = reviews.filter((r) => r.media && r.media.length > 0).length;

  // Desglose de estrellas
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { star, count, percentage };
  });

  return (
    <section 
      id="opiniones"
      style={{
        marginTop: '40px',
        backgroundColor: '#0c0c0e',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '28px 24px',
        color: '#ffffff'
      }}
    >
      {/* Encabezado Principal de Opiniones */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {isSpanish ? 'Opiniones y Reseñas de Clientes' : 'Customer Reviews & Looks'}
            </h3>
            <span style={{ backgroundColor: 'rgba(255, 85, 0, 0.15)', color: '#ff5500', border: '1px solid rgba(255, 85, 0, 0.4)', borderRadius: '12px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 800 }}>
              {reviews.length} {isSpanish ? 'verificadas' : 'verified'}
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#a1a1aa' }}>
            {isSpanish ? `Experiencias reales de compradores de ${productName}` : `Real buyer experiences with ${productName}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="btn-curtain-subtle"
          style={{
            borderRadius: '6px',
            padding: '10px 18px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {showForm ? (
            <>
              <X size={14} />
              <span>{isSpanish ? 'Cancelar' : 'Cancel'}</span>
            </>
          ) : (
            <>
              <MessageSquare size={14} />
              <span>{isSpanish ? 'Deja tu opinión' : 'Leave your review'}</span>
            </>
          )}
        </button>
      </div>

      {/* Resumen de Calificación y Estadísticas (Solo si hay opiniones reales) */}
      {reviews.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', backgroundColor: '#141418', borderRadius: '8px', padding: '20px', marginBottom: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          {/* Promedio General */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid rgba(255, 255, 255, 0.08)', paddingRight: '16px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: '#ffffff' }}>
              {averageRating}
            </span>
            <div style={{ display: 'flex', gap: '4px', margin: '8px 0', color: '#facc15' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  size={18} 
                  fill={parseFloat(averageRating) >= s ? '#facc15' : 'none'} 
                  color="#facc15" 
                />
              ))}
            </div>
            <span style={{ fontSize: '0.74rem', color: '#a1a1aa' }}>
              {isSpanish ? `Basado en ${reviews.length} valoración(es) real(es)` : `Based on ${reviews.length} real rating(s)`}
            </span>
          </div>

          {/* Barras de Desglose por Estrellas */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
            {ratingCounts.map(({ star, count, percentage }) => (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem' }}>
                <span style={{ width: '24px', color: '#a1a1aa', fontWeight: 700 }}>{star}★</span>
                <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      backgroundColor: '#ffffff', 
                      borderRadius: '3px',
                      transition: 'width 0.4s ease'
                    }} 
                  />
                </div>
                <span style={{ width: '30px', textAlign: 'right', color: '#71717a', fontSize: '0.7rem' }}>
                  {count}
                </span>
              </div>
            ))}
          </div>

          {/* Puntos destacados reales */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', fontSize: '0.78rem', borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d4d4d8' }}>
              <span>{isSpanish ? 'Opiniones Totales:' : 'Total Reviews:'}</span>
              <strong style={{ color: '#ffffff' }}>{reviews.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d4d4d8' }}>
              <span>{isSpanish ? 'Fotos de Compradores:' : 'Customer Photos:'}</span>
              <strong style={{ color: '#ffffff' }}>{totalWithMedia}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d4d4d8' }}>
              <span>{isSpanish ? 'Verificación:' : 'Verification:'}</span>
              <strong style={{ color: '#22c55e' }}>100% {isSpanish ? 'Compradores Reales' : 'Real Buyers'}</strong>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '36px 20px',
          backgroundColor: '#141418',
          border: '1px dashed rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <MessageSquare size={32} color="#71717a" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
            {isSpanish ? 'Sin opiniones aún para esta prenda' : 'No reviews yet for this item'}
          </h4>
          <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#a1a1aa', maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto' }}>
            {isSpanish 
              ? 'Las opiniones y fotos se publican únicamente cuando compradores reales comparten su experiencia con este producto.'
              : 'Reviews and looks appear only when real buyers share their experience.'}
          </p>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="btn-curtain-subtle"
              style={{
                borderRadius: '6px',
                padding: '10px 20px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              {isSpanish ? 'Sé el primero en calificar y dejar tu opinión' : 'Be the first to review this item'}
            </button>
          )}
        </div>
      )}

      {/* Galería de Fotos y Videos de Clientes */}
      {totalWithMedia > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Camera size={16} color="#ff5500" />
            <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isSpanish ? 'Fotos y Videos de Compradores Reales' : 'Real Buyer Photo & Video Gallery'}
            </h4>
          </div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
            {reviews
              .flatMap((r) => r.media || [])
              .map((med, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMediaLightbox(med)}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: '#18181b',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {med.type === 'video' ? (
                    <>
                      <video src={med.url} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={20} color="#ffffff" fill="#ffffff" />
                      </div>
                    </>
                  ) : (
                    <img src={med.url} alt={`Buyer media ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Formulario para Crear / Publicar Reseña */}
      {showForm && (
        <form 
          onSubmit={handleSaveReview}
          style={{
            backgroundColor: '#141418',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={18} color="#ffffff" />
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900 }}>
              {isSpanish ? 'Comparte tu look y experiencia con NOCTIS' : 'Share your NOCTIS look and review'}
            </h4>
          </div>

          {/* Selector Interactivo de Estrellas */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
              {isSpanish ? 'Tu Calificación:' : 'Your Rating:'}
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setFormHoverRating(star)}
                  onMouseLeave={() => setFormHoverRating(0)}
                  onClick={() => setFormRating(star)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '2px',
                    cursor: 'pointer',
                    fontSize: '1.6rem',
                    color: (formHoverRating || formRating) >= star ? '#facc15' : '#4b5563',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  ★
                </button>
              ))}
              <span style={{ marginLeft: '8px', alignSelf: 'center', fontSize: '0.8rem', fontWeight: 800, color: '#facc15' }}>
                {formRating === 5 ? '★★★★★ (Excelente)' : `${formRating} estrellas`}
              </span>
            </div>
          </div>

          {/* Campos de Nombre y Ciudad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '4px' }}>
                {isSpanish ? 'Tu Nombre o Alias *' : 'Your Name or Alias *'}
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={isSpanish ? 'Ej: Felipe R.' : 'e.g., Alex M.'}
                style={{
                  width: '100%',
                  backgroundColor: '#0c0c0e',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '4px' }}>
                {isSpanish ? 'Ciudad / Localidad' : 'City / Location'}
              </label>
              <input
                type="text"
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder={isSpanish ? 'Ej: Bogotá, Chapinero' : 'e.g., Bogotá'}
                style={{
                  width: '100%',
                  backgroundColor: '#0c0c0e',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Comentario de la Prenda */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '4px' }}>
              {isSpanish ? '¿Qué te pareció el fit, corte y calidad? *' : 'What did you think of the fit and quality? *'}
            </label>
            <textarea
              required
              rows={3}
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder={isSpanish ? 'Escribe aquí tu reseña sobre la prenda...' : 'Write your review here...'}
              style={{
                width: '100%',
                backgroundColor: '#0c0c0e',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                padding: '12px 14px',
                color: '#ffffff',
                fontSize: '0.82rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Subida de Fotos y Videos */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '6px' }}>
              {isSpanish ? 'Adjuntar Fotos o Videos de tu Look (Opcional)' : 'Attach Photos or Videos (Optional)'}
            </label>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '18px',
                textAlign: 'center',
                backgroundColor: '#0c0c0e',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff5500'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            >
              <UploadCloud size={24} color="#ff5500" style={{ margin: '0 auto 6px' }} />
              <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                {isSpanish ? 'Haz clic para subir Fotos (JPG, PNG) o Videos (MP4)' : 'Click to upload Photos or Videos'}
              </p>
              <span style={{ fontSize: '0.7rem', color: '#71717a' }}>
                {isSpanish ? 'Máximo 25MB por archivo' : 'Up to 25MB per file'}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* Previsualización de Fotos / Videos subidos */}
            {formMedia.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                {formMedia.map((med, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ff5500' }}>
                    {med.type === 'video' ? (
                      <video src={med.url} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={med.url} alt={`Upload ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-curtain-dark"
            style={{
              borderRadius: '6px',
              padding: '12px 26px',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{isSpanish ? 'PUBLICAR OPINIÓN' : 'SUBMIT REVIEW'}</span>
          </button>

          {formSuccess && (
            <p style={{ marginTop: '12px', color: '#22c55e', fontSize: '0.85rem', fontWeight: 800, textAlign: 'center' }}>
              {isSpanish ? '✓ ¡Gracias por tu opinión! Se ha publicado con éxito.' : '✓ Review submitted successfully!'}
            </p>
          )}
        </form>
      )}

      {/* Lista de Opiniones Publicadas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.map((rev) => (
          <article 
            key={rev.id}
            style={{
              backgroundColor: '#141418',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '18px 20px',
              transition: 'border-color 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>{rev.author}</strong>
                  {rev.verified && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      <CheckCircle2 size={11} />
                      {isSpanish ? 'Compra Verificada' : 'Verified Buyer'}
                    </span>
                  )}
                </div>
                {rev.city && (
                  <span style={{ fontSize: '0.72rem', color: '#71717a' }}>{rev.city} • {rev.date}</span>
                )}
              </div>

              {/* Estrellas */}
              <div style={{ display: 'flex', gap: '2px', color: '#facc15' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={14} 
                    fill={rev.rating >= s ? '#facc15' : 'none'} 
                    color="#facc15" 
                  />
                ))}
              </div>
            </div>

            {/* Texto de la Reseña */}
            <p style={{ margin: '8px 0 12px', fontSize: '0.84rem', color: '#d4d4d8', lineHeight: 1.55 }}>
              {rev.comment}
            </p>

            {/* Fotos y Videos de esta Reseña */}
            {rev.media && rev.media.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {rev.media.map((m, mIdx) => (
                  <button
                    key={mIdx}
                    type="button"
                    onClick={() => setActiveMediaLightbox(m)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: '#000000',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    {m.type === 'video' ? (
                      <>
                        <video src={m.url} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Play size={16} color="#ffffff" fill="#ffffff" />
                        </div>
                      </>
                    ) : (
                      <img src={m.url} alt={`Review photo ${mIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Botón de Utilidad / Likes (Toggleable) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.72rem', color: '#71717a' }}>
              <button
                type="button"
                onClick={() => handleLikeReview(rev.id)}
                style={{
                  background: likedReviews[rev.id] ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                  border: likedReviews[rev.id] ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  color: likedReviews[rev.id] ? '#22c55e' : '#a1a1aa',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  transition: 'all 0.18s ease'
                }}
                title={likedReviews[rev.id] ? (isSpanish ? 'Haz clic para desmarcar' : 'Click to unmark') : (isSpanish ? 'Marcar como útil' : 'Mark as helpful')}
              >
                <ThumbsUp size={12} fill={likedReviews[rev.id] ? '#22c55e' : 'none'} color={likedReviews[rev.id] ? '#22c55e' : '#a1a1aa'} />
                <span>{isSpanish ? 'Útil' : 'Helpful'} ({rev.likes || 0})</span>
              </button>
              <span>•</span>
              <span>NOCTIS URBANO Oficial</span>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Lightbox para Ampliar Fotos / Videos */}
      {activeMediaLightbox && (
        <div 
          onClick={() => setActiveMediaLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <button
              type="button"
              className="client-close-btn"
              onClick={() => setActiveMediaLightbox(null)}
              style={{
                position: 'absolute',
                top: '-44px',
                right: '0',
                zIndex: 30
              }}
              aria-label="Cerrar vista ampliada"
              title="Cerrar"
            >
              <X size={18} />
            </button>
            {activeMediaLightbox.type === 'video' ? (
              <video 
                src={activeMediaLightbox.url} 
                controls 
                autoPlay 
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} 
              />
            ) : (
              <img 
                src={activeMediaLightbox.url} 
                alt="Enlarged review media" 
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} 
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
