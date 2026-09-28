import type { Invoice } from '@/lib/db/types';

/**
 * The contract between Edge and the retailer's billing service (RE).
 *
 * Edge sends what is billable; the billing service makes the invoice and
 * owns it from there — its number, its due date, whether it is paid. Edge
 * mirrors the invoices back so the billing page, the plan and the booking
 * can show where the money stands without anyone opening a second system.
 *
 * Two calls, both small on purpose:
 *
 *   POST {base}/billable-lines   Edge → billing: one plan's completed
 *                                 bookings, priced. Returns the invoice.
 *   GET  {base}/invoices?since=   billing → Edge: invoices changed since the
 *                                 last sync, so paid and overdue flow back.
 *
 * The paths and payloads are Edge's proposal, to be agreed with the billing
 * service team. Until a service address is configured (the environment
 * variable NEXT_PUBLIC_BILLING_SERVICE_URL), the prototype runs the mock
 * below, which answers the way the service is expected to.
 */

export type BillingBasis = 'agreed' | 'spend';

/** One booking, priced — what Edge knows and the invoice needs. */
export interface BillableLinePayload {
  bookingId: string;
  campaignId: string;
  description: string;
  /** Agreed price for a guaranteed booking; spend for an auction booking. */
  basis: BillingBasis;
  /** Excluding VAT, in euros. */
  amount: number;
  /** A correction, negative for a credit — under-delivery on a guaranteed booking. */
  adjustment?: number;
  adjustmentReason?: string;
}

/** One plan's billable lines, sent together so they land on one invoice. */
export interface SubmitBillableLinesRequest {
  mediaPlanId: string;
  advertiserId: string;
  /** The advertiser's purchase order — required on the invoice. */
  poNumber: string;
  currency: 'EUR';
  lines: BillableLinePayload[];
}

/** An invoice as the billing service reports it. */
export type InvoiceRecord = Omit<Invoice, 'syncedAt'>;

export interface BillingServiceClient {
  /** 'mock' in the prototype; 'live' once a service address is set. */
  readonly mode: 'mock' | 'live';
  submitBillableLines(request: SubmitBillableLinesRequest): Promise<InvoiceRecord>;
  listInvoices(params?: { since?: string }): Promise<InvoiceRecord[]>;
}

// ── Live ──────────────────────────────────────────────────────────────────

export function liveBillingService(baseUrl: string): BillingServiceClient {
  const url = (path: string) => `${baseUrl.replace(/\/$/, '')}${path}`;
  const json = async <T>(res: Response): Promise<T> => {
    if (!res.ok) throw new Error(`Billing service answered ${res.status}`);
    return (await res.json()) as T;
  };
  return {
    mode: 'live',
    async submitBillableLines(request) {
      return json<InvoiceRecord>(await fetch(url('/billable-lines'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      }));
    },
    async listInvoices(params) {
      const query = params?.since ? `?since=${encodeURIComponent(params.since)}` : '';
      return json<InvoiceRecord[]>(await fetch(url(`/invoices${query}`)));
    },
  };
}

// ── Mock ──────────────────────────────────────────────────────────────────

const PAYMENT_TERMS_DAYS = 30;
const VAT_RATE = 0.21;

/**
 * Answers the way the billing service is expected to: a new invoice number
 * per submission, issued today, due in thirty days, 21% VAT. It keeps no
 * state of its own — the invoices it has made live in Edge's store, which
 * `existing` reads, the same as a sync would return them.
 */
export function mockBillingService(existing: () => Invoice[]): BillingServiceClient {
  return {
    mode: 'mock',
    async submitBillableLines(request) {
      const invoices = existing();
      const year = new Date().getFullYear();
      const seq = invoices
        .map((i) => parseInt(i.number.split('-').pop() ?? '0', 10))
        .filter((n) => !Number.isNaN(n))
        .reduce((a, b) => Math.max(a, b), 0) + 1;
      const issued = new Date();
      const due = new Date(issued.getTime() + PAYMENT_TERMS_DAYS * 86400000);
      return {
        id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
        number: `${year}-${String(seq).padStart(4, '0')}`,
        advertiserId: request.advertiserId,
        mediaPlanId: request.mediaPlanId,
        poNumber: request.poNumber,
        status: 'sent',
        issuedAt: issued.toISOString(),
        dueAt: due.toISOString(),
        vatRate: VAT_RATE,
        lines: request.lines.map((l, i) => ({
          id: `L-${i + 1}`,
          bookingId: l.bookingId,
          description: l.description,
          amount: l.amount,
          adjustment: l.adjustment,
          adjustmentReason: l.adjustmentReason,
        })),
      };
    },
    async listInvoices(params) {
      return existing()
        .filter((i) => !params?.since || i.syncedAt >= params.since)
        .map(({ syncedAt: _synced, ...rest }) => rest);
    },
  };
}

/** The client Edge uses: live when a service address is configured. */
export function billingService(existing: () => Invoice[]): BillingServiceClient {
  const base = process.env.NEXT_PUBLIC_BILLING_SERVICE_URL;
  return base ? liveBillingService(base) : mockBillingService(existing);
}
