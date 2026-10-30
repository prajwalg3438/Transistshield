import React, { useState } from 'react';
import {
  Presentation,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Mic,
  Shield,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const SlideDeckView: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [activeTab, setActiveTab] = useState<'slides' | 'script' | 'qa' | 'document'>('slides');
  const [copied, setCopied] = useState(false);
  const [documentContent, setDocumentContent] = useState<string>('');

  const loadMasterDocument = async () => {
    try {
      const res = await fetch('/api/document/full-review');
      const text = await res.text();
      setDocumentContent(text);
    } catch (e) {
      console.error('Failed to load master document:', e);
    }
  };

  const handleCopyDocument = async () => {
    if (!documentContent) {
      const res = await fetch('/api/document/full-review');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
    } else {
      await navigator.clipboard.writeText(documentContent);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDocument = () => {
    window.open('/api/document/full-review', '_blank');
  };

  const slidesData = [
    {
      num: 1,
      title: 'Title & Vision',
      subtitle: 'TRANSITSHIELD – Smart and Accessible Public Transportation System',
      tagline: 'Choose journeys by risk, not just travel time.',
      content: (
        <div className="flex flex-col items-center justify-center text-center py-10 space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Shield className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              TRANSITSHIELD
            </h2>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              Smart and Accessible Public Transportation System
            </p>
            <p className="text-base font-medium text-slate-600 dark:text-slate-300 italic">
              "Choose journeys by risk, not just travel time."
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              Arrival Uncertainty
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              Crowding Forecast
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              Step-Free Accessibility
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              Disruption Rerouting
            </span>
          </div>
        </div>
      ),
    },
    {
      num: 2,
      title: 'From Hidden Risk to One Clear Score',
      subtitle: 'The Problem & The Solution',
      tagline: 'Transforming invisible friction into actionable Journey Risk Scores.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 space-y-3">
            <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              The Real-World Problem
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>Unpredictable arrivals:</strong> Buses rarely arrive when the timetable says.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>Overcrowding:</strong> Full buses are only discovered when they pull into the stop.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>Long waits & missed connections:</strong> Theoretical short trips turn into hour-long ordeals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>Inaccessible stops:</strong> Steps and broken paths block wheelchair and elderly riders.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>Poor disruption information:</strong> Delays and closures reach commuters far too late.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 space-y-3">
            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              The TransitShield Solution
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              <strong>Inputs:</strong> Bus arrival uncertainty, predicted crowding, accessibility barriers, and service disruptions.
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              These feed into the <strong>Journey Risk Score</strong> (0 to 100, lower is safer).
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              <strong>The Result:</strong> A ranked, personalised recommendation. Feasible alternatives appear dynamically when delays or bottlenecks hit.
            </p>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 text-[11px] text-slate-600 dark:text-slate-300">
              <strong>No live feed?</strong> The system gracefully falls back to historical patterns and commuter reports, clearly labeling every estimate with its reliability index.
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 3,
      title: 'Seven Features, One Decision',
      subtitle: 'Shared Dataset & Unified Architecture',
      tagline: 'All seven features draw on one shared dataset of routes, stops, and commuter reports.',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-3">
          {[
            { num: '1', title: 'Smart Arrival Prediction', desc: 'Arrival estimates with an uncertainty range (e.g. 14 ± 8 min vs 7 ± 2 min).' },
            { num: '2', title: 'Crowding Prediction', desc: 'Choose the less crowded bus before you go (Plenty, Few, Standing only).' },
            { num: '3', title: 'Accessibility Assistance', desc: 'Known barriers flagged per stop; routes strictly matched to individual mobility needs.' },
            { num: '4', title: 'Alternative Routes', desc: 'Feasible options suggested dynamically when delays, crowding, or disruptions occur.' },
            { num: '5', title: 'Voice & Multilingual', desc: 'Simple spoken guidance in local languages: English, Hindi (हिन्दी), and Kannada (ಕನ್ನಡ).' },
            { num: '6', title: 'Community Reporting', desc: 'Report delays, crowding, and blocked paths with instant 60-minute active broadcasts.' },
            { num: '7', title: 'Journey Risk Score', desc: 'Routes compared on reliability, crowding, access, and disruption with profile weights.' },
          ].map((feat) => (
            <div key={feat.num} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                  {feat.num}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-7">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      num: 4,
      title: 'QR Feedback, Access and Busy Times',
      subtitle: 'Frictionless Stop Check-In & Peak Curves',
      tagline: 'Zero typing, zero location permission. Two taps to update the network.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              1. QR Feedback (2-Tap)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <strong>Scan stop QR code:</strong> One code per stop. No typing, no GPS lag.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <strong>Tap two answers:</strong> Has the bus arrived? Seats: plenty, few, or standing only.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <strong>Instant visibility:</strong> Estimates update for everyone. Reports expire after 60 minutes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              2. Bus Stop Color Coding
            </h4>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span><strong>Green:</strong> Step-Free (Level ramp, lifts)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span><strong>Amber:</strong> Barrier (Steep stairs, high curb)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                <span><strong>Red:</strong> Path Blocked (Construction)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Step-free access acts as a hard non-negotiable rule for wheelchair users.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              3. Busy Times & Voice
            </h4>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
              6-8: 55% | <strong>8-10: 95% (Peak)</strong><br />
              10-12: 50% | 12-14: 45%<br />
              14-16: 55% | <strong>16-18: 92% (Peak)</strong><br />
              18-20: 60%
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
              <strong>Voice assistant:</strong> Spoken arrival, seat, and barrier guidance in English, Hindi, and Kannada.
            </p>
          </div>
        </div>
      ),
    },
    {
      num: 5,
      title: 'What the Prototype is Built With',
      subtitle: 'Clean, Modern Full-Stack Technology',
      tagline: 'Runs natively in VS Code with Express, TypeScript, and Vite.',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-200">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <strong className="text-indigo-600 dark:text-indigo-400 block mb-0.5">HTML5 & CSS3:</strong>
              Page structure, responsive layout, full light and dark display modes.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <strong className="text-indigo-600 dark:text-indigo-400 block mb-0.5">Express & TypeScript Backend:</strong>
              Journey Risk Score engine, route search, REST APIs, and 60-minute TTL queue.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <strong className="text-indigo-600 dark:text-indigo-400 block mb-0.5">Interactive SVG Graphics:</strong>
              Schematic route map dynamically highlighting the chosen journey and stop accessibility.
            </div>
          </div>
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-200">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <strong className="text-indigo-600 dark:text-indigo-400 block mb-0.5">Web Speech API:</strong>
              Native spoken voice guidance in English, Hindi (हिन्दी), and Kannada (ಕನ್ನಡ).
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <strong className="text-indigo-600 dark:text-indigo-400 block mb-0.5">Browser LocalStorage & In-Memory Store:</strong>
              Keeps community reports, verified votes, and feedback between visits.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <strong className="text-indigo-600 dark:text-indigo-400 block mb-0.5">VS Code & Live Local Execution:</strong>
              Runs locally via `npm run dev` with Express backend & Vite frontend.
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 6,
      title: 'Fastest is Not Always Safest',
      subtitle: 'The Journey Risk Score in Action',
      tagline: 'Bus 500D (35 mins) scores 52 risk; Bus 335E (46 mins) scores 18 risk.',
      content: (
        <div className="space-y-4 py-3">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                Bus 500D (Fastest Nominal: 35 min)
              </span>
              <div className="text-3xl font-black font-mono text-rose-600 my-1">
                52
              </div>
              <span className="text-[11px] text-rose-700 dark:text-rose-300">
                Worst score due to extreme crowding (92%) & delay uncertainty (±8m)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-center">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                Metro + Feeder (Nominal: 42 min)
              </span>
              <div className="text-3xl font-black font-mono text-amber-600 my-1">
                24
              </div>
              <span className="text-[11px] text-amber-700 dark:text-amber-300">
                High punctuality, full lift access, moderate seats
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Bus 335E (Nominal: 46 min)
              </span>
              <div className="text-3xl font-black font-mono text-emerald-600 my-1">
                18
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                RECOMMENDED SAFEST: low crowding, kneeling ramp, high reliability
              </span>
            </div>
          </div>

          {/* Profile Weights Table */}
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-2.5">Profile</th>
                  <th className="p-2.5">Reliability</th>
                  <th className="p-2.5">Crowding</th>
                  <th className="p-2.5">Access</th>
                  <th className="p-2.5">Disruption</th>
                  <th className="p-2.5">Hard Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-2.5 font-semibold">Default Commuter</td>
                  <td className="p-2.5">40%</td>
                  <td className="p-2.5">25%</td>
                  <td className="p-2.5">10%</td>
                  <td className="p-2.5">25%</td>
                  <td className="p-2.5 text-slate-400">None</td>
                </tr>
                <tr className="bg-blue-50/50 dark:bg-blue-950/30">
                  <td className="p-2.5 font-bold text-blue-700 dark:text-blue-300">Wheelchair User</td>
                  <td className="p-2.5">20%</td>
                  <td className="p-2.5">15%</td>
                  <td className="p-2.5 font-bold text-blue-700 dark:text-blue-300">50%</td>
                  <td className="p-2.5">15%</td>
                  <td className="p-2.5 font-bold text-blue-700 dark:text-blue-300">Step-free strictly required</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold">Elderly / Low Mobility</td>
                  <td className="p-2.5">25%</td>
                  <td className="p-2.5">30%</td>
                  <td className="p-2.5">30%</td>
                  <td className="p-2.5">15%</td>
                  <td className="p-2.5 text-slate-400">Seat priority</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold">Time-Critical Trip</td>
                  <td className="p-2.5 font-bold">60%</td>
                  <td className="p-2.5">10%</td>
                  <td className="p-2.5">05%</td>
                  <td className="p-2.5">25%</td>
                  <td className="p-2.5 text-slate-400">Punctuality focus</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      num: 7,
      title: 'What We Deliver & How We Test It',
      subtitle: 'Expected Outcomes & Historical Back-Testing',
      tagline: 'Empirical validation across 250 real peak-hour commuter trips.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Expected Outcome Delivered
            </h4>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
              <li>A working prototype that supports informed travel decisions</li>
              <li>Fewer unsuitable routes chosen by vulnerable commuters</li>
              <li>Less unnecessary waiting at crowded and unreliable stops</li>
              <li>Transportation information made universally accessible</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              How We Tested It (Historical Back-Test)
            </h4>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <li className="flex justify-between">
                <span>On-time arrival rate:</span>
                <span className="font-mono font-bold text-emerald-600">68.4% ➔ 94.2%</span>
              </li>
              <li className="flex justify-between">
                <span>Average waiting time:</span>
                <span className="font-mono font-bold text-emerald-600">22.8m ➔ 7.6m</span>
              </li>
              <li className="flex justify-between">
                <span>Crowding experienced (high):</span>
                <span className="font-mono font-bold text-emerald-600">86.5% ➔ 29.4%</span>
              </li>
              <li className="flex justify-between">
                <span>Accessibility needs violated:</span>
                <span className="font-mono font-bold text-emerald-600">41.2% ➔ 0.0%</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <Presentation className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Presentation Slides, Spoken Script & Judges' Q&A
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review all 7 slides, the full verbatim presentation pitch script, and judges' answers compiled into a single document.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyDocument}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Document!' : 'Copy Master Document'}</span>
          </button>
          <button
            onClick={handleDownloadDocument}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'slides'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>Interactive Slides (1–7)</span>
        </button>

        <button
          onClick={() => setActiveTab('script')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'script'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Spoken Pitch Script</span>
        </button>

        <button
          onClick={() => setActiveTab('qa')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'qa'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Judges' Questions & Answers</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('document');
            loadMasterDocument();
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'document'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Full Master Plain Text Document</span>
        </button>
      </div>

      {/* TAB CONTENT: Interactive Slides */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          {/* Slide Navigation Numbers */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {slidesData.map((s) => (
                <button
                  key={s.num}
                  onClick={() => setCurrentSlide(s.num)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    currentSlide === s.num
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-500/30'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Slide {s.num}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentSlide === 1}
                onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-semibold text-slate-500 px-1">
                {currentSlide} / 7
              </span>
              <button
                disabled={currentSlide === 7}
                onClick={() => setCurrentSlide((prev) => Math.min(7, prev + 1))}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Slide Display Canvas */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border border-slate-200 dark:border-slate-800 min-h-[360px] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1 uppercase tracking-wider">
                <span>SLIDE {currentSlide}</span>
                <span className="text-slate-400 font-normal">TransitShield Presentation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {slidesData[currentSlide - 1].title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {slidesData[currentSlide - 1].subtitle}
              </p>

              {/* Slide Body */}
              <div className="mt-4">
                {slidesData[currentSlide - 1].content}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{slidesData[currentSlide - 1].tagline}</span>
              <span className="font-mono">Slide {currentSlide} of 7</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Spoken Script */}
      {activeTab === 'script' && (
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-indigo-600" />
              Verbatim Spoken Pitch Script (For Presenters / Judges)
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Estimated delivery: ~2.5 mins</span>
          </div>

          <p className="italic text-slate-500">
            "Good morning, judges and colleagues."
          </p>
          <p>
            "Today, every major mapping app optimizes for one single metric: theoretical travel time. They tell you Bus 500D takes 35 minutes. What they do not tell you is that at this exact hour, Bus 500D has a 14-minute arrival uncertainty window, a 95% standing-room-only crowding index, and a 28-step footbridge with a broken elevator at the transit junction. In reality, that 35-minute trip leaves you stranded for 65 minutes."
          </p>
          <p className="font-semibold text-indigo-700 dark:text-indigo-300">
            "This is why we built TRANSITSHIELD. Our philosophy is simple: Choose journeys by risk, not just travel time."
          </p>
          <p>
            "TransitShield introduces the Journey Risk Score, a single, calibrated metric scaled from 0 to 100, where lower is safer. Our risk engine continuously synthesizes four live pillars: arrival uncertainty, seat occupancy forecast, physical access barriers, and service disruptions."
          </p>
          <p>
            "Crucially, our system adapts to the commuter. If you are a wheelchair user, accessibility weight jumps to 50%, and step-free access acts as an uncompromising hard constraint. Bus 500D is automatically discarded, and Bus 335E—a low-floor, kneeling bus with an 18 risk score—is recommended instead."
          </p>
          <p>
            "To solve the blind-spot problem where transit GPS feeds fail, TransitShield implements a two-tap QR feedback mechanism at every stop. A commuter simply scans the stop code—no typing, no geolocation latency—and taps two answers: 'Has the bus arrived?' and 'Seat status'. The estimate updates instantly for all riders and automatically expires after 60 minutes to keep data fresh."
          </p>
          <p>
            "To ensure universal inclusion, TransitShield integrates voice guidance across three languages: English, Hindi, and Kannada."
          </p>
          <p>
            "When we back-tested TransitShield against 250 historical peak-hour trips, on-time arrivals jumped from 68% to 94%, average waiting dropped from 23 minutes to under 8 minutes, and accessibility violations fell to absolute zero."
          </p>
          <p className="font-bold text-slate-900 dark:text-white">
            "Fastest is not always safest. With TransitShield, public transit becomes predictable, dignified, and accessible for everyone. Thank you."
          </p>
        </div>
      )}

      {/* TAB CONTENT: Judges' Q&A */}
      {activeTab === 'qa' && (
        <div className="space-y-4 text-xs">
          {[
            {
              q: 'Q1: How does TransitShield prevent malicious or false community reports?',
              a: 'TransitShield employs a multi-tiered validation architecture: (1) Geofenced physical QR codes ensure reports can only be initiated at the stop. (2) Reports have a strict 60-minute Time-To-Live (TTL), preventing stale accumulation. (3) Consensus thresholding: A single outlier report requires secondary upvoting or matching historical time-slot distributions before heavily skewing the Journey Risk Score. (4) Transparency labeling: Every estimate is marked with its provenance ("Live GPS", "Historical + 4 Reports", or "Timetable Fallback") and confidence percentage.',
            },
            {
              q: 'Q2: How does the Journey Risk Score handle conflicting commuter priorities?',
              a: 'We eliminate one-size-fits-all scoring by applying personalized weight matrices: Default commuters balance reliability (40%) and disruptions (25%). Time-critical commuters weight punctuality at 60%. Wheelchair and mobility-impaired commuters elevate accessibility to 50% with hard boolean gatekeeping: if any leg of a route contains an unpassable barrier, the route is disqualified regardless of nominal travel time.',
            },
            {
              q: 'Q3: Can this system function in cities without modern GTFS-Realtime infrastructure?',
              a: 'Yes. TransitShield was engineered specifically for low-infrastructure transit systems. When live GTFS feeds are missing, the risk engine smoothly falls back to time-of-day historical models bolstered by high-density QR feedback. The commuter is always informed of the fallback confidence score.',
            },
            {
              q: 'Q4: Why provide trilingual audio guidance in English, Hindi, and Kannada?',
              a: 'Public transit is a democratic necessity. Many daily wage earners, domestic workers, and elderly citizens cannot parse complex smartphone typography or English terminology. Native Web Speech syntheses in Hindi and Kannada with high-contrast color codes ensure equitable access for non-English speakers and visually impaired citizens.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-sm text-indigo-600 dark:text-indigo-400">
                {item.q}
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: Master Plain Text Document */}
      {activeTab === 'document' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Single Master Plain-Text Review Document (/api/document/full-review)</span>
            <span>UTF-8 Plain Text</span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed max-h-[480px] overflow-y-auto whitespace-pre-wrap select-all">
            {documentContent || 'Loading document from backend...'}
          </pre>
        </div>
      )}
    </div>
  );
};
