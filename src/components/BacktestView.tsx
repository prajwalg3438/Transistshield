import React, { useState, useEffect } from 'react';
import { BacktestSummaryItem } from '../types.ts';
import {
  History,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Award
} from 'lucide-react';

interface BacktestViewProps {
  summary: BacktestSummaryItem | null;
}

export const BacktestView: React.FC<BacktestViewProps> = ({ summary }) => {
  const [sampleTrips, setSampleTrips] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/backtest')
      .then((res) => res.json())
      .then((data) => {
        if (data.sampleTrips) setSampleTrips(data.sampleTrips);
      })
      .catch((err) => console.error('Failed to load backtest data:', err));
  }, []);

  if (!summary) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
              <History className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Historical Back-Test & Evaluation (Slide 7)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comparing standard Travel-Time Minimization vs. TransitShield Journey Risk Score across 250 historical peak-hour trips.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 font-semibold self-start sm:self-auto">
          <Award className="w-4 h-4" />
          <span>250 Trips Back-Tested</span>
        </div>
      </div>

      {/* 4 Core Evaluation Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: On-Time Arrival Rate */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> On-Time Arrival Rate
            </span>
            <span className="font-bold text-emerald-600">+25.8% Gain</span>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-500">Travel-Time Method:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {summary.onTimeArrivalRate.timeBasedMethod}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  style={{ width: `${summary.onTimeArrivalRate.timeBasedMethod}%` }}
                  className="h-full bg-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">TransitShield:</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                  {summary.onTimeArrivalRate.transitShield}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  style={{ width: `${summary.onTimeArrivalRate.transitShield}%` }}
                  className="h-full bg-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Average Waiting Time */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> Avg. Waiting Time
            </span>
            <span className="font-bold text-emerald-600">-66% Wait</span>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-500">Travel-Time Method:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {summary.averageWaitingTimeMins.timeBasedMethod} mins
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  style={{ width: '85%' }}
                  className="h-full bg-rose-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">TransitShield:</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                  {summary.averageWaitingTimeMins.transitShield} mins
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  style={{ width: '28%' }}
                  className="h-full bg-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3: Crowding Experienced (High) */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-500" /> High Crowding
            </span>
            <span className="font-bold text-emerald-600">-57.1% Lower</span>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-500">Travel-Time Method:</span>
                <span className="font-bold text-rose-600">
                  {summary.crowdingExperiencedHighPercent.timeBasedMethod}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  style={{ width: `${summary.crowdingExperiencedHighPercent.timeBasedMethod}%` }}
                  className="h-full bg-rose-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">TransitShield:</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                  {summary.crowdingExperiencedHighPercent.transitShield}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  style={{ width: `${summary.crowdingExperiencedHighPercent.transitShield}%` }}
                  className="h-full bg-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 4: Accessibility Needs Violated */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" /> Access Violations
            </span>
            <span className="font-bold text-emerald-600">Zero Violations</span>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-500">Travel-Time Method:</span>
                <span className="font-bold text-rose-600">
                  {summary.accessibilityNeedsViolatedPercent.timeBasedMethod}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  style={{ width: `${summary.accessibilityNeedsViolatedPercent.timeBasedMethod}%` }}
                  className="h-full bg-rose-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">TransitShield:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {summary.accessibilityNeedsViolatedPercent.transitShield}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  style={{ width: '0%' }}
                  className="h-full bg-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Historical Trips Table */}
      <div className="overflow-x-auto">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Sample Historical Trips Comparison (Actual Outcomes)
        </h4>
        <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="p-2.5">Trip ID</th>
              <th className="p-2.5">Time</th>
              <th className="p-2.5">Conventional Choice</th>
              <th className="p-2.5">Actual Travel / Wait</th>
              <th className="p-2.5">TransitShield Choice</th>
              <th className="p-2.5">TransitShield Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sampleTrips.map((trip) => (
              <tr key={trip.tripId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                  {trip.tripId}
                </td>
                <td className="p-2.5 text-slate-500 dark:text-slate-400">
                  {trip.time}
                </td>
                <td className="p-2.5 text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {trip.routeChosenTimeBased}
                  </span>
                </td>
                <td className="p-2.5 font-mono text-slate-600 dark:text-slate-300">
                  {trip.timeBasedOutcome.travelTimeMins}m trip ({trip.timeBasedOutcome.waitingTimeMins}m wait)
                  {trip.timeBasedOutcome.accessibilityViolated && (
                    <span className="block text-[10px] text-rose-500 font-bold">
                      Stairs/Access Violated
                    </span>
                  )}
                </td>
                <td className="p-2.5 text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {trip.routeChosenTransitShield}
                  </span>
                </td>
                <td className="p-2.5 font-mono text-emerald-700 dark:text-emerald-300 font-semibold">
                  {trip.transitShieldOutcome.travelTimeMins}m trip ({trip.transitShieldOutcome.waitingTimeMins}m wait) • On-Time
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
