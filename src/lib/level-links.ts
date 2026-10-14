import type { DbData, EngineId } from '@/lib/db/types';
import type { PlanLevel } from '@/components/ui/hierarchy-badge';

const ENGINES: EngineId[] = ['display', 'sponsored-products', 'digital-instore', 'offline-instore', 'offsite'];

/**
 * Where the hierarchy badge's levels lead from a page: the media plan and
 * campaign this page belongs to, else that level's overview (all media
 * plans; the proposition's campaigns).
 */
export function levelLinks(
  db: DbData,
  at: { campaignId?: string; bookingId?: string; engine?: string },
): Partial<Record<PlanLevel, string>> {
  const booking = at.bookingId ? db.bookings.find((b) => b.id === at.bookingId) : undefined;
  const campaign = db.campaigns.find((c) => c.id === (at.campaignId ?? booking?.campaignId));
  const plan = campaign && db.mediaPlans.find((p) => p.id === campaign.mediaPlanId);
  const key = at.engine?.toLowerCase().replace(/in[-\s]?store/g, 'instore').replace(/[\s_]+/g, '-');
  const engine = campaign?.engine ?? ENGINES.find((e) => e === key);
  return {
    'media-plan': plan ? `/campaigns/plan/${plan.id}` : '/campaigns',
    campaign: campaign ? `/campaigns/${campaign.engine}/${campaign.id}` : engine ? `/campaigns/${engine}` : undefined,
  };
}
