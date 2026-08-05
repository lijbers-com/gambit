import type { DbData, DbUser, EngineId, FaqEntry, FaqSurfaceId, UserSide } from './types';

/**
 * FAQs attached to templates.
 *
 * The platform is used by people with very different amounts of context: a
 * campaign manager who books every day, and an advertiser in self-service who
 * sees the screen once a quarter. Rather than growing the interface copy for
 * the least experienced reader, each template can carry a set of questions the
 * retailer answers in their own words — and the retailer maintains them without
 * a release, in the configuration area.
 *
 * Entries are stored (unlike inbox messages, which are derived) because they
 * are authored content: someone writes them, edits them and takes them down.
 */

export interface FaqSurface {
  id: FaqSurfaceId;
  /** Name as it appears in the configuration area. */
  label: string;
  /** What the surface is, so an editor knows where their entry will show up. */
  description: string;
  /** Steps or tabs within the template. An entry may target one of them. */
  sections: { id: string; label: string }[];
}

/**
 * Every template that can carry FAQs. Adding a surface here makes it available
 * in the configuration area; the template itself opts in by rendering
 * <FaqPanel surface="…" />.
 */
export const FAQ_SURFACES: FaqSurface[] = [
  {
    id: 'create-media-plan',
    label: 'Create media plan',
    description: 'The media plan wizard. Entries can target a single step.',
    // Ids match the wizard's own step ids (wizardSteps in
    // create-media-experience.stories.tsx) so a step passes its id straight
    // through to <FaqPanel section={…} />.
    sections: [
      { id: 'setup', label: 'Setup' },
      { id: 'advertiser', label: 'Advertiser' },
      { id: 'targeting', label: 'Goal and objectives' },
      { id: 'budget', label: 'Run time & budget' },
      { id: 'review', label: 'Media plan' },
    ],
  },
  {
    id: 'create-campaign',
    label: 'Create campaign',
    description: 'The per-proposition campaign wizard.',
    sections: [
      { id: 'setup', label: 'Setup' },
      { id: 'targeting', label: 'Targeting' },
      { id: 'budget', label: 'Budget & schedule' },
      { id: 'creatives', label: 'Creatives' },
    ],
  },
  {
    id: 'media-plan-detail',
    label: 'Media plan detail',
    description: 'A single media plan and its campaigns.',
    // Ids are the template's own tab values.
    sections: [
      { id: 'details', label: 'Media plan details' },
      { id: 'inbox', label: 'Notifications' },
      { id: 'campaigns', label: 'Campaigns & bookings' },
      { id: 'insights', label: 'Insights' },
      { id: 'logs', label: 'Logs' },
    ],
  },
  {
    id: 'campaign-detail',
    label: 'Campaign detail',
    description: 'A single campaign and its bookings.',
    // Ids are the template's own tab values. Sponsored products lists
    // products where the other propositions list bookings.
    sections: [
      { id: 'details', label: 'Details' },
      { id: 'bookings', label: 'Bookings' },
      { id: 'products', label: 'Products' },
      { id: 'creatives', label: 'Creatives' },
      { id: 'insights', label: 'Insights' },
      { id: 'logs', label: 'Logs' },
    ],
  },
  {
    id: 'booking-detail',
    label: 'Booking detail',
    description: 'A single booking — placements, run time and creatives.',
    sections: [
      { id: 'details', label: 'Details' },
      { id: 'placements', label: 'Placements' },
      { id: 'creatives', label: 'Creatives' },
    ],
  },
  { id: 'campaign-overview', label: 'Campaign overview', description: 'The campaign list per proposition.', sections: [] },
  { id: 'bookings-overview', label: 'Bookings overview', description: 'The booking list per proposition.', sections: [] },
  { id: 'creatives', label: 'Creatives', description: 'Creative upload and approval.', sections: [] },
  { id: 'insights', label: 'Insights', description: 'Reporting and insight views.', sections: [] },
  { id: 'home', label: 'Home', description: 'The landing page for every user.', sections: [] },
];

export const faqSurface = (id: FaqSurfaceId): FaqSurface | undefined =>
  FAQ_SURFACES.find((s) => s.id === id);

export const faqSurfaceLabel = (id: FaqSurfaceId): string => faqSurface(id)?.label ?? id;

export const faqSectionLabel = (surface: FaqSurfaceId, section?: string): string | undefined =>
  section ? faqSurface(surface)?.sections.find((s) => s.id === section)?.label ?? section : undefined;

/**
 * Whether this user may add or change FAQ entries.
 *
 * Everyone on the retailer side. Anyone running the platform runs into the
 * questions advertisers ask, and the person best placed to answer one is
 * usually whoever just answered it in an email — narrowing this to a few
 * roles would mean the help only gets written when those people have time.
 * Advertisers read the FAQs; they never write them.
 */
export const canManageFaq = (user: Pick<DbUser, 'side'> | null | undefined): boolean =>
  !!user && user.side === 'retailer';

export interface FaqQuery {
  surface: FaqSurfaceId;
  /** Return entries for this section plus the surface-wide ones. */
  section?: string;
  /** Return entries for this proposition plus the proposition-agnostic ones. */
  engine?: EngineId;
  /** The reader. Entries aimed at the other side are left out. */
  side?: UserSide;
  /** Include drafts — only the configuration area does. */
  includeDrafts?: boolean;
}

/**
 * The entries to show on a template.
 *
 * Filters widen rather than narrow: asking for the "goal" step returns the
 * step's own entries *and* the ones written for the whole wizard, because a
 * general answer is still relevant on a specific step.
 */
export function faqsFor(db: DbData, query: FaqQuery): FaqEntry[] {
  return db.faqs
    .filter((f) => f.surface === query.surface)
    .filter((f) => f.published || query.includeDrafts)
    .filter((f) => !f.section || !query.section || f.section === query.section)
    .filter((f) => !f.engine || !query.engine || f.engine === query.engine)
    .filter((f) => !query.side || f.audience === 'all' || f.audience === query.side)
    .sort((a, b) => a.order - b.order);
}

/** Every entry for a surface, drafts included — the configuration list. */
export const faqsForSurface = (db: DbData, surface: FaqSurfaceId): FaqEntry[] =>
  db.faqs.filter((f) => f.surface === surface).sort((a, b) => a.order - b.order);
