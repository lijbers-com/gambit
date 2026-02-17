'use client';

import { GoalSelection } from '@/components/layout/page-templates/create-media-experience.stories';

export default function CreateMediaExperiencePage() {
  const Component = GoalSelection.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Create Media Experience</div>;
  }

  return <Component />;
}
