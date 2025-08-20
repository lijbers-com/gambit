import * as React from 'react';
import { cn } from '@/lib/utils';
import { MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from './dropdown-menu';
import { Checkbox } from './checkbox';

export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  hideable?: boolean;
}

export interface TableRowSelection<T> {
  selectedKeys: React.Key[];
  onChange: (selected: React.Key[]) => void;
  getKey?: (row: T) => React.Key;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: (row: T) => React.Key;
  className?: string;
  rowActions?: (row: T) => React.ReactNode;
  hideActions?: boolean;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  rowSelection?: TableRowSelection<T>;
}

export function Table<T>({ columns, data, rowKey, className, rowActions, hideActions, onRowClick, rowClassName, rowSelection }: TableProps<T>) {
  // Default rowKey function if not provided
  const getRowKey = rowKey || ((row: T, index: number) => {
    // Try to use 'id' property if available, otherwise use index
    if (row && typeof row === 'object' && 'id' in row) {
      return (row as any).id;
    }
    return index;
  });
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = React.useState(() =>
    columns.map((col) => ({ key: col.key, visible: true, hideable: col.hideable !== false }))
  );
  // Sorting state
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Handle sorting
  const handleSort = (col: TableColumn<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDirection('asc');
    }
  };

  // Handle column visibility
  const handleToggleColumn = (key: string) => {
    setVisibleColumns((cols) =>
      cols.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // Row selection logic
  let selectionCol: TableColumn<T> | undefined;
  if (rowSelection) {
    const getKey = rowSelection.getKey || rowKey;
    const allVisibleKeys = data.map(getKey);
    const allSelected = allVisibleKeys.length > 0 && allVisibleKeys.every(k => rowSelection.selectedKeys.includes(k));
    const someSelected = allVisibleKeys.some(k => rowSelection.selectedKeys.includes(k));
    selectionCol = {
      key: '__select',
      header: (
        <Checkbox
          checked={allSelected}
          ref={el => {
            if (el) (el as HTMLButtonElement).indeterminate = !allSelected && someSelected;
          }}
          onCheckedChange={checked => {
            if (checked) {
              // Select all
              rowSelection.onChange(Array.from(new Set([...rowSelection.selectedKeys, ...allVisibleKeys])));
            } else {
              // Deselect all
              rowSelection.onChange(rowSelection.selectedKeys.filter(k => !allVisibleKeys.includes(k)));
            }
          }}
        />
      ),
      render: row => (
        <Checkbox
          checked={rowSelection.selectedKeys.includes(getKey(row))}
          onCheckedChange={checked => {
            if (checked) {
              rowSelection.onChange(Array.from(new Set([...rowSelection.selectedKeys, getKey(row)])));
            } else {
              rowSelection.onChange(rowSelection.selectedKeys.filter(k => k !== getKey(row)));
            }
          }}
        />
      ),
      className: 'text-center',
      hideable: false,
    };
  }

  // Compute visible columns
  let visibleCols = columns.filter((col) =>
    visibleColumns.find((vc) => vc.key === col.key && vc.visible)
  );
  if (selectionCol) {
    visibleCols = [selectionCol, ...visibleCols];
  }

  // Add the ellipsis actions column as the last column
  const allCols = hideActions
    ? [...visibleCols]
    : [
        ...visibleCols,
        {
          key: '__actions',
          header: (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-slate-100">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1 text-xs text-slate-500">Show columns</div>
                {columns.filter((col) => col.hideable !== false).map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={!!visibleColumns.find((vc) => vc.key === col.key && vc.visible)}
                    onCheckedChange={() => handleToggleColumn(col.key)}
                  >
                    {col.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ),
          render: (row: T) =>
            rowActions ? (
              rowActions(row)
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-slate-100 focus:outline-none">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          className: 'text-right',
        },
      ];

  // Sort data if needed
  let sortedData = [...data];
  if (sortKey) {
    const col = columns.find((c) => c.key === sortKey);
    if (col) {
      const sortFn = col.sortFn
        ? col.sortFn
        : (a: T, b: T) => {
            const aVal = (a as Record<string, unknown>)[col.key];
            const bVal = (b as Record<string, unknown>)[col.key];
            if (aVal === bVal) return 0;
            if (aVal == null) return -1;
            if (bVal == null) return 1;
            return aVal > bVal ? 1 : -1;
          };
      sortedData.sort((a, b) =>
        sortDirection === 'asc' ? sortFn(a, b) : -sortFn(a, b)
      );
    }
  }

  return (
    <div className={cn('overflow-x-auto bg-white border border-slate-200 rounded-xl', className)}>
      <table className="min-w-full text-[14px] text-slate-700 table-fixed">
        <thead className="bg-slate-50">
          <tr>
            {allCols.map((col, idx) => (
              <th
                key={col.key}
                className={cn('px-4 py-3 text-left font-normal text-slate-500 tracking-wide whitespace-nowrap', col.className)}
                onClick={() => col.key !== '__actions' && (col as TableColumn<T>).sortable && handleSort(col as TableColumn<T>)}
                style={{ cursor: col.key !== '__actions' && (col as TableColumn<T>).sortable ? 'pointer' : undefined }}
              >
                <span className="flex items-center gap-1">
                {col.header}
                  {col.key === sortKey && col.key !== '__actions' && (
                    sortDirection === 'asc' ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={allCols.length} className="text-center py-8 text-slate-400">
                No data available
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => (
              <tr
                key={getRowKey(row, i)}
                className={cn(
                  'bg-white',
                  i !== sortedData.length - 1 && 'border-b border-slate-200',
                  rowClassName ? rowClassName(row) : undefined
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {allCols.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-4 py-3 align-middle truncate max-w-[180px]', col.className)}
                    style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}
                  >
                    <div className="flex items-center w-full overflow-hidden" style={{ minHeight: 60 }}>
                    {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key]}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 