import React from 'react';
import { HourlyData } from '../types.ts';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface BusyTimesChartProps {
  data: HourlyData[];
}

export const BusyTimesChart: React.FC<BusyTimesChartProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Busy Times & Seating Availability (%)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Slide 4: Seats taken (%) throughout the day. Morning (8-10) and evening (16-18) peaks help commuters pick a quieter bus before leaving.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Rush Hour Peak (&gt;90%)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Moderate / Calmer (&lt;60%)
          </span>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
        {data.map((item) => {
          const isHighPeak = item.seatsTakenPercent >= 90;
          return (
            <div key={item.timeSlot} className="flex flex-col items-center group">
              {/* Percentage label above bar */}
              <div
                className={`text-xs font-mono font-bold mb-2 transition-transform group-hover:-translate-y-0.5 ${
                  isHighPeak
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.seatsTakenPercent}%
              </div>

              {/* Bar track and fill */}
              <div className="w-full max-w-[36px] h-36 bg-slate-100 dark:bg-slate-800 rounded-xl relative flex items-end p-1 overflow-hidden">
                <div
                  style={{ height: `${item.seatsTakenPercent}%` }}
                  className={`w-full rounded-lg transition-all duration-500 ${
                    isHighPeak
                      ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-sm'
                      : 'bg-gradient-to-t from-emerald-600 to-teal-400'
                  }`}
                />
              </div>

              {/* Time slot label */}
              <div className="mt-2 text-center">
                <span className="block text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {item.timeSlot}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
                  hrs
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actionable Peak Advice Banner */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Optimal Departure Window:
            </span>{' '}
            <span className="text-slate-600 dark:text-slate-300">
              Traveling between <strong>10:00–14:00 (45–50% seats taken)</strong> dramatically reduces risk of standing or having boarding denied compared to 08:00–10:00 (95%).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
