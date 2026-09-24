/**
 * Configuration rules: what a proposition does on its own. Each one is a
 * condition Edge watches and the effect it applies when it holds — the
 * retailer's standing decisions, written down once so nobody has to make
 * them per booking. A rule is applied as a CHECK step on the proposition's
 * workflow (WorkflowStep.rule), so the board says when it runs.
 */
export interface ConfigurationRule {
  id: string;
  name: string;
  status: 'Active' | 'Paused';
  priority: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  performance: string;
  templates: number;
  owner: string;
  summary: string;
  when: string;
  then: string;
  scope: string;
  why: string;
}

export const CONFIGURATION_RULES: ConfigurationRule[] = [
  {
    id: 'RULE-001', name: 'Product Category Targeting', status: 'Active', priority: 'High', lastUpdated: '2026-08-15', performance: '98%', templates: 3,
    owner: 'Yield Manager',
    summary: 'Keeps a booking on the category pages of the products it advertises.',
    when: 'A booking selects retail products and a category-page placement.',
    then: 'The placement is limited to the categories those products sit in; other categories are not served.',
    scope: 'Every booking on this proposition, unless a template turns it off.',
    why: 'Shoppers see the ad next to the product they came for; the retailer keeps category pages relevant. It also lifts click-through — the 98% is the share of impressions that landed in the right category.',
  },
  {
    id: 'RULE-002', name: 'Audience Segmentation', status: 'Active', priority: 'Medium', lastUpdated: '2026-08-12', performance: '94%', templates: 2,
    owner: 'Performance Analyst',
    summary: 'Splits delivery over the audience segments a booking targets.',
    when: 'A booking targets more than one audience segment.',
    then: 'Impressions are divided over the segments in proportion to their size, and a segment that stops converting is paused for the booking.',
    scope: 'Bookings with audience targeting; not applied to run-of-site bookings.',
    why: 'One large segment would otherwise take the whole budget. The 94% is how often the split held within 5% of the plan.',
  },
  {
    id: 'RULE-003', name: 'Budget Optimization', status: 'Paused', priority: 'Low', lastUpdated: '2026-08-10', performance: '87%', templates: 1,
    owner: 'Yield Manager',
    summary: 'Moves unspent budget from slow placements to the ones that deliver.',
    when: 'A booking is past 40% of its run time and a placement has spent under half its share.',
    then: 'The remaining budget of that placement is moved to the booking\'s best-performing placement, once a day, never more than 25% at a time.',
    scope: 'Auction bookings only; guaranteed bookings keep their fixed split.',
    why: 'Paused while the daily move is reviewed — it moved budget away from placements that were merely late to start. The 87% is the share of moves that improved the booking\'s ROAS.',
  },
];

export const ruleById = (id: string): ConfigurationRule | undefined => CONFIGURATION_RULES.find((r) => r.id === id);
