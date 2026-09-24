'use client';

import * as React from 'react';
import { useDb } from '@/lib/db';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { SearchableSelect } from './searchable-select';
import { FormSection } from './form-section';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { useToast } from './toast';

/**
 * Compose a message to an advertiser — the retailer's outbound channel.
 *
 * It lives with notifications rather than with help content: what the
 * retailer sends an advertiser lands in that advertiser's notifications, so
 * writing one belongs next to the ones being received, not next to the FAQs.
 * Prototype: sending confirms locally.
 *
 * Two shapes on one form: the dialog behind the notification centre's "New
 * message" button, and the plain section for a page that embeds it.
 */

interface Draft { advertiser: string; subject: string; body: string }
const EMPTY: Draft = { advertiser: '', subject: '', body: '' };

const MessageFields: React.FC<{ draft: Draft; onChange: (next: Draft) => void }> = ({ draft, onChange }) => {
  const db = useDb();
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block">Advertiser</Label>
        <SearchableSelect
          value={draft.advertiser}
          onChange={(advertiser) => onChange({ ...draft, advertiser })}
          placeholder="Choose an advertiser…"
          options={db.advertisers.map((a) => ({ label: a.name, value: a.id }))}
        />
      </div>
      <div>
        <Label className="mb-2 block">Subject</Label>
        <Input value={draft.subject} onChange={(e) => onChange({ ...draft, subject: e.target.value })} placeholder="e.g. New offsite positions available" />
      </div>
      <div>
        <Label className="mb-2 block">Message</Label>
        <Textarea value={draft.body} onChange={(e) => onChange({ ...draft, body: e.target.value })} rows={6} placeholder="Write the message…" />
      </div>
    </div>
  );
};

const canSend = (d: Draft) => !!d.advertiser && d.subject.trim() !== '' && d.body.trim() !== '';

/** The message as a modal — opened from the "New message" button beside the tabs. */
export const MessageAdvertiserDialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  const db = useDb();
  const toast = useToast();
  const [draft, setDraft] = React.useState<Draft>(EMPTY);
  React.useEffect(() => { if (open) setDraft(EMPTY); }, [open]);
  const send = () => {
    const name = db.advertisers.find((a) => a.id === draft.advertiser)?.name ?? 'the advertiser';
    toast({ title: `Message sent to ${name}`, description: `"${draft.subject.trim()}" lands in their notifications and by email.` });
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
          <DialogDescription>To an advertiser — lands in their notifications and by email, from your team.</DialogDescription>
        </DialogHeader>
        <MessageFields draft={draft} onChange={setDraft} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={send} disabled={!canSend(draft)}>Send message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** The message as a section of a page. */
export const MessageAdvertiser: React.FC<{ className?: string }> = ({ className }) => {
  const db = useDb();
  const [draft, setDraft] = React.useState<Draft>(EMPTY);
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const send = () => {
    const name = db.advertisers.find((a) => a.id === draft.advertiser)?.name ?? 'the advertiser';
    setSentTo(name);
    setDraft({ ...draft, subject: '', body: '' });
  };
  return (
    <FormSection title="Message an advertiser" headerClassName="mb-4" className={className}>
      <p className="-mt-2 mb-4 text-sm text-muted-foreground">
        Lands in their notifications and by email, from your team.
      </p>
      <div className="max-w-xl space-y-4">
        <MessageFields draft={draft} onChange={setDraft} />
        <div className="flex items-center gap-3">
          <Button onClick={send} disabled={!canSend(draft)}>Send message</Button>
          {sentTo && <span className="text-sm text-muted-foreground">Sent to {sentTo}.</span>}
        </div>
      </div>
    </FormSection>
  );
};
