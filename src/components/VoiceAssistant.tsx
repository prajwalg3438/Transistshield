import React, { useState, useEffect } from 'react';
import { RouteItem } from '../types.ts';
import { Volume2, VolumeX, Play, Square, Globe, Sparkles, AlertCircle } from 'lucide-react';

interface VoiceAssistantProps {
  selectedRoute: RouteItem;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ selectedRoute }) => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'kn'>('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [voiceGuidanceText, setVoiceGuidanceText] = useState<{
    title: string;
    audioText: string;
    routeSummary: string;
    details: {
      arrival: string;
      crowding: string;
      accessibility: string;
      risk: string;
    };
  } | null>(null);

  // Fetch trilingual guidance whenever selected route or language changes
  useEffect(() => {
    fetch(`/api/voice-guidance?routeId=${selectedRoute.id}&lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        setVoiceGuidanceText(data);
      })
      .catch((err) => {
        console.error('Failed to load voice guidance:', err);
      });
  }, [selectedRoute.id, language]);

  const speakText = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Web Speech API is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;

    // Set voice language code
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'kn') {
      utterance.lang = 'kn-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <Volume2 className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Trilingual Voice Assistant (Web Speech API)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Slide 3 & 4: Simple spoken arrival, seating, and route guidance in English, Hindi, and Kannada.
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          {[
            { id: 'en', label: 'English', sub: 'EN' },
            { id: 'hi', label: 'हिन्दी', sub: 'Hindi' },
            { id: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                handleStop();
                setLanguage(lang.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                language === lang.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spoken Guidance Box */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {voiceGuidanceText?.title || `Route ${selectedRoute.routeNumber}`}
            </span>
          </div>

          {/* Sound wave indicator if playing */}
          {isPlaying && (
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-indigo-600 rounded-full animate-bounce"></span>
              <span className="w-1 h-5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1 h-4 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.3s]"></span>
              <span className="w-1 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.45s]"></span>
            </div>
          )}
        </div>

        {/* The Audio Text Transcript */}
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed min-h-[50px]">
          "{voiceGuidanceText?.audioText || 'Loading audio guidance...'}"
        </p>

        {/* 4 Details Pills */}
        {voiceGuidanceText?.details && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block">Arrival:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {voiceGuidanceText.details.arrival}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block">Crowding:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {voiceGuidanceText.details.crowding}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block">Accessibility:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {voiceGuidanceText.details.accessibility}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block">Risk Level:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {voiceGuidanceText.details.risk}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-2">
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={() => voiceGuidanceText && speakText(voiceGuidanceText.audioText)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Listen to Guidance</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Speaking</span>
            </button>
          )}

          {/* Quick Snippet Buttons */}
          <button
            onClick={() => {
              if (voiceGuidanceText?.details) {
                speakText(voiceGuidanceText.details.arrival);
              }
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
          >
            Arrival Only
          </button>
          <button
            onClick={() => {
              if (voiceGuidanceText?.details) {
                speakText(voiceGuidanceText.details.crowding);
              }
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
          >
            Seats Only
          </button>
        </div>

        {/* Speed rate select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Speech Rate:</span>
          {[0.8, 1.0, 1.2].map((rate) => (
            <button
              key={rate}
              onClick={() => setSpeechRate(rate)}
              className={`px-2 py-1 rounded font-mono font-bold ${
                speechRate === rate
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
