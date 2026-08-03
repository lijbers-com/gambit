/**
 * Retail product thumbnails used in every "Retail products" column.
 *
 * One list, so the campaign tables, the product tables on the campaign detail
 * and the proposition wizard all show the same shelf. Files live in
 * /public/products.
 */
export const productImages = [
  '/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg',
  '/products/AHI_58595668654137515274614244637957324d34372d51.jpeg',
  '/products/AHI_656b70553646657151435343764372315175694b3941.jpeg',
];

/** Stable thumbnail for a product row — same index, same picture every render. */
export const productImageFor = (index: number) => productImages[index % productImages.length];
