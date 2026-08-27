import React from 'react';
import { Labyrinth } from '../types';
import { Edit3, ShieldCheck, Zap, ArrowRight, Flame, Sparkles } from 'lucide-react';

interface HomeViewProps {
  labyrinths: Labyrinth[];
  onSelectLabyrinth: (labyrinth: Labyrinth) => void;
  onStartActiveWorkout: (labyrinth: Labyrinth) => void;
  onOpenHistory: () => void;
  onEnlist: (labyrinth: Labyrinth) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  labyrinths,
  onSelectLabyrinth,
  onStartActiveWorkout,
  onOpenHistory,
  onEnlist,
}) => {
  // Active daily labyrinth
  const activeLabyrinth = labyrinths.find((l) => l.id === 'nightwing-routine') || labyrinths[0];
  const activeDay = activeLabyrinth?.programDays[activeLabyrinth.currentDayIndex || 2] || activeLabyrinth?.programDays[0];

  return (
    <div className="pt-24 pb-32">
      {/* YOUR LABYRINTHS */}
      <section className="mb-10 max-w-5xl mx-auto">
        <div className="px-5 sm:px-8 flex justify-between items-end mb-5">
          <div>
            <span className="text-zinc-500 text-xs uppercase tracking-widest font-semibold block mb-1">
              Active Programs
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-white uppercase italic">
              Your Labyrinths
            </h2>
          </div>
          <button
            onClick={() => onSelectLabyrinth(activeLabyrinth)}
            className="font-mono-data text-xs text-zinc-400 hover:text-red-500 uppercase tracking-widest transition-colors cursor-pointer"
          >
            VIEW ALL
          </button>
        </div>

        <div className="flex gap-5 overflow-x-auto hide-scrollbar px-5 sm:px-8 snap-x snap-mandatory">
          {/* Card 1 - Founded */}
          <div
            onClick={() => {
              const lab = labyrinths.find((l) => l.id === 'hyper-density-001') || activeLabyrinth;
              onSelectLabyrinth(lab);
            }}
            className="min-w-[280px] sm:min-w-[320px] aspect-[4/5] relative bg-zinc-900 rounded-[32px] border border-zinc-800 snap-start group cursor-pointer active:scale-[0.98] transition-all overflow-hidden shadow-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAFD6IKjFJaEM5aI0padRGzijq3ABiiy9LkUdqjt2sHsY4yzjZwKPopqPsNGaLoD_kIjc1Pr0xJJUXjH3VayGqiHNETMYPnCKfgJwMkTd1ANxwS_oRY-37Mu6F6b0zhoqBB2R3dWD7epaqmPLyH8pnrJKONSH1e06ptxn2UFkt1fN3Ft9wMpzHhQcqsRZ-4I9cL_O3sy-nNEVLP4zaq4LVBFjRTsK15aZvETHqkJJ0UmxwyGgGXaanV')`,
              }}
            />
            <div className="absolute inset-0 labyrinth-mask" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent opacity-60" />
            
            <div className="absolute top-4 left-4">
              <span className="bg-red-600 text-white font-mono-data text-[10px] px-2.5 py-1 uppercase font-black tracking-wider rounded-full shadow-lg shadow-red-900/40">
                FOUNDED
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="font-mono-data text-[10px] uppercase tracking-widest border border-zinc-700 px-2.5 py-1 rounded-full bg-black/60 text-zinc-300 backdrop-blur-sm">
                12 WEEKS
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-display font-black text-2xl text-white uppercase leading-tight mb-1 group-hover:text-red-400 transition-colors">
                Hypertrophy Vol 1
              </h3>
              <p className="font-mono-data text-xs text-zinc-400 uppercase tracking-wider">
                1.2K MEMBERS
              </p>
            </div>
          </div>

          {/* Card 2 - Joined */}
          <div
            onClick={() => {
              const lab = labyrinths.find((l) => l.id === 'gravity-breaker') || activeLabyrinth;
              onSelectLabyrinth(lab);
            }}
            className="min-w-[280px] sm:min-w-[320px] aspect-[4/5] relative bg-zinc-900 rounded-[32px] border border-zinc-800 snap-start group cursor-pointer active:scale-[0.98] transition-all overflow-hidden shadow-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2tORa-m281Ivc6ZiIwY5M90cMNm4HzJ5o40NgB32aULmOG5IEI7xXJe41j3_ef6X_RZksbM3utdAlvMNNT_FYNtxQ2L7ZyYe7enH74yObKzXwzNCyUpOFRlMIqKIH-t3VOsmSuB2mujaIs2q3sU-ZWabf7f8cRu7-nG1nse9Bvc8E5ZHpj7ha6jHU2WPLUq9HE6rKwLAOx19PhzImo0UmkMMEt8nFyJUvi3wqE3ZfdaElpp9Ri35I')`,
              }}
            />
            <div className="absolute inset-0 labyrinth-mask" />
            <div className="absolute top-4 left-4">
              <span className="bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono-data text-[10px] px-2.5 py-1 uppercase font-bold tracking-wider rounded-full">
                JOINED
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-display font-black text-2xl text-white uppercase leading-tight mb-1 group-hover:text-red-400 transition-colors">
                Calisthenics King
              </h3>
              <p className="font-mono-data text-xs text-zinc-400 uppercase tracking-wider">
                800 MEMBERS
              </p>
            </div>
          </div>

          {/* Card 3 - Nightwing Daily Active */}
          <div
            onClick={() => onSelectLabyrinth(activeLabyrinth)}
            className="min-w-[280px] sm:min-w-[320px] aspect-[4/5] relative bg-zinc-900 rounded-[32px] border border-red-600/40 snap-start group cursor-pointer active:scale-[0.98] transition-all overflow-hidden shadow-2xl shadow-red-950/20"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('${activeLabyrinth.coverImage}')`,
              }}
            />
            <div className="absolute inset-0 labyrinth-mask" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400" />
            
            <div className="absolute top-4 left-4">
              <span className="bg-red-600 text-white font-mono-data text-[10px] px-3 py-1 uppercase font-black tracking-wider rounded-full shadow-lg shadow-red-900/50 flex items-center gap-1.5">
                <Zap className="w-3 h-3 fill-white" /> ACTIVE DAY 3
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-display font-black text-2xl text-white uppercase leading-tight mb-1 group-hover:text-red-400 transition-colors">
                {activeLabyrinth.title}
              </h3>
              <p className="font-mono-data text-xs text-zinc-400 uppercase tracking-wider">
                {activeLabyrinth.membersCount.toLocaleString()} MEMBERS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TODAY'S PLAN / THE IRON MAZE (SCREEN 1 HERO ARCHITECTURE) */}
      <section className="mb-14 px-5 sm:px-8 max-w-5xl mx-auto">
        <div className="bg-zinc-900 rounded-[36px] border border-zinc-800 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          {/* Accent top gradient line from Design HTML */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-transparent opacity-75" />

          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 border border-red-900/30 rounded-full bg-red-950/20 text-red-400 font-mono-data text-[10px] font-bold uppercase">
                  {activeDay?.dayLabel || 'DAY 18 OF 24'}
                </span>
                <span className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">
                  Today's Protocol
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {activeDay?.routineName || 'Hypertrophy Block II'}
              </h2>
            </div>
            <button
              onClick={() => onSelectLabyrinth(activeLabyrinth)}
              className="text-zinc-500 hover:text-white p-2 rounded-xl hover:bg-zinc-800/80 transition-colors cursor-pointer"
              title="Edit routine plan"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>

          {/* Current Phase Progress Card */}
          <div className="p-4 sm:p-5 bg-zinc-800/50 rounded-2xl border border-zinc-700/60 mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Current Phase</p>
              <span className="text-xs text-red-400 font-bold font-mono-data">75% COMPLETE</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Hypertrophy Block II • Arm & Shoulder Focus</h3>
            <div className="w-full bg-zinc-700 h-2 rounded-full overflow-hidden">
              <div className="bg-red-600 w-3/4 h-full rounded-full shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 font-mono-data">Day 18 of 24 • 6 Sessions Remaining</p>
          </div>

          {/* Exercise Items List */}
          <div className="space-y-3 mb-6">
            <p className="text-xs text-zinc-400 uppercase font-bold px-1 tracking-wider">
              Today's Routine Movements
            </p>

            {/* Exercise Row 1 */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 font-bold font-mono text-sm">
                  01
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-white">
                    {activeDay?.exercises[0]?.name || 'Barbell Back Squat'}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Target: {activeDay?.exercises[0]?.target || 'Quads / Glutes'}
                  </div>
                </div>
              </div>
              <span className="font-mono-data text-xs sm:text-sm text-zinc-300 font-bold px-3 py-1 bg-zinc-800/80 rounded-xl border border-zinc-700/50">
                {activeDay?.exercises[0]?.setsCount || 4}x{activeDay?.exercises[0]?.defaultReps || 8}
              </span>
            </div>

            {/* Exercise Row 2 */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold font-mono text-sm border border-zinc-700/50">
                  02
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-white">
                    {activeDay?.exercises[1]?.name || 'Cable Curls & Triceps Pushdown'}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Target: {activeDay?.exercises[1]?.target || 'Biceps & Triceps'}
                  </div>
                </div>
              </div>
              <span className="font-mono-data text-xs sm:text-sm text-zinc-300 font-bold px-3 py-1 bg-zinc-800/80 rounded-xl border border-zinc-700/50">
                {activeDay?.exercises[1]?.setsCount || 3}x{activeDay?.exercises[1]?.defaultReps || 12}
              </span>
            </div>

            {/* Exercise Row 3 */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold font-mono text-sm border border-zinc-700/50">
                  03
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-white">
                    {activeDay?.exercises[2]?.name || 'Skullcrushers'}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Target: {activeDay?.exercises[2]?.target || 'Triceps Long Head'}
                  </div>
                </div>
              </div>
              <span className="font-mono-data text-xs sm:text-sm text-zinc-300 font-bold px-3 py-1 bg-zinc-800/80 rounded-xl border border-zinc-700/50">
                {activeDay?.exercises[2]?.setsCount || 3}x{activeDay?.exercises[2]?.defaultReps || 10}
              </span>
            </div>
          </div>

          <button
            onClick={() => onStartActiveWorkout(activeLabyrinth)}
            className="w-full py-4 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-white text-sm sm:text-base hover:bg-red-500 transition-all shadow-lg shadow-red-900/30 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            START DAY 18 WORKOUT
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onOpenHistory}
            className="font-mono-data text-xs text-zinc-400 hover:text-red-400 uppercase tracking-widest py-1 transition-colors cursor-pointer"
          >
            SEE MORE HISTORY & LOGS →
          </button>
        </div>
      </section>

      {/* TRENDING SECTION */}
      <section className="px-5 sm:px-8 max-w-5xl mx-auto mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-zinc-500 text-xs uppercase tracking-widest font-semibold block mb-1">
              Community Top Charts
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-white uppercase italic">
              Trending Labyrinths
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trending Item 1: The Olympian */}
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden group hover:border-zinc-700 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="aspect-video w-full overflow-hidden relative">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNUlbKDrT872_TVFcjouSMbGqyh_1A1s2Lw10WFZOpp_1X5rS6NLFGuanDdKMlHF7MJvNhbsP_d8eC8EfVDXmX0RwqEflSYqpzmqyNQQ_ON0SDvgdkNL_uxVFfUrupF7t1w5rxiiYL-jpTs1c6Dz9ZifcLK1V9X2_Db0xlnyj-TPVG_EcMX5lXXLdYECOdW9SW4eHmA3qRhruJh1BE6GGO3WSkQ1XE0-2EDjrj5hyKPHco-bsKh3ZO')`,
                  }}
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm border border-zinc-700 px-2.5 py-1 rounded-full font-mono-data text-white font-bold text-xs">
                  $19.99
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-display font-bold text-lg text-white uppercase">
                    The Olympian
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-red-500 fill-red-500/20" />
                </div>
                <p className="text-zinc-400 text-xs mb-3">
                  by <span className="text-white font-semibold">@Zeus</span>
                </p>
                <p className="font-mono-data text-zinc-500 uppercase tracking-widest text-[10px] mb-4">
                  5.4K MEMBERS • 12 WKS • ADVANCED
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => {
                  const lab = labyrinths.find((l) => l.id === 'the-olympian');
                  if (lab) onSelectLabyrinth(lab);
                }}
                className="w-full border border-zinc-700 hover:border-red-500 hover:text-red-400 text-white py-3 rounded-2xl font-mono-data font-bold text-xs uppercase tracking-widest transition-all cursor-pointer bg-zinc-800/40"
              >
                DETAILS
              </button>
            </div>
          </div>

          {/* Trending Item 2: Basement Built */}
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden group hover:border-zinc-700 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="aspect-video w-full overflow-hidden relative">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJpNUrT6DUGp7kiUld3-zmt_GdbqpDd6nhdu17J27-PddI7mw1O1nJ7d-b218m9LqA6vzyV0HbGUz7-lE-eLA-YyCzWbanqiUOh2vsPKtyHUIKTueA1lUxqE91Rt-uNyhtDbC2RpYWQsPqWvc6uX_kZQ1yd_WGaP-YGrOnPcccGpWVPeXcNu_Q0FhzGlNXkfL_BTpRPah31FZn9CeoSMn-bp7t3fAoBjg_vfiXtsREYUAkLYgtUNmQ')`,
                  }}
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm border border-zinc-700 px-2.5 py-1 rounded-full font-mono-data text-white font-bold text-xs">
                  FREE
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg text-white uppercase mb-1">
                  Basement Built
                </h3>
                <p className="text-zinc-400 text-xs mb-3">
                  by <span className="text-white font-semibold">@GarageLifter</span>
                </p>
                <p className="font-mono-data text-zinc-500 uppercase tracking-widest text-[10px] mb-4">
                  230 MEMBERS • 8 WKS • INTERMEDIATE
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => {
                  const lab = labyrinths.find((l) => l.id === 'basement-built');
                  if (lab) onSelectLabyrinth(lab);
                }}
                className="w-full border border-zinc-700 hover:border-red-500 hover:text-red-400 text-white py-3 rounded-2xl font-mono-data font-bold text-xs uppercase tracking-widest transition-all cursor-pointer bg-zinc-800/40"
              >
                DETAILS
              </button>
            </div>
          </div>

          {/* Trending Item 3: Titan Strength (Featured Official) */}
          <div className="bg-zinc-900 rounded-3xl border border-red-600/50 overflow-hidden group hover:border-red-500 transition-all shadow-xl shadow-red-950/20 flex flex-col justify-between relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
            <div>
              <div className="aspect-video w-full overflow-hidden relative">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCBFC4gdy3HixxesF1gJh8H9Gny6_jeCRzTB0cS9oqCoGKPojUcTZpSiQCmgmT5FP5oa-mA-dlOsmdI8kwMNwXaA-UiRjRGoupvUOAcimwkTzWoQjTCJSIUxKPxRRp111qdgxvSfoeK4l5x3BFr19TTjvhrZrT4DUkrjidTvGCR3rcocmanAYZKpGeIgCfu-E70hJ-EuGANQ0n1IdBPA4T9Pd7QBhoygsWG1eDnun6puojHHf98b92y')`,
                  }}
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white font-mono-data text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase shadow-md">
                  OFFICIAL
                </div>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm border border-zinc-700 px-2.5 py-1 rounded-full font-mono-data text-white font-bold text-xs">
                  FREE
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg text-white uppercase mb-1">
                  Titan Strength
                </h3>
                <p className="text-zinc-400 text-xs mb-3">by Minotaur Labs</p>
                <p className="font-mono-data text-zinc-500 uppercase tracking-widest text-[10px] mb-4">
                  12K MEMBERS • 16 WKS • ELITE
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => {
                  const lab = labyrinths.find((l) => l.id === 'titan-strength');
                  if (lab) onEnlist(lab);
                }}
                className="w-full bg-red-600 text-white py-3 rounded-2xl font-mono-data font-bold text-xs uppercase tracking-widest hover:bg-red-500 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-red-900/30"
              >
                ENLIST
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
