import React, { useState } from 'react';
import { Labyrinth } from '../types';
import {
  CheckCircle2,
  Share2,
  Sparkles,
  Trophy,
  ArrowRight,
  Camera,
  EyeOff,
  Eye,
  Lock,
} from 'lucide-react';

interface WorkoutCompleteModalProps {
  labyrinth: Labyrinth;
  summary: {
    durationFormatted: string;
    totalVolumeKg: number;
    completedSetsCount: number;
    sessionNotes: string;
  };
  onClose: () => void;
  onShareToCommunity: (caption: string) => void;
}

export const WorkoutCompleteModal: React.FC<WorkoutCompleteModalProps> = ({
  labyrinth,
  summary,
  onClose,
  onShareToCommunity,
}) => {
  const [shouldPostToFeed, setShouldPostToFeed] = useState<boolean>(true);
  const [caption, setCaption] = useState(
    'Arm Day complete in the Labyrinth. Crushed close-grip bench PR and locked in 3-second eccentric tempo.'
  );
  const [hasShared, setHasShared] = useState(false);

  const handleFinishAction = () => {
    if (shouldPostToFeed) {
      onShareToCommunity(caption);
      setHasShared(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      // Save privately without posting to public feed
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans overflow-y-auto hide-scrollbar">
      <div className="bg-[#121212] border border-zinc-800 rounded-[36px] w-full max-w-lg p-6 sm:p-8 space-y-6 text-center text-white relative overflow-hidden shadow-2xl border-red-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-600 text-white mx-auto flex items-center justify-center shadow-xl shadow-red-900/50">
            <Trophy className="w-8 h-8 text-white" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-mono-data text-xs text-red-500 font-bold uppercase tracking-widest">
                SESSION PROTOCOL CONCLUDED
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase italic tracking-tight">
              LABYRINTH COMPLETE
            </h2>
            <p className="font-mono-data text-xs text-zinc-400 uppercase mt-1">
              {labyrinth.title}
            </p>
          </div>

          {/* Stats Matrix */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 border border-zinc-800 bg-zinc-950 rounded-2xl p-4 text-center">
            <div>
              <span className="font-mono-data text-[10px] text-zinc-400 uppercase block font-semibold">
                DURATION
              </span>
              <span className="font-mono-data font-black text-base sm:text-xl text-white">
                {summary.durationFormatted}
              </span>
            </div>
            <div className="border-x border-zinc-800/80">
              <span className="font-mono-data text-[10px] text-zinc-400 uppercase block font-semibold">
                TOTAL LOAD
              </span>
              <span className="font-mono-data font-black text-base sm:text-xl text-red-400">
                {summary.totalVolumeKg.toLocaleString()} KG
              </span>
            </div>
            <div>
              <span className="font-mono-data text-[10px] text-zinc-400 uppercase block font-semibold">
                SETS HIT
              </span>
              <span className="font-mono-data font-black text-base sm:text-xl text-white">
                {summary.completedSetsCount} SETS
              </span>
            </div>
          </div>

          {/* OPTIONAL COMMUNITY FEED POSTING TOGGLE */}
          <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-4 text-left space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {shouldPostToFeed ? (
                  <Eye className="w-4 h-4 text-red-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-zinc-500" />
                )}
                <div>
                  <span className="font-mono-data text-xs font-bold text-white uppercase block">
                    POST TO COMMUNITY FEED
                  </span>
                  <p className="text-[10px] text-zinc-400">
                    {shouldPostToFeed
                      ? 'Session will be shared to Labyrinth members.'
                      : 'Keep this workout private in personal logs only.'}
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => setShouldPostToFeed(!shouldPostToFeed)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  shouldPostToFeed ? 'bg-red-600 justify-end' : 'bg-zinc-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {shouldPostToFeed && (
              <div className="pt-2 border-t border-zinc-800/80 space-y-2 animate-in fade-in duration-200">
                <span className="font-mono-data text-[10px] text-zinc-400 uppercase block font-semibold">
                  COMMUNITY CAPTION
                </span>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-xs text-white outline-none font-sans transition-colors resize-none leading-relaxed"
                  placeholder="Share notes, PRs, or coaching feedback..."
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-1">
            <button
              onClick={handleFinishAction}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-display font-black py-4 rounded-2xl uppercase tracking-widest text-xs sm:text-sm shadow-xl shadow-red-900/40 active:scale-[0.99] transition-all cursor-pointer border border-red-500"
            >
              {hasShared
                ? 'SHARED TO LABYRINTH!'
                : shouldPostToFeed
                ? 'POST TO FEED & FINISH'
                : 'SAVE PRIVATELY & FINISH'}
            </button>

            {shouldPostToFeed && (
              <button
                onClick={() => {
                  setShouldPostToFeed(false);
                  onClose();
                }}
                className="font-mono-data text-xs text-zinc-400 hover:text-white uppercase tracking-widest py-2 cursor-pointer transition-colors"
              >
                SAVE PRIVATELY WITHOUT POSTING
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
