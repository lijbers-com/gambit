/**
 * The recommendation engine — what the system thinks you should do, and why.
 *
 * Deliberately kept apart from the inbox. **Notifications are a delivery
 * mechanism**: they carry a message to a person, remember whether it was read,
 * and give it somewhere to be answered. What the message SAYS, what evidence it
 * carries and what accepting it actually means belong here — so the same
 * recommendation can appear on a media plan, in the notification centre, on a
 * campaign page or in a report without being written three times.
 *
 * Every kind of recommendation is its own TEMPLATE: a pure function from
 * measured numbers to a finished recommendation. Adding the next kind — share
 * of voice, dayparting, negative keywords, creative fatigue — is a new template
 * in this file, not new UI. That mirrors how notification cases already work
 * (see lib/case-templates.ts): the shape is the reusable part, the numbers are
 * the message.
 *
 * A recommendation is a PROPOSAL, so it always has exactly two answers: accept
 * it or decline it. Every template therefore states what accepting does, in the
 * user's words. Decline needs no label — it is simply the other answer.
 */

export type RecommendationType =
  | 'budget-capout'
  | 'auction-share'
  | 'wasted-spend'
  | 'win-rate-trend';

export interface RecommendationStat {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
}

export interface RecommendationInsight {
  title: string;
  text: string;
}

export interface Recommendation {
  type: RecommendationType;
  /** What it is about — the keyword, booking or campaign named in the copy. */
  about: string;
  /** Bold first line, like a mail subject. */
  title: string;
  /** The preview line under the title. */
  detail: string;
  /** The case behind it: the figures, then the reasoning. */
  evidence: { stats: RecommendationStat[]; insights: RecommendationInsight[] };
  /** What accepting DOES, in the user's words ("Raise daily budget to €90").
   *  Decline is always the other answer, so it carries no label. */
  acceptLabel: string;
  severity: 'blocking' | 'attention' | 'info';
}

/** The catalogue — one line per type, for settings screens and documentation.
 *  Every entry here has a template below, and vice versa. */
export const recommendationCatalogue: {
  type: RecommendationType;
  label: string;
  what: string;
  fires: string;
}[] = [
  {
    type: 'budget-capout',
    label: 'Budget cap-out',
    what: 'Detects when the daily budget was exhausted and quantifies the missed opportunity.',
    fires: 'The keyword stopped serving before the end of the day on 2 or more days in the window.',
  },
  {
    type: 'auction-share',
    label: 'Auction share & position',
    what: 'Compares auctions entered against auctions won, and where the wins landed on the page.',
    fires: 'Win rate below 85%, or Top of Search below 50% of wins.',
  },
  {
    type: 'wasted-spend',
    label: 'Wasted spend',
    what: 'Finds keywords consuming budget without converting, and names a better home for the money.',
    fires: 'Meaningful spend in the window with zero add-to-carts.',
  },
  {
    type: 'win-rate-trend',
    label: 'Win rate trend',
    what: 'Tracks win rate week over week to surface rising competitive pressure.',
    fires: 'Win rate down 5 points or more against two weeks ago.',
  },
];

// ── Measurement ────────────────────────────────────────────────────────
//
// One keyword-week of auction data. All four templates read the SAME
// measurement object, because they are four ways of reading one week — not four
// separate reports. In production this comes from the auction logs; here it is
// modelled deterministically from the keyword and booking so a page never
// reshuffles its own numbers between renders.

export interface KeywordWeek {
  keyword: string;
  /** Auctions the keyword was eligible for, and how many it won. */
  auctions: number;
  wins: number;
  /** Share of wins that landed in Top of Search. */
  topOfSearchRate: number;
  bid: number;
  floorPrice: number;
  suggestedBid: number;
  competitors: number;
  /** Win rate this week, and the two weeks before it. */
  winRate: number;
  winRateLastWeek: number;
  winRateTwoWeeksAgo: number;
  /** Days in the window the daily budget ran out, and the average time it did. */
  daysInWindow: number;
  cappedDays: number;
  capoutTime: string;
  dailyBudget: number;
  /** Delivery and outcome over the window. */
  spend: number;
  impressions: number;
  clicks: number;
  addToCart: number;
  /** Share of the campaign's daily budget this one keyword consumes. */
  budgetShare: number;
}

/** Deterministic 0–1 from a string. Same keyword, same week, every render. */
function hash01(s: string, salt = 0): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

/**
 * A modelled week of auction data for one keyword. The prototype's stand-in for
 * the auction log — deterministic, so the recommendation a user reads today is
 * the one they read yesterday.
 */
export function keywordWeek(keyword: string, seed = ''): KeywordWeek {
  const k = `${keyword}|${seed}`;
  const auctions = 1200 + Math.round(hash01(k, 1) * 2600);
  const winRate = 0.42 + hash01(k, 2) * 0.5;
  const wins = Math.round(auctions * winRate);
  const bid = Math.round((0.25 + hash01(k, 3) * 0.5) * 100) / 100;
  const clicks = Math.round(wins * (0.05 + hash01(k, 6) * 0.05));
  // A quarter of keywords convert nothing — that is what wasted-spend looks for.
  const converts = hash01(k, 7) > 0.25;
  const cappedDays = Math.round(hash01(k, 8) * 5);
  const capHour = 11 + Math.round(hash01(k, 9) * 6);
  const capMinute = Math.round(hash01(k, 10) * 59);
  return {
    keyword,
    auctions,
    wins,
    winRate: Math.round(winRate * 100) / 100,
    winRateLastWeek: Math.round(Math.max(0.2, winRate - 0.07 + hash01(k, 11) * 0.06) * 100) / 100,
    winRateTwoWeeksAgo: Math.round(Math.max(0.2, winRate + 0.02 + hash01(k, 12) * 0.1) * 100) / 100,
    topOfSearchRate: Math.round((0.25 + hash01(k, 4) * 0.5) * 100) / 100,
    bid,
    floorPrice: Math.round(bid * 0.66 * 100) / 100,
    suggestedBid: Math.round(bid * (1.6 + hash01(k, 5) * 0.5) * 100) / 100,
    competitors: 3 + Math.round(hash01(k, 13) * 5),
    daysInWindow: 7,
    cappedDays,
    capoutTime: `${String(capHour).padStart(2, '0')}:${String(capMinute).padStart(2, '0')}`,
    dailyBudget: 10 * Math.round((30 + hash01(k, 14) * 60) / 10),
    spend: Math.round((20 + hash01(k, 15) * 60) * 100) / 100,
    impressions: wins,
    clicks,
    addToCart: converts ? 1 + Math.round(hash01(k, 16) * 25) : 0,
    budgetShare: Math.round((5 + hash01(k, 17) * 20)),
  };
}

const pct = (n: number) => `${Math.round(n * 100)}%`;
const euro = (n: number) => `€${n.toLocaleString('en-GB', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

// ── Templates ──────────────────────────────────────────────────────────

/**
 * **Budget cap-out** — the daily budget ran out before the day did.
 *
 * Canonical example:
 * > Keyword: "coffee" — Last 7 Days
 * >
 * > Your budget capped out on 5 of 7 days.
 * > Average capout time: 13:42
 * >
 * > You missed approximately 2,450 auctions after budget exhaustion.
 * > Estimated missed impressions: 1,838 (based on your 75% win rate)
 * > Estimated missed clicks: 147 (based on your 8% CTR)
 * >
 * > Increasing daily budget from €50 to €90 would have kept you
 * > active through the entire day on all 5 capped days.
 */
export function budgetCapoutRecommendation(w: KeywordWeek): Recommendation {
  // What the day had left after the money ran out, priced in auctions.
  const dayRemaining = 1 - (Number(w.capoutTime.slice(0, 2)) + Number(w.capoutTime.slice(3)) / 60) / 24;
  const missedAuctions = Math.round(((w.auctions / w.daysInWindow) * w.cappedDays * dayRemaining) / 10) * 10;
  const missedImpressions = Math.round(missedAuctions * w.winRate);
  const ctr = w.impressions > 0 ? w.clicks / w.impressions : 0;
  const missedClicks = Math.round(missedImpressions * ctr);
  const suggestedBudget = Math.round((w.dailyBudget / (1 - dayRemaining)) / 10) * 10;
  return {
    type: 'budget-capout',
    about: w.keyword,
    title: `Daily budget capped out on ${w.cappedDays} of ${w.daysInWindow} days`,
    detail: `"${w.keyword}" stopped serving at ${w.capoutTime} on average — an estimated ${missedClicks.toLocaleString()} clicks were missed after the budget ran out.`,
    severity: 'attention',
    acceptLabel: `Raise daily budget to ${euro(suggestedBudget)}`,
    evidence: {
      stats: [
        { label: 'Days capped', value: `${w.cappedDays} of ${w.daysInWindow}`, sub: 'Last 7 days' },
        { label: 'Average cap-out', value: w.capoutTime, sub: 'Stops serving' },
        { label: 'Missed clicks', value: missedClicks.toLocaleString(), sub: `At ${pct(ctr)} CTR` },
      ],
      insights: [
        {
          title: 'What happened',
          text: `The daily budget ran out on ${w.cappedDays} of the last ${w.daysInWindow} days, at ${w.capoutTime} on average. After that the keyword stopped entering auctions for the rest of the day.`,
        },
        {
          title: 'What it cost',
          text: `Approximately ${missedAuctions.toLocaleString()} auctions were missed after budget exhaustion — an estimated ${missedImpressions.toLocaleString()} impressions at your ${pct(w.winRate)} win rate, and ${missedClicks.toLocaleString()} clicks at your ${pct(ctr)} CTR.`,
        },
        {
          title: 'The fix',
          text: `Increasing the daily budget from ${euro(w.dailyBudget)} to ${euro(suggestedBudget)} would have kept "${w.keyword}" active through the entire day on all ${w.cappedDays} capped days.`,
        },
      ],
    },
  };
}

/**
 * **Auction share & position** — you are in the auction but not winning it, or
 * winning it below position 1.
 *
 * Canonical example:
 * > Keyword: "coffee" — Last 7 Days
 * >
 * > You participated in 3,200 auctions but won only 2,400 (75%).
 * > On 800 auctions, your bid was too low to win any position.
 * >
 * > Your Top of Search rate was 40% — you were below position 1
 * > in 60% of your wins.
 * >
 * > The suggested bid to reach position 1 is €0.85 (currently €0.45).
 */
export function auctionShareRecommendation(w: KeywordWeek): Recommendation {
  const lost = w.auctions - w.wins;
  return {
    type: 'auction-share',
    about: w.keyword,
    title: 'Bid is too low to reach position 1',
    detail: `"${w.keyword}" won ${w.wins.toLocaleString()} of ${w.auctions.toLocaleString()} auctions (${pct(w.winRate)}) and was below position 1 in ${pct(1 - w.topOfSearchRate)} of those wins.`,
    severity: 'info',
    acceptLabel: `Raise bid to ${euro(w.suggestedBid)}`,
    evidence: {
      stats: [
        { label: 'Win rate', value: pct(w.winRate), sub: `${w.wins.toLocaleString()} of ${w.auctions.toLocaleString()} auctions` },
        { label: 'Lost auctions', value: lost.toLocaleString(), sub: 'Bid too low for any position' },
        { label: 'Top of Search', value: pct(w.topOfSearchRate), sub: 'Of your wins' },
      ],
      insights: [
        {
          title: 'Where you stand',
          text: `You participated in ${w.auctions.toLocaleString()} auctions but won only ${w.wins.toLocaleString()} (${pct(w.winRate)}). On ${lost.toLocaleString()} auctions your bid was too low to win any position at all.`,
        },
        {
          title: 'Position, not just presence',
          text: `Your Top of Search rate was ${pct(w.topOfSearchRate)} — you were below position 1 in ${pct(1 - w.topOfSearchRate)} of your wins, where click-through is a fraction of the top slot.`,
        },
        {
          title: 'The fix',
          text: `The suggested bid to reach position 1 is ${euro(w.suggestedBid)}, against your current ${euro(w.bid)}. Check the added cost per click still fits this keyword's return before you commit.`,
        },
      ],
    },
  };
}

/**
 * **Wasted spend** — budget going out, nothing coming back.
 *
 * Canonical example:
 * > Keyword: "generic drink" — Last 7 Days
 * >
 * > Spend: €45.00
 * > Impressions: 890  |  Clicks: 62  |  Add-to-cart: 0
 * > ROAS: 0%
 * >
 * > This keyword consumed 15% of your daily budget with no
 * > conversions. Pausing it would redirect €45/week to
 * > better-performing keywords.
 * >
 * > Compare: Keyword "coffee" has ROAS of 400% with 23 add-to-carts.
 */
export function wastedSpendRecommendation(w: KeywordWeek, best?: { keyword: string; roas: number; addToCart: number }): Recommendation {
  return {
    type: 'wasted-spend',
    about: w.keyword,
    title: `"${w.keyword}" is spending without converting`,
    detail: `${euro(w.spend)} spent and ${w.clicks} clicks in the last ${w.daysInWindow} days, with no add-to-carts — ${w.budgetShare}% of the daily budget with no return.`,
    severity: 'attention',
    acceptLabel: `Pause "${w.keyword}"`,
    evidence: {
      stats: [
        { label: 'Spend', value: euro(w.spend), sub: 'Last 7 days' },
        { label: 'Add-to-cart', value: '0', sub: `${w.clicks} clicks` },
        { label: 'ROAS', value: '0%', sub: 'No conversions' },
      ],
      insights: [
        {
          title: 'What it is costing',
          text: `${w.impressions.toLocaleString()} impressions, ${w.clicks} clicks, 0 add-to-carts. This keyword consumed ${w.budgetShare}% of the daily budget with no conversions; pausing it redirects ${euro(w.spend)} a week to better-performing keywords.`,
        },
        ...(best
          ? [{
              title: 'The comparison',
              text: `Keyword "${best.keyword}" has a ROAS of ${Math.round(best.roas * 100)}% with ${best.addToCart} add-to-carts over the same period — the same money buys a return there.`,
            }]
          : []),
        {
          title: 'Before you pause',
          text: 'Clicks without add-to-carts means the traffic arrives and leaves — a mismatch between the search and the product, not a bidding problem. Raising the bid would buy more of the same.',
        },
      ],
    },
  };
}

/**
 * **Win rate trend** — you are losing ground week over week.
 *
 * Canonical example:
 * > Keyword: "coffee" — Trend
 * >
 * > Win rate: 45% this week (vs. 38% last week, vs. 52% two weeks ago)
 * > Your current bid: €0.45 | Floor price: €0.30
 * > Number of active competitors: 5
 * >
 * > Your win rate dropped 7 points from two weeks ago, suggesting
 * > increased competition or competitor bid increases.
 */
export function winRateTrendRecommendation(w: KeywordWeek): Recommendation {
  const dropPts = Math.round((w.winRateTwoWeeksAgo - w.winRate) * 100);
  return {
    type: 'win-rate-trend',
    about: w.keyword,
    title: 'Win rate is falling — competition is increasing',
    detail: `"${w.keyword}" won ${pct(w.winRate)} of its auctions this week, down ${dropPts} points from two weeks ago, with ${w.competitors} active competitors.`,
    severity: 'info',
    acceptLabel: `Review the bid for "${w.keyword}"`,
    evidence: {
      stats: [
        { label: 'Win rate', value: pct(w.winRate), sub: `vs. ${pct(w.winRateLastWeek)} last week, ${pct(w.winRateTwoWeeksAgo)} two weeks ago` },
        { label: 'Your bid', value: euro(w.bid), sub: `Floor price ${euro(w.floorPrice)}` },
        { label: 'Active competitors', value: String(w.competitors), sub: 'On this keyword' },
      ],
      insights: [
        {
          title: 'The trend',
          text: `${pct(w.winRate)} this week, against ${pct(w.winRateLastWeek)} last week and ${pct(w.winRateTwoWeeksAgo)} two weeks ago.`,
        },
        {
          title: 'What it means',
          text: `Your win rate dropped ${dropPts} points from two weeks ago, suggesting increased competition or competitor bid increases — the auction moved, not your setup.`,
        },
        {
          title: 'Your room to move',
          text: `Your bid of ${euro(w.bid)} sits above a floor price of ${euro(w.floorPrice)}, so there is headroom to bid up. Whether you should depends on what a click on this keyword is worth to you.`,
        },
      ],
    },
  };
}

/**
 * Every recommendation a keyword-week earns, in the order to act on. A quiet
 * week produces none — a feed that always has something to say is a feed nobody
 * reads.
 */
export function recommendationsForKeyword(
  w: KeywordWeek,
  best?: { keyword: string; roas: number; addToCart: number },
): Recommendation[] {
  const out: Recommendation[] = [];
  if (w.cappedDays >= 2) out.push(budgetCapoutRecommendation(w));
  if (w.spend >= 25 && w.addToCart === 0) out.push(wastedSpendRecommendation(w, best));
  if (w.winRate < 0.85 || w.topOfSearchRate < 0.5) out.push(auctionShareRecommendation(w));
  if (w.winRateTwoWeeksAgo - w.winRate >= 0.05) out.push(winRateTrendRecommendation(w));
  return out;
}
