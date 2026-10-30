import React, { useState } from 'react';
import { BusStopItem, RouteItem } from '../types.ts';
import { ShieldAlert, CheckCircle2, AlertTriangle, XCircle, QrCode, Info, Navigation2 } from 'lucide-react';

interface SchematicMapProps {
  stops: BusStopItem[];
  routes: RouteItem[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  onScanStopQR: (stop: BusStopItem) => void;
}

export const SchematicMap: React.FC<SchematicMapProps> = ({
  stops,
  routes,
  selectedRouteId,
  onSelectRoute,
  onScanStopQR,
}) => {
  const [activeStop, setActiveStop] = useState<BusStopItem | null>(null);

  // Schematic coordinate positioning for the 7 key stops
  const stopPositions: Record<string, { x: number; y: number }> = {
    'stop-1': { x: 80, y: 160 },   // Silk Board
    'stop-2': { x: 230, y: 160 },  // HSR Layout
    'stop-3': { x: 420, y: 240 },  // Bellandur EcoSpace (ORR - Congested)
    'stop-6': { x: 620, y: 240 },  // Kadubeesanahalli (ORR)
    'stop-4': { x: 380, y: 80 },   // Indiranagar Metro (North Hub)
    'stop-5': { x: 540, y: 130 },  // Old Airport Rd Manipal
    'stop-7': { x: 790, y: 160 },  // Whitefield TTMC Terminal
  };

  const getStatusBadge = (status: 'step-free' | 'barrier' | 'blocked') => {
    switch (status) {
      case 'step-free':
        return {
          fill: '#10B981', // Emerald green
          stroke: '#059669',
          label: 'Step-Free',
          icon: CheckCircle2,
          colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
        };
      case 'barrier':
        return {
          fill: '#F59E0B', // Amber
          stroke: '#D97706',
          label: 'Barrier Reported',
          icon: AlertTriangle,
          colorClass: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
        };
      case 'blocked':
        return {
          fill: '#EF4444', // Red
          stroke: '#DC2626',
          label: 'Path Blocked',
          icon: XCircle,
          colorClass: 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <Navigation2 className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Schematic Transit Corridor & Accessibility Map
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time status of stops and routes: Silk Board Junction ➔ Whitefield TTMC
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900"></span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Green: Step-Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200 dark:ring-amber-900"></span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Amber: Barrier</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200 dark:ring-rose-900 animate-pulse"></span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Red: Path Blocked</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative overflow-x-auto bg-slate-50/70 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 p-2">
        <svg
          viewBox="0 0 880 320"
          className="w-full min-w-[760px] h-auto select-none"
          style={{ maxHeight: '380px' }}
        >
          <defs>
            <linearGradient id="gradient500d" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="gradientMetro" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
            <linearGradient id="gradient335e" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Pulsing indicator for active stop */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200/60 dark:text-slate-800/40" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.6" />

          {/* ROUTE 1: Bus 500D (Outer Ring Road - Lower path) */}
          <path
            d="M 80 160 L 230 160 L 420 240 L 620 240 L 790 160"
            fill="none"
            stroke="url(#gradient500d)"
            strokeWidth={selectedRouteId === 'route-500d' ? '7' : '3.5'}
            strokeDasharray={selectedRouteId === 'route-500d' ? 'none' : '4,2'}
            strokeOpacity={selectedRouteId === 'route-500d' ? '1' : '0.4'}
            className="transition-all duration-300 cursor-pointer"
            onClick={() => onSelectRoute('route-500d')}
          />

          {/* ROUTE 2: Metro Purple Line + Feeder (Upper arch) */}
          <path
            d="M 80 160 L 230 160 L 380 80 L 790 160"
            fill="none"
            stroke="url(#gradientMetro)"
            strokeWidth={selectedRouteId === 'route-metro-feeder' ? '7' : '3.5'}
            strokeOpacity={selectedRouteId === 'route-metro-feeder' ? '1' : '0.4'}
            className="transition-all duration-300 cursor-pointer"
            onClick={() => onSelectRoute('route-metro-feeder')}
          />

          {/* ROUTE 3: Bus 335E (Low-floor Old Airport Rd - Middle path) */}
          <path
            d="M 80 160 L 380 80 L 540 130 L 790 160"
            fill="none"
            stroke="url(#gradient335e)"
            strokeWidth={selectedRouteId === 'route-335e' ? '7' : '3.5'}
            strokeOpacity={selectedRouteId === 'route-335e' ? '1' : '0.4'}
            className="transition-all duration-300 cursor-pointer"
            onClick={() => onSelectRoute('route-335e')}
          />

          {/* Route path labels on the canvas */}
          <text x="520" y="260" fill="#f97316" fontSize="11" fontWeight="700" className="font-mono">
            Bus 500D Express (ORR Corridor - 52 Risk)
          </text>
          <text x="360" y="62" fill="#8b5cf6" fontSize="11" fontWeight="700" className="font-mono">
            Metro Purple Line + Feeder (24 Risk)
          </text>
          <text x="510" y="112" fill="#10b981" fontSize="11" fontWeight="700" className="font-mono">
            Bus 335E AC Low-Floor (18 Risk - SAFEST)
          </text>

          {/* Stop Nodes */}
          {stops.map((stop) => {
            const pos = stopPositions[stop.id] || { x: 440, y: 160 };
            const badge = getStatusBadge(stop.accessibilityStatus);
            const isSelected = activeStop?.id === stop.id;

            return (
              <g
                key={stop.id}
                className="cursor-pointer group"
                onClick={() => setActiveStop(stop)}
                transform={`translate(${pos.x}, ${pos.y})`}
              >
                {/* Glow ring on hover/select */}
                {isSelected && (
                  <circle
                    r="22"
                    fill="none"
                    stroke={badge.fill}
                    strokeWidth="3"
                    strokeDasharray="4,2"
                    className="animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                )}

                {/* Outer shadow disk */}
                <circle
                  r="14"
                  fill="#ffffff"
                  stroke={badge.fill}
                  strokeWidth="3"
                  className="dark:fill-slate-900 transition-transform group-hover:scale-110"
                />

                {/* Status Dot */}
                <circle r="7" fill={badge.fill} />

                {/* QR Indicator tiny badge */}
                <circle cx="10" cy="-10" r="4.5" fill="#3b82f6" />
                <text x="10" y="-8" fontSize="6" fill="#fff" textAnchor="middle" fontWeight="bold">
                  QR
                </text>

                {/* Stop Label */}
                <text
                  x="0"
                  y={pos.y > 180 ? 26 : -20}
                  textAnchor="middle"
                  className="text-[11px] font-semibold fill-slate-800 dark:fill-slate-100 transition-colors group-hover:fill-indigo-600 dark:group-hover:fill-indigo-400"
                >
                  {stop.name}
                </text>

                {/* Accessibility Mini Pill */}
                <text
                  x="0"
                  y={pos.y > 180 ? 38 : -31}
                  textAnchor="middle"
                  fontSize="8.5"
                  fill={badge.stroke}
                  fontWeight="600"
                >
                  {stop.code} • {badge.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Route Badge Float */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs shadow-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-slate-500 dark:text-slate-400">Highlighted Route:</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">
            {routes.find((r) => r.id === selectedRouteId)?.routeNumber || 'Bus 335E'}
          </span>
        </div>
      </div>

      {/* Interactive Stop Inspection Drawer */}
      {activeStop && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {activeStop.code}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {activeStop.name}
                </h4>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    getStatusBadge(activeStop.accessibilityStatus).colorClass
                  }`}
                >
                  {getStatusBadge(activeStop.accessibilityStatus).label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Area: {activeStop.area} • Serving Routes: {activeStop.busLines.join(', ')}
              </p>

              {/* Known Barriers List */}
              <div className="mt-2 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Accessibility Barriers & Notes:
                </span>
                <ul className="list-disc list-inside mt-0.5 text-slate-600 dark:text-slate-300 space-y-0.5">
                  {activeStop.knownBarriers.map((barrier, idx) => (
                    <li key={idx}>{barrier}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Action Button for Stop QR */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onScanStopQR(activeStop)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>Simulate QR Feedback</span>
              </button>
              <button
                onClick={() => setActiveStop(null)}
                className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
