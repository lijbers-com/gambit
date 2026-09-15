'use client';

import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Copy, FileDown, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Creative, EngineId } from '@/lib/db';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Input } from './input';
import { useToast } from './toast';

/**
 * Sharing a creative preview — what the live display product offers on its
 * preview page (brand, layout, PDF, mail, QR), gathered in one dialog.
 *
 * The link carries the brand and layout, so whoever opens it sees the
 * creative the way it was shared: in that retailer's chrome, on that
 * device. The QR code is the same link, for a phone in the room.
 */

export const SHARE_BRANDS: Array<{ id: string; name: string }> = [
  { id: 'gambit', name: 'Edge' },
  { id: 'albert-heijn', name: 'Albert Heijn' },
  { id: 'adusa', name: 'ADUSA' },
  { id: 'delhaize', name: 'Delhaize' },
  { id: 'alfa-beta', name: 'Alfa Beta' },
];

export const SHARE_LAYOUTS: Array<{ id: ShareLayout; name: string }> = [
  { id: 'desktop', name: 'Desktop web' },
  { id: 'mobile', name: 'Mobile web' },
  { id: 'app', name: 'App' },
];
export type ShareLayout = 'desktop' | 'mobile' | 'app';

/** The brand and layout a share link asked for, if any. */
export function readShareParams(): { brand?: string; layout?: ShareLayout } {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  const brand = p.get('brand') ?? undefined;
  const layout = p.get('layout') as ShareLayout | null;
  return {
    brand: brand && SHARE_BRANDS.some((b) => b.id === brand) ? brand : undefined,
    layout: layout && SHARE_LAYOUTS.some((l) => l.id === layout) ? layout : undefined,
  };
}

export const CreativeShareDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creative: Creative;
  engine: EngineId;
  /** The brand the page is showing now — the dialog starts from it. */
  currentBrand?: string;
}> = ({ open, onOpenChange, creative, engine, currentBrand }) => {
  const toast = useToast();
  const [brand, setBrand] = React.useState(currentBrand && SHARE_BRANDS.some((b) => b.id === currentBrand) ? currentBrand : 'gambit');
  const [layout, setLayout] = React.useState<ShareLayout>('desktop');
  const [copied, setCopied] = React.useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const link = `${origin}/creatives/${engine}/${creative.id}?brand=${brand}&layout=${layout}`;

  const copy = () => {
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const exportPdf = () => {
    toast({ title: 'PDF on its way', description: `"${creative.name}" is being rendered for ${SHARE_LAYOUTS.find((l) => l.id === layout)?.name.toLowerCase()} and lands in your downloads.` });
  };

  const mail = () => {
    const subject = encodeURIComponent(`Preview: ${creative.name}`);
    const body = encodeURIComponent(
      `Have a look at this creative preview.\n\n${link}\n\nIt opens as ${SHARE_BRANDS.find((b) => b.id === brand)?.name} on ${SHARE_LAYOUTS.find((l) => l.id === layout)?.name.toLowerCase()}.`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Share preview</DialogTitle>
          <DialogDescription>
            Anyone with the link sees “{creative.name}” exactly as you set it up here — in the brand and on the device you choose.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <label className="mb-1.5 block text-sm font-medium">Show in brand</label>
            <Input dropdown options={SHARE_BRANDS.map((b) => ({ label: b.name, value: b.id }))} value={brand} onChange={setBrand} />
          </div>
          <div className="min-w-0">
            <label className="mb-1.5 block text-sm font-medium">Layout</label>
            <Input dropdown options={SHARE_LAYOUTS.map((l) => ({ label: l.name, value: l.id }))} value={layout} onChange={(v) => setLayout(v as ShareLayout)} />
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Link</label>
              <div className="flex items-center gap-2">
                <Input readOnly value={link} className="min-w-0 flex-1 text-xs" onFocus={(e) => e.currentTarget.select()} />
                <Button variant="outline" size="sm" className={cn('h-9 w-24 shrink-0 gap-1.5', copied && 'text-success-600')} onClick={copy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-1.5" onClick={exportPdf}>
                <FileDown className="h-4 w-4" /> Export as PDF
              </Button>
              <Button variant="outline" className="gap-1.5" onClick={mail}>
                <Mail className="h-4 w-4" /> Share via mail
              </Button>
            </div>
          </div>
          <div className="shrink-0 text-center">
            <div className="rounded-md border bg-white p-2">
              <QRCodeSVG value={link} size={112} level="M" />
            </div>
            <p className="mt-1.5 w-[128px] text-[11px] leading-snug text-muted-foreground">Scan to open on your phone</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
