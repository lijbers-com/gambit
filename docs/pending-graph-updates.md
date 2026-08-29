# Pending EpicContext graph updates

The EpicContext MCP connector dropped mid-session ("connection to this connector was
invalidated — the user needs to reconnect it"). Everything below is written verbatim so
the next session can land it without redoing the work.

**Project:** Edge — `5c6890b4-731a-483f-a54b-d14f71425759` (ahold-delhaize/edge)

## Already landed (no action needed)

| Block | Section / type | Key |
|---|---|---|
| Edge Colour System | brand / `brand_visual_identity` | `edge-color-system` |
| Edge Typography | brand / `brand_visual_identity` | `edge-typography` |
| Edge Iconography | brand / `brand_visual_identity` | `edge-iconography` |

> Note on types: the brand section *lists* `brand_color_palette`, `brand_typography`,
> `brand_iconography` as allowed, but those block-type masters are **not registered** in
> this deployment — `create_block` returns `Unknown block type`. They were created as
> `brand_visual_identity` instead. If the masters get registered, migrate them.

---

## 1. CREATE — design_system / `section_guide` / `design-system-overview`

**name:** Edge Design System — Overview
**status:** complete
**reason:** There was no single page describing the design system — only a Storybook link.
This is the overview: the three layers, the full component inventory (108 primitives,
34 page templates), the composed blocks that keep wizards and detail pages identical, and
the rules for adding to it.

> If `section_guide` is not a registered type either, create it as a second
> `storybook_link` block in `design_system` (value `{"url": "https://gambit-woad.vercel.app/",
> "visual_identity_ref": "edge-visual-identity"}`).

**body:**

```markdown
## Answer first

The Edge design system is **three layers deep and one library wide**: colour and type tokens → 108 UI primitives → 34 page templates. Every screen in the product is a composition of the layer below it, and the whole thing is documented and rendered in Storybook from the same source the app ships.

- **Storybook (live, every component + variant):** https://gambit-woad.vercel.app/
- **Running prototype (the same components in the product):** https://gambit.epicstories.nl/
- **Tokens:** [[edge-color-system]] · **Type:** [[edge-typography]] · **Icons:** [[edge-iconography]]

The unusual part, and the reason the system does not drift: **the app's routes render the Storybook stories.** A page template's story `render()` function *is* the page. There is no second implementation of a screen for documentation, so a story cannot go stale, and a change made in Storybook is the change that ships.

## Layer 1 — Tokens

CSS variables in `src/styles/globals.css`, mapped to Tailwind utilities in `tailwind.config.js`. Five retailer themes swap the values, never the components. Full detail in [[edge-color-system]].

## Layer 2 — 108 UI primitives (`src/components/ui/`)

Built on **shadcn/ui + Radix UI**, styled with Tailwind, varied with **CVA**, typed strict, `forwardRef` by default. 42 have their own Storybook story; the rest are exercised through the templates.

### Shell & navigation (18)
`app-layout` · `side-navigation` · `navigation-item` · `navigation-item-with-submenu` · `navigation-create-item` · `smart-breadcrumbs` (+ `-simple`) · `page-header` · `header-actions` · `header-search` · `logo` · `theme-switcher` · `version-switcher` · `session-date-range` · `tabs` · `tab-actions` · `viewbar` · `separator`

### Controls & inputs (16)
`button` · `add-button` · `split-button` · `input` (+ `FieldHint`) · `textarea` · `label` · `checkbox` · `switch` · `slider` · `search-input` · `searchable-select` · `search-select-list` · `selection-list` · `suggestion-list` · `link-picker` · `read-only-field`

### Dates (4)
`date-picker` (`DateRangePicker`, `futureDateRangePresets`) · `calendar` · `calendar-table` · `available-time-bar`

### Domain selects (10) — the fields that know retail media
`advertiser-select` · `advertiser-brand-products` · `retail-product-select` · `target-select` · `budget-select` · `attribution-window-select` · `objective-kpi-select` · `buying-type-picker` · `goal-select` · `goal-card`

### Overlays & messaging (11)
`dialog` · `drawer` · `right-drawer` · `message-drawer` · `popover` · `dropdown-menu` · `tooltip` · `toast` · `alert` · `chat-interface` · `conversation-template`

### Data display (14)
`table` · `table-pagination` · `pagination` · `card` · `summary-card` · `campaign-summary` · `badge` · `hierarchy-badge` · `avatar` · `metric-row` · `forecast-metrics` · `level-meter` · `fill-rate-bar` · `optimisation-card`

### Charts (10)
`chart` · `chart-frame` · `chart-showcase` · `area-chart` · `bar-chart` · `line-chart` · `pie-chart` · `radar-chart` · `funnel-chart` · `conversion-funnel` · `map-chart`

### Notifications & help (10)
`inbox` · `inbox-panel` · `notification-item` · `notification-dot` · `notification-settings` · `insights-notifications` · `message-advertiser` · `faq` · `faq-panel` · `marketing`

### Filters, icons & the rest (9)
`filter` · `filter-bar` · `hierarchy-sidebar` · `lifecycle-actions` · `proposition-icon` · `custom-icons` · `render-icon` · `breadcrumb` · `add-campaign-menu`

## Layer 2½ — The composed blocks (this is where drift is prevented)

Eight components exist for one reason: **the wizard and the detail page must be the same UI**. Each is the single implementation of one job, used by every surface that does that job. When a form and its wizard step diverge, the fix is to move the divergent UI into one of these — not to patch both.

| Block | Owns | Used by |
|---|---|---|
| `create-placement` | channel search-and-select, then ad-position tweaking in a modal (+ optional bid column) | display & offsite booking forms, booking wizard step |
| `booking-budget-runtime` | "Run time & budget" — one range field with retail moments + week numbers, start/end times, active days | every booking form and wizard (`bordered={false}` inside a wizard card) |
| `delivery-settings` | delivery behaviour + objectives (`ToggleRow`, `ToggleSection`, `MiniSelect`, defaults, copy) | display booking detail, booking wizard targeting step |
| `target-select` + `lib/target-groups` | the online target-group catalogue | booking pages, both wizards |
| `summary-card` | `details` / `process` variants, `collapsible`, click-to-open, page-background while in progress and white when finished | campaign and booking wizards, timelines, detail pages |
| `setup-checklist` | the per-campaign guide cards on a plan: derived steps, progress, Skip / Start | media plan detail (draft state) |
| `goal-select` | the stacked, expanding goal chooser with brand / media / sales KPI columns | media plan wizard step 3 |
| `control-bar` | an entity's governing facts and actions, in ONE row that drops items rather than wrapping | media plan, campaign and booking detail pages |

## Layer 3 — 34 page templates (`src/components/layout/page-templates/`)

Each is a Storybook story that the matching app route renders.

**Working surfaces** — `media-plan-detail` · `create-media-experience` (media plan wizard) · `create-proposition-campaign` (campaign + booking wizard) · `campaign-overview` · `campaign-details` · `line-item-detail` · `bookings-overview` · `bookings-calendar` · `media-cart` · `media-orchestra`

**Creatives** — `creative-overview` · `creative-overview-proposition` · `creative-detail`

**Insight** — `dashboard` · `home` · `performance-dashboard` · `yield-dashboard` · `insights-tab` · `search-results`

**Accounts & hierarchy** — `organisation-overview` · `organisation-detail` · `brand-overview` · `brand-detail` · `group-detail` · `product-detail` · `contract-detail` · `users-overview` · `user-profile` · `role-detail` · `token-detail`

**Platform** — `engine-configuration` · `faq-configuration` · `notification-center` · `login` · `edge-os-landing`

## The rules

1. **Never a one-off component.** Extend an existing primitive or add a CVA variant. If a screen needs UI that does not exist, it is a new primitive in `ui/` with a story — not JSX in a page.
2. **Same job → same component.** If a form and a wizard show the same thing, they import the same block (see layer 2½). "It looked different in the wizard" is a bug, not a variant.
3. **A story per component, and the story is the truth.** Adding a component means adding `component-name.stories.tsx` covering its variants, themes and states.
4. **Tokens only** — no hex, no second grey. See [[edge-color-system]].
5. **Accessibility floor is Radix**: focus management, ARIA, keyboard nav. Custom components keep that contract; `forwardRef` on anything that takes a child.
6. **shadcn pattern** — components are copied into the repo, not imported from a library, so we own the source and can specialise per theme without fighting defaults.

### Adding a component — the checklist
TypeScript interface · CVA variants · `forwardRef` · Storybook story · tested in all five themes · responsive · keyboard and screen-reader safe · exported from `ui/index.ts`.

### When to bend
A genuinely one-off marketing surface (the edge.os landing page) may diverge — but it never lives in `src/components/ui/`. Theme-specific colour exceptions are tolerated only as a new CSS variable in `globals.css`, never as inline hex.
```

---

## 2. UPDATE — design_system / `storybook_link` / `design-system`

**reason:** Coverage was stated as "~30 UI primitives, 5+ page templates" — it is 108
primitives and 34 page templates. Also point at the new overview.

Replace the final `## Coverage today` section with:

```markdown
## Coverage today

108 UI primitives in `src/components/ui/` (42 with their own story), 34 page templates in
`src/components/layout/page-templates/`, and 5 retailer themes (Edge/Gambit, Albert Heijn,
Delhaize, ADUSA, Alfa Beta). Every theme is exercised in the Storybook deploy.

The full inventory, the token layers and the composition rules live in
[[design-system-overview]]; the tokens themselves in [[edge-color-system]],
[[edge-typography]] and [[edge-iconography]].

**The app's routes render these stories.** A page template's story `render()` function is
the page the prototype serves — there is no second implementation, so a story cannot go
stale.
```

---

## 3. UPDATE — brand / `brand_visual_identity` / `edge-visual-identity`

**reason:** It described Edge as "purple"; the shipped Edge theme is cream + graphite with
a lime accent (purple is only the unused default `--brand-*` ramp). Also link the three new
foundation blocks.

**body:**

```markdown
## Edge Visual Identity

The implemented look-and-feel of the Edge platform — multi-theme by design, so every Ahold
Delhaize banner gets a co-branded experience on one component library.

## The look

Edge itself is **warm neutral, not colourful**: a cream page canvas (`#fff9eb`), graphite
text and buttons (`#252422` / `#4d4b48`), and a single bright lime accent (`#c8f000`) spent
only on navigation hover and active states. The marketing surface (edge.os) adds the fixed
teal (`#005555`). The 258° purple ramp still sitting in `--brand-*` is a scaffold default,
not the brand.

Retailer themes are the opposite trade: one saturated brand colour (AH cyan, Delhaize red,
ADUSA green, Alfa Beta blue) on a neutral `#fafafa` canvas — and in every theme the chrome
stays neutral, with the brand colour reserved for highlights.

## Foundations

- **Colour and theming** — [[edge-color-system]]
- **Typography** — [[edge-typography]]
- **Iconography and brand marks** — [[edge-iconography]]
- **The component library and its rules** — [[design-system-overview]]

Built on **shadcn/ui + Radix UI + Tailwind CSS**, TypeScript-first. Theme-aware components
(Logo, login background, side nav, charts) read the active theme rather than taking a prop.

## Where it lives

Component documentation: Storybook (gambit-woad.vercel.app). The running prototype applies
the active theme across every page template.
```

---

## 4. UPDATE — the blocks this session's product work invalidated

Read first with `get_context_for_task`, then update. Not yet drafted — the connector
dropped before these were reached.

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
- **Known gaps worth recording as a `research_data` report** (from this session's audit):
  creatives have no DB entity and five competing status vocabularies; the booking calendar
  is mock-only and `db.availability` is unused; engine → route/label/icon maps are
  duplicated up to 9×; `db.metricDefinitions` is unused; `'stopped'` and `'ready'` are not
  in `PlanStatus`; `savePlan` can overwrite with stale state on the plan details tab; SP
  bookings overload `positionIds` with keyword strings.
