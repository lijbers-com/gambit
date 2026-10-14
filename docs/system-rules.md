# Edge prototype — architecture & system rules

> The central map of how the prototype works. Master copy in EpicContext:
> **Tech Stack → `prototype-architecture`**. This file mirrors it for whoever
> opens the repo — change both in the same go.

The prototype has three layers. The **design system** says what things look
like. **Templates** compose them into pages. The **rules layer** makes the
pages behave the way Edge will: every number, status, message and price on a
page comes from one rule module that reads the data. A template never invents
any of it.

```
Design system   src/components/ui            how it looks     EpicContext: Design System (component specs)
     ↓
Templates       src/components/layout/       what a page      EpicContext: Product (content pages)
                page-templates, app/         shows
     ↓  read through
Rules layer     src/lib, src/lib/db/*.ts     what it means    this document + Decisions
     ↓  read
Data            src/lib/db (store + seed)    what is true     prototype-data-schema
```

## Ground rules

1. **Templates hold no numbers and no rules of their own.** A page reads
   through a rule module (`useDb()` plus the module's functions). If two
   pages need the same figure, it comes from the same function. Mock arrays
   inside a template are debt to be moved into the seed.
2. **Derived, never stored.** Anything that follows from the facts is
   computed when it is read. That covers messages, to-dos, health, inventory
   load and fill rates, billing state, setup steps, recommendations,
   forecasts and prices. Only facts and authored content are stored:
   entities, configuration, creatives, FAQs, holds and the invoice mirror.
   That is why a page and its inbox can never disagree.
3. **One source per concept.** There is one status vocabulary, one forecast,
   one funnel → KPI framework, one inventory model, one target-group
   catalogue, one creative library and one colour and pattern per
   proposition. If you find a second copy, it is a bug.
4. **The same rule at every level.** Media plan → campaign → booking:
   - Pausing a plan is pausing each of its campaigns and bookings.
   - Health rolls up.
   - Workflow boards read the same way at each level.
5. **Configuration drives the product.** The retailer's configuration decides
   what the product does: media products and positions, pricing rules,
   workflows, configuration rules, the metric registry, health thresholds,
   FAQs and terms. Change the configuration and the calendar, prices,
   to-dos and metric rows change with it.
6. **Everything is created through a wizard.** A detail page is the result of
   a wizard, never an empty draft. The wizard and the detail form render the
   same presentational blocks (`create-entities.ts`; see
   wizard ↔ form parity).
7. **One clock.** The prototype does not move in time: the seed is written as
   of **30 July 2026** and no bookings arrive after it. Everything that asks
   "what is today?" asks `lib/clock.ts`. That includes:
   - prices that reward booking early, and hold expiry
   - delivery pacing, health and billable state
   - the calendars' opening weeks and the date pickers' presets

   Never use `new Date()` for business time. Audit stamps (`createdAt`, chat
   times) stay real time.
8. **The seed is the world.** If a page looks empty, the seed has nothing
   there. Add bookings to the seed rather than faking the cells. Bump
   `SEED_VERSION` when the seed changes.

## The rules, per domain

| Domain | The rule | Code | Context |
|---|---|---|---|
| **Data & hierarchy** | Media plan → campaign → booking (booking = line item). A campaign runs on exactly one proposition (engine). Deletes cascade. The CRUD API is shaped like the future backend contract. | `db/types.ts`, `db/store.ts`, `db/seed.ts` | `prototype-data-schema`, `decision-client-side-prototype-database` |
| **Status vocabulary** | One lifecycle for plan, campaign and booking: draft → in review → approved → scheduled → live → completed, with the side states changes requested, paused and cancelled. Creatives have their own lifecycle. Stored codes (in-option, running) map to these words in one place. Inventory hold is a separate dimension, never a lifecycle label. Blockers are never statuses; they become to-dos. | `lib/status-vocabulary.ts` | `shared-status-vocabulary`, `badge` |
| **Lifecycle actions** | Run, pause and stop mean the same at every level and cascade down. Stop is terminal. | `db/lifecycle.ts` | — |
| **Workflows** | A retailer's board per proposition defines the stages and steps. Edge ticks off steps from the data. The workflow bar, the setup cards and the to-dos read the same reading. | `db/workflow-state.ts`, `db/setup-steps.ts` | `workflow-status-lifecycle-proposal`, `workflow-discovery` |
| **To-dos & notifications** | Each open workflow step that asks for a to-do or a reminder becomes one action message, with its stage's steps attached. A to-do exists exactly as long as its step is open. | `db/workflow-todos.ts`, `db/tasks.ts` | `status-and-task-model` |
| **Inbox** | Four kinds: Health · To do · Recommendation · Insight. Every message is derived and has no timestamp. Only read/done state is stored, per user. | `db/messages.ts`, `db/inbox-state.ts` | `inbox`, `notification-center` |
| **Health** | Health reports concerns only; "nothing found" is not "healthy". Indicators have one of two severities (needs attention, at risk) and are detected per level, then rolled up. The score comes from the checks, blockers cap it, and every score shows its reason. Thresholds are configuration. | `db/health.ts` | — |
| **Recommendations** | A recommendation is a template: a pure function from measured numbers to a proposal. It always has exactly two answers, accept or decline, and accept names the change it makes. Notifications only deliver it. | `lib/recommendations.ts`, `lib/case-templates.ts` | `recommendation-engine` |
| **Media products & positions** | A proposition owns media products, and a product groups positions (optionally in placements). Positions are the smallest bookable unit, each with its capacity (store count for in-store). | `db/types.ts`, configuration pages | `media-products-pricing-engine` |
| **Inventory** | Capacity is per position per ISO week, in the goal unit: stores (offline), clicks (sponsored products) or impressions (everything else). Each non-draft booking takes its volume (its goal, else budget at list price) over its run time. Booked, confirmed and reserved follow the booking's state. Fill rate, available stores, available time, impressions, revenue and booking counts all come from these same bookings. The calendars, the availability check, demand pricing and the media product page all read this one model. | `db/inventory.ts` | `decision-one-inventory-model`, `calendar-table` |
| **Pricing** | A price is the list price multiplied by every active rule that matches (scope, dates, conditions), in priority order. The build-up is shown with the number. The retailer manages indexes, not prices. Demand rules read fill rate from the inventory model. | `db/pricing.ts` | `media-products-pricing-engine` |
| **Holds** | A booking in review holds units on a position at the price that stood when it was booked. The hold expires after the product's hold days (on the clock), is confirmed on approval and is released on cancel. | `db/pricing.ts` (`holdsFor`), `db/store.ts` | `media-products-pricing-engine` |
| **Guaranteed bookings** | A guaranteed booking has a goal (in the proposition's unit), delivery against it, and a price that moves from indicative to quoted to agreed and then never moves again. The availability check reads the inventory model. | `db/guaranteed.ts` | — |
| **Billing** | Edge owns what is billable; the billing service owns invoices. A completed booking is billable at its agreed price (guaranteed) or its spend (auction). Under-delivery is invoiced as delivered, with the shortfall as a credit beside the agreed price. | `db/billing.ts`, `lib/billing-service.ts` | — |
| **Goals, objectives & KPIs** | One funnel measurement framework. The wizard picks from it, and the plan page reads the same maps back. Stored ids stay Dutch; the labels are English. | `lib/funnel.ts`, `lib/objective-kpi-copy.ts` | `decision-kpi-funnel-framework` |
| **Metrics** | The per-proposition metric registry is the agreed metric set. Metric rows render from it, and card keys are identical at overview, campaign and booking scope. | `db` `metricDefinitions`, `lib/proposition-metrics.ts` | `prototype-data-schema` |
| **Forecast** | One forecast model for the wizard and the plan page, shown as a ±8% band, never a point. | `lib/forecast.ts` | — |
| **Budget allocation** | Money follows return: each campaign's share is proportional to spend × ROAS. Campaigns that have not delivered yet get an even share. | `lib/budget-allocation.ts` | `auto-pacing` |
| **Retail products** | Products sit under brands, and brands under organisations. Pickers narrow to the brands or advertiser in play, matched by name. | `db/retail-products.ts` | — |
| **Creatives** | A booking links an existing creative from the advertiser's library and never invents one. Formats are per proposition. Approval runs in the engine. | `lib/creatives.ts` | `creative-portal` |
| **Targeting** | One online target-group catalogue for the booking pages and the wizards. | `lib/target-groups.ts` | — |
| **Colour per proposition** | Each proposition has one tint of the chart blue and one pattern. Grey and white are reserved for unspent or open. | `lib/proposition-patterns.tsx` | `charts` |
| **Help content** | FAQs and terms are authored by the retailer in configuration and attached to templates. | `db/faq.ts` | `faq-configuration` |
| **Users & branding** | Users map 1:1 to the personas. Retailer-side users get the Edge chrome; advertiser-side users get the retailer's brand and the advertiser navigation. | `db/session.ts` | `login`, personas |
| **Campaign agent** | The agent starts from one message and its business case, a fenced set of data, never the whole database. | `lib/agent-context.ts` | `dashboard` (Campaign Agent) |
| **Time** | One prototype today, 30 July 2026, for every business date. Calendars open on it and show twelve weeks. | `lib/clock.ts` | this document |

## Adding something

- **A new number or state on a page:** find the rule module above, add a
  function there, and read it from the template. If no module fits, start
  one with a header comment that states the rule. Record the decision in
  EpicContext (Decisions) and add a row to this table.
- **A new component or pattern:** follow its EpicContext component spec.
  Update the spec in the same change.
- **A seed change:** keep it consistent with the clock (dates around
  30 July 2026) and bump `SEED_VERSION`. Run
  `npx tsx scripts/verify-db.ts`.

## Known gaps

- `verify-db` still expects five to-dos from the old rule list (before the
  workflow boards). The expectations need updating to the workflow-driven
  to-dos.
- Many template mocks (dashboard and insight charts, the yield overview)
  still generate their own numbers instead of reading the store.
- Store-type shares and unit conversions in the inventory model are demo
  calibrations until the ad server and store master data supply them.
- The publisher picker in the calendar header is not wired.
