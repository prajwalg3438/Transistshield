import React, { useState, useEffect } from 'react';
import {
  RouteItem,
  BusStopItem,
  CommunityReportItem,
  HourlyData,
  BacktestSummaryItem,
  CommuterProfileType
} from './types.ts';
import { SchematicMap } from './components/SchematicMap.tsx';
import { ProfileSelector } from './components/ProfileSelector.tsx';
import { RouteCard } from './components/RouteCard.tsx';
import { QRFeedbackModal } from './components/QRFeedbackModal.tsx';
import { CommunityReportsView } from './components/CommunityReportsView.tsx';
import { BusyTimesChart } from './components/BusyTimesChart.tsx';
import { VoiceAssistant } from './components/VoiceAssistant.tsx';
import { BacktestView } from './components/BacktestView.tsx';
import { SlideDeckView } from './components/SlideDeckView.tsx';

import {
  Shield,
  Navigation,
  QrCode,
  Users,
  History,
  Presentation,
  Volume2,
  AlertTriangle,
  Sun,
  Moon,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'planner' | 'map' | 'reports' | 'busytimes' | 'backtest' | 'slides'
  >('planner');

  // Commuter profile state
  const [profile, setProfile] = useState<CommuterProfileType>('default');
  const [requireStepFree, setRequireStepFree] = useState(false);

  // Data states
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [stops, setStops] = useState<BusStopItem[]>([]);
  const [reports, setReports] = useState<CommunityReportItem[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [backtestSummary, setBacktestSummary] = useState<BacktestSummaryItem | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-335e');
  const [loading, setLoading] = useState(true);

  // QR Modal state
  const [qrModalStop, setQrModalStop] = useState<BusStopItem | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Simulated disruption toggle on Bus 500D
  const [isDisruptionActive, setIsDisruptionActive] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch routes based on profile and step-free constraint
  const fetchRoutes = async () => {
    try {
      const res = await fetch(
        `/api/routes?profile=${profile}&requireStepFree=${requireStepFree || profile === 'wheelchair'}`
      );
      const data = await res.json();
      setRoutes(data.routes || []);
      // If selected route doesn't exist, default to first or safest
      if (!data.routes.find((r: RouteItem) => r.id === selectedRouteId) && data.routes[0]) {
        setSelectedRouteId(data.routes[0].id);
      }
    } catch (err) {
      console.error('Failed to load routes:', err);
    }
  };

  // Fetch all initial data
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRoutes(),
        fetch('/api/stops')
          .then((res) => res.json())
          .then((data) => setStops(data || [])),
        fetch('/api/community-reports')
          .then((res) => res.json())
          .then((data) => setReports(data.reports || [])),
        fetch('/api/busy-times')
          .then((res) => res.json())
          .then((data) => setHourlyData(data.chartData || [])),
        fetch('/api/backtest')
          .then((res) => res.json())
          .then((data) => setBacktestSummary(data.summary || null)),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [profile, requireStepFree]);

  // Handle QR Feedback Submission
  const handleQRFeedbackSubmit = async (data: any) => {
    const res = await fetch('/api/qr-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchRoutes();
      const updatedStops = await fetch('/api/stops').then((r) => r.json());
      setStops(updatedStops);
    }
  };

  // Handle Community Report Submit
  const handleCommunityReportSubmit = async (data: any) => {
    const res = await fetch('/api/community-reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updatedReports = await fetch('/api/community-reports').then((r) => r.json());
      setReports(updatedReports.reports || []);
      await fetchRoutes();
    }
  };

  // Handle Upvote
  const handleUpvoteReport = async (reportId: string) => {
    const res = await fetch(`/api/community-reports/${reportId}/upvote`, {
      method: 'POST',
    });
    if (res.ok) {
      const updatedReports = await fetch('/api/community-reports').then((r) => r.json());
      setReports(updatedReports.reports || []);
    }
  };

  // Toggle Disruption Simulation on Bus 500D
  const handleToggleDisruption = async () => {
    const nextState = !isDisruptionActive;
    setIsDisruptionActive(nextState);
    await fetch('/api/simulate-disruption', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routeId: 'route-500d', enable: nextState }),
    });
    await fetchRoutes();
  };

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0] || null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo & Project Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                    TRANSITSHIELD
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Risk-Engine V1.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Smart and Accessible Public Transportation System • Choose journeys by risk, not just travel time
                </p>
              </div>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Simulate Live Disruption on Bus 500D */}
              <button
                onClick={handleToggleDisruption}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDisruptionActive
                    ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300'
                }`}
                title="Toggle real-time delay & bottleneck on Bus 500D to test alternative route recommendations"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden md:inline">
                  {isDisruptionActive ? 'Simulated Disruption: ON' : 'Normal Operations'}
                </span>
                <span className="md:hidden">
                  {isDisruptionActive ? 'Disruption ON' : 'Normal'}
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Refresh data */}
              <button
                onClick={loadAllData}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                title="Refresh live feeds"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold no-scrollbar">
            {[
              { id: 'planner', label: 'Journey Planner & Risk', icon: Navigation },
              { id: 'map', label: 'Schematic Corridor Map', icon: Shield },
              { id: 'reports', label: `QR & Community (${reports.length})`, icon: QrCode },
              { id: 'busytimes', label: 'Busy Times & Crowding', icon: Users },
              { id: 'backtest', label: 'Back-Test Evaluation (Slide 7)', icon: History },
              { id: 'slides', label: 'Slides & Master Doc (1–7)', icon: Presentation },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: Journey Planner & Risk */}
        {currentTab === 'planner' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Profile Selector */}
            <ProfileSelector
              currentProfile={profile}
              onChangeProfile={(p) => setProfile(p)}
              requireStepFree={requireStepFree}
              onToggleStepFree={(val) => setRequireStepFree(val)}
            />

            {/* Core Insight Callout from Slide 6 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-emerald-950/30 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-indigo-900 dark:text-indigo-200">
                      Slide 6 Spotlight: "Fastest is not always safest"
                    </span>
                    <span className="text-[10px] bg-indigo-200 dark:bg-indigo-900/80 text-indigo-900 dark:text-indigo-200 font-bold px-2 py-0.5 rounded-full">
                      Journey Risk Score Formula
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Standard apps recommend <strong>Bus 500D (35 mins)</strong>, but it scores <strong>52 Risk</strong> due to 14±8m delay uncertainty, 92% crowding, and 28 steep steps.
                    TransitShield recommends <strong>Bus 335E (18 Risk)</strong> for maximum reliability, kneeling step-free access, and plenty of seats!
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setCurrentTab('slides')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold shadow-xs hover:bg-indigo-50 cursor-pointer"
                  >
                    <span>View Slide Deck</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Routes List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <span>Available Routes (Ranked by Risk Score)</span>
                  <span className="text-xs text-slate-500 font-normal">
                    (Lower score is safer)
                  </span>
                </h3>

                <span className="text-xs text-slate-500 font-mono">
                  Origin: Silk Board ➔ Destination: Whitefield
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {routes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    isSelected={selectedRouteId === route.id}
                    onSelect={() => setSelectedRouteId(route.id)}
                    onPlayVoice={(r) => {
                      setSelectedRouteId(r.id);
                    }}
                    isWheelchairProfile={profile === 'wheelchair'}
                  />
                ))}
              </div>
            </div>

            {/* Voice Guidance Assistant for Selected Route */}
            {selectedRoute && (
              <VoiceAssistant selectedRoute={selectedRoute} />
            )}

            {/* Schematic Map Embedded */}
            <SchematicMap
              stops={stops}
              routes={routes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={(id) => setSelectedRouteId(id)}
              onScanStopQR={(stop) => {
                setQrModalStop(stop);
                setIsQrModalOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 2: Schematic Map Standalone */}
        {currentTab === 'map' && (
          <div className="space-y-6 animate-fadeIn">
            <SchematicMap
              stops={stops}
              routes={routes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={(id) => setSelectedRouteId(id)}
              onScanStopQR={(stop) => {
                setQrModalStop(stop);
                setIsQrModalOpen(true);
              }}
            />

            {/* Stops Grid Cards */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">
                All Monitored Stops ({stops.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stops.map((stop) => (
                  <div
                    key={stop.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {stop.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          stop.accessibilityStatus === 'step-free'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : stop.accessibilityStatus === 'barrier'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {stop.accessibilityStatus.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {stop.name}
                    </h4>

                    <div className="text-slate-500 text-[11px]">
                      Known barriers: {stop.knownBarriers.join(', ')}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Lines: {stop.busLines.join(', ')}
                      </span>
                      <button
                        onClick={() => {
                          setQrModalStop(stop);
                          setIsQrModalOpen(true);
                        }}
                        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Scan QR</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QR Feedback & Community Reports */}
        {currentTab === 'reports' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quick Stop QR Selector */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Slide 4: Scan Stop QR Code (No typing, no location)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select any bus stop to simulate the 2-tap QR scan process:
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {stops.map((stop) => (
                  <button
                    key={stop.id}
                    onClick={() => {
                      setQrModalStop(stop);
                      setIsQrModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{stop.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">({stop.code})</span>
                  </button>
                ))}
              </div>
            </div>

            <CommunityReportsView
              reports={reports}
              stops={stops}
              onUpvoteReport={handleUpvoteReport}
              onSubmitNewReport={handleCommunityReportSubmit}
            />
          </div>
        )}

        {/* TAB 4: Busy Times Chart & Crowding */}
        {currentTab === 'busytimes' && (
          <div className="space-y-6 animate-fadeIn">
            <BusyTimesChart data={hourlyData} />

            {/* Crowding Guidance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  How Crowding Forecast Works
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  TransitShield continuously models seat occupancy percentages by aggregating historical time-of-day distributions with live commuter QR submissions.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  If you are traveling with elderly companions or have mobility limitations, selecting a bus with &lt;50% occupancy guarantees dedicated seating and avoids boarding denial at stops.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Peak Hours vs. Slack Windows
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Morning rush (08:00–10:00) reaches <strong>95% occupancy</strong> with long queues and standing room only. Evening commute (16:00–18:00) reaches <strong>92% occupancy</strong>.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Shifting travel by just 30 minutes outside these windows lowers crowding risk by <strong>57%</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Back-Test Evaluation */}
        {currentTab === 'backtest' && (
          <div className="space-y-6 animate-fadeIn">
            <BacktestView summary={backtestSummary} />
          </div>
        )}

        {/* TAB 6: Slides & Master Review Document */}
        {currentTab === 'slides' && (
          <div className="space-y-6 animate-fadeIn">
            <SlideDeckView />
          </div>
        )}
      </main>

      {/* QR Feedback Modal */}
      <QRFeedbackModal
        stop={qrModalStop}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onSubmitFeedback={handleQRFeedbackSubmit}
      />
    </div>
  );
}
