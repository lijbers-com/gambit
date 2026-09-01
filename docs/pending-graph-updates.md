# Pending EpicContext graph updates

**Project:** Edge — `5c6890b4-731a-483f-a54b-d14f71425759` (ahold-delhaize/edge)

## Landed (no action needed)

| Block | Section / type | Key |
|---|---|---|
| Edge Colour System | brand / `brand_visual_identity` | `edge-color-system` |
| Edge Typography | brand / `brand_visual_identity` | `edge-typography` |
| Edge Iconography | brand / `brand_visual_identity` | `edge-iconography` |
| Edge Design System — Overview | design_system / `section_guide` | `design-system-overview` |
| Design system (Storybook link) — coverage corrected | design_system / `storybook_link` | `design-system` |
| Edge Visual Identity — "purple" corrected | brand / `brand_visual_identity` | `edge-visual-identity` |
| Recommendation Engine | product / `feature` | `recommendation-engine` |
| Auto Pacing | product / `feature` | `auto-pacing` |

> Note on types: the brand section *lists* `brand_color_palette`, `brand_typography`,
> `brand_iconography` as allowed, but those block-type masters are **not registered** in
> this deployment — `create_block` returns `Unknown block type`. They were created as
> `brand_visual_identity` instead. If the masters get registered, migrate them.

---

## Still to write

> 2026-08-31 (evening): the connector was re-added and ALL fourteen parked
> design-system writes landed (table + summary-card updates, metric-card,
> campaign-summary, charts, fill-rate-bar, inbox, filter-bar, search-select-list,
> hierarchy-badge, split-button, read-only-field, alert, avatar, slider, and the
> overview refresh — 26 specs total). Only the two items below remain.

### 0. Page components — 27 remaining (mechanical)

2026-09-01: the uses/route chain is live. 16 atom specs created (checkbox, switch,
textarea, tabs, dialog, popover, dropdown-menu, tooltip, toast, search-input,
searchable-select, target-select, notification-dot, objective-kpi-select,
retail-product-select, level-meter), 15 composed specs carry `uses`, and 7 page
components exist (media-plan-detail, campaign-overview, create-media-experience,
create-proposition-campaign, line-item-detail, bookings-calendar, notification-center
— key pattern `<template>-page`, `layer: page`, `route` = the content_page's slug,
`uses` naming the parts). The remaining ~27 content pages (accounts & hierarchy,
creatives, insights dashboards, engine configuration, login, edge-os-landing, home,
faq-configuration, bookings-overview, campaign-details, …) each owe one page spec on
the same pattern: get_block the content_page in `product` for its slug, then
create_block with route + uses.

### 1. UPDATE — the blocks the wizard/approval work invalidated

Read first with `get_context_for_task`, then update.

- **`feature/media-plans`** — a plan now has a **draft state**: after the wizard it stays
  `draft` until every campaign and booking on it is approved. In that state the plan detail
  page hides the control bar, opens **Campaigns & bookings** by default, hides Insights and
  Logs, and shows the per-campaign **setup cards**. The plan flips itself to `in-option` the
  moment nothing on it is awaiting approval.
- **`feature/campaigns`** — setup cards are a *guide only* (no budget/run-time editing on
  them); their action is **Start**, which opens the next unfinished step's own wizard.
  Bookings must always belong to a campaign, and "add booking" only exists inside one.
  Campaign wizard steps: Setup → Advertiser → Run time & budget → Bookings → Creatives.
  Booking sub-steps: Setup → Run time & budget → Placement → Targeting (delivery behaviour
  and objectives are part of Targeting). Objectives and auto-budget were removed from the
  campaign wizard — they are media-plan concepts. Creative linking is a step of the booking
  wizard; there is no separate creative wizard. `returnTo` + `afterBooking` carry the user
  back to the plan or campaign they started from and on into the remaining bookings.
- **`constraint/status-and-task-model`** — `draft` now means *proposed, not yet approved*
  for plans, campaigns and bookings alike, and approval is an explicit step.

### 2. CREATE — a `research_data` report for the system audit's open gaps

Creatives have no DB entity and five competing status vocabularies; the booking calendar is
mock-only and `db.availability` is unused; engine → route/label/icon maps are duplicated up
to 9×; `db.metricDefinitions` is unused; `'stopped'` and `'ready'` are not in `PlanStatus`;
`savePlan` can overwrite with stale state on the plan details tab; SP bookings overload
`positionIds` with keyword strings.
