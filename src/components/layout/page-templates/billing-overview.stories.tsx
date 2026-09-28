import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table } from '@/components/ui/table';
import { FilterBar } from '@/components/ui/filter-bar';
import { MetricRow, type MetricDefinition } from '@/components/ui/metric-row';
import { useToast } from '@/components/ui/toast';
import {
  RightDrawer, RightDrawerBody, RightDrawerContent, RightDrawerDescription, RightDrawerFooter, RightDrawerHeader, RightDrawerTitle,
} from '@/components/ui/right-drawer';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import {
  useDb, useSession, billableLines, billingSummary, invoiceTotals, effectiveInvoiceStatus, sendToBilling, syncBilling, billingServiceMode,
  formatEuro, BILLING_STATE_LABEL, BILLING_STATE_VARIANT,
  type BillableLine, type Invoice,
} from '@/lib/db';
import { AlertTriangle, ArrowRight, RefreshCw, Send } from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Billing',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Billing

Where the money stands, without opening the billing service. Invoices are
made by the retailer's billing service and mirrored here; what Edge adds is
what is billable — a completed booking, at its agreed price when guaranteed
and at its spend when bought at auction, with a credit when a guaranteed
booking ended short of its goal.

Three tabs: the invoices (sent, paid, overdue), what is ready to invoice
(per media plan, sent to the billing service in one go under its PO number)
and what is still upcoming. Advertisers see their own organisation only.
        `,
      },
    },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const go = (href: string) => { if (typeof window !== 'undefined') window.location.href = href; };

/** A plan with lines ready to invoice — one row, sent as one invoice. */
interface ReadyPlan {
  id: string;
  name: string;
  advertiser: string;
  poNumber?: string;
  lines: BillableLine[];
  credit: number;
  total: number;
}

function BillingPage() {
  const { theme: storybookTheme } = useStorybookTheme();
  const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
  const db = useDb();
  const user = useSession();
  const toast = useToast();
  // An advertiser sees only their own organisation's invoices.
  const ownOrg = user?.side === 'advertiser' ? user.advertiserId : undefined;
  const isRetailer = !ownOrg;

  const [tab, setTab] = React.useState('invoices');
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [orgFilter, setOrgFilter] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState('');
  const [openInvoice, setOpenInvoice] = React.useState<string | null>(null);
  const [openPlan, setOpenPlan] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<'mock' | 'live'>('mock');
  React.useEffect(() => { setMode(billingServiceMode()); }, []);

  const orgName = (id: string) => db.advertisers.find((a) => a.id === id)?.name ?? id;
  const planName = (id: string) => db.mediaPlans.find((p) => p.id === id)?.name ?? id;
  const matches = (orgId: string, planId: string, extra = '') =>
    (!ownOrg || orgId === ownOrg)
    && (orgFilter.length === 0 || orgFilter.includes(orgId))
    && (!search || `${orgName(orgId)} ${planName(planId)} ${extra}`.toLowerCase().includes(search.toLowerCase()));

  const lines = billableLines(db, ownOrg ? { advertiserId: ownOrg } : {});
  const summary = billingSummary(lines);

  const invoices = db.invoices
    .filter((inv) => matches(inv.advertiserId, inv.mediaPlanId, inv.number))
    .map((inv) => ({ ...inv, effective: effectiveInvoiceStatus(inv), totals: invoiceTotals(inv) }))
    .filter((inv) => statusFilter.length === 0 || statusFilter.includes(inv.effective))
    .sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1));

  const readyPlans: ReadyPlan[] = Object.values(
    lines.filter((l) => l.state === 'ready' && matches(l.advertiserId, l.mediaPlanId, l.booking.name))
      .reduce<Record<string, BillableLine[]>>((acc, l) => { (acc[l.mediaPlanId] ??= []).push(l); return acc; }, {}),
  ).map((ls) => {
    const plan = db.mediaPlans.find((p) => p.id === ls[0].mediaPlanId)!;
    return {
      id: plan.id, name: plan.name, advertiser: orgName(plan.advertiserId), poNumber: plan.poNumber, lines: ls,
      credit: ls.reduce((n, l) => n + (l.adjustment ?? 0), 0),
      total: Math.round(ls.reduce((n, l) => n + l.total, 0) * 100) / 100,
    };
  });

  const upcoming = lines
    .filter((l) => l.state === 'upcoming' && matches(l.advertiserId, l.mediaPlanId, l.booking.name))
    .sort((a, b) => (a.booking.endDate < b.booking.endDate ? -1 : 1));

  const orgOptions = [...new Set([...db.invoices.map((i) => i.advertiserId), ...lines.map((l) => l.advertiserId)])]
    .filter((id) => !ownOrg || id === ownOrg)
    .map((id) => ({ label: orgName(id), value: id }));

  const metrics: MetricDefinition[] = [
    { key: 'ready', label: 'Ready to invoice', value: formatEuro(summary.ready), subMetric: `${readyPlans.length} media plan${readyPlans.length === 1 ? '' : 's'}` },
    { key: 'invoiced', label: 'Invoiced, not yet paid', value: formatEuro(summary.invoiced), subMetric: 'within payment terms' },
    { key: 'overdue', label: 'Overdue', value: formatEuro(summary.overdue), subMetric: 'past the due date', badgeValue: summary.overdue > 0 ? 'Follow up' : undefined, badgeVariant: 'destructive' },
    { key: 'paid', label: 'Paid', value: formatEuro(summary.paid), subMetric: 'this year' },
    { key: 'upcoming', label: 'Upcoming', value: formatEuro(summary.upcoming), subMetric: 'bookings still running' },
  ];
  const [metricKeys, setMetricKeys] = React.useState(metrics.map((m) => m.key));

  const send = async (planId: string) => {
    setBusy(planId);
    const result = await sendToBilling(planId);
    setBusy(null);
    if (result.ok) {
      toast({ title: 'Sent to the billing service', description: `Invoice ${result.invoice.number} for ${planName(planId)}, ${formatEuro(invoiceTotals(result.invoice).subtotal)} excl. VAT.` });
      setOpenPlan(null);
    } else {
      toast({ title: 'Not sent', description: result.reason });
    }
  };

  const sync = async () => {
    setBusy('sync');
    const result = await syncBilling();
    setBusy(null);
    toast(result.ok
      ? { title: 'Synced with the billing service', description: `${result.count} invoice${result.count === 1 ? '' : 's'} up to date.` }
      : { title: 'Sync failed', description: result.reason ?? 'The billing service did not answer.' });
  };

  const lastSync = db.invoices.reduce((latest, i) => (i.syncedAt > latest ? i.syncedAt : latest), '');
  const invoice = invoices.find((i) => i.id === openInvoice) ?? null;
  const plan = readyPlans.find((p) => p.id === openPlan) ?? null;

  const lineColumns = [
    { key: 'booking', header: 'Booking', render: (l: { description: string }) => <span className="font-medium">{l.description}</span> },
    { key: 'amount', header: 'Amount', summary: 'sum' as const, render: (l: { amount: number }) => <span className="tabular-nums">{formatEuro(l.amount)}</span> },
    { key: 'adjustment', header: 'Credit', render: (l: { adjustment?: number; adjustmentReason?: string }) => l.adjustment
      ? <span className="flex flex-col leading-tight"><span className="tabular-nums">{formatEuro(l.adjustment)}</span><span className="text-xs text-muted-foreground">{l.adjustmentReason}</span></span>
      : <span className="text-muted-foreground">—</span> },
  ];

  return (
    <MenuContextProvider>
      <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Billing',
          subtitle: isRetailer
            ? 'What is invoiced, what is ready to invoice and what is still running — mirrored from the billing service.'
            : 'Your invoices, and what is still to be invoiced.',
          headerRight: isRetailer ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground md:inline">
                {mode === 'mock' ? 'Billing service: prototype mock' : 'Billing service: connected'}{lastSync ? ` · synced ${fmtDate(lastSync)}` : ''}
              </span>
              <Button variant="outline" className="gap-1.5" onClick={sync} disabled={busy === 'sync'}>
                <RefreshCw className="h-4 w-4" />Sync
              </Button>
            </div>
          ) : undefined,
        }}
      >
        <div className="space-y-section">
          <MetricRow metrics={metrics} selectedKeys={metricKeys} onSelectionChange={setMetricKeys} maxVisible={5} hideMeasurement />

          <CardWithTabs
            className="w-full"
            activeTab={tab}
            onTabChange={setTab}
            tabs={[
              {
                value: 'invoices',
                label: `Invoices (${invoices.length})`,
                content: (
                  <div className="mt-6 space-y-4">
                    <FilterBar
                      filters={[
                        { name: 'Status', options: (['sent', 'overdue', 'paid', 'credited'] as const).map((s) => ({ label: BILLING_STATE_LABEL[s], value: s })), selectedValues: statusFilter, onChange: setStatusFilter },
                        ...(isRetailer ? [{ name: 'Organisation', options: orgOptions, selectedValues: orgFilter, onChange: setOrgFilter }] : []),
                      ]}
                      searchValue={search}
                      onSearchChange={setSearch}
                      searchPlaceholder="Search invoices…"
                    />
                    <Table
                      columns={[
                        { key: 'number', header: 'Invoice', render: (r) => <span className="font-medium tabular-nums">{r.number}</span> },
                        ...(isRetailer ? [{ key: 'org', header: 'Organisation', render: (r: (typeof invoices)[number]) => orgName(r.advertiserId) }] : []),
                        { key: 'plan', header: 'Media plan', render: (r) => planName(r.mediaPlanId) },
                        { key: 'po', header: 'PO number', render: (r) => <span className="tabular-nums text-muted-foreground">{r.poNumber || '—'}</span> },
                        { key: 'status', header: 'Status', render: (r) => <Badge variant={BILLING_STATE_VARIANT[r.effective]}>{BILLING_STATE_LABEL[r.effective]}</Badge> },
                        { key: 'issued', header: 'Issued', render: (r) => fmtDate(r.issuedAt) },
                        { key: 'due', header: 'Due', render: (r) => <span className={r.effective === 'overdue' ? 'text-destructive' : undefined}>{fmtDate(r.dueAt)}</span> },
                        { key: 'subtotal', header: 'Excl. VAT', summary: (rows) => formatEuro(rows.reduce((n, r) => n + r.totals.subtotal, 0)), render: (r) => <span className="tabular-nums">{formatEuro(r.totals.subtotal)}</span> },
                        { key: 'total', header: 'Incl. VAT', summary: (rows) => formatEuro(rows.reduce((n, r) => n + r.totals.total, 0)), render: (r) => <span className="tabular-nums">{formatEuro(r.totals.total)}</span> },
                      ]}
                      data={invoices}
                      rowKey={(r) => r.id}
                      onRowClick={(r) => setOpenInvoice(r.id)}
                      hideActions
                      emptyState="No invoices yet."
                    />
                  </div>
                ),
              },
              {
                value: 'ready',
                label: `Ready to invoice (${readyPlans.length})`,
                content: (
                  <div className="mt-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Completed bookings, not yet on an invoice. A plan goes to the billing service in one go, under its PO number — guaranteed bookings at their agreed price, with a credit where they ended short of their goal.
                    </p>
                    <Table
                      columns={[
                        { key: 'plan', header: 'Media plan', render: (r) => <span className="font-medium">{r.name}</span> },
                        ...(isRetailer ? [{ key: 'org', header: 'Organisation', render: (r: ReadyPlan) => r.advertiser }] : []),
                        { key: 'po', header: 'PO number', render: (r) => r.poNumber?.trim()
                          ? <span className="tabular-nums text-muted-foreground">{r.poNumber}</span>
                          : <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" />Missing</Badge> },
                        { key: 'bookings', header: 'Bookings', render: (r) => <span className="tabular-nums">{r.lines.length}</span> },
                        { key: 'credit', header: 'Credit', render: (r) => r.credit ? <span className="tabular-nums">{formatEuro(r.credit)}</span> : <span className="text-muted-foreground">—</span> },
                        { key: 'total', header: 'Excl. VAT', summary: (rows) => formatEuro(rows.reduce((n, r) => n + r.total, 0)), render: (r) => <span className="tabular-nums">{formatEuro(r.total)}</span> },
                        ...(isRetailer ? [{
                          key: 'send', header: '', render: (r: ReadyPlan) => (
                            <div onClick={(e) => e.stopPropagation()}>
                              <Button size="sm" variant="outline" className="gap-1.5" disabled={!r.poNumber?.trim() || busy === r.id} onClick={() => send(r.id)}>
                                <Send className="h-3.5 w-3.5" />Send to billing
                              </Button>
                            </div>
                          ),
                        }] : []),
                      ]}
                      data={readyPlans}
                      rowKey={(r) => r.id}
                      onRowClick={(r) => setOpenPlan(r.id)}
                      hideActions
                      emptyState="Nothing is waiting to be invoiced."
                    />
                  </div>
                ),
              },
              {
                value: 'upcoming',
                label: `Upcoming (${upcoming.length})`,
                content: (
                  <div className="mt-6 space-y-4">
                    <p className="text-sm text-muted-foreground">Bookings still running. They become ready to invoice the day they complete.</p>
                    <Table
                      columns={[
                        { key: 'booking', header: 'Booking', render: (l) => <span className="font-medium">{l.booking.name}</span> },
                        { key: 'plan', header: 'Media plan', render: (l) => planName(l.mediaPlanId) },
                        ...(isRetailer ? [{ key: 'org', header: 'Organisation', render: (l: BillableLine) => orgName(l.advertiserId) }] : []),
                        { key: 'basis', header: 'Billed on', render: (l) => (l.basis === 'agreed' ? 'Agreed price' : 'Spend so far') },
                        { key: 'ends', header: 'Ends', render: (l) => fmtDate(l.booking.endDate) },
                        { key: 'amount', header: 'Excl. VAT', summary: (rows) => formatEuro(rows.reduce((n, l) => n + l.total, 0)), render: (l) => <span className="tabular-nums">{formatEuro(l.total)}</span> },
                      ]}
                      data={upcoming}
                      rowKey={(l) => l.bookingId}
                      onRowClick={(l) => go(`/campaigns/plan/${l.mediaPlanId}`)}
                      hideActions
                      emptyState="No bookings running."
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* An invoice, open: its lines, credits and totals. */}
        <RightDrawer open={!!invoice} onOpenChange={(o) => !o && setOpenInvoice(null)}>
          <RightDrawerContent className="sm:max-w-2xl">
            {invoice && (
              <>
                <RightDrawerHeader>
                  <RightDrawerTitle className="flex items-center gap-2">
                    Invoice {invoice.number}
                    <Badge variant={BILLING_STATE_VARIANT[invoice.effective]}>{BILLING_STATE_LABEL[invoice.effective]}</Badge>
                  </RightDrawerTitle>
                  <RightDrawerDescription>
                    {orgName(invoice.advertiserId)} · {planName(invoice.mediaPlanId)} · {invoice.poNumber || 'No PO number'}
                  </RightDrawerDescription>
                </RightDrawerHeader>
                <RightDrawerBody className="space-y-5">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div><div className="text-xs text-muted-foreground">Issued</div>{fmtDate(invoice.issuedAt)}</div>
                    <div><div className="text-xs text-muted-foreground">Due</div>{fmtDate(invoice.dueAt)}</div>
                    <div><div className="text-xs text-muted-foreground">Paid</div>{invoice.paidAt ? fmtDate(invoice.paidAt) : '—'}</div>
                  </div>
                  <Table columns={lineColumns} data={invoice.lines} rowKey={(l) => l.id} hideActions hideRefreshedAt />
                  <InvoiceTotals invoice={invoice} />
                  <p className="text-xs text-muted-foreground">Last synced with the billing service on {fmtDate(invoice.syncedAt)}.</p>
                </RightDrawerBody>
                <RightDrawerFooter className="justify-end">
                  <Button variant="outline" className="gap-1.5" onClick={() => go(`/campaigns/plan/${invoice.mediaPlanId}`)}>Open media plan<ArrowRight className="h-4 w-4" /></Button>
                </RightDrawerFooter>
              </>
            )}
          </RightDrawerContent>
        </RightDrawer>

        {/* A plan ready to invoice: the lines that will go out together. */}
        <RightDrawer open={!!plan} onOpenChange={(o) => !o && setOpenPlan(null)}>
          <RightDrawerContent className="sm:max-w-2xl">
            {plan && (
              <>
                <RightDrawerHeader>
                  <RightDrawerTitle>{plan.name}</RightDrawerTitle>
                  <RightDrawerDescription>{plan.advertiser} · {plan.poNumber || 'PO number missing'} · ready to invoice</RightDrawerDescription>
                </RightDrawerHeader>
                <RightDrawerBody className="space-y-5">
                  <Table
                    columns={[
                      ...lineColumns,
                      { key: 'basis', header: 'Billed on', render: (l: { basis?: string }) => (l.basis === 'agreed' ? 'Agreed price' : 'Spend') },
                    ]}
                    data={plan.lines.map((l) => ({ id: l.bookingId, description: l.booking.name, amount: l.amount, adjustment: l.adjustment, adjustmentReason: l.adjustmentReason, basis: l.basis }))}
                    rowKey={(l) => l.id}
                    hideActions
                    hideRefreshedAt
                  />
                  <div className="flex items-center justify-between border-t pt-3 text-sm font-semibold">
                    <span>To invoice, excl. VAT</span>
                    <span className="tabular-nums">{formatEuro(plan.total)}</span>
                  </div>
                  {!plan.poNumber?.trim() && (
                    <p className="flex items-center gap-1.5 text-sm text-warning-700"><AlertTriangle className="h-4 w-4" />The plan has no PO number. Ask the advertiser for it before sending.</p>
                  )}
                </RightDrawerBody>
                {isRetailer && (
                  <RightDrawerFooter className="justify-end">
                    <Button className="gap-1.5" disabled={!plan.poNumber?.trim() || busy === plan.id} onClick={() => send(plan.id)}>
                      <Send className="h-4 w-4" />Send to billing
                    </Button>
                  </RightDrawerFooter>
                )}
              </>
            )}
          </RightDrawerContent>
        </RightDrawer>
      </AppLayout>
    </MenuContextProvider>
  );
}

/** Subtotal, VAT and total, the way the invoice itself reads. */
const InvoiceTotals: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  const t = invoiceTotals(invoice);
  return (
    <div className="space-y-1.5 border-t pt-3 text-sm">
      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{formatEuro(t.subtotal)}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">VAT {Math.round(invoice.vatRate * 100)}%</span><span className="tabular-nums">{formatEuro(t.vat)}</span></div>
      <div className="flex justify-between font-semibold"><span>Total</span><span className="tabular-nums">{formatEuro(t.total)}</span></div>
    </div>
  );
};

export const Overview: Story = { render: () => <BillingPage /> };
