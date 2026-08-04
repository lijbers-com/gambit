'use client';

import * as React from 'react';
import { Faq } from './faq';
import { useDb, useSession, faqsFor, type EngineId, type FaqSurfaceId } from '@/lib/db';

/**
 * The database-backed FAQ block a template drops in.
 *
 * It resolves the reader itself — the logged-in user's side decides whether
 * advertiser-only or retailer-only entries apply — so a template only has to
 * say which surface it is, and optionally which step or proposition.
 *
 * Renders nothing when there is nothing to say. A retailer who has not written
 * any entries for a screen gets no empty "Frequently asked questions" box.
 */

export interface FaqPanelProps {
  surface: FaqSurfaceId;
  /** Step or tab within the surface. Surface-wide entries are included too. */
  section?: string;
  /** Proposition, for engine-specific entries. */
  engine?: EngineId;
  heading?: React.ReactNode;
  className?: string;
}

export const FaqPanel: React.FC<FaqPanelProps> = ({ surface, section, engine, heading, className }) => {
  const db = useDb();
  const user = useSession();
  const entries = faqsFor(db, { surface, section, engine, side: user?.side });

  return (
    <Faq
      items={entries.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
      heading={heading}
      className={className}
    />
  );
};
