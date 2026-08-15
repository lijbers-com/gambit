'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { FormSection } from './form-section';
import { Inbox, type InboxItem } from './inbox';
import { MessageDrawer } from './message-drawer';
import { useInboxState, markRead, type MessageKind } from '@/lib/db';
import {
  shareOfVoiceCase,
  budgetRecommendationCase,
  keywordRecommendationCase,
  salesUpliftTestCase,
  type CaseData,
} from '@/lib/case-templates';

/**
 * Notifications on the insights dashboard — insights and recommendations,
 * each opening the same message drawer with a full business case built from
 * a case template (lib/case-templates). Adding an example is one entry here.
 */

interface InsightMessage {
  id: string;
  kind: MessageKind;
  subject: string;
  preview: string;
  context?: string;
  caseData: CaseData;
}

const MESSAGES: InsightMessage[] = [
  {
    id: 'INS-uplift-instore',
    kind: 'insight',
    subject: 'In-store screens beat entrance DOOH on sales uplift',
    preview: 'The neighbours A/B test measured +59% uplift for in-store screens vs. +40% at the entrance — and twice the new customers (+243% vs. +123%).',
    context: 'Digital in-store · A/B test, week 12',
    caseData: salesUpliftTestCase({
      test: 'Neighbours A/B test',
      a: { label: 'Entrance DOOH', uplift: 40, newCustomers: 123, base: '€35K', perStore: '€139' },
      b: { label: 'In-store screens', uplift: 59, newCustomers: 243, base: '€29K', perStore: '€173' },
    }),
  },
  {
    id: 'INS-sov-45',
    kind: 'insight',
    subject: 'Share of voice reached 45% in your category',
    preview: 'Up 4 points on last month — your brand now takes 45% of category impressions against 55% for all competitors combined.',
    context: 'All propositions · Category: soft drinks',
    caseData: shareOfVoiceCase({ brandShare: 45, category: 'soft drinks', trendPts: 4 }),
  },
  {
    id: 'INS-budget-shift',
    kind: 'recommendation',
    subject: 'Shift €2,000 from display to sponsored products',
    preview: 'Sponsored products is returning 4.4x against display’s 2.1x this month. A €2,000 shift raises expected return without changing the plan total.',
    context: 'Holiday Sale Plan',
    caseData: budgetRecommendationCase({ from: 'Display', to: 'Sponsored products', amount: '€2,000', roasFrom: '2.1x', roasTo: '4.4x' }),
  },
  {
    id: 'INS-keywords',
    kind: 'recommendation',
    subject: 'Add 4 keywords your campaign is missing',
    preview: '18.4K monthly searches in your category run without your sponsored placement — competitors take the top slot on every one.',
    context: 'Sponsored products · Summer Launch',
    caseData: keywordRecommendationCase({
      keywords: ['cola zero sugar', 'soda multipack', 'party drinks', 'cola 1.5l'],
      volume: '18.4K',
      estClicks: '640',
    }),
  },
];

/**
 * A chart card's own insights: the top few messages about THIS chart, shown
 * where the number lives instead of in a separate notifications feed. Each
 * row opens the standard drawer with its template-built case.
 */
export interface CardInsight {
  id: string;
  kind: MessageKind;
  subject: string;
  preview: string;
  context?: string;
  caseData: CaseData;
}

export const CardInsightList: React.FC<{ insights: CardInsight[]; className?: string }> = ({ insights, className }) => {
  const status = useInboxState();
  const [openId, setOpenId] = React.useState<string | null>(null);
  const active = insights.find((m) => m.id === openId) ?? null;
  if (insights.length === 0) return null;
  return (
    <div className={className}>
      <div className="divide-y divide-border overflow-hidden rounded-lg border">
        {insights.slice(0, 3).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => { markRead(m.id); setOpenId(m.id); }}
            className="group/msg flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
          >
            <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center">
              {(status[m.id] ?? 'unread') === 'unread' && (
                <span className="h-2 w-2 rounded-full bg-primary" aria-label="Unread" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{m.subject}</span>
                <Badge variant={m.kind === 'recommendation' ? 'secondary' : 'outline'} className="shrink-0 px-2 py-0.5 text-xs font-medium capitalize">
                  {m.kind}
                </Badge>
              </span>
              {/* One line, like every other notification row. The context line
                  the inbox adds is dropped here: the card IS the context. */}
              <span className="mt-1.5 block truncate text-sm text-muted-foreground">{m.preview}</span>
            </span>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover/msg:text-foreground" />
          </button>
        ))}
      </div>
      {active && (
        <MessageDrawer
          open
          onOpenChange={(isOpen) => { if (!isOpen) setOpenId(null); }}
          kind={active.kind}
          subject={active.subject}
          context={active.context}
          message={active.preview}
          businessCase={active.caseData}
        />
      )}
    </div>
  );
};

export const InsightsNotifications: React.FC<{ className?: string }> = ({ className }) => {
  const status = useInboxState();
  const [openId, setOpenId] = React.useState<string | null>(null);
  const active = MESSAGES.find((m) => m.id === openId) ?? null;

  const items: InboxItem[] = MESSAGES.map((m) => ({
    id: m.id,
    kind: m.kind,
    subject: m.subject,
    preview: m.preview,
    context: m.context,
  }));

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <FormSection title="Notifications" headerClassName="mb-4">
          <p className="-mt-2 mb-4 text-sm text-muted-foreground">
            What the numbers are saying — each with the case behind it.
          </p>
          <Inbox
            items={items}
            status={status}
            onOpen={(item) => {
              markRead(item.id);
              setOpenId(item.id);
            }}
            emptyMessage="No insights right now."
          />
        </FormSection>

        {active && (
          <MessageDrawer
            open
            onOpenChange={(isOpen) => { if (!isOpen) setOpenId(null); }}
            kind={active.kind}
            subject={active.subject}
            context={active.context}
            message={active.preview}
            businessCase={active.caseData}
            onAskAgent={() => {
              const q = `Tell me more: ${active.subject}`;
              if (typeof window !== 'undefined') window.location.href = `/chat?q=${encodeURIComponent(q)}`;
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};
