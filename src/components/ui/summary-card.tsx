"use client"

import * as React from "react"
import { Check, ChevronDown, WalletCards, Rows3, LayoutList, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { SplitButton } from "./split-button"
import { Badge } from "./badge"

// ─── Types ────────────────────────────────────────────────────────────────────

export type SummaryCardVariant = "details" | "process" | "order"

/** Entities a summary card can describe. The icons match HierarchyBadge and the
 *  inbox, so the same thing looks the same everywhere in the app. */
export type SummaryEntity = "media-plan" | "campaign" | "booking" | "creative"

const entityIcon: Record<SummaryEntity, React.ComponentType<{ className?: string }>> = {
  "media-plan": WalletCards,
  campaign: Rows3,
  booking: LayoutList,
  creative: ImageIcon,
}

/** A single label/value row used in `details` and `order` variants */
export interface SummaryItem {
  label: string
  value: React.ReactNode
  /** Optional original/strikethrough value (e.g. old price) */
  originalValue?: string
  /** Optional inline badge (e.g. "Korting op je abonnement") */
  badge?: string
  badgeColor?: string
}

/** A section header + items used in the `order` variant */
export interface SummarySection {
  label?: string
  items: SummaryItem[]
}

/** A totals row at the bottom of an `order` card */
export interface SummaryTotal {
  label: string
  value: string
  originalValue?: string
  note?: string
  info?: boolean
  bold?: boolean
}

/** A wizard step used in the `process` variant */
export interface SummaryStep {
  id: string
  label: string
  status: "completed" | "active" | "pending"
  /** Single value shown under a completed step (use `values` for a list) */
  value?: string
  /** List of values shown under a completed step */
  values?: string[]
  onClick?: () => void
}

/** An action button shown in the card footer */
export interface SummaryAction {
  label: string
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive"
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  /** Follow-up actions behind a dropdown arrow — renders as a split button
   *  (e.g. Save, with Submit for approval one click further). */
  menu?: { label: string; onClick?: () => void }[]
}

/** A named group of items used in the `details` variant */
export interface SummaryGroup {
  label: string
  items: SummaryItem[]
}

export interface SummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card heading */
  title: string
  /** Which entity this card summarises. Draws the matching hierarchy icon
   *  beside the title, so a booking summary is recognisable as a booking
   *  wherever it appears. */
  entity?: SummaryEntity
  /** Optional subtitle below the title */
  subtitle?: string
  /**
   * `details` — a labelled key/value list (e.g. Campaign details, Booking)
   * `process` — a numbered wizard-step timeline (e.g. Summary sidebar)
   * `order`   — grouped line-items with totals (e.g. order overview)
   */
  variant?: SummaryCardVariant
  /** Flat items for `details` variant */
  items?: SummaryItem[]
  /** Grouped items for `details` variant (renders section headers between groups) */
  groups?: SummaryGroup[]
  /** Steps for `process` variant */
  steps?: SummaryStep[]
  /** Grouped sections for `order` variant */
  sections?: SummarySection[]
  /** Totals block for `order` variant */
  totals?: SummaryTotal[]
  /** Buttons rendered in the card footer */
  actions?: SummaryAction[]
  /** An icon button in the card's top-right — for acting on what the card
   *  describes rather than on the form, e.g. relinking a campaign. */
  headerAction?: {
    icon: React.ReactNode
    /** Accessible name; also the tooltip. */
    label: string
    onClick: () => void
  }
  /** Small footnote text below actions */
  footer?: string
  /** Nothing to summarise yet — renders a centred icon and this text instead
   *  of content, the same shape an empty table uses, so absence reads as
   *  absence rather than as a one-line summary. */
  empty?: string
  /** For INACTIVE context cards (`details` variant): only the entity's name —
   *  the first item's value — stays visible; the remaining details fold
   *  behind an accordion the user can open at any time. The active card of a
   *  page stays fully open; the chain above it collapses to names. */
  collapsible?: boolean
}

// ─── Sub-renderers ────────────────────────────────────────────────────────────

function DetailsItems({ items }: { items: SummaryItem[] }) {
  return (
    <>
      {items.map((item, i) => (
        <div key={i}>
          <div className="text-[13px] font-medium">{item.label}</div>
          <div className="text-[13px] text-muted-foreground flex items-center gap-2 flex-wrap">
            {item.originalValue && (
              <span className="line-through">{item.originalValue}</span>
            )}
            <span>{item.value}</span>
            {item.badge && (
              <Badge
                variant="secondary"
                className={cn("text-[11px]", item.badgeColor)}
              >
                {item.badge}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

function DetailsContent({ items, groups }: { items?: SummaryItem[]; groups?: SummaryGroup[] }) {
  if (groups && groups.length > 0) {
    return (
      <div className="space-y-4">
        {groups.map((group, gi) => (
          <div key={gi}>
            <div className="text-[13px] font-semibold tracking-tight mb-1">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item, i) => (
                <div key={i} className="text-[13px] text-muted-foreground">
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="space-y-3">
      <DetailsItems items={items ?? []} />
    </div>
  )
}

function ProcessContent({ steps }: { steps: SummaryStep[] }) {
  return (
    <div className="relative pl-12">
      {/* Vertical timeline line */}
      <div className="absolute left-[19px] top-[16px] bottom-[16px] w-px bg-border" />
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex items-start -ml-12">
            {/* Step circle */}
            <div className="w-10 flex justify-center flex-shrink-0">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                  step.status === "completed" &&
                    "bg-primary text-primary-foreground",
                  step.status === "active" &&
                    "bg-background text-primary border border-primary",
                  step.status === "pending" &&
                    "bg-background text-muted-foreground border border-border",
                )}
              >
                {step.status === "completed" ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  index + 1
                )}
              </div>
            </div>
            {/* Step label + value */}
            <div className="ml-3 flex-1 min-w-0 pt-1">
              <button
                type="button"
                className={cn(
                  "text-sm text-left w-full",
                  (step.status === "active" || step.status === "completed") &&
                    "font-medium",
                  step.status === "pending" && "text-muted-foreground",
                  step.status === "completed" &&
                    "hover:underline cursor-pointer",
                )}
                onClick={step.onClick}
                disabled={step.status === "pending" || !step.onClick}
              >
                {step.label}
              </button>
              {/* The step you are on has usually captured something already —
                  showing it is the point of the timeline. Only a genuinely
                  empty step says so. */}
              {step.status !== "pending" && step.values && step.values.length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {step.values.map((v, i) => (
                    <div key={i} className="text-xs text-muted-foreground">{v}</div>
                  ))}
                </div>
              )}
              {step.status !== "pending" && step.value && !step.values && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {step.value}
                </div>
              )}
              {step.status === "active" && !step.value && !step.values?.length && (
                <div className="text-xs text-muted-foreground italic mt-0.5">
                  Not filled in
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderContent({
  sections,
  totals,
}: {
  sections: SummarySection[]
  totals?: SummaryTotal[]
}) {
  return (
    <div className="space-y-4">
      {sections.map((section, si) => (
        <div key={si}>
          {section.label && (
            <div className="text-[13px] text-muted-foreground mb-2">
              {section.label}
            </div>
          )}
          <ul className="space-y-2">
            {section.items.map((item, ii) => (
              <li key={ii} className="flex items-center justify-between gap-4">
                <span className="text-[14px]">{item.label}</span>
                <span className="text-[14px] font-medium whitespace-nowrap flex items-center gap-1.5 text-right">
                  {item.originalValue && (
                    <span className="line-through text-muted-foreground font-normal text-[13px]">
                      {item.originalValue}
                    </span>
                  )}
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {totals && totals.length > 0 && (
        <div className="border-t pt-3 space-y-2 mt-2">
          {totals.map((total, ti) => (
            <div key={ti}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] font-semibold">{total.label}</span>
                <span className="text-[14px] font-semibold whitespace-nowrap flex items-center gap-1.5">
                  {total.originalValue && (
                    <span className="line-through text-muted-foreground font-normal text-[13px]">
                      {total.originalValue}
                    </span>
                  )}
                  {total.value}
                </span>
              </div>
              {total.note && (
                <div className="text-[13px] text-muted-foreground mt-0.5">
                  {total.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const SummaryCard = React.forwardRef<HTMLDivElement, SummaryCardProps>(
  (
    {
      title,
      entity,
      subtitle,
      variant = "details",
      items,
      groups,
      steps,
      sections,
      totals,
      actions,
      headerAction,
      footer,
      empty,
      collapsible,
      className,
      ...props
    },
    ref,
  ) => {
    const hasContent =
      (variant === "details" && !!(items || groups)) ||
      (variant === "process" && !!steps) ||
      (variant === "order" && !!sections)
    // Collapsed context card: the first item's value is the entity's NAME and
    // stays visible; everything else waits behind the chevron.
    const isCollapsible = !!collapsible && variant === "details" && !empty && (items?.length ?? 0) > 0
    const [expanded, setExpanded] = React.useState(false)
    // A timeline in progress sits on the page background; once every step
    // is complete the card turns white, like any finished entity's card.
    const timelineFinished = variant === "process" && !!steps && steps.length > 0 && steps.every((st) => st.status === "completed")
    const processSurface = variant === "process" ? (timelineFinished ? "bg-card" : "bg-page") : undefined
    return (
      <div
        ref={ref}
        className={cn(
          // The card owns its padding, evenly on all four sides, and the
          // sections space themselves with the gap. Each section carrying its
          // own bottom padding meant whichever happened to be last decided the
          // card's bottom edge, leaving it shorter than the top.
          "rounded-xl border bg-neutral-100 text-card-foreground text-[14px] p-6 flex flex-col gap-4",
          processSurface,
          isCollapsible && !expanded && "cursor-pointer",
          className,
        )}
        // A collapsed context card opens on click anywhere — the chevron is
        // the affordance, not the only target.
        onClick={isCollapsible && !expanded ? () => setExpanded(true) : undefined}
        {...props}
      >
        {/* Header — on an expanded collapsible card, clicking it folds the
            card back up. */}
        <div
          className={cn("flex items-start justify-between gap-3", isCollapsible && expanded && "cursor-pointer")}
          onClick={isCollapsible && expanded ? () => setExpanded(false) : undefined}
        >
          <div className="min-w-0">
            {/* One line, always: a wrapped two-line heading pushes the whole
                card out of step with the ones beside it. */}
            <h2 className="flex min-w-0 items-center gap-2 text-[18px] font-semibold leading-tight tracking-tight">
              {entity && (() => {
                const EntityIcon = entityIcon[entity]
                return <EntityIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              })()}
              <span className="min-w-0 truncate" title={title}>{title}</span>
            </h2>
            {subtitle && (
              <p className="text-[13px] text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center">
            {headerAction && (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                onClick={(e) => { e.stopPropagation(); headerAction.onClick(); }}
                aria-label={headerAction.label}
                title={headerAction.label}
                // Small and quiet: the card's subject is the summary, not this.
                className="-mr-1.5 -mt-1.5 h-7 w-7 shrink-0 text-muted-foreground"
              >
                {headerAction.icon}
              </Button>
            )}
            {isCollapsible && (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                aria-label={expanded ? "Hide details" : "Show details"}
                aria-expanded={expanded}
                title={expanded ? "Hide details" : "Show details"}
                className="-mr-1.5 -mt-1.5 h-7 w-7 shrink-0 text-muted-foreground"
              >
                <ChevronDown className={cn("h-4 w-4 transition-transform", !expanded && "-rotate-90")} />
              </Button>
            )}
          </div>
        </div>

        {/* The entity's name — always visible on a collapsed context card,
            because knowing WHAT the chain hangs under never folds away. */}
        {isCollapsible && (
          <div className="-mt-2 min-w-0 truncate text-[13px] font-medium">{items![0].value}</div>
        )}

        {/* Nothing linked yet: absence drawn as absence — a centred icon and
            a line, the same shape an empty table uses. */}
        {empty && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            {entity && (() => {
              const EntityIcon = entityIcon[entity]
              return <EntityIcon className="h-6 w-6 text-muted-foreground/40" />
            })()}
            <span className="text-[13px] text-muted-foreground">{empty}</span>
          </div>
        )}

        {/* Content. Rendered only when there is some, so an empty card does not
            keep a gap where the body would have been. A collapsed context card
            shows it only once opened — minus the name, which is already up top. */}
        {!empty && hasContent && (!isCollapsible || expanded) && (
          <div>
            {variant === "details" && (items || groups) && (
              <DetailsContent items={isCollapsible ? items?.slice(1) : items} groups={groups} />
            )}
            {variant === "process" && steps && (
              <ProcessContent steps={steps} />
            )}
            {variant === "order" && sections && (
              <OrderContent sections={sections} totals={totals} />
            )}
          </div>
        )}

        {/* Actions */}
        {/* A left-aligned row at their natural width — the same footer the form
            itself has, so the card and the form read as one set of actions
            rather than two competing ones. */}
        {actions && actions.length > 0 && (
          <div className="flex gap-2">
            {actions.map((action, i) =>
              action.menu ? (
                <SplitButton
                  key={i}
                  label={action.label}
                  onClick={action.onClick}
                  menu={action.menu}
                  variant={action.variant ?? "default"}
                />
              ) : (
                <Button
                  key={i}
                  variant={action.variant ?? "default"}
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  {action.icon && (
                    <span className="mr-2 flex items-center">{action.icon}</span>
                  )}
                  {action.label}
                </Button>
              )
            )}
          </div>
        )}

        {/* Footer note */}
        {footer && (
          <div className="text-[12px] text-muted-foreground">{footer}</div>
        )}
      </div>
    )
  },
)
SummaryCard.displayName = "SummaryCard"

export { SummaryCard }
