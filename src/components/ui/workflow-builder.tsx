'use client';

import * as React from 'react';
import {
  AlertTriangle,
  Bell,
  Zap,
  CheckCircle2,
  Flag,
  Mail,
  LayoutGrid,
  ListChecks,
  Maximize2,
  Plus,
  Rocket,
  Save,
  ShieldCheck,
  Trash2,
  Users,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useDb,
  updateWorkflow,
  type WorkflowScope,
  type Workflow,
  type WorkflowAction,
  type WorkflowActionType,
  type WorkflowOwner,
  type WorkflowStep,
  type WorkflowStepKind,
  type WorkflowTransition,
} from '@/lib/db';
import { Badge } from './badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './dropdown-menu';
import { Button } from './button';
import { Input } from './input';
import { useToast } from './toast';
import {
  RightDrawer,
  RightDrawerBody,
  RightDrawerContent,
  RightDrawerDescription,
  RightDrawerFooter,
  RightDrawerHeader,
  RightDrawerTitle,
} from './right-drawer';

/**
 * The workflow board — where a retailer shapes a proposition's workflow.
 *
 * Steps are tiles on a dotted board: stages of the shared lifecycle,
 * approvals, checks, to-dos, notifications and rules. Drag a tile
 * from the palette onto the board, drag tiles around, draw a line from one
 * tile's foot to another's head to say what follows what, and open a tile
 * to set who owns it, whether it is mandatory, its deadline, SLA, deputy
 * and the actions Edge fires. Validate, then publish: a published workflow
 * is what bookings on this proposition follow.
 */

const NODE_W = 260;
const NODE_H = 100;
const GRID = 20;

import { CONFIGURATION_RULES, ruleById } from '@/lib/configuration-rules';

const KINDS: Record<WorkflowStepKind, { label: string; hint: string; Icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  stage:        { label: 'Stage',        hint: 'A lifecycle status the booking sits in.',        Icon: Flag,         tone: 'bg-foreground text-background' },
  approval:     { label: 'Approval',     hint: 'Someone decides: approve or request changes.',   Icon: ShieldCheck,  tone: 'bg-warning-100 text-warning-700' },
  check:        { label: 'Check',        hint: 'A condition Edge derives or a person confirms.', Icon: CheckCircle2, tone: 'bg-success-100 text-success-700' },
  todo:         { label: 'To-do',        hint: 'Something a person or partner does: print, install.', Icon: ListChecks, tone: 'bg-info-100 text-info-700' },
  notification: { label: 'Notification', hint: 'Tell someone something happened.',               Icon: Bell,         tone: 'bg-neutral-100 text-neutral-700' },
  rule:         { label: 'Rule',         hint: 'A configuration rule Edge applies at this point.', Icon: Zap,          tone: 'bg-primary/10 text-primary' },
};

const OWNERS: Record<WorkflowOwner, string> = { advertiser: 'Advertiser', retailer: 'Retailer (AdOps)', edge: 'Edge (automatic)', external: 'External partner' };

/** The cards a step can carry, preset so a user picks rather than writes.
 *  The message on each is the part that stays editable. */
interface ActionPreset { id: string; type: WorkflowActionType; title: string; label: string; to?: WorkflowOwner }
const ACTION_PRESETS: ActionPreset[] = [
  { id: 'n-approved',  type: 'notification', title: 'Booking approved',    label: 'Your booking is approved and will run as planned.', to: 'advertiser' },
  { id: 'n-changes',   type: 'notification', title: 'Changes requested',   label: 'AdOps asked for changes — open the booking to see what.', to: 'advertiser' },
  { id: 'n-review',    type: 'notification', title: 'Ready for review',    label: 'A booking is waiting for your review.', to: 'retailer' },
  { id: 'n-creative',  type: 'notification', title: 'Creative missing',    label: 'A booking still has no creative — upload one before the start date.', to: 'advertiser' },
  { id: 'n-live',      type: 'notification', title: 'Now live',            label: 'Your campaign is live.', to: 'advertiser' },
  { id: 'e-upload',    type: 'email',        title: 'Upload link',         label: 'Here is the link to upload your creatives.', to: 'advertiser' },
  { id: 'e-approved',  type: 'email',        title: 'Approval confirmed',  label: 'Your booking is approved. The details are attached.', to: 'advertiser' },
  { id: 'e-summary',   type: 'email',        title: 'Weekly summary',      label: 'Your weekly summary of bookings and delivery.', to: 'retailer' },
  { id: 't-review',    type: 'todo',         title: 'Review the booking',  label: 'Approve the booking or request changes.', to: 'retailer' },
  { id: 't-creatives', type: 'todo',         title: 'Upload creatives',    label: 'Upload a creative for every format in the booking.', to: 'advertiser' },
  { id: 't-print',     type: 'todo',         title: 'Print and deliver',   label: 'Print the materials and deliver them to the stores.', to: 'external' },
  { id: 's-scheduled', type: 'set-status',   title: 'Mark as scheduled',   label: 'The booking becomes Scheduled.' },
  { id: 's-live',      type: 'set-status',   title: 'Mark as live',        label: 'The booking becomes Live.' },
  { id: 'k-engine',    type: 'kafka',        title: 'Send to the engine',  label: 'Hand the booking to the delivery engine.' },
  { id: 'l-chat',      type: 'log',          title: 'Chat line',           label: 'Write a line in the campaign chat.' },
];
const ACTION_TONES: Record<WorkflowActionType, string> = {
  notification: 'bg-neutral-100 text-neutral-700',
  email:        'bg-info-100 text-info-700',
  todo:         'bg-warning-100 text-warning-700',
  'set-status': 'bg-success-100 text-success-700',
  kafka:        'bg-primary/10 text-primary',
  log:          'bg-neutral-100 text-neutral-600',
};

const ACTION_TYPES: Record<WorkflowActionType, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  email:        { label: 'Send an email',          Icon: Mail },
  notification: { label: 'Show a notification',    Icon: Bell },
  todo:         { label: 'Create a to-do',         Icon: ListChecks },
  'set-status': { label: 'Set a status',           Icon: Flag },
  kafka:        { label: 'Tell another system',    Icon: Rocket },
  log:          { label: 'Write a log line',       Icon: Users },
};

const snap = (n: number) => Math.max(0, Math.round(n / GRID) * GRID);
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

/** Where a step's in and out ports sit. */
const portIn = (s: WorkflowStep) => ({ x: s.x + NODE_W / 2, y: s.y });
const portOut = (s: WorkflowStep) => ({ x: s.x + NODE_W / 2, y: s.y + NODE_H });
/** Column gap between stages and row gap between a stage's steps. */
const COL_GAP = 60;
const ROW_GAP = 40;

/** Side ports, for a line between two tiles on the same row. */
const portRight = (s: WorkflowStep) => ({ x: s.x + NODE_W, y: s.y + NODE_H / 2 });
const portLeft = (s: WorkflowStep) => ({ x: s.x, y: s.y + NODE_H / 2 });
/** Two tiles side by side link side to side; otherwise foot to head. */
const sameRow = (a: WorkflowStep, b: WorkflowStep) => Math.abs(a.y - b.y) < NODE_H && b.x > a.x;

type Pt = { x: number; y: number };

/** A path through the points with the corners rounded off. */
const polyline = (pts: Pt[], r = 8) => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i - 1]; const c = pts[i]; const n = pts[i + 1];
    const inLen = Math.hypot(c.x - p.x, c.y - p.y); const outLen = Math.hypot(n.x - c.x, n.y - c.y);
    const rr = Math.min(r, inLen / 2, outLen / 2);
    if (rr < 1) { d += ` L ${c.x} ${c.y}`; continue; }
    const ax = c.x - Math.sign(c.x - p.x) * rr; const ay = c.y - Math.sign(c.y - p.y) * rr;
    const bx = c.x + Math.sign(n.x - c.x) * rr; const by = c.y + Math.sign(n.y - c.y) * rr;
    d += ` L ${ax} ${ay} Q ${c.x} ${c.y} ${bx} ${by}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
};

/**
 * The line from a to b, in right angles, kept to the gutters between rows
 * and columns so it never runs through a card: down out of a's foot into
 * the row gutter, across to the column gutter beside b, up or down to the
 * row gutter above b, across to b's head, and in.
 */
const link = (a: WorkflowStep, b: WorkflowStep): { from: Pt; to: Pt; d: string; label: Pt } => {
  if (sameRow(a, b)) {
    const p = portRight(a); const q = portLeft(b);
    return { from: p, to: q, d: polyline([p, q]), label: { x: (p.x + q.x) / 2, y: p.y } };
  }
  const p = portOut(a); const q = portIn(b);
  const y1 = a.y + NODE_H + ROW_GAP / 2;   // the gutter under a
  const y2 = b.y - ROW_GAP / 2;             // the gutter above b
  // Straight down: b sits under a in the same column with nothing between.
  if (Math.abs(p.x - q.x) < 1 && b.y > a.y) {
    return { from: p, to: q, d: polyline([p, q]), label: { x: p.x, y: (p.y + q.y) / 2 } };
  }
  // The column gutter the line climbs or descends in: beside b, on a's side.
  const xt = b.x > a.x
    ? b.x - COL_GAP / 2
    : b.x < a.x
      ? b.x + NODE_W + COL_GAP / 2
      : a.x + NODE_W + COL_GAP / 2; // same column, b above a: go round on the right
  const pts: Pt[] = [p, { x: p.x, y: y1 }, { x: xt, y: y1 }, { x: xt, y: y2 }, { x: q.x, y: y2 }, q];
  // Drop the doubled points a straight run leaves behind.
  const clean = pts.filter((pt, i) => i === 0 || pt.x !== pts[i - 1].x || pt.y !== pts[i - 1].y);
  return { from: p, to: q, d: polyline(clean), label: { x: xt, y: (y1 + y2) / 2 } };
};

const curve = (a: Pt, b: Pt) => {
  const dy = Math.max(40, Math.abs(b.y - a.y) / 2);
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
};


/**
 * Arrange the board the way the control panel reads it: the stages in a
 * row from left to right, and under each stage, top to bottom, the steps
 * that belong to it — the work between that stage and the next.
 */
export function arrangeSteps(steps: WorkflowStep[], transitions: { from: string; to: string }[]): WorkflowStep[] {
  const incoming = new Set(transitions.map((t) => t.to));
  const start = steps.find((s) => !incoming.has(s.id)) ?? steps[0];
  if (!start) return steps;
  const order: WorkflowStep[] = [];
  const seen = new Set<string>();
  const queue = [start.id];
  while (queue.length) {
    const id = queue.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    const st = steps.find((x) => x.id === id);
    if (!st) continue;
    order.push(st);
    for (const t of transitions.filter((t) => t.from === id)) queue.push(t.to);
  }
  for (const st of steps) if (!seen.has(st.id)) order.push(st); // orphans last
  const stages = order.filter((st) => st.kind === 'stage');
  const columnOf = new Map<string, number>();
  let col = -1;
  for (const st of order) {
    if (st.kind === 'stage') col = stages.findIndex((x) => x.id === st.id);
    columnOf.set(st.id, Math.max(0, col));
  }
  const rowNext = new Map<number, number>();
  return steps.map((st) => {
    const c = columnOf.get(st.id) ?? 0;
    const x = 40 + c * (NODE_W + COL_GAP);
    if (st.kind === 'stage') return { ...st, x, y: 40 };
    const row = (rowNext.get(c) ?? 0) + 1;
    rowNext.set(c, row);
    return { ...st, x, y: 40 + row * (NODE_H + ROW_GAP) };
  });
}

/** What stops a workflow from being published. */
export function validateWorkflow(wf: Pick<Workflow, 'steps' | 'transitions'>): string[] {
  const issues: string[] = [];
  const ids = new Set(wf.steps.map((s) => s.id));
  const incoming = new Map<string, number>();
  const outgoing = new Map<string, number>();
  for (const t of wf.transitions) {
    if (!ids.has(t.from) || !ids.has(t.to)) continue;
    outgoing.set(t.from, (outgoing.get(t.from) ?? 0) + 1);
    incoming.set(t.to, (incoming.get(t.to) ?? 0) + 1);
  }
  const starts = wf.steps.filter((s) => !incoming.get(s.id));
  const ends = wf.steps.filter((s) => !outgoing.get(s.id));
  if (wf.steps.length === 0) issues.push('The board is empty — add a first stage.');
  if (wf.steps.length > 0 && starts.length === 0) issues.push('No starting step: every step has something before it.');
  if (starts.length > 1) issues.push(`More than one starting step: ${starts.map((s) => s.name).join(', ')}.`);
  if (wf.steps.length > 0 && ends.length === 0) issues.push('No final step: the workflow never completes.');
  // Reachability from the start.
  if (starts.length === 1) {
    const seen = new Set<string>([starts[0].id]);
    const queue = [starts[0].id];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const t of wf.transitions) if (t.from === cur && !seen.has(t.to)) { seen.add(t.to); queue.push(t.to); }
    }
    const orphan = wf.steps.filter((s) => !seen.has(s.id));
    if (orphan.length) issues.push(`Not reachable from the start: ${orphan.map((s) => s.name).join(', ')}.`);
  }
  for (const s of wf.steps) {
    if (!s.name.trim()) issues.push('A step has no name.');
    if (s.kind === 'rule' && !s.rule) issues.push(`"${s.name}" has no rule picked yet.`);
    // A setup step is ticked off from the data — nobody waits on an
    // approver — so the approval rules do not apply to it.
    if (s.kind === 'approval' && !s.setup && s.owner === 'edge') issues.push(`"${s.name}" is an approval but Edge owns it — a person must decide.`);
  }
  const names = wf.steps.map((s) => s.name.trim().toLowerCase());
  const dupes = names.filter((n, i) => n && names.indexOf(n) !== i);
  if (dupes.length) issues.push(`Two steps share a name: ${[...new Set(dupes)].join(', ')}.`);
  return issues;
}

// ── The board ────────────────────────────────────────────────────────────

export const WorkflowBuilder: React.FC<{ engine: WorkflowScope; className?: string }> = ({ engine, className }) => {
  const db = useDb();
  const toast = useToast();
  const record = db.workflows.find((w) => w.engine === engine) ?? null;

  // The board edits a draft copy; Save writes it back.
  const [name, setName] = React.useState('');
  const [steps, setSteps] = React.useState<WorkflowStep[]>([]);
  const [transitions, setTransitions] = React.useState<WorkflowTransition[]>([]);
  const [dirty, setDirty] = React.useState(false);
  const seeded = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (record && seeded.current !== record.id) {
      seeded.current = record.id;
      setName(record.name);
      // Opens arranged — stages in a row, each stage's steps beneath — so the
      // board always reads the way the control panel does.
      setSteps(arrangeSteps(record.steps.map((s) => ({ ...s, actions: [...s.actions] })), record.transitions));
      setTransitions([...record.transitions]);
      setDirty(false);
    }
  }, [record]);

  const [selectedStep, setSelectedStep] = React.useState<string | null>(null);
  const [openCard, setOpenCard] = React.useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = React.useState<string | null>(null);
  const boardRef = React.useRef<HTMLDivElement>(null);

  // The viewport over the board: where it is panned to, and how far zoomed.
  // The board itself has no edges — it moves under the viewport freely.
  const [view, setView] = React.useState({ x: 0, y: 0, k: 1 });
  const pan = React.useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const [panning, setPanning] = React.useState(false);

  // Dragging a tile, or drawing a line from a tile's foot.
  const drag = React.useRef<{ id: string; dx: number; dy: number } | null>(null);
  const [connecting, setConnecting] = React.useState<{ from: string; x: number; y: number } | null>(null);

  /** A pointer position in board coordinates, whatever the pan and zoom. */
  const boardPoint = (e: { clientX: number; clientY: number }) => {
    const el = boardRef.current!;
    const r = el.getBoundingClientRect();
    return { x: (e.clientX - r.left - view.x) / view.k, y: (e.clientY - r.top - view.y) / view.k };
  };

  const zoomAt = (factor: number, cx?: number, cy?: number) => {
    const el = boardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = cx ?? r.width / 2; const py = cy ?? r.height / 2;
    setView((v) => {
      const k = Math.min(2, Math.max(0.3, v.k * factor));
      // Keep the point under the cursor where it is.
      return { k, x: px - ((px - v.x) / v.k) * k, y: py - ((py - v.y) / v.k) * k };
    });
  };
  /** Fit the whole board into the viewport, at most at true size. */
  const fit = React.useCallback((list: WorkflowStep[]) => {
    const el = boardRef.current; if (!el || !list.length) return;
    const w = list.reduce((m, st) => Math.max(m, st.x + NODE_W), 0) + 40;
    const h = list.reduce((m, st) => Math.max(m, st.y + NODE_H), 0) + 40;
    const k = Math.min(1, (el.clientWidth - 24) / w, (el.clientHeight - 24) / h);
    setView({ k, x: Math.max(12, (el.clientWidth - w * k) / 2), y: Math.max(12, (el.clientHeight - h * k) / 2) });
  }, []);
  const onBoardPointerDown = (e: React.PointerEvent) => {
    // The background pans; tiles and ports have their own handlers.
    const t = e.target as HTMLElement;
    if (t !== e.currentTarget && t.tagName !== 'svg' && !t.dataset.canvas) return;
    pan.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    setPanning(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onBoardWheel = (e: React.WheelEvent) => {
    // Pinch or ctrl+wheel zooms around the cursor; a plain wheel pans.
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (e.ctrlKey || e.metaKey) {
      zoomAt(Math.exp(-e.deltaY * 0.01), e.clientX - r.left, e.clientY - r.top);
    } else {
      setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
    }
  };

  React.useEffect(() => {
    const el = boardRef.current; if (!el) return;
    const stop = (e: WheelEvent) => e.preventDefault();
    el.addEventListener('wheel', stop, { passive: false });
    return () => el.removeEventListener('wheel', stop);
  }, []);

  const patchStep = (id: string, patch: Partial<WorkflowStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    setDirty(true);
  };

  const onTilePointerDown = (e: React.PointerEvent, s: WorkflowStep) => {
    if ((e.target as HTMLElement).closest('[data-port]')) return;
    e.preventDefault(); // a drag, not a text selection
    const p = boardPoint(e);
    drag.current = { id: s.id, dx: p.x - s.x, dy: p.y - s.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onTilePointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const p = boardPoint(e);
    const { id, dx, dy } = drag.current;
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, x: Math.max(0, p.x - dx), y: Math.max(0, p.y - dy) } : s)));
  };
  const onTilePointerUp = (e: React.PointerEvent, s: WorkflowStep) => {
    if (drag.current?.id === s.id) {
      const moved = drag.current;
      drag.current = null;
      setSteps((prev) => prev.map((x) => (x.id === moved.id ? { ...x, x: snap(x.x), y: snap(x.y) } : x)));
      setDirty(true);
      return;
    }
    if (connecting && connecting.from !== s.id) {
      addTransition(connecting.from, s.id);
      setConnecting(null);
    }
  };

  const onPortDown = (e: React.PointerEvent, s: WorkflowStep) => {
    e.stopPropagation();
    const p = portOut(s);
    setConnecting({ from: s.id, x: p.x, y: p.y });
  };
  const onBoardPointerMove = (e: React.PointerEvent) => {
    if (pan.current) {
      const { x, y, vx, vy } = pan.current;
      setView((v) => ({ ...v, x: vx + (e.clientX - x), y: vy + (e.clientY - y) }));
      return;
    }
    if (connecting) {
      const p = boardPoint(e);
      setConnecting({ ...connecting, x: p.x, y: p.y });
    }
  };
  const onBoardPointerUp = () => {
    pan.current = null;
    setPanning(false);
    // Released over the board, not a tile: the line is dropped.
    if (connecting) setConnecting(null);
  };

  const arrange = () => {
    const next = arrangeSteps(steps, transitions);
    setSteps(next);
    setDirty(true);
    fit(next);
  };

  const addTransition = (from: string, to: string) => {
    if (transitions.some((t) => t.from === from && t.to === to)) return;
    setTransitions((prev) => [...prev, { id: uid('t'), from, to }]);
    setDirty(true);
  };

  /** A fresh step of a kind, with the owner and weight that kind usually has. */
  const blankStep = (kind: WorkflowStepKind, x: number, y: number): WorkflowStep => ({
    id: uid('s'),
    kind,
    name: `New ${KINDS[kind].label.toLowerCase()}`,
    owner: kind === 'check' || kind === 'rule' || kind === 'stage' ? 'edge' : kind === 'todo' ? 'external' : 'retailer',
    mandatory: kind !== 'notification' && kind !== 'rule',
    actions: [],
    x, y,
  });

  const addStep = (kind: WorkflowStepKind, at?: { x: number; y: number }) => {
    const below = steps.reduce((m, s) => Math.max(m, s.y + NODE_H), 0);
    const step = blankStep(kind, at ? snap(at.x - NODE_W / 2) : 40, at ? snap(at.y - NODE_H / 2) : snap(below + 60));
    setSteps((prev) => [...prev, step]);
    setDirty(true);
    setSelectedStep(step.id);
  };

  /** A free spot beneath a card: straight below, or further right when
   *  something already sits there. */
  const spotBelow = (from: WorkflowStep) => {
    let x = from.x; const y = snap(from.y + NODE_H + 60);
    const taken = (px: number) => steps.some((st) => Math.abs(st.y - y) < NODE_H && Math.abs(st.x - px) < NODE_W);
    while (taken(x)) x += NODE_W + 40;
    return { x, y };
  };

  /** The next step in the flow, added from a card's + and joined to it. */
  const addStepAfter = (fromId: string, kind: WorkflowStepKind) => {
    const from = steps.find((st) => st.id === fromId);
    if (!from) return;
    const { x, y } = spotBelow(from);
    const step = blankStep(kind, x, y);
    setSteps((prev) => [...prev, step]);
    setTransitions((prev) => [...prev, { id: uid('t'), from: fromId, to: step.id }]);
    setDirty(true);
    setSelectedStep(step.id);
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
    setTransitions((prev) => prev.filter((t) => t.from !== id && t.to !== id));
    setSelectedStep(null);
    setDirty(true);
  };

  const issues = validateWorkflow({ steps, transitions });

  const save = (publish?: boolean) => {
    if (!record) return;
    if (publish && issues.length) {
      toast({ title: 'Not ready to publish', description: issues[0] });
      return;
    }
    updateWorkflow(record.id, {
      name,
      steps,
      transitions,
      ...(publish ? { status: 'published' as const, publishedAt: new Date().toISOString() } : {}),
    });
    setDirty(false);
    toast(
      publish
        ? { title: 'Workflow published', description: 'Bookings on this proposition follow it from now on.' }
        : { title: 'Draft saved', description: 'The board is kept; publish when it is ready.' },
    );
  };

  const fittedFor = React.useRef<string | null>(null);
  React.useLayoutEffect(() => {
    if (record && steps.length && fittedFor.current !== record.id) { fittedFor.current = record.id; fit(steps); }
  }, [record, steps, fit]);

  const selected = steps.find((s) => s.id === selectedStep) ?? null;
  const edge = transitions.find((t) => t.id === selectedEdge) ?? null;
  const byId = new Map(steps.map((s) => [s.id, s]));
  const boardH = Math.max(640, steps.reduce((m, s) => Math.max(m, s.y + NODE_H), 0) + 160);
  const boardW = Math.max(900, steps.reduce((m, s) => Math.max(m, s.x + NODE_W), 0) + 160);

  if (!record) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No workflow for this proposition yet.</p>;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1 text-sm font-medium">{name}</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => save(false)} disabled={!dirty} className="gap-1.5"><Save className="h-4 w-4" /> Save draft</Button>
          <Button onClick={() => save(true)} disabled={issues.length > 0} title={issues.length ? `Fix first: ${issues[0]}` : undefined} className="gap-1.5"><Rocket className="h-4 w-4" /> Publish</Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{record.description}</p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        {/* ── Palette ── */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Drag a step onto the board</div>
          {(Object.keys(KINDS) as WorkflowStepKind[]).map((kind) => {
            const { label, hint, Icon, tone } = KINDS[kind];
            return (
              <div
                key={kind}
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/workflow-kind', kind); e.dataTransfer.effectAllowed = 'copy'; }}
                onClick={() => addStep(kind)}
                className="flex cursor-grab items-center gap-2.5 rounded-md border bg-card p-2.5 transition-colors hover:bg-surface-hover active:cursor-grabbing"
                title={`${hint} Click to add at the bottom, or drag onto the board.`}
              >
                <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', tone)}><Icon className="h-4 w-4" /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{hint}</span>
                </span>
              </div>
            );
          })}
          <div className="rounded-md border border-dashed p-2.5 text-[11px] leading-relaxed text-muted-foreground">
            Drag a tile to move it. Drag from the dot under a tile to another tile to draw what follows. Click a tile for its settings; click a line to label or remove it.
          </div>
        </div>

        {/* ── Board ── */}
        <div
          ref={boardRef}
          className={cn('relative h-[70vh] min-h-[560px] select-none overflow-hidden rounded-xl border bg-page', panning ? 'cursor-grabbing' : 'cursor-grab')}
          style={{
            backgroundImage: 'radial-gradient(hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: `${GRID * view.k}px ${GRID * view.k}px`,
            backgroundPosition: `${view.x}px ${view.y}px`,
            touchAction: 'none',
          }}
          onPointerDown={onBoardPointerDown}
          onWheel={onBoardWheel}
          onDragOver={(e) => { if (e.dataTransfer.types.includes('text/workflow-kind')) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } }}
          onDrop={(e) => {
            const kind = e.dataTransfer.getData('text/workflow-kind') as WorkflowStepKind;
            if (kind && KINDS[kind]) { e.preventDefault(); addStep(kind, boardPoint(e)); }
          }}
          onPointerMove={onBoardPointerMove}
          onPointerUp={onBoardPointerUp}
          onClick={(e) => { if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') { setSelectedStep(null); setSelectedEdge(null); } }}
        >
          <div data-canvas className="absolute left-0 top-0" style={{ width: boardW, height: boardH, transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin: '0 0' }}>
            {/* Lines */}
            <svg className="absolute inset-0" width={boardW} height={boardH}>
              <defs>
                <marker id="wf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--muted-foreground))" />
                </marker>
              </defs>
              {transitions.map((t) => {
                const a = byId.get(t.from); const b = byId.get(t.to);
                if (!a || !b) return null;
                const { d } = link(a, b);
                const isSel = t.id === selectedEdge;
                return (
                  <g key={t.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedEdge(t.id); setSelectedStep(null); }}>
                    <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
                    <path d={d} fill="none" stroke={isSel ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'} strokeWidth={isSel ? 2 : 1.5} markerEnd="url(#wf-arrow)" />
                  </g>
                );
              })}
              {connecting && (() => {
                const a = byId.get(connecting.from);
                return a ? <path d={curve(portOut(a), { x: connecting.x, y: connecting.y })} fill="none" stroke="hsl(var(--foreground))" strokeWidth={1.5} strokeDasharray="4 4" /> : null;
              })()}
            </svg>
            {/* Line labels */}
            {transitions.map((t) => {
              const a = byId.get(t.from); const b = byId.get(t.to);
              if (!a || !b || !t.label) return null;
              const { label: at } = link(a, b);
              return (
                <span
                  key={`${t.id}-label`}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-card px-2 py-0.5 text-[10px] text-muted-foreground"
                  style={{ left: at.x, top: at.y }}
                >
                  {t.label}
                </span>
              );
            })}
            {/* Tiles */}
            {steps.map((s) => {
              // A step that applies a configuration rule is drawn as a rule
              // card: the rule's own mark, its summary, and the check it
              // makes at this point of the board.
              const rule = s.rule ? ruleById(s.rule) : undefined;
              const { Icon, tone, label } = KINDS[s.rule || s.kind === 'rule' ? 'rule' : s.kind];
              const isSel = s.id === selectedStep;
              return (
                <div
                  key={s.id}
                  className={cn(
                    'absolute select-none rounded-lg border bg-card shadow-sm transition-shadow',
                    isSel ? 'border-foreground ring-2 ring-foreground/10' : 'hover:shadow-md',
                    connecting && connecting.from !== s.id && 'ring-2 ring-success-500/40',
                  )}
                  style={{ left: s.x, top: s.y, width: NODE_W, height: NODE_H, touchAction: 'none' }}
                  onPointerDown={(e) => onTilePointerDown(e, s)}
                  onPointerMove={onTilePointerMove}
                  onPointerUp={(e) => onTilePointerUp(e, s)}
                  onClick={(e) => { e.stopPropagation(); if (!drag.current) { setSelectedStep(s.id); setSelectedEdge(null); } }}
                >
                  <div className="flex h-full items-start gap-3 p-3">
                    <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', tone)}><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{s.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {rule ? rule.summary : <>{label} · {OWNERS[s.owner]}{s.dueDaysBeforeStart ? ` · X-${s.dueDaysBeforeStart}` : ''}</>}
                      </span>
                      {/* What governs the step, as badges — the same badges the
                          rest of the app wears, readable at board zoom. */}
                      <span className="mt-1.5 flex flex-wrap gap-1">
                        {s.mandatory && <Badge variant="outline" className="px-1.5 py-0 text-[10px]">Mandatory</Badge>}
                        {s.slaDays ? <Badge variant="outline" className="px-1.5 py-0 text-[10px]">{s.slaDays}d to respond</Badge> : null}
                        {s.setup && <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">Setup</Badge>}
                        {rule && <Badge variant={rule.status === 'Active' ? 'success' : 'secondary'} className="px-1.5 py-0 text-[10px]">{rule.status === 'Active' ? 'Rule active' : 'Rule paused'}</Badge>}
                        {s.actions.length > 0 && <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">{s.actions.length} action{s.actions.length === 1 ? '' : 's'}</Badge>}
                      </span>
                    </span>
                  </div>
                  {/* Ports: the head takes lines in, the foot starts one. */}
                  <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-muted-foreground" />
                  <span
                    data-port
                    onPointerDown={(e) => onPortDown(e, s)}
                    className="absolute bottom-0 left-1/2 h-3.5 w-3.5 -translate-x-1/2 translate-y-1/2 cursor-crosshair rounded-full border-2 border-card bg-foreground transition-transform hover:scale-125"
                    title="Drag to the next step"
                  />
                  {/* The + at the foot: what comes next, added and joined in
                      one go — no dragging needed. */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        data-port
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -right-3 bottom-0 flex h-6 w-6 translate-y-1/2 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm transition-colors hover:border-foreground hover:text-foreground"
                        aria-label={`Add a step after ${s.name}`}
                        title="Add what comes next"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                      {(Object.keys(KINDS) as WorkflowStepKind[]).map((kind) => {
                        const { label, Icon: KIcon, tone } = KINDS[kind];
                        return (
                          <DropdownMenuItem key={kind} className="gap-2.5" onSelect={() => addStepAfter(s.id, kind)}>
                            <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-md', tone)}><KIcon className="h-3.5 w-3.5" /></span>
                            {label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>

          {/* Zoom: in, out, and the whole board at once. */}
          <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-md border bg-card shadow-sm" onPointerDown={(e) => e.stopPropagation()}>
            <button type="button" className="flex h-8 w-8 items-center justify-center hover:bg-accent" aria-label="Arrange" title="Arrange: stages left to right, each stage's steps beneath it" onClick={arrange}><LayoutGrid className="h-4 w-4" /></button>
            <button type="button" className="flex h-8 w-8 items-center justify-center border-t hover:bg-accent" aria-label="Zoom in" onClick={() => zoomAt(1.2)}><ZoomIn className="h-4 w-4" /></button>
            <button type="button" className="flex h-8 w-8 items-center justify-center border-t hover:bg-accent" aria-label="Zoom out" onClick={() => zoomAt(1 / 1.2)}><ZoomOut className="h-4 w-4" /></button>
            <button type="button" className="flex h-8 w-8 items-center justify-center border-t hover:bg-accent" aria-label="Fit to view" onClick={() => fit(steps)}><Maximize2 className="h-4 w-4" /></button>
          </div>
          <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-md border bg-card px-2 py-0.5 text-[11px] tabular-nums text-muted-foreground">{Math.round(view.k * 100)}%</span>

          {/* Selected line: label it or remove it. */}
          {edge && (
            <div className="absolute bottom-3 left-3 z-10 flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-md" onPointerDown={(e) => e.stopPropagation()}>
              <span className="text-xs text-muted-foreground">
                {byId.get(edge.from)?.name} → {byId.get(edge.to)?.name}
              </span>
              <Input
                value={edge.label ?? ''}
                placeholder="Label (e.g. approved)"
                className="h-8 w-48 text-xs"
                onChange={(e) => { setTransitions((prev) => prev.map((t) => (t.id === edge.id ? { ...t, label: e.target.value } : t))); setDirty(true); }}
              />
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Remove line" onClick={() => { setTransitions((prev) => prev.filter((t) => t.id !== edge.id)); setSelectedEdge(null); setDirty(true); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Close" onClick={() => setSelectedEdge(null)}><X className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Step settings ── */}
      <RightDrawer open={!!selected} onOpenChange={(o) => !o && setSelectedStep(null)}>
        <RightDrawerContent className="sm:max-w-md">
          {selected && (
            <>
              <RightDrawerHeader>
                <RightDrawerTitle className="flex items-center gap-2">
                  {(() => { const { Icon, tone } = KINDS[selected.kind]; return <span className={cn('flex h-7 w-7 items-center justify-center rounded-md', tone)}><Icon className="h-4 w-4" /></span>; })()}
                  <span className="min-w-0 truncate">{selected.name || 'Step'}</span>
                </RightDrawerTitle>
                <RightDrawerDescription>{KINDS[selected.kind].hint}</RightDrawerDescription>
              </RightDrawerHeader>
              <RightDrawerBody className="space-y-5">
                {/* What this step is. Its type was set when it came onto the
                    board; the form only says who and by when. */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Name</label>
                  <Input value={selected.name} onChange={(e) => patchStep(selected.id, { name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Role</label>
                    <Input dropdown options={(Object.keys(OWNERS) as WorkflowOwner[]).map((o) => ({ value: o, label: OWNERS[o] }))} value={selected.owner} onChange={(v) => patchStep(selected.id, { owner: v as WorkflowOwner })} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Deadline</label>
                    <div className="flex items-center gap-2">
                      <Input type="number" min={0} className="w-20" value={selected.dueDaysBeforeStart ?? ''} placeholder="—" onChange={(e) => patchStep(selected.id, { dueDaysBeforeStart: e.target.value ? Number(e.target.value) : undefined })} />
                      <span className="text-xs text-muted-foreground">days before the start</span>
                    </div>
                  </div>
                </div>

                {selected.kind === 'rule' && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Which rule</label>
                    <Input
                      dropdown
                      options={CONFIGURATION_RULES.map((r) => ({ value: r.id, label: r.name }))}
                      value={selected.rule ?? ''}
                      placeholder="Pick a rule"
                      onChange={(v) => {
                        const rule = ruleById(v);
                        patchStep(selected.id, rule ? { rule: rule.id, name: rule.name, description: rule.summary } : { rule: undefined });
                      }}
                    />
                  </div>
                )}

                {selected.rule && (() => {
                  const rule = ruleById(selected.rule);
                  if (!rule) return null;
                  return (
                    <div className="space-y-2 rounded-md border border-primary/20 bg-primary/5 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-sm font-medium"><Zap className="h-4 w-4 text-primary" />This step applies a rule</span>
                        <Badge variant={rule.status === 'Active' ? 'success' : 'secondary'}>{rule.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">If</span> {rule.when}</p>
                      <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Then</span> {rule.then}</p>
                      <a href={`/configuration/${engine}/rules/${rule.id}`} className="text-xs font-medium text-primary hover:underline">Open the rule →</a>
                    </div>
                  );
                })()}

                {/* The cards: what Edge does at this step, each one picked
                    from a preset and then worded. */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">What Edge does here</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1 px-2.5 text-xs"><Plus className="h-3.5 w-3.5" /> Add a card</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="max-h-80 w-72 overflow-y-auto">
                        {(Object.keys(ACTION_TYPES) as WorkflowActionType[]).map((type) => (
                          <React.Fragment key={type}>
                            <div className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{ACTION_TYPES[type].label}</div>
                            {ACTION_PRESETS.filter((pr) => pr.type === type).map((pr) => (
                              <DropdownMenuItem
                                key={pr.id}
                                className="flex-col items-start gap-0.5"
                                onSelect={() => {
                                  const card: WorkflowAction = { id: uid('a'), type: pr.type, title: pr.title, label: pr.label, to: pr.to };
                                  patchStep(selected.id, { actions: [...selected.actions, card] });
                                  setOpenCard(card.id);
                                }}
                              >
                                <span className="text-sm">{pr.title}</span>
                                <span className="line-clamp-1 text-xs text-muted-foreground">{pr.label}</span>
                              </DropdownMenuItem>
                            ))}
                          </React.Fragment>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {selected.actions.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                      No cards yet. Add a notification, an email or a to-do — pick one, then word it.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {selected.actions.map((a) => (
                        <ActionCard
                          key={a.id}
                          action={a}
                          open={openCard === a.id}
                          onToggle={() => setOpenCard(openCard === a.id ? null : a.id)}
                          onChange={(next) => patchStep(selected.id, { actions: selected.actions.map((x) => (x.id === a.id ? next : x)) })}
                          onRemove={() => { patchStep(selected.id, { actions: selected.actions.filter((x) => x.id !== a.id) }); setOpenCard(null); }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Where the flow goes from here. */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Then move on to</span>
                  {(() => {
                    const next = transitions.filter((t) => t.from === selected.id).map((t) => ({ t, to: steps.find((st) => st.id === t.to) })).filter((x) => !!x.to);
                    if (next.length === 0) return <p className="text-xs text-muted-foreground">Nothing yet — this is where the flow ends. Use the + on the card to add what comes next.</p>;
                    return (
                      <ul className="space-y-1.5">
                        {next.map(({ t, to }) => {
                          const { Icon: NIcon, tone } = KINDS[to!.kind];
                          return (
                            <li key={t.id} className="flex items-center gap-2 text-sm">
                              <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-md', tone)}><NIcon className="h-3.5 w-3.5" /></span>
                              <span className="min-w-0 flex-1 truncate">{to!.name}</span>
                              {t.label && <span className="shrink-0 text-xs text-muted-foreground">when {t.label}</span>}
                            </li>
                          );
                        })}
                      </ul>
                    );
                  })()}
                </div>
              </RightDrawerBody>
              <RightDrawerFooter className="justify-between">
                <Button variant="outline" className="gap-1.5 text-destructive-700" onClick={() => removeStep(selected.id)}><Trash2 className="h-4 w-4" /> Remove step</Button>
                <Button onClick={() => setSelectedStep(null)}>Done</Button>
              </RightDrawerFooter>
            </>
          )}
        </RightDrawerContent>
      </RightDrawer>
    </div>
  );
};

/** One card on a step: a preset, worded. Closed it reads like a kanban
 *  card — type, title, message, who gets it; open it edits the message. */
const ActionCard: React.FC<{ action: WorkflowAction; open: boolean; onToggle: () => void; onChange: (a: WorkflowAction) => void; onRemove: () => void }> = ({ action, open, onToggle, onChange, onRemove }) => {
  const needsTarget = action.type === 'email' || action.type === 'notification' || action.type === 'todo';
  return (
    <div className={cn('rounded-lg border bg-card text-left shadow-sm transition-shadow', open ? 'col-span-2 border-foreground ring-2 ring-foreground/10' : 'hover:shadow-md')}>
      <button type="button" onClick={onToggle} className="w-full p-3 text-left">
        <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold', ACTION_TONES[action.type])}>{ACTION_TYPES[action.type].label}</span>
        {/* A card made before presets has only its wording; that is its title. */}
        <span className="mt-2 block text-sm font-medium leading-snug">{action.title ?? action.label ?? ACTION_TYPES[action.type].label}</span>
        {!open && action.title && <span className="mt-1 line-clamp-2 block text-xs text-muted-foreground">{action.label || 'Click to word it'}</span>}
        {!open && action.to && <span className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground"><Users className="h-3 w-3" />{OWNERS[action.to]}</span>}
      </button>
      {open && (
        <div className="space-y-3 border-t p-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium">Message</label>
            <textarea
              rows={3}
              value={action.label}
              onChange={(e) => onChange({ ...action, label: e.target.value })}
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          {needsTarget && (
            <div>
              <label className="mb-1.5 block text-xs font-medium">To</label>
              <Input dropdown options={(Object.keys(OWNERS) as WorkflowOwner[]).map((o) => ({ value: o, label: OWNERS[o] }))} value={action.to ?? 'advertiser'} onChange={(v) => onChange({ ...action, to: v as WorkflowOwner })} />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-destructive hover:text-destructive" onClick={onRemove}><Trash2 className="h-3.5 w-3.5" /> Remove</Button>
            <Button variant="outline" size="sm" className="h-8" onClick={onToggle}>Done</Button>
          </div>
        </div>
      )}
    </div>
  );
};
