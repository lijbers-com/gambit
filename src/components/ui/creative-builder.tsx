'use client';

import * as React from 'react';
import { LayoutGrid, Link2, Minus, Send, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useDb,
  updateCreative,
  setCreativeStatus,
  type Creative,
  type CreativeTemplate,
  type CreativeTemplateField,
  type EngineId,
} from '@/lib/db';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardHeader } from './card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { FormSection } from './form-section';
import { Input, FileInput } from './input';
import { SettingsCard } from './settings-card';
import { Switch } from './switch';
import { Table } from './table';
import { queueToast } from './toast';
import { CreativePreview, parseSize, rememberUpload } from './creative-preview';

/**
 * The creative builder — settings on the left, a LIVE preview on the right.
 * You see what you change and know the effect: every keystroke, colour and
 * upload redraws the composition at the true size of the chosen format.
 *
 * The form is not hand-built per engine: it renders the chosen TEMPLATE's
 * field schema, because template logic belongs to the engine/proposition.
 * One template feeds all its sizes — the size switcher above the preview
 * flips between them, which is also the seam where later format automation
 * (per-size overrides) slots in.
 */

const STATUS_BADGE: Record<Creative['status'], { label: string; className: string }> = {
  requested: { label: 'Requested', className: 'border-warning-200 bg-warning-50 text-warning-700' },
  draft: { label: 'Draft', className: 'border-border bg-neutral-50 text-neutral-600' },
  submitted: { label: 'Submitted', className: 'border-info-200 bg-info-50 text-info-700' },
  'in-review': { label: 'In review', className: 'border-info-200 bg-info-50 text-info-700' },
  approved: { label: 'Approved', className: 'border-success-200 bg-success-50 text-success-700' },
  rejected: { label: 'Rejected', className: 'border-destructive-200 bg-destructive-50 text-destructive-700' },
};

export const CreativeStatusBadge: React.FC<{ status: Creative['status']; className?: string }> = ({ status, className }) => (
  <Badge variant="outline" className={cn('px-2 py-0.5 text-xs font-medium', STATUS_BADGE[status].className, className)}>
    {STATUS_BADGE[status].label}
  </Badge>
);

const LANG_LABELS: Record<string, string> = { en: 'EN', nl: 'NL' };

/** One schema-driven field. Text fields follow the active language. */
const TemplateField: React.FC<{
  field: CreativeTemplateField;
  creativeId: string;
  lang: string;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}> = ({ field, creativeId, lang, values, onChange }) => {
  const key = field.localized && lang !== 'en' ? `${lang}:${field.key}` : field.key;
  const label = `${field.label}${field.required ? '*' : ''}${field.localized && lang !== 'en' ? ` (${LANG_LABELS[lang] ?? lang})` : ''}`;

  if (field.type === 'image') {
    return (
      <FileInput
        label={label}
        hint={field.hint}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) {
            onChange(field.key, '');
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            // Image bytes stay in-session; the db keeps only the file name.
            rememberUpload(creativeId, field.key, String(reader.result));
            onChange(field.key, `uploaded:${file.name}`);
          };
          reader.readAsDataURL(file);
        }}
      />
    );
  }
  if (field.type === 'color') {
    const value = values[key] || field.placeholder || '#000000';
    return (
      <div className="min-w-0">
        <label className="mb-1.5 block text-sm font-medium">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'}
            onChange={(e) => onChange(key, e.target.value)}
            className="h-9 w-9 shrink-0 cursor-pointer rounded-md border border-input bg-background p-1"
            aria-label={`${field.label} swatch`}
          />
          <Input value={values[key] ?? ''} placeholder={field.placeholder} onChange={(e) => onChange(key, e.target.value)} />
        </div>
      </div>
    );
  }
  if (field.type === 'select') {
    return (
      <div className="min-w-0">
        <label className="mb-1.5 block text-sm font-medium">{label}</label>
        <Input
          dropdown
          options={(field.options ?? []).map((o) => ({ label: o, value: o }))}
          value={values[field.key] ?? ''}
          onChange={(v) => onChange(field.key, v)}
          placeholder={field.placeholder ?? 'Select…'}
        />
        {field.hint && <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>}
      </div>
    );
  }
  if (field.type === 'toggle') {
    return (
      <div className="flex items-center justify-between rounded-md border border-input px-3 py-2">
        <span className="text-sm font-medium">{field.label}</span>
        <Switch checked={values[field.key] === 'yes'} onCheckedChange={(on) => onChange(field.key, on ? 'yes' : 'no')} />
      </div>
    );
  }
  const hint = field.maxLength
    ? `${field.hint ? `${field.hint} ` : ''}(max. ${field.maxLength} characters)`
    : field.hint;
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <Input
        type={field.type === 'number' ? 'number' : 'text'}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        value={values[key] ?? ''}
        onChange={(e) => onChange(key, e.target.value)}
        hint={hint}
      />
    </div>
  );
};

export const CreativeBuilder: React.FC<{ engine: EngineId; className?: string }> = ({ engine, className }) => {
  const db = useDb();

  // The id is the route's last segment — both /creatives/{type}/{id} and
  // /campaigns/{engine}/creative/{id} end in it.
  const [creativeId, setCreativeId] = React.useState<string | null>(null);
  React.useEffect(() => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    setCreativeId(segments[segments.length - 1] ?? null);
  }, []);

  const creative = db.creatives.find((c) => c.id === creativeId) ?? null;
  const templates = db.creativeTemplates.filter((t) => t.engine === engine);

  // Draft state seeds from the record once, then the form owns it until save.
  const [name, setName] = React.useState('');
  const [templateId, setTemplateId] = React.useState('');
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [languages, setLanguages] = React.useState<string[]>(['en']);
  const [skus, setSkus] = React.useState<string[]>([]);
  const [skuInput, setSkuInput] = React.useState('');
  const [bookingIds, setBookingIds] = React.useState<string[]>([]);
  const seeded = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (creative && seeded.current !== creative.id) {
      seeded.current = creative.id;
      setName(creative.name);
      setTemplateId(creative.templateId);
      setValues(creative.values);
      setLanguages(creative.languages.length ? creative.languages : ['en']);
      setSkus(creative.skus ?? []);
      setBookingIds(creative.bookingIds);
    }
  }, [creative]);

  const template = templates.find((t) => t.id === templateId) ?? null;
  const [activeLang, setActiveLang] = React.useState('en');
  const [activeSize, setActiveSize] = React.useState<string | null>(null);
  const size = activeSize && template?.sizes.includes(activeSize) ? activeSize : template?.sizes[0];

  const [linking, setLinking] = React.useState(false);
  const [linkSelection, setLinkSelection] = React.useState<string[]>([]);
  const [showAllSizes, setShowAllSizes] = React.useState(false);
  const [sideBySide, setSideBySide] = React.useState(false);

  if (!creative) {
    return (
      <Card className={className}>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          This creative does not exist (anymore). Go back to the{' '}
          <a href="/creatives" className="font-medium text-foreground underline">creative portal</a>.
        </CardContent>
      </Card>
    );
  }

  const setValue = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const persist = (patch?: Partial<Creative>) =>
    updateCreative(creative.id, { name, templateId, values, languages, skus, bookingIds, ...patch });

  const addSkus = () => {
    const parsed = skuInput.split(',').map((x) => x.trim()).filter(Boolean);
    if (parsed.length) setSkus((prev) => [...new Set([...prev, ...parsed])]);
    setSkuInput('');
  };

  const saveDraft = () => {
    persist();
    queueToast({ title: 'Creative saved', description: `"${name}" kept as ${STATUS_BADGE[creative.status].label.toLowerCase()}.` });
  };

  const share = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    queueToast({ title: 'Preview link copied', description: 'Anyone on the plan can open this creative with it.' });
  };

  const submit = () => {
    persist();
    setCreativeStatus(creative.id, 'submitted');
    queueToast({ title: 'Submitted for approval', description: 'The engine reviews it within one working day.' });
    window.location.href = `/creatives/${engine}`;
  };

  const campaignsById = new Map(db.campaigns.map((c) => [c.id, c]));
  const engineBookings = db.bookings.filter((b) => campaignsById.get(b.campaignId)?.engine === engine);
  const linkedBookings = engineBookings.filter((b) => bookingIds.includes(b.id));

  const toggleLang = (lang: string) => {
    setLanguages((prev) => (prev.includes(lang) ? (lang === 'en' ? prev : prev.filter((l) => l !== lang)) : [...prev, lang]));
    if (activeLang === lang) setActiveLang('en');
  };

  const localizedFields = template?.fields.some((f) => f.localized) ?? false;

  return (
    <div className={cn('creative-builder-grid grid grid-cols-1 items-start gap-6 lg:grid-cols-5', className)}>
      {/* AppLayout's content wrapper clips horizontal overflow, which kills
          position:sticky for everything inside it. The pane itself still
          guards against horizontal scroll, so releasing the wrapper here is
          safe — and the preview genuinely rides along while you edit. */}
      <style>{`
        .w-full.p-6.pb-24.min-h-screen.overflow-x-hidden:has(.creative-builder-grid) {
          overflow-x: visible !important;
        }
      `}</style>
      {/* ── Settings ── */}
      <div className="min-w-0 lg:col-span-3">
        <Card className="min-w-0">
          <CardHeader className="space-y-8">
            {creative.status === 'rejected' && creative.rejectionReason && (
              <div className="rounded-md border border-destructive-200 bg-destructive-50 p-3 text-sm text-destructive-700">
                <span className="font-medium">Rejected: </span>
                {creative.rejectionReason} Fix it and submit again.
              </div>
            )}

            <FormSection title="Creative details">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Name*</label>
                  <Input placeholder="Enter creative name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">SKU</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter SKUs separated by commas"
                      value={skuInput}
                      onChange={(e) => setSkuInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkus(); } }}
                    />
                    <Button variant="outline" onClick={addSkus} disabled={!skuInput.trim()}>Add SKU</Button>
                  </div>
                  {skus.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {skus.map((sku) => (
                        <span key={sku} className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-0.5 text-xs tabular-nums">
                          {sku}
                          <button type="button" aria-label={`Remove SKU ${sku}`} onClick={() => setSkus((prev) => prev.filter((x) => x !== sku))} className="text-muted-foreground hover:text-foreground">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </FormSection>

            {/* The template IS the format choice — its logic comes from the
                engine, and its requirements are on the card, not behind a
                dead "See format requirements" button. */}
            <FormSection title="Template">
              <SettingsCard
                options={templates.map((t) => ({ value: t.id, label: t.name, description: t.description }))}
                value={templateId}
                onChange={(v) => {
                  setTemplateId(v);
                  setActiveSize(null);
                }}
                defaultSettingsOpen
                renderOpenExtra={(opt) => {
                  const t = templates.find((x) => x.id === opt.value);
                  if (!t) return null;
                  return (
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex flex-wrap gap-1.5">
                        {t.sizes.map((s) => (
                          <span key={s} className="rounded border bg-background px-1.5 py-0.5 tabular-nums">{s}</span>
                        ))}
                      </div>
                      {t.fileHint && <p>{t.fileHint}</p>}
                    </div>
                  );
                }}
              />
            </FormSection>

            {template && (
              <FormSection
                title={`${template.name} settings`}
                action={
                  localizedFields ? (
                    <div className="flex items-center gap-1">
                      {['en', 'nl'].map((lang) => {
                        const on = languages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => (on ? setActiveLang(lang) : (toggleLang(lang), setActiveLang(lang)))}
                            onDoubleClick={() => toggleLang(lang)}
                            className={cn(
                              'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
                              activeLang === lang && on
                                ? 'border-foreground bg-foreground text-background'
                                : on
                                  ? 'bg-background text-foreground hover:bg-surface-hover'
                                  : 'border-dashed text-muted-foreground hover:text-foreground',
                            )}
                            title={on ? `Edit ${LANG_LABELS[lang]} texts` : `Add ${LANG_LABELS[lang]} variant`}
                          >
                            {LANG_LABELS[lang]}
                          </button>
                        );
                      })}
                    </div>
                  ) : undefined
                }
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {template.fields.map((f) => (
                    <div key={f.key} className={f.type === 'image' ? 'sm:col-span-2' : undefined}>
                      <TemplateField field={f} creativeId={creative.id} lang={activeLang} values={values} onChange={setValue} />
                    </div>
                  ))}
                </div>
              </FormSection>
            )}

            <FormSection
              title="Bookings"
              action={
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setLinkSelection(bookingIds); setLinking(true); }}>
                  <Link2 className="h-4 w-4" /> Link bookings
                </Button>
              }
            >
              {linkedBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">Not linked yet — a booking cannot go live without an approved creative.</p>
              ) : (
                <Table
                  columns={[
                    {
                      key: 'unlink', header: '', width: 40,
                      render: (row: (typeof linkedBookings)[number]) => (
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7"
                          aria-label={`Unlink ${row.name}`}
                          onClick={() => setBookingIds((prev) => prev.filter((id) => id !== row.id))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      ),
                    },
                    { key: 'name', header: 'Booking' },
                    { key: 'campaign', header: 'Campaign', render: (row: (typeof linkedBookings)[number]) => campaignsById.get(row.campaignId)?.name ?? '—' },
                    { key: 'startDate', header: 'Start' },
                    { key: 'endDate', header: 'End' },
                  ]}
                  data={linkedBookings}
                  hideActions
                />
              )}
            </FormSection>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
              <Button variant="outline" onClick={saveDraft}>Save draft</Button>
              <Button className="gap-1.5" onClick={submit} disabled={!name || !templateId}>
                <Send className="h-4 w-4" /> Submit for approval
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Live preview — top-aligned with the settings card, natural
             height, and sticky so it rides along while you scroll. ── */}
      <div className="min-w-0 lg:col-span-2 lg:sticky lg:top-6">
        <Card className="min-w-0">
          <div>
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[18px] font-semibold leading-tight tracking-tight">Live preview</h2>
                <span className="flex items-center gap-1.5">
                  <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Copy preview link" onClick={share}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <CreativeStatusBadge status={creative.status} />
                </span>
              </div>
              {template && template.sizes.length > 1 && (
                <div className="flex flex-wrap gap-1.5">
                  {template.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setActiveSize(s); setShowAllSizes(false); }}
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 text-xs tabular-nums transition-colors',
                        !showAllSizes && s === size ? 'border-foreground bg-foreground text-background' : 'bg-background hover:bg-surface-hover',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowAllSizes(true)}
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
                      showAllSizes ? 'border-foreground bg-foreground text-background' : 'bg-background hover:bg-surface-hover',
                    )}
                  >
                    All
                  </button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {template ? (
                showAllSizes ? (
                  <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
                    {template.sizes.map((s) => (
                      <CreativePreview key={s} template={template} values={values} size={s} lang={activeLang} creativeId={creative.id} />
                    ))}
                  </div>
                ) : (
                  <CreativePreview template={template} values={values} size={size ?? undefined} lang={activeLang} creativeId={creative.id} />
                )
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">Pick a template to see the preview.</p>
              )}
              {template && template.sizes.length > 1 && (
                <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => setSideBySide(true)}>
                  <LayoutGrid className="h-4 w-4" /> View all formats side by side
                </Button>
              )}
              {template && languages.length > 1 && (
                <p className="text-center text-[11px] text-muted-foreground">
                  Showing the {LANG_LABELS[activeLang] ?? activeLang} variant — switch languages above the settings.
                </p>
              )}
              {template?.fileHint && (
                <p className="border-t pt-3 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Format requirements: </span>
                  {template.fileHint}
                </p>
              )}
            </CardContent>
          </div>
        </Card>
      </div>

      {/* ── Every format at once, side by side — one design, all sizes ── */}
      <Dialog open={sideBySide} onOpenChange={setSideBySide}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[960px]">
          <DialogHeader>
            <DialogTitle>All formats — {template?.name}</DialogTitle>
          </DialogHeader>
          {template && (
            <div className="flex flex-wrap items-start gap-6">
              {template.sizes.map((s) => {
                const { w, h } = parseSize(s);
                const wide = w / h > 3;
                return (
                  <div key={s} className={cn('min-w-0', wide ? 'basis-full' : h > w ? 'basis-[calc(33%-1rem)] min-w-[180px]' : 'basis-[calc(50%-0.75rem)] min-w-[260px]')}>
                    <CreativePreview template={template} values={values} size={s} lang={activeLang} creativeId={creative.id} />
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Link bookings ── */}
      <Dialog open={linking} onOpenChange={setLinking}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Link bookings</DialogTitle>
          </DialogHeader>
          <Table
            columns={[
              { key: 'name', header: 'Booking' },
              { key: 'campaign', header: 'Campaign', render: (row: (typeof engineBookings)[number]) => campaignsById.get(row.campaignId)?.name ?? '—' },
              { key: 'startDate', header: 'Start' },
              { key: 'endDate', header: 'End' },
            ]}
            data={engineBookings}
            rowSelection={{
              selectedKeys: linkSelection,
              onChange: (keys) => setLinkSelection(keys.map(String)),
              getKey: (row: (typeof engineBookings)[number]) => row.id,
            }}
            hideActions
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinking(false)}>Cancel</Button>
            <Button onClick={() => { setBookingIds(linkSelection); setLinking(false); }}>
              Link {linkSelection.length} booking{linkSelection.length === 1 ? '' : 's'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
