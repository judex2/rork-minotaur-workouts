import React from 'react';
import { TabType } from '../types';

export type MainTab = 'home' | 'explore' | 'profile' | 'HOME' | 'EXPLORE' | 'PROFILE';

interface BottomNavProps {
  currentTab?: TabType | string;
  onSelectTab?: (tab: TabType) => void;
  activeTab?: MainTab;
  onTabChange?: (tab: any) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  activeTab,
  onTabChange,
}) => {
  const current = (currentTab || activeTab || 'HOME').toString().toUpperCase();

  const handleTab = (tab: 'HOME' | 'EXPLORE' | 'PROFILE') => {
    if (onSelectTab) onSelectTab(tab as TabType);
    if (onTabChange) onTabChange(tab.toLowerCase());
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex justify-center pointer-events-auto select-none">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 px-8 sm:px-12 py-3 rounded-full flex items-center space-x-10 sm:space-x-14 text-zinc-400 font-bold uppercase text-xs tracking-widest shadow-2xl shadow-black/90">
        {/* Home Tab */}
        <button
          onClick={() => handleTab('HOME')}
          className={`flex items-center gap-1.5 transition-all cursor-pointer py-1 px-2 rounded-xl ${
            current === 'HOME' ? 'text-red-500 font-black scale-105' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="font-mono-data text-xs font-bold tracking-wider">Home</span>
        </button>

        {/* Explore Tab */}
        <button
          onClick={() => handleTab('EXPLORE')}
          className={`flex items-center gap-1.5 transition-all cursor-pointer py-1 px-2 rounded-xl ${
            current === 'EXPLORE' ? 'text-red-500 font-black scale-105' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="font-mono-data text-xs font-bold tracking-wider">Explore</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => handleTab('PROFILE')}
          className={`flex items-center gap-1.5 transition-all cursor-pointer py-1 px-2 rounded-xl ${
            current === 'PROFILE' ? 'text-red-500 font-black scale-105' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="font-mono-data text-xs font-bold tracking-wider">Profile</span>
        </button>
      </div>
    </nav>
  );
};

