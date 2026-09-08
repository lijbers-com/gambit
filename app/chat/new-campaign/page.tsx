'use client';

import * as React from 'react';
import { agentCaseBySlug } from '@/lib/agent-cases';
import { stashAgentContext } from '@/lib/agent-context';

/**
 * Legacy scenario route — now a hand-off into the live Campaign Agent,
 * fenced to the matching case from the case library.
 */
export default function AgentCaseRedirect() {
  React.useEffect(() => {
    const c = agentCaseBySlug('new-campaign');
    if (c) {
      stashAgentContext({ kind: c.kind, subject: c.subject, message: c.message, ...c.caseData });
      window.location.replace(`/chat?q=${encodeURIComponent(`Tell me more: ${c.subject}`)}`);
    } else {
      window.location.replace('/chat');
    }
  }, []);
  return null;
}
