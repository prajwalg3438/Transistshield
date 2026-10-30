import React from 'react';
import { CommuterProfileType } from '../types.ts';
import { User, Accessibility, HeartHandshake, Zap, ShieldCheck, AlertCircle } from 'lucide-react';

interface ProfileSelectorProps {
  currentProfile: CommuterProfileType;
  onChangeProfile: (profile: CommuterProfileType) => void;
  requireStepFree: boolean;
  onToggleStepFree: (checked: boolean) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  currentProfile,
  onChangeProfile,
  requireStepFree,
  onToggleStepFree,
}) => {
  const profiles: {
    id: CommuterProfileType;
    label: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    weights: { reliability: string; crowding: string; access: string; disruption: string };
    isHardConstraint?: boolean;
    color: string;
  }[] = [
    {
      id: 'default',
      label: 'Default Commuter',
      subtitle: 'Balanced real-world weighting',
      icon: User,
      weights: { reliability: '40%', crowding: '25%', access: '10%', disruption: '25%' },
      color: 'indigo',
    },
    {
      id: 'wheelchair',
      label: 'Wheelchair User',
      subtitle: 'Step-free access as a hard rule',
      icon: Accessibility,
      weights: { reliability: '20%', crowding: '15%', access: '50%', disruption: '15%' },
      isHardConstraint: true,
      color: 'blue',
    },
    {
      id: 'elderly',
      label: 'Elderly / Low Mobility',
      subtitle: 'Comfort, seating, & gentle paths',
      icon: HeartHandshake,
      weights: { reliability: '25%', crowding: '30%', access: '30%', disruption: '15%' },
      color: 'emerald',
    },
    {
      id: 'time_critical',
      label: 'Time-Critical Trip',
      subtitle: 'High punctuality & low delay tolerance',
      icon: Zap,
      weights: { reliability: '60%', crowding: '10%', access: '5%', disruption: '25%' },
      color: 'amber',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Commuter Profile & Risk Weights
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Slide 6: Weights shift with the commuter profile. Hard constraints strictly override the score.
          </p>
        </div>

        {/* Step-free toggle switch */}
        <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 select-none">
          <input
            type="checkbox"
            checked={requireStepFree || currentProfile === 'wheelchair'}
            disabled={currentProfile === 'wheelchair'}
            onChange={(e) => onToggleStepFree(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
          />
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>Strict Step-Free Access</span>
              {currentProfile === 'wheelchair' && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold uppercase">
                  Locked
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Disqualify routes with stairs or barrier stops
            </div>
          </div>
        </label>
      </div>

      {/* Grid of Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {profiles.map((p) => {
          const Icon = p.icon;
          const isSelected = currentProfile === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChangeProfile(p.id)}
              className={`text-left p-3.5 rounded-xl border transition-all relative cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
              )}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`p-1.5 rounded-lg ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {p.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                {p.subtitle}
              </p>

              {/* Weight Distribution breakdown */}
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono border-t border-slate-100 dark:border-slate-800 pt-2">
                <div className="text-center">
                  <span className="block text-slate-400">Rel</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{p.weights.reliability}</span>
                </div>
                <div className="text-center">
                  <span className="block text-slate-400">Crowd</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{p.weights.crowding}</span>
                </div>
                <div className="text-center">
                  <span className="block text-slate-400">Access</span>
                  <span className={`font-bold ${p.id === 'wheelchair' ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-700 dark:text-slate-300'}`}>
                    {p.weights.access}
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-slate-400">Disrupt</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{p.weights.disruption}</span>
                </div>
              </div>

              {p.isHardConstraint && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>Hard constraint overrides score</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
