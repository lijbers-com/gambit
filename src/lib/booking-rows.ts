import type { Booking, DbData, EngineId } from '@/lib/db/types';
import { DELIVERY_RATES, bookingTotals, ratesOf } from '@/lib/db/performance';
import { bookingHealth } from '@/lib/db/health';
import { productForBooking } from '@/lib/db/guaranteed';
import { planStatusLabel } from '@/lib/status-vocabulary';

/**
 * A campaign's bookings as table rows — the one row shape every campaign
 * page's bookings table reads, built from the bookings in the database and
 * their delivery in the performance model. The keys are the union of what
 * the per-proposition tables show (SKU sales online and in store, delivery,
 * cost), so each table picks its columns and none invents a row.
 */
export interface CampaignBookingRow {
  id: string;
  name: string;
  status: string;
  /** Media product (channel) and placement the booking runs in. */
  channel: string;
  placement: string;
  position: string;
  destination: string;
  start: string;
  end: string;
  aiRecommendation: string;
  brand: string;
  retailProduct: string;
  retailMedia: { images: string[]; total: number };
  location: string;
  readiness: string;
  creativeDeadline: string;
  /** Not stored on a booking yet — shown as a dash, never a made-up count. */
  keywords: string;
  products: number;
  dailyBudget: string;
  adSpend: string;
  spent: string;
  impressions: string;
  clicks: string;
  viewability: string;
  cpc: string;
  avgCPC: string;
  ctr: string;
  cpm: string;
  ecpm: string;
  conversions: string;
  sales: string;
  roas: string;
  onlineSkuRevenue: string;
  onlineSkuUnits: string;
  onlineSkuConversions: string;
  instoreSkuRevenue: string;
  instoreSkuUnits: string;
  instoreSkuConversions: string;
  totalSkuRevenue: string;
  totalSkuUnits: string;
  totalSkuConversions: string;
  totalSkuConversionRate: string;
  totalSkuRoas: string;
}

const n = (v: number) => Math.round(v).toLocaleString('en-GB');
const eur = (v: number) => `€${Math.round(v).toLocaleString('en-GB')}`;
const pct = (v: number, d = 1) => `${(v * 100).toFixed(d)}%`;
const DAY = 86_400_000;

export function bookingRow(db: DbData, booking: Booking): CampaignBookingRow {
  const campaign = db.campaigns.find((c) => c.id === booking.campaignId);
  const engine = campaign?.engine as EngineId | undefined;
  const plan = campaign && db.mediaPlans.find((p) => p.id === campaign.mediaPlanId);
  const product = productForBooking(db, booking);
  const positions = booking.positionIds.map((id) => db.positions.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
  const placements = [...new Set(positions.map((p) => db.placements.find((x) => x.id === p.placementId)?.name).filter(Boolean))];
  const retail = (campaign?.retailProductIds ?? []).map((id) => db.retailProducts.find((r) => r.id === id)).filter((r): r is NonNullable<typeof r> => !!r);
  const brands = db.advertisers.flatMap((a) => a.brands).filter((b) => plan?.brandIds.includes(b.id)).map((b) => b.name);
  const t = bookingTotals(db, booking);
  const r = ratesOf(t);
  const online = engine ? DELIVERY_RATES[engine].onlineShare : 0.5;
  const health = bookingHealth(db, booking.id);
  const days = Math.max(1, Math.round((Date.parse(booking.endDate) - Date.parse(booking.startDate)) / DAY) + 1);
  return {
    id: booking.id,
    name: booking.name,
    status: planStatusLabel(booking.status),
    channel: product?.name ?? '—',
    placement: placements.join(', ') || '—',
    position: positions.map((p) => p.name).join(', ') || '—',
    destination: product?.partner ?? placements.join(', '),
    start: booking.startDate,
    end: booking.endDate,
    // A concern found on the booking reads as advice to rebalance; else on track.
    aiRecommendation: health ? 'Optimize Budget' : 'On track',
    brand: brands.join(', ') || '—',
    retailProduct: retail.map((p) => p.name).join(', ') || '—',
    retailMedia: { images: retail.map((p) => p.image), total: retail.length },
    location: 'All stores',
    readiness: booking.creativeStatus === 'approved' ? 'Ready' : booking.creativeStatus === 'submitted' ? 'Awaiting approval' : 'Creative missing',
    creativeDeadline: new Date(Date.parse(booking.startDate) - 4 * DAY).toISOString().slice(0, 10),
    keywords: '—',
    products: retail.length,
    dailyBudget: eur(booking.budget / days),
    adSpend: eur(t.spend),
    spent: eur(t.spend),
    impressions: n(t.impressions),
    clicks: n(t.clicks),
    viewability: pct(r.viewability),
    cpc: r.cpc ? `€${r.cpc.toFixed(2)}` : '—',
    avgCPC: r.cpc ? `€${r.cpc.toFixed(2)}` : '—',
    ctr: pct(r.ctr, 2),
    cpm: `€${r.cpm.toFixed(2)}`,
    ecpm: `€${(r.viewability > 0 ? r.cpm / r.viewability : r.cpm).toFixed(2)}`,
    conversions: n(t.conversions),
    sales: eur(t.sales),
    roas: `${Math.round(r.roas * 100)}%`,
    onlineSkuRevenue: eur(t.sales * online),
    onlineSkuUnits: n(t.units * online),
    onlineSkuConversions: n(t.conversions * online),
    instoreSkuRevenue: eur(t.sales * (1 - online)),
    instoreSkuUnits: n(t.units * (1 - online)),
    instoreSkuConversions: n(t.conversions * (1 - online)),
    totalSkuRevenue: eur(t.sales),
    totalSkuUnits: n(t.units),
    totalSkuConversions: n(t.conversions),
    // Bought per click: purchases per click. Otherwise purchases are
    // attributed to views, so per impression.
    totalSkuConversionRate: pct(product?.pricingBasis === 'cpc' ? r.cvr : t.impressions > 0 ? t.conversions / t.impressions : 0, 2),
    totalSkuRoas: `${Math.round(r.roas * 100)}%`,
  };
}

/** The rows of one campaign's bookings (drafts included — they are listed,
 *  with nothing delivered). Without a campaign, the proposition's. */
export function campaignBookingRows(db: DbData, campaignId: string | undefined, engine?: EngineId): CampaignBookingRow[] {
  const bookings = campaignId
    ? db.bookings.filter((b) => b.campaignId === campaignId)
    : db.bookings.filter((b) => db.campaigns.find((c) => c.id === b.campaignId)?.engine === engine);
  return bookings.map((b) => bookingRow(db, b));
}

