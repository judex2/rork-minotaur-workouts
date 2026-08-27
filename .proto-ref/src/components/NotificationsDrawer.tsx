import React from 'react';
import { X, Bell, CheckCircle2, MessageSquare, Trophy, Sparkles, Flame, ArrowRight } from 'lucide-react';

export interface AppNotification {
  id: string;
  type: 'FOUNDER' | 'PR' | 'COMMUNITY' | 'SYSTEM';
  title: string;
  description: string;
  timeAgo: string;
  isRead: boolean;
  actionText?: string;
  linkTab?: 'HOME' | 'EXPLORE' | 'PROFILE';
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: 'HOME' | 'EXPLORE' | 'PROFILE') => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [notifications, setNotifications] = React.useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'FOUNDER',
      title: 'Alex Rivers [Founder] Replied',
      description: 'Reviewed your eccentric tempo on skullcrushers. "Keep humerus angled at 75° to unload medial elbow joint."',
      timeAgo: '12m ago',
      isRead: false,
      actionText: 'VIEW COMMS',
    },
    {
      id: 'notif-2',
      type: 'PR',
      title: 'New Personal Record Logged',
      description: 'You smashed your Close-Grip Bench PR: 45kg for 3x12 (+5kg over baseline).',
      timeAgo: '1h ago',
      isRead: false,
      actionText: 'VIEW STATS',
      linkTab: 'PROFILE',
    },
    {
      id: 'notif-3',
      type: 'COMMUNITY',
      title: 'Marcus Vance liked your post',
      description: '"Trusting the process. Finally breaking through the plateau on bench."',
      timeAgo: '3h ago',
      isRead: true,
      actionText: 'VIEW FEED',
    },
    {
      id: 'notif-4',
      type: 'SYSTEM',
      title: 'Week 6 Architecture Unlocked',
      description: 'Phase 2 Density Wave is ready for your next session in Nightwing Labyrinth.',
      timeAgo: '1d ago',
      isRead: true,
      actionText: 'START DAY',
      linkTab: 'HOME',
    },
  ]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'FOUNDER':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'PR':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'COMMUNITY':
        return <MessageSquare className="w-4 h-4 text-zinc-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#121212] border-l border-zinc-800 h-full flex flex-col shadow-2xl relative text-white">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-white uppercase italic tracking-tight">
                NOTIFICATIONS
              </h2>
              <p className="text-[10px] font-mono-data text-zinc-400 uppercase tracking-widest">
                Labyrinth Real-Time Alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="text-[10px] font-mono-data uppercase tracking-wider text-zinc-400 hover:text-red-400 font-bold px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
            >
              Mark Read
            </button>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all ${
                n.isRead
                  ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300'
                  : 'bg-zinc-900 border-red-600/40 shadow-lg shadow-red-950/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-800">
                    {getIcon(n.type)}
                  </div>
                  <h3 className="font-display font-bold text-sm text-white uppercase">
                    {n.title}
                  </h3>
                </div>
                <span className="font-mono-data text-[10px] text-zinc-500 uppercase shrink-0">
                  {n.timeAgo}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed pl-8 mb-3">
                {n.description}
              </p>

              {n.actionText && (
                <div className="pl-8 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (n.linkTab && onNavigateTab) {
                        onNavigateTab(n.linkTab);
                        onClose();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono-data font-bold text-red-400 hover:text-red-300 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {n.actionText} <ArrowRight className="w-3 h-3" />
                  </button>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 text-center">
          <p className="font-mono-data text-[10px] text-zinc-500 uppercase tracking-widest">
            Minotaur Architecture Engine v1.0
          </p>
        </div>
      </div>
    </div>
  );
};
