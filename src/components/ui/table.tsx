import * as React from 'react';
import { cn } from '@/lib/utils';
import { MoreHorizontal, ChevronDown, ChevronUp, GripVertical, Pin, X } from 'lucide-react';
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

// Draggable item component for the fixed columns section
function DraggableColumnItem({
  columnKey,
  header,
  onDragStart,
  onDragOver,
  onDrop,
  onRemove,
  isDragOver
}: {
  columnKey: string;
  header: React.ReactNode;
  onDragStart: (e: React.DragEvent, key: string) => void;
  onDragOver: (e: React.DragEvent, key: string) => void;
  onDrop: (e: React.DragEvent, key: string) => void;
  onRemove: (key: string) => void;
  isDragOver: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, columnKey)}
      onDragOver={(e) => onDragOver(e, columnKey)}
      onDrop={(e) => onDrop(e, columnKey)}
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-grab active:cursor-grabbing select-none transition-colors',
        isDragOver ? 'bg-primary/10 border border-primary/30 border-dashed' : 'hover:bg-accent'
      )}
      role="menuitem"
      tabIndex={-1}
    >
      <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <Pin className="w-3 h-3 text-primary shrink-0" />
      <span className="flex-1 truncate">{header}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(columnKey); }}
        className="p-0.5 rounded hover:bg-slate-200 transition-colors shrink-0"
      >
        <X className="w-3 h-3 text-slate-400" />
      </button>
    </div>
  );
}

// Drop zone for adding columns to fixed section
function FixedColumnsDropZone({
  onDragOver,
  onDrop,
  isDragOver,
  isEmpty
}: {
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragOver: boolean;
  isEmpty: boolean;
}) {
  if (!isEmpty) return null;
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        'mx-2 my-1 py-3 px-3 rounded-md border border-dashed text-xs text-center transition-colors',
        isDragOver
          ? 'border-primary/50 bg-primary/5 text-primary'
          : 'border-slate-300 text-slate-400'
      )}
    >
      Drag columns here to fix them
    </div>
  );
}

// Draggable item in the show columns section
function ShowColumnItem({
  columnKey,
  header,
  checked,
  onCheckedChange,
  onDragStart,
  draggable: isDraggable,
}: {
  columnKey: string;
  header: React.ReactNode;
  checked: boolean;
  onCheckedChange: () => void;
  onDragStart: (e: React.DragEvent, key: string) => void;
  draggable: boolean;
}) {
  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => onDragStart(e, columnKey)}
      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md select-none hover:bg-accent transition-colors"
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={-1}
    >
      {isDraggable && <GripVertical className="w-3.5 h-3.5 text-slate-300 shrink-0 cursor-grab active:cursor-grabbing" />}
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
      <span className="flex-1 truncate cursor-default" onClick={onCheckedChange}>{header}</span>
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

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = React.useState(() =>
    columns.map((col) => ({ key: col.key, visible: true, hideable: col.hideable !== false }))
  );

  // Fixed columns state - ordered list of fixed column keys
  const [fixedColumnKeys, setFixedColumnKeys] = React.useState<string[]>(defaultFixedColumns || []);

  // Drag state
  const [dragSource, setDragSource] = React.useState<{ key: string; section: 'fixed' | 'show' } | null>(null);
  const [dragOverTarget, setDragOverTarget] = React.useState<string | null>(null);
  const [dragOverZone, setDragOverZone] = React.useState(false);

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
    }
  };

  // Fixed column management
  const handleFixColumn = (key: string) => {
    setFixedColumnKeys((keys) => {
      if (keys.includes(key)) return keys;
      return [...keys, key];
    });
    // Ensure column is visible when fixed
    setVisibleColumns((cols) =>
      cols.map((col) => col.key === key ? { ...col, visible: true } : col)
    );
  };

  const handleUnfixColumn = (key: string) => {
    setFixedColumnKeys((keys) => keys.filter((k) => k !== key));
  };

  // Drag handlers for fixed section reordering
  const handleFixedDragStart = (e: React.DragEvent, key: string) => {
    setDragSource({ key, section: 'fixed' });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', key);
  };

  const handleFixedDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget(key);
  };

  const handleFixedDrop = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    const sourceKey = e.dataTransfer.getData('text/plain');

    if (dragSource?.section === 'show') {
      // Dragging from show to fixed - add at position
      handleFixColumn(sourceKey);
      setFixedColumnKeys((keys) => {
        const newKeys = keys.filter((k) => k !== sourceKey);
        const targetIndex = newKeys.indexOf(targetKey);
        newKeys.splice(targetIndex + 1, 0, sourceKey);
        return newKeys;
      });
    } else if (dragSource?.section === 'fixed' && sourceKey !== targetKey) {
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

    setDragSource(null);
    setDragOverTarget(null);
    setDragOverZone(false);
  };

  // Drag handlers for the empty drop zone
  const handleZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverZone(true);
  };

  const handleZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceKey = e.dataTransfer.getData('text/plain');
    handleFixColumn(sourceKey);
    setDragSource(null);
    setDragOverTarget(null);
    setDragOverZone(false);
  };

  // Show columns drag start (for dragging into fixed area)
  const handleShowDragStart = (e: React.DragEvent, key: string) => {
    setDragSource({ key, section: 'show' });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', key);
  };

  const handleDragEnd = () => {
    setDragSource(null);
    setDragOverTarget(null);
    setDragOverZone(false);
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

  // Compute visible columns - fixed columns first, then rest in original order
  const visibleColumnSet = new Set(
    visibleColumns.filter((vc) => vc.visible).map((vc) => vc.key)
  );

  // Get fixed columns in their order
  const fixedCols = fixedColumnKeys
    .map((key) => columns.find((col) => col.key === key))
    .filter((col): col is TableColumn<T> => col !== undefined && visibleColumnSet.has(col.key));

  // Get non-fixed visible columns in original order
  const nonFixedCols = columns.filter(
    (col) => visibleColumnSet.has(col.key) && !fixedColumnKeys.includes(col.key)
  );

  let visibleCols = [...fixedCols, ...nonFixedCols];
  if (selectionCol) {
    visibleCols = [selectionCol, ...visibleCols];
  }

  // Compute cumulative left offsets for sticky fixed columns
  const COL_DEFAULT_WIDTH = 180;
  const SELECTION_COL_WIDTH = 48;
  const fixedColLeftOffsets: Record<string, number> = {};
  let cumulativeLeft = selectionCol ? SELECTION_COL_WIDTH : 0;
  for (const col of fixedCols) {
    fixedColLeftOffsets[col.key] = cumulativeLeft;
    cumulativeLeft += col.width || COL_DEFAULT_WIDTH;
  }
  if (selectionCol) {
    fixedColLeftOffsets['__select'] = 0;
  }

  // Hideabled columns for dropdown (excluding non-hideable)
  const hideableColumns = columns.filter((col) => col.hideable !== false);
  const fixedSet = new Set(fixedColumnKeys);
  const nonFixedHideableColumns = hideableColumns.filter((col) => !fixedSet.has(col.key));

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
              <DropdownMenuContent align="end" className="w-56" onDragOver={(e: React.DragEvent) => e.preventDefault()}>
                {/* Fixed columns section */}
                <div className="px-2 py-1 text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <Pin className="w-3 h-3" />
                  Fixed columns
                </div>

                {fixedColumnKeys.length > 0 ? (
                  <div onDragEnd={handleDragEnd}>
                    {fixedColumnKeys.map((key) => {
                      const col = columns.find((c) => c.key === key);
                      if (!col) return null;
                      return (
                        <DraggableColumnItem
                          key={key}
                          columnKey={key}
                          header={col.header}
                          onDragStart={handleFixedDragStart}
                          onDragOver={handleFixedDragOver}
                          onDrop={handleFixedDrop}
                          onRemove={handleUnfixColumn}
                          isDragOver={dragOverTarget === key}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <FixedColumnsDropZone
                    onDragOver={handleZoneDragOver}
                    onDrop={handleZoneDrop}
                    isDragOver={dragOverZone}
                    isEmpty={fixedColumnKeys.length === 0}
                  />
                )}

                {/* Also show drop zone at the bottom of fixed section when there are items */}
                {fixedColumnKeys.length > 0 && (
                  <div
                    onDragOver={handleZoneDragOver}
                    onDrop={handleZoneDrop}
                    className={cn(
                      'mx-2 my-0.5 py-1 rounded-md border border-dashed text-xs text-center transition-colors',
                      dragOverZone && dragSource?.section === 'show'
                        ? 'border-primary/50 bg-primary/5 text-primary'
                        : 'border-transparent text-transparent',
                      dragSource?.section === 'show' && 'border-slate-200 text-slate-400'
                    )}
                  >
                    + Drop here
                  </div>
                )}

                {/* Separator */}
                <div className="my-1 h-px bg-slate-200" />

                {/* Show columns section */}
                <div className="px-2 py-1 text-xs font-medium text-slate-500">Show columns</div>
                <div onDragEnd={handleDragEnd}>
                  {nonFixedHideableColumns.map((col) => (
                    <ShowColumnItem
                      key={col.key}
                      columnKey={col.key}
                      header={col.header}
                      checked={!!visibleColumns.find((vc) => vc.key === col.key && vc.visible)}
                      onCheckedChange={() => handleToggleColumn(col.key)}
                      onDragStart={handleShowDragStart}
                      draggable={true}
                    />
                  ))}
                </div>
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

  // Check if column is fixed
  const isFixedColumn = (key: string) => {
    return key === '__select' ? !!selectionCol : fixedSet.has(key);
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
