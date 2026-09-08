import {
  budgetRecommendationCase,
  buyerMixCase,
  keywordRecommendationCase,
  salesUpliftTestCase,
  shareOfVoiceCase,
  volumePacingCase,
  type CaseData,
} from './case-templates';

/**
 * The Campaign Agent's starting points — real cases from the case-template
 * library, the same evidence the inbox and the insight pages show. The
 * landing offers them as ways into a fenced conversation, and the legacy
 * scenario routes (/chat/spend-analysis, …) resolve to one of them.
 */
export interface AgentCase {
  slug: string;
  kind: 'insight' | 'recommendation';
  subject: string;
  message: string;
  caseData: CaseData;
}

export const AGENT_CASES: AgentCase[] = [
  {
    slug: 'spend-analysis',
    kind: 'recommendation',
    subject: 'Shift €2,000 from display to sponsored products',
    message:
      'Sponsored products is returning 4.4x against display’s 2.1x this month. A €2,000 shift raises expected return without changing the plan total.',
    caseData: budgetRecommendationCase({ from: 'Display', to: 'Sponsored products', amount: '€2,000', roasFrom: '2.1x', roasTo: '4.4x' }),
  },
  {
    slug: 'keyword-suggestions',
    kind: 'recommendation',
    subject: 'Add 4 keywords your campaign is missing',
    message:
      '18.4K monthly searches in your category run without your sponsored placement — competitors take the top slot on every one.',
    caseData: keywordRecommendationCase({
      keywords: ['cola zero sugar', 'soda multipack', 'party drinks', 'cola 1.5l'],
      volume: '18.4K',
      estClicks: '640',
    }),
  },
  {
    slug: 'new-campaign',
    kind: 'recommendation',
    subject: 'A sponsored products campaign is ready to propose',
    message:
      'Your category coverage and keyword gaps support a new sponsored products campaign. The starting shape below keeps it inside the plan budget.',
    caseData: {
      stats: [
        { label: 'Suggested budget', value: '€5,000', sub: 'for a 4-week flight' },
        { label: 'Estimated clicks', value: '4.1K', sub: 'at €1.22 avg. CPC' },
        { label: 'Projected ROAS', value: '3.8x', sub: 'vs. 3.0x target', tone: 'success' },
      ],
      insights: [
        { title: 'The proposal', text: 'Sponsored products on the 4 uncovered keywords plus your top 6 converting products, auto bids, even pacing.' },
        { title: 'Next step', text: 'Create the campaign in the wizard — the agent can talk through budget, keywords and pacing before you commit.' },
      ],
    },
  },
  {
    slug: 'share-of-voice',
    kind: 'insight',
    subject: 'Share of voice reached 45% in your category',
    message:
      'Up 4 points on last month — your brand now takes 45% of category impressions against 55% for all competitors combined.',
    caseData: shareOfVoiceCase({ brandShare: 45, category: 'soft drinks', trendPts: 4 }),
  },
  {
    slug: 'uplift-test',
    kind: 'insight',
    subject: 'In-store screens beat entrance DOOH on sales uplift',
    message:
      'The neighbours A/B test measured +59% uplift for in-store screens vs. +40% at the entrance — and twice the new customers.',
    caseData: salesUpliftTestCase({
      test: 'Neighbours A/B test',
      a: { label: 'Entrance DOOH', uplift: 40, newCustomers: 123, base: '€35K', perStore: '€139' },
      b: { label: 'In-store screens', uplift: 59, newCustomers: 243, base: '€29K', perStore: '€173' },
    }),
  },
  {
    slug: 'volume-pacing',
    kind: 'insight',
    subject: 'Volume is pacing 8% ahead of plan',
    message:
      'The flight has delivered 612K impressions against a 700K target, running 8% ahead of where it should be at this point.',
    caseData: volumePacingCase({ delivered: '612K', target: '700K', pacePct: 108, topChannel: 'Display onsite' }),
  },
  {
    slug: 'buyer-mix',
    kind: 'insight',
    subject: 'Almost half of buyers are new to the brand',
    message:
      '48% of buyers reached had never bought you before, against 22% won back from lapsed and 30% repeat buyers.',
    caseData: buyerMixCase({ newToBrand: 48, lapsed: 22, existing: 30, category: 'soft drinks' }),
  },
];

export const agentCaseBySlug = (slug: string) => AGENT_CASES.find((c) => c.slug === slug);
