'use client';

import * as React from 'react';
import { Tag } from 'lucide-react';
import { FormSection } from './form-section';
import { CreatePlacement } from './create-placement';
import {
  buyingTypeOf,
  formatPrice,
  positionsOf,
  productForBooking,
  updateBooking,
  useDb,
  type Booking,
  type MediaProduct,
} from '@/lib/db';

/** "€9 CPM", "€32 per store", "€0.60 CPC". */
const unitLabel = (basis: NonNullable<MediaProduct['pricingBasis']>) =>
  basis === 'cpm' ? 'CPM' : basis === 'cpc' ? 'CPC' : basis === 'per-store' ? 'per store' : basis === 'per-day' ? 'per day' : 'flat';

/** What a product costs the way this booking buys it: the list price when
 *  guaranteed, the floor when bought at auction (a CPC, like the bid). */
export function productPriceLine(product: MediaProduct, type: 'guaranteed' | 'auction'): string {
  if (type === 'auction') {
    return product.floorPrice !== undefined ? `Floor price ${formatPrice(product.floorPrice, 'cpc')} CPC` : 'No floor price set';
  }
  return product.listPrice !== undefined && product.pricingBasis
    ? `List price ${formatPrice(product.listPrice, product.pricingBasis)} ${unitLabel(product.pricingBasis)}`
    : 'No list price set';
}

/**
 * Retail media product — where a booking runs, and what it starts from.
 *
 * The user picks one of the proposition's retail media products (Media
 * products in Edge), offered for the way the campaign buys: a guaranteed
 * booking sees the products sold guaranteed with their list price, an
 * auction booking the ones sold at auction with their floor price. The
 * choice is stored on the booking, so the billable amount (list price ×
 * goal) and the lowest accepted bid (the floor) follow from it. Its
 * positions can still be trimmed in the modal.
 */
export const BookingMediaProduct: React.FC<{ booking: Booking | undefined; className?: string }> = ({ booking, className }) => {
  const db = useDb();
  if (!booking) return null;
  const campaign = db.campaigns.find((c) => c.id === booking.campaignId);
  if (!campaign) return null;
  const type = buyingTypeOf(db, booking);
  const offered = db.mediaProducts.filter((m) =>
    m.engine === campaign.engine && m.status !== 'archived' && (m.buyingModels ?? ['auction']).includes(type));
  const selected = productForBooking(db, booking);
  const selectedId = selected && offered.some((m) => m.id === selected.id) ? selected.id : undefined;
  const positions = selectedId ? positionsOf(db, selectedId) : [];

  return (
    <FormSection bordered title="Retail media product" className={className}>
      <div className="space-y-3">
        <CreatePlacement
          productLabel="Find retail media product"
          mediaProducts={offered.map((m) => ({ value: m.id, label: m.name, description: `${productPriceLine(m, type)}${m.description ? ` · ${m.description}` : ''}` }))}
          mediaProduct={selectedId ? [selectedId] : []}
          onMediaProductChange={(v) => updateBooking(booking.id, { mediaProductId: v[0], positionIds: v[0] ? positionsOf(db, v[0]).map((p) => p.id) : [] })}
          positions={positions.map((p) => ({ value: p.id, label: p.name, description: p.format, format: p.format }))}
          positionsValue={booking.positionIds.filter((id) => positions.some((p) => p.id === id))}
          onPositionsChange={(ids) => updateBooking(booking.id, { positionIds: ids })}
          selectedMeta={(id) => {
            const m = offered.find((x) => x.id === id);
            return m ? (
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="tabular-nums">{productPriceLine(m, type)}</span>
                <span className="font-normal text-muted-foreground">{type === 'guaranteed' ? '· the base of the billable amount' : '· the lowest bid accepted'}</span>
              </div>
            ) : null;
          }}
        />
        {offered.length === 0 && (
          <p className="text-sm text-muted-foreground">No retail media product is sold {type === 'guaranteed' ? 'guaranteed' : 'at auction'} on this proposition yet. Add one under Media products.</p>
        )}
      </div>
    </FormSection>
  );
};
