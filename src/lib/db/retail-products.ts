import type { Advertiser, Brand, DbData, RetailProduct } from './types';
import { productImageFor, productImages } from '../product-images';

/**
 * Retail products hang off brands, and brands off organisations. Every flow
 * picks products from the brands in play — but each flow keeps its brand
 * state in its own words (a db id, a slug, a label), so matching is by name:
 * "br-coca-cola", "coca-cola" and "Coca-Cola" are the same brand. A key that
 * names an organisation instead ("unilever", "nestle") opens all its brands.
 */

const norm = (s: string) => s.toLowerCase().replace(/^br-|^adv-/, '').replace(/[^a-z0-9]/g, '');

const brandMatches = (brand: Brand, key: string) => {
  const k = norm(key);
  if (!k) return false;
  const id = norm(brand.id);
  const name = norm(brand.name);
  return id === k || name === k || (k.length >= 4 && (name.startsWith(k) || k.startsWith(name)));
};

const advertiserMatches = (adv: Advertiser, key: string) => {
  const k = norm(key);
  if (!k) return false;
  const id = norm(adv.id);
  const name = norm(adv.name);
  return id === k || name === k || (k.length >= 4 && (name.includes(k) || id.includes(k)));
};

export function brandsFor(db: DbData, keys: string[]): Brand[] {
  const out: Brand[] = [];
  for (const key of keys) {
    for (const adv of db.advertisers) {
      for (const b of adv.brands) if (brandMatches(b, key) && !out.includes(b)) out.push(b);
    }
  }
  if (out.length === 0) {
    for (const key of keys) {
      for (const adv of db.advertisers) if (advertiserMatches(adv, key)) for (const b of adv.brands) if (!out.includes(b)) out.push(b);
    }
  }
  return out;
}

export function advertiserFor(db: DbData, key: string): Advertiser | undefined {
  return db.advertisers.find((a) => advertiserMatches(a, key));
}

/** The products of these brands; every product when no brand matches. */
export function productsForBrands(db: DbData, keys: string[]): RetailProduct[] {
  const brands = brandsFor(db, keys);
  if (brands.length === 0) return db.retailProducts;
  const ids = new Set(brands.map((b) => b.id));
  return db.retailProducts.filter((p) => ids.has(p.brandId));
}

/**
 * The products of every brand of an organisation. A key that names a brand
 * instead (the booking forms say "coca-cola" where they mean the organisation
 * behind it) opens that brand's organisation; an unknown key opens the whole shelf.
 */
export function productsForAdvertiser(db: DbData, key: string): RetailProduct[] {
  // A key that names a brand means the organisation behind that brand.
  const adv = advertiserFor(db, key) ?? db.advertisers.find((a) => a.brands.some((b) => brandsFor(db, [key]).includes(b)));
  if (!adv) return db.retailProducts;
  const ids = new Set(adv.brands.map((b) => b.id));
  return db.retailProducts.filter((p) => ids.has(p.brandId));
}

export function brandOfProduct(db: DbData, product: Pick<RetailProduct, 'brandId'>): { brand?: Brand; advertiser?: Advertiser } {
  for (const adv of db.advertisers) {
    const brand = adv.brands.find((b) => b.id === product.brandId);
    if (brand) return { brand, advertiser: adv };
  }
  return {};
}

/** Retail products as filter options — every retail product filter shows the
 *  packshot, the name and the pack size. */
export function retailProductOptions(db: DbData, products: RetailProduct[] = db.retailProducts) {
  return products.map((p) => ({ label: p.name, value: p.id, description: p.packSize ?? p.category, image: packshotOf(db, p) }));
}

/** A product's packshot from the one shared list every retail products
 *  column uses (lib/product-images) — a stored path that is not on it (an
 *  older saved copy) falls back to the product's place in that list. */
export function packshotOf(db: DbData, product: RetailProduct): string {
  if (productImages.includes(product.image)) return product.image;
  return productImageFor(Math.max(0, db.retailProducts.findIndex((r) => r.id === product.id)));
}

/** Adds the packshot to options that name a retail product by id or name. */
export function withProductImages<T extends { label: string; value: string }>(db: DbData, options: T[]): (T & { image?: string })[] {
  return options.map((o) => {
    const p = db.retailProducts.find((r) => r.id === o.value || r.name === o.value || r.name === o.label);
    return p ? { ...o, image: packshotOf(db, p) } : o;
  });
}
