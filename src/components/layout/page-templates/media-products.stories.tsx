import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardWithTabs, MetricCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table } from '@/components/ui/table';
import { FilterBar } from '@/components/ui/filter-bar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormSection } from '@/components/ui/form-section';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-picker';
import { MetricRow, type MetricDefinition } from '@/components/ui/metric-row';
import { PropositionIcon } from '@/components/ui/proposition-icon';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { cn } from '@/lib/utils';
import {
  useDb, useRouteEntityId, createMediaProduct, updateMediaProduct, createPlacement, createPosition, createPricingRule, updatePricingRule, deletePricingRule, setHoldStatus,
  priceFor, fillRateFor, formatPrice, holdsFor, placementsOf, positionsOf, effectiveHoldStatus, rulesForProduct, ruleApplies,
  BASIS_LABEL, RULE_KIND_LABEL, ENGINE_LABEL,
  type EngineId, type MediaProduct, type Position, type PricingRule, type PricingBasis, type BuyingModel, type PricingRuleKind, type InventoryHold,
} from '@/lib/db';
import type { DateRange } from 'react-day-picker';
import { ArrowRight, Boxes, ChevronDown, ChevronRight, Layers, Lock, Plus, Tag } from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Media Products',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Media products

What the retailer sells, as a first-class thing in Edge. A media product is
the sellable template: composed by the retailer with its rate card, its
buying models and the rules it comes with. Inside it sit placements, and
inside those the positions the ad server fills — how deep that goes differs
per proposition. A booking books a media product; yield is done on media
products; the pricing rules (seasonality, retail moments, market index,
demand, early booking, volume) are indexes on the list price, managed here.

Inventory comes along: a booking in review holds its positions for its run
time at the price that stood when it was booked, until the product's hold
days run out.

Pages: the overview (products, pricing rules, inventory holds) and the
product page (placements & positions, pricing with the build-up, inventory,
rules & constraints).
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ENGINES: EngineId[] = ['display', 'sponsored-products', 'digital-instore', 'offline-instore', 'offsite'];

const statusBadge = (status: MediaProduct['status']) =>
  status === 'active' ? <Badge variant="success">Active</Badge> : status === 'archived' ? <Badge variant="secondary">Archived</Badge> : <Badge variant="outline">Draft</Badge>;

const ruleStatusBadge = (status: PricingRule['status']) =>
  status === 'active' ? <Badge variant="success">Active</Badge> : status === 'paused' ? <Badge variant="destructive">Paused</Badge> : <Badge variant="outline">Draft</Badge>;

const holdBadge = (status: InventoryHold['status']) =>
  status === 'held' ? <Badge variant="info">Held</Badge>
  : status === 'confirmed' ? <Badge variant="success">Confirmed</Badge>
  : status === 'expired' ? <Badge variant="destructive">Expired</Badge>
  : <Badge variant="secondary">Released</Badge>;

const indexLabel = (index: number) => `${index >= 1 ? '+' : '−'}${Math.round(Math.abs(index - 1) * 100)}%`;

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

const daysBetween = (a: string, b: string) => Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));

/** When a rule applies, in one line. */
const ruleWhen = (r: PricingRule) => {
  switch (r.kind) {
    case 'seasonality':
    case 'moment': return `${fmtDate(r.from)} – ${fmtDate(r.to)}`;
    case 'demand': return `Fill rate ≥ ${Math.round((r.minFillRate ?? 0) * 100)}%`;
    case 'early-booking': return `Booked ≥ ${r.minDaysAhead} days ahead`;
    case 'volume': return `Budget ≥ €${(r.minBudget ?? 0).toLocaleString('en-US')}`;
    case 'market': return 'Always';
  }
};

// ── Shared: the pricing rule dialog ─────────────────────────────────────

const RuleDialog: React.FC<{ open: boolean; onClose: () => void; rule?: PricingRule; engine?: EngineId | 'all'; productId?: string }> = ({ open, onClose, rule, engine, productId }) => {
  const [draft, setDraft] = useState<Omit<PricingRule, 'id' | 'updatedAt'>>(() => ({
    name: '', kind: 'seasonality', engine: engine ?? 'all', mediaProductIds: productId ? [productId] : undefined, index: 1.1, priority: 30, status: 'draft', description: '',
  }));
  React.useEffect(() => {
    if (!open) return;
    setDraft(rule ? { ...rule } : { name: '', kind: 'seasonality', engine: engine ?? 'all', mediaProductIds: productId ? [productId] : undefined, index: 1.1, priority: 30, status: 'draft', description: '' });
  }, [open, rule, engine, productId]);
  const set = <K extends keyof typeof draft>(k: K, v: (typeof draft)[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const save = () => {
    if (!draft.name.trim()) return;
    if (rule) updatePricingRule(rule.id, draft); else createPricingRule(draft);
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit pricing rule' : 'New pricing rule'}</DialogTitle>
          <DialogDescription>An index on the list price, for the dates or the demand it applies to.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Name</Label>
            <Input value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="Q4 season" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Kind</Label>
              <Select value={draft.kind} onValueChange={(v) => set('kind', v as PricingRuleKind)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(RULE_KIND_LABEL) as PricingRuleKind[]).map((k) => <SelectItem key={k} value={k}>{RULE_KIND_LABEL[k]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Proposition</Label>
              <Select value={draft.engine} onValueChange={(v) => set('engine', v as EngineId | 'all')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Every proposition</SelectItem>
                  {ENGINES.map((e) => <SelectItem key={e} value={e}>{ENGINE_LABEL[e]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Index</Label>
              <Input type="number" step="0.01" min="0.1" value={draft.index} onChange={(e) => set('index', Number(e.target.value))} hint={`${indexLabel(draft.index)} on the list price`} />
            </div>
            <div className="grid gap-1.5">
              <Label>Priority</Label>
              <Input type="number" value={draft.priority} onChange={(e) => set('priority', Number(e.target.value))} hint="Lower applies first" />
            </div>
          </div>
          {(draft.kind === 'seasonality' || draft.kind === 'moment') && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5"><Label>From</Label><Input type="date" value={draft.from ?? ''} onChange={(e) => set('from', e.target.value)} /></div>
              <div className="grid gap-1.5"><Label>To</Label><Input type="date" value={draft.to ?? ''} onChange={(e) => set('to', e.target.value)} /></div>
            </div>
          )}
          {draft.kind === 'demand' && (
            <div className="grid gap-1.5"><Label>From fill rate (%)</Label><Input type="number" value={Math.round((draft.minFillRate ?? 0.8) * 100)} onChange={(e) => set('minFillRate', Number(e.target.value) / 100)} /></div>
          )}
          {draft.kind === 'early-booking' && (
            <div className="grid gap-1.5"><Label>Booked at least (days ahead)</Label><Input type="number" value={draft.minDaysAhead ?? 60} onChange={(e) => set('minDaysAhead', Number(e.target.value))} /></div>
          )}
          {draft.kind === 'volume' && (
            <div className="grid gap-1.5"><Label>From budget (€)</Label><Input type="number" value={draft.minBudget ?? 25000} onChange={(e) => set('minBudget', Number(e.target.value))} /></div>
          )}
          <div className="grid gap-1.5">
            <Label>Why</Label>
            <Textarea rows={2} value={draft.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="What this index is for, in the retailer's words." />
          </div>
          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Select value={draft.status} onValueChange={(v) => set('status', v as PricingRule['status'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          {rule && <Button variant="ghost" className="mr-auto text-destructive" onClick={() => { deletePricingRule(rule.id); onClose(); }}>Delete</Button>}
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={!draft.name.trim()}>{rule ? 'Save' : 'Add rule'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Shared: the media product dialog ────────────────────────────────────

const ProductDialog: React.FC<{ open: boolean; onClose: () => void; product?: MediaProduct; onCreated?: (id: string) => void }> = ({ open, onClose, product, onCreated }) => {
  const blank = (): Omit<MediaProduct, 'id'> => ({ engine: 'display', name: '', description: '', status: 'draft', buyingModels: ['guaranteed'], pricingBasis: 'cpm', listPrice: 10, floorPrice: undefined, holdDays: 5, constraints: [], owner: 'Yield Manager' });
  const [draft, setDraft] = useState<Omit<MediaProduct, 'id'>>(blank);
  const [constraintText, setConstraintText] = useState('');
  React.useEffect(() => {
    if (!open) return;
    setDraft(product ? { ...product } : blank());
    setConstraintText((product?.constraints ?? []).join('\n'));
  }, [open, product]);
  const set = <K extends keyof typeof draft>(k: K, v: (typeof draft)[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const toggleModel = (m: BuyingModel) => set('buyingModels', (draft.buyingModels ?? []).includes(m) ? (draft.buyingModels ?? []).filter((x) => x !== m) : [...(draft.buyingModels ?? []), m]);
  const save = () => {
    if (!draft.name.trim()) return;
    const input = { ...draft, constraints: constraintText.split('\n').map((s) => s.trim()).filter(Boolean) };
    if (product) updateMediaProduct(product.id, input);
    else onCreated?.(createMediaProduct(input).id);
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit media product' : 'New media product'}</DialogTitle>
          <DialogDescription>The sellable template: what it is, how it is bought, what it costs and what it comes with. Placements and positions are added on the product page.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Name</Label>
              <Input value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="Homepage takeover" />
            </div>
            <div className="grid gap-1.5">
              <Label>Proposition</Label>
              <Select value={draft.engine} onValueChange={(v) => set('engine', v as EngineId)} disabled={!!product}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ENGINES.map((e) => <SelectItem key={e} value={e}>{ENGINE_LABEL[e]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea rows={2} value={draft.description ?? ''} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Buying models</Label>
            <div className="flex gap-2">
              {(['guaranteed', 'auction'] as BuyingModel[]).map((m) => (
                <Button key={m} type="button" size="sm" variant={(draft.buyingModels ?? []).includes(m) ? 'default' : 'outline'} onClick={() => toggleModel(m)} className="capitalize">{m}</Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-1.5">
              <Label>Price basis</Label>
              <Select value={draft.pricingBasis} onValueChange={(v) => set('pricingBasis', v as PricingBasis)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(Object.keys(BASIS_LABEL) as PricingBasis[]).map((b) => <SelectItem key={b} value={b}>{BASIS_LABEL[b]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>List price (€)</Label>
              <Input type="number" step="0.01" value={draft.listPrice ?? ''} onChange={(e) => set('listPrice', Number(e.target.value))} />
            </div>
            <div className="grid gap-1.5">
              <Label>Floor price (€)</Label>
              <Input type="number" step="0.01" value={draft.floorPrice ?? ''} onChange={(e) => set('floorPrice', e.target.value === '' ? undefined : Number(e.target.value))} placeholder="Auction only" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Hold days</Label>
              <Input type="number" value={draft.holdDays ?? 5} onChange={(e) => set('holdDays', Number(e.target.value))} hint="How long a booking in review keeps its inventory and price" />
            </div>
            <div className="grid gap-1.5">
              <Label>Owner</Label>
              <Input value={draft.owner ?? ''} onChange={(e) => set('owner', e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Constraints</Label>
            <Textarea rows={3} value={constraintText} onChange={(e) => setConstraintText(e.target.value)} placeholder={'One per line:\nMinimum run time 7 days\nCreatives due X-4'} />
          </div>
          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Select value={draft.status ?? 'draft'} onValueChange={(v) => set('status', v as MediaProduct['status'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={!draft.name.trim()}>{product ? 'Save' : 'Create product'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── The price build-up ──────────────────────────────────────────────────

const PriceBuildUpCard: React.FC<{ product: MediaProduct; position?: Position; className?: string }> = ({ product, position, className }) => {
  const db = useDb();
  const [range, setRange] = useState<DateRange | undefined>({ from: new Date('2026-11-16'), to: new Date('2026-11-29') });
  const [budget, setBudget] = useState(15000);
  const today = new Date();
  const from = range?.from ? range.from.toISOString().slice(0, 10) : undefined;
  const to = range?.to ? range.to.toISOString().slice(0, 10) : from;
  const daysAhead = from ? Math.max(0, Math.round((new Date(from).getTime() - today.getTime()) / 86400000)) : undefined;
  const fillRate = position ? fillRateFor(db, position, from, to) : undefined;
  const build = priceFor(db, position ?? product, { from, to, daysAhead, budget, fillRate });
  const allRules = rulesForProduct(db, product);
  if (!build) return null;
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Price build-up</CardTitle>
        <p className="text-sm text-muted-foreground">What {position ? position.name : 'this product'} costs for a run time — the list price with every rule that applies on top.</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
          <div className="grid gap-1.5">
            <Label>Run time</Label>
            <DateRangePicker dateRange={range} onDateRangeChange={setRange} showPresets={false} />
          </div>
          <div className="grid gap-1.5">
            <Label>Budget (€)</Label>
            <Input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
          </div>
        </div>
        <div className="rounded-lg border border-border">
          <div className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span>List price</span>
            <span className="font-medium tabular-nums">{formatPrice(build.listPrice, build.basis)} {BASIS_LABEL[build.basis]}</span>
          </div>
          {allRules.map((rule) => {
            const step = build.steps.find((s) => s.rule.id === rule.id);
            const applies = !!step;
            return (
              <div key={rule.id} className={cn('flex items-center justify-between border-t border-border px-4 py-2.5 text-sm', !applies && 'text-muted-foreground')}>
                <span className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal">{RULE_KIND_LABEL[rule.kind]}</Badge>
                  {rule.name}
                  {rule.status !== 'active' && <span className="text-xs">({rule.status})</span>}
                  {rule.status === 'active' && !applies && <span className="text-xs">— not for this run time</span>}
                </span>
                <span className="tabular-nums">{applies ? <span className="font-medium">{indexLabel(rule.index)}</span> : indexLabel(rule.index)}</span>
              </div>
            );
          })}
          <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-3 text-sm">
            <span className="font-medium">Price for this run time</span>
            <span className="text-base font-semibold tabular-nums">{formatPrice(build.price, build.basis)} <span className="text-sm font-normal text-muted-foreground">{BASIS_LABEL[build.basis]}</span></span>
          </div>
          {build.floorPrice !== undefined && (
            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
              <span>Auction floor</span><span className="tabular-nums">{formatPrice(build.floorPrice, build.basis)}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {daysAhead !== undefined && `Booked ${daysAhead} days ahead. `}
          {fillRate !== undefined && `Fill rate over the run time ${Math.round(fillRate * 100)}%. `}
          A booking locks this price for {product.holdDays ?? 5} days while it is in review.
        </p>
      </CardContent>
    </Card>
  );
};

// ── The shell every page shares ─────────────────────────────────────────

const useRoutes = () => {
  const { theme: storybookTheme } = useStorybookTheme();
  return getRoutesForTheme(storybookTheme || 'retailMedia');
};

const go = (href: string) => { if (typeof window !== 'undefined') window.location.href = href; };

// ── Overview ────────────────────────────────────────────────────────────

const OverviewPage: React.FC = () => {
  const routes = useRoutes();
  const db = useDb();
  const [tab, setTab] = useState('products');
  const [engineFilter, setEngineFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [productDialog, setProductDialog] = useState(false);
  const [ruleDialog, setRuleDialog] = useState<{ open: boolean; rule?: PricingRule }>({ open: false });
  const [metricKeys, setMetricKeys] = useState(['products', 'positions', 'fill', 'holds', 'locked']);

  const products = db.mediaProducts.filter((p) =>
    (engineFilter.length === 0 || engineFilter.includes(p.engine))
    && (statusFilter.length === 0 || statusFilter.includes(p.status ?? 'draft'))
    && (!search || p.name.toLowerCase().includes(search.toLowerCase()) || ENGINE_LABEL[p.engine].toLowerCase().includes(search.toLowerCase())),
  );
  const rules = db.pricingRules.filter((r) =>
    (engineFilter.length === 0 || r.engine === 'all' || engineFilter.includes(r.engine))
    && (!search || r.name.toLowerCase().includes(search.toLowerCase())),
  ).sort((a, b) => a.priority - b.priority);
  const holds = db.inventoryHolds.map((h) => {
    const position = db.positions.find((p) => p.id === h.positionId);
    const product = position && db.mediaProducts.find((m) => m.id === position.mediaProductId);
    const booking = db.bookings.find((b) => b.id === h.bookingId);
    return { ...h, effective: effectiveHoldStatus(h), position, product, booking };
  }).filter((h) => engineFilter.length === 0 || (h.product && engineFilter.includes(h.product.engine)));

  const activeProducts = db.mediaProducts.filter((p) => p.status === 'active').length;
  const fillRates = db.positions.map((p) => fillRateFor(db, p));
  const avgFill = fillRates.length ? fillRates.reduce((a, b) => a + b, 0) / fillRates.length : 0;
  const openHolds = db.inventoryHolds.filter((h) => effectiveHoldStatus(h) === 'held');
  const lockedValue = openHolds.reduce((s, h) => s + (db.bookings.find((b) => b.id === h.bookingId)?.budget ?? 0), 0);
  const metrics: MetricDefinition[] = [
    { key: 'products', label: 'Media products', value: String(db.mediaProducts.length), subMetric: `${activeProducts} active` },
    { key: 'positions', label: 'Positions', value: String(db.positions.length), subMetric: `in ${db.placements.length} placements` },
    { key: 'fill', label: 'Average fill rate', value: `${Math.round(avgFill * 100)}%`, badgeValue: avgFill >= 0.8 ? 'High demand' : undefined, badgeVariant: 'warning' },
    { key: 'rules', label: 'Pricing rules', value: String(db.pricingRules.length), subMetric: `${db.pricingRules.filter((r) => r.status === 'active').length} active` },
    { key: 'holds', label: 'Inventory on hold', value: String(openHolds.length), subMetric: 'bookings in review' },
    { key: 'locked', label: 'Budget with a locked price', value: `€${Math.round(lockedValue / 1000)}K`, subMetric: 'held at today\'s rate' },
  ];

  const engineOptions = ENGINES.map((e) => ({ label: ENGINE_LABEL[e], value: e }));

  return (
    <MenuContextProvider>
      <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Media products',
          subtitle: 'What you sell: the products, their placements and positions, the pricing rules and the inventory on hold.',
          headerRight: <Button className="gap-1.5" onClick={() => setProductDialog(true)}><Plus className="h-4 w-4" />New media product</Button>,
        }}
      >
        <div className="space-y-6">
          <MetricRow
            metrics={metrics}
            selectedKeys={metricKeys}
            onSelectionChange={setMetricKeys}
            maxVisible={6}
            hideMeasurement
          />

          <CardWithTabs
            className="w-full"
            activeTab={tab}
            onTabChange={setTab}
            tabs={[
              {
                value: 'products',
                label: `Media products (${products.length})`,
                content: (
                  <div className="mt-6 space-y-4">
                    <FilterBar
                      filters={[
                        { name: 'Proposition', options: engineOptions, selectedValues: engineFilter, onChange: setEngineFilter },
                        { name: 'Status', options: [{ label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' }, { label: 'Archived', value: 'archived' }], selectedValues: statusFilter, onChange: setStatusFilter },
                      ]}
                      searchValue={search}
                      onSearchChange={setSearch}
                      searchPlaceholder="Search media products…"
                    />
                    <Table
                      columns={[
                        { key: 'name', header: 'Media product', render: (row) => (
                          <span className="flex items-center gap-2">
                            <PropositionIcon engineType={row.engine} className="h-6 w-6 shrink-0" />
                            <span className="font-medium">{row.name}</span>
                          </span>
                        ) },
                        { key: 'engine', header: 'Proposition', render: (row) => ENGINE_LABEL[row.engine] },
                        { key: 'status', header: 'Status', render: (row) => statusBadge(row.status) },
                        { key: 'models', header: 'Buying', render: (row) => (
                          <span className="flex gap-1">{(row.buyingModels ?? []).map((m) => <Badge key={m} variant="outline" className="capitalize font-normal">{m}</Badge>)}</span>
                        ) },
                        { key: 'price', header: 'List price', render: (row) => row.pricingBasis && row.listPrice !== undefined ? <span className="tabular-nums">{formatPrice(row.listPrice, row.pricingBasis)} <span className="text-muted-foreground">{BASIS_LABEL[row.pricingBasis]}</span></span> : '—' },
                        { key: 'structure', header: 'Placements · positions', render: (row) => {
                          const plc = placementsOf(db, row.id).length; const pos = positionsOf(db, row.id).length;
                          return <span className="tabular-nums">{plc > 0 ? `${plc} · ${pos}` : `— · ${pos}`}</span>;
                        } },
                        { key: 'fill', header: 'Fill rate', render: (row) => {
                          const pos = positionsOf(db, row.id); if (!pos.length) return '—';
                          const f = pos.reduce((s, p) => s + fillRateFor(db, p), 0) / pos.length;
                          return <span className="tabular-nums">{Math.round(f * 100)}%</span>;
                        } },
                        { key: 'holds', header: 'On hold', render: (row) => {
                          const n = holdsFor(db, { productId: row.id }).filter((h) => effectiveHoldStatus(h) === 'held').length;
                          return n ? <Badge variant="info">{n}</Badge> : <span className="text-muted-foreground">0</span>;
                        } },
                        { key: 'partner', header: 'Partner', render: (row) => row.partner ?? '—' },
                      ]}
                      data={products}
                      rowKey={(row) => row.id}
                      hideActions
                      rowClassName={() => 'cursor-pointer'}
                      onRowClick={(row) => go(`/media-products/${row.id}`)}
                      emptyState={<span>No media products match. <button type="button" className="underline" onClick={() => setProductDialog(true)}>Create one</button>.</span>}
                    />
                  </div>
                ),
              },
              {
                value: 'rules',
                label: `Pricing rules (${rules.length})`,
                content: (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <p className="max-w-2xl text-sm text-muted-foreground">Indexes on the list price. Seasonality and retail moments follow the calendar, the market index what the category commands, demand the fill rate — hotel style — and early booking and volume the booking itself. They stack in priority order; every price shows its build-up.</p>
                      <Button variant="outline" className="shrink-0 gap-1.5" onClick={() => setRuleDialog({ open: true })}><Plus className="h-4 w-4" />Add rule</Button>
                    </div>
                    <FilterBar
                      filters={[{ name: 'Proposition', options: engineOptions, selectedValues: engineFilter, onChange: setEngineFilter }]}
                      searchValue={search}
                      onSearchChange={setSearch}
                      searchPlaceholder="Search pricing rules…"
                    />
                    <Table
                      columns={[
                        { key: 'name', header: 'Rule', render: (row) => <span className="font-medium">{row.name}</span> },
                        { key: 'kind', header: 'Kind', render: (row) => <Badge variant="outline" className="font-normal">{RULE_KIND_LABEL[row.kind]}</Badge> },
                        { key: 'engine', header: 'Applies to', render: (row) => row.engine === 'all' ? 'Every proposition' : `${ENGINE_LABEL[row.engine]}${row.mediaProductIds?.length ? ` · ${row.mediaProductIds.map((id) => db.mediaProducts.find((m) => m.id === id)?.name ?? id).join(', ')}` : ''}` },
                        { key: 'when', header: 'When', render: (row) => ruleWhen(row) },
                        { key: 'index', header: 'Index', render: (row) => <span className={cn('font-medium tabular-nums', row.index >= 1 ? 'text-foreground' : 'text-muted-foreground')}>{indexLabel(row.index)}</span> },
                        { key: 'priority', header: 'Priority', render: (row) => <span className="tabular-nums">{row.priority}</span> },
                        { key: 'status', header: 'Status', render: (row) => ruleStatusBadge(row.status) },
                        { key: 'updatedAt', header: 'Updated', render: (row) => fmtDate(row.updatedAt) },
                      ]}
                      data={rules}
                      rowKey={(row) => row.id}
                      hideActions
                      rowClassName={() => 'cursor-pointer'}
                      onRowClick={(row) => setRuleDialog({ open: true, rule: row })}
                    />
                  </div>
                ),
              },
              {
                value: 'holds',
                label: `Inventory holds (${holds.filter((h) => h.effective === 'held').length})`,
                content: (
                  <div className="mt-6 space-y-4">
                    <p className="max-w-2xl text-sm text-muted-foreground">A booking in review holds its positions for its run time at the price that stood when it was booked. The hold — and the price — expire after the product&apos;s hold days unless the booking is confirmed.</p>
                    <Table
                      columns={[
                        { key: 'booking', header: 'Booking', render: (row) => <span className="font-medium">{row.booking?.name ?? row.bookingId}</span> },
                        { key: 'product', header: 'Media product', render: (row) => row.product?.name ?? '—' },
                        { key: 'position', header: 'Position', render: (row) => row.position?.name ?? row.positionId },
                        { key: 'run', header: 'Run time', render: (row) => `${fmtDate(row.from)} – ${fmtDate(row.to)}` },
                        { key: 'units', header: 'Units', render: (row) => <span className="tabular-nums">{row.units}</span> },
                        { key: 'price', header: 'Locked price', render: (row) => row.product?.pricingBasis ? <span className="flex items-center gap-1 tabular-nums"><Lock className="h-3 w-3 text-muted-foreground" />{formatPrice(row.priceLocked, row.product.pricingBasis)} <span className="text-muted-foreground">{BASIS_LABEL[row.product.pricingBasis]}</span></span> : `€${row.priceLocked}` },
                        { key: 'expires', header: 'Expires', render: (row) => {
                          const days = daysBetween(new Date().toISOString().slice(0, 10), row.expiresAt.slice(0, 10));
                          return row.effective === 'held' ? <span>{fmtDate(row.expiresAt)} <span className="text-muted-foreground">({days} day{days === 1 ? '' : 's'})</span></span> : fmtDate(row.expiresAt);
                        } },
                        { key: 'status', header: 'Status', render: (row) => holdBadge(row.effective) },
                      ]}
                      data={holds}
                      rowKey={(row) => row.id}
                      rowActions={(row) => row.effective === 'held' ? (
                        <span className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => setHoldStatus(row.id, 'confirmed')}>Confirm</Button>
                          <Button size="sm" variant="ghost" onClick={() => setHoldStatus(row.id, 'released')}>Release</Button>
                        </span>
                      ) : row.effective === 'expired' ? (
                        <Button size="sm" variant="outline" onClick={() => setHoldStatus(row.id, 'released')}>Release</Button>
                      ) : null}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
        <ProductDialog open={productDialog} onClose={() => setProductDialog(false)} onCreated={(id) => go(`/media-products/${id}`)} />
        <RuleDialog open={ruleDialog.open} rule={ruleDialog.rule} onClose={() => setRuleDialog({ open: false })} />
      </AppLayout>
    </MenuContextProvider>
  );
};

// ── Product page ────────────────────────────────────────────────────────

const ProductPage: React.FC = () => {
  const routes = useRoutes();
  const db = useDb();
  const routeId = useRouteEntityId();
  const product = db.mediaProducts.find((p) => p.id === routeId) ?? db.mediaProducts[0];
  const [tab, setTab] = useState('structure');
  const [editOpen, setEditOpen] = useState(false);
  const [ruleDialog, setRuleDialog] = useState<{ open: boolean; rule?: PricingRule }>({ open: false });
  const [placementDialog, setPlacementDialog] = useState(false);
  const [positionDialog, setPositionDialog] = useState<{ open: boolean; placementId?: string }>({ open: false });
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCapacity, setNewCapacity] = useState(4);
  const [newFormat, setNewFormat] = useState('');

  if (!product) return null;
  const placements = placementsOf(db, product.id);
  const positions = positionsOf(db, product.id);
  const loose = positions.filter((p) => !p.placementId);
  const holds = holdsFor(db, { productId: product.id }).map((h) => ({ ...h, effective: effectiveHoldStatus(h), position: db.positions.find((p) => p.id === h.positionId), booking: db.bookings.find((b) => b.id === h.bookingId) }));
  const openHolds = holds.filter((h) => h.effective === 'held');
  const rules = rulesForProduct(db, product);
  const activeRules = rules.filter((r) => r.status === 'active');
  const avgFill = positions.length ? positions.reduce((s, p) => s + fillRateFor(db, p), 0) / positions.length : 0;
  const position = positions.find((p) => p.id === selectedPosition);
  const basis = product.pricingBasis ?? 'cpm';
  const bookingsOnProduct = db.bookings.filter((b) => b.positionIds.some((id) => positions.some((p) => p.id === id)));

  const toggle = (id: string) => setCollapsed((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const openPositionDialog = (placementId?: string) => { setNewName(''); setNewDesc(''); setNewCapacity(4); setNewFormat(''); setPositionDialog({ open: true, placementId }); };
  const openPlacementDialog = () => { setNewName(''); setNewDesc(''); setPlacementDialog(true); };

  const positionRow = (pos: Position, nested: boolean) => {
    const fill = fillRateFor(db, pos);
    const held = holds.filter((h) => h.positionId === pos.id && h.effective === 'held').length;
    const build = priceFor(db, pos, {});
    return (
      <button
        key={pos.id}
        type="button"
        onClick={() => { setSelectedPosition(pos.id); setTab('pricing'); }}
        className={cn('grid w-full grid-cols-[minmax(0,1fr)_7rem_6rem_6rem_5rem] items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted/60', nested && 'pl-9', selectedPosition === pos.id && 'bg-muted/60')}
      >
        <span className="min-w-0">
          <span className="block truncate font-medium">{pos.name}</span>
          {pos.description && <span className="block truncate text-xs text-muted-foreground">{pos.description}</span>}
        </span>
        <span className="text-xs text-muted-foreground">{pos.format ?? '—'}</span>
        <span className="tabular-nums text-xs">{pos.dailyCapacity}/day</span>
        <span className="flex items-center gap-2 text-xs">
          <span className="h-1.5 w-12 overflow-hidden rounded-full bg-muted"><span className={cn('block h-full rounded-full', fill >= 0.8 ? 'bg-warning-400' : 'bg-primary')} style={{ width: `${Math.round(fill * 100)}%` }} /></span>
          <span className="tabular-nums">{Math.round(fill * 100)}%</span>
        </span>
        <span className="text-right text-xs tabular-nums">{build ? formatPrice(build.listPrice, build.basis) : '—'}{held > 0 && <Badge variant="info" className="ml-1">{held}</Badge>}</span>
      </button>
    );
  };

  return (
    <MenuContextProvider>
      <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: product.name,
          subtitle: `${ENGINE_LABEL[product.engine]} · ${product.description ?? ''}`,
          headerRight: (
            <span className="flex items-center gap-2">
              {statusBadge(product.status)}
              <Button variant="outline" onClick={() => setEditOpen(true)}>Edit product</Button>
            </span>
          ),
        }}
      >
        <div className="space-y-6">
          {/* The facts: the rate card and where the product stands. */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <MetricCard label="List price" value={product.listPrice !== undefined ? formatPrice(product.listPrice, basis) : '—'} subMetric={`${BASIS_LABEL[basis]}${product.floorPrice !== undefined ? ` · floor ${formatPrice(product.floorPrice, basis)}` : ''}`} />
            <MetricCard label="Buying models" value={(product.buyingModels ?? []).map((m) => m[0].toUpperCase() + m.slice(1)).join(' + ') || '—'} subMetric={`Hold ${product.holdDays ?? 5} days`} />
            <MetricCard label="Positions" value={String(positions.length)} subMetric={placements.length ? `in ${placements.length} placements` : 'directly under the product'} />
            <MetricCard label="Fill rate" value={`${Math.round(avgFill * 100)}%`} badgeValue={avgFill >= 0.8 ? 'High demand' : undefined} badgeVariant="warning" subMetric={`${bookingsOnProduct.length} booking${bookingsOnProduct.length === 1 ? '' : 's'}`} />
            <MetricCard label="Pricing rules" value={String(activeRules.length)} subMetric={`${openHolds.length} hold${openHolds.length === 1 ? '' : 's'} at a locked price`} />
          </div>

          <CardWithTabs
            className="w-full"
            activeTab={tab}
            onTabChange={setTab}
            tabs={[
              {
                value: 'structure',
                label: 'Placements & positions',
                content: (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <p className="max-w-2xl text-sm text-muted-foreground">
                        {placements.length
                          ? 'The product groups its positions into placements; the ad server fills the positions. Click a position to see its price.'
                          : 'This proposition puts positions straight under the product. Add a placement to group them.'}
                      </p>
                      <span className="flex shrink-0 gap-2">
                        <Button variant="outline" className="gap-1.5" onClick={openPlacementDialog}><Layers className="h-4 w-4" />Add placement</Button>
                        <Button className="gap-1.5" onClick={() => openPositionDialog(undefined)}><Plus className="h-4 w-4" />Add position</Button>
                      </span>
                    </div>
                    <div className="rounded-lg border border-border">
                      <div className="grid grid-cols-[minmax(0,1fr)_7rem_6rem_6rem_5rem] gap-3 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
                        <span>Name</span><span>Format</span><span>Capacity</span><span>Fill rate</span><span className="text-right">List price</span>
                      </div>
                      <div className="divide-y divide-border">
                        {placements.map((plc) => {
                          const kids = positionsOf(db, product.id, plc.id);
                          const open = !collapsed.has(plc.id);
                          return (
                            <div key={plc.id} className="py-1">
                              <div className="flex items-center gap-2 px-3 py-2">
                                <button type="button" onClick={() => toggle(plc.id)} className="text-muted-foreground" aria-label={open ? 'Collapse' : 'Expand'}>
                                  {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                                <Boxes className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{plc.name}</span>
                                {plc.description && <span className="text-xs text-muted-foreground">— {plc.description}</span>}
                                <Badge variant="secondary" className="ml-1">{kids.length}</Badge>
                                <Button size="sm" variant="ghost" className="ml-auto h-7 gap-1 text-xs" onClick={() => openPositionDialog(plc.id)}><Plus className="h-3 w-3" />Position</Button>
                              </div>
                              {open && kids.map((pos) => positionRow(pos, true))}
                            </div>
                          );
                        })}
                        {loose.length > 0 && (
                          <div className="py-1">
                            {placements.length > 0 && <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Not in a placement</div>}
                            {loose.map((pos) => positionRow(pos, placements.length > 0))}
                          </div>
                        )}
                        {positions.length === 0 && <div className="px-3 py-6 text-center text-sm text-muted-foreground">No positions yet.</div>}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                value: 'pricing',
                label: 'Pricing',
                content: (
                  <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                    <PriceBuildUpCard product={product} position={position} />
                    <div className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base">Rate card</CardTitle></CardHeader>
                        <CardContent className="grid gap-2 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Basis</span><span>{BASIS_LABEL[basis]}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">List price</span><span className="tabular-nums">{product.listPrice !== undefined ? formatPrice(product.listPrice, basis) : '—'}</span></div>
                          {product.floorPrice !== undefined && <div className="flex justify-between"><span className="text-muted-foreground">Auction floor</span><span className="tabular-nums">{formatPrice(product.floorPrice, basis)}</span></div>}
                          <div className="flex justify-between"><span className="text-muted-foreground">Buying models</span><span className="capitalize">{(product.buyingModels ?? []).join(', ') || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Price locked for</span><span>{product.holdDays ?? 5} days</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Priced for</span>
                            <Select value={selectedPosition ?? 'product'} onValueChange={(v) => setSelectedPosition(v === 'product' ? null : v)}>
                              <SelectTrigger className="h-8 w-48"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="product">The product</SelectItem>
                                {positions.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex-row items-center justify-between space-y-0">
                          <CardTitle className="text-base">Pricing rules on this product</CardTitle>
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => setRuleDialog({ open: true })}><Plus className="h-3.5 w-3.5" />Rule</Button>
                        </CardHeader>
                        <CardContent className="divide-y divide-border text-sm">
                          {rules.map((r) => (
                            <button key={r.id} type="button" onClick={() => setRuleDialog({ open: true, rule: r })} className="flex w-full items-center justify-between gap-3 py-2 text-left hover:text-foreground">
                              <span className="min-w-0">
                                <span className="block truncate font-medium">{r.name}</span>
                                <span className="block truncate text-xs text-muted-foreground">{RULE_KIND_LABEL[r.kind]} · {ruleWhen(r)}{r.engine === 'all' ? ' · every proposition' : ''}</span>
                              </span>
                              <span className="flex shrink-0 items-center gap-2">{ruleStatusBadge(r.status)}<span className="w-12 text-right tabular-nums">{indexLabel(r.index)}</span></span>
                            </button>
                          ))}
                          {rules.length === 0 && <p className="py-2 text-muted-foreground">No rules touch this product.</p>}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ),
              },
              {
                value: 'inventory',
                label: `Inventory (${openHolds.length})`,
                content: (
                  <div className="mt-6 space-y-4">
                    <p className="max-w-2xl text-sm text-muted-foreground">Bookings in review hold units on this product&apos;s positions at the price that stood when they were booked. Confirm to keep the price, release to free the inventory.</p>
                    <Table
                      columns={[
                        { key: 'booking', header: 'Booking', render: (row) => <span className="font-medium">{row.booking?.name ?? row.bookingId}</span> },
                        { key: 'position', header: 'Position', render: (row) => row.position?.name ?? row.positionId },
                        { key: 'run', header: 'Run time', render: (row) => `${fmtDate(row.from)} – ${fmtDate(row.to)}` },
                        { key: 'units', header: 'Units', render: (row) => <span className="tabular-nums">{row.units}</span> },
                        { key: 'price', header: 'Locked price', render: (row) => <span className="flex items-center gap-1 tabular-nums"><Lock className="h-3 w-3 text-muted-foreground" />{formatPrice(row.priceLocked, basis)}</span> },
                        { key: 'expires', header: 'Expires', render: (row) => fmtDate(row.expiresAt) },
                        { key: 'status', header: 'Status', render: (row) => holdBadge(row.effective) },
                      ]}
                      data={holds}
                      rowKey={(row) => row.id}
                      rowActions={(row) => row.effective === 'held' ? (
                        <span className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => setHoldStatus(row.id, 'confirmed')}>Confirm</Button>
                          <Button size="sm" variant="ghost" onClick={() => setHoldStatus(row.id, 'released')}>Release</Button>
                        </span>
                      ) : null}
                      emptyState="No inventory on hold for this product."
                    />
                    <Card>
                      <CardHeader><CardTitle className="text-base">Weekly availability</CardTitle></CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {positions.map((pos) => {
                            const entries = db.availability.filter((a) => a.positionId === pos.id).sort((a, b) => a.week.localeCompare(b.week));
                            const cap = pos.dailyCapacity * 7;
                            return (
                              <div key={pos.id} className="grid grid-cols-[12rem_minmax(0,1fr)] items-center gap-3 text-sm">
                                <span className="truncate">{pos.name}</span>
                                <span className="flex gap-1">
                                  {entries.map((e) => {
                                    const f = cap ? Math.min(1, e.booked / cap) : 0;
                                    return <span key={e.week} title={`${e.week}: ${e.booked}/${cap}`} className={cn('h-5 flex-1 rounded-sm', f >= 0.95 ? 'bg-destructive/70' : f >= 0.8 ? 'bg-warning-400/70' : f > 0 ? 'bg-primary/50' : 'bg-muted')} />;
                                  })}
                                  {entries.length === 0 && <span className="text-xs text-muted-foreground">No calendar yet</span>}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">One block per week from the booking calendar. Amber from 80% booked, red from 95% — where the demand rules kick in.</p>
                      </CardContent>
                    </Card>
                  </div>
                ),
              },
              {
                value: 'rules',
                label: 'Rules & constraints',
                content: (
                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader><CardTitle className="text-base">What the product comes with</CardTitle></CardHeader>
                      <CardContent>
                        {(product.constraints ?? []).length ? (
                          <ul className="grid gap-2 text-sm">
                            {(product.constraints ?? []).map((c) => <li key={c} className="flex items-start gap-2"><Tag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />{c}</li>)}
                          </ul>
                        ) : <p className="text-sm text-muted-foreground">No constraints yet — edit the product to add them.</p>}
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => setEditOpen(true)}>Edit constraints</Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle className="text-base">Where it is used</CardTitle></CardHeader>
                      <CardContent className="grid gap-3 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Owner</span><span>{product.owner ?? '—'}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Partner</span><span>{product.partner ?? 'Edge'}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Workflow</span><button type="button" className="inline-flex items-center gap-1 underline-offset-2 hover:underline" onClick={() => go(`/configuration/${product.engine}/settings?tab=workflow`)}>{ENGINE_LABEL[product.engine]} workflow<ArrowRight className="h-3.5 w-3.5" /></button></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Bookings on it</span><span className="tabular-nums">{bookingsOnProduct.length}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Sold through</span><span>{(product.buyingModels ?? []).map((m) => m === 'guaranteed' ? 'Guaranteed bookings' : 'Auction').join(' and ') || '—'}</span></div>
                      </CardContent>
                    </Card>
                  </div>
                ),
              },
            ]}
          />
        </div>

        <ProductDialog open={editOpen} product={product} onClose={() => setEditOpen(false)} />
        <RuleDialog open={ruleDialog.open} rule={ruleDialog.rule} engine={product.engine} productId={ruleDialog.rule ? undefined : product.id} onClose={() => setRuleDialog({ open: false })} />

        <Dialog open={placementDialog} onOpenChange={(o) => !o && setPlacementDialog(false)}>
          <DialogContent>
            <DialogHeader><DialogTitle>New placement</DialogTitle><DialogDescription>A group of positions inside {product.name}.</DialogDescription></DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-1.5"><Label>Name</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Above the fold" /></div>
              <div className="grid gap-1.5"><Label>Description</Label><Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPlacementDialog(false)}>Cancel</Button>
              <Button disabled={!newName.trim()} onClick={() => { createPlacement({ mediaProductId: product.id, name: newName.trim(), description: newDesc.trim() || undefined }); setPlacementDialog(false); }}>Add placement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={positionDialog.open} onOpenChange={(o) => !o && setPositionDialog({ open: false })}>
          <DialogContent>
            <DialogHeader><DialogTitle>New position</DialogTitle><DialogDescription>A slot the ad server fills{positionDialog.placementId ? ` in ${placements.find((p) => p.id === positionDialog.placementId)?.name}` : ''}. It inherits the product&apos;s rate card unless priced on its own.</DialogDescription></DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-1.5"><Label>Name</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Hero banner" /></div>
              <div className="grid gap-1.5"><Label>Description</Label><Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Format</Label><Input value={newFormat} onChange={(e) => setNewFormat(e.target.value)} placeholder="970×250" /></div>
                <div className="grid gap-1.5"><Label>Daily capacity</Label><Input type="number" value={newCapacity} onChange={(e) => setNewCapacity(Number(e.target.value))} /></div>
              </div>
              {placements.length > 0 && (
                <div className="grid gap-1.5">
                  <Label>Placement</Label>
                  <Select value={positionDialog.placementId ?? 'none'} onValueChange={(v) => setPositionDialog({ open: true, placementId: v === 'none' ? undefined : v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not in a placement</SelectItem>
                      {placements.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPositionDialog({ open: false })}>Cancel</Button>
              <Button disabled={!newName.trim()} onClick={() => { createPosition({ mediaProductId: product.id, placementId: positionDialog.placementId, name: newName.trim(), description: newDesc.trim() || undefined, format: newFormat.trim() || undefined, dailyCapacity: newCapacity }); setPositionDialog({ open: false }); }}>Add position</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </MenuContextProvider>
  );
};

export const Overview: Story = { render: () => <OverviewPage /> };
export const Product: Story = { render: () => <ProductPage /> };
