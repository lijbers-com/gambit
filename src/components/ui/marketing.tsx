'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent } from './card';

/**
 * The public-facing marketing surfaces — the edge.os one-pager today, whatever
 * else gets sold from a URL later.
 *
 * These are the app's own primitives (Card, Button, Badge) wearing Edge's fixed
 * palette. A marketing page can't take its colours from the theme the way the
 * app does: it is read before anyone logs in, so there is no retailer to theme
 * by, and it is always Edge selling Edge. So the components stay the same and
 * only the skin is pinned — one Card, one Button, one Badge across the product
 * and the page that sells it.
 *
 * Sections come in two tones and alternate down the page: `light` on cream,
 * `dark` on teal. Everything here takes the tone rather than each caller
 * re-deciding what "on dark" means.
 */

export type MarketingTone = 'light' | 'dark';

/** The one column every section lines up on. */
export const MarketingContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('relative z-[2] mx-auto w-[90%] max-w-[1180px]', className)}>{children}</div>;

const sectionVariants = cva('relative scroll-mt-20 overflow-hidden py-16 lg:py-[86px]', {
  variants: {
    tone: {
      light:
        'border-y border-edge-teal/10 bg-[radial-gradient(circle_at_top_right,rgba(200,240,0,0.18),transparent_26%),linear-gradient(180deg,#ffffff_0%,#fff9eb_100%)]',
      dark: 'border-y border-edge-lime/25 bg-[radial-gradient(circle_at_top_left,rgba(200,240,0,0.18),transparent_30%),linear-gradient(135deg,#005555_0%,#003f3f_55%,#092f2f_100%)]',
    },
  },
  defaultVariants: { tone: 'light' },
});

export interface MarketingSectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  children: React.ReactNode;
}

export const MarketingSection: React.FC<MarketingSectionProps> = ({ tone, className, children, ...props }) => (
  <section className={cn(sectionVariants({ tone }), className)} {...props}>
    <MarketingContainer>{children}</MarketingContainer>
  </section>
);

/** The eyebrow above a section title — the app's Badge, in brand lime. */
export const MarketingLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <Badge
    size="large"
    className={cn(
      'mb-4 border-transparent bg-edge-lime font-black uppercase tracking-[0.1em] text-edge-teal shadow-[0_8px_20px_rgba(200,240,0,0.3)]',
      'text-xs',
      className,
    )}
  >
    {children}
  </Badge>
);

export interface MarketingHeadingProps {
  label?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  tone?: MarketingTone;
  /** Left-aligned for split layouts; centred for full-width rows. */
  align?: 'center' | 'left';
  className?: string;
}

export const MarketingHeading: React.FC<MarketingHeadingProps> = ({
  label,
  title,
  body,
  tone = 'light',
  align = 'center',
  className,
}) => (
  <div className={cn(align === 'center' ? 'mx-auto mb-14 max-w-[760px] text-center' : 'mb-7', className)}>
    {label && <MarketingLabel>{label}</MarketingLabel>}
    <h2
      className={cn(
        'mb-4 text-[clamp(32px,4vw,46px)] font-semibold leading-[1.1] tracking-[-1.4px]',
        tone === 'dark' ? 'text-white' : 'text-edge-teal',
      )}
    >
      {title}
    </h2>
    {body && <p className={cn('text-lg', tone === 'dark' ? 'text-white/80' : 'text-edge-body')}>{body}</p>}
  </div>
);

/**
 * A call to action: the app's Button, rendered as a link.
 *
 * It takes the app's own variants rather than restyling them. A button is not
 * its element — it is its radius, weight, shadow and hover, and overriding
 * those gave a control that shared a component with the app while looking
 * nothing like it. So only the accent tone is Edge-specific: `lime` is the one
 * colour the app has no variant for, and it changes the fill and nothing else.
 */
export type MarketingButtonTone = 'primary' | 'accent' | 'outline';

export interface MarketingButtonProps {
  href: string;
  tone?: MarketingButtonTone;
  children: React.ReactNode;
  className?: string;
}

export const MarketingButton: React.FC<MarketingButtonProps> = ({ href, tone = 'primary', children, className }) => (
  <Button
    asChild
    size="lg"
    variant={tone === 'outline' ? 'outline' : 'default'}
    className={cn(
      tone === 'accent' && 'bg-edge-lime text-edge-teal hover:bg-edge-lime-dark',
      className,
    )}
  >
    <a href={href}>{children}</a>
  </Button>
);

/**
 * A card on a marketing section. Same Card as the app; the tone decides whether
 * it sits cream-on-dark or white-on-cream, because a card has to contrast with
 * whatever section it landed in.
 */
export interface MarketingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: MarketingTone;
  children: React.ReactNode;
}

export const MarketingCard: React.FC<MarketingCardProps> = ({ tone = 'light', className, children, ...props }) => (
  <Card
    className={cn(
      'transition duration-300',
      tone === 'light'
        ? 'border-edge-line bg-white/90 shadow-[0_16px_35px_rgba(0,85,85,0.08)] hover:-translate-y-[7px] hover:border-edge-teal/25 hover:shadow-[0_24px_50px_rgba(0,85,85,0.15)]'
        : 'border-cream-100/45 bg-cream-100/95 shadow-[0_16px_35px_rgba(0,0,0,0.16)] hover:-translate-y-2.5 hover:border-edge-lime hover:shadow-[0_28px_60px_rgba(0,0,0,0.28)]',
      'rounded-[28px]',
      className,
    )}
    {...props}
  >
    {children}
  </Card>
);

/**
 * The numbered card the Solutions and Products rows are both made of: a step
 * number, a title, a paragraph, and optional tags. One component, because the
 * two rows differ only in how many sit side by side.
 */
export interface MarketingFeatureCardProps {
  number: string;
  title: string;
  body: string;
  tags?: string[];
  tone?: MarketingTone;
}

export const MarketingFeatureCard: React.FC<MarketingFeatureCardProps> = ({
  number,
  title,
  body,
  tags,
  tone = 'light',
}) => (
  <MarketingCard tone={tone} className={cn('group relative overflow-hidden', tone === 'dark' && 'min-h-[310px]')}>
    {/* The lime disc only belongs on the dark row, where the cards are the
        bright thing on the section rather than the quiet thing. */}
    {tone === 'dark' && (
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-10 h-[140px] w-[140px] rounded-full bg-edge-lime/35 transition-all duration-300 group-hover:h-[190px] group-hover:w-[190px] group-hover:bg-edge-lime/55"
      />
    )}
    <CardContent className="relative z-[1] p-7 lg:p-8">
      <div
        className={cn(
          'mb-[22px] inline-flex items-center justify-center rounded-[15px] bg-edge-teal font-black text-edge-lime transition duration-300',
          tone === 'dark'
            ? 'h-[46px] w-[46px] group-hover:rotate-[-4deg] group-hover:scale-[1.08] group-hover:bg-edge-lime group-hover:text-edge-teal'
            : 'h-[52px] w-[52px] rounded-2xl',
        )}
      >
        {number}
      </div>
      <h3 className="mb-3 text-[22px] font-semibold leading-[1.15] text-edge-teal">{title}</h3>
      <p className="text-[15px] text-edge-body">{body}</p>
      {tags && tags.length > 0 && (
        <div className="mt-[22px] flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              className="border-transparent bg-edge-teal/10 font-extrabold text-edge-teal transition duration-300 group-hover:bg-edge-teal group-hover:text-edge-lime"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </CardContent>
  </MarketingCard>
);

/** A headline number with a caption — the hero's proof points. */
export const MarketingStat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <Card className="rounded-[18px] border-cream-100/50 bg-cream-100/90">
    <CardContent className="p-5">
      <strong className="block text-2xl font-semibold text-edge-teal">{value}</strong>
      <span className="text-sm text-edge-muted">{label}</span>
    </CardContent>
  </Card>
);

/** One of the glass tiles naming who the platform is for. */
export const MarketingAudienceCard: React.FC<{ who: string; what: string }> = ({ who, what }) => (
  <Card className="rounded-[22px] border-white/20 bg-white/10 text-center shadow-[0_18px_38px_rgba(0,0,0,0.18)] backdrop-blur-[10px] transition duration-300 hover:-translate-y-1.5 hover:border-edge-lime hover:bg-white/15 hover:shadow-[0_24px_52px_rgba(0,0,0,0.26)]">
    <CardContent className="p-6">
      <strong className="mb-1.5 block text-[26px] font-semibold text-edge-lime">{who}</strong>
      <span className="text-sm font-semibold text-white/80">{what}</span>
    </CardContent>
  </Card>
);

/** A ticked line in a capability list. */
export const MarketingCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex gap-3 font-semibold text-edge-body">
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-edge-lime text-sm font-black text-edge-teal">
      ✓
    </span>
    {children}
  </li>
);

/** An icon-led row inside a panel — title over one explanatory line. */
export const MarketingFeatureRow: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <div className="grid grid-cols-[52px_1fr] items-start gap-4 rounded-[18px] border border-edge-teal/10 bg-cream-100 p-5">
    <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-edge-lime text-xl font-black text-edge-teal">
      ›
    </div>
    <div>
      <h4 className="mb-1 font-semibold text-edge-teal">{title}</h4>
      <p className="text-[15px] text-edge-body">{body}</p>
    </div>
  </div>
);
