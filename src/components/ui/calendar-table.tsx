import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Eye, MoreHorizontal, Percent, Euro, Store, TvMinimalPlay, Megaphone } from 'lucide-react';
import { Badge } from './badge';
import { FillRateBar, FillRateValue } from './fill-rate-bar';

export interface Booking {
  id: string;
  name: string;
  startWeek: number;
  endWeek: number;
  stores: number;
  color?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

/** A cell can be a single number/string OR a fill-rate breakdown. */
export type CalendarCellValue = number | string | FillRateValue;

const isFillRateValue = (v: CalendarCellValue | null | undefined): v is FillRateValue =>
  typeof v === 'object' && v !== null;

export interface MediaProduct {
  id: string;
  name: string;
  availability: CalendarCellValue[];
  bookings?: Booking[];
  isHighlighted?: boolean[];
}

export interface RetailerEvent {
  week: number;
  name: string;
}

export interface CalendarTableProps {
  mediaProducts: MediaProduct[];
  weeks: number;
  startWeek?: number;
  retailerEvents?: RetailerEvent[];
  showReach?: boolean;
  displayType?: 'reach' | 'fillRate' | 'fillRateBar' | 'revenue' | 'stores' | 'players' | 'bookedCampaigns';
  className?: string;
  onCellClick?: (mediaProduct: MediaProduct, weekNumber: number, value: CalendarCellValue) => void;
  hideGreyCells?: boolean;
  hasRetailProductFilter?: boolean;
}

export const CalendarTable: React.FC<CalendarTableProps> = ({ 
  mediaProducts, 
  weeks = 6, 
  startWeek = 1,
  retailerEvents = [],
  showReach = false,
  displayType = 'reach',
  className,
  onCellClick,
  hideGreyCells = false,
  hasRetailProductFilter = false
}) => {
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
  const [isCommercialCalendarOpen, setIsCommercialCalendarOpen] = React.useState(true);

  const toggleRow = (id: string) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleCommercialCalendar = () => {
    setIsCommercialCalendarOpen(prev => !prev);
  };

  const weekNumbers = Array.from({ length: weeks }, (_, i) => startWeek + i);

  const chartColors = [
    'bg-chart-1 text-white border-chart-1',
    'bg-chart-2 text-white border-chart-2',
    'bg-chart-3 text-white border-chart-3',
    'bg-chart-4 text-white border-chart-4',
    'bg-chart-5 text-white border-chart-5',
  ];

  const getThemeColorStyle = (index: number) => {
    const colorVar = `--chart-${(index % 5) + 1}`;
    return {
      backgroundColor: `hsl(var(${colorVar}))`,
      color: 'white',
      borderColor: `hsl(var(${colorVar}))`,
    };
  };

  // Commercial agenda events pull from the theme's brand shade ramp so
  // each event reads as a distinct step within the same brand color —
  // theme-aware automatically (Gambit → purple, AH → cyan, ADUSA → green,
  // Delhaize → red, Alfa Beta → blue) via --brand-* tokens.
  const eventShades = [
    '--brand-800',
    '--brand-600',
    '--brand-400',
    '--brand-700',
    '--brand-500',
  ];
  const getCommercialAgendaColorStyle = (index: number) => {
    const colorVar = eventShades[index % eventShades.length];
    return {
      backgroundColor: `hsl(var(${colorVar}))`,
      color: 'white',
      borderColor: `hsl(var(${colorVar}))`,
    };
  };

  const hasEventInWeek = (weekNum: number) => {
    return retailerEvents.some(event => event.week === weekNum);
  };

  const renderAvailabilityCell = (value: CalendarCellValue, weekIndex: number, mediaProduct: MediaProduct, isHighlighted?: boolean) => {
    const hasEvent = hasEventInWeek(weekNumbers[weekIndex]);

    // Fill-rate breakdown cell: render the stacked bar + per-segment percentages.
    if (isFillRateValue(value)) {
      const handleCellClick = () => {
        if (onCellClick) onCellClick(mediaProduct, weekNumbers[weekIndex], value);
      };
      return (
        <td
          key={weekIndex}
          className="px-3 py-[11px] align-middle cursor-pointer hover:bg-neutral-50 transition-colors"
          onClick={handleCellClick}
        >
          <FillRateBar value={value} height={10} showLabels />
        </td>
      );
    }

    // Never show empty cells - always display value or dash
    // Removed the null check that returned empty cells

    // Format the display value
    let displayValue: string = '';
    if (value === null || value === undefined) {
      displayValue = '—';
    } else if (typeof value === 'number') {
      // For numbers, add % sign only for fillRate display type
      if (displayType === 'fillRate') {
        displayValue = `${value}%`;
      } else if (displayType === 'revenue') {
        // Format revenue with K/M for thousands/millions
        if (value >= 1000000) {
          displayValue = `€${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
          displayValue = `€${Math.round(value / 1000)}K`;
        } else {
          displayValue = `€${value}`;
        }
      } else if (displayType === 'reach') {
        // Format reach numbers compactly (300K to 3M range)
        if (value >= 1000000) {
          // For millions: show 1 decimal if less than 10M, otherwise round
          const millions = value / 1000000;
          displayValue = millions < 10 ? `${millions.toFixed(1)}M` : `${Math.round(millions)}M`;
        } else if (value >= 100000) {
          // For hundreds of thousands: round to nearest thousand
          displayValue = `${Math.round(value / 1000)}K`;
        } else if (value >= 1000) {
          // For thousands: show with K
          displayValue = `${(value / 1000).toFixed(1)}K`;
        } else {
          displayValue = value.toString();
        }
      } else if (displayType === 'stores') {
        displayValue = value.toString();
      } else if (displayType === 'bookedCampaigns') {
        displayValue = value.toString();
      } else {
        // Default formatting for other numeric values
        if (value >= 1000000) {
          displayValue = `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
          displayValue = `${Math.round(value / 1000)}K`;
        } else {
          displayValue = value.toString();
        }
      }
    } else {
      // For strings, use as-is
      displayValue = value.toString();
    }
    
    // Use neutral colors for all cells - no highlighting
    let colorClass = "text-neutral-700"; // Neutral color for all cells
    let borderColorClass = "border-b-neutral-400";
    let iconColorClass = "text-neutral-400";
    
    // Removed all color logic - keeping neutral colors for all values
    // No more red/green/orange highlighting based on values
    
    const handleCellClick = () => {
      if (onCellClick) {
        onCellClick(mediaProduct, weekNumbers[weekIndex], value);
      }
    };

    // Show reach icon based on showReach prop
    const shouldShowIcon = showReach !== false;

    return (
      <td 
        key={weekIndex} 
        className={cn(
          "px-3 py-[11px] align-middle text-center cursor-pointer hover:bg-neutral-50 transition-colors"
          // Removed thick border and conditional border coloring
        )}
        onClick={handleCellClick}
      >
        <div className="flex items-center justify-center gap-1">
          <span className={cn(
            "text-sm font-semibold",
            colorClass
          )}>
            {displayValue || '—'}
          </span>
          {shouldShowIcon && displayValue && displayValue !== '—' && (() => {
            const IconComponent = displayType === 'reach' ? Eye 
              : displayType === 'fillRate' ? Percent 
              : displayType === 'revenue' ? Euro 
              : displayType === 'stores' ? Store 
              : displayType === 'players' ? TvMinimalPlay 
              : displayType === 'bookedCampaigns' ? Megaphone
              : Eye;
            return <IconComponent className={cn("w-4 h-4 flex-shrink-0", iconColorClass)} />;
          })()}
        </div>
      </td>
    );
  };

  const renderBooking = (booking: Booking, weekNumbers: number[], bookingIndex: number, totalBookings: number) => {
    const startCol = Math.max(0, weekNumbers.indexOf(booking.startWeek));
    const endCol = Math.min(weeks - 1, weekNumbers.indexOf(booking.endWeek));
    const colspan = endCol - startCol + 1;
    
    const cells = [];
    
    // Add empty cells before the booking
    for (let i = 0; i < startCol; i++) {
      cells.push(
        <td key={`empty-${i}`} className={cn(
          "px-4 align-middle",
          bookingIndex === 0 ? "pt-6 pb-0.5" : bookingIndex === totalBookings - 1 ? "pt-0.5 pb-6" : "py-0.5"
        )}>
          <div style={{ minHeight: 32 }} />
        </td>
      );
    }
    
    // Add the booking cell
    if (colspan > 0) {
      cells.push(
        <td 
          key={booking.id} 
          colSpan={colspan}
          className={cn(
            "px-4 align-middle",
            bookingIndex === 0 ? "pt-6 pb-0.5" : bookingIndex === totalBookings - 1 ? "pt-0.5 pb-6" : "py-0.5"
          )}
        >
          <div style={{ minHeight: 32 }} className="flex items-center">
            <Badge 
              variant={booking.variant || "default"}
              className="w-full text-left justify-start truncate max-w-full whitespace-nowrap overflow-hidden"
            >
              {booking.name}
            </Badge>
          </div>
        </td>
      );
    }
    
    // Add empty cells after the booking
    for (let i = endCol + 1; i < weeks; i++) {
      cells.push(
        <td key={`empty-after-${i}`} className={cn(
          "px-4 align-middle",
          bookingIndex === 0 ? "pt-6 pb-0.5" : bookingIndex === totalBookings - 1 ? "pt-0.5 pb-6" : "py-0.5"
        )}>
          <div style={{ minHeight: 32 }} />
        </td>
      );
    }
    
    return cells;
  };

  const zonesColumnWidth = '240px';
  // Wider columns when the cells render FillRateBar — the per-segment
  // percentage labels need room to breathe (a 5% segment at 100px column
  // gives 5px of label space → unreadable overlap).
  const weekColumnWidth = displayType === 'fillRateBar' ? '140px' : '100px';

  return (
    <div className={cn('overflow-x-auto bg-white border border-border rounded-xl', className)}>
      {/* Main Table */}
      <table className="w-full text-sm text-neutral-700" style={{ minWidth: `${240 + (weeks * parseInt(weekColumnWidth))}px`, tableLayout: 'fixed' }}>
        <thead className="bg-neutral-50">
          <tr>
            <th 
              className="px-4 py-[11px] text-left font-medium text-neutral-600 tracking-wide whitespace-nowrap"
              style={{ width: zonesColumnWidth, minWidth: zonesColumnWidth }}
            >
              Zones
            </th>
            {weekNumbers.map(week => (
              <th 
                key={week} 
                className="px-4 py-[11px] text-center font-medium text-neutral-600 tracking-wide whitespace-nowrap"
                style={{ width: weekColumnWidth, minWidth: weekColumnWidth }}
              >
                Week {week}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Commercial Calendar Row */}
          {retailerEvents.length > 0 && (
            <React.Fragment>
              <tr className="bg-white border-b border-border">
                <td className="px-4 py-[11px] align-middle">
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] text-neutral-700 truncate whitespace-nowrap overflow-hidden">Events</span>
                    <button
                      onClick={toggleCommercialCalendar}
                      className="ml-auto p-1 rounded-full hover:bg-neutral-100 focus:outline-none"
                    >
                      {isCommercialCalendarOpen ? (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                      )}
                    </button>
                  </div>
                </td>
                {weekNumbers.map(weekNum => {
                  const eventsInWeek = retailerEvents.filter(event => event.week === weekNum);
                  
                  // Group events by name to get unique events for this week
                  const uniqueEventsInWeek = eventsInWeek.reduce((unique, event) => {
                    if (!unique.find(e => e.name === event.name)) {
                      unique.push(event);
                    }
                    return unique;
                  }, [] as RetailerEvent[]);
                  
                  return (
                    <td key={weekNum} className="px-4 py-[11px] align-middle text-center">
                      <div className="flex items-center justify-center gap-1">
                        {!isCommercialCalendarOpen && uniqueEventsInWeek.map((event, index) => {
                          // Find the event index in the overall event groups to get consistent color
                          const eventGroups = retailerEvents.reduce((groups, e) => {
                            if (!groups[e.name]) {
                              groups[e.name] = [];
                            }
                            groups[e.name].push(e.week);
                            return groups;
                          }, {} as Record<string, number[]>);
                          
                          const eventIndex = Object.keys(eventGroups).findIndex(name => name === event.name);
                          const colorClass = chartColors[eventIndex % chartColors.length];
                          
                          return (
                            <Badge 
                              key={event.name}
                              variant="default"
                              className="w-3 h-3 rounded-full p-0 flex items-center justify-center border-0"
                              style={getCommercialAgendaColorStyle(eventIndex)}
                            >
                              <span className="sr-only">{event.name}</span>
                            </Badge>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
              
              {/* Commercial Calendar Events (when expanded) */}
              {isCommercialCalendarOpen && (() => {
                // Group events by name to handle multi-week events
                const eventGroups = retailerEvents.reduce((groups, event) => {
                  if (!groups[event.name]) {
                    groups[event.name] = [];
                  }
                  groups[event.name].push(event.week);
                  return groups;
                }, {} as Record<string, number[]>);

                return Object.entries(eventGroups).map(([eventName, weeks], index) => {
                  const sortedWeeks = weeks.sort((a, b) => a - b);
                  const startWeek = sortedWeeks[0];
                  const endWeek = sortedWeeks[sortedWeeks.length - 1];
                  const totalEvents = Object.keys(eventGroups).length;
                  
                  return (
                    <tr key={`event-${eventName}`} className={cn(
                      "bg-white",
                      index === totalEvents - 1 && "border-b border-border"
                    )}>
                      <td className={cn(
                        "px-4 align-middle",
                        index === 0 ? "pt-6 pb-0.5" : index === totalEvents - 1 ? "pt-0.5 pb-6" : "py-0.5"
                      )}>
                        <div style={{ minHeight: 32 }} />
                      </td>
                      {(() => {
                        const startCol = Math.max(0, weekNumbers.indexOf(startWeek));
                        const endCol = Math.min(weekNumbers.length - 1, weekNumbers.indexOf(endWeek));
                        const colspan = endCol - startCol + 1;
                        
                        const cells = [];
                        
                        // Add empty cells before the event
                        for (let i = 0; i < startCol; i++) {
                          cells.push(
                            <td key={`empty-${i}`} className={cn(
                              "px-4 align-middle",
                              index === 0 ? "pt-6 pb-0.5" : index === totalEvents - 1 ? "pt-0.5 pb-6" : "py-0.5"
                            )}>
                              <div style={{ minHeight: 32 }} />
                            </td>
                          );
                        }
                        
                        // Add the event cell
                        if (colspan > 0) {
                          cells.push(
                            <td 
                              key={eventName} 
                              colSpan={colspan}
                              className={cn(
                                "px-4 align-middle",
                                index === 0 ? "pt-6 pb-0.5" : index === totalEvents - 1 ? "pt-0.5 pb-6" : "py-0.5"
                              )}
                            >
                              <div style={{ minHeight: 32 }} className="flex items-center justify-center">
                                <Badge 
                                  variant="default"
                                  className="w-full text-left justify-start truncate max-w-full whitespace-nowrap overflow-hidden border-0"
                                  style={getCommercialAgendaColorStyle(index)}
                                >
                                  {eventName}
                                </Badge>
                              </div>
                            </td>
                          );
                        }
                        
                        // Add empty cells after the event
                        for (let i = endCol + 1; i < weekNumbers.length; i++) {
                          cells.push(
                            <td key={`empty-after-${i}`} className={cn(
                              "px-4 align-middle",
                              index === 0 ? "pt-6 pb-0.5" : index === totalEvents - 1 ? "pt-0.5 pb-6" : "py-0.5"
                            )}>
                              <div style={{ minHeight: 32 }} />
                            </td>
                          );
                        }
                        
                        return cells;
                      })()}
                    </tr>
                  );
                });
              })()}
            </React.Fragment>
          )}
          
          {/* Media Products */}
          {mediaProducts.map((product, productIndex) => (
            <React.Fragment key={product.id}>
              <tr className={cn(
                'bg-white',
                productIndex !== mediaProducts.length - 1 && 'border-b border-border'
              )}>
                <td className="px-4 py-[11px] align-middle">
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] text-neutral-700 truncate whitespace-nowrap overflow-hidden">{product.name}</span>
                    <button
                      onClick={() => toggleRow(product.id)}
                      className="ml-auto p-1 rounded-full hover:bg-neutral-100 focus:outline-none"
                    >
                      {expandedRows.includes(product.id) ? (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                      )}
                    </button>
                  </div>
                </td>
                {product.availability.slice(0, weeks).map((value, i) => 
                  renderAvailabilityCell(value, i, product, product.isHighlighted?.[i])
                )}
              </tr>
              
              {/* Expanded bookings */}
              {expandedRows.includes(product.id) && product.bookings && product.bookings.map((booking, bookingIndex) => (
                <tr key={booking.id} className={cn(
                  "bg-white",
                  bookingIndex === 0 && "pt-6", // 24px top padding for first row
                  bookingIndex === product.bookings!.length - 1 && "pb-6 border-b border-border" // 24px bottom padding and border for last row
                )}>
                  <td className={cn(
                    "px-4 align-middle",
                    bookingIndex === 0 ? "pt-6 pb-0.5" : bookingIndex === product.bookings!.length - 1 ? "pt-0.5 pb-6" : "py-0.5"
                  )}>
                    <div style={{ minHeight: 32 }} />
                  </td>
                  {renderBooking(booking, weekNumbers, bookingIndex, product.bookings!.length)}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};