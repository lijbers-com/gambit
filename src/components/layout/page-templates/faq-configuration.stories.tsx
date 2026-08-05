import type { Meta } from '@storybook/react';
import React, { useState } from 'react';
import { AppLayout } from '../app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Faq } from '@/components/ui/faq';
import { FormSection } from '@/components/ui/form-section';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import {
  useDb,
  useSession,
  createFaq,
  updateFaq,
  deleteFaq,
  moveFaq,
  faqsForSurface,
  faqSurface,
  canManageFaq,
  FAQ_SURFACES,
  type EngineId,
  type FaqAudience,
  type FaqEntry,
  type FaqSurfaceId,
} from '@/lib/db';
import { ChevronDown, ChevronUp, Eye, Lock, Pencil, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const meta = {
  title: 'Page Templates/FAQ Configuration',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AppLayout>;

export default meta;

const AUDIENCES: { value: FaqAudience; label: string; description: string }[] = [
  { value: 'all', label: 'Everyone', description: 'Shown to advertisers and to your own team' },
  { value: 'advertiser', label: 'Advertisers only', description: 'Self-service and agency users' },
  { value: 'retailer', label: 'Internal only', description: 'Your own team — never shown to advertisers' },
];

const ENGINES: { value: EngineId; label: string }[] = [
  { value: 'display', label: 'Display' },
  { value: 'sponsored-products', label: 'Sponsored products' },
  { value: 'digital-instore', label: 'Digital in-store' },
  { value: 'offline-instore', label: 'Offline in-store' },
  { value: 'offsite', label: 'Offsite' },
];

/** The editable shape — what the dialog holds while a draft is being written. */
interface Draft {
  question: string;
  answer: string;
  section: string;
  engine: string;
  audience: FaqAudience;
  published: boolean;
}

const emptyDraft: Draft = { question: '', answer: '', section: '', engine: '', audience: 'all', published: true };

const draftFrom = (entry: FaqEntry): Draft => ({
  question: entry.question,
  answer: entry.answer,
  section: entry.section ?? '',
  engine: entry.engine ?? '',
  audience: entry.audience,
  published: entry.published,
});

const audienceBadge: Record<FaqAudience, { label: string; className: string }> = {
  all: { label: 'Everyone', className: 'border-border bg-neutral-50 text-neutral-600' },
  advertiser: { label: 'Advertisers', className: 'border-primary/20 bg-primary/5 text-primary' },
  retailer: { label: 'Internal', className: 'border-warning-200 bg-warning-50 text-warning-700' },
};

export const Overview = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    const db = useDb();
    const user = useSession();
    const mayEdit = canManageFaq(user);

    const [surfaceId, setSurfaceId] = useState<FaqSurfaceId>('create-media-plan');
    const surface = faqSurface(surfaceId)!;
    const entries = faqsForSurface(db, surfaceId);

    // `editing` holds the id being changed, or 'new' while adding.
    const [editing, setEditing] = useState<string | null>(null);
    const [draft, setDraft] = useState<Draft>(emptyDraft);
    const [preview, setPreview] = useState(false);

    const openNew = () => {
      setDraft(emptyDraft);
      setEditing('new');
    };
    const openEdit = (entry: FaqEntry) => {
      setDraft(draftFrom(entry));
      setEditing(entry.id);
    };

    const save = () => {
      const payload = {
        question: draft.question.trim(),
        answer: draft.answer.trim(),
        surface: surfaceId,
        // Empty select → the entry applies to the whole surface / every
        // proposition, so the field is dropped rather than stored as ''.
        section: draft.section || undefined,
        engine: (draft.engine || undefined) as EngineId | undefined,
        audience: draft.audience,
        published: draft.published,
      };
      if (editing === 'new') createFaq(payload);
      else if (editing) updateFaq(editing, payload);
      setEditing(null);
    };

    const canSave = draft.question.trim().length > 0 && draft.answer.trim().length > 0;

    // Counts per surface, so an editor can see at a glance which templates
    // have no help at all.
    const countFor = (id: FaqSurfaceId) => db.faqs.filter((f) => f.surface === id).length;

    return (
      <AppLayout
        routes={routes}
        pageHeaderProps={{
          title: 'FAQ & help',
          subtitle: 'Questions answered in your own words, shown on the screen they belong to',
          headerRight: mayEdit ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreview((v) => !v)} className="gap-1.5">
                <Eye className="h-4 w-4" />
                {preview ? 'Hide preview' : 'Preview'}
              </Button>
              <Button onClick={openNew} className="gap-1.5">
                <Plus className="h-4 w-4" />
                New question
              </Button>
            </div>
          ) : undefined,
        }}
      >
        {!mayEdit ? (
          // Not a hard security boundary — the navigation already hides this
          // page — but landing here from a bookmark should explain itself.
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <Lock className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium">FAQ editing is for the retailer&apos;s own team</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Sign in with your Edge account to add or change the help shown across the platform. Advertisers read
                these answers but do not write them.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
            {/* Which template the entries belong to. */}
            <Card className="h-fit">
              <CardContent className="p-2">
                {FAQ_SURFACES.map((s) => {
                  const count = countFor(s.id);
                  const active = s.id === surfaceId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSurfaceId(s.id)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                        active
                          ? 'border border-surface-selected-border bg-surface-selected font-medium'
                          : 'border border-transparent hover:bg-surface-hover',
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">{s.label}</span>
                      <span className={cn('text-xs tabular-nums', count ? 'text-muted-foreground' : 'text-muted-foreground/50')}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <FormSection
                    title={surface.label}
                    headerClassName="mb-4"
                    action={<span className="text-sm text-muted-foreground">{entries.length} entries</span>}
                  >
                    <p className="-mt-2 mb-4 text-sm text-muted-foreground">{surface.description}</p>

                    {entries.length === 0 ? (
                      <div className="rounded-lg border border-dashed py-10 text-center">
                        <p className="text-sm text-muted-foreground">
                          No questions on this screen yet — readers see nothing at all.
                        </p>
                        <Button variant="outline" size="sm" onClick={openNew} className="mt-3 gap-1.5">
                          <Plus className="h-4 w-4" />
                          Add the first one
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y divide-border overflow-hidden rounded-lg border">
                        {entries.map((entry, i) => (
                          <div key={entry.id} className="flex items-start gap-3 p-4">
                            {/* Order controls — editors think "this should come
                                first", not in order numbers. */}
                            <div className="flex flex-col">
                              <button
                                type="button"
                                disabled={i === 0}
                                onClick={() => moveFaq(entry.id, 'up')}
                                aria-label="Move up"
                                className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                disabled={i === entries.length - 1}
                                onClick={() => moveFaq(entry.id, 'down')}
                                aria-label="Move down"
                                className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">{entry.question}</p>
                              <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{entry.answer}</p>
                              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                {!entry.published && (
                                  <Badge variant="outline" className="border-border bg-neutral-50 text-xs text-muted-foreground">
                                    Draft
                                  </Badge>
                                )}
                                <Badge variant="outline" className={cn('text-xs', audienceBadge[entry.audience].className)}>
                                  {audienceBadge[entry.audience].label}
                                </Badge>
                                {entry.section && (
                                  <Badge variant="outline" className="border-border bg-neutral-50 text-xs text-neutral-600">
                                    {surface.sections.find((s) => s.id === entry.section)?.label ?? entry.section}
                                  </Badge>
                                )}
                                {entry.engine && (
                                  <Badge variant="outline" className="border-border bg-neutral-50 text-xs text-neutral-600">
                                    {ENGINES.find((e) => e.value === entry.engine)?.label ?? entry.engine}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex shrink-0 gap-1">
                              <Button variant="outline" size="sm" onClick={() => openEdit(entry)} className="h-8 w-8 p-0" aria-label="Edit">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => deleteFaq(entry.id)} className="h-8 w-8 p-0" aria-label="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormSection>
                </CardContent>
              </Card>

              {/* What the reader gets — the same component the templates use,
                  so what is written here is what ships. Drafts are left out,
                  exactly as in-product. */}
              {preview && (
                <Card>
                  <CardContent className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Preview — how this looks on {surface.label}. Drafts are not included.
                    </p>
                    <Faq
                      items={entries
                        .filter((e) => e.published)
                        .map((e) => ({ id: e.id, question: e.question, answer: e.answer }))}
                      heading={null}
                    />
                    {entries.filter((e) => e.published).length === 0 && (
                      <p className="text-sm text-muted-foreground">Nothing published — the block is hidden entirely.</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing === 'new' ? 'New question' : 'Edit question'}</DialogTitle>
              <DialogDescription>Shown on {surface.label}.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Question</Label>
                <Input
                  value={draft.question}
                  onChange={(e) => setDraft({ ...draft, question: e.target.value })}
                  placeholder="e.g. Why can I not launch my media plan?"
                  hint="Write the question the way a user would ask it."
                />
              </div>

              <div>
                <Label className="mb-2 block">Answer</Label>
                <Textarea
                  value={draft.answer}
                  onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
                  rows={7}
                  placeholder="Answer in full sentences…"
                  hint="Leave a blank line between paragraphs."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {surface.sections.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Step or tab</Label>
                    <SearchableSelect
                      hideSearch
                      value={draft.section}
                      onChange={(v) => setDraft({ ...draft, section: v })}
                      placeholder="Whole screen"
                      options={[
                        { label: 'Whole screen', value: '' },
                        ...surface.sections.map((s) => ({ label: s.label, value: s.id })),
                      ]}
                    />
                  </div>
                )}
                <div>
                  <Label className="mb-2 block">Proposition</Label>
                  <SearchableSelect
                    hideSearch
                    value={draft.engine}
                    onChange={(v) => setDraft({ ...draft, engine: v })}
                    placeholder="All propositions"
                    options={[{ label: 'All propositions', value: '' }, ...ENGINES]}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Audience</Label>
                  <SearchableSelect
                    hideSearch
                    value={draft.audience}
                    onChange={(v) => setDraft({ ...draft, audience: v as FaqAudience })}
                    options={AUDIENCES.map((a) => ({ label: a.label, value: a.value, description: a.description }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Published</p>
                  <p className="text-xs text-muted-foreground">Drafts stay here and are never shown in the platform.</p>
                </div>
                <Switch checked={draft.published} onCheckedChange={(v) => setDraft({ ...draft, published: v })} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={!canSave}>
                {editing === 'new' ? 'Add question' : 'Save changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    );
  },
};
