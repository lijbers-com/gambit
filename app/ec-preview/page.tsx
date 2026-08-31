'use client';

/**
 * The public preview route for the EpicContext design-system chapter.
 *
 * `/__ec/preview?key=<entry>` renders ONE entry from the registry the
 * application itself imports (src/components/preview-registry.tsx) — the real
 * component, real sample data, no app chrome. Every `component_spec` block in
 * EpicContext frames one of these URLs per variant; that is how the design
 * system stays a picture of the product rather than a drawing of it.
 *
 * Without a key it lists every entry, grouped the way the design-system
 * chapter groups them — the human-browsable index of what can be framed.
 *
 * Public by design: it has no data, no session and no API; it renders
 * hard-coded sample content only.
 */

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { previewRegistry, previewGroups } from '@/components/preview-registry';

function PreviewInner() {
  const params = useSearchParams();
  const key = params.get('key');

  if (key) {
    const entry = previewRegistry[key];
    if (!entry) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background p-8">
          <p className="text-sm text-muted-foreground">
            No preview registered for <code className="rounded bg-neutral-100 px-1">{key}</code>.
          </p>
        </main>
      );
    }
    return (
      // The stage: the app's own background, the component centred, nothing
      // else — so what the frame shows is the component, not a page around it.
      <main className="flex min-h-screen items-start justify-center bg-background p-8">
        <div className={entry.wide ? 'w-full max-w-3xl' : 'w-full max-w-md'}>{entry.render()}</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-10 bg-background p-8">
      <header>
        <h1 className="text-2xl font-semibold">Component previews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every entry renders the real component. Frame one with <code className="rounded bg-neutral-100 px-1">?key=&lt;entry&gt;</code>.
        </p>
      </header>
      {previewGroups.map((group) => {
        const entries = Object.entries(previewRegistry).filter(([, e]) => e.group === group);
        if (entries.length === 0) return null;
        return (
          <section key={group} className="space-y-4">
            <h2 className="text-lg font-semibold">{group}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {entries.map(([k, e]) => (
                <a
                  key={k}
                  href={`/ec-preview?key=${encodeURIComponent(k)}`}
                  className="block rounded-xl border border-border p-4 transition-colors hover:bg-surface-hover"
                >
                  <span className="mb-3 flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{e.title}</span>
                    <code className="text-xs text-muted-foreground">{k}</code>
                  </span>
                  {/* The index shows the entry itself, small — a thumbnail
                      grid finds a component by shape faster than by name. */}
                  <span className="pointer-events-none block origin-top-left scale-90">{e.render()}</span>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}

export default function PreviewPage() {
  return (
    <React.Suspense fallback={null}>
      <PreviewInner />
    </React.Suspense>
  );
}
