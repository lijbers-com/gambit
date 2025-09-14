import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Eye, MoreHorizontal, Percent, Euro, Store, TvMinimalPlay, Megaphone } from 'lucide-react';
import { Badge } from './badge';

export interface Booking {
  id: string;
  name: string;
  startWeek: number;
  endWeek: number;
  stores: number;
  color?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

export interface MediaProduct {
  id: string;
  name: string;
  availability: (number | string)[];
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
  displayType?: 'reach' | 'fillRate' | 'revenue' | 'stores' | 'players' | 'bookedCampaigns';
  className?: string;
  onCellClick?: (mediaProduct: MediaProduct, weekNumber: number, value: number | string) => void;
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

  // Theme-specific colors for commercial agenda events only
  const getCommercialAgendaColorStyle = (index: number) => {
    // Check current theme by looking at the document data-theme attribute
    const currentTheme = typeof window !== 'undefined' ? 
      document.documentElement.getAttribute('data-theme') || 'retailMedia' : 'retailMedia';
    
    if (currentTheme === 'albertHeijn') {
      // Albert Heijn blue variations for commercial agenda
      const ahColors = [
        'hsl(192, 100%, 45%)', // AH Blue
        'hsl(192, 70%, 35%)',  // Darker AH Blue
        'hsl(192, 85%, 55%)',  // Light AH Blue
        'hsl(192, 60%, 25%)',  // Dark AH Blue
        'hsl(192, 90%, 65%)',  // Very Light AH Blue
      ];
      return {
        backgroundColor: ahColors[index % ahColors.length],
        color: 'white',
        borderColor: ahColors[index % ahColors.length],
      };
    } else {
      // Gambit theme variations for commercial agenda
      const gambitColors = [
        'hsl(210, 20%, 21%)',  // Gambit Primary Dark
        'hsl(210, 15%, 35%)',  // Gambit Secondary
        'hsl(210, 25%, 45%)',  // Gambit Medium
        'hsl(210, 30%, 55%)',  // Gambit Light
        'hsl(210, 35%, 65%)',  // Gambit Very Light
      ];
      return {
        backgroundColor: gambitColors[index % gambitColors.length],
        color: 'white',
        borderColor: gambitColors[index % gambitColors.length],
      };
    }
  };

  const hasEventInWeek = (weekNum: number) => {
    return retailerEvents.some(event => event.week === weekNum);
  };

  const renderAvailabilityCell = (value: number | string, weekIndex: number, mediaProduct: MediaProduct, isHighlighted?: boolean) => {
    const hasEvent = hasEventInWeek(weekNumbers[weekIndex]);
    
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
    let colorClass = "text-slate-700"; // Neutral color for all cells
    let borderColorClass = "border-b-slate-400";
    let iconColorClass = "text-slate-400";
    
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
          "px-3 py-3 align-middle text-center cursor-pointer hover:bg-slate-50 transition-colors"
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
  const weekColumnWidth = '100px'; // Fixed width for week columns

  return (
    <div className={cn('overflow-x-auto bg-white border border-slate-200 rounded-xl', className)}>
      {/* Main Table */}
      <table className="w-full text-sm text-slate-700" style={{ minWidth: `${240 + (weeks * 100)}px`, tableLayout: 'fixed' }}>
        <thead className="bg-slate-50">
          <tr>
            <th 
              className="px-4 py-3 text-left font-medium text-slate-600 tracking-wide whitespace-nowrap"
              style={{ width: zonesColumnWidth, minWidth: zonesColumnWidth }}
            >
              Zones
            </th>
            {weekNumbers.map(week => (
              <th 
                key={week} 
                className="px-4 py-3 text-center font-medium text-slate-600 tracking-wide whitespace-nowrap"
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
              <tr className="bg-white border-b border-slate-200">
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-3" style={{ minHeight: 48 }}>
                    <span className="text-[14px] text-slate-700 truncate whitespace-nowrap overflow-hidden">Events</span>
                    <button
                      onClick={toggleCommercialCalendar}
                      className="ml-auto p-1 rounded-full hover:bg-slate-100 focus:outline-none"
                    >
                      {isCommercialCalendarOpen ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
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
                    <td key={weekNum} className="px-4 py-3 align-middle text-center">
                      <div style={{ minHeight: 48 }} className="flex items-center justify-center gap-1">
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
                      index === totalEvents - 1 && "border-b border-slate-200"
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
                productIndex !== mediaProducts.length - 1 && 'border-b border-slate-200'
              )}>
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-3" style={{ minHeight: 48 }}>
                    <span className="text-[14px] text-slate-700 truncate whitespace-nowrap overflow-hidden">{product.name}</span>
                    <button
                      onClick={() => toggleRow(product.id)}
                      className="ml-auto p-1 rounded-full hover:bg-slate-100 focus:outline-none"
                    >
                      {expandedRows.includes(product.id) ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
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
                  bookingIndex === product.bookings!.length - 1 && "pb-6 border-b border-slate-200" // 24px bottom padding and border for last row
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