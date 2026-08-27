import React from 'react';
import { Bell, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title?: string;
  onOpenNotifications?: () => void;
  unreadCount?: number;
  showBack?: boolean;
  onBack?: () => void;
  currentTab?: string;
  onOpenMenu?: () => void;
  onOpenFounderProfile?: () => void;
  onNewLabyrinth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'MINOTAUR',
  onOpenNotifications,
  unreadCount = 2,
  showBack = false,
  onBack,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-zinc-800/80 h-20 flex items-center justify-between px-5 sm:px-8">
      <div className="flex items-center gap-3 sm:gap-4">
        {showBack && (
          <button
            onClick={onBack}
            className="text-zinc-400 hover:text-white active:scale-95 transition-all p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800/60 cursor-pointer shadow-sm mr-1"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        )}

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter text-red-600 uppercase italic leading-none">
              {title}
            </h1>
          </div>
          <p className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-widest font-semibold mt-0.5 hidden xs:block">
            Forge Your Path through the Labyrinth
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold uppercase tracking-widest">
        <button
          onClick={onOpenNotifications}
          className="relative text-zinc-400 hover:text-white active:scale-95 transition-all p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800/60 cursor-pointer shadow-sm"
          title="Open Notifications"
        >
          <Bell className="w-4 h-4 text-zinc-300" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-600 rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
};

