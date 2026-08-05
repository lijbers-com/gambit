import type { Campaign } from '@/lib/db';

/**
 * Automatic budget allocation across a plan's propositions.
 *
 * The rule is deliberately explainable, because a user has to be willing to
 * hand the split over: money follows return. Each campaign's share is
 * proportional to the return its proposition has delivered so far — spend
 * multiplied by its ROAS — so the propositions earning the most get the most to
 * spend. Campaigns with no delivery yet fall back to an even share, otherwise a
 * plan that has not started would allocate everything to nothing.
 *
 * Kept out of the templates so the wizard and the plan detail split a budget
 * the same way; a real implementation would move this to the optimiser
 * service, with the same contract.
 */

/** Estimated return per euro for a campaign, from what it has delivered. */
const returnOf = (campaign: Campaign, roasFor: (c: Campaign) => number): number =>
  campaign.spend > 0 ? campaign.spend * roasFor(campaign) : 0;

export interface AllocationInput {
  planBudget: number;
  campaigns: Campaign[];
  /** ROAS per campaign. Defaults to 1, i.e. an even split by spend. */
  roasFor?: (campaign: Campaign) => number;
}

/**
 * Budget per campaign id. Rounded to whole euros, with any rounding remainder
 * given to the largest share so the parts always add up to the plan budget.
 */
export function allocateBudget({ planBudget, campaigns, roasFor = () => 1 }: AllocationInput): Record<string, number> {
  if (campaigns.length === 0 || planBudget <= 0) return {};

  const weights = campaigns.map((c) => returnOf(c, roasFor));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // Nothing has delivered yet — an even split is the only honest starting point.
  const shares = totalWeight > 0
    ? weights.map((w) => w / totalWeight)
    : campaigns.map(() => 1 / campaigns.length);

  const result: Record<string, number> = {};
  let allocated = 0;
  campaigns.forEach((c, i) => {
    const amount = Math.round(planBudget * shares[i]);
    result[c.id] = amount;
    allocated += amount;
  });

  // Rounding can leave the parts a euro or two off the whole; put the
  // difference on the biggest share, where it is least visible.
  const remainder = planBudget - allocated;
  if (remainder !== 0) {
    const biggest = campaigns.reduce((best, c) => (result[c.id] > result[best.id] ? c : best), campaigns[0]);
    result[biggest.id] = Math.max(0, result[biggest.id] + remainder);
  }

  return result;
}
