import { queryDb } from '../db';
import { 
  Coupon, 
  StoreSettings, 
  ProductGuideConfig, 
  DEFAULT_PRODUCT_GUIDES, 
  getStoreSettings, 
  updateStoreSettings, 
  getCoupons, 
  saveCoupon, 
  deleteCoupon 
} from './settingsStore';

declare global {
  var __noctisDbInitialized: boolean | undefined;
}

const DEFAULT_SETTINGS_DB: StoreSettings = {
  announcementText: 'ENVIOS A TODA COLOMBIA — STREETWEAR PREMIUM HECHO EN BOGOTA',
  announcementActive: true,
  freeShippingActive: true,
  freeShippingThreshold: 200000,
  standardShippingCost: 15000,
  freeGiftActive: false,
  freeGiftThreshold: 250000,
  freeGiftName: 'Llavero Táctico & Sticker Pack NOCTIS',
  freeGiftDescription: 'Obsequio exclusivo de la marca incluido en tu paquete por compras superiores a $250.000 COP.',
  freeGiftImage: '/assets/products/umbrella/noctis_umbrella.jpg',
  productGuide: DEFAULT_PRODUCT_GUIDES.sizes,
  supportEmail: 'contacto@noctisurbano.com',
  supportPhone: '+57 313 585 9810',
  whatsappNumber: '573135859810',
  whatsappMessage: 'Hola NOCTIS URBANO, quiero información sobre las prendas y envíos.',
  whatsappTooltip: '¿Dudas con tu talla o envío? Chatea con nosotros.',
  contactHeading: 'Habla con la marca.',
  contactSubtitle: 'Envíos locales en Bogotá el mismo día y despachos nacionales. Respondemos por WhatsApp e Instagram.',
  contactPhoneDisplay: '313 585 9810',
  contactEmail: 'noirurbano1@gmail.com',
  contactInstagram: '@noir_urbano',
  contactTiktok: '@noir.urbano'
};

/**
 * Garantiza de forma idempotente que las tablas y columnas existan en PostgreSQL
 */
export async function ensureDbTables() {
  if (global.__noctisDbInitialized) return;

  try {
    // 1. Tabla store_settings
    await queryDb(`
      CREATE TABLE IF NOT EXISTS store_settings (
        id INT PRIMARY KEY DEFAULT 1,
        announcement_text TEXT NOT NULL DEFAULT 'ENVIOS A TODA COLOMBIA',
        announcement_active BOOLEAN DEFAULT TRUE,
        free_shipping_active BOOLEAN DEFAULT TRUE,
        free_shipping_threshold NUMERIC(12, 2) DEFAULT 200000,
        standard_shipping_cost NUMERIC(12, 2) DEFAULT 15000,
        free_gift_active BOOLEAN DEFAULT FALSE,
        free_gift_threshold NUMERIC(12, 2) DEFAULT 250000,
        free_gift_name TEXT DEFAULT 'Llavero Táctico & Sticker Pack NOCTIS',
        free_gift_description TEXT DEFAULT 'Obsequio exclusivo',
        free_gift_image TEXT DEFAULT '',
        product_guide JSONB DEFAULT '{}'::jsonb,
        support_email VARCHAR(255) DEFAULT 'contacto@noctisurbano.com',
        support_phone VARCHAR(50) DEFAULT '+57 313 585 9810',
        whatsapp_number VARCHAR(50) DEFAULT '573135859810',
        whatsapp_message TEXT DEFAULT 'Hola NOCTIS URBANO, quiero información sobre las prendas y envíos.',
        whatsapp_tooltip TEXT DEFAULT '¿Dudas con tu talla o envío? Chatea con nosotros.',
        contact_heading VARCHAR(255) DEFAULT 'Habla con la marca.',
        contact_subtitle TEXT DEFAULT 'Envíos locales en Bogotá el mismo día y despachos nacionales.',
        contact_phone_display VARCHAR(50) DEFAULT '313 585 9810',
        contact_email VARCHAR(255) DEFAULT 'noirurbano1@gmail.com',
        contact_instagram VARCHAR(100) DEFAULT '@noir_urbano',
        contact_tiktok VARCHAR(100) DEFAULT '@noir.urbano',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT check_single_row CHECK (id = 1)
      );
    `);

    // Migraciones de columnas adicionales por si la tabla existía previamente
    const columnsToEnsure = [
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS free_shipping_active BOOLEAN DEFAULT TRUE;',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS free_gift_active BOOLEAN DEFAULT FALSE;',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS free_gift_threshold NUMERIC(12, 2) DEFAULT 250000;',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS free_gift_name TEXT DEFAULT \'Llavero Táctico & Sticker Pack NOCTIS\';',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS free_gift_description TEXT DEFAULT \'Obsequio exclusivo\';',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS free_gift_image TEXT DEFAULT \'\';',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS product_guide JSONB DEFAULT \'{}\'::jsonb;',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(50) DEFAULT \'573135859810\';',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS whatsapp_message TEXT DEFAULT \'Hola NOCTIS URBANO, quiero información sobre las prendas y envíos.\';',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS whatsapp_tooltip TEXT DEFAULT \'¿Dudas con tu talla o envío? Chatea con nosotros.\';',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS contact_heading VARCHAR(255) DEFAULT \'Habla con la marca.\';',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS contact_subtitle TEXT DEFAULT \'Envíos locales en Bogotá el mismo día y despachos nacionales.\';',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS contact_phone_display VARCHAR(50) DEFAULT \'313 585 9810\';',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255) DEFAULT \'noirurbano1@gmail.com\';',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS contact_instagram VARCHAR(100) DEFAULT \'@noir_urbano\';',
      'ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS contact_tiktok VARCHAR(100) DEFAULT \'@noir.urbano\';',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;'
    ];

    for (const sql of columnsToEnsure) {
      try { await queryDb(sql); } catch {}
    }

    // 2. Tabla coupons
    await queryDb(`
      CREATE TABLE IF NOT EXISTS coupons (
        id VARCHAR(100) PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage',
        value NUMERIC(10, 2) NOT NULL,
        min_purchase NUMERIC(12, 2) DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        expires_at VARCHAR(50),
        usage_count INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    global.__noctisDbInitialized = true;
  } catch (err: any) {
    console.warn('⚠️ [Settings DB Init Fallback]:', err.message);
  }
}

/**
 * Obtener cupones desde PostgreSQL (con fallback a memoria)
 */
export async function getCouponsAsync(): Promise<Coupon[]> {
  await ensureDbTables();
  try {
    const rows = await queryDb<any>('SELECT * FROM coupons ORDER BY created_at DESC');
    if (rows && rows.length > 0) {
      const coupons: Coupon[] = rows.map(r => ({
        id: r.id,
        code: r.code,
        discountType: r.discount_type || 'percentage',
        value: Number(r.value) || 0,
        minPurchase: Number(r.min_purchase) || 0,
        active: r.active !== false,
        expiresAt: r.expires_at || '',
        usageCount: Number(r.usage_count) || 0
      }));
      return coupons;
    }
  } catch (err: any) {
    console.warn('⚠️ [PostgreSQL Coupons Read Error]:', err.message);
  }
  return getCoupons();
}

/**
 * Guardar cupón en PostgreSQL (UPSERT)
 */
export async function saveCouponAsync(coupon: Partial<Coupon>): Promise<Coupon> {
  await ensureDbTables();
  const id = coupon.id || `coup-${Date.now().toString(36)}`;
  const code = (coupon.code || 'CODE').toUpperCase().trim();
  const discountType = coupon.discountType || 'percentage';
  const value = Number(coupon.value) || 0;
  const minPurchase = Number(coupon.minPurchase) || 0;
  const active = coupon.active !== undefined ? coupon.active : true;
  const expiresAt = coupon.expiresAt || '';
  const usageCount = Number(coupon.usageCount) || 0;

  const formatted: Coupon = { id, code, discountType, value, minPurchase, active, expiresAt, usageCount };

  try {
    await queryDb(`
      INSERT INTO coupons (id, code, discount_type, value, min_purchase, active, expires_at, usage_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        code = EXCLUDED.code,
        discount_type = EXCLUDED.discount_type,
        value = EXCLUDED.value,
        min_purchase = EXCLUDED.min_purchase,
        active = EXCLUDED.active,
        expires_at = EXCLUDED.expires_at,
        usage_count = EXCLUDED.usage_count;
    `, [id, code, discountType, value, minPurchase, active, expiresAt, usageCount]);
  } catch (err: any) {
    console.warn('⚠️ [PostgreSQL Coupon Save Error]:', err.message);
  }

  saveCoupon(formatted);
  return formatted;
}

/**
 * Eliminar cupón de PostgreSQL
 */
export async function deleteCouponAsync(id: string): Promise<boolean> {
  await ensureDbTables();
  try {
    await queryDb('DELETE FROM coupons WHERE id = $1', [id]);
  } catch (err: any) {
    console.warn('⚠️ [PostgreSQL Coupon Delete Error]:', err.message);
  }
  return deleteCoupon(id);
}

/**
 * Obtener configuración de la tienda desde PostgreSQL
 */
export async function getStoreSettingsAsync(): Promise<StoreSettings> {
  await ensureDbTables();
  try {
    const rows = await queryDb<any>('SELECT * FROM store_settings WHERE id = 1 LIMIT 1');
    if (rows && rows.length > 0) {
      const r = rows[0];
      const settings: StoreSettings = {
        announcementText: r.announcement_text ?? DEFAULT_SETTINGS_DB.announcementText,
        announcementActive: r.announcement_active !== false,
        freeShippingActive: r.free_shipping_active !== false,
        freeShippingThreshold: Number(r.free_shipping_threshold) || DEFAULT_SETTINGS_DB.freeShippingThreshold,
        standardShippingCost: Number(r.standard_shipping_cost) || DEFAULT_SETTINGS_DB.standardShippingCost,
        freeGiftActive: Boolean(r.free_gift_active),
        freeGiftThreshold: Number(r.free_gift_threshold) || DEFAULT_SETTINGS_DB.freeGiftThreshold,
        freeGiftName: r.free_gift_name || DEFAULT_SETTINGS_DB.freeGiftName,
        freeGiftDescription: r.free_gift_description || DEFAULT_SETTINGS_DB.freeGiftDescription,
        freeGiftImage: r.free_gift_image || DEFAULT_SETTINGS_DB.freeGiftImage,
        productGuide: (r.product_guide && Object.keys(r.product_guide).length > 0) ? r.product_guide : DEFAULT_PRODUCT_GUIDES.sizes,
        supportEmail: r.support_email || DEFAULT_SETTINGS_DB.supportEmail,
        supportPhone: r.support_phone || DEFAULT_SETTINGS_DB.supportPhone,
        whatsappNumber: r.whatsapp_number || DEFAULT_SETTINGS_DB.whatsappNumber,
        whatsappMessage: r.whatsapp_message || DEFAULT_SETTINGS_DB.whatsappMessage,
        whatsappTooltip: r.whatsapp_tooltip || DEFAULT_SETTINGS_DB.whatsappTooltip,
        contactHeading: r.contact_heading || DEFAULT_SETTINGS_DB.contactHeading,
        contactSubtitle: r.contact_subtitle || DEFAULT_SETTINGS_DB.contactSubtitle,
        contactPhoneDisplay: r.contact_phone_display || DEFAULT_SETTINGS_DB.contactPhoneDisplay,
        contactEmail: r.contact_email || DEFAULT_SETTINGS_DB.contactEmail,
        contactInstagram: r.contact_instagram || DEFAULT_SETTINGS_DB.contactInstagram,
        contactTiktok: r.contact_tiktok || DEFAULT_SETTINGS_DB.contactTiktok
      };
      updateStoreSettings(settings);
      return settings;
    } else {
      // Si la fila 1 no existe, insertamos los datos iniciales por defecto en PostgreSQL
      await queryDb(`
        INSERT INTO store_settings (
          id, announcement_text, announcement_active, free_shipping_active, free_shipping_threshold,
          standard_shipping_cost, free_gift_active, free_gift_threshold, free_gift_name,
          free_gift_description, free_gift_image, product_guide, support_email, support_phone,
          whatsapp_number, whatsapp_message, whatsapp_tooltip, contact_heading, contact_subtitle,
          contact_phone_display, contact_email, contact_instagram, contact_tiktok, updated_at
        ) VALUES (
          1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW()
        ) ON CONFLICT (id) DO NOTHING;
      `, [
        DEFAULT_SETTINGS_DB.announcementText,
        DEFAULT_SETTINGS_DB.announcementActive,
        DEFAULT_SETTINGS_DB.freeShippingActive,
        DEFAULT_SETTINGS_DB.freeShippingThreshold,
        DEFAULT_SETTINGS_DB.standardShippingCost,
        DEFAULT_SETTINGS_DB.freeGiftActive,
        DEFAULT_SETTINGS_DB.freeGiftThreshold,
        DEFAULT_SETTINGS_DB.freeGiftName,
        DEFAULT_SETTINGS_DB.freeGiftDescription,
        DEFAULT_SETTINGS_DB.freeGiftImage,
        JSON.stringify(DEFAULT_SETTINGS_DB.productGuide || DEFAULT_PRODUCT_GUIDES.sizes),
        DEFAULT_SETTINGS_DB.supportEmail,
        DEFAULT_SETTINGS_DB.supportPhone,
        DEFAULT_SETTINGS_DB.whatsappNumber,
        DEFAULT_SETTINGS_DB.whatsappMessage,
        DEFAULT_SETTINGS_DB.whatsappTooltip,
        DEFAULT_SETTINGS_DB.contactHeading,
        DEFAULT_SETTINGS_DB.contactSubtitle,
        DEFAULT_SETTINGS_DB.contactPhoneDisplay,
        DEFAULT_SETTINGS_DB.contactEmail,
        DEFAULT_SETTINGS_DB.contactInstagram,
        DEFAULT_SETTINGS_DB.contactTiktok
      ]);
    }
  } catch (err: any) {
    console.warn('⚠️ [PostgreSQL Store Settings Read Error]:', err.message);
  }

  return getStoreSettings();
}

/**
 * Actualizar y persistir configuración de la tienda en PostgreSQL (UPSERT)
 */
export async function updateStoreSettingsAsync(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  await ensureDbTables();
  const current = await getStoreSettingsAsync();
  const merged: StoreSettings = {
    ...current,
    ...settings,
    productGuide: settings.productGuide ? { ...(current.productGuide || DEFAULT_PRODUCT_GUIDES.sizes), ...settings.productGuide } : current.productGuide
  };

  try {
    await queryDb(`
      INSERT INTO store_settings (
        id, announcement_text, announcement_active, free_shipping_active, free_shipping_threshold,
        standard_shipping_cost, free_gift_active, free_gift_threshold, free_gift_name,
        free_gift_description, free_gift_image, product_guide, support_email, support_phone,
        whatsapp_number, whatsapp_message, whatsapp_tooltip, contact_heading, contact_subtitle,
        contact_phone_display, contact_email, contact_instagram, contact_tiktok, updated_at
      ) VALUES (
        1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        announcement_text = EXCLUDED.announcement_text,
        announcement_active = EXCLUDED.announcement_active,
        free_shipping_active = EXCLUDED.free_shipping_active,
        free_shipping_threshold = EXCLUDED.free_shipping_threshold,
        standard_shipping_cost = EXCLUDED.standard_shipping_cost,
        free_gift_active = EXCLUDED.free_gift_active,
        free_gift_threshold = EXCLUDED.free_gift_threshold,
        free_gift_name = EXCLUDED.free_gift_name,
        free_gift_description = EXCLUDED.free_gift_description,
        free_gift_image = EXCLUDED.free_gift_image,
        product_guide = EXCLUDED.product_guide,
        support_email = EXCLUDED.support_email,
        support_phone = EXCLUDED.support_phone,
        whatsapp_number = EXCLUDED.whatsapp_number,
        whatsapp_message = EXCLUDED.whatsapp_message,
        whatsapp_tooltip = EXCLUDED.whatsapp_tooltip,
        contact_heading = EXCLUDED.contact_heading,
        contact_subtitle = EXCLUDED.contact_subtitle,
        contact_phone_display = EXCLUDED.contact_phone_display,
        contact_email = EXCLUDED.contact_email,
        contact_instagram = EXCLUDED.contact_instagram,
        contact_tiktok = EXCLUDED.contact_tiktok,
        updated_at = NOW();
    `, [
      merged.announcementText,
      merged.announcementActive,
      merged.freeShippingActive,
      merged.freeShippingThreshold,
      merged.standardShippingCost,
      merged.freeGiftActive,
      merged.freeGiftThreshold,
      merged.freeGiftName,
      merged.freeGiftDescription,
      merged.freeGiftImage,
      JSON.stringify(merged.productGuide || DEFAULT_PRODUCT_GUIDES.sizes),
      merged.supportEmail,
      merged.supportPhone,
      merged.whatsappNumber,
      merged.whatsappMessage,
      merged.whatsappTooltip,
      merged.contactHeading,
      merged.contactSubtitle,
      merged.contactPhoneDisplay,
      merged.contactEmail,
      merged.contactInstagram,
      merged.contactTiktok
    ]);
  } catch (err: any) {
    console.warn('⚠️ [PostgreSQL Store Settings Update Error]:', err.message);
  }

  updateStoreSettings(merged);
  return merged;
}
