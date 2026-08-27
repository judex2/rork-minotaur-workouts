import React, { useState } from 'react';
import { Labyrinth, CategoryType } from '../types';
import { Search, ArrowRight, TrendingUp, Clock, Zap } from 'lucide-react';

interface ExploreViewProps {
  labyrinths: Labyrinth[];
  onSelectLabyrinth: (labyrinth: Labyrinth) => void;
  onEnlist: (labyrinth: Labyrinth) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  labyrinths,
  onSelectLabyrinth,
  onEnlist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('ALL');

  const categories: CategoryType[] = [
    'ALL',
    'STRENGTH',
    'HYPERTROPHY',
    'CALISTHENICS',
    'ENDURANCE',
    'MOBILITY',
  ];

  const filteredLabyrinths = labyrinths.filter((lab) => {
    const matchesCategory =
      selectedCategory === 'ALL' || lab.category === selectedCategory;
    const matchesSearch =
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="pt-20 pb-28 max-w-4xl mx-auto px-5">
      {/* Search Bar */}
      <section className="mb-6">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FIND YOUR LABYRINTH..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-2xl text-white font-mono-data py-4 pl-12 pr-4 text-xs uppercase tracking-wider outline-none transition-all placeholder:text-zinc-500 shadow-md"
          />
        </div>
      </section>

      {/* Categories / Filters */}
      <nav className="mb-10 overflow-x-auto hide-scrollbar flex gap-2.5 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl font-mono-data text-xs uppercase tracking-wider whitespace-nowrap font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 border border-red-500'
                : 'border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* FOR YOU Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white italic">
              FOR YOU
            </h2>
          </div>
          <div className="h-[1px] flex-grow mx-6 bg-zinc-800" />
          <div className="w-6 h-6 flex items-center justify-center opacity-80">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-5 h-5 text-red-500">
              <polygon points="50,10 90,85 10,85" fill="none" stroke="currentColor" strokeWidth="8" />
              <circle cx="50" cy="55" r="12" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-3 snap-x snap-mandatory">
          {/* Card 1: Titan Strength */}
          <div
            onClick={() => {
              const lab = labyrinths.find((l) => l.id === 'titan-strength') || labyrinths[0];
              onSelectLabyrinth(lab);
            }}
            className="min-w-[290px] sm:min-w-[360px] md:min-w-[420px] aspect-[16/10] rounded-3xl overflow-hidden group border border-zinc-800 cursor-pointer shadow-xl bg-zinc-900 snap-start shrink-0 relative"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 grayscale"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBq5E9N0m-7ARvDaWNUplzb6klHJUo9yHaedeyBuVVxXI1v6s9GyWtUHWkFgg6Oa0P13CkidEHbjqdqv6twCQ7_Tfp8DJwBsjuhQcm2jSPfsUFG1NOWAae91FSD9Mr6rPVH3cNWU4_MCqRvBJ6KwRGXzn_EdATDCQLM8rHD5m9DF9S5RQ8wGRGBaWdZbRxRDzLCYfRkLe1WpORJr3IHn_vqfbl3yZqmYnML_XNzWeLdwf6cTvWNc5kg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 text-white font-mono-data text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-widest font-bold">
                STRENGTH
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-mono-data text-xs text-red-400 mb-1 uppercase tracking-widest font-semibold">
                @MinotaurLabs
              </p>
              <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase mb-2 leading-none italic">
                TITAN STRENGTH
              </h3>
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-white font-bold text-sm bg-red-600/90 px-2.5 py-0.5 rounded-md border border-red-500/40">
                  FREE
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Gravity Breaker */}
          <div
            onClick={() => {
              const lab = labyrinths.find((l) => l.id === 'gravity-breaker') || labyrinths[0];
              onSelectLabyrinth(lab);
            }}
            className="min-w-[290px] sm:min-w-[360px] md:min-w-[420px] aspect-[16/10] rounded-3xl overflow-hidden group border border-zinc-800 cursor-pointer shadow-xl bg-zinc-900 snap-start shrink-0 relative"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 grayscale"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCbE4L6_5G-OfDoRpA_RLJ9n2GtmJ2PkUkg_AwOPq-wNNaks4aVUC3h9mQC6kfo1-BWh1TsV6AeI_nowYXUHC1GZDvPTA6vkfNJuXhmXXi8fgNbMNoLehXHAqiezH9LiR5yX0vAtVpj4AAMn63Asqrfw1oRMceisQYvyWQainRNIIAkYI3LsUK-XNeJC1Ms2A2d31_udoJEdwJqM-SYn1Zvduxd89Ecg8tZg78aSdkBftBXixDCLFKZ')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 text-white font-mono-data text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-widest font-bold">
                CALISTHENICS
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-mono-data text-xs text-red-400 mb-1 uppercase tracking-widest font-semibold">
                @MinotaurLabs
              </p>
              <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase mb-2 leading-none italic">
                GRAVITY BREAKER
              </h3>
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-white font-bold text-sm bg-zinc-800 px-2.5 py-0.5 rounded-md border border-zinc-700">
                  $19.99
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Hyper-Density Phase */}
          <div
            onClick={() => {
              const lab = labyrinths.find((l) => l.id === 'hyper-density-001') || labyrinths[0];
              onSelectLabyrinth(lab);
            }}
            className="min-w-[290px] sm:min-w-[360px] md:min-w-[420px] aspect-[16/10] rounded-3xl overflow-hidden group border border-zinc-800 cursor-pointer shadow-xl bg-zinc-900 snap-start shrink-0 relative"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 grayscale"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAFD6IKjFJaEM5aI0padRGzijq3ABiiy9LkUdqjt2sHsY4yzjZwKPopqPsNGaLoD_kIjc1Pr0xJJUXjH3VayGqiHNETMYPnCKfgJwMkTd1ANxwS_oRY-37Mu6F6b0zhoqBB2R3dWD7epaqmPLyH8pnrJKONSH1e06ptxn2UFkt1fN3Ft9wMpzHhQcqsRZ-4I9cL_O3sy-nNEVLP4zaq4LVBFjRTsK15aZvETHqkJJ0UmxwyGgGXaanV')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 text-white font-mono-data text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-widest font-bold">
                HYPERTROPHY
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-mono-data text-xs text-red-400 mb-1 uppercase tracking-widest font-semibold">
                @alexrivers
              </p>
              <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase mb-2 leading-none italic">
                HYPER-DENSITY PHASE
              </h3>
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-white font-bold text-sm bg-red-600/90 px-2.5 py-0.5 rounded-md border border-red-500/40">
                  $49.00
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING THIS WEEK Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white italic">
              TRENDING THIS WEEK
            </h2>
          </div>
          <div className="h-[1px] flex-grow mx-6 bg-zinc-800" />
        </div>

        <div className="overflow-x-auto hide-scrollbar flex gap-4 pb-4">
          {/* Trending Card 1: The Olympian */}
          <div
            onClick={() => {
              const lab = labyrinths.find((l) => l.id === 'the-olympian') || labyrinths[0];
              onSelectLabyrinth(lab);
            }}
            className="min-w-[280px] md:min-w-[340px] rounded-3xl border border-zinc-800 bg-zinc-900 group cursor-pointer active:bg-zinc-800/80 transition-all overflow-hidden shadow-xl"
          >
            <div className="h-44 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500 grayscale"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiLwzOZwEuF0gG2Y5iTivziEYxrA7cPXq3aLcYuC57-w6waaVQSU3eY4_vuqh-akGorMrilv8XGV7uPHuH-ER1YGTW85-As2f8VySDuzHAbLKGypKBg99rOuJno6BGjsRgntlha6BZ07_R-Zm6IbqPYwcBVQEWfmIxntXJvp6fvEHg4AxZZoOh5oZu24YL-wNetejv8E8QXKFkOVRJ7Ef19VBUs_inTlJ2OToF4fd4ScwdosSNAZQ6')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-mono-data text-[10px] text-red-500 uppercase tracking-widest mb-1 font-bold">
                    PROGRAM BY @ZEUS
                  </p>
                  <h4 className="font-display font-black text-xl text-white uppercase italic">
                    THE OLYMPIAN
                  </h4>
                </div>
                <span className="text-white font-bold font-mono-data text-xs bg-red-600/90 px-2 py-0.5 rounded-md">
                  FREE
                </span>
              </div>
              <div className="flex items-center gap-4 text-zinc-400 font-mono-data text-xs uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" /> 12 WEEKS
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-red-500" /> ELITE
                </span>
              </div>
            </div>
          </div>

          {/* Trending Card 2: Basement Built */}
          <div
            onClick={() => {
              const lab = labyrinths.find((l) => l.id === 'basement-built') || labyrinths[0];
              onSelectLabyrinth(lab);
            }}
            className="min-w-[280px] md:min-w-[340px] rounded-3xl border border-zinc-800 bg-zinc-900 group cursor-pointer active:bg-zinc-800/80 transition-all overflow-hidden shadow-xl"
          >
            <div className="h-44 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500 grayscale"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCax8JMYYume3pmp2zKBkFnu2kr2zq0Piv6Ivb4i3GjTZNXWisiEQ_imWT-Ch_T8qT3o27CVIqTuPj7LRzEv_jC1v6xy8vjLFi2XPaiFBWyV0yHDo_9D_sAvffx3VZKTLiUyt5m4MqbomuY3Wmqa8fIwMmf0caQkG-ztqRTvNarOlsXKHl6kvYcWv3ZXXOgxvpc_34vq_RIFpHbI_WFszpAk0t8wF5opcYSX8otjmhjOZu-RFHi04Ql')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-mono-data text-[10px] text-red-500 uppercase tracking-widest mb-1 font-bold">
                    PROGRAM BY @GARAGELIFTER
                  </p>
                  <h4 className="font-display font-black text-xl text-white uppercase italic">
                    BASEMENT BUILT
                  </h4>
                </div>
                <span className="text-white font-bold font-mono-data text-xs bg-red-600/90 px-2 py-0.5 rounded-md">
                  FREE
                </span>
              </div>
              <div className="flex items-center gap-4 text-zinc-400 font-mono-data text-xs uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" /> 8 WEEKS
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-red-500" /> ADVANCED
                </span>
              </div>
            </div>
          </div>

          {/* Trending Card 3: Kettlebell Flow */}
          <div
            onClick={() => {
              const lab = labyrinths.find((l) => l.id === 'the-thread-002') || labyrinths[0];
              onSelectLabyrinth(lab);
            }}
            className="min-w-[280px] md:min-w-[340px] rounded-3xl border border-zinc-800 bg-zinc-900 group cursor-pointer active:bg-zinc-800/80 transition-all overflow-hidden shadow-xl"
          >
            <div className="h-44 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500 grayscale"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUrzyLxUMNna35esiVkV2zJifpPv9vopHhkmyRi9Tengsc0bqIbGfVjvoXlnOCRLA3BLFJknTosZiJBz_W7dDqO0GapxEUCrN6BgATwi5kTk-QaMif6L8DrxSPN_35hOMRGV1L09Wt6869SKKRYjdU13-8MPqDEcyfzSk1x4Oe5XkMaX6QlFQWQZPelMRPPie97BzPWSSZ42EeqERm2CMpP63XM2EjW0yni95RT834IvgaM1HZW3a6')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-mono-data text-[10px] text-red-500 uppercase tracking-widest mb-1 font-bold">
                    PROGRAM BY @IRONARCH
                  </p>
                  <h4 className="font-display font-black text-xl text-white uppercase italic">
                    KETTLEBELL FLOW
                  </h4>
                </div>
                <span className="text-white font-bold font-mono-data text-xs bg-red-600/90 px-2 py-0.5 rounded-md">
                  FREE
                </span>
              </div>
              <div className="flex items-center gap-4 text-zinc-400 font-mono-data text-xs uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" /> 4 WEEKS
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-red-500" /> INTERMEDIATE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Search Results if searched */}
      {searchQuery && (
        <section className="mb-12">
          <h3 className="font-mono-data text-xs uppercase tracking-widest text-zinc-400 mb-4 font-bold">
            SEARCH RESULTS ({filteredLabyrinths.length})
          </h3>
          <div className="space-y-3">
            {filteredLabyrinths.map((lab) => (
              <div
                key={lab.id}
                onClick={() => onSelectLabyrinth(lab)}
                className="border border-zinc-800 bg-zinc-900 rounded-2xl p-4 sm:p-5 flex justify-between items-center cursor-pointer hover:border-red-500 transition-colors shadow-md"
              >
                <div>
                  <h4 className="font-display font-bold text-lg text-white uppercase italic">
                    {lab.title}
                  </h4>
                  <p className="font-mono-data text-xs text-zinc-400">
                    by {lab.creator.name} • {lab.weeks} WKS • {lab.difficulty}
                  </p>
                </div>
                <span className="font-mono-data font-bold text-white text-sm bg-zinc-800 px-3 py-1 rounded-xl border border-zinc-700">
                  {lab.price}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
