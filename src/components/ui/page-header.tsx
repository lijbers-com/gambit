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
}: PageHeaderProps) => (
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
        {headerRight}
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