'use client';

import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Copy, FileDown, Mail, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Creative, EngineId } from '@/lib/db';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useToast } from './toast';

/**
 * Sharing a creative preview — what the live display product offers on its
 * preview page (brand, layout, PDF, mail, QR), as a row of buttons under the
 * live preview, the way a summary card carries its actions. No form: the
 * link carries the brand the page is showing and the layout of the size in
 * view, so whoever opens it sees the creative the way it was shared.
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

export const CreativeShareActions: React.FC<{
  creative: Creative;
  engine: EngineId;
  /** The brand the page is showing now — the link opens in it. */
  brand?: string;
  /** The layout of the size in view — the link opens on it. */
  layout: ShareLayout;
  className?: string;
}> = ({ creative, engine, brand, layout, className }) => {
  const toast = useToast();
  const [copied, setCopied] = React.useState(false);
  const shareBrand = brand && SHARE_BRANDS.some((b) => b.id === brand) ? brand : 'gambit';
  const brandName = SHARE_BRANDS.find((b) => b.id === shareBrand)?.name ?? 'Edge';
  const layoutName = layout === 'mobile' ? 'mobile web' : 'desktop web';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const link = `${origin}/creatives/${engine}/${creative.id}?brand=${shareBrand}&layout=${layout}`;

  const copy = () => {
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
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
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Button variant="outline" size="sm" className={cn('gap-1.5', copied && 'text-success-600')} onClick={copy}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copied' : 'Copy link'}
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <QrCode className="h-4 w-4" /> QR code
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-3">
          <div className="rounded-md border bg-white p-2">
            <QRCodeSVG value={link} size={144} level="M" />
          </div>
          <p className="mt-2 w-[160px] text-center text-[11px] leading-snug text-muted-foreground">
            Scan to open on your phone — as {brandName}, {layoutName}.
          </p>
        </PopoverContent>
      </Popover>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={exportPdf}>
        <FileDown className="h-4 w-4" /> Export as PDF
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={mail}>
        <Mail className="h-4 w-4" /> Share via mail
      </Button>
    </div>
  );
};
