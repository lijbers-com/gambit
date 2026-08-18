// The shared Card pulls in charting and Radix, which set up React context at
// module scope — so the template is the client boundary and the route above it
// stays a server component that can still export page metadata.
'use client';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Link, Image } from '@/lib/router-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MarketingAudienceCard,
  MarketingButton,
  MarketingCheck,
  MarketingContainer,
  MarketingFeatureCard,
  MarketingFeatureRow,
  MarketingHeading,
  MarketingSection,
  MarketingStat,
} from '@/components/ui/marketing';

/**
 * The edge.os product one-pager — the public face of the platform, not part of
 * it. It renders no AppLayout and reads none of the retailer themes: a visitor
 * arrives before there is a session or a brand to theme by, so the page is
 * always Edge's own teal, lime and cream.
 *
 * Everything on it is the app's own Card, Button and Badge wearing that fixed
 * palette — see ui/marketing.tsx, which holds the section, heading and card
 * shapes the rows are assembled from.
 */

const NAV = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'Products', href: '#products' },
  { label: 'Platform', href: '#platform' },
  { label: 'Ecosystem', href: '#ecosystem' },
];

const SOLUTIONS = [
  {
    number: '01',
    title: 'Campaign management',
    body: 'Launch onsite and offsite campaigns with clear workflows, targeting options, budgets, and performance tracking.',
  },
  {
    number: '02',
    title: 'Smart use of AI',
    body: 'Put AI to work at each step of the retail media process — to speed up campaign setup and to optimise campaigns as they run.',
  },
  {
    number: '03',
    title: 'Measurement & insights',
    body: 'Understand campaign impact with transparent reporting across reach, engagement, sales, and return on media spend.',
  },
];

const PRODUCTS = [
  {
    number: '01',
    title: 'Sponsored products',
    body: 'Promote products directly in search results, category pages, and relevant shopping moments to increase visibility and drive conversion.',
    tags: ['Search', 'Conversion', 'Retail data'],
  },
  {
    number: '02',
    title: 'Display',
    body: 'Build brand awareness and consideration with visually engaging display placements across digital retail environments.',
    tags: ['Awareness', 'Consideration', 'Targeting'],
  },
  {
    number: '03',
    title: 'Digital media in-store',
    body: 'Reach shoppers inside the store through digital screens and dynamic content close to the point of purchase.',
    tags: ['In-store', 'Digital screens', 'Point of sale'],
  },
  {
    number: '04',
    title: 'Offline media in-store',
    body: 'Use physical in-store media formats to create visibility, support promotions, and influence shoppers during their store visit.',
    tags: ['Physical media', 'Promotions', 'Shopper impact'],
  },
];

const PLATFORM_POINTS = [
  'Activate first-party retail audiences responsibly',
  'Manage campaigns across multiple placements',
  'Give brands transparent access to performance data',
  'Improve monetisation while protecting customer trust',
];

const PLATFORM_FEATURES = [
  { title: 'Retailer control', body: 'Keep ownership of inventory, audiences, rules, and commercial strategy.' },
  {
    title: 'Brand-friendly workflows',
    body: 'Make it easier for advertisers to plan, book, optimise, and evaluate campaigns.',
  },
  {
    title: 'Actionable reporting',
    body: 'Turn campaign data into practical insights for better decisions and stronger outcomes.',
  },
];

const ECOSYSTEM = [
  { who: 'Retailers', what: 'Monetise digital inventory' },
  { who: 'Brands', what: 'Reach valuable shoppers' },
  { who: 'Agencies', what: 'Manage campaigns efficiently' },
  { who: 'Teams', what: 'Collaborate with clarity' },
];

const HERO_STATS = [
  { value: '360°', label: 'Campaign visibility' },
  { value: '1st', label: 'Party retail data' },
  { value: 'Real-time', label: 'Performance insights' },
];

export const EdgeOsLanding = () => (
  <div className="min-h-screen bg-cream-100 text-edge-ink antialiased [scroll-behavior:smooth]">
    {/* ── Header ── */}
    <header className="sticky top-0 z-[100] border-b border-edge-line bg-cream-100/90 backdrop-blur-md">
      <MarketingContainer className="flex h-[76px] items-center justify-between gap-6">
        <Link href="#top" aria-label="edge.os home" className="inline-flex items-center">
          <Image src="/edgeos-icon.svg" alt="edge.os" width={132} height={44} className="h-[30px] w-auto" priority />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex gap-7 text-[15px] font-semibold text-edge-body">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-edge-teal">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <MarketingButton href="/login">Login</MarketingButton>
      </MarketingContainer>
    </header>

    <main id="top">
      {/* ── Hero ──
          The gradient stays dark the whole width of the text column: a teal
          that washed out to cream halfway across left the white headline
          sitting on a pale green. It keeps a warm corner bottom-right so the
          section still hands over to the cream page below. */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(200,240,0,0.30),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,249,235,0.30),transparent_48%),linear-gradient(135deg,#005555_0%,#0b3f3f_58%,#07302f_100%)] pb-20 pt-16 lg:pt-[92px]">
        {/* Brand shapes, sunk into the gradient rather than sitting on it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-50px] top-10 h-[190px] w-[190px] rotate-[-8deg] bg-[url('/marketing/edge-triangle.png')] bg-contain bg-center bg-no-repeat opacity-20 sm:right-[8%] sm:top-[70px] sm:h-[310px] sm:w-[310px] sm:opacity-25"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-32 h-[320px] w-[320px] rotate-[4deg] bg-[url('/marketing/edge-chevron.png')] bg-contain bg-center bg-no-repeat opacity-[0.14] sm:h-[540px] sm:w-[540px]"
        />

        <MarketingContainer className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge
              size="large"
              className="mb-6 border-transparent bg-edge-lime/35 text-[13px] font-extrabold text-edge-lime"
            >
              Retail media, end to end
            </Badge>

            <h1 className="mb-6 text-[clamp(42px,6vw,68px)] font-semibold leading-[1.02] tracking-[-2.5px] text-white">
              Turn retail data into <span className="text-edge-lime">measurable media growth.</span>
            </h1>

            <p className="mb-8 max-w-[620px] text-[19px] text-white/85">
              edge.os helps retailers and brands activate shopper audiences, launch targeted campaigns, and measure
              performance across the full retail media journey.
            </p>

            <div className="mb-9 flex flex-wrap gap-3.5">
              <MarketingButton href="/login">Login</MarketingButton>
              <MarketingButton href="#solutions" tone="lime">
                Explore solutions
              </MarketingButton>
              <MarketingButton href="#products" tone="outline">
                Explore products
              </MarketingButton>
            </div>

            <div className="grid max-w-[620px] gap-4 sm:grid-cols-3">
              {HERO_STATS.map((stat) => (
                <MarketingStat key={stat.label} {...stat} />
              ))}
            </div>
          </div>

          {/* A sketch of the product, not a screenshot — it stays true however
              the app's own dashboard changes. */}
          <Card className="rounded-[30px] border-edge-line bg-white shadow-[0_20px_45px_rgba(0,85,85,0.12)]">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-edge-ink">Campaign performance</strong>
                  <p className="text-sm text-edge-muted">Live retail media dashboard</p>
                </div>
                <Badge className="border-transparent bg-edge-lime/35 font-extrabold text-edge-teal">Live</Badge>
              </div>

              <div className="mb-5 flex h-[230px] items-end gap-3.5 rounded-[22px] bg-[linear-gradient(180deg,rgba(0,85,85,0.12),rgba(0,85,85,0.02)),repeating-linear-gradient(to_right,transparent,transparent_54px,rgba(16,24,40,0.06)_55px)] p-6">
                {[35, 52, 44, 70, 58, 86].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className="flex-1 rounded-b rounded-t-xl bg-[linear-gradient(180deg,#005555,#c8f000)]"
                  />
                ))}
              </div>

              <div className="grid gap-3">
                {[
                  { name: 'Sponsored products', note: 'Optimised for conversion', delta: '+34%' },
                  { name: 'Audience activation', note: 'High-intent shopper segments', delta: '+21%' },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between gap-4 rounded-2xl bg-cream-100 p-3.5">
                    <div>
                      <strong className="text-sm text-edge-teal">{row.name}</strong>
                      <div className="text-[13px] text-edge-muted">{row.note}</div>
                    </div>
                    <strong className="text-edge-teal">{row.delta}</strong>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </MarketingContainer>
      </section>

      {/* ── Solutions ── */}
      <MarketingSection id="solutions" tone="light">
        <MarketingHeading
          label="Solutions"
          title="Solutions for modern retail media"
          body="Build, manage, optimise, and measure campaigns with a platform designed for retailers, advertisers, and media teams."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {SOLUTIONS.map((card) => (
            <MarketingFeatureCard key={card.number} {...card} />
          ))}
        </div>
      </MarketingSection>

      {/* ── Products ── */}
      <MarketingSection id="products" tone="dark">
        <MarketingHeading
          tone="dark"
          label="Products"
          title="Retail media products that connect brands with shoppers"
          body="Activate high-impact media across online and in-store channels, helping brands reach customers at the right moment in the shopping journey."
        />
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((card) => (
            <MarketingFeatureCard key={card.number} tone="dark" {...card} />
          ))}
        </div>
      </MarketingSection>

      {/* ── Platform ── */}
      <MarketingSection
        id="platform"
        tone="light"
        className="bg-[radial-gradient(circle_at_top_right,rgba(200,240,0,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(0,85,85,0.12),transparent_30%),linear-gradient(180deg,#ffffff_0%,#fff9eb_100%)]"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <MarketingHeading
              align="left"
              label="Platform"
              title="A connected platform for retail media teams"
              body="From media planning to campaign execution and reporting, edge.os brings the essential retail media capabilities together in one environment."
            />
            <ul className="grid gap-3.5">
              {PLATFORM_POINTS.map((point) => (
                <MarketingCheck key={point}>{point}</MarketingCheck>
              ))}
            </ul>
          </div>

          <Card className="rounded-[28px] border-edge-line bg-white/90 shadow-[0_20px_45px_rgba(0,85,85,0.12)]">
            <CardContent className="grid gap-4 p-7">
              {PLATFORM_FEATURES.map((feature) => (
                <MarketingFeatureRow key={feature.title} {...feature} />
              ))}
            </CardContent>
          </Card>
        </div>
      </MarketingSection>

      {/* ── Ecosystem ── */}
      <MarketingSection
        id="ecosystem"
        tone="dark"
        className="bg-[radial-gradient(circle_at_top_left,rgba(200,240,0,0.16),transparent_30%),linear-gradient(135deg,#003f3f_0%,#005555_55%,#092f2f_100%)]"
      >
        <MarketingHeading
          tone="dark"
          label="Ecosystem"
          title="Built for the retail media ecosystem"
          body="Support every stakeholder with tools that connect commercial goals, shopper relevance, and measurable impact."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ECOSYSTEM.map((card) => (
            <MarketingAudienceCard key={card.who} {...card} />
          ))}
        </div>
      </MarketingSection>

      {/* ── Closing band: the brand pattern, full bleed ── */}
      <section className="relative min-h-[300px] overflow-hidden border-y-[6px] border-edge-lime bg-[linear-gradient(180deg,#003f3f_0%,#005555_45%,#0b2525_100%)]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[url('/marketing/edge-pattern.png')] bg-cover bg-center bg-no-repeat opacity-30"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,85,85,0.9)_0%,rgba(0,85,85,0.45)_42%,rgba(11,37,37,0.95)_100%)]"
        />
        <MarketingContainer className="flex min-h-[300px] items-center justify-center py-16 text-center">
          <h2 className="max-w-[780px] text-[clamp(30px,4vw,48px)] font-semibold leading-[1.1] tracking-[-1.2px] text-white">
            Designed to connect <span className="text-edge-lime">retail media</span>, brands and shoppers.
          </h2>
        </MarketingContainer>
      </section>
    </main>

    {/* ── Footer ── */}
    <footer className="bg-edge-teal-deep pb-6 pt-[54px] text-[#cbd5d5]">
      <MarketingContainer>
        <div className="mb-9 grid gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-3.5 inline-flex items-center rounded-xl bg-white/5 px-2.5 py-2">
              <Image src="/edgeos-logo-light.svg" alt="edge.os" width={132} height={44} className="h-[30px] w-auto" />
            </div>
            <p className="max-w-[360px] text-[#a7b8b8]">
              Retail media solutions that help retailers and brands create relevant, measurable, and scalable
              advertising experiences.
            </p>
          </div>

          {[
            { title: 'Solutions', items: ['Campaigns', 'Audiences', 'Reporting', 'Insights'] },
            { title: 'Products', items: PRODUCTS.map((p) => p.title) },
            { title: 'Contact', items: ['info@edge-os.com', 'Amsterdam', 'Request a demo'] },
          ].map((column) => (
            <div key={column.title}>
              <h4 className="mb-3.5 font-semibold text-white">{column.title}</h4>
              <ul className="grid gap-2.5 text-sm">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-between gap-5 border-t border-white/10 pt-6 text-sm text-[#a7b8b8]">
          <span>© {new Date().getFullYear()} edge.os. All rights reserved.</span>
          <span>Privacy · Terms · Cookies</span>
        </div>
      </MarketingContainer>
    </footer>
  </div>
);

const meta: Meta = {
  title: 'Page templates/edge.os landing',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# edge.os landing page

The public one-pager for edge.os — what the product is, what it sells, and who
it is for. Lives at \`/product\` in the app.

It is deliberately outside the app's theming: no AppLayout, no side navigation,
and none of the retailer themes. A visitor arrives before there is a session, so
the page uses Edge's own fixed palette (the \`edge-*\` tokens in
tailwind.config.js) rather than the \`brand-*\` scale that follows whichever
retailer is loaded.

Every card, button and badge on it is the app's own component — the marketing
skins and the section/row shapes live in \`ui/marketing.tsx\`, so a second
marketing page can be assembled from the same parts.

Both **Login** buttons route into the real app at \`/login\`.
        `,
      },
    },
  },
};

export default meta;

export const Landing: StoryObj = {
  render: () => <EdgeOsLanding />,
};
