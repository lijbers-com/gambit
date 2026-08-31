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

> 2026-08-31 (second connector drop, mid spec-expansion): the registry now serves
> ~55 previews including all table variants, metric cards, charts, calendar bars,
> the media-plan card and the stacked summary cards (deployed; commit "The registry
> grows to the full working set"). The spec writes below were prepared but the MCP
> connection closed before they landed. Land them verbatim, `section: design_system`,
> `type: component_spec`, `status: complete`, value fields as noted; every preview_url
> is live on gambit.epicstories.nl.

### A. UPDATE component_spec/table — variants now visible

value.variants →
- Reading table — `?key=table` — "The default: rows of records with typed columns and status badges."
- Row selection — `?key=table--selectable` — "Bulk actions — checkboxes in a leading column via rowSelection."
- Expandable child rows — `?key=table--expandable` — "Hierarchy in one table — campaigns with their bookings; chevron column, children indented pl-6."
- Row actions — `?key=table--actions` — "Per-row edit/overflow — icon-only ghost buttons in a trailing column."
- Empty state — `?key=table--empty` — "Says what would fill it — never a bare header."

Body: keep current, but open with "Row selection, expandable child rows, row actions,
empty states and fixed columns are **props, not forks** — the five variants above are
the same component with different props, and each has a live preview." Add guideline:
expandable rows put the chevron in its own leading column; children keep every value in
its own column, only the nesting marker moves (`TABLE_CHILD_INDENT` = pl-6). Empty
tables state what would fill them. Row actions are icon-only ghost buttons with
aria-label.

### B. UPDATE component_spec/summary-card — add the stack

Add variant: Stacked — `?key=summary-card--stack` — "The wizard's right rail: a
finished campaign collapsed to its name above the active booking's process card —
only the active card carries a CTA."

### C. CREATE component_spec/metric-card — "Metric cards"
group Data display · layer molecule · source src/components/ui/card.tsx (MetricCard) + metric-row.tsx (MetricRow)
preview_url `?key=metric-card` · also_known_as: KPI card, stat tile
variants:
- Default — `?key=metric-card` — "A number, its context sub-line, and a delta badge."
- Sparkline — `?key=metric-card--graph` — "variant=graph: the trend behind the number."
- Donut legend — `?key=metric-card--donut` — "Composition with a legend — spend by proposition."
- Top categories — `?key=metric-card--bar` — "barHorizontal: ranked bars with values."
- Budget stacked — `?key=metric-card--budget` — "Spent vs budget per proposition."
- Metric row — `?key=metric-row` — "The row of cards under a page header, with the Edit-metrics picker."

Body highlights: a card is either a number OR a chart, never both (chart renders only
when value is unset). The row caps how many metrics can be picked (maxSelectable) so
cards never fall below min width — the picker stops, not the layout. filterNote names
subsets ("Filtered · 3 of 12 bookings") because filtered totals without saying so read
as wrong totals. Numbers carry tabular-nums. Badge variants reuse the [[badge]] set.
Spec table: card min-width per row layout; label text-sm muted; value text-2xl
font-semibold; sub text-xs muted; charts pull --chart-1..5.

### D. CREATE component_spec/campaign-summary — "Media plan card"
group Product surfaces · layer organism · source src/components/ui/campaign-summary.tsx
preview_url `?key=campaign-summary` · also_known_as: Plan card, CampaignSummary
variants: Collapsed overview — `?key=campaign-summary` — "The /campaigns list: status
badge, notifications line, budget bar, per-engine rows; clicking opens the plan."
Body: the plan's face on the overview — title + status badge, the notifications
summary line, budget spent bar, run time, campaign/booking counts, and one row per
engine with the proposition icon and its campaign's status. collapsedOnly on the
overview (the card is a summary; the detail page is where work happens); wizardDraft
renders the dashed resume-the-wizard variant. Related: [[proposition-icons]],
[[badge]], media-plan-detail page.

### E. CREATE component_spec/charts — "Charts"
group Data display · layer organism · source src/components/ui/{area,line,bar,pie}-chart.tsx + chart.tsx
preview_url `?key=area-chart`
variants:
- Area — `?key=area-chart` — "Volume over time; stacked or overlaid."
- Line — `?key=line-chart` — "Trends compared; supports a right axis (rightAxisDataKey)."
- Bar — `?key=bar-chart` — "Discrete periods or categories."
- Pie/Donut — `?key=pie-chart` — "Composition; config keys are the slice names."
Body: all charts share ChartContainer + ChartConfig ({key: {label, color}}); colours
come ONLY from the --chart-1..5 slot aliases so every theme retunes them; reds and
oranges are reserved for warning/error (see [[edge-color-system]]). Benchmark line via
benchmark prop. Tooltips via shared ChartTooltipContent. Pie data is {name, value}
with config keyed by name.

### F. CREATE component_spec/fill-rate-bar — "Calendar bars"
group Data display · layer molecule · source fill-rate-bar.tsx + available-time-bar.tsx
preview_url `?key=fill-rate-bar`
variants:
- Fill rate — `?key=fill-rate-bar` — "Booked / reserved / available as shares of a cell."
- Overbooked — `?key=fill-rate-bar--overbooked` — "The alert states ride on semantic tokens, not the chart ramp."
- Available time — `?key=available-time-bar` — "Digital in-store loop time by band, with threshold labels."
Body: segment colours pull from the per-theme chart ramp so bars re-skin per theme;
overbooked/overreserved deliberately stay on destructive/warning because "you have a
problem" must not change meaning when the theme changes. showLabels adds the legend
row; impressionsTotal extends labels with absolute volumes. hoverTooltip renders the
structured legend (needs TooltipProvider).

### G. CREATE component_spec/inbox — "Inbox"
group Communication · layer organism · source inbox.tsx (+ inbox-panel.tsx, message-drawer.tsx)
preview_url `?key=inbox`
variants: Message list — `?key=inbox` — "Health, action, recommendation and insight
rows with unread dots, kind badges and the context trail."
Body: the one message list — the notification centre and every entity's Notifications
tab render it. Four kinds only; a non-blocking health message is amber "Needs
attention", not red. Unread dot; context line carries the hierarchy icon (matching
[[hierarchy-badge]]). Opening goes to MessageDrawer: subject, message, business case
(stats + insights), Ask-the-agent, and the kind's answers (recommendations:
Decline / Accept-with-named-change). Empty copy says what the user did right.

### H. CREATE component_spec/filter-bar — "Filter bar"
group Navigation · layer molecule · source filter-bar.tsx (+ filter.tsx)
preview_url `?key=filter-bar`
variants: Filters + search — `?key=filter-bar` — "Multi-select filter chips with
count badges beside the search field."
Body: the row above every table: search left, one popover per filter with
multi-select options (search inside when long), selected counts on the chip;
optional view-switcher dropdown (viewOptions) used by the booking calendars.
Filters never navigate — they narrow the table below them.

### I. CREATE component_spec/search-select-list — "Search selects"
group Inputs & controls · layer molecule · source searchable-select.tsx, search-select-list.tsx, search-input.tsx, target-select.tsx
preview_url `?key=search-select-list`
variants:
- Searchable select — `?key=searchable-select` — "Single choice from a searchable dropdown (advertiser, brand)."
- Search select list — `?key=search-select-list` — "Multi-select: chosen options become cards on the selected surface."
- Target select — `?key=target-select` — "The targeting catalogue: chosen groups open a chip editor with suggestions."
- Search input — `?key=search-input` — "The bare search field."
Body: choosing from a catalogue is search-first everywhere. A chosen option renders
as a card on --surface-selected with its description — the same selected language as
[[goal-select]]. TargetSelect layers the chip editor (renderSelectedExtra) over
SearchSelectList; the catalogue lives in lib/target-groups so wizard and detail page
cannot drift.

### J. CREATE small specs (one block each, same pattern, one variant each)
- component_spec/hierarchy-badge — Data display, atom, `?key=hierarchy-badge`:
  "media-plan / campaign / booking, each with its fixed icon — the same icons the
  inbox context line and summary cards use. An entity looks like its level
  everywhere." Source hierarchy-badge.tsx (PlanLevel).
- component_spec/split-button — Actions, molecule, `?key=split-button`: "A primary
  action with variants behind the chevron (Save · Save and approve). The left half
  is the default; the menu never hides the only action." Source split-button.tsx.
- component_spec/read-only-field — Data display, atom, `?key=read-only-field`:
  "A stated fact in form layout — label, value, optional hint. For inherited or
  derived values that must read as facts, not disabled inputs." Source
  read-only-field.tsx.
- component_spec/alert — Communication, atom, `?key=alert`: "Inline callout with
  title + description. For consequences of an action just taken (plan adjusted),
  not for validation (FieldHint) or status (Badge)." Source alert.tsx.
- component_spec/avatar — Data display, atom, `?key=avatar`: "Initials fallback,
  32px round; used in the header session menu and log tables." Source avatar.tsx.
- component_spec/slider — Inputs & controls, atom, `?key=slider`: "Radix slider on
  the primary track colour; used for weighting and percentage inputs." Source
  slider.tsx.

### K. UPDATE section_guide/design-system-overview
- Coverage: ~55 registry previews; specs now cover Actions (button, split-button),
  Inputs (input, toggle-card, date-range-picker, search selects, slider),
  Containment (table ×5 variants), Communication (badge, inbox, alert), Navigation
  (filter-bar), Data display (summary-card ×4, metric cards ×6, charts ×4, calendar
  bars ×3, hierarchy-badge, avatar, read-only-field), Product surfaces (goal-select,
  setup-checklist, budget-pacing, create-placement, booking-budget-runtime,
  control-bar, proposition-icons, campaign-summary, target-select).
- Still spec-less: overlays (dialog, drawers, popover, dropdown, tooltip, toast),
  navigation chrome (side nav, breadcrumbs, page header, tabs, pagination), domain
  selects (advertiser/retail-product/objective-kpi/buying-type), funnel + map +
  radar charts, chat/conversation, faq, notification settings. Each owes a registry
  entry + spec when touched.


> 2026-08-31 (registry migration session): most of section 1 landed via the
> content_page updates (media-plan-detail, create-proposition-campaign,
> notification-center) and the to-be journey rewrites. Still open: the
> feature/media-plans + feature/campaigns + constraint/status-and-task-model
> body updates themselves, and the section-2 audit report. The design system
> now lives in the EpicContext registry (see decision/adr-design-system-registry).

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
