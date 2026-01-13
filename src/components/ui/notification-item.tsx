import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, DollarSign } from 'lucide-react';

export interface NotificationItemProps {
  type: 'ai-insight' | 'budget-alert' | 'opportunity' | 'warning' | 'info';
  message: string;
  linkText?: string;
  onLinkClick?: () => void;
  onActionClick?: () => void;
  className?: string;
}

const notificationConfig = {
  'ai-insight': {
    icon: Sparkles,
    badge: { text: 'AI Insight', variant: 'info' as const },
  },
  'budget-alert': {
    icon: AlertCircle,
    badge: { text: 'Budget Alert', variant: 'warning' as const },
  },
  'opportunity': {
    icon: TrendingUp,
    badge: { text: 'Opportunity', variant: 'success' as const },
  },
  'warning': {
    icon: AlertCircle,
    badge: { text: 'Warning', variant: 'destructive' as const },
  },
  'info': {
    icon: Lightbulb,
    badge: { text: 'Info', variant: 'secondary' as const },
  },
};

export const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
  ({ type, message, linkText, onLinkClick, onActionClick, className }, ref) => {
    const config = notificationConfig[type];
    const Icon = config.icon;

    // Parse message to extract link text if it contains quotes
    const renderMessage = () => {
      if (!linkText) {
        return <span className="text-sm text-foreground flex-1 min-w-0 truncate">{message}</span>;
      }

      // Split message by the linkText to create clickable link
      const parts = message.split(linkText);

      return (
        <p className="text-sm text-foreground flex-1 min-w-0 truncate">
          {parts[0]}
          <button
            onClick={onLinkClick}
            className="text-primary underline underline-offset-4 font-medium hover:text-primary/80 transition-colors"
          >
            {linkText}
          </button>
          {parts[1]}
        </p>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors',
          className
        )}
      >
        <Button
          size="icon"
          variant="ghost"
          className="flex-shrink-0 w-8 h-8"
          onClick={onActionClick}
        >
          <Icon className="w-4 h-4" />
        </Button>
        <Badge
          variant={config.badge.variant}
          className="flex-shrink-0 whitespace-nowrap"
        >
          {config.badge.text}
        </Badge>
        {renderMessage()}
      </div>
    );
  }
);

NotificationItem.displayName = 'NotificationItem';
