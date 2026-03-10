import { ReactNode } from 'react';
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

  return (
    <div className={cn('flex bg-slate-50 px-6 pt-6 pb-0 rounded-tl-[24px]', className)}>
      <div className="flex-1">
        <h1
          className="text-3xl font-semibold mb-0"
          data-testid="page-title"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-muted-foreground mt-1 mb-0 text-[14px]"
            data-testid="page-subtitle"
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="self-start pl-6 flex-none">
        <div className="flex items-center gap-2">
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