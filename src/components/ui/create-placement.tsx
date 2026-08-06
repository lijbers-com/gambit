'use client';

import * as React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { SearchSelectList, type SearchSelectOption } from './search-select-list';

/**
 * Create placement — the one way a booking picks where it runs.
 *
 * Two steps, one block: choose the media product (channel, zone, package),
 * then the positions or slots it offers. Every proposition asks this same
 * question; only the option lists differ, so those are props and the block
 * is shared — a form must not hand-roll its own placement search.
 */
export interface CreatePlacementProps {
  mediaProducts: SearchSelectOption[];
  /** Positions of the chosen media product; empty until one is picked. */
  positions: SearchSelectOption[];
  mediaProduct: string[];
  onMediaProductChange: (value: string[]) => void;
  positionsValue: string[];
  onPositionsChange: (value: string[]) => void;
  productLabel?: string;
  positionsLabel?: string;
  className?: string;
}

export const CreatePlacement: React.FC<CreatePlacementProps> = ({
  mediaProducts,
  positions,
  mediaProduct,
  onMediaProductChange,
  positionsValue,
  onPositionsChange,
  productLabel = 'Find media product',
  positionsLabel = 'Positions / slots',
  className,
}) => (
  <div className={className ?? 'space-y-4 min-w-0'}>
    <SearchSelectList
      label={productLabel}
      placeholder="Search channel or media product…"
      icon={<LayoutDashboard className="w-4 h-4" />}
      options={mediaProducts}
      value={mediaProduct}
      onChange={onMediaProductChange}
      multiple={false}
    />
    <SearchSelectList
      label={positionsLabel}
      placeholder="Search position or slot…"
      icon={<LayoutDashboard className="w-4 h-4" />}
      options={positions}
      value={positionsValue}
      onChange={onPositionsChange}
      disabledHint={mediaProduct.length ? undefined : 'Select a media product first to see its positions.'}
    />
  </div>
);
