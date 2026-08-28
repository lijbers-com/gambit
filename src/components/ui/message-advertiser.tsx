'use client';

import * as React from 'react';
import { useDb } from '@/lib/db';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { SearchableSelect } from './searchable-select';
import { FormSection } from './form-section';

/**
 * Compose a message to an advertiser — the retailer's outbound channel.
 *
 * It lives with notifications rather than with help content: what the
 * retailer sends an advertiser lands in that advertiser's notifications, so
 * writing one belongs next to the ones being received, not next to the FAQs.
 * Prototype: sending confirms locally.
 */
export const MessageAdvertiser: React.FC<{ className?: string }> = ({ className }) => {
  const db = useDb();
  const [advertiser, setAdvertiser] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const send = () => {
    const name = db.advertisers.find((a) => a.id === advertiser)?.name ?? 'the advertiser';
    setSentTo(name);
    setSubject('');
    setBody('');
  };
  return (
    <FormSection title="Message an advertiser" headerClassName="mb-4" className={className}>
      <p className="-mt-2 mb-4 text-sm text-muted-foreground">
        Lands in their notifications and by email, from your team.
      </p>
      <div className="max-w-xl space-y-4">
        <div>
          <Label className="mb-2 block">Advertiser</Label>
          <SearchableSelect
            value={advertiser}
            onChange={setAdvertiser}
            placeholder="Choose an advertiser…"
            options={db.advertisers.map((a) => ({ label: a.name, value: a.id }))}
          />
        </div>
        <div>
          <Label className="mb-2 block">Subject</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. New offsite positions available" />
        </div>
        <div>
          <Label className="mb-2 block">Message</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="Write the message…" />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={send} disabled={!advertiser || !subject.trim() || !body.trim()}>Send message</Button>
          {sentTo && <span className="text-sm text-muted-foreground">Sent to {sentTo}.</span>}
        </div>
      </div>
    </FormSection>
  );
};
