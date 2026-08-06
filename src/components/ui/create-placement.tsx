'use client';

import * as React from 'react';
import { LayoutDashboard, Pencil } from 'lucide-react';
import { SearchSelectList, type SearchSelectOption } from './search-select-list';
import { Button } from './button';
import { Checkbox } from './checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

/**
 * Create placement — the one way a booking picks where it runs.
 *
 * The user chooses a media product (a channel on display and digital
 * in-store, a platform offsite) and gets everything in it: the selected card
 * lists the ad positions it contains, and a modal — the same pattern as the
 * store-list targeting — lets them include or exclude positions from there.
 * Selection first, trimming second, so the default is always a complete,
 * bookable placement.
 */
export interface CreatePlacementProps {
  mediaProducts: SearchSelectOption[];
  /** All ad positions of the chosen media product; empty until one is picked. */
  positions: SearchSelectOption[];
  mediaProduct: string[];
  onMediaProductChange: (value: string[]) => void;
  positionsValue: string[];
  onPositionsChange: (value: string[]) => void;
  productLabel?: string;
  /** What this proposition calls the things inside ("Ad positions", "Ad spaces"). */
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
  positionsLabel = 'Ad positions',
  className,
}) => {
  const [editing, setEditing] = React.useState(false);
  const [staged, setStaged] = React.useState<string[]>([]);

  // A newly chosen media product starts with everything it contains
  // included; the modal is where the user trims that down.
  React.useEffect(() => {
    if (mediaProduct.length && positions.length && positionsValue.length === 0) {
      onPositionsChange(positions.map((p) => p.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaProduct.join(','), positions.map((p) => p.value).join(',')]);

  const included = positions.filter((p) => positionsValue.includes(p.value));

  return (
    <div className={className ?? 'space-y-4 min-w-0'}>
      <SearchSelectList
        label={productLabel}
        placeholder="Search channel or media product…"
        icon={<LayoutDashboard className="w-4 h-4" />}
        options={mediaProducts}
        value={mediaProduct}
        onChange={onMediaProductChange}
        multiple={false}
        renderSelectedExtra={() => (
          <div className="mt-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              {included.length} of {positions.length} {positionsLabel.toLowerCase()} included
            </div>
            <ul className="space-y-1">
              {included.map((p) => (
                <li key={p.value} className="text-sm">{p.label}</li>
              ))}
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setStaged(positionsValue);
                setEditing(true);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit {positionsLabel.toLowerCase()}
            </Button>
          </div>
        )}
      />

      <Dialog open={editing} onOpenChange={(open) => !open && setEditing(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{positionsLabel}</DialogTitle>
            <DialogDescription>
              Choose which {positionsLabel.toLowerCase()} of this media product the booking includes.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {positions.map((p) => (
              <label
                key={p.value}
                className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted/40"
              >
                <Checkbox
                  checked={staged.includes(p.value)}
                  onCheckedChange={(on) =>
                    setStaged(on ? [...staged, p.value] : staged.filter((v) => v !== p.value))
                  }
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{p.label}</span>
                  {p.description && (
                    <span className="block text-xs text-muted-foreground">{p.description}</span>
                  )}
                </span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={() => { onPositionsChange(staged); setEditing(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
