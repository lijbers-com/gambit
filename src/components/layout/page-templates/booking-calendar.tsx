'use client';

/**
 * The booking calendar, one page for every proposition.
 *
 * Nothing on it is drawn for the page: the rows are the media products and
 * positions configured for the proposition, every cell is read from the
 * inventory model (lib/db/inventory.ts) over the system's own bookings, the
 * event bars are the dated pricing rules, and the booking bars are the
 * bookings themselves. So the fill rate, the stores, the time and the
 * revenue of a cell all describe the same bookings — the ones the drawer
 * lists — and the availability check on a booking reads the same numbers.
 */

import React, { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Eye, Euro, Percent, Store, TvMinimalPlay, LayoutList, X } from 'lucide-react';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '@/components/ui/card';
import {
  CalendarTable,
  fmtImpressionsCompact,
  fmtRevenueCompact,
  type MediaProduct as CalendarRow,
  type Booking as CalendarBooking,
  type BookingStatus,
  type CalendarCellValue,
} from '@/components/ui/calendar-table';
import { FillRateBar, type FillRateValue } from '@/components/ui/fill-rate-bar';
import { AvailableTimeBar, type AvailableTimeValue } from '@/components/ui/available-time-bar';
import { MetricRow, type MetricDefinition } from '@/components/ui/metric-row';
import { FilterBar, type FilterBarFilter } from '@/components/ui/filter-bar';
import { DateRangePicker } from '@/components/ui/date-picker';
import { AdvertiserSelect } from '@/components/ui/advertiser-select';
import {
  RightDrawer,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerTitle,
  RightDrawerDescription,
  RightDrawerBody,
} from '@/components/ui/right-drawer';
import { Table } from '@/components/ui/table';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { useDb, groupsOf, positionsOfGroup, type Booking, type EngineId, type Position, type PlanStatus } from '@/lib/db';
import {
  STORE_TYPES,
  bookingStoresOn,
  bookingVolume,
  defaultFrame,
  loadStateOf,
  mondaysBetween,
  positionWeek,
  positionsWeek,
  retailMomentsFor,
  storeShareOf,
  storesFree,
  unitFor,
  weekNumberOf,
  type InventoryWeek,
  type WeekOptions,
} from '@/lib/db/inventory';
import { retailProductOptions } from '@/lib/db/retail-products';

export type CalendarEngine = Exclude<EngineId, 'offsite'>;
type ViewKey = 'reach' | 'fillRate' | 'revenue' | 'stores' | 'availableTime' | 'bookings';

const VIEW_META: Record<ViewKey, { label: string; icon: React.ComponentType<{ className?: string; size?: number }> }> = {
  reach: { label: 'Impressions', icon: Eye },
  fillRate: { label: 'Fill rate', icon: Percent },
  revenue: { label: 'Revenue', icon: Euro },
  stores: { label: 'Available stores', icon: Store },
  availableTime: { label: 'Available time', icon: TvMinimalPlay },
  bookings: { label: 'Bookings', icon: LayoutList },
};

/** What each proposition's calendar shows and filters on. */
const CONFIG: Record<CalendarEngine, {
  title: string;
  views: ViewKey[];
  defaultView: ViewKey;
  /** Scoped to one publisher, picked in the header. */
  publisher?: boolean;
  /** Counted in stores: a Stores filter with a target. */
  storeBased?: boolean;
  /** Display splits what is sold by how it was sold. */
  saleChannels?: boolean;
  /** The media product filter asks how many of each per store. */
  quantities?: boolean;
  statusFilter?: boolean;
  retailProductFilter?: boolean;
}> = {
  display: { title: 'Display Calendar', views: ['reach', 'fillRate', 'revenue', 'bookings'], defaultView: 'reach', publisher: true, saleChannels: true, statusFilter: true },
  'sponsored-products': { title: 'Sponsored Product Calendar', views: ['fillRate', 'revenue', 'bookings'], defaultView: 'fillRate', publisher: true, statusFilter: true },
  'digital-instore': { title: 'Digital In-store Calendar', views: ['fillRate', 'stores', 'availableTime', 'bookings'], defaultView: 'stores', publisher: true, storeBased: true, statusFilter: true },
  'offline-instore': { title: 'Offline In-store Calendar', views: ['bookings', 'stores', 'fillRate'], defaultView: 'stores', storeBased: true, quantities: true, retailProductFilter: true },
};

const STATUS_OPTIONS: Array<{ label: string; value: PlanStatus }> = [
  { label: 'Live', value: 'running' },
  { label: 'In review', value: 'in-option' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
];

/** Every fill bar's segments, in the unit's own counts. */
function fillValue(w: InventoryWeek, saleChannels: boolean): FillRateValue {
  const base = { available: w.available, overbooked: w.overbooked };
  return saleChannels
    ? { ...base, soldManaged: w.channels.soldManaged, action: w.channels.action, programmatic: w.channels.programmatic }
    : { ...base, booked: w.booked, confirmed: w.confirmed, reserved: w.reserved };
}

/** Loop time by band, from the share of the loop that is sold. */
function timeValue(w: InventoryWeek): AvailableTimeValue {
  const sold = Math.min(1, w.fill);
  const free = 1 - sold;
  return { noAvailable: sold * 100, lowAvailable: free * 45, mediumAvailable: free * 35, highAvailable: free * 20 };
}

const bucketOf = (b: Booking): BookingStatus | null => loadStateOf(b);

const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const BookingCalendarPage: React.FC<{ engine: CalendarEngine }> = ({ engine }) => {
  const config = CONFIG[engine];
  const db = useDb();
  const { theme: storybookTheme } = useStorybookTheme();
  const routes = getRoutesForTheme(storybookTheme || 'retailMedia');

  // The inventory, three levels deep: placement group → placement →
  // position. Media products are packages of positions — the Media product
  // filter narrows the grid to what a package can run on.
  const products = db.mediaProducts.filter((m) => m.engine === engine && m.status !== 'archived');
  const groups = groupsOf(db, engine);
  const placementOrder = (id: string) => db.placements.findIndex((x) => x.id === id);
  const placementName = (id: string) => db.placements.find((x) => x.id === id)?.name;
  const positionsOfGroupSorted = (groupId: string) => positionsOfGroup(db, groupId)
    .map((x, i) => ({ x, i }))
    .sort((a, b) => placementOrder(a.x.placementId) - placementOrder(b.x.placementId) || a.i - b.i)
    .map(({ x }) => x);
  const allPositions = groups.flatMap((g) => positionsOfGroupSorted(g.id));
  // One group (sponsored products) opens on its placements straight away.
  const singleGroup = groups.length === 1;

  // ── State ─────────────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState<ViewKey>(config.defaultView);
  const [publisher, setPublisher] = useState('ah');
  const [statuses, setStatuses] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [storeTypes, setStoreTypes] = useState<string[]>([]);
  const [storeTarget, setStoreTarget] = useState('');
  const [retailProducts, setRetailProducts] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMetricKeys, setDrawerMetricKeys] = useState<string[] | null>(null);
  const [cell, setCell] = useState<{ name: string; monday: string; week: InventoryWeek; stores?: number; storeCapacity?: number } | null>(null);
  const initial = defaultFrame();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(initial.from + 'T00:00:00'),
    to: new Date(initial.to + 'T00:00:00'),
  });

  // ── Frame ─────────────────────────────────────────────────────────────
  const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const mondays = dateRange?.from && dateRange?.to
    ? mondaysBetween(isoOf(dateRange.from), isoOf(dateRange.to)).slice(0, 52)
    : mondaysBetween(initial.from, initial.to);
  const weekNumbers = mondays.map(weekNumberOf);
  const startWeek = weekNumbers[0];

  // ── Scope ─────────────────────────────────────────────────────────────
  const storeShare = config.storeBased ? storeShareOf(storeTypes) : 1;
  const inventoryOpts: WeekOptions = { storeShare };
  // Which bookings are listed (counts, bars, drawer). Inventory always
  // counts every booking that holds stock — a filter does not free it.
  const listed = (b: Booking) => {
    if (statuses.length && !statuses.includes(b.status)) return false;
    if (retailProducts.length) {
      const campaign = db.campaigns.find((c) => c.id === b.campaignId);
      if (!campaign?.retailProductIds?.some((id) => retailProducts.includes(id))) return false;
    }
    return true;
  };
  const target = parseInt(storeTarget, 10);
  const activeTarget = config.storeBased && Number.isFinite(target) && target > 0 ? target : undefined;

  // ── Rows ──────────────────────────────────────────────────────────────
  // Media product filter: with packages picked, only the positions they
  // can run on stay in the grid.
  const inPackages = selected.length
    ? new Set(products.filter((p) => selected.includes(p.id)).flatMap((p) => p.positionIds))
    : undefined;
  const visiblePositions = (groupId: string) => positionsOfGroupSorted(groupId).filter((x) => !inPackages || inPackages.has(x.id));
  const visibleGroups = groups.filter((g) => visiblePositions(g.id).length > 0);

  const bookingsFor = (positions: Position[]): CalendarBooking[] => {
    const ids = new Set(positions.map((p) => p.id));
    return db.bookings
      .filter((b) => b.positionIds.some((id) => ids.has(id)) && loadStateOf(b) && listed(b))
      .map((b) => {
        const weeksIn = mondays.filter((m) => b.startDate <= addDays(m, 6) && b.endDate >= m);
        if (!weeksIn.length) return null;
        const pos = positions.find((p) => b.positionIds.includes(p.id))!;
        return {
          id: b.id,
          name: b.name,
          startWeek: weekNumberOf(weeksIn[0]),
          endWeek: weekNumberOf(weeksIn[weeksIn.length - 1]),
          stores: Math.round(bookingStoresOn(db, b, pos) * storeShare),
          impressions: unitFor(engine) === 'impressions' ? Math.round(bookingVolume(db, b)) : undefined,
          revenue: b.budget,
          volume: { amount: Math.round(bookingVolume(db, b) * (unitFor(engine) === 'stores' ? storeShare : 1)), unit: unitFor(engine) },
          status: bucketOf(b)!,
        } satisfies CalendarBooking;
      })
      .filter((b): b is NonNullable<typeof b> => !!b);
  };

  const cellFor = (w: InventoryWeek, stores: number | undefined): CalendarCellValue => {
    switch (activeView) {
      case 'reach':
      case 'fillRate': return fillValue(w, !!config.saleChannels);
      case 'revenue': return Math.round(w.revenue);
      case 'stores': return stores ?? 0;
      case 'availableTime': return timeValue(w);
      case 'bookings': {
        const counts: Partial<Record<BookingStatus, number>> = {};
        for (const b of w.bookings) {
          if (!listed(b)) continue;
          const s = bucketOf(b);
          if (s) counts[s] = (counts[s] ?? 0) + 1;
        }
        return { bookingStatusCounts: counts };
      }
    }
  };

  const positionRow = (pos: Position): CalendarRow & { weeks: InventoryWeek[]; stores: number[] } => {
    const weeks = mondays.map((m) => positionWeek(db, pos, m, inventoryOpts));
    const stores = weeks.map((w) => storesFree(db, pos, w, storeShare));
    return {
      id: pos.id,
      name: pos.name,
      placement: placementName(pos.placementId),
      availability: weeks.map((w, i) => cellFor(w, stores[i])),
      capacity: weeks.map((w) => w.capacity),
      ...(config.storeBased ? { availableStores: stores, storeCapacity: Math.round((pos.stores ?? 0) * storeShare) } : {}),
      weeks,
      stores,
    };
  };

  const rows: CalendarRow[] = useMemo(() => visibleGroups.map((group) => {
    const positions = visiblePositions(group.id);
    const posRows = positions.map(positionRow);
    const weeks = mondays.map((m) => positionsWeek(db, positions, m, inventoryOpts));
    // In stores, a row is either the booking you are composing — with a
    // package picked, the stores free for every one of its positions (the
    // fewest), checked against the target — or, with none picked, the
    // total across its positions, which is what its fill rate counts.
    const combo = selected.length > 0 && posRows.length > 0;
    const sumOrMin = (list: typeof posRows, i: number) => combo ? Math.min(...list.map((r) => r.stores[i])) : list.reduce((sum, r) => sum + r.stores[i], 0);
    const capOf = (list: typeof posRows) => combo ? Math.min(...list.map((r) => r.storeCapacity ?? 0)) : list.reduce((sum, r) => sum + (r.storeCapacity ?? 0), 0);
    const stores = mondays.map((_, i) => sumOrMin(posRows, i));
    // Placements: the level between the group and its positions, each a
    // row of its own summed (or, while composing, combined) the same way.
    const placementRows = [...new Set(positions.map((p) => p.placementId))].map((placementId) => {
      const own = posRows.filter((r) => positions.find((p) => p.id === r.id)?.placementId === placementId);
      const pWeeks = mondays.map((m) => positionsWeek(db, positions.filter((p) => p.placementId === placementId), m, inventoryOpts));
      const pStores = mondays.map((_, i) => sumOrMin(own, i));
      return {
        id: placementId,
        name: placementName(placementId) ?? placementId,
        availability: pWeeks.map((w, i) => cellFor(w, pStores[i])),
        capacity: pWeeks.map((w) => w.capacity),
        ...(config.storeBased ? { storeCapacity: capOf(own), ...(combo ? { availableStores: pStores } : { skipTargetCheck: true }) } : {}),
        positions: own,
      };
    });
    return {
      id: group.id,
      name: group.name,
      placements: placementRows,
      availability: weeks.map((w, i) => cellFor(w, stores[i])),
      capacity: weeks.map((w) => w.capacity),
      ...(config.storeBased ? { storeCapacity: capOf(posRows), ...(combo ? { availableStores: stores } : { skipTargetCheck: true }) } : {}),
      positions: posRows,
      bookings: bookingsFor(positions),
    };
  }).filter((r) => !search.trim() || r.name.toLowerCase().includes(search.trim().toLowerCase())
    || r.placements?.some((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    || r.positions?.some((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [db, engine, activeView, mondays.join(), storeShare, selected.join(), statuses.join(), retailProducts.join(), search]);

  const focused = focusedId ? rows.find((r) => r.id === focusedId) : undefined;
  // A group opened in its own tab: its placements are the rows, each
  // opening into its positions, with the placement's own bookings under it.
  const focusedRows: CalendarRow[] = focused
    ? (focused.placements ?? []).map((pl) => ({
      ...pl,
      // The tab row is the placement already; no label row above its positions.
      positions: pl.positions.map((p) => ({ ...p, placement: undefined })),
      bookings: bookingsFor(db.positions.filter((x) => pl.positions.some((p) => p.id === x.id))),
    }))
    : [];

  // ── Events: the dated pricing rules ─────────────────────────────────────
  const retailerEvents = retailMomentsFor(db, engine).flatMap((rule) =>
    mondays
      .filter((m) => rule.from! <= addDays(m, 6) && rule.to! >= m)
      .map((m) => ({ week: weekNumberOf(m), name: rule.name })),
  );

  // ── Cell drawer ─────────────────────────────────────────────────────────
  const openCell = (row: CalendarRow, weekNumber: number) => {
    const i = weekNumbers.indexOf(weekNumber);
    if (i < 0) return;
    // The positions under the row: a group's, a placement's, or the one.
    const group = groups.find((g) => g.id === row.id);
    const placement = db.placements.find((p) => p.id === row.id);
    const position = db.positions.find((p) => p.id === row.id);
    const under = group ? visiblePositions(group.id)
      : placement ? visiblePositions(placement.groupId).filter((p) => p.placementId === placement.id)
        : position ? [position] : [];
    if (!under.length) return;
    const week = positionsWeek(db, under, mondays[i], inventoryOpts);
    // Stores free: the row's own figure, else the sum over its positions.
    const stores = row.availableStores?.[i]
      ?? (config.storeBased ? under.reduce((n, p) => n + storesFree(db, p, positionWeek(db, p, mondays[i], inventoryOpts), storeShare), 0) : undefined);
    setCell({ name: row.name, monday: mondays[i], week, stores, storeCapacity: row.storeCapacity });
    setDrawerOpen(true);
  };

  const unit = unitFor(engine);
  const drawerBookings = (cell?.week.bookings ?? []).filter(listed);
  const drawerMetrics: MetricDefinition[] = cell ? config.views.map((key): MetricDefinition => {
    const w = cell.week;
    const label = VIEW_META[key].label;
    switch (key) {
      case 'fillRate':
        return {
          key, label,
          value: `${Math.round(w.fill * 100)}%`,
          subMetric: 'of 90% target',
          badgeValue: w.overbooked > 0 ? `+${Math.round((w.fill - 1) * 100)}% over` : undefined,
          badgeVariant: w.overbooked > 0 ? 'destructive' : undefined,
          chart: <FillRateBar value={fillValue(w, !!config.saleChannels)} height={10} showLabels hoverTooltip={false} />,
        };
      case 'reach':
        return {
          key, label,
          value: fmtImpressionsCompact(w.used),
          subMetric: `of ${fmtImpressionsCompact(w.capacity)} available`,
          chart: <FillRateBar value={fillValue(w, !!config.saleChannels)} height={10} showLabels hoverTooltip={false} impressionsTotal={w.capacity} />,
        };
      case 'revenue':
        return { key, label, value: fmtRevenueCompact(w.revenue), subMetric: 'booked this week' };
      case 'stores':
        return { key, label, value: `${Math.max(0, cell.stores ?? 0)}`, subMetric: `of ${cell.storeCapacity ?? 0} stores` };
      case 'availableTime':
        return { key, label, value: `${Math.round((1 - Math.min(1, w.fill)) * 100)}%`, subMetric: 'of the loop free', chart: <AvailableTimeBar value={timeValue(w)} height={10} showLabels hoverTooltip={false} /> };
      case 'bookings':
        return { key, label, value: `${drawerBookings.length}`, subMetric: drawerBookings.length === 1 ? 'booking' : 'bookings' };
    }
  }) : [];

  // ── Filters ───────────────────────────────────────────────────────────
  // The packages the retailer sells here; picking one keeps its positions.
  const productOptions = products.map((p) => ({ label: p.name, value: p.id, description: `${p.positionIds.length} position${p.positionIds.length === 1 ? '' : 's'} · ${p.description ?? ''}` }));
  const maxStores = Math.max(10, ...allPositions.map((p) => p.stores ?? 0));
  const filters: FilterBarFilter[] = [
    ...(config.statusFilter ? [{ name: 'Status', options: STATUS_OPTIONS, selectedValues: statuses, onChange: setStatuses }] : []),
    {
      name: 'Media product',
      options: productOptions,
      selectedValues: selected,
      onChange: setSelected,
      forceSearch: productOptions.length > 8,
    },
    ...(config.storeBased ? [{
      name: 'Stores',
      customInput: {
        label: 'Target',
        value: storeTarget,
        onChange: setStoreTarget,
        placeholder: '0',
        type: 'number' as const,
        unit: 'stores',
        range: { min: 0, max: maxStores, step: 10 },
      },
      options: STORE_TYPES.map(({ label, value }) => ({ label, value })),
      selectedValues: storeTypes,
      onChange: setStoreTypes,
    }] : []),
    ...(config.retailProductFilter ? [{
      name: 'Retail Product',
      options: retailProductOptions(db),
      selectedValues: retailProducts,
      onChange: setRetailProducts,
      forceSearch: true,
    }] : []),
  ];

  const displayType = ({
    reach: 'impressionsBar',
    fillRate: 'fillRateBar',
    revenue: 'revenue',
    stores: 'stores',
    availableTime: 'availableTimeBar',
    bookings: 'bookings',
  } as const)[activeView];

  const commonProps = {
    weeks: mondays.length,
    startWeek,
    retailerEvents,
    displayType,
    showReach: activeView === 'revenue',
    onCellClick: (row: CalendarRow, weekNumber: number) => openCell(row, weekNumber),
    onBookingClick: (b: CalendarBooking) => { window.location.href = `/campaigns/${engine}/booking/${b.id}`; },
    maxInlinePositions: 20,
    storeTarget: activeTarget,
  };

  const viewbar = (
    <FilterBar
      viewOptions={config.views.map((v) => ({ value: v, label: VIEW_META[v].label, icon: VIEW_META[v].icon }))}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as ViewKey)}
      leading={
        <DateRangePicker
          variant="outline"
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          placeholder="Select date range"
          showPresets
          className="w-auto max-w-[260px]"
        />
      }
      filters={filters}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search..."
    />
  );

  return (
    <RightDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: config.title,
          onExport: () => alert('Export clicked'),
          headerRight: config.publisher ? (
            <AdvertiserSelect
              value={publisher}
              onChange={setPublisher}
              placeholder="Publisher"
              options={[
                { label: 'Albert Heijn', value: 'ah' },
                { label: 'Etos', value: 'etos' },
                { label: 'Gall & Gall', value: 'gall' },
                { label: 'Bol', value: 'bol' },
              ]}
            />
          ) : undefined,
        }}
      >
        <CardWithTabs
          className="w-full"
          header={viewbar}
          activeTab={focused ? activeTab : 'all'}
          onTabChange={setActiveTab}
          tabs={[
            {
              value: 'all',
              label: config.title,
              content: (
                <CalendarTable
                  key={singleGroup ? 'single' : 'multi'}
                  mediaProducts={rows}
                  nameColumnLabel="Placements"
                  {...commonProps}
                  defaultExpandedIds={singleGroup ? rows.map((r) => r.id) : undefined}
                  onChannelClick={singleGroup ? undefined : (p) => { setFocusedId(p.id); setActiveTab(p.id); }}
                />
              ),
            },
            ...(focused ? [{
              value: focused.id,
              label: (
                <span className="inline-flex items-center gap-2">
                  <span className="truncate max-w-[200px]">{focused.name}</span>
                  <span
                    role="button"
                    aria-label="Close tab"
                    onClick={(e) => { e.stopPropagation(); setFocusedId(null); setActiveTab('all'); }}
                    className="ml-1 p-0.5 rounded hover:bg-neutral-200 cursor-pointer flex items-center"
                  >
                    <X className="w-3 h-3" />
                  </span>
                </span>
              ),
              content: <CalendarTable mediaProducts={focusedRows} nameColumnLabel="Placements" {...commonProps} />,
            }] : []),
          ]}
        />

        <RightDrawerContent className="sm:max-w-3xl">
          <RightDrawerHeader>
            <RightDrawerTitle>{cell?.name} · Week {cell ? weekNumberOf(cell.monday) : ''}</RightDrawerTitle>
            <RightDrawerDescription>
              {cell ? `${fmtDate(cell.monday)} – ${fmtDate(addDays(cell.monday, 6))}` : ''}
            </RightDrawerDescription>
          </RightDrawerHeader>
          <RightDrawerBody>
            <div className="space-y-6">
              <MetricRow
                hideDateRange
                metrics={drawerMetrics}
                selectedKeys={drawerMetricKeys ?? drawerMetrics.slice(0, 3).map((m) => m.key)}
                onSelectionChange={setDrawerMetricKeys}
                maxVisible={3}
                defaultVariant="default"
              />
              <Table
                columns={[
                  { key: 'name', header: 'Name' },
                  { key: 'id', header: 'ID' },
                  { key: 'status', header: 'Status', render: (b: Booking) => STATUS_OPTIONS.find((s) => s.value === b.status)?.label ?? b.status },
                  unit === 'stores'
                    ? { key: 'volume', header: 'Stores', render: (b: Booking) => Math.round(bookingVolume(db, b)).toLocaleString('en-GB') }
                    : unit === 'clicks'
                      ? { key: 'volume', header: 'Clicks', render: (b: Booking) => fmtImpressionsCompact(bookingVolume(db, b)) }
                      : { key: 'volume', header: 'Impressions', render: (b: Booking) => fmtImpressionsCompact(bookingVolume(db, b)) },
                  { key: 'budget', header: 'Budget', render: (b: Booking) => fmtRevenueCompact(b.budget) },
                  { key: 'runtime', header: 'Run time', render: (b: Booking) => `${fmtDate(b.startDate)} – ${fmtDate(b.endDate)}` },
                ]}
                data={drawerBookings}
                rowKey={(b) => b.id}
                onRowClick={(b) => { window.location.href = `/campaigns/${engine}/booking/${b.id}`; }}
                emptyState="No bookings hold this week yet — all of it is free to book."
              />
            </div>
          </RightDrawerBody>
        </RightDrawerContent>
      </AppLayout>
    </RightDrawer>
  );
};

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
