'use client';

import * as React from 'react';
import { Gavel, ShieldCheck } from 'lucide-react';
import { Label } from './label';
import { GoalCard } from './goal-card';

/** Auction vs guaranteed — the campaign-setup question that decides whether
 *  placements carry bids. The same GoalCard the media plan's goal step uses,
 *  in the same grid, so a campaign type reads as the same kind of choice as
 *  a goal. */
export const BuyingTypePicker = ({
  value,
  onChange,
}: {
  value: 'auction' | 'guaranteed';
  onChange: (v: 'auction' | 'guaranteed') => void;
}) => (
  <div className="space-y-2">
    <Label>Campaign type</Label>
    <div className="grid grid-cols-1 gap-2 sm:auto-rows-fr sm:grid-cols-2">
      {([
        { id: 'auction' as const, icon: <Gavel />, title: 'Auction', text: 'Bid per placement — each selected placement carries its own CPC.' },
        { id: 'guaranteed' as const, icon: <ShieldCheck />, title: 'Guaranteed', text: 'Fixed price, reserved delivery — no bidding.' },
      ]).map((opt) => (
        <GoalCard
          key={opt.id}
          icon={opt.icon}
          title={opt.title}
          description={opt.text}
          selected={value === opt.id}
          onClick={() => onChange(opt.id)}
        />
      ))}
    </div>
  </div>
);
