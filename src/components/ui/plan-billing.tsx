'use client';

import * as React from 'react';
import { AlertTriangle, ArrowRight, Send } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import { Table } from './table';
import { useToast } from './toast';
import {
  BILLING_STATE_LABEL,
  BILLING_STATE_VARIANT,
  billableLines,
  formatEuro,
  invoiceTotals,
  sendToBilling,
  useDb,
  useSession,
  type BillableLine,
} from '@/lib/db';

/**
 * A media plan's billing: every booking that has been bought, what it is
 * billed on and where its invoice stands. The plan is invoiced as a whole
 * under its PO number, so the send action sits on the plan, not the row.
 */
export const PlanBilling: React.FC<{ mediaPlanId: string }> = ({ mediaPlanId }) => {
  const db = useDb();
  const user = useSession();
  const toast = useToast();
  const [busy, setBusy] = React.useState(false);
  const plan = db.mediaPlans.find((p) => p.id === mediaPlanId);
  const lines = billableLines(db, { mediaPlanId });
  if (!plan) return null;

  const ready = lines.filter((l) => l.state === 'ready');
  const isRetailer = user?.side !== 'advertiser';
  const hasPo = !!plan.poNumber?.trim();
  const invoiceNumbers = [...new Set(lines.map((l) => l.invoice?.number).filter(Boolean))];

  const send = async () => {
    setBusy(true);
    const result = await sendToBilling(mediaPlanId);
    setBusy(false);
    toast(result.ok
      ? { title: 'Sent to the billing service', description: `Invoice ${result.invoice.number}, ${formatEuro(invoiceTotals(result.invoice).subtotal)} excl. VAT.` }
      : { title: 'Not sent', description: result.reason });
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {hasPo ? `Invoiced under ${plan.poNumber}` : 'No PO number yet'}
          {invoiceNumbers.length ? ` · invoice${invoiceNumbers.length === 1 ? '' : 's'} ${invoiceNumbers.join(', ')}` : ''}.
          {' '}Guaranteed bookings are billed at their agreed price, auction bookings at their spend.
        </p>
        <div className="flex items-center gap-2">
          {isRetailer && ready.length > 0 && (
            <Button size="sm" className="gap-1.5" disabled={!hasPo || busy} onClick={send} title={hasPo ? undefined : 'Add the PO number first'}>
              <Send className="h-3.5 w-3.5" />Send {ready.length} to billing
            </Button>
          )}
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { window.location.href = '/billing'; }}>
            Billing<ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {!hasPo && ready.length > 0 && (
        <p className="flex items-center gap-1.5 text-sm text-warning-700"><AlertTriangle className="h-4 w-4" />Ready to invoice, but the plan has no PO number. Add it on the Media plan details tab.</p>
      )}
      <Table
        columns={[
          { key: 'booking', header: 'Booking', render: (l: BillableLine) => <span className="font-medium">{l.booking.name}</span> },
          { key: 'basis', header: 'Billed on', render: (l: BillableLine) => (l.basis === 'agreed' ? 'Agreed price' : 'Spend') },
          { key: 'state', header: 'Status', render: (l: BillableLine) => <Badge variant={BILLING_STATE_VARIANT[l.state]}>{BILLING_STATE_LABEL[l.state]}</Badge> },
          { key: 'invoice', header: 'Invoice', render: (l: BillableLine) => <span className="tabular-nums text-muted-foreground">{l.invoice?.number ?? '—'}</span> },
          { key: 'credit', header: 'Credit', render: (l: BillableLine) => (l.adjustment ? <span className="tabular-nums" title={l.adjustmentReason}>{formatEuro(l.adjustment)}</span> : <span className="text-muted-foreground">—</span>) },
          { key: 'total', header: 'Excl. VAT', summary: (rows: BillableLine[]) => formatEuro(rows.reduce((n, l) => n + l.total, 0)), render: (l: BillableLine) => <span className="tabular-nums">{formatEuro(l.total)}</span> },
        ]}
        data={lines}
        rowKey={(l) => l.bookingId}
        hideActions
        emptyState="Nothing billable yet — a booking becomes billable once it is out of review."
      />
    </div>
  );
};
