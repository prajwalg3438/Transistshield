import React, { useState } from 'react';
import { CommunityReportItem, BusStopItem } from '../types.ts';
import {
  MessageSquarePlus,
  AlertTriangle,
  Clock,
  Users,
  XCircle,
  ThumbsUp,
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';

interface CommunityReportsViewProps {
  reports: CommunityReportItem[];
  stops: BusStopItem[];
  onUpvoteReport: (id: string) => Promise<void>;
  onSubmitNewReport: (report: {
    stopId: string;
    busRoute: string;
    type: 'delay' | 'overcrowding' | 'blocked_path' | 'barrier_broken';
    severity: 'low' | 'medium' | 'high';
    description: string;
  }) => Promise<void>;
}

export const CommunityReportsView: React.FC<CommunityReportsViewProps> = ({
  reports,
  stops,
  onUpvoteReport,
  onSubmitNewReport,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Form State
  const [selectedStopId, setSelectedStopId] = useState(stops[0]?.id || 'stop-1');
  const [busRoute, setBusRoute] = useState('Bus 500D');
  const [reportType, setReportType] = useState<'delay' | 'overcrowding' | 'blocked_path' | 'barrier_broken'>('overcrowding');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('high');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredReports = reports.filter((rep) => {
    if (filterType === 'all') return true;
    return rep.type === filterType;
  });

  const getRemainingMinutes = (expiresAt: number) => {
    const mins = Math.max(1, Math.round((expiresAt - Date.now()) / (60 * 1000)));
    return mins;
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'delay':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'overcrowding':
        return <Users className="w-4 h-4 text-rose-500" />;
      case 'blocked_path':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'barrier_broken':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      await onSubmitNewReport({
        stopId: selectedStopId,
        busRoute,
        type: reportType,
        severity,
        description,
      });
      setDescription('');
      setShowSubmitModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
              <MessageSquarePlus className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Live Community Reporting Feed
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Slide 3 & 4: Commuters report delays, crowding, and blocked paths. Reports dynamically feed the Journey Risk Score and expire in 60 minutes.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Report an Issue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 text-xs">
        {[
          { id: 'all', label: `All Reports (${reports.length})` },
          { id: 'blocked_path', label: 'Blocked Paths & Access' },
          { id: 'overcrowding', label: 'Overcrowding' },
          { id: 'delay', label: 'Delays & Irregularity' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterType === f.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reports Feed */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
            No active reports under this category. Everything is currently running smoothly!
          </div>
        ) : (
          filteredReports.map((rep) => {
            const remainingMins = getRemainingMinutes(rep.expiresAt);
            return (
              <div
                key={rep.id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                    {getReportIcon(rep.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {rep.stopName}
                      </span>
                      {rep.busRoute && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-[10px] font-bold">
                          {rep.busRoute}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        • {rep.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                      {rep.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        Expires in {remainingMins} mins
                      </span>
                      <span>• Verified by {rep.upvotes} riders</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onUpvoteReport(rep.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Confirm ({rep.upvotes})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Submit Community Transit Report
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Your report updates the Journey Risk Score for all commuters and expires in 60 minutes.
            </p>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Bus Stop:
                </label>
                <select
                  value={selectedStopId}
                  onChange={(e) => setSelectedStopId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                >
                  {stops.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.name} ({stop.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Bus Route (Optional):
                  </label>
                  <input
                    type="text"
                    value={busRoute}
                    onChange={(e) => setBusRoute(e.target.value)}
                    placeholder="e.g. Bus 500D, Bus 335E"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Issue Category:
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="overcrowding">Overcrowding (Full Bus)</option>
                    <option value="blocked_path">Blocked Pathway / Construction</option>
                    <option value="delay">Unscheduled Delay / Broken Timetable</option>
                    <option value="barrier_broken">Accessibility Barrier Outage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Describe what you observed:
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Footpath blocked by ditch near entrance; bus arrived with zero empty seats..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Broadcasting...' : 'Publish Report'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
