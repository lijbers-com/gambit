import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Eye, MoreHorizontal, Percent, Euro, Store, TvMinimalPlay, Megaphone } from 'lucide-react';
import { FillRateBar, FillRateValue } from './fill-rate-bar';
import { AvailableTimeBar, AvailableTimeValue } from './available-time-bar';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './tooltip';

export type BookingStatus = 'booked' | 'confirmed' | 'reserved' | 'overbooked';

export interface Booking {
  id: string;
  name: string;
  startWeek: number;
  endWeek: number;
  stores: number;
  color?: string;
  variant?: "default" | "success" | "warning" | "destructive";
  /** Semantic booking status. When set, the badge uses the matching
   *  per-theme chart shade for booked/confirmed/reserved and the
   *  warning token for overbooked regardless of `variant`. */
  status?: BookingStatus;
  /** Booked impressions for this campaign. Surfaced on the badge so
   *  yield managers can read sold volume from the calendar at a glance.
   *  When omitted, a stable demo value is derived from `stores`. */
  impressions?: number;
  /** Booked revenue (€) for this campaign. Surfaced on the badge when
   *  the calendar is in Revenue view. When omitted, a demo value is
   *  derived from impressions at €4 CPM. */
  revenue?: number;
}

/** One drill-down level under a channel — typically a screen or banner position. */
export interface Position {
  id: string;
  name: string;
  availability: CalendarCellValue[];
}

/** Color mapping for the four booking statuses. Booked / Confirmed /
 *  Reserved pull from the per-theme chart shade ramp so each theme
 *  retunes automatically; overbooked stays on the warning ramp
 *  because it's a semantic alert state (not chart data). */
export const bookingStatusColors: Record<BookingStatus, string> = {
  booked:     'hsl(var(--chart-800))',
  confirmed:  'hsl(var(--chart-500))',
  reserved:   'hsl(var(--chart-300))',
  overbooked: 'hsl(var(--warning-500))',
};
export const bookingStatusLabels: Record<BookingStatus, string> = {
  booked: 'Booked', confirmed: 'Confirmed', reserved: 'Reserved', overbooked: 'Overbooked',
};

/** Booking-status counts for a single calendar cell — used by the
 *  Bookings view tab on the digital media in-store calendar. */
export type BookingsCellValue = {
  bookingStatusCounts: Partial<Record<BookingStatus, number>>;
};

/** A cell can be a single number/string, a fill-rate breakdown, an
 *  available-time breakdown, or per-status booking counts. */
export type CalendarCellValue = number | string | FillRateValue | AvailableTimeValue | BookingsCellValue;

const isBookingsCellValue = (v: any): v is BookingsCellValue =>
  typeof v === 'object' && v !== null && 'bookingStatusCounts' in v;

const isAvailableTimeValue = (v: any): v is AvailableTimeValue =>
  typeof v === 'object' && v !== null && (
    'noAvailable' in v || 'lowAvailable' in v || 'mediumAvailable' in v || 'highAvailable' in v
  );

const isFillRateValue = (v: any): v is FillRateValue =>
  typeof v === 'object' && v !== null && !isAvailableTimeValue(v) && !isBookingsCellValue(v);

// Per-cell impressions target for the Impressions view. Derived from the
// product id + week index so the value is stable per cell and varied
// across the grid. Range tuned to 200K–600K so the "85% / 330K" label is
// readable and feels like real ad inventory. Defensively coerces a missing
// productId to an empty string so the helper never throws on weird data.
const computeImpressionsTotal = (productId: string | undefined, weekIndex: number): number => {
  const seed = String(productId ?? '')
    .split('')
    .reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
  const mix = (seed + weekIndex * 9301 + 49297) % 233280;
  const ratio = mix / 233280;        // 0..1
  // 200K base + up to ~400K extra, rounded to nearest 10K.
  return Math.round((200_000 + ratio * 400_000) / 10_000) * 10_000;
};

// Format impressions compactly for the booking-bar badge.
export const fmtImpressionsCompact = (n: number): string => {
  if (!Number.isFinite(n) || n < 0) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) {
    const k = n / 1_000;
    return k >= 100 ? `${Math.round(k)}K` : `${k.toFixed(1)}K`;
  }
  return `${Math.round(n)}`;
};

// Derive a stable per-booking impressions count from the booking's id +
// `stores` field. Real data should carry impressions explicitly; this is
// the fallback for demo bookings that don't. Guards against a missing
// booking object so the renderer never throws on partial data.
export const computeBookingImpressions = (booking: { id?: string; stores?: number; impressions?: number } | null | undefined): number => {
  if (!booking) return 0;
  if (typeof booking.impressions === 'number') return booking.impressions;
  const idSeed = String(booking.id ?? '')
    .split('')
    .reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
  const storesBase = Math.max(50, booking.stores ?? 100);
  // ~1K-3K impressions per store, varied per booking by id seed.
  const mult = 1.0 + ((idSeed % 200) / 100); // 1.0 .. 3.0
  return Math.round(storesBase * mult * 1_000);
};

// Format € amounts compactly (€420, €4.8K, €1.2M).
export const fmtRevenueCompact = (n: number): string => {
  if (!Number.isFinite(n) || n < 0) return '€0';
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) {
    const k = n / 1_000;
    return k >= 100 ? `€${Math.round(k)}K` : `€${k.toFixed(1)}K`;
  }
  return `€${Math.round(n)}`;
};

// Derive per-booking revenue. Honour an explicit `revenue` field when the
// data carries one; otherwise back-calc from impressions at a €4 CPM
// (€4 per 1000 impressions) — the same CPM the cell-level Revenue view
// uses in the calendar's demo data.
export const computeBookingRevenue = (booking: { id?: string; stores?: number; impressions?: number; revenue?: number } | null | undefined): number => {
  if (!booking) return 0;
  if (typeof booking.revenue === 'number') return booking.revenue;
  const impressions = computeBookingImpressions(booking);
  return Math.round(impressions * 0.004); // €4 CPM
};

// Decide what value the badge on the booking bar shows for the current
// calendar view. Impressions / Revenue / Available Stores each surface
// the matching booking field; views that don't have a meaningful
// per-booking unit (Fill rate %, Available time, the Bookings status
// view) fall back to impressions because that's the most useful default.
type BookingBadgeMode = 'impressions' | 'revenue' | 'stores' | 'time' | 'none';

const bookingBadgeModeFor = (displayType: string | undefined): BookingBadgeMode => {
  switch (displayType) {
    case 'impressionsBar':
    case 'reach':
      return 'impressions';
    case 'revenue':
      return 'revenue';
    case 'stores':
      return 'stores';
    case 'availableTimeBar':
    case 'availableTime':
      return 'time';
    case 'bookedCampaigns':
    case 'fillRate':
    case 'fillRateBar':
    default:
      // Bookings view + the fill-rate views all keep showing impressions
      // — yield managers consistently read "how big is this campaign".
      return 'impressions';
  }
};

const formatBookingBadge = (
  booking: Booking,
  displayType: string | undefined,
): { value: string; ariaLabel: string } | null => {
  const mode = bookingBadgeModeFor(displayType);
  switch (mode) {
    case 'revenue': {
      const v = computeBookingRevenue(booking);
      const value = fmtRevenueCompact(v);
      return { value, ariaLabel: `${value} revenue` };
    }
    case 'stores': {
      const v = booking.stores ?? 0;
      const value = v.toLocaleString();
      return { value, ariaLabel: `${value} stores` };
    }
    case 'time': {
      // Per-booking "time" doesn't have a real unit; fall through to
      // impressions which is what yield managers actually want here.
      const v = computeBookingImpressions(booking);
      const value = fmtImpressionsCompact(v);
      return { value, ariaLabel: `${value} impressions` };
    }
    case 'none':
      return null;
    case 'impressions':
    default: {
      const v = computeBookingImpressions(booking);
      const value = fmtImpressionsCompact(v);
      return { value, ariaLabel: `${value} impressions` };
    }
  }
};

export interface MediaProduct {
  id: string;
  name: string;
  availability: CalendarCellValue[];
  bookings?: Booking[];
  isHighlighted?: boolean[];
  /** When provided, expanding the channel row reveals these positions
   *  before the bookings — typically screens or banner positions on
   *  this channel. */
  positions?: Position[];
}

export interface RetailerEvent {
  week: number;
  name: string;
}

export interface CalendarTableProps {
  mediaProducts: MediaProduct[];
  weeks: number;
  startWeek?: number;
  retailerEvents?: RetailerEvent[];
  showReach?: boolean;
  displayType?: 'reach' | 'fillRate' | 'fillRateBar' | 'impressionsBar' | 'availableTimeBar' | 'revenue' | 'stores' | 'players' | 'bookedCampaigns';
  className?: string;
  onCellClick?: (mediaProduct: MediaProduct, weekNumber: number, value: CalendarCellValue) => void;
  /** Fires when the channel name (left column) is clicked. Use to open a
   *  focused view of that channel's positions. When omitted, the channel
   *  name stays static. */
  onChannelClick?: (mediaProduct: MediaProduct) => void;
  /** Fires when a booking ("project") bar is clicked. Use to open the
   *  campaign detail page. When omitted, the bar isn't interactive. */
  onBookingClick?: (booking: Booking) => void;
  /** Cap on how many position rows render inline under an expanded channel.
   *  When the channel has more positions, a "+N more positions" link appears
   *  that fires onChannelClick to open the focused view. Default 5. */
  maxInlinePositions?: number;
  hideGreyCells?: boolean;
  hasRetailProductFilter?: boolean;
}

export const CalendarTable: React.FC<CalendarTableProps> = ({ 
  mediaProducts, 
  weeks = 6, 
  startWeek = 1,
  retailerEvents = [],
  showReach = false,
  displayType = 'reach',
  className,
  onCellClick,
  hideGreyCells = false,
  hasRetailProductFilter = false,
  onChannelClick,
  onBookingClick,
  maxInlinePositions = 5,
}) => {
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
  const [isCommercialCalendarOpen, setIsCommercialCalendarOpen] = React.useState(true);

  const toggleRow = (id: string) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleCommercialCalendar = () => {
    setIsCommercialCalendarOpen(prev => !prev);
  };

  const weekNumbers = Array.from({ length: weeks }, (_, i) => startWeek + i);

  const chartColors = [
    'bg-chart-1 text-white border-chart-1',
    'bg-chart-2 text-white border-chart-2',
    'bg-chart-3 text-white border-chart-3',
    'bg-chart-4 text-white border-chart-4',
    'bg-chart-5 text-white border-chart-5',
  ];

  const getThemeColorStyle = (index: number) => {
    const colorVar = `--chart-${(index % 5) + 1}`;
    return {
      backgroundColor: `hsl(var(${colorVar}))`,
      color: 'white',
      borderColor: `hsl(var(${colorVar}))`,
    };
  };

  // Commercial agenda events use neutral grey shades from the theme palette,
  // not the chart palette. Sharing the chart palette confused users into
  // reading events as a third bar segment; greys keep them legible without
  // competing with the actual data colors.
  const eventGreyShades: Array<{ bg: string; fg: string }> = [
    { bg: 'rgb(var(--neutral-700))', fg: 'white' },
    { bg: 'rgb(var(--neutral-500))', fg: 'white' },
    { bg: 'rgb(var(--neutral-300))', fg: 'rgb(var(--neutral-900))' },
    { bg: 'rgb(var(--neutral-200))', fg: 'rgb(var(--neutral-900))' },
  ];
  const getCommercialAgendaColorStyle = (index: number) => {
    const shade = eventGreyShades[index % eventGreyShades.length];
    return {
      backgroundColor: shade.bg,
      color: shade.fg,
      borderColor: shade.bg,
    };
  };

  const hasEventInWeek = (weekNum: number) => {
    return retailerEvents.some(event => event.week === weekNum);
  };

  const renderAvailabilityCell = (value: CalendarCellValue, weekIndex: number, mediaProduct: MediaProduct, isHighlighted?: boolean) => {
    const hasEvent = hasEventInWeek(weekNumbers[weekIndex]);

    // Bookings cell: small status-colored count chips
    // (■4 ■1 = 4 booked + 1 reserved).
    if (isBookingsCellValue(value)) {
      const handleCellClick = () => {
        if (onCellClick) onCellClick(mediaProduct, weekNumbers[weekIndex], value);
      };
      const counts = value.bookingStatusCounts;
      const order: BookingStatus[] = ['booked', 'confirmed', 'reserved', 'overbooked'];
      const chips = order
        .map((status) => ({ status, count: counts[status] ?? 0 }))
        .filter((c) => c.count > 0);
      return (
        <td
          key={weekIndex}
          className="px-3 py-[11px] align-middle text-center cursor-pointer hover:bg-neutral-50 transition-colors"
          onClick={handleCellClick}
        >
          {chips.length === 0 ? (
            <span className="text-sm text-neutral-400">—</span>
          ) : (
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {chips.map((c) => (
                <div
                  key={c.status}
                  className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[10px] font-semibold leading-none tabular-nums"
                  style={{
                    backgroundColor: bookingStatusColors[c.status],
                    // Light-green "reserved" needs dark text for contrast;
                    // every other status has enough contrast against white.
                    color: c.status === 'reserved' ? 'hsl(var(--chart-900))' : 'white',
                  }}
                  title={`${bookingStatusLabels[c.status]}: ${c.count}`}
                >
                  {c.count}
                </div>
              ))}
            </div>
          )}
        </td>
      );
    }

    // Available-time breakdown cell (DOOH loops): no / low / medium / high.
    if (isAvailableTimeValue(value)) {
      const handleCellClick = () => {
        if (onCellClick) onCellClick(mediaProduct, weekNumbers[weekIndex], value);
      };
      return (
        <td
          key={weekIndex}
          className="p-0 align-middle hover:bg-neutral-50 transition-colors"
          onClick={handleCellClick}
        >
          <AvailableTimeBar value={value} height={10} showLabels className="px-3 py-[11px]" />
        </td>
      );
    }

    // Fill-rate breakdown cell: render the stacked bar + per-segment percentages.
    if (isFillRateValue(value)) {
      const handleCellClick = () => {
        if (onCellClick) onCellClick(mediaProduct, weekNumbers[weekIndex], value);
      };
      // When the calendar is in Impressions mode, derive a stable
      // per-cell impressions target so the label row shows "85% / 330K"
      // alongside the percentage. The target is keyed off the product id
      // + week index so the same cell always renders the same number;
      // varied across cells so the demo doesn't look uniform.
      const impressionsTotal =
        displayType === 'impressionsBar'
          ? computeImpressionsTotal(mediaProduct.id, weekIndex)
          : undefined;
      return (
        <td
          key={weekIndex}
          className="p-0 align-middle hover:bg-neutral-50 transition-colors"
          onClick={handleCellClick}
        >
          <FillRateBar
            value={value}
            height={10}
            showLabels
            className="px-3 py-[11px]"
            impressionsTotal={impressionsTotal}
          />
        </td>
      );
    }

    // Never show empty cells - always display value or dash
    // Removed the null check that returned empty cells

    // Format the display value
    let displayValue: string = '';
    if (value === null || value === undefined) {
      displayValue = '—';
    } else if (typeof value === 'number') {
      // For numbers, add % sign only for fillRate display type
      if (displayType === 'fillRate') {
        displayValue = `${value}%`;
      } else if (displayType === 'revenue') {
        // Format revenue with K/M for thousands/millions
        if (value >= 1000000) {
          displayValue = `€${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
          displayValue = `€${Math.round(value / 1000)}K`;
        } else {
          displayValue = `€${value}`;
        }
      } else if (displayType === 'reach') {
        // Format reach numbers compactly (300K to 3M range)
        if (value >= 1000000) {
          // For millions: show 1 decimal if less than 10M, otherwise round
          const millions = value / 1000000;
          displayValue = millions < 10 ? `${millions.toFixed(1)}M` : `${Math.round(millions)}M`;
        } else if (value >= 100000) {
          // For hundreds of thousands: round to nearest thousand
          displayValue = `${Math.round(value / 1000)}K`;
        } else if (value >= 1000) {
          // For thousands: show with K
          displayValue = `${(value / 1000).toFixed(1)}K`;
        } else {
          displayValue = value.toString();
        }
      } else if (displayType === 'stores') {
        displayValue = value.toString();
      } else if (displayType === 'bookedCampaigns') {
        displayValue = value.toString();
      } else {
        // Default formatting for other numeric values
        if (value >= 1000000) {
          displayValue = `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
          displayValue = `${Math.round(value / 1000)}K`;
        } else {
          displayValue = value.toString();
        }
      }
    } else {
      // For strings, use as-is
      displayValue = value.toString();
    }
    
    // Use neutral colors for all cells - no highlighting
    let colorClass = "text-neutral-700"; // Neutral color for all cells
    let borderColorClass = "border-b-neutral-400";
    let iconColorClass = "text-neutral-400";
    
    // Removed all color logic - keeping neutral colors for all values
    // No more red/green/orange highlighting based on values
    
    const handleCellClick = () => {
      if (onCellClick) {
        onCellClick(mediaProduct, weekNumbers[weekIndex], value);
      }
    };

    // Show reach icon based on showReach prop
    const shouldShowIcon = showReach !== false;

    return (
      <td 
        key={weekIndex} 
        className={cn(
          "px-3 py-[11px] align-middle text-center cursor-pointer hover:bg-neutral-50 transition-colors"
          // Removed thick border and conditional border coloring
        )}
        onClick={handleCellClick}
      >
        <div className="flex items-center justify-center gap-1">
          <span className={cn(
            "text-sm font-semibold",
            colorClass
          )}>
            {displayValue || '—'}
          </span>
          {shouldShowIcon && displayValue && displayValue !== '—' && (() => {
            const IconComponent = displayType === 'reach' ? Eye 
              : displayType === 'fillRate' ? Percent 
              : displayType === 'revenue' ? Euro 
              : displayType === 'stores' ? Store 
              : displayType === 'players' ? TvMinimalPlay 
              : displayType === 'bookedCampaigns' ? Megaphone
              : Eye;
            return <IconComponent className={cn("w-4 h-4 flex-shrink-0", iconColorClass)} />;
          })()}
        </div>
      </td>
    );
  };

  const renderBooking = (booking: Booking, weekNumbers: number[], bookingIndex: number, totalBookings: number) => {
    const startCol = Math.max(0, weekNumbers.indexOf(booking.startWeek));
    const endCol = Math.min(weeks - 1, weekNumbers.indexOf(booking.endWeek));
    const colspan = endCol - startCol + 1;
    
    const cells = [];
    
    // Add empty cells before the booking
    for (let i = 0; i < startCol; i++) {
      cells.push(
        <td key={`empty-${i}`} className={cn(
          "px-4 align-middle",
          bookingIndex === 0 ? "pt-6 pb-0.5" : bookingIndex === totalBookings - 1 ? "pt-0.5 pb-6" : "py-0.5"
        )}>
          <div style={{ minHeight: 32 }} />
        </td>
      );
    }
    
    // Add the booking cell
    if (colspan > 0) {
      cells.push(
        <td 
          key={booking.id} 
          colSpan={colspan}
          className={cn(
            "px-4 align-middle",
            bookingIndex === 0 ? "pt-6 pb-0.5" : bookingIndex === totalBookings - 1 ? "pt-0.5 pb-6" : "py-0.5"
          )}
        >
          <div style={{ minHeight: 32 }} className="flex items-center">
            {(() => {
              // The badge value depends on the active view: Impressions
              // shows volume, Revenue shows €, Available Stores shows
              // store count, everything else falls back to impressions.
              const badge = formatBookingBadge(booking, displayType);
              // Common interactive props + classes shared between the
              // status-coloured bar and the neutral fallback bar so they
              // render at the same height / padding / font weight as the
              // events bar above.
              const interactive = onBookingClick
                ? {
                    role: 'button' as const,
                    tabIndex: 0,
                    onClick: (e: React.MouseEvent) => { e.stopPropagation(); onBookingClick(booking); },
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onBookingClick(booking);
                      }
                    },
                  }
                : {};
              const sharedClass = cn(
                "w-full flex items-center gap-2 px-3 py-1 rounded-full text-left text-xs font-medium truncate max-w-full whitespace-nowrap overflow-hidden",
                onBookingClick && "cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              );
              if (booking.status) {
                const isLight = booking.status === 'reserved';
                return (
                  <div
                    {...interactive}
                    className={sharedClass}
                    style={{
                      backgroundColor: bookingStatusColors[booking.status],
                      color: isLight ? 'hsl(var(--chart-900))' : 'white',
                    }}
                    title={`${booking.name} (${bookingStatusLabels[booking.status]})${badge ? ` — ${badge.ariaLabel}` : ''}`}
                  >
                    <span className="truncate flex-1">{booking.name}</span>
                    {badge && (
                      <span
                        className="shrink-0 tabular-nums text-[10px] font-semibold opacity-90"
                        aria-label={badge.ariaLabel}
                      >
                        {badge.value}
                      </span>
                    )}
                  </div>
                );
              }
              return (
                <div
                  {...interactive}
                  className={cn(sharedClass, "bg-neutral-100 text-neutral-900 border border-border")}
                  title={`${booking.name}${badge ? ` — ${badge.ariaLabel}` : ''}`}
                >
                  <span className="truncate flex-1">{booking.name}</span>
                  {badge && (
                    <span
                      className="shrink-0 tabular-nums text-[10px] font-semibold text-muted-foreground"
                      aria-label={badge.ariaLabel}
                    >
                      {badge.value}
                    </span>
                  )}
                </div>
              );
            })()}
          </div>
        </td>
      );
    }
    
    // Add empty cells after the booking
    for (let i = endCol + 1; i < weeks; i++) {
      cells.push(
        <td key={`empty-after-${i}`} className={cn(
          "px-4 align-middle",
          bookingIndex === 0 ? "pt-6 pb-0.5" : bookingIndex === totalBookings - 1 ? "pt-0.5 pb-6" : "py-0.5"
        )}>
          <div style={{ minHeight: 32 }} />
        </td>
      );
    }
    
    return cells;
  };

  const zonesColumnWidth = '240px';
  // Wider columns when the cells render a stacked bar — the per-segment
  // labels need room to breathe.
  //  - `impressionsBar` is the widest (label is "85% / 330K", up to ~12 chars)
  //  - `fillRateBar` / `availableTimeBar` show shorter "85%" labels
  //  - simple numeric / status cells stay compact
  const weekColumnWidth =
    displayType === 'impressionsBar'
      ? '160px'
      : displayType === 'fillRateBar' || displayType === 'availableTimeBar'
      ? '140px'
      : '100px';

  return (
    <TooltipProvider delayDuration={150}>
    <div className={cn('overflow-x-auto bg-white border border-border rounded-xl', className)}>
      {/* Main Table */}
      <table className="w-full text-sm text-neutral-700" style={{ minWidth: `${240 + (weeks * parseInt(weekColumnWidth))}px`, tableLayout: 'fixed' }}>
        <thead className="bg-[var(--brand-page-bg-hex)]">
          <tr>
            <th
              className="h-14 px-4 py-3 text-left font-normal text-foreground tracking-wide whitespace-nowrap bg-[var(--brand-page-bg-hex)]"
              style={{ width: zonesColumnWidth, minWidth: zonesColumnWidth }}
            >
              Media products
            </th>
            {weekNumbers.map(week => (
              <th
                key={week}
                className="h-14 px-4 py-3 text-center font-normal text-foreground tracking-wide whitespace-nowrap bg-[var(--brand-page-bg-hex)]"
                style={{ width: weekColumnWidth, minWidth: weekColumnWidth }}
              >
                Week {week}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Commercial Calendar Row */}
          {retailerEvents.length > 0 && (
            <React.Fragment>
              <tr className="bg-white border-b border-border">
                <td className="px-4 py-[11px] align-middle">
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] text-neutral-700 truncate whitespace-nowrap overflow-hidden">Events</span>
                    <button
                      onClick={toggleCommercialCalendar}
                      className="ml-auto p-1 rounded-full hover:bg-neutral-100 focus:outline-none"
                    >
                      {isCommercialCalendarOpen ? (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                      )}
                    </button>
                  </div>
                </td>
                {weekNumbers.map(weekNum => {
                  const eventsInWeek = retailerEvents.filter(event => event.week === weekNum);

                  // Tally count per event name within this week (in case the data
                  // ever carries multiple entries for the same event in one week).
                  const countsByEvent = eventsInWeek.reduce((acc, e) => {
                    acc[e.name] = (acc[e.name] ?? 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);

                  return (
                    <td key={weekNum} className="px-4 py-[11px] align-middle text-center">
                      <div className="flex items-center justify-center gap-1">
                        {!isCommercialCalendarOpen && Object.entries(countsByEvent).map(([name, count]) => {
                          // Find the event index in the overall event groups to get consistent color
                          const eventGroups = retailerEvents.reduce((groups, e) => {
                            if (!groups[e.name]) {
                              groups[e.name] = [];
                            }
                            groups[e.name].push(e.week);
                            return groups;
                          }, {} as Record<string, number[]>);

                          const eventIndex = Object.keys(eventGroups).findIndex(n => n === name);
                          const style = getCommercialAgendaColorStyle(eventIndex);

                          return (
                            <div
                              key={name}
                              className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[10px] font-semibold leading-none tabular-nums"
                              style={style}
                              title={`${name}: ${count}`}
                            >
                              {count}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
              
              {/* Commercial Calendar Events (when expanded) */}
              {isCommercialCalendarOpen && (() => {
                // Group events by name to handle multi-week events
                const eventGroups = retailerEvents.reduce((groups, event) => {
                  if (!groups[event.name]) {
                    groups[event.name] = [];
                  }
                  groups[event.name].push(event.week);
                  return groups;
                }, {} as Record<string, number[]>);

                return Object.entries(eventGroups).map(([eventName, weeks], index) => {
                  const sortedWeeks = weeks.sort((a, b) => a - b);
                  const startWeek = sortedWeeks[0];
                  const endWeek = sortedWeeks[sortedWeeks.length - 1];
                  const totalEvents = Object.keys(eventGroups).length;
                  
                  return (
                    <tr key={`event-${eventName}`} className={cn(
                      "bg-white",
                      index === totalEvents - 1 && "border-b border-border"
                    )}>
                      <td className={cn(
                        "px-4 align-middle",
                        index === 0 ? "pt-6 pb-0.5" : index === totalEvents - 1 ? "pt-0.5 pb-6" : "py-0.5"
                      )}>
                        <div style={{ minHeight: 32 }} />
                      </td>
                      {(() => {
                        const startCol = Math.max(0, weekNumbers.indexOf(startWeek));
                        const endCol = Math.min(weekNumbers.length - 1, weekNumbers.indexOf(endWeek));
                        const colspan = endCol - startCol + 1;
                        
                        const cells = [];
                        
                        // Add empty cells before the event
                        for (let i = 0; i < startCol; i++) {
                          cells.push(
                            <td key={`empty-${i}`} className={cn(
                              "px-4 align-middle",
                              index === 0 ? "pt-6 pb-0.5" : index === totalEvents - 1 ? "pt-0.5 pb-6" : "py-0.5"
                            )}>
                              <div style={{ minHeight: 32 }} />
                            </td>
                          );
                        }
                        
                        // Add the event cell
                        if (colspan > 0) {
                          cells.push(
                            <td 
                              key={eventName} 
                              colSpan={colspan}
                              className={cn(
                                "px-4 align-middle",
                                index === 0 ? "pt-6 pb-0.5" : index === totalEvents - 1 ? "pt-0.5 pb-6" : "py-0.5"
                              )}
                            >
                              <div style={{ minHeight: 32 }} className="flex items-center justify-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className="w-full px-3 py-1 rounded-full text-left text-xs font-medium truncate max-w-full whitespace-nowrap overflow-hidden cursor-default"
                                      style={getCommercialAgendaColorStyle(index)}
                                    >
                                      {eventName}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="bg-background text-foreground border border-border p-3 shadow-lg max-w-xs"
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span
                                          className="h-2.5 w-2.5 rounded-sm shrink-0"
                                          style={getCommercialAgendaColorStyle(index)}
                                        />
                                        <span className="font-semibold">{eventName}</span>
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {startWeek === endWeek
                                          ? `Week ${startWeek}`
                                          : `Week ${startWeek} – Week ${endWeek} · ${sortedWeeks.length} weeks`}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Retail event — campaigns running this period may see higher demand.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </td>
                          );
                        }
                        
                        // Add empty cells after the event
                        for (let i = endCol + 1; i < weekNumbers.length; i++) {
                          cells.push(
                            <td key={`empty-after-${i}`} className={cn(
                              "px-4 align-middle",
                              index === 0 ? "pt-6 pb-0.5" : index === totalEvents - 1 ? "pt-0.5 pb-6" : "py-0.5"
                            )}>
                              <div style={{ minHeight: 32 }} />
                            </td>
                          );
                        }
                        
                        return cells;
                      })()}
                    </tr>
                  );
                });
              })()}
            </React.Fragment>
          )}
          
          {/* Media Products */}
          {mediaProducts.map((product, productIndex) => (
            <React.Fragment key={product.id}>
              <tr className={cn(
                'bg-white',
                productIndex !== mediaProducts.length - 1 && 'border-b border-border'
              )}>
                <td className="px-4 py-[11px] align-middle">
                  <div className="flex items-center gap-3">
                    {onChannelClick ? (
                      <button
                        type="button"
                        onClick={() => onChannelClick(product)}
                        className="text-[14px] text-neutral-700 truncate whitespace-nowrap overflow-hidden text-left hover:text-foreground hover:underline underline-offset-2 focus:outline-none focus-visible:underline cursor-pointer"
                        title={`Open ${product.name}`}
                      >
                        {product.name}
                      </button>
                    ) : (
                      <span className="text-[14px] text-neutral-700 truncate whitespace-nowrap overflow-hidden">{product.name}</span>
                    )}
                    <button
                      onClick={() => toggleRow(product.id)}
                      className="ml-auto p-1 rounded-full hover:bg-neutral-100 focus:outline-none"
                    >
                      {expandedRows.includes(product.id) ? (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                      )}
                    </button>
                  </div>
                </td>
                {product.availability.slice(0, weeks).map((value, i) =>
                  renderAvailabilityCell(value, i, product, product.isHighlighted?.[i])
                )}
              </tr>

              {/* Expanded positions (ad positions / screens under the channel) — capped at maxInlinePositions */}
              {expandedRows.includes(product.id) && product.positions && product.positions.slice(0, maxInlinePositions).map((position) => (
                <tr key={`pos-${position.id}`} className="bg-neutral-50/50">
                  <td
                    className="py-[11px] align-middle pl-8 pr-4"
                    style={{ width: zonesColumnWidth, maxWidth: zonesColumnWidth }}
                  >
                    {/* Block-level + truncate so long position names cut off
                        with an ellipsis instead of bleeding into week cells. */}
                    <div
                      className="text-[13px] text-neutral-600 truncate"
                      title={position.name}
                    >
                      ↳ {position.name}
                    </div>
                  </td>
                  {position.availability.slice(0, weeks).map((value, i) =>
                    renderAvailabilityCell(value, i, { ...product, name: position.name }, undefined)
                  )}
                </tr>
              ))}

              {/* "+N more positions" row — appears when the channel has more
                  positions than maxInlinePositions and points the user at
                  the focused view (opened via onChannelClick). */}
              {expandedRows.includes(product.id) && product.positions && product.positions.length > maxInlinePositions && (
                <tr className="bg-neutral-50/50">
                  <td
                    colSpan={weeks + 1}
                    className="py-[9px] align-middle pl-8 pr-4"
                  >
                    {onChannelClick ? (
                      <button
                        type="button"
                        onClick={() => onChannelClick(product)}
                        className="text-[12px] text-muted-foreground hover:text-foreground hover:underline underline-offset-2 focus:outline-none focus-visible:underline cursor-pointer"
                      >
                        +{product.positions.length - maxInlinePositions} more position{product.positions.length - maxInlinePositions === 1 ? '' : 's'} — open {product.name} →
                      </button>
                    ) : (
                      <span className="text-[12px] text-muted-foreground">
                        +{product.positions.length - maxInlinePositions} more position{product.positions.length - maxInlinePositions === 1 ? '' : 's'}
                      </span>
                    )}
                  </td>
                </tr>
              )}

              {/* Expanded bookings */}
              {expandedRows.includes(product.id) && product.bookings && product.bookings.map((booking, bookingIndex) => (
                <tr key={booking.id} className={cn(
                  "bg-white",
                  bookingIndex === 0 && "pt-6", // 24px top padding for first row
                  bookingIndex === product.bookings!.length - 1 && "pb-6 border-b border-border" // 24px bottom padding and border for last row
                )}>
                  <td className={cn(
                    "px-4 align-middle",
                    bookingIndex === 0 ? "pt-6 pb-0.5" : bookingIndex === product.bookings!.length - 1 ? "pt-0.5 pb-6" : "py-0.5"
                  )}>
                    <div style={{ minHeight: 32 }} />
                  </td>
                  {renderBooking(booking, weekNumbers, bookingIndex, product.bookings!.length)}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    </TooltipProvider>
  );
};