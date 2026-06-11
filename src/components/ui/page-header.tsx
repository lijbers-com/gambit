import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Download, Upload, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdvertiserSelect, AdvertiserSelectProps } from '@/components/ui/advertiser-select';
import { AttributionWindowSelect, AttributionWindowSelectProps } from '@/components/ui/attribution-window-select';
import { DateRangePicker, DateRangePickerProps } from '@/components/ui/date-picker';

export type PageHeaderVariant = 'default' | 'campaign-detail';

export type PageHeaderProps = {
  className?: string;
  title: ReactNode;
  /** Optional icon rendered immediately to the left of the title. Used on
   * per-proposition templates (campaign overview, bookings overview,
   * booking detail, creative detail, etc.) so the title can drop the
   * proposition name and rely on the icon as the visual cue. */
  titleIcon?: ReactNode;
  subtitle?: ReactNode;
  headerRight?: ReactNode;
  showOptionsMenu?: boolean;
  onEdit?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onSettings?: () => void;
  /** Use 'campaign-detail' variant to show Advertiser, Attribution Window and Date Range dropdowns */
  variant?: PageHeaderVariant;
  /** Props for the Advertiser dropdown (campaign-detail variant) */
  advertiserProps?: AdvertiserSelectProps;
  /** Props for the Attribution Window dropdown (campaign-detail variant) */
  attributionWindowProps?: AttributionWindowSelectProps;
  /** Props for the DateRangePicker (campaign-detail variant) */
  dateRangeProps?: DateRangePickerProps;
};

export const PageHeader = ({
  className,
  title,
  titleIcon,
  subtitle,
  headerRight,
  showOptionsMenu = true,
  onEdit,
  onExport,
  onImport,
  onSettings,
  variant = 'default',
  advertiserProps,
  attributionWindowProps,
  dateRangeProps,
}: PageHeaderProps) => {
  const renderHeaderRight = () => {
    if (variant === 'campaign-detail') {
      return (
        <>
          {advertiserProps && <AdvertiserSelect {...advertiserProps} />}
          {attributionWindowProps && <AttributionWindowSelect {...attributionWindowProps} />}
          {dateRangeProps && <DateRangePicker {...dateRangeProps} className={cn("w-[220px]", dateRangeProps.className)} />}
          {headerRight}
        </>
      );
    }
    return headerRight;
  };

  // Responsive collapse: when the header itself can't fit both the title
  // and the full-width action buttons side-by-side, switch the right-hand
  // controls (advertiser dropdown, attribution window, date range picker,
  // any custom headerRight) into icon-only mode. The 760 px threshold is
  // tuned so a 300 px minimum-width title still leaves ~460 px for the
  // actions, which is the smallest comfortable layout for the 3 default
  // dropdowns + the More options button.
  const headerRef = useRef<HTMLDivElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? el.clientWidth;
      setIsNarrow(w < 760);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // When narrow, hide the label span + chevron inside every action
  // button and tighten padding so each one shrinks to icon-only. The
  // arbitrary `[&_...]` selectors only touch the dropdowns/buttons that
  // live in the right-hand cluster; the title and More-options button
  // are untouched.
  const compactButtonClasses = cn(
    isNarrow && [
      // Hide every non-icon label and the trailing chevron…
      '[&_button>span]:hidden',
      '[&_button_span.truncate]:hidden',
      '[&_button>svg.lucide-chevron-down]:hidden',
      // …shrink the button into a square so the icon centres…
      '[&_button]:!px-2',
      '[&_button]:!w-9',
      '[&_button]:!justify-center',
      // …and strip the icon's own right-margin (Calendar etc. ship with
      // mr-2 for the label spacing — without this the icon sits off-centre
      // in icon-only mode).
      '[&_button>svg]:!mr-0',
    ],
  );

  return (
    <div ref={headerRef} className={cn('flex px-6 pt-6 pb-0', className)}>
      <div className="flex-1 min-w-[300px]">
        <h1
          className="text-3xl font-semibold mb-0 flex items-center gap-3"
          data-testid="page-title"
        >
          {titleIcon && (
            <span className="shrink-0 inline-flex items-center">
              {titleIcon}
            </span>
          )}
          <span className="min-w-0">{title}</span>
        </h1>
        {subtitle && (
          <p
            // Single-line, truncate with ellipsis so the page header
            // stays a constant height regardless of subtitle length.
            // Prevents the content area from shifting vertically when
            // the side nav collapses/expands and changes the title
            // column width.
            className="text-muted-foreground mt-1 mb-0 text-xs truncate"
            data-testid="page-subtitle"
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="self-start pl-6 flex-none">
        <div className={cn('flex items-center gap-2', compactButtonClasses)}>
          {renderHeaderRight()}
          {showOptionsMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" aria-label="More options">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom" avoidCollisions={true} collisionPadding={8}>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}; 