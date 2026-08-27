import React, { useState } from 'react';
import { GalleryImage } from '../types';
import { X, Camera, ArrowLeftRight, Check, Sparkles } from 'lucide-react';

interface PhotoLightboxModalProps {
  images: GalleryImage[];
  initialIndex: number;
  baselinePhoto?: string;
  onClose: () => void;
  onUpdateBaselinePhoto: (newUrl: string) => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  images,
  initialIndex,
  baselinePhoto,
  onClose,
  onUpdateBaselinePhoto,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isComparing, setIsComparing] = useState(true);
  const [showCameraSimulation, setShowCameraSimulation] = useState(false);

  const activeImage = images[currentIndex] || images[0];

  const currentBaseline =
    baselinePhoto ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBXxIK3POuj83VShJ3s6_QPxlQ4P_5zNwNofvhyW7UFj2We-Mwb83x1d_YbxBpVh_GKMLWlplNNboPReI6J0W23-a0u_nMuaCUzCZmHxxC_KBGTWrEJxNj8OD2_QfMh_n0PipxiSJMhdGziYyRXluTbOkebSmeGiOjd9_JL3TXH73oOlbGV9CiYKmhCw1s8qOKMZO3TMvM28-gCUbm-P-y7S36VmSvjlKsa0d1t684suVTCr9C7DlNU';

  const mockCaptureSamples = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDsneXmx2UlYMRihSyQN5q9F_BvK3d_c9J8nWdWQELGAzvwQjgI_wOGoOlSXTxCqGLFnt_pe8xvowjvGqefFcIHqJXFs9hRB5bgSRpO24TlVHzFzHkexvG2vX9Kw1RWBZfEWP34lclN907bH5OVCMUbci6uhLeZkXNBkR-YJ4K5ORBPfRW8i1ysOtJk74DV4QDKjI01EVeVwdfYpN-z9hviTVc4pfXFxLLYVRmUB_my0JgZFGwIaxvF',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAFD6IKjFJaEM5aI0padRGzijq3ABiiy9LkUdqjt2sHsY4yzjZwKPopqPsNGaLoD_kIjc1Pr0xJJUXjH3VayGqiHNETMYPnCKfgJwMkTd1ANxwS_oRY-37Mu6F6b0zhoqBB2R3dWD7epaqmPLyH8pnrJKONSH1e06ptxn2UFkt1fN3Ft9wMpzHhQcqsRZ-4I9cL_O3sy-nNEVLP4zaq4LVBFjRTsK15aZvETHqkJJ0UmxwyGgGXaanV',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 md:p-8 select-none font-sans">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10 relative">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono-data text-xs text-red-500 font-bold uppercase tracking-widest">
              {activeImage.date} • PROGRESS ARCHIVE
            </span>
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase italic tracking-tight">
            {activeImage.caption}
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsComparing(!isComparing)}
            className={`px-3.5 py-2 rounded-xl font-mono-data text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer border transition-all ${
              isComparing
                ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-900/40'
                : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            {isComparing ? 'SPLIT VIEW' : 'SINGLE VIEW'}
          </button>

          <button
            onClick={() => setShowCameraSimulation(true)}
            className="px-3.5 py-2 rounded-xl font-mono-data text-xs font-bold uppercase border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-red-500" />
            UPDATE BASELINE
          </button>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="flex-1 flex items-center justify-center p-2 relative my-4 overflow-hidden z-10">
        {isComparing ? (
          <div className="relative w-full max-w-2xl aspect-[4/3] sm:aspect-[16/9] rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-950 shadow-2xl">
            {/* Baseline Image (Underneath) */}
            <div className="absolute inset-0">
              <img
                src={currentBaseline}
                alt="Baseline"
                className="w-full h-full object-cover grayscale brightness-90"
              />
              <div className="absolute top-4 left-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 px-3 py-1 rounded-lg font-mono-data text-xs text-white font-bold uppercase">
                DAY 0 BASELINE
              </div>
            </div>

            {/* Current Image (Clipped by slider) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img
                src={activeImage.imageUrl}
                alt="Current progress"
                className="w-full h-full object-cover grayscale brightness-110 contrast-125"
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg font-mono-data text-xs font-black uppercase shadow-lg shadow-red-900/50">
                CURRENT PHYSIQUE ({activeImage.date})
              </div>
            </div>

            {/* Slider Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-red-600 cursor-ew-resize shadow-2xl flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center -translate-x-1/2 shadow-xl shadow-red-950 border border-white">
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Range Input for Dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
            />
          </div>
        ) : (
          <div className="max-w-2xl max-h-full border border-zinc-800 rounded-3xl p-3 bg-zinc-950 overflow-hidden shadow-2xl">
            <img
              src={activeImage.imageUrl}
              alt={activeImage.caption}
              className="max-h-[65vh] object-contain grayscale rounded-2xl"
            />
          </div>
        )}
      </div>

      {/* Thumbnails strip */}
      <div className="flex justify-center gap-3 overflow-x-auto py-2 z-10">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setCurrentIndex(idx)}
            className={`w-14 h-14 rounded-xl cursor-pointer overflow-hidden transition-all ${
              currentIndex === idx
                ? 'border-2 border-red-600 scale-105 shadow-lg shadow-red-900/40'
                : 'border border-zinc-800 opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={img.imageUrl}
              alt={img.caption}
              className="w-full h-full object-cover grayscale"
            />
          </button>
        ))}
      </div>

      {/* Baseline Capture Simulation Drawer */}
      {showCameraSimulation && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] max-w-md w-full p-6 space-y-4 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h4 className="font-display font-black text-lg text-white uppercase italic">
                CAPTURE BASELINE PHYSIQUE
              </h4>
              <button
                onClick={() => setShowCameraSimulation(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Select a baseline snapshot. Minotaur automatically pairs this photo when you join any Labyrinth for seamless progress comparison.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {mockCaptureSamples.map((src, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onUpdateBaselinePhoto(src);
                    setShowCameraSimulation(false);
                  }}
                  className="aspect-square rounded-2xl border border-zinc-800 hover:border-red-500 cursor-pointer overflow-hidden relative group transition-all"
                >
                  <img src={src} alt="Snapshot sample" className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-red-950/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-2 left-2 bg-zinc-950/90 border border-zinc-800 text-white px-2 py-1 rounded-lg font-mono-data text-[10px] uppercase font-bold">
                    USE PHOTO #{i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
