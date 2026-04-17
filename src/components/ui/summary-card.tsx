"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Badge } from "./badge"

// ─── Types ────────────────────────────────────────────────────────────────────

export type SummaryCardVariant = "details" | "process" | "order"

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
}

/** A named group of items used in the `details` variant */
export interface SummaryGroup {
  label: string
  items: SummaryItem[]
}

export interface SummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card heading */
  title: string
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
  /** Small footnote text below actions */
  footer?: string
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
                disabled={step.status !== "completed"}
              >
                {step.label}
              </button>
              {step.status === "completed" && step.values && step.values.length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {step.values.map((v, i) => (
                    <div key={i} className="text-xs text-muted-foreground">{v}</div>
                  ))}
                </div>
              )}
              {step.status === "completed" && step.value && !step.values && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {step.value}
                </div>
              )}
              {step.status === "active" && (
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
      subtitle,
      variant = "details",
      items,
      groups,
      steps,
      sections,
      totals,
      actions,
      footer,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-neutral-100 text-card-foreground text-[14px]",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <h2 className="text-[18px] font-semibold leading-tight tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[13px] text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          {variant === "details" && (items || groups) && (
            <DetailsContent items={items} groups={groups} />
          )}
          {variant === "process" && steps && (
            <ProcessContent steps={steps} />
          )}
          {variant === "order" && sections && (
            <OrderContent sections={sections} totals={totals} />
          )}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="px-6 pb-4 space-y-2">
            {actions.map((action, i) => (
              <Button
                key={i}
                variant={action.variant ?? "default"}
                className="w-full"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon && (
                  <span className="mr-2 flex items-center">{action.icon}</span>
                )}
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Footer note */}
        {footer && (
          <div className="px-6 pb-5 text-[12px] text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    )
  },
)
SummaryCard.displayName = "SummaryCard"

export { SummaryCard }
