import React, { useState } from 'react';
import { Labyrinth, DirectMessage } from '../types';
import { X, Send, ShieldCheck, Zap, HelpCircle, CheckCheck } from 'lucide-react';

interface DirectCommsDrawerProps {
  labyrinth: Labyrinth;
  messages: DirectMessage[];
  onClose: () => void;
  onSendMessage: (text: string) => void;
  onToggleCommsEnabled?: (enabled: boolean) => void;
}

export const DirectCommsDrawer: React.FC<DirectCommsDrawerProps> = ({
  labyrinth,
  messages,
  onClose,
  onSendMessage,
  onToggleCommsEnabled,
}) => {
  const [inputText, setInputText] = useState('');
  const isEnabled = labyrinth.directCommsEnabled;

  const quickPrompts = [
    'Check my eccentric tempo on Skullcrushers',
    'Elbow discomfort on close-grip bench',
    'Should I deload on Block 3?',
    'What weight progression for next week?',
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-zinc-900 border-l border-zinc-800 h-full flex flex-col font-sans select-none text-white shadow-2xl relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.1)_0%,transparent_70%)] pointer-events-none" />

        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden relative shadow-md">
              <img
                src={labyrinth.creator.avatarUrl}
                alt={labyrinth.creator.name}
                className="w-full h-full object-cover grayscale"
              />
              <span
                className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${
                  isEnabled ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]' : 'bg-zinc-600'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-black text-sm text-white uppercase italic tracking-tight">
                  {labyrinth.creator.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-red-500 fill-red-950 inline-block" />
              </div>
              <span className="font-mono-data text-[10px] text-zinc-400 uppercase font-semibold">
                {isEnabled ? 'DIRECT COMMS: ONLINE' : 'DIRECT COMMS: PAUSED'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Owner Settings Banner if user is founder */}
        {labyrinth.isFounded && onToggleCommsEnabled && (
          <div className="bg-zinc-950/90 border-b border-zinc-800 px-5 py-2.5 flex items-center justify-between z-10">
            <span className="font-mono-data text-[10px] text-zinc-400 uppercase font-semibold">
              OWNER COMMS SWITCH
            </span>
            <button
              onClick={() => onToggleCommsEnabled(!isEnabled)}
              className={`px-3 py-1 rounded-lg font-mono-data text-[10px] font-bold uppercase transition-all cursor-pointer ${
                isEnabled ? 'bg-red-600 text-white shadow-md shadow-red-900/40' : 'border border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              {isEnabled ? 'DISABLE DMS' : 'ENABLE DMS'}
            </button>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 z-10">
          <div className="text-center py-4 border-b border-zinc-800/60">
            <span className="font-mono-data text-[10px] text-red-500 font-bold uppercase tracking-widest block mb-1">
              ENCRYPTED ATHLETIC THREAD
            </span>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Direct technical guidance with {labyrinth.creator.name}. Inquiries regarding biomechanics, tempo, and loading.
            </p>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'USER';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    isUser
                      ? 'bg-red-600 text-white shadow-xl shadow-red-950/50'
                      : 'bg-zinc-950 text-zinc-100 border border-zinc-800 shadow-md'
                  }`}
                >
                  <span
                    className={`font-mono-data text-[9px] uppercase font-bold tracking-widest block mb-1 ${
                      isUser ? 'text-red-200' : 'text-red-500'
                    }`}
                  >
                    {msg.senderName} • {msg.timestamp}
                  </span>
                  <p className="text-xs md:text-sm font-sans leading-relaxed">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[9px] font-mono-data text-zinc-500 px-1">
                  <CheckCheck className="w-3 h-3 text-red-500" />
                  <span>DELIVERED</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Prompts Bar */}
        {isEnabled && (
          <div className="p-3 border-t border-zinc-800 bg-zinc-950 overflow-x-auto hide-scrollbar flex gap-2 z-10">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(prompt)}
                className="whitespace-nowrap border border-zinc-800 bg-zinc-900 hover:border-red-500 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-mono-data text-zinc-300 uppercase cursor-pointer transition-all active:scale-95"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2 z-10"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!isEnabled}
            placeholder={
              isEnabled
                ? `Message ${labyrinth.creator.name}...`
                : 'Direct messages currently disabled by creator.'
            }
            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-xs font-sans text-white outline-none disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            disabled={!isEnabled || !inputText.trim()}
            className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-500 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-red-900/40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
