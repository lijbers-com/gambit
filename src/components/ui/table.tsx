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

  // Refs and state for measuring actual column widths
  const headerRowRef = React.useRef<HTMLTableRowElement>(null);
  const [measuredWidths, setMeasuredWidths] = React.useState<Record<string, number>>({});

  // Column width constants (fallbacks before measurement)
  const COL_DEFAULT_WIDTH = 180;
  const SELECTION_COL_WIDTH = 48;
  const ACTIONS_COL_WIDTH = 50;

  // Compute cumulative left offsets for sticky fixed columns using measured widths
  const fixedColLeftOffsets: Record<string, number> = {};

  // Build ordered list of fixed column keys as they appear in the table
  let cumulativeLeft = 0;
  // Actions column is always first when visible and fixed
  if (isActionsVisible && isActionsFixed) {
    fixedColLeftOffsets['__actions'] = 0;
    cumulativeLeft = measuredWidths['__actions'] || ACTIONS_COL_WIDTH;
  }
  if (selectionCol) {
    fixedColLeftOffsets['__select'] = cumulativeLeft;
    cumulativeLeft += measuredWidths['__select'] || SELECTION_COL_WIDTH;
  }
  for (const col of fixedCols) {
    fixedColLeftOffsets[col.key] = cumulativeLeft;
    cumulativeLeft += measuredWidths[col.key] || col.width || COL_DEFAULT_WIDTH;
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
  const allColKeys = allCols.map((col) => col.key);

  // Measure header cell widths after render for accurate sticky offsets
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!headerRowRef.current) return;
    const cells = headerRowRef.current.querySelectorAll('th');
    const widths: Record<string, number> = {};
    cells.forEach((cell, index) => {
      if (index < allColKeys.length) {
        widths[allColKeys[index]] = cell.getBoundingClientRect().width;
      }
    });
    // Only update if widths changed to avoid infinite loop
    const changed = allColKeys.some((k) => widths[k] !== measuredWidths[k]);
    if (changed) setMeasuredWidths(widths);
  });

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

  // Determine the last fixed column key for the border
  const lastFixedColKey = (() => {
    const fixedKeys: string[] = [];
    if (isActionsVisible && isActionsFixed) fixedKeys.push('__actions');
    if (selectionCol) fixedKeys.push('__select');
    fixedKeys.push(...fixedCols.map((c) => c.key));
    return fixedKeys.length > 0 ? fixedKeys[fixedKeys.length - 1] : null;
  })();

  // Per-column resize widths
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [resizingColKey, setResizingColKey] = React.useState<string | null>(null);
  const [hoverFixedSeparator, setHoverFixedSeparator] = React.useState(false);
  const resizingRef = React.useRef(false);
  const resizeStartRef = React.useRef<{ key: string; startX: number; startWidth: number }>({ key: '', startX: 0, startWidth: 0 });

  const handleResizeMouseDown = React.useCallback((e: React.MouseEvent, colKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!headerRowRef.current) return;

    resizingRef.current = true;
    setResizingColKey(colKey);
    const colIndex = allColKeys.indexOf(colKey);
    const th = headerRowRef.current.querySelectorAll('th')[colIndex];
    const startWidth = th ? th.getBoundingClientRect().width : 180;
    resizeStartRef.current = { key: colKey, startX: e.clientX, startWidth };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = ev.clientX - resizeStartRef.current.startX;
      const newWidth = Math.max(50, resizeStartRef.current.startWidth + delta);
      setColumnWidths((prev) => ({ ...prev, [resizeStartRef.current.key]: newWidth }));
    };

    const handleMouseUp = () => {
      resizingRef.current = false;
      setResizingColKey(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [allColKeys]);

  // Get sticky styles for a column
  const getStickyStyle = (key: string): React.CSSProperties => {
    if (!isFixedColumn(key)) return {};
    return {
      position: 'sticky',
      left: fixedColLeftOffsets[key] ?? 0,
      zIndex: 10,
    };
  };

  // Get width style for a column (user-resized or default)
  const getColWidthStyle = (key: string): React.CSSProperties => {
    const w = columnWidths[key];
    if (w == null) return {};
    return { width: w, minWidth: w, maxWidth: w };
  };

  const hasFixedColumns = fixedCols.length > 0 || !!selectionCol || isActionsFixed;

  return (
    <div className={cn('overflow-x-auto overflow-y-hidden bg-white border border-slate-200 rounded-xl', className)}>
      <table className="min-w-full text-[14px] text-slate-700 table-fixed">
        <thead className="bg-slate-50">
          <tr ref={headerRowRef}>
            {allCols.map((col) => {
              const isLastFixed = col.key === lastFixedColKey;
              const isResizable = col.key !== '__select';
              const isBeingResized = resizingColKey === col.key;
              return (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left font-normal text-slate-500 tracking-wide whitespace-nowrap bg-slate-50',
                    isLastFixed && (hoverFixedSeparator || isBeingResized ? 'border-r border-slate-400' : 'border-r border-slate-200'),
                    !isLastFixed && isBeingResized && 'border-r border-slate-400',
                    col.className
                  )}
                  onClick={() => col.key !== '__actions' && (col as TableColumn<T>).sortable && handleSort(col as TableColumn<T>)}
                  style={{
                    cursor: col.key !== '__actions' && (col as TableColumn<T>).sortable ? 'pointer' : undefined,
                    position: isFixedColumn(col.key) ? 'sticky' : 'relative',
                    left: isFixedColumn(col.key) ? (fixedColLeftOffsets[col.key] ?? 0) : undefined,
                    zIndex: isFixedColumn(col.key) ? 10 : undefined,
                    overflow: 'visible',
                    ...getColWidthStyle(col.key),
                  }}
                >
                  <span className="flex items-center gap-1 overflow-hidden">
                  {col.header}
                    {col.key === sortKey && col.key !== '__actions' && (
                      sortDirection === 'asc' ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )
                    )}
                  </span>
                  {/* Invisible grab area for resizing the fixed column border */}
                  {isLastFixed && (
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, col.key)}
                      onMouseEnter={() => setHoverFixedSeparator(true)}
                      onMouseLeave={() => setHoverFixedSeparator(false)}
                      className="absolute top-0 right-0 z-20 cursor-col-resize w-[7px]"
                      style={{ height: '100%', transform: 'translateX(50%)' }}
                    />
                  )}
                  {isResizable && !isLastFixed && !isFixedColumn(col.key) && col.key !== '__actions' && (
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, col.key)}
                      className="absolute top-0 right-0 z-20 cursor-col-resize w-[7px] flex justify-center"
                      style={{ height: '100%', transform: 'translateX(50%)' }}
                    >
                      {!isBeingResized && (
                        <div className="w-px h-3 bg-slate-300 self-center rounded-full" />
                      )}
                    </div>
                  )}
                </th>
              );
            })}
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
                {allCols.map((col) => {
                  const isLastFixed = col.key === lastFixedColKey;
                  return (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 align-middle truncate max-w-[180px] bg-white',
                        isLastFixed && (hoverFixedSeparator || resizingColKey === lastFixedColKey ? 'border-r border-slate-400' : 'border-r border-slate-200'),
                        !isLastFixed && resizingColKey === col.key && 'border-r border-slate-400',
                        col.className
                      )}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        verticalAlign: 'middle',
                        ...getStickyStyle(col.key),
                        ...getColWidthStyle(col.key),
                      }}
                    >
                      <div className="flex items-center w-full overflow-hidden" style={{ minHeight: 60 }}>
                      {col.render ? col.render(row) : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
