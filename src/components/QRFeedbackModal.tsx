import React, { useState } from 'react';
import { BusStopItem } from '../types.ts';
import { QrCode, CheckCircle2, Clock, Users, X, ShieldAlert, Sparkles } from 'lucide-react';

interface QRFeedbackModalProps {
  stop: BusStopItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (data: {
    stopId: string;
    stopCode: string;
    hasBusArrived: 'yes' | 'no' | 'running_late';
    seatsStatus: 'plenty' | 'few' | 'standing_only';
    barrierStatus?: 'step-free' | 'barrier' | 'blocked';
    notes?: string;
  }) => Promise<void>;
}

export const QRFeedbackModal: React.FC<QRFeedbackModalProps> = ({
  stop,
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  const [hasBusArrived, setHasBusArrived] = useState<'yes' | 'no' | 'running_late'>('yes');
  const [seatsStatus, setSeatsStatus] = useState<'plenty' | 'few' | 'standing_only'>('few');
  const [barrierStatus, setBarrierStatus] = useState<'step-free' | 'barrier' | 'blocked'>('step-free');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen || !stop) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmitFeedback({
        stopId: stop.id,
        stopCode: stop.code,
        hasBusArrived,
        seatsStatus,
        barrierStatus,
      });
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1400);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          <div className="py-12 text-center space-y-3 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Feedback Received!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Estimates for {stop.name} updated for all commuters. Live report valid for 60 minutes.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header with Stop Info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <QrCode className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {stop.code}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  One Code Per Stop
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {stop.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No typing, no location hassle. Just tap two quick answers to update live reliability for all commuters.
              </p>
            </div>

            {/* Simulated QR Code Graphic */}
            <div className="flex items-center justify-center py-2 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="text-center p-3">
                <div className="w-24 h-24 mx-auto bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center">
                  {/* SVG QR Code Pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect x="0" y="0" width="30" height="30" fill="#1e293b" />
                    <rect x="6" y="6" width="18" height="18" fill="#ffffff" />
                    <rect x="10" y="10" width="10" height="10" fill="#1e293b" />

                    <rect x="70" y="0" width="30" height="30" fill="#1e293b" />
                    <rect x="76" y="6" width="18" height="18" fill="#ffffff" />
                    <rect x="80" y="10" width="10" height="10" fill="#1e293b" />

                    <rect x="0" y="70" width="30" height="30" fill="#1e293b" />
                    <rect x="6" y="76" width="18" height="18" fill="#ffffff" />
                    <rect x="10" y="80" width="10" height="10" fill="#1e293b" />

                    {/* QR Data cells */}
                    <rect x="36" y="8" width="8" height="8" fill="#4f46e5" />
                    <rect x="48" y="16" width="8" height="8" fill="#1e293b" />
                    <rect x="36" y="36" width="16" height="16" fill="#4f46e5" />
                    <rect x="56" y="44" width="8" height="8" fill="#1e293b" />
                    <rect x="12" y="44" width="8" height="8" fill="#1e293b" />
                    <rect x="72" y="64" width="14" height="14" fill="#4f46e5" />
                    <rect x="44" y="74" width="12" height="12" fill="#1e293b" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mt-1 block">
                  STOP QR: {stop.code}
                </span>
              </div>
            </div>

            {/* Question 1: Has the bus arrived? */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>1. Has the bus arrived?</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'yes', label: 'Yes, Arrived' },
                  { value: 'no', label: 'No, Waiting' },
                  { value: 'running_late', label: 'Running Late' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setHasBusArrived(opt.value as any)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      hasBusArrived === opt.value
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Seats taken status */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>2. Seats available:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'plenty', label: 'Plenty' },
                  { value: 'few', label: 'Few' },
                  { value: 'standing_only', label: 'Standing Only' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSeatsStatus(opt.value as any)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      seatsStatus === opt.value
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step-free condition quick check */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
                <span>Path & stop accessibility condition:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'step-free', label: 'Step-Free', color: 'emerald' },
                  { value: 'barrier', label: 'Minor Barrier', color: 'amber' },
                  { value: 'blocked', label: 'Path Blocked', color: 'rose' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBarrierStatus(opt.value as any)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      barrierStatus === opt.value
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 60 Min Expiry notice */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Everyone sees it immediately. Reports automatically expire after 60 minutes.</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Submitting Feedback...' : 'Tap to Submit Stop Feedback'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
