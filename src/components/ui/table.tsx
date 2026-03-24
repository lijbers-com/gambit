import * as React from 'react';
import { cn } from '@/lib/utils';
import { MoreHorizontal, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
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
  width?: number;
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
  defaultFixedColumns?: string[];
}

// Unified draggable column item for both fixed and columns sections
function ColumnItem({
  columnKey,
  header,
  checked,
  onCheckedChange,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}: {
  columnKey: string;
  header: React.ReactNode;
  checked: boolean;
  onCheckedChange: () => void;
  onDragStart: (e: React.DragEvent, key: string) => void;
  onDragOver: (e: React.DragEvent, key: string) => void;
  onDrop: (e: React.DragEvent, key: string) => void;
  isDragOver: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, columnKey)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(e, columnKey); }}
      onDrop={(e) => onDrop(e, columnKey)}
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-grab active:cursor-grabbing select-none transition-colors',
        isDragOver ? 'bg-primary/10 border border-primary/30 border-dashed' : 'hover:bg-accent'
      )}
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={-1}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
      <span className="flex-1 truncate cursor-default" onClick={(e) => { e.stopPropagation(); onCheckedChange(); }}>{header}</span>
      <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    </div>
  );
}

export function Table<T>({ columns, data, rowKey, className, rowActions, hideActions, onRowClick, rowClassName, rowSelection, defaultFixedColumns }: TableProps<T>) {
  // Default rowKey function if not provided
  const getRowKey = rowKey || ((row: T, index: number) => {
    if (row && typeof row === 'object' && 'id' in row) {
      return (row as any).id;
    }
    return index;
  });

  // Column visibility state (includes __actions as a virtual column)
  const [visibleColumns, setVisibleColumns] = React.useState(() => [
    ...columns.map((col) => ({ key: col.key, visible: true, hideable: col.hideable !== false })),
    ...(!hideActions ? [{ key: '__actions', visible: true, hideable: true }] : []),
  ]);

  // Fixed columns state - ordered list of fixed column keys (__actions is fixed by default)
  const [fixedColumnKeys, setFixedColumnKeys] = React.useState<string[]>(() => {
    const defaults = defaultFixedColumns || [];
    if (!hideActions && !defaults.includes('__actions')) {
      return ['__actions', ...defaults];
    }
    return defaults;
  });

  // Column order state - tracks the order of non-fixed columns
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() => {
    const keys = columns.filter(c => c.hideable !== false).map(c => c.key);
    if (!hideActions) keys.unshift('__actions');
    // Remove any default fixed columns from the order
    const defaults = defaultFixedColumns || [];
    const fixedDefaults = !hideActions && !defaults.includes('__actions')
      ? ['__actions', ...defaults]
      : defaults;
    return keys.filter(k => !fixedDefaults.includes(k));
  });

  // Drag state
  const [dragSource, setDragSource] = React.useState<{ key: string; section: 'fixed' | 'columns' } | null>(null);
  const [dragOverTarget, setDragOverTarget] = React.useState<string | null>(null);

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
    // If hiding a column, also remove from fixed
    const vc = visibleColumns.find((c) => c.key === key);
    if (vc?.visible) {
      setFixedColumnKeys((keys) => keys.filter((k) => k !== key));
      // Ensure it's in the column order
      setColumnOrder((order) => {
        if (order.includes(key)) return order;
        return [...order, key];
      });
    }
  };

  // Unified drag handlers for both sections
  const handleDragStart = (e: React.DragEvent, key: string, section: 'fixed' | 'columns') => {
    setDragSource({ key, section });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', key);
  };

  const handleDragOver = (_e: React.DragEvent, key: string) => {
    setDragOverTarget(key);
  };

  const handleDropOnFixed = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    const sourceKey = e.dataTransfer.getData('text/plain');
    if (!sourceKey || sourceKey === targetKey) { resetDrag(); return; }

    if (dragSource?.section === 'columns') {
      // Moving from columns to fixed: remove from columnOrder, add to fixed at position
      setColumnOrder((order) => order.filter((k) => k !== sourceKey));
      setFixedColumnKeys((keys) => {
        const newKeys = keys.filter((k) => k !== sourceKey);
        const targetIndex = newKeys.indexOf(targetKey);
        newKeys.splice(targetIndex + 1, 0, sourceKey);
        return newKeys;
      });
      // Ensure visible
      setVisibleColumns((cols) =>
        cols.map((col) => col.key === sourceKey ? { ...col, visible: true } : col)
      );
    } else if (dragSource?.section === 'fixed') {
      // Reorder within fixed
      setFixedColumnKeys((keys) => {
        const newKeys = [...keys];
        const sourceIndex = newKeys.indexOf(sourceKey);
        const targetIndex = newKeys.indexOf(targetKey);
        newKeys.splice(sourceIndex, 1);
        newKeys.splice(targetIndex, 0, sourceKey);
        return newKeys;
      });
    }
    resetDrag();
  };

  const handleDropOnColumns = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    const sourceKey = e.dataTransfer.getData('text/plain');
    if (!sourceKey || sourceKey === targetKey) { resetDrag(); return; }

    if (dragSource?.section === 'fixed') {
      // Moving from fixed to columns: remove from fixed, add to columnOrder at position
      setFixedColumnKeys((keys) => keys.filter((k) => k !== sourceKey));
      setColumnOrder((order) => {
        const newOrder = order.filter((k) => k !== sourceKey);
        const targetIndex = newOrder.indexOf(targetKey);
        newOrder.splice(targetIndex, 0, sourceKey);
        return newOrder;
      });
    } else if (dragSource?.section === 'columns') {
      // Reorder within columns
      setColumnOrder((order) => {
        const newOrder = [...order];
        const sourceIndex = newOrder.indexOf(sourceKey);
        const targetIndex = newOrder.indexOf(targetKey);
        newOrder.splice(sourceIndex, 1);
        newOrder.splice(targetIndex, 0, sourceKey);
        return newOrder;
      });
    }
    resetDrag();
  };

  // Drop on the fixed section header/empty area (append to end of fixed)
  const handleDropOnFixedZone = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceKey = e.dataTransfer.getData('text/plain');
    if (!sourceKey) { resetDrag(); return; }
    // Remove from columns order and add to fixed
    setColumnOrder((order) => order.filter((k) => k !== sourceKey));
    setFixedColumnKeys((keys) => {
      if (keys.includes(sourceKey)) return keys;
      return [...keys, sourceKey];
    });
    setVisibleColumns((cols) =>
      cols.map((col) => col.key === sourceKey ? { ...col, visible: true } : col)
    );
    resetDrag();
  };

  // Drop on the columns section header/empty area (append to end of columns)
  const handleDropOnColumnsZone = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceKey = e.dataTransfer.getData('text/plain');
    if (!sourceKey) { resetDrag(); return; }
    if (dragSource?.section === 'fixed') {
      setFixedColumnKeys((keys) => keys.filter((k) => k !== sourceKey));
      setColumnOrder((order) => {
        if (order.includes(sourceKey)) return order;
        return [...order, sourceKey];
      });
    }
    resetDrag();
  };

  const resetDrag = () => {
    setDragSource(null);
    setDragOverTarget(null);
  };

  const handleDragEnd = () => {
    resetDrag();
  };

  // Row selection logic
  let selectionCol: TableColumn<T> | undefined;
  if (rowSelection) {
    const getKey = rowSelection.getKey || rowKey || ((_: T, index: number) => index);
    const allVisibleKeys = data.map(getKey);
    const allSelected = allVisibleKeys.length > 0 && allVisibleKeys.every(k => rowSelection.selectedKeys.includes(k));
    const someSelected = allVisibleKeys.some(k => rowSelection.selectedKeys.includes(k));

    const getRowKeyFn = (row: T) => {
      const index = data.indexOf(row);
      return getKey(row, index);
    };
    selectionCol = {
      key: '__select',
      header: (
        <Checkbox
          checked={allSelected}
          ref={el => {
            if (el) {
              const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement;
              if (checkbox) checkbox.indeterminate = !allSelected && someSelected;
            }
          }}
          onCheckedChange={checked => {
            if (checked) {
              rowSelection.onChange(Array.from(new Set([...rowSelection.selectedKeys, ...allVisibleKeys])));
            } else {
              rowSelection.onChange(rowSelection.selectedKeys.filter(k => !allVisibleKeys.includes(k)));
            }
          }}
        />
      ),
      render: row => (
        <Checkbox
          checked={rowSelection.selectedKeys.includes(getRowKeyFn(row))}
          onCheckedChange={checked => {
            if (checked) {
              rowSelection.onChange(Array.from(new Set([...rowSelection.selectedKeys, getRowKeyFn(row)])));
            } else {
              rowSelection.onChange(rowSelection.selectedKeys.filter(k => k !== getRowKeyFn(row)));
            }
          }}
        />
      ),
      className: 'text-center',
      hideable: false,
    };
  }

  // Compute visible columns - fixed columns first in fixed order, then columns in columnOrder
  const visibleColumnSet = new Set(
    visibleColumns.filter((vc) => vc.visible).map((vc) => vc.key)
  );

  // Actions column visibility
  const isActionsVisible = !hideActions && visibleColumnSet.has('__actions');
  const isActionsFixed = fixedColumnKeys.includes('__actions');

  // Map of key -> header label for dropdown display
  const allColumnMap: Record<string, React.ReactNode> = {};
  columns.forEach((col) => { allColumnMap[col.key] = col.header; });
  if (!hideActions) allColumnMap['__actions'] = 'Actions';

  // Get fixed columns in their order (excluding __actions which gets special handling)
  const fixedCols = fixedColumnKeys
    .filter((key) => key !== '__actions')
    .map((key) => columns.find((col) => col.key === key))
    .filter((col): col is TableColumn<T> => col !== undefined && visibleColumnSet.has(col.key));

  // Get non-fixed visible columns in columnOrder
  const nonFixedCols = columnOrder
    .filter((key) => key !== '__actions' && visibleColumnSet.has(key) && !fixedColumnKeys.includes(key))
    .map((key) => columns.find((col) => col.key === key))
    .filter((col): col is TableColumn<T> => col !== undefined);

  let visibleCols = [...fixedCols, ...nonFixedCols];
  if (selectionCol) {
    visibleCols = [selectionCol, ...visibleCols];
  }

  // Compute cumulative left offsets for sticky fixed columns
  const COL_DEFAULT_WIDTH = 180;
  const SELECTION_COL_WIDTH = 48;
  const ACTIONS_COL_WIDTH = 50;
  const fixedColLeftOffsets: Record<string, number> = {};

  // Actions column is always first when visible and fixed
  let cumulativeLeft = 0;
  if (isActionsVisible && isActionsFixed) {
    fixedColLeftOffsets['__actions'] = 0;
    cumulativeLeft = ACTIONS_COL_WIDTH;
  }
  if (selectionCol) {
    fixedColLeftOffsets['__select'] = cumulativeLeft;
    cumulativeLeft += SELECTION_COL_WIDTH;
  }
  for (const col of fixedCols) {
    fixedColLeftOffsets[col.key] = cumulativeLeft;
    cumulativeLeft += col.width || COL_DEFAULT_WIDTH;
  }

  // Dropdown keys: fixed section shows fixedColumnKeys in order, columns section shows columnOrder
  const fixedDropdownKeys = fixedColumnKeys;
  const columnsDropdownKeys = columnOrder;

  // Build the column settings dropdown (rendered in the header's last cell)
  const columnSettingsDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-slate-100">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56" onDragOver={(e: React.DragEvent) => e.preventDefault()}>
        {/* Fixed columns section */}
        <div
          className="px-2 py-1 text-xs font-medium text-slate-500"
          onDragOver={(e: React.DragEvent) => { e.preventDefault(); }}
          onDrop={handleDropOnFixedZone}
        >
          Fixed columns
        </div>

        {fixedDropdownKeys.length > 0 ? (
          <div onDragEnd={handleDragEnd}>
            {fixedDropdownKeys.map((key) => (
              <ColumnItem
                key={key}
                columnKey={key}
                header={allColumnMap[key]}
                checked={!!visibleColumns.find((vc) => vc.key === key && vc.visible)}
                onCheckedChange={() => handleToggleColumn(key)}
                onDragStart={(e, k) => handleDragStart(e, k, 'fixed')}
                onDragOver={handleDragOver}
                onDrop={handleDropOnFixed}
                isDragOver={dragOverTarget === key}
              />
            ))}
          </div>
        ) : (
          <div
            className="px-2 py-1.5 pb-3 text-xs text-slate-400"
            onDragOver={(e: React.DragEvent) => { e.preventDefault(); }}
            onDrop={handleDropOnFixedZone}
          >
            Drag columns here to fix them
          </div>
        )}

        {/* Separator */}
        <div className="my-1 h-px bg-slate-200" />

        {/* Columns section */}
        <div
          className="px-2 py-1 text-xs font-medium text-slate-500"
          onDragOver={(e: React.DragEvent) => { e.preventDefault(); }}
          onDrop={handleDropOnColumnsZone}
        >
          Columns
        </div>
        <div onDragEnd={handleDragEnd}>
          {columnsDropdownKeys.map((key) => (
            <ColumnItem
              key={key}
              columnKey={key}
              header={allColumnMap[key]}
              checked={!!visibleColumns.find((vc) => vc.key === key && vc.visible)}
              onCheckedChange={() => handleToggleColumn(key)}
              onDragStart={(e, k) => handleDragStart(e, k, 'columns')}
              onDragOver={handleDragOver}
              onDrop={handleDropOnColumns}
              isDragOver={dragOverTarget === key}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Actions column is always present (header dropdown stays for column settings),
  // but row content is only shown when Actions is checked/visible
  const actionsCol = !hideActions ? [{
    key: '__actions',
    header: columnSettingsDropdown,
    render: (row: T) =>
      isActionsVisible ? (
        rowActions ? (
          rowActions(row)
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-slate-100 focus:outline-none">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      ) : null,
    className: 'w-[50px]',
  }] : [];

  // Actions column goes first, then fixed columns, then non-fixed
  const allCols = [...actionsCol, ...visibleCols];

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

  // Check if column is fixed (left-pinned)
  const isFixedColumn = (key: string) => {
    if (key === '__actions') return isActionsFixed;
    return key === '__select' ? !!selectionCol : fixedColumnKeys.includes(key);
  };

  // Get sticky styles for a column
  const getStickyStyle = (key: string): React.CSSProperties => {
    if (!isFixedColumn(key)) return {};
    return {
      position: 'sticky',
      left: fixedColLeftOffsets[key] ?? 0,
      zIndex: 10,
    };
  };

  const hasFixedColumns = fixedCols.length > 0 || !!selectionCol;

  return (
    <div className={cn('overflow-x-auto bg-white border border-slate-200 rounded-xl', className)}>
      <table className="min-w-full text-[14px] text-slate-700 table-fixed">
        <thead className="bg-slate-50">
          <tr>
            {allCols.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left font-normal text-slate-500 tracking-wide whitespace-nowrap',
                  isFixedColumn(col.key) && 'bg-slate-50',
                  col.className
                )}
                onClick={() => col.key !== '__actions' && (col as TableColumn<T>).sortable && handleSort(col as TableColumn<T>)}
                style={{
                  cursor: col.key !== '__actions' && (col as TableColumn<T>).sortable ? 'pointer' : undefined,
                  ...getStickyStyle(col.key),
                }}
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
                    className={cn(
                      'px-4 py-3 align-middle truncate max-w-[180px]',
                      isFixedColumn(col.key) && 'bg-white',
                      col.className
                    )}
                    style={{
                      maxWidth: col.key === '__select' ? SELECTION_COL_WIDTH : (col as TableColumn<T>).width || COL_DEFAULT_WIDTH,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle',
                      ...getStickyStyle(col.key),
                    }}
                  >
                    <div className="flex items-center w-full overflow-hidden" style={{ minHeight: 60 }}>
                    {col.render ? col.render(row) : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
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
