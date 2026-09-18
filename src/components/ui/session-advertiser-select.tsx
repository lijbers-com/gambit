'use client';

import * as React from 'react';
import { AdvertiserSelect } from './advertiser-select';
import { useSessionFilters, setSessionFilters } from '@/lib/session-filters';

/**
 * The media partner in the page header, bound to the session rather than
 * the page: every page carries it by default, and the partner picked on one
 * page is still the partner on the next.
 */
export const SessionAdvertiserSelect: React.FC<{ className?: string; hideIcon?: boolean }> = ({ className, hideIcon }) => {
  const filters = useSessionFilters();
  return (
    <AdvertiserSelect
      className={className}
      hideIcon={hideIcon}
      value={filters.advertiserId ?? 'coca-cola'}
      onChange={(advertiserId) => setSessionFilters({ advertiserId })}
    />
  );
};
