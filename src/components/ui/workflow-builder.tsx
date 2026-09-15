'use client';

import * as React from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Flag,
  GitBranch,
  Mail,
  ListChecks,
  Plus,
  Rocket,
  Save,
  ShieldCheck,
  Trash2,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useDb,
  updateWorkflow,
  type EngineId,
  type Workflow,
  type WorkflowAction,
  type WorkflowActionType,
  type WorkflowOwner,
  type WorkflowStep,
  type WorkflowStepKind,
  type WorkflowTransition,
} from '@/lib/db';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { Switch } from './switch';
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
 * approvals, checks, fulfilment steps, notifications and gates. Drag a tile
 * from the palette onto the board, drag tiles around, draw a line from one
 * tile's foot to another's head to say what follows what, and open a tile
 * to set who owns it, whether it is mandatory, its deadline, SLA, deputy
 * and the actions Edge fires. Validate, then publish: a published workflow
 * is what bookings on this proposition follow.
 */

const NODE_W = 232;
const NODE_H = 76;
const GRID = 20;

const KINDS: Record<WorkflowStepKind, { label: string; hint: string; Icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  stage:        { label: 'Stage',        hint: 'A lifecycle status the booking sits in.',        Icon: Flag,         tone: 'bg-foreground text-background' },
  approval:     { label: 'Approval',     hint: 'Someone decides: approve or request changes.',   Icon: ShieldCheck,  tone: 'bg-warning-100 text-warning-700' },
  check:        { label: 'Check',        hint: 'A condition Edge derives or a person confirms.', Icon: CheckCircle2, tone: 'bg-success-100 text-success-700' },
  fulfilment:   { label: 'Fulfilment',   hint: 'A physical step: print, distribute, install.',   Icon: Truck,        tone: 'bg-info-100 text-info-700' },
  notification: { label: 'Notification', hint: 'Tell someone something happened.',               Icon: Bell,         tone: 'bg-neutral-100 text-neutral-700' },
  gate:         { label: 'Gate',         hint: 'Branch on an outcome or a condition.',            Icon: GitBranch,    tone: 'bg-destructive-100 text-destructive-700' },
};

const OWNERS: Record<WorkflowOwner, string> = { advertiser: 'Advertiser', retailer: 'Retailer (AdOps)', edge: 'Edge (automatic)', external: 'External partner' };

const ACTION_TYPES: Record<WorkflowActionType, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  email:        { label: 'Send an email',        Icon: Mail },
  notification: { label: 'In-app notification',  Icon: Bell },
  todo:         { label: 'Create a to-do',        Icon: ListChecks },
  'set-status': { label: 'Set a status',          Icon: Flag },
  kafka:        { label: 'Publish to a topic',    Icon: Rocket },
  log:          { label: 'Write to the log',      Icon: Users },
};

const snap = (n: number) => Math.max(0, Math.round(n / GRID) * GRID);
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

/** Where a step's in and out ports sit. */
const portIn = (s: WorkflowStep) => ({ x: s.x + NODE_W / 2, y: s.y });
const portOut = (s: WorkflowStep) => ({ x: s.x + NODE_W / 2, y: s.y + NODE_H });

const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dy = Math.max(40, Math.abs(b.y - a.y) / 2);
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
};

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
    if (s.kind === 'approval' && s.owner === 'edge') issues.push(`"${s.name}" is an approval but Edge owns it — a person must decide.`);
    if (s.kind === 'approval' && !s.slaDays) issues.push(`"${s.name}" has no SLA — say how long the approver has.`);
    if (s.kind === 'gate' && (outgoing.get(s.id) ?? 0) < 2) issues.push(`"${s.name}" is a gate with fewer than two ways out.`);
  }
  const names = wf.steps.map((s) => s.name.trim().toLowerCase());
  const dupes = names.filter((n, i) => n && names.indexOf(n) !== i);
  if (dupes.length) issues.push(`Two steps share a name: ${[...new Set(dupes)].join(', ')}.`);
  return issues;
}

// ── The board ────────────────────────────────────────────────────────────

export const WorkflowBuilder: React.FC<{ engine: EngineId; className?: string }> = ({ engine, className }) => {
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
      setSteps(record.steps.map((s) => ({ ...s, actions: [...s.actions] })));
      setTransitions([...record.transitions]);
      setDirty(false);
    }
  }, [record]);

  const [selectedStep, setSelectedStep] = React.useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = React.useState<string | null>(null);
  const boardRef = React.useRef<HTMLDivElement>(null);

  // Dragging a tile, or drawing a line from a tile's foot.
  const drag = React.useRef<{ id: string; dx: number; dy: number } | null>(null);
  const [connecting, setConnecting] = React.useState<{ from: string; x: number; y: number } | null>(null);

  const boardPoint = (e: { clientX: number; clientY: number }) => {
    const el = boardRef.current!;
    const r = el.getBoundingClientRect();
    return { x: e.clientX - r.left + el.scrollLeft, y: e.clientY - r.top + el.scrollTop };
  };

  const patchStep = (id: string, patch: Partial<WorkflowStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    setDirty(true);
  };

  const onTilePointerDown = (e: React.PointerEvent, s: WorkflowStep) => {
    if ((e.target as HTMLElement).closest('[data-port]')) return;
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
    if (connecting) {
      const p = boardPoint(e);
      setConnecting({ ...connecting, x: p.x, y: p.y });
    }
  };
  const onBoardPointerUp = () => {
    // Released over the board, not a tile: the line is dropped.
    if (connecting) setConnecting(null);
  };

  const addTransition = (from: string, to: string) => {
    if (transitions.some((t) => t.from === from && t.to === to)) return;
    setTransitions((prev) => [...prev, { id: uid('t'), from, to }]);
    setDirty(true);
  };

  const addStep = (kind: WorkflowStepKind, at?: { x: number; y: number }) => {
    const below = steps.reduce((m, s) => Math.max(m, s.y + NODE_H), 0);
    const step: WorkflowStep = {
      id: uid('s'),
      kind,
      name: `New ${KINDS[kind].label.toLowerCase()}`,
      owner: kind === 'check' || kind === 'stage' ? 'edge' : kind === 'fulfilment' ? 'external' : 'retailer',
      mandatory: kind !== 'notification',
      actions: [],
      x: at ? snap(at.x - NODE_W / 2) : 40,
      y: at ? snap(at.y - NODE_H / 2) : snap(below + 60),
    };
    setSteps((prev) => [...prev, step]);
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

  const validate = () => {
    toast(
      issues.length
        ? { title: `${issues.length} thing${issues.length === 1 ? '' : 's'} to fix`, description: issues.slice(0, 2).join(' ') }
        : { title: 'Workflow is valid', description: 'One start, one end, every step reachable, every approver a person.' },
    );
  };

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
        <div className="min-w-0 flex-1">
          <Input value={name} onChange={(e) => { setName(e.target.value); setDirty(true); }} className="max-w-md font-medium" placeholder="Workflow name" />
        </div>
        <Badge variant="outline" className={cn('px-2 py-0.5 text-xs', record.status === 'published' ? 'border-success-200 bg-success-50 text-success-700' : 'border-border bg-neutral-50 text-neutral-600')}>
          {record.status === 'published' ? 'Published' : 'Draft'}{dirty ? ' · unsaved changes' : ''}
        </Badge>
        <div className="flex gap-2">
          <Button variant="outline" onClick={validate} className="gap-1.5">
            {issues.length ? <AlertTriangle className="h-4 w-4 text-warning-600" /> : <CheckCircle2 className="h-4 w-4 text-success-600" />}
            Validate
          </Button>
          <Button variant="outline" onClick={() => save(false)} disabled={!dirty} className="gap-1.5"><Save className="h-4 w-4" /> Save draft</Button>
          <Button onClick={() => save(true)} disabled={issues.length > 0} className="gap-1.5"><Rocket className="h-4 w-4" /> Publish</Button>
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
          className="relative h-[70vh] min-h-[560px] overflow-auto rounded-xl border bg-page"
          style={{ backgroundImage: 'radial-gradient(hsl(var(--border)) 1px, transparent 1px)', backgroundSize: `${GRID}px ${GRID}px` }}
          onDragOver={(e) => { if (e.dataTransfer.types.includes('text/workflow-kind')) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } }}
          onDrop={(e) => {
            const kind = e.dataTransfer.getData('text/workflow-kind') as WorkflowStepKind;
            if (kind && KINDS[kind]) { e.preventDefault(); addStep(kind, boardPoint(e)); }
          }}
          onPointerMove={onBoardPointerMove}
          onPointerUp={onBoardPointerUp}
          onClick={(e) => { if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') { setSelectedStep(null); setSelectedEdge(null); } }}
        >
          <div className="relative" style={{ width: boardW, height: boardH }}>
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
                const d = curve(portOut(a), portIn(b));
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
              const pa = portOut(a); const pb = portIn(b);
              return (
                <span
                  key={`${t.id}-label`}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-card px-2 py-0.5 text-[10px] text-muted-foreground"
                  style={{ left: (pa.x + pb.x) / 2, top: (pa.y + pb.y) / 2 }}
                >
                  {t.label}
                </span>
              );
            })}
            {/* Tiles */}
            {steps.map((s) => {
              const { Icon, tone, label } = KINDS[s.kind];
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
                  <div className="flex h-full items-center gap-2.5 p-2.5">
                    <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', tone)}><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{s.name}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {label} · {OWNERS[s.owner]}
                        {s.dueDaysBeforeStart ? ` · X-${s.dueDaysBeforeStart}` : ''}
                      </span>
                      <span className="mt-0.5 flex gap-1">
                        {s.mandatory && <span className="rounded-sm bg-neutral-100 px-1 text-[9px] uppercase tracking-wide text-neutral-600">Mandatory</span>}
                        {s.slaDays ? <span className="rounded-sm bg-neutral-100 px-1 text-[9px] uppercase tracking-wide text-neutral-600">SLA {s.slaDays}d</span> : null}
                        {s.actions.length > 0 && <span className="rounded-sm bg-neutral-100 px-1 text-[9px] uppercase tracking-wide text-neutral-600">{s.actions.length} action{s.actions.length === 1 ? '' : 's'}</span>}
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
                </div>
              );
            })}
          </div>

          {/* Selected line: label it or remove it. */}
          {edge && (
            <div className="sticky bottom-3 left-3 z-10 mr-3 flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-md">
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
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Name</label>
                  <Input value={selected.name} onChange={(e) => patchStep(selected.id, { name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Kind</label>
                    <Input dropdown options={(Object.keys(KINDS) as WorkflowStepKind[]).map((k) => ({ value: k, label: KINDS[k].label }))} value={selected.kind} onChange={(v) => patchStep(selected.id, { kind: v as WorkflowStepKind })} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Owner</label>
                    <Input dropdown options={(Object.keys(OWNERS) as WorkflowOwner[]).map((o) => ({ value: o, label: OWNERS[o] }))} value={selected.owner} onChange={(v) => patchStep(selected.id, { owner: v as WorkflowOwner })} />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">What happens here</label>
                  <Input value={selected.description ?? ''} placeholder="One line the team will read" onChange={(e) => patchStep(selected.id, { description: e.target.value })} />
                </div>
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span>
                    <span className="block text-sm font-medium">Mandatory</span>
                    <span className="block text-xs text-muted-foreground">Blocks the next stage until done</span>
                  </span>
                  <Switch checked={selected.mandatory} onCheckedChange={(on) => patchStep(selected.id, { mandatory: on })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Due, days before start</label>
                    <Input type="number" min={0} value={selected.dueDaysBeforeStart ?? ''} placeholder="e.g. 4 for X-4" onChange={(e) => patchStep(selected.id, { dueDaysBeforeStart: e.target.value ? Number(e.target.value) : undefined })} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">SLA, days</label>
                    <Input type="number" min={0} value={selected.slaDays ?? ''} placeholder="Time to respond" onChange={(e) => patchStep(selected.id, { slaDays: e.target.value ? Number(e.target.value) : undefined })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Escalate to</label>
                    <Input dropdown options={[{ value: '', label: 'Nobody' }, ...(Object.keys(OWNERS) as WorkflowOwner[]).map((o) => ({ value: o, label: OWNERS[o] }))]} value={selected.escalateTo ?? ''} onChange={(v) => patchStep(selected.id, { escalateTo: (v || undefined) as WorkflowOwner | undefined })} placeholder="Nobody" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Deputy when absent</label>
                    <Input value={selected.deputy ?? ''} placeholder="e.g. Second AdOps" onChange={(e) => patchStep(selected.id, { deputy: e.target.value || undefined })} />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-sm font-medium">Actions Edge fires</label>
                    <Button
                      variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs"
                      onClick={() => patchStep(selected.id, { actions: [...selected.actions, { id: uid('a'), type: 'notification', label: '', to: 'advertiser' }] })}
                    >
                      <Plus className="h-3.5 w-3.5" /> Add action
                    </Button>
                  </div>
                  {selected.actions.length === 0 ? (
                    <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">Nothing yet — an email, a notification, a to-do, a status, a topic or a log line.</p>
                  ) : (
                    <div className="space-y-2">
                      {selected.actions.map((a) => (
                        <ActionRow
                          key={a.id}
                          action={a}
                          onChange={(next) => patchStep(selected.id, { actions: selected.actions.map((x) => (x.id === a.id ? next : x)) })}
                          onRemove={() => patchStep(selected.id, { actions: selected.actions.filter((x) => x.id !== a.id) })}
                        />
                      ))}
                    </div>
                  )}
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

const ActionRow: React.FC<{ action: WorkflowAction; onChange: (a: WorkflowAction) => void; onRemove: () => void }> = ({ action, onChange, onRemove }) => {
  const needsTarget = action.type === 'email' || action.type === 'notification' || action.type === 'todo';
  return (
    <div className="space-y-2 rounded-md border p-2.5">
      <div className="flex items-center gap-2">
        <Input
          dropdown
          className="flex-1"
          options={(Object.keys(ACTION_TYPES) as WorkflowActionType[]).map((t) => ({ value: t, label: ACTION_TYPES[t].label }))}
          value={action.type}
          onChange={(v) => onChange({ ...action, type: v as WorkflowActionType })}
        />
        {needsTarget && (
          <Input
            dropdown
            className="w-40"
            options={(Object.keys(OWNERS) as WorkflowOwner[]).map((o) => ({ value: o, label: OWNERS[o] }))}
            value={action.to ?? 'advertiser'}
            onChange={(v) => onChange({ ...action, to: v as WorkflowOwner })}
          />
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Remove action" onClick={onRemove}><Trash2 className="h-4 w-4" /></Button>
      </div>
      <Input value={action.label} placeholder="What it says or does" onChange={(e) => onChange({ ...action, label: e.target.value })} />
    </div>
  );
};
