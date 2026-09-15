'use client';

import * as React from 'react';
import { Play, MousePointerClick, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Creative, CreativeTemplate } from '@/lib/db';

/**
 * THE creative preview — one renderer for every surface that shows what a
 * creative looks like: the builder's live panel, the portal's thumbnails,
 * dialogs. It draws the actual composition (background, image, header, CTA,
 * colours) at the TRUE aspect ratio of the chosen size, so changing a
 * setting changes the picture — you see what you edit and know the effect.
 *
 * Uploaded files live in a volatile in-session map (localStorage cannot hold
 * image data); a reload falls back to a neutral placeholder, which is fine
 * for a prototype — the layout, copy and colours are the point.
 */

// ── In-session image uploads ────────────────────────────────────────────
const uploadedImages = new Map<string, string>();
export const rememberUpload = (creativeId: string, fieldKey: string, dataUrl: string) =>
  uploadedImages.set(`${creativeId}:${fieldKey}`, dataUrl);
export const recallUpload = (creativeId: string, fieldKey: string): string | undefined =>
  uploadedImages.get(`${creativeId}:${fieldKey}`);

/** "970x250" → {w, h}; "A6" → paper ratio; "1920x1080 15s" strips the suffix. */
export function parseSize(size: string): { w: number; h: number; label: string } {
  const m = size.match(/(\d+)\s*x\s*(\d+)/i);
  if (m) return { w: Number(m[1]), h: Number(m[2]), label: size };
  // Paper sizes are all √2 portrait; the label carries the name.
  return { w: 707, h: 1000, label: size };
}

/** The text values for the active language, falling back to the default. */
export function localizedValues(values: Record<string, string>, lang?: string): Record<string, string> {
  if (!lang || lang === 'en') return values;
  const out: Record<string, string> = { ...values };
  const prefix = `${lang}:`;
  for (const [k, v] of Object.entries(values)) {
    if (k.startsWith(prefix) && v) out[k.slice(prefix.length)] = v;
  }
  return out;
}

export interface CreativePreviewProps {
  template: CreativeTemplate;
  values: Record<string, string>;
  /** Which of the template's sizes to draw. Defaults to the first. */
  size?: string;
  /** Language whose text variant renders. */
  lang?: string;
  /** The creative's id, to recall in-session uploads. */
  creativeId?: string;
  className?: string;
}

/** The live builder picks colours from a list — map names to paint. */
const NAMED_COLORS: Record<string, string> = {
  black: '#0B0B0B',
  white: '#F5F3EF',
  blue: '#0A4D8C',
  green: '#1E5A3C',
  orange: '#C2571B',
  red: '#7C1D2E',
};
export const resolveColor = (v: string | undefined, fallback: string): string => {
  if (!v) return fallback;
  if (v.startsWith('#')) return v;
  return NAMED_COLORS[v.toLowerCase()] ?? fallback;
};

const imgFor = (creativeId: string | undefined, values: Record<string, string>, key: string): string | undefined => {
  if (creativeId) {
    const remembered = recallUpload(creativeId, key);
    if (remembered) return remembered;
  }
  const v = values[key];
  return v && v.startsWith('data:') ? v : undefined;
};

/** Shared header + CTA lockup, scaled by container queries via em sizing. */
const Lockup: React.FC<{
  header?: string;
  cta?: string;
  textColor: string;
  stacked?: boolean;
  small?: boolean;
}> = ({ header, cta, textColor, stacked, small }) => (
  <div
    className={cn(
      'relative z-10 flex h-full w-full items-center gap-[4%] p-[5%]',
      stacked ? 'flex-col items-start justify-end' : 'flex-row justify-between',
    )}
  >
    <span
      className={cn('min-w-0 font-semibold leading-tight', small ? 'text-[10px]' : 'text-[clamp(10px,7cqw,28px)]')}
      style={{ color: textColor, overflowWrap: 'anywhere' }}
    >
      {header || 'Your header'}
    </span>
    <span
      className={cn(
        'shrink-0 whitespace-nowrap rounded-full font-medium',
        small ? 'px-1.5 py-0.5 text-[7px]' : 'px-[1em] py-[0.45em] text-[clamp(8px,4cqw,14px)]',
      )}
      style={{ background: textColor, color: '#00000090' }}
    >
      {cta || 'Call to action'}
    </span>
  </div>
);

/** The composition inside the frame, per preview rig. */
const Composition: React.FC<{
  template: CreativeTemplate;
  v: Record<string, string>;
  creativeId?: string;
  w: number;
  h: number;
  small?: boolean;
}> = ({ template, v, creativeId, w, h, small }) => {
  const bg = resolveColor(v.bgColor, '#0B0B0B');
  const text = resolveColor(v.textColor, bg.toLowerCase() === '#f5f3ef' ? '#252422' : '#FFFFFF');
  // Per-device art: wide frames prefer the desktop image, small ones mobile.
  const deviceImage = w >= 700 ? imgFor(creativeId, v, 'desktopImage') : imgFor(creativeId, v, 'mobileImage');
  const image =
    deviceImage ??
    imgFor(creativeId, v, 'desktopImage') ??
    imgFor(creativeId, v, 'mobileImage') ??
    imgFor(creativeId, v, 'bannerImage') ??
    imgFor(creativeId, v, 'background') ??
    imgFor(creativeId, v, 'file');
  const cutout = imgFor(creativeId, v, 'transparentImage');
  const portrait = h > w;

  const imageLayer = image ? (
    <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
  ) : (
    <div
      className="absolute inset-0"
      style={{ background: `linear-gradient(135deg, ${bg}, ${bg}E6 55%, #FFFFFF22)` }}
    />
  );

  switch (template.preview) {
    case 'print':
      return (
        <div className="absolute inset-0 bg-white">
          {image ? (
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-contain" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-neutral-400">
              <ImageIcon className={small ? 'h-4 w-4' : 'h-8 w-8'} />
              {!small && <span className="text-xs">Print-ready file</span>}
            </div>
          )}
          {/* Trim marks: this is a physical piece, not a pixel ad. */}
          <div className="pointer-events-none absolute inset-[3%] border border-dashed border-neutral-300" />
        </div>
      );
    case 'video':
      return (
        <div className="absolute inset-0" style={{ background: bg }}>
          {imageLayer}
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 p-[3%]">
            <Play className={small ? 'h-3 w-3' : 'h-6 w-6'} fill="white" color="white" />
          </div>
          <div className="absolute inset-x-0 bottom-0">
            <Lockup header={v.header} cta={v.cta} textColor={text} small={small} />
          </div>
          {!small && (
            <span className="absolute right-[3%] top-[4%] z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">0:15</span>
          )}
        </div>
      );
    case 'instore-screen':
      return (
        <div className="absolute inset-0 bg-black">
          {imageLayer}
          {v.header && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-[5%]">
              <span className={cn('font-semibold text-white', small ? 'text-[9px]' : 'text-[clamp(11px,6cqw,26px)]')}>{v.header}</span>
            </div>
          )}
          {v.cta && (
            <span
              className={cn(
                'absolute bottom-[5%] right-[4%] z-10 inline-flex items-center gap-1 rounded-full bg-white/90 font-medium text-neutral-900',
                small ? 'px-1.5 py-0.5 text-[7px]' : 'px-3 py-1 text-xs',
              )}
            >
              <MousePointerClick className={small ? 'h-2 w-2' : 'h-3 w-3'} /> {v.cta}
            </span>
          )}
          {!small && v.duration && (
            <span className="absolute right-[3%] top-[4%] rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
              {v.duration}s{v.loop === 'yes' ? ' · loop' : ''}
            </span>
          )}
        </div>
      );
    case 'social':
      return (
        <div className="absolute inset-0 flex flex-col bg-white">
          {!small && (
            <div className="flex items-center gap-1.5 p-[3%]">
              <span className="h-[1.2em] w-[1.2em] rounded-full bg-neutral-300" />
              <span className="text-[0.6em] font-medium text-neutral-700">Your brand · Sponsored</span>
            </div>
          )}
          <div className="relative min-h-0 flex-1" style={{ background: bg }}>
            {imageLayer}
            <div className="absolute inset-x-0 bottom-0">
              <Lockup header={v.header} cta={v.cta} textColor={text} stacked small={small} />
            </div>
          </div>
        </div>
      );
    case 'app-screen':
      return (
        <div className="absolute inset-0" style={{ background: bg }}>
          {imageLayer}
          {/* The app's own chrome, so the takeover reads in context. */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-black/25 px-[5%] py-[2.5%]">
            <span className="text-[0.55em] text-white/90">9:41</span>
            <span className="h-[0.5em] w-[22%] rounded-full bg-white/40" />
          </div>
          {cutout && <img src={cutout} alt="" className="absolute bottom-[18%] left-1/2 z-[5] max-h-[45%] -translate-x-1/2" />}
          <div className="absolute inset-x-0 bottom-[4%]">
            <Lockup header={v.header} cta={v.cta} textColor={text} stacked small={small} />
          </div>
        </div>
      );
    case 'banner':
    default: {
      const productIds = [v.productId1, v.productId2, v.productId3, v.productId4, v.productId5, v.productId6].filter(Boolean);
      return (
        <div className="absolute inset-0" style={{ background: bg }}>
          {imageLayer}
          {cutout && (
            <img
              src={cutout}
              alt=""
              className={cn('absolute z-[5] object-contain', portrait ? 'bottom-[25%] left-1/2 max-h-[35%] -translate-x-1/2' : 'right-[4%] top-1/2 max-h-[80%] max-w-[30%] -translate-y-1/2')}
            />
          )}
          {!small && v.sponsoredLabel === 'Yes' && (
            <span className="absolute left-[2%] top-[6%] z-20 rounded-sm bg-black/45 px-1.5 py-0.5 text-[9px] text-white">Sponsored</span>
          )}
          <div className={cn('relative z-10 flex h-full w-full items-center gap-[4%] p-[5%]', portrait ? 'flex-col items-start justify-end' : 'flex-row justify-between')}>
            <span className="min-w-0">
              <span
                className={cn('block font-semibold leading-tight', small ? 'text-[10px]' : 'text-[clamp(10px,6cqw,26px)]')}
                style={{ color: text, overflowWrap: 'anywhere' }}
              >
                {v.header || 'Your headline'}
              </span>
              {v.bodyCopy && !small && (
                <span className="block text-[clamp(8px,3cqw,13px)] opacity-90" style={{ color: text }}>
                  {v.bodyCopy}
                </span>
              )}
            </span>
            <span className="flex shrink-0 items-center gap-[6px]">
              {!small && productIds.length > 0 && !portrait && (
                <span className="flex items-center gap-[4px]">
                  {productIds.slice(0, 3).map((id) => (
                    <span key={id} className="flex h-[3.2em] w-[2.6em] flex-col items-center justify-center gap-[2px] rounded-sm bg-white/95 p-[2px] shadow-sm">
                      <ImageIcon className="h-[35%] w-[35%] text-neutral-400" />
                      <span className="w-full truncate text-center text-[6px] leading-none text-neutral-500">{id}</span>
                    </span>
                  ))}
                  {productIds.length > 3 && <span className="text-[8px]" style={{ color: text }}>+{productIds.length - 3}</span>}
                </span>
              )}
              <span
                className={cn('whitespace-nowrap rounded-full font-medium', small ? 'px-1.5 py-0.5 text-[7px]' : 'px-[1em] py-[0.45em] text-[clamp(8px,3.5cqw,14px)]')}
                style={{ background: text, color: bg }}
              >
                {v.cta || 'Call to action'}
              </span>
            </span>
          </div>
        </div>
      );
    }
  }
};

/**
 * Full preview: the composition inside a size-true frame, scaled to fit its
 * container, with the real dimensions on the frame.
 */
export const CreativePreview: React.FC<CreativePreviewProps> = ({ template, values, size, lang, creativeId, className }) => {
  const activeSize = size ?? template.sizes[0];
  const { w, h, label } = parseSize(activeSize);
  const v = localizedValues(values, lang);
  const portrait = h > w;
  return (
    <div className={cn('space-y-1', className)}>
      <div
        className={cn('relative mx-auto w-full overflow-hidden rounded-md border bg-background shadow-sm', portrait && 'max-w-[240px]')}
        style={{ aspectRatio: `${w} / ${h}`, containerType: 'inline-size' }}
      >
        <Composition template={template} v={v} creativeId={creativeId} w={w} h={h} />
      </div>
      <div className="text-center text-[11px] tabular-nums text-muted-foreground">{label}</div>
    </div>
  );
};

/** Table/dialog thumbnail — same renderer at postage-stamp size. */
export const CreativePreviewThumb: React.FC<{
  creative: Pick<Creative, 'id' | 'values' | 'templateId'>;
  template?: CreativeTemplate;
  className?: string;
}> = ({ creative, template, className }) => {
  if (!template) {
    return <div className={cn('h-9 w-14 rounded border bg-muted', className)} />;
  }
  const { w, h } = parseSize(template.sizes[0]);
  const portrait = h > w;
  return (
    <div
      className={cn('relative shrink-0 overflow-hidden rounded border bg-background', portrait ? 'h-12 w-8' : 'h-9 w-14', className)}
      style={{ containerType: 'inline-size' }}
    >
      <Composition template={template} v={localizedValues(creative.values)} creativeId={creative.id} w={w} h={h} small />
    </div>
  );
};
