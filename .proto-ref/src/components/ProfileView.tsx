import React, { useState } from 'react';
import { UserProfile, Labyrinth } from '../types';
import { ShieldCheck, PlusCircle, Lock, Unlock, Clock, Dumbbell, Sparkles } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  foundedLabyrinths: Labyrinth[];
  onSelectLabyrinth: (labyrinth: Labyrinth) => void;
  onOpenCreateModal: () => void;
  onOpenPhotoLightbox: (index: number) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  foundedLabyrinths,
  onSelectLabyrinth,
  onOpenCreateModal,
  onOpenPhotoLightbox,
}) => {
  const [quickVisibility, setQuickVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [quickAccess, setQuickAccess] = useState<'FREE' | 'PAID'>('FREE');
  const [quickTitle, setQuickTitle] = useState('');
  const [showQuickForm, setShowQuickForm] = useState(false);

  return (
    <main className="pt-20 pb-28 max-w-4xl mx-auto px-5">
      {/* Hero Section */}
      <section className="mt-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.12)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-2 border-zinc-800 flex-shrink-0 relative overflow-hidden shadow-xl bg-zinc-950">
            <img
              src={profile.avatarUrl}
              alt="Alex Rivers Coach Profile"
              className="w-full h-full object-cover grayscale brightness-90 contrast-125"
            />
            <div className="absolute bottom-1.5 right-1.5 bg-red-600 text-white px-2 py-0.5 rounded-md font-mono-data text-[9px] font-black flex items-center gap-1 shadow-md shadow-red-950">
              VERIFIED <ShieldCheck className="w-3 h-3 fill-red-950 text-white inline-block" />
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-mono-data text-xs text-red-500 font-bold uppercase tracking-widest">
                FOUNDER & HEAD COACH
              </span>
            </div>
            <h2 className="font-display font-black text-3xl md:text-5xl text-white uppercase leading-none italic tracking-tight">
              {profile.name}
            </h2>
            <p className="mt-3 font-mono-data text-xs text-zinc-300 uppercase tracking-wider border-l-2 border-red-500 pl-3">
              {profile.bio}
            </p>

            {/* Stats Chamber */}
            <div className="mt-6 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl md:text-3xl text-white">
                  {profile.foundedLabyrinthsCount}
                </span>
                <span className="font-mono-data text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                  FOUNDED LABYRINTHS
                </span>
              </div>
              <div className="w-[1px] h-10 bg-zinc-800 self-center" />
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl md:text-3xl text-red-500">
                  {profile.totalMembersCount}
                </span>
                <span className="font-mono-data text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                  TOTAL MEMBERS
                </span>
              </div>
            </div>

            <button
              onClick={onOpenCreateModal}
              className="mt-6 bg-red-600 hover:bg-red-500 text-white font-display font-black px-8 py-3.5 rounded-2xl active:scale-[0.98] transition-all tracking-widest border border-red-500 uppercase text-xs cursor-pointer shadow-xl shadow-red-900/40"
            >
              CREATE NEW LABYRINTH
            </button>
          </div>
        </div>
      </section>

      {/* The Thread Divider */}
      <div className="my-10 h-[1px] w-full bg-zinc-800" />

      {/* Inline Quick Creator Chamber */}
      <section className="mb-12 p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl">
        <div className="flex flex-col gap-6">
          <div
            onClick={() => setShowQuickForm(!showQuickForm)}
            className="flex justify-between items-center cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase italic tracking-tight">
                CREATE NEW LABYRINTH
              </h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <PlusCircle className={`w-5 h-5 text-white transition-transform ${showQuickForm ? 'rotate-45' : ''}`} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-950/70">
              <span className="font-mono-data text-xs text-zinc-300 uppercase tracking-wider font-semibold">
                VISIBILITY
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQuickVisibility('PUBLIC')}
                  className={`px-4 py-1.5 rounded-xl font-mono-data text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    quickVisibility === 'PUBLIC'
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/40 border border-red-500'
                      : 'border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900'
                  }`}
                >
                  PUBLIC
                </button>
                <button
                  type="button"
                  onClick={() => setQuickVisibility('PRIVATE')}
                  className={`px-4 py-1.5 rounded-xl font-mono-data text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    quickVisibility === 'PRIVATE'
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/40 border border-red-500'
                      : 'border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900'
                  }`}
                >
                  PRIVATE
                </button>
              </div>
            </div>

            {/* Access Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-950/70">
              <span className="font-mono-data text-xs text-zinc-300 uppercase tracking-wider font-semibold">
                ACCESS
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQuickAccess('FREE')}
                  className={`px-4 py-1.5 rounded-xl font-mono-data text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    quickAccess === 'FREE'
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/40 border border-red-500'
                      : 'border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900'
                  }`}
                >
                  FREE
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAccess('PAID')}
                  className={`px-4 py-1.5 rounded-xl font-mono-data text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    quickAccess === 'PAID'
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/40 border border-red-500'
                      : 'border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900'
                  }`}
                >
                  PAID
                </button>
              </div>
            </div>
          </div>

          {showQuickForm && (
            <div className="space-y-4 pt-2 border-t border-zinc-800">
              <div>
                <label className="font-mono-data text-[10px] text-zinc-400 uppercase tracking-widest block mb-1.5 font-bold">
                  LABYRINTH TITLE
                </label>
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="E.G. DEADLIFT ARCHITECTURE V2"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 font-mono-data text-xs text-white uppercase outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <button
            onClick={onOpenCreateModal}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-mono-data font-black py-4 rounded-2xl active:scale-[0.99] transition-all tracking-widest uppercase text-xs cursor-pointer shadow-xl shadow-red-900/40 border border-red-500"
          >
            CREATE
          </button>
        </div>
      </section>

      {/* Founded Labyrinths Section */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase italic tracking-tight">
              FOUNDED LABYRINTHS
            </h3>
          </div>
          <span className="font-mono-data text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
            VIEW ALL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 001: Hyper-Density Phase */}
          <div
            onClick={() => {
              const lab = foundedLabyrinths.find((l) => l.id === 'hyper-density-001') || foundedLabyrinths[0];
              onSelectLabyrinth(lab);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative group cursor-pointer hover:border-red-500/80 shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono-data text-xs text-red-500 font-bold">001</span>
              <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-mono-data font-bold text-xs shadow-md shadow-red-950">
                $49.00
              </div>
            </div>
            <h4 className="font-display font-black text-xl text-white uppercase italic mb-2">
              HYPER-DENSITY PHASE
            </h4>
            <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
              Advanced architectural hypertrophy for seasoned lifters. Minimum 3 years training required.
            </p>
            <div className="flex items-center gap-4 font-mono-data text-xs text-zinc-500 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" /> 12 WEEKS
              </span>
              <span className="flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-red-500" /> ELITE
              </span>
            </div>
          </div>

          {/* Card 002: The Thread: Entry */}
          <div
            onClick={() => {
              const lab = foundedLabyrinths.find((l) => l.id === 'the-thread-002') || foundedLabyrinths[0];
              onSelectLabyrinth(lab);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative group cursor-pointer hover:border-red-500/80 shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono-data text-xs text-red-500 font-bold">002</span>
              <div className="bg-zinc-800 text-white border border-zinc-700 px-3 py-1 rounded-lg font-mono-data font-bold text-xs">
                FREE
              </div>
            </div>
            <h4 className="font-display font-black text-xl text-white uppercase italic mb-2">
              THE THREAD: ENTRY
            </h4>
            <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
              The introductory path into the Labyrinth system. Core mechanics and discipline fundamentals.
            </p>
            <div className="flex items-center gap-4 font-mono-data text-xs text-zinc-500 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" /> 2 WEEKS
              </span>
              <span className="flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-red-500" /> OPEN
              </span>
            </div>
          </div>

          {/* Card 003: Axial Loading Depth */}
          <div
            onClick={() => {
              const lab = foundedLabyrinths.find((l) => l.id === 'axial-loading-003') || foundedLabyrinths[0];
              onSelectLabyrinth(lab);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative group cursor-pointer hover:border-red-500/80 shadow-xl transition-all md:col-span-2"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono-data text-xs text-red-500 font-bold">003</span>
                  <div className="border border-red-500/40 bg-red-950/40 text-red-400 px-3 py-0.5 rounded-md font-mono-data text-[10px] font-bold uppercase">
                    PRO ONLY
                  </div>
                </div>
                <h4 className="font-display font-black text-xl text-white uppercase italic">
                  AXIAL LOADING DEPTH
                </h4>
              </div>
              <div>
                <button className="bg-red-600 hover:bg-red-500 text-white font-mono-data font-bold px-8 py-3 rounded-2xl transition-all text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-red-900/40">
                  UNLOCK ACCESS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Feed Section (The Gallery) */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase italic tracking-tight">
              PROGRESS FEED
            </h3>
          </div>
          <span className="font-mono-data text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
            LATEST UPDATES
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {profile.galleryImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => onOpenPhotoLightbox(idx)}
              className="aspect-square bg-zinc-950 rounded-2xl relative group overflow-hidden border border-zinc-800 cursor-pointer shadow-md hover:border-red-500 transition-all"
            >
              <img
                src={img.imageUrl}
                alt={img.caption}
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 bg-zinc-900/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-zinc-700/60">
                <span className="font-mono-data text-[9px] text-white font-bold tracking-wider uppercase">
                  {img.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
