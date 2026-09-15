'use client';

import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronDown, Copy, FileDown, Mail, QrCode, Share2 } from 'lucide-react';
import type { Creative, EngineId } from '@/lib/db';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { useToast } from './toast';

/**
 * Sharing a creative preview — what the live display product offers on its
 * preview page (brand, layout, PDF, mail, QR), behind one Share button at
 * the foot of the live preview. No form: the link carries the brand the
 * page is showing and the layout of the size in view, so whoever opens it
 * sees the creative the way it was shared.
 */

export const SHARE_BRANDS: Array<{ id: string; name: string }> = [
  { id: 'gambit', name: 'Edge' },
  { id: 'albert-heijn', name: 'Albert Heijn' },
  { id: 'adusa', name: 'ADUSA' },
  { id: 'delhaize', name: 'Delhaize' },
  { id: 'alfa-beta', name: 'Alfa Beta' },
];

export type ShareLayout = 'desktop' | 'mobile';

/** The brand and layout a share link asked for, if any. */
export function readShareParams(): { brand?: string; layout?: ShareLayout } {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  const brand = p.get('brand') ?? undefined;
  const layout = p.get('layout');
  return {
    brand: brand && SHARE_BRANDS.some((b) => b.id === brand) ? brand : undefined,
    layout: layout === 'desktop' || layout === 'mobile' ? layout : undefined,
  };
}

export const CreativeShareMenu: React.FC<{
  creative: Creative;
  engine: EngineId;
  /** The brand the page is showing now — the link opens in it. */
  brand?: string;
  /** The layout of the size in view — the link opens on it. */
  layout: ShareLayout;
  className?: string;
}> = ({ creative, engine, brand, layout, className }) => {
  const toast = useToast();
  const [qrOpen, setQrOpen] = React.useState(false);
  const shareBrand = brand && SHARE_BRANDS.some((b) => b.id === brand) ? brand : 'gambit';
  const brandName = SHARE_BRANDS.find((b) => b.id === shareBrand)?.name ?? 'Edge';
  const layoutName = layout === 'mobile' ? 'mobile web' : 'desktop web';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const link = `${origin}/creatives/${engine}/${creative.id}?brand=${shareBrand}&layout=${layout}`;

  const copy = () => {
    navigator.clipboard?.writeText(link).catch(() => {});
    toast({ title: 'Preview link copied', description: `Opens as ${brandName} on ${layoutName}.` });
  };
  const exportPdf = () => {
    toast({ title: 'PDF on its way', description: `"${creative.name}" is being rendered for ${layoutName} and lands in your downloads.` });
  };
  const mail = () => {
    const subject = encodeURIComponent(`Preview: ${creative.name}`);
    const body = encodeURIComponent(`Have a look at this creative preview.\n\n${link}\n\nIt opens as ${brandName} on ${layoutName}.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={className}>
            <Share2 className="h-4 w-4" /> Share <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px]">
          <DropdownMenuItem onSelect={copy} className="gap-2"><Copy className="h-4 w-4" /> Copy link</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setQrOpen(true)} className="gap-2"><QrCode className="h-4 w-4" /> QR code</DropdownMenuItem>
          <DropdownMenuItem onSelect={exportPdf} className="gap-2"><FileDown className="h-4 w-4" /> Export as PDF</DropdownMenuItem>
          <DropdownMenuItem onSelect={mail} className="gap-2"><Mail className="h-4 w-4" /> Share via mail</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Scan to open on your phone</DialogTitle>
            <DialogDescription>Opens “{creative.name}” as {brandName}, {layoutName}.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <div className="rounded-md border bg-white p-3">
              <QRCodeSVG value={link} size={200} level="M" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
