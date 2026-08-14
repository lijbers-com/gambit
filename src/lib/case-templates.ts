'use client';

/**
 * Case templates — the reusable shapes behind recommendation and insight
 * notifications.
 *
 * Every message that asks the user to believe something carries a business
 * case: stats, an optional chart, and the reasoning. Writing each case by
 * hand meant every new example was a one-off; this registry makes them
 * templates a message fills in with numbers, so adding the next one — share
 * of voice, budget, keywords, an A/B uplift test — is data, not new UI.
 *
 * The shape matches MessageBusinessCase (ui/message-drawer) structurally.
 */

export interface CaseStat {
  label: string;
  value: string;
  sub?: string;
  tone?: 'success' | 'neutral';
}
export interface CaseChart {
  kind: 'bar' | 'area';
  title?: string;
  data: Record<string, string | number>[];
  config: Record<string, { label: string; color: string }>;
  xKey?: string;
  horizontal?: boolean;
  rightAxisKey?: string;
}
export interface CaseData {
  stats?: CaseStat[];
  chart?: CaseChart;
  insights?: { title: string; text: string }[];
}

/** Share of voice — how visible the brand is against the category. */
export function shareOfVoiceCase(p: { brandShare: number; category: string; trendPts: number }): CaseData {
  return {
    stats: [
      { label: 'Your share of voice', value: `${p.brandShare}%`, sub: `in ${p.category}` },
      { label: 'Competitors', value: `${100 - p.brandShare}%`, sub: 'of category impressions' },
      { label: 'Trend', value: `${p.trendPts > 0 ? '+' : ''}${p.trendPts} pts`, sub: 'vs. last month', tone: p.trendPts > 0 ? 'success' : 'neutral' },
    ],
    chart: {
      kind: 'bar',
      title: `Share of voice — ${p.category}`,
      data: [{ name: 'Category', you: p.brandShare, competitors: 100 - p.brandShare }],
      config: {
        you: { label: 'Your brand', color: 'hsl(var(--chart-1))' },
        competitors: { label: 'Competitors', color: 'hsl(var(--chart-3))' },
      },
      xKey: 'name',
      horizontal: true,
    },
    insights: [
      { title: 'What this means', text: 'Share of voice tracks how often shoppers see you versus everyone else in the category. Sustained share above your market share predicts brand growth.' },
      { title: 'Where it moves', text: 'The biggest lever is the positions you book: category pages and search top slots carry most of the category impressions.' },
    ],
  };
}

/** Budget recommendation — reallocate toward what is delivering. */
export function budgetRecommendationCase(p: { from: string; to: string; amount: string; roasFrom: string; roasTo: string }): CaseData {
  return {
    stats: [
      { label: `${p.from} ROAS`, value: p.roasFrom, sub: 'trailing the plan' },
      { label: `${p.to} ROAS`, value: p.roasTo, sub: 'ahead of target', tone: 'success' },
      { label: 'Suggested shift', value: p.amount, sub: `${p.from} → ${p.to}` },
    ],
    insights: [
      { title: 'The case', text: `${p.to} is buying the same audience for less. Moving ${p.amount} keeps the plan total unchanged while raising expected return.` },
      { title: 'The catch', text: 'Reallocation resets pacing on both campaigns for about a day. Avoid moving budget in the final week of a flight.' },
    ],
  };
}

/** Keyword recommendation — coverage the campaign is missing. */
export function keywordRecommendationCase(p: { keywords: string[]; volume: string; estClicks: string }): CaseData {
  return {
    stats: [
      { label: 'Missed searches', value: p.volume, sub: 'monthly, in your category' },
      { label: 'Suggested keywords', value: String(p.keywords.length), sub: 'not yet covered' },
      { label: 'Estimated clicks', value: p.estClicks, sub: 'per month if added', tone: 'success' },
    ],
    insights: [
      { title: 'Add these', text: p.keywords.join(', ') + '.' },
      { title: 'Why they fit', text: 'Shoppers searching these terms already buy from the category; your products appear organically but carry no sponsored placement, so competitors take the top slot.' },
    ],
  };
}

/** A/B uplift test — two placements, measured sales lift and new customers. */
export function salesUpliftTestCase(p: {
  test: string;
  a: { label: string; uplift: number; newCustomers: number; base: string; perStore: string };
  b: { label: string; uplift: number; newCustomers: number; base: string; perStore: string };
}): CaseData {
  const winner = p.b.uplift >= p.a.uplift ? p.b : p.a;
  return {
    stats: [
      { label: `${p.a.label} uplift`, value: `+${p.a.uplift}%`, sub: `${p.a.base} base · ${p.a.perStore} per store` },
      { label: `${p.b.label} uplift`, value: `+${p.b.uplift}%`, sub: `${p.b.base} base · ${p.b.perStore} per store`, tone: 'success' },
      { label: 'New customers', value: `+${winner.newCustomers}%`, sub: `${winner.label}, vs. +${winner === p.b ? p.a.newCustomers : p.b.newCustomers}%` },
    ],
    chart: {
      kind: 'bar',
      title: `${p.test} — sales uplift vs. control stores`,
      data: [
        { name: p.a.label, uplift: p.a.uplift, customers: p.a.newCustomers },
        { name: p.b.label, uplift: p.b.uplift, customers: p.b.newCustomers },
      ],
      config: {
        uplift: { label: 'Sales uplift %', color: 'hsl(var(--chart-1))' },
        customers: { label: 'New customers %', color: 'hsl(var(--chart-2))' },
      },
      xKey: 'name',
    },
    insights: [
      { title: 'The result', text: `${winner.label} delivered +${winner.uplift}% sales uplift and roughly twice the new customers of the alternative in the same weeks, against matched control stores.` },
      { title: 'How to use it', text: `Prefer ${winner.label.toLowerCase()} for conversion-led briefs; the alternative still wins on entrance visibility for awareness goals.` },
    ],
  };
}

/** Volume pacing — is delivery on track against the plan? */
export function volumePacingCase(p: { delivered: string; target: string; pacePct: number; topChannel: string }): CaseData {
  return {
    stats: [
      { label: 'Delivered', value: p.delivered, sub: 'impressions to date' },
      { label: 'Target', value: p.target, sub: 'for the full flight' },
      { label: 'Pace', value: `${p.pacePct}%`, sub: p.pacePct >= 100 ? 'ahead of plan' : 'of where it should be', tone: p.pacePct >= 100 ? 'success' : 'neutral' },
    ],
    insights: [
      { title: 'What is carrying it', text: `${p.topChannel} is delivering the largest share of volume this period.` },
      { title: 'What to watch', text: 'Volume alone does not buy attention — check reach and frequency before adding more impressions to the same audience.' },
    ],
  };
}

/** Buyer mix — who the campaign is actually reaching. */
export function buyerMixCase(p: { newToBrand: number; lapsed: number; existing: number; category: string }): CaseData {
  return {
    stats: [
      { label: 'New-to-brand', value: `${p.newToBrand}%`, sub: 'first purchase', tone: 'success' },
      { label: 'Lapsed', value: `${p.lapsed}%`, sub: 'won back' },
      { label: 'Existing', value: `${p.existing}%`, sub: 'repeat buyers' },
    ],
    chart: {
      kind: 'bar',
      title: `Buyer mix — ${p.category}`,
      data: [
        { name: 'New-to-brand', share: p.newToBrand },
        { name: 'Lapsed', share: p.lapsed },
        { name: 'Existing', share: p.existing },
      ],
      config: { share: { label: 'Share of buyers %', color: 'hsl(var(--chart-1))' } },
      xKey: 'name',
      horizontal: true,
    },
    insights: [
      { title: 'What this means', text: `A ${p.newToBrand}% new-to-brand share means the campaign is recruiting, not just harvesting existing demand — the harder and more valuable half of growth.` },
      { title: 'Where it moves', text: 'Awareness propositions and broader targeting raise new-to-brand share; retargeting and search lift the existing-buyer share instead.' },
    ],
  };
}
