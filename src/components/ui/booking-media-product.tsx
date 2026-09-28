'use client';

import * as React from 'react';
import { Tag } from 'lucide-react';
import { FormSection } from './form-section';
import { CreatePlacement } from './create-placement';
import { FieldIssue, useAvailabilityIssue } from './guaranteed-booking';
import {
  buyingTypeOf,
  formatPrice,
  positionsOf,
  productForBooking,
  updateBooking,
  useDb,
  type Booking,
  type EngineId,
  type MediaProduct,
  type AvailabilityCheckItem,
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
 * auction booking the ones sold at auction with their floor price. Its
 * positions can still be trimmed in the modal. Presentational: the booking
 * page binds it to the stored booking, the wizard to its draft — so both
 * always show the same block.
 */
export const RetailMediaProductPicker: React.FC<{
  engine: EngineId;
  type: 'guaranteed' | 'auction';
  productId?: string;
  onProductChange: (productId: string | undefined, positionIds: string[]) => void;
  positionIds: string[];
  onPositionsChange: (positionIds: string[]) => void;
  issue?: AvailabilityCheckItem;
  /** Off inside a wizard's step card, where the card is the border. */
  bordered?: boolean;
  className?: string;
}> = ({ engine, type, productId, onProductChange, positionIds, onPositionsChange, issue, bordered = true, className }) => {
  const db = useDb();
  const offered = db.mediaProducts.filter((m) =>
    m.engine === engine && m.status !== 'archived' && (m.buyingModels ?? ['auction']).includes(type));
  const selectedId = productId && offered.some((m) => m.id === productId) ? productId : undefined;
  const positions = selectedId ? positionsOf(db, selectedId) : [];
  return (
    <FormSection bordered={bordered} title="Retail media product" className={className}>
      <div className="space-y-3">
        <CreatePlacement
          productLabel="Find retail media product"
          mediaProducts={offered.map((m) => ({ value: m.id, label: m.name, description: `${productPriceLine(m, type)}${m.description ? ` · ${m.description}` : ''}` }))}
          mediaProduct={selectedId ? [selectedId] : []}
          onMediaProductChange={(v) => onProductChange(v[0], v[0] ? positionsOf(db, v[0]).map((p) => p.id) : [])}
          positions={positions.map((p) => ({ value: p.id, label: p.name, description: p.format, format: p.format }))}
          positionsValue={positionIds.filter((id) => positions.some((p) => p.id === id))}
          onPositionsChange={onPositionsChange}
          selectedMeta={(id) => {
            const m = offered.find((x) => x.id === id);
            // The same line as the positions count below it: an icon and
            // a figure, small and muted.
            return m ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5 shrink-0" />
                <span className="tabular-nums">{productPriceLine(m, type)}</span>
              </div>
            ) : null;
          }}
        />
        <FieldIssue item={issue} />
        {offered.length === 0 && (
          <p className="text-sm text-muted-foreground">No retail media product is sold {type === 'guaranteed' ? 'guaranteed' : 'at auction'} on this proposition yet. Add one under Media products.</p>
        )}
      </div>
    </FormSection>
  );
};

/** The retail media product on the booking page, bound to the booking. */
export const BookingMediaProduct: React.FC<{ booking: Booking | undefined; className?: string }> = ({ booking, className }) => {
  const db = useDb();
  const issueFor = useAvailabilityIssue(booking);
  if (!booking) return null;
  const campaign = db.campaigns.find((c) => c.id === booking.campaignId);
  if (!campaign) return null;
  return (
    <RetailMediaProductPicker
      engine={campaign.engine}
      type={buyingTypeOf(db, booking)}
      productId={productForBooking(db, booking)?.id}
      onProductChange={(id, positionIds) => updateBooking(booking.id, { mediaProductId: id, positionIds })}
      positionIds={booking.positionIds}
      onPositionsChange={(ids) => updateBooking(booking.id, { positionIds: ids })}
      issue={issueFor('positions') ?? issueFor('product')}
      className={className}
    />
  );
};
