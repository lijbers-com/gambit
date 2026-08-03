'use client';

import * as React from 'react';
import { OptimisationCard, type Advice } from './optimisation-card';
import {
  useDb,
  deriveTasksForPlan,
  deriveTasksForCampaign,
  deriveTasksForBooking,
  type DerivedTask,
} from '@/lib/db';

/**
 * The "Actions" tab shown on the media-plan, campaign and booking templates.
 *
 * It renders the entity's derived to-dos as Action-needed messages ("Upload
 * creative", "Choose a placement") alongside the recommendations and insights
 * for that entity — one place per page where a user sees what to do next.
 * Because the to-dos come from the same engine that drives the home task
 * widgets and the health check (src/lib/db/tasks.ts), they never disagree.
 */

export interface ActionsTabProps {
  /** Which entity's actions to show. */
  scope: 'media-plan' | 'campaign' | 'booking';
  /** Id of that entity. Omit to resolve it from the route. */
  entityId?: string;
  /** Recommendations and insights for this entity, shown under the actions. */
  advice?: Advice[];
  className?: string;
}

/** A derived to-do rendered as an advice item — title as the mail subject,
 *  the explanation as the preview line under it. */
const taskToAdvice = (task: DerivedTask): Advice => ({
  badge: 'Action needed',
  tone: 'alert',
  title: task.title,
  message: task.detail,
});

export const ActionsTab: React.FC<ActionsTabProps> = ({ scope, entityId, advice = [], className }) => {
  const db = useDb();

  // Templates that render one entity per route can omit entityId; the last
  // path segment identifies it (/campaigns/display/C-001,
  // /campaigns/display/booking/B-001, /campaigns/plan/MP-001).
  const routeId = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const segments = window.location.pathname.split('/').filter(Boolean);
    return segments[segments.length - 1];
  }, []);
  const id = entityId ?? routeId;

  const tasks = React.useMemo(() => {
    if (!id) return [];
    if (scope === 'media-plan') return deriveTasksForPlan(db, id);
    if (scope === 'campaign') return deriveTasksForCampaign(db, id);
    return deriveTasksForBooking(db, id);
  }, [db, scope, id]);

  // Actions first (most severe first — deriveTasks already sorts), then the
  // recommendations and insights passed in by the template.
  const items: Advice[] = [...tasks.map(taskToAdvice), ...advice];

  return (
    <div className={className}>
      <OptimisationCard items={items} />
    </div>
  );
};
