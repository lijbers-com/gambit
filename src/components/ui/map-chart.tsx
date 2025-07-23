"use client"

import * as React from "react"

export interface MapChartProps {
  data: Array<{
    name: string
    plays: number
    x: number
    y: number
  }>
  className?: string
  title?: string
}

export function MapChart({
  data,
  className = "",
  title = "Store Locations"
}: MapChartProps) {
  const getCircleSize = (plays: number) => {
    if (plays >= 5000) return 'w-6 h-6'; // Large
    if (plays >= 2000) return 'w-4 h-4'; // Medium
    return 'w-3 h-3'; // Small
  };
  
  const getCircleColor = (plays: number) => {
    if (plays >= 5000) return 'bg-chart-3'; // High
    if (plays >= 2000) return 'bg-chart-2'; // Medium
    return 'bg-chart-1'; // Low
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="h-80 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg relative overflow-hidden">
        {/* Mock Netherlands Map Background */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 320" className="w-full h-full">
            {/* Simplified Netherlands outline */}
            <path
              d="M80 50 L120 40 L160 45 L200 50 L240 55 L280 60 L320 70 L340 90 L350 120 L340 150 L320 180 L300 200 L280 220 L260 240 L240 250 L220 260 L200 270 L180 275 L160 280 L140 275 L120 270 L100 260 L80 250 L60 230 L50 200 L45 170 L50 140 L55 110 L60 80 L70 60 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        
        {/* Store Location Markers */}
        {data.map((store, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${store.x}%`, top: `${store.y}%` }}
            title={`${store.name}: ${store.plays.toLocaleString()} plays`}
          >
            <div className={`${getCircleSize(store.plays)} ${getCircleColor(store.plays)} rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:scale-110`}>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              <div className="font-medium">{store.name}</div>
              <div>{store.plays.toLocaleString()} plays</div>
            </div>
          </div>
        ))}
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-xs font-medium text-gray-700 mb-2">Play Count</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
              <span className="text-xs text-gray-600">Low (0-2k)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-chart-2 rounded-full"></div>
              <span className="text-xs text-gray-600">Medium (2-5k)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-chart-3 rounded-full"></div>
              <span className="text-xs text-gray-600">High (5k+)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}