import React, { useState } from 'react';
import { RouteItem } from '../types.ts';
import {
  Clock,
  Users,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Volume2,
  ChevronDown,
  ChevronUp,
  Radio,
  Ban,
  Sparkles
} from 'lucide-react';

interface RouteCardProps {
  route: RouteItem;
  isSelected: boolean;
  onSelect: () => void;
  onPlayVoice: (route: RouteItem) => void;
  isWheelchairProfile: boolean;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isSelected,
  onSelect,
  onPlayVoice,
  isWheelchairProfile,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const isViolated = route.riskBreakdown.isHardConstraintViolated;
  const isSafest = route.riskScore <= 20;

  // Semantic color for Risk Score
  const getRiskScoreTheme = (score: number) => {
    if (isViolated) {
      return {
        badgeBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900',
        textColor: 'text-rose-700 dark:text-rose-300',
        label: 'Hard Disqualification',
      };
    }
    if (score <= 25) {
      return {
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
        textColor: 'text-emerald-700 dark:text-emerald-300',
        label: 'Recommended Safe',
      };
    }
    if (score <= 45) {
      return {
        badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
        textColor: 'text-amber-700 dark:text-amber-300',
        label: 'Moderate Risk',
      };
    }
    return {
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900',
      textColor: 'text-rose-700 dark:text-rose-300',
      label: 'High Journey Risk',
    };
  };

  const scoreTheme = getRiskScoreTheme(route.riskScore);

  const getSeatingLabel = (likelihood: 'plenty' | 'few' | 'standing_only') => {
    switch (likelihood) {
      case 'plenty':
        return { text: 'Plenty of Seats', colorClass: 'text-emerald-600 dark:text-emerald-400 font-semibold' };
      case 'few':
        return { text: 'Few Seats Left', colorClass: 'text-amber-600 dark:text-amber-400 font-semibold' };
      case 'standing_only':
        return { text: 'Standing Room Only', colorClass: 'text-rose-600 dark:text-rose-400 font-bold' };
    }
  };

  const seating = getSeatingLabel(route.seatsLikelihood);

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-2xl border transition-all cursor-pointer ${
        isSelected
          ? 'border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-900 shadow-md ring-1 ring-indigo-500'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      } ${isViolated ? 'bg-rose-50/15 dark:bg-rose-950/10' : ''}`}
    >
      <div className="p-5">
        {/* Top Header: Route Title & Journey Risk Score Display */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                {route.routeNumber}
              </h4>

              {/* Clean unboxed metadata with dot separators */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span aria-hidden="true">·</span>
                <span className="font-mono">{route.nominalTravelTimeMins} mins nominal</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{route.mode.replace('_', ' ')}</span>
              </div>

              {route.id === 'route-500d' && (
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  (Fastest travel time, but highest risk!)
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              {route.routeName}
            </p>

            {/* Subtle banner if recommended safest */}
            {isSafest && !isViolated && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recommended Safest Journey (Lowest Risk)</span>
              </div>
            )}

            {route.isRecommendedAlternative && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 pt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feasible Alternative Reroute Active</span>
              </div>
            )}
          </div>

          {/* Right: Journey Risk Score */}
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Journey Risk Score
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {scoreTheme.label}
              </div>
            </div>

            <div
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 shadow-2xs ${scoreTheme.badgeBg}`}
            >
              {isViolated ? (
                <Ban className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              ) : null}
              <span className={`text-3xl font-black font-mono tabular-nums ${scoreTheme.textColor}`}>
                {route.riskScore}
              </span>
            </div>
          </div>
        </div>

        {/* Hard Constraint Alert for Wheelchair Profile */}
        {isViolated && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Step-Free Hard Rule Disqualification: </strong>
              <span>{route.riskBreakdown.violationReason || 'This route violates mandatory step-free access requirements.'}</span>
            </div>
          </div>
        )}

        {/* 4 Pillars Breakdown Grid (Clean Unboxed Layout) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Pillar 1: Smart Arrival Prediction */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Smart Arrival</span>
            </div>
            <div className="font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums">
              {route.arrivalEstimateMins} ± {route.uncertaintyRangeMins}m
            </div>
            <div className="text-[11px] text-slate-500 truncate" title={route.dataSourceLabel}>
              {route.dataSourceLabel} ({route.reliabilityConfidencePercent}% conf.)
            </div>
          </div>

          {/* Pillar 2: Crowding Prediction */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>Crowding Forecast</span>
            </div>
            <div className={`text-sm ${seating.colorClass}`}>
              {seating.text}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {route.predictedOccupancyPercent}% estimated occupancy
            </div>
          </div>

          {/* Pillar 3: Accessibility */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Accessibility</span>
            </div>
            <div className={`text-sm font-semibold ${
              route.hasStepFreeAccess
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}>
              {route.hasStepFreeAccess ? 'Step-Free Access' : 'Barriers Reported'}
            </div>
            <div className="text-[11px] text-slate-500 truncate" title={route.accessibilityNotes}>
              {route.stopsWithBarriers.length > 0
                ? `${route.stopsWithBarriers.length} barrier stops along corridor`
                : 'Elevator & boarding ramps verified'}
            </div>
          </div>

          {/* Pillar 4: Disruption Status */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-indigo-500" />
              <span>Disruption Risk</span>
            </div>
            <div className={`text-sm font-semibold font-mono ${
              route.hasActiveDisruption
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {route.hasActiveDisruption ? `+${route.delayMins} min bottleneck` : 'Normal Flow'}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {route.hasActiveDisruption ? 'Active congestion delay' : 'No reported incident'}
            </div>
          </div>
        </div>

        {/* Disruption detail callout */}
        {route.hasActiveDisruption && route.disruptionDescription && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <Radio className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{route.disruptionDescription}</span>
          </div>
        )}

        {/* Expandable Mathematical Risk Breakdown */}
        {showBreakdown && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2 animate-fadeIn">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Weighted Risk Formula Components:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                Total Score = {route.riskScore} / 100
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600 dark:text-slate-300 font-mono text-[11px] pt-1">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="block text-slate-400 text-[10px]">Reliability Risk</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {route.riskBreakdown.reliabilityRisk} / 100
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="block text-slate-400 text-[10px]">Crowding Risk</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {route.riskBreakdown.crowdingRisk} / 100
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="block text-slate-400 text-[10px]">Accessibility Risk</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {route.riskBreakdown.accessibilityRisk} / 100
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="block text-slate-400 text-[10px]">Disruption Risk</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {route.riskBreakdown.disruptionRisk} / 100
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Weights reflect your active commuter profile. Hard constraints automatically override the score to ensure commuter safety.
            </p>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowBreakdown(!showBreakdown);
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
          >
            <span>{showBreakdown ? 'Hide Risk Breakdown' : 'Inspect Risk Breakdown'}</span>
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlayVoice(route);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
              title="Listen to spoken audio guidance in English, Hindi, or Kannada"
            >
              <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Spoken Guidance</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90'
              }`}
            >
              {isSelected ? 'View on Map' : 'Select Journey'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
