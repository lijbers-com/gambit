'use client';

import * as React from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from './button';
import { Switch } from './switch';
import { Label } from './label';
import { SearchableSelect } from './searchable-select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

/**
 * How — and how often — the user hears from the platform.
 *
 * The gear sits on the inbox's filter row: the same place a user is when
 * notifications start to feel like too many or too few. Settings persist per
 * browser (this is a prototype — no server profile behind it).
 */

const STORAGE_KEY = 'gambit-notification-settings';

interface Settings {
  frequency: 'immediately' | 'daily' | 'weekly';
  email: boolean;
  propositions: Record<string, boolean>;
}

const PROPOSITIONS = [
  { id: 'sponsored-products', label: 'Sponsored products' },
  { id: 'display', label: 'Display' },
  { id: 'digital-instore', label: 'Digital in-store' },
  { id: 'offline-instore', label: 'Offline in-store' },
  { id: 'offsite', label: 'Offsite' },
];

const DEFAULTS: Settings = {
  frequency: 'immediately',
  email: true,
  propositions: Object.fromEntries(PROPOSITIONS.map((p) => [p.id, true])),
};

const read = (): Settings => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Settings) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

export const NotificationSettings: React.FC<{ className?: string }> = ({ className }) => {
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<Settings>(DEFAULTS);

  const openDialog = () => {
    setSettings(read());
    setOpen(true);
  };
  const save = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Private mode: the dialog still worked for this session.
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        iconOnly
        aria-label="Notification settings"
        title="Notification settings"
        onClick={openDialog}
        className={className}
      >
        <Settings2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notification settings</DialogTitle>
            <DialogDescription>What reaches you, and how often.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label className="mb-2 block">How often</Label>
              <SearchableSelect
                hideSearch
                value={settings.frequency}
                onChange={(v) => setSettings({ ...settings, frequency: v as Settings['frequency'] })}
                options={[
                  { label: 'Immediately', value: 'immediately', description: 'Every notification, as it happens' },
                  { label: 'Daily digest', value: 'daily', description: 'One summary each morning' },
                  { label: 'Weekly digest', value: 'weekly', description: 'One summary on Monday' },
                ]}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium">Also send by email</p>
                <p className="text-xs text-muted-foreground">In-app notifications always stay on.</p>
              </div>
              <Switch checked={settings.email} onCheckedChange={(v) => setSettings({ ...settings, email: v })} />
            </div>

            <div>
              <Label className="mb-2 block">Per proposition</Label>
              <div className="divide-y divide-border overflow-hidden rounded-md border">
                {PROPOSITIONS.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3">
                    <span className="text-sm">{p.label}</span>
                    <Switch
                      checked={settings.propositions[p.id] ?? true}
                      onCheckedChange={(v) =>
                        setSettings({ ...settings, propositions: { ...settings.propositions, [p.id]: v } })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
