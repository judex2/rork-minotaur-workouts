import React, { useState, useEffect } from 'react';
import { Labyrinth, LabyrinthDay, Exercise } from '../types';
import {
  X,
  Info,
  Video,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Check,
  RefreshCw,
  Timer as TimerIcon,
  Sparkles,
  Camera,
  Share2,
  Plus,
  AlertCircle,
} from 'lucide-react';

interface ActiveWorkoutViewProps {
  labyrinth: Labyrinth;
  dayIndex: number;
  onClose: () => void;
  onFinishWorkout: (summary: {
    durationFormatted: string;
    totalVolumeKg: number;
    completedSetsCount: number;
    sessionNotes: string;
  }) => void;
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  labyrinth,
  dayIndex,
  onClose,
  onFinishWorkout,
}) => {
  const currentDay = labyrinth.programDays[dayIndex] || labyrinth.programDays[0];

  // Master Workout Stopwatch Timer state
  const [secondsElapsed, setSecondsElapsed] = useState<number>(102); // 01:42 starting time
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Form Check Video preview toggle
  const [isPlayingFormCheck, setIsPlayingFormCheck] = useState<boolean>(false);

  // Exercise states
  // Weight & Reps per exercise & set: key = `${exerciseId}-${setIdx}`
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [reps, setReps] = useState<Record<string, number>>({});
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({
    'ex-1-0': true, // First set completed initially
  });

  // Active rest timer countdown
  const [restCountdown, setRestCountdown] = useState<number>(102); // 01:42 initially
  const [restTotalDuration, setRestTotalDuration] = useState<number>(120);
  const [activeRestSetKey, setActiveRestSetKey] = useState<string | null>('ex-1-0');

  // Initialize weights & reps from exercise defaults
  useEffect(() => {
    const initialWeights: Record<string, number> = {};
    const initialReps: Record<string, number> = {};

    currentDay.exercises.forEach((ex) => {
      for (let s = 0; s < ex.setsCount; s++) {
        const key = `${ex.id}-${s}`;
        initialWeights[key] = ex.defaultWeightKg;
        initialReps[key] = ex.defaultReps;
      }
    });

    setWeights(initialWeights);
    setReps(initialReps);
  }, [currentDay]);

  // Master stopwatch timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Rest timer countdown loop
  useEffect(() => {
    let timer: any = null;
    if (restCountdown !== null && restCountdown > 0) {
      timer = setInterval(() => {
        setRestCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [restCountdown]);

  const formatStopwatch = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRestTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sync repeat weight to all sets of an exercise
  const handleSyncWeight = (exerciseId: string, setsCount: number, weightValue: number) => {
    setWeights((prev) => {
      const updated = { ...prev };
      for (let s = 0; s < setsCount; s++) {
        updated[`${exerciseId}-${s}`] = weightValue;
      }
      return updated;
    });
  };

  const toggleSetCompletion = (setKey: string) => {
    setCompletedSets((prev) => {
      const nextVal = !prev[setKey];
      if (nextVal) {
        // Automatically start rest timer when a set is completed
        setActiveRestSetKey(setKey);
        setRestCountdown(90);
        setRestTotalDuration(90);
      }
      return {
        ...prev,
        [setKey]: nextVal,
      };
    });
  };

  const startRestTimer = (setKey: string, durationSeconds: number = 90) => {
    setActiveRestSetKey(setKey);
    setRestCountdown(durationSeconds);
    setRestTotalDuration(durationSeconds);
  };

  const add30SecondsRest = () => {
    setRestCountdown((prev) => (prev || 0) + 30);
    setRestTotalDuration((prev) => prev + 30);
  };

  const calculateProgress = () => {
    let totalSets = 0;
    let completedCount = 0;
    currentDay.exercises.forEach((ex) => {
      totalSets += ex.setsCount;
      for (let s = 0; s < ex.setsCount; s++) {
        if (completedSets[`${ex.id}-${s}`]) {
          completedCount++;
        }
      }
    });
    return totalSets > 0 ? Math.round((completedCount / totalSets) * 100) : 25;
  };

  const handleFinish = () => {
    let totalVolume = 0;
    let completedCount = 0;

    currentDay.exercises.forEach((ex) => {
      for (let s = 0; s < ex.setsCount; s++) {
        const key = `${ex.id}-${s}`;
        if (completedSets[key]) {
          completedCount++;
          const w = weights[key] || ex.defaultWeightKg;
          const r = reps[key] || ex.defaultReps;
          totalVolume += w * r;
        }
      }
    });

    onFinishWorkout({
      durationFormatted: formatStopwatch(secondsElapsed),
      totalVolumeKg: totalVolume,
      completedSetsCount: completedCount,
      sessionNotes: currentDay.sessionNotes,
    });
  };

  const currentProgressPercent = calculateProgress();

  // SVG Circular Dash calculation
  const circumference = 552.92;
  const restRatio = restTotalDuration > 0 ? (restCountdown || 0) / restTotalDuration : 0;
  const strokeDashoffset = circumference - restRatio * circumference;

  const currentExercise = currentDay.exercises[0] || {
    name: 'Barbell Back Squat',
    target: 'Quads & Glutes',
    defaultReps: 10,
    defaultWeightKg: 60,
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] text-white flex flex-col font-sans overflow-hidden select-none">
      {/* Immersive UI Radial Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Active Session Top Navigation Bar */}
      <header className="shrink-0 pt-5 pb-4 px-5 sm:px-6 border-b border-zinc-800/80 bg-[#0A0A0A]/95 backdrop-blur-xl z-20 flex flex-col relative">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest font-mono-data">
              ACTIVE WORKOUT
            </p>
          </div>

          {/* Working 'X' exit button with custom confirmation modal */}
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-sm"
            title="Exit workout"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight italic leading-tight">
              {currentDay.routineName}
            </h1>
            <p className="text-xs text-zinc-400 font-medium italic mt-0.5">
              Intensity Phase • Set 2 of 4
            </p>
          </div>
          <span className="font-mono-data text-xs text-red-400 font-bold px-2.5 py-1 bg-red-950/40 border border-red-900/40 rounded-full">
            {currentProgressPercent}% COMPLETE
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(220,38,38,0.8)]"
            style={{ width: `${Math.max(currentProgressPercent, 8)}%` }}
          />
        </div>
      </header>

      {/* MASTER WORKOUT TIMER CONTROL BAR */}
      <div className="shrink-0 bg-zinc-950/90 border-b border-zinc-800/80 px-5 py-3 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono-data text-base sm:text-lg font-black tracking-wider text-white">
            <Clock className="w-4 h-4 text-red-500" />
            <span>{formatStopwatch(secondsElapsed)}</span>
          </div>
          <span
            className={`font-mono-data text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
              isTimerRunning
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                : 'bg-amber-950/40 text-amber-400 border-amber-800/50'
            }`}
          >
            {isTimerRunning ? 'ACTIVE' : 'PAUSED'}
          </span>
        </div>

        {/* MASTER TIMER PAUSE / START / RESET CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`font-mono-data text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              isTimerRunning
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700'
                : 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-md shadow-red-950'
            }`}
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                <span>START</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setSecondsElapsed(0);
              setIsTimerRunning(true);
            }}
            className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Master Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Workout Stage */}
      <main className="flex-1 overflow-y-auto hide-scrollbar p-5 space-y-6 max-w-3xl mx-auto w-full pb-36 z-10">
        {/* HERO REST TIMER STAGE */}
        <section className="bg-zinc-900 rounded-[32px] sm:rounded-[36px] border border-zinc-800 p-6 sm:p-8 flex flex-col relative overflow-hidden shadow-2xl border-red-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.12)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center">
              {/* Circular SVG Timer */}
              <svg className="w-44 h-44 sm:w-56 sm:h-56 -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-zinc-800"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-red-600 transition-all duration-1000"
                  fill="transparent"
                  strokeDasharray="502.65"
                  strokeDashoffset={502.65 - restRatio * 502.65}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute text-center flex flex-col items-center">
                <span className="text-4xl sm:text-5xl font-black font-mono-data tracking-tight text-white">
                  {formatRestTime(restCountdown || 0)}
                </span>
                <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider font-mono-data mt-1">
                  Rest Time Remaining
                </p>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                {currentExercise.name}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                Target: {currentExercise.defaultReps} Reps • {currentExercise.defaultWeightKg}kg • {currentExercise.target}
              </p>
            </div>

            {/* Quick Rest Timer Controls */}
            <div className="grid grid-cols-2 gap-4 w-full pt-1">
              <button
                onClick={add30SecondsRest}
                className="py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold border border-zinc-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-xs sm:text-sm font-mono-data uppercase tracking-wider shadow-sm"
              >
                <Plus className="w-4 h-4" /> 30S REST
              </button>
              <button
                onClick={() => {
                  setRestCountdown(0);
                }}
                className="py-3.5 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold uppercase tracking-tighter transition-all cursor-pointer active:scale-95 text-xs sm:text-sm shadow-md"
              >
                NEXT SET →
              </button>
            </div>
          </div>
        </section>

        {/* Text Block: Session Notes */}
        <section className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5 sm:p-6 shadow-xl">
          <h2 className="font-mono-data text-xs text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2 font-bold">
            <Info className="w-4 h-4 text-red-500" />
            SESSION NOTES & CUES
          </h2>
          <p className="text-xs sm:text-sm text-zinc-200 uppercase tracking-wide leading-relaxed font-semibold">
            {currentDay.sessionNotes}
          </p>
        </section>

        {/* Media Block: Form Check Video */}
        <section className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5 sm:p-6 shadow-xl">
          <h2 className="font-mono-data text-xs text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-bold">
            <Video className="w-4 h-4 text-red-500" />
            {currentDay.formCheckTitle}
          </h2>

          <div
            onClick={() => setIsPlayingFormCheck(!isPlayingFormCheck)}
            className="relative w-full aspect-video rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center overflow-hidden group cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center grayscale opacity-60 group-hover:opacity-40 transition-opacity"
              style={{ backgroundImage: `url('${currentDay.formCheckImage}')` }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-900/50 group-hover:scale-110 transition-transform">
                {isPlayingFormCheck ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white translate-x-0.5" />
                )}
              </div>
              <span className="font-mono-data text-[10px] uppercase text-white font-bold tracking-widest mt-3 bg-zinc-900/90 px-3 py-1 rounded-full border border-zinc-700">
                {isPlayingFormCheck ? 'PAUSE FORM DEMO' : 'PLAY FORM DEMO'}
              </span>
            </div>

            {isPlayingFormCheck && (
              <div className="absolute bottom-3 left-3 right-3 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl p-2.5 text-center">
                <span className="font-mono-data text-[11px] text-zinc-200 block uppercase font-bold">
                  TEMPO: 3-0-1-0 • 3-SECOND ECCENTRIC CONTROL
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Exercise Sections */}
        {currentDay.exercises.map((ex, exIdx) => {
          const syncKey = `${ex.id}-0`;
          const currentRepeatWeight = weights[syncKey] ?? ex.defaultWeightKg;

          return (
            <section
              key={ex.id}
              className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5 sm:p-6 shadow-xl flex flex-col space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-[10px] font-mono-data text-red-500 font-bold uppercase tracking-wider block">
                    MOVEMENT 0{exIdx + 1}
                  </span>
                  <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase m-0 leading-tight">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-zinc-400">{ex.target}</p>
                </div>
                <span className="font-mono-data text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full uppercase tracking-widest font-bold border border-zinc-700/50">
                  {ex.setsCount} × {ex.defaultReps}
                </span>
              </div>

              {/* Sync Control */}
              <div className="flex items-center gap-3 py-3 border-y border-zinc-800/80">
                <span className="font-mono-data text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                  REPEAT WEIGHT:
                </span>
                <input
                  type="number"
                  value={currentRepeatWeight}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setWeights((prev) => ({ ...prev, [syncKey]: val }));
                  }}
                  className="w-16 bg-zinc-800 border border-zinc-700 focus:border-red-500 rounded-lg text-white font-mono-data text-center py-1 text-sm outline-none"
                />
                <span className="font-mono-data text-xs text-zinc-400 uppercase">KG</span>
                <button
                  onClick={() => handleSyncWeight(ex.id, ex.setsCount, currentRepeatWeight)}
                  className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer ml-auto flex items-center gap-1.5 font-mono-data text-xs uppercase px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50"
                  title="Sync weight to all sets"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>SYNC ALL</span>
                </button>
              </div>

              {/* Set Rows */}
              <div className="flex flex-col space-y-2.5">
                {Array.from({ length: ex.setsCount }).map((_, setIdx) => {
                  const setKey = `${ex.id}-${setIdx}`;
                  const isCompleted = !!completedSets[setKey];
                  const currentWeight = weights[setKey] ?? ex.defaultWeightKg;
                  const currentRep = reps[setKey] ?? ex.defaultReps;
                  const isRestActiveForSet = activeRestSetKey === setKey && restCountdown !== null;

                  const isActive = !isCompleted && (setIdx === 0 || completedSets[`${ex.id}-${setIdx - 1}`]);

                  return (
                    <div
                      key={setIdx}
                      className={`flex items-center p-3 sm:p-3.5 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-zinc-800/90 border border-red-600/50 shadow-lg shadow-red-950/20'
                          : isCompleted
                          ? 'bg-zinc-950/50 border border-zinc-800/60 opacity-60'
                          : 'bg-zinc-950/80 border border-zinc-800/80'
                      }`}
                    >
                      {/* Set Number */}
                      <span
                        className={`w-7 sm:w-8 font-mono-data text-xs font-bold ${
                          isActive ? 'text-red-400' : 'text-zinc-400'
                        }`}
                      >
                        0{setIdx + 1}
                      </span>

                      {/* Weight x Reps Inputs */}
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="number"
                          value={currentWeight}
                          onChange={(e) =>
                            setWeights((prev) => ({
                              ...prev,
                              [setKey]: Number(e.target.value),
                            }))
                          }
                          className="w-12 sm:w-14 bg-zinc-900 border border-zinc-700 focus:border-red-500 rounded-lg text-white font-mono-data text-center py-1 text-xs sm:text-sm outline-none"
                        />
                        <span className="font-mono-data text-[10px] text-zinc-400 uppercase font-semibold">
                          KG
                        </span>
                        <span className="text-zinc-500 mx-0.5 sm:mx-1">×</span>
                        <input
                          type="number"
                          value={currentRep}
                          onChange={(e) =>
                            setReps((prev) => ({
                              ...prev,
                              [setKey]: Number(e.target.value),
                            }))
                          }
                          className="w-10 sm:w-12 bg-zinc-900 border border-zinc-700 focus:border-red-500 rounded-lg text-white font-mono-data text-center py-1 text-xs sm:text-sm outline-none"
                        />
                        <span className="font-mono-data text-[10px] text-zinc-400 uppercase font-semibold">
                          REPS
                        </span>
                      </div>

                      {/* Right controls */}
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <button
                          onClick={() => startRestTimer(setKey, ex.restSeconds || 90)}
                          className={`font-mono-data text-xs px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 border transition-all cursor-pointer ${
                            isRestActiveForSet
                              ? 'bg-red-600 text-white border-red-600 font-bold shadow-lg shadow-red-900/40'
                              : 'text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                          }`}
                          title="Start rest timer"
                        >
                          <TimerIcon className="w-3.5 h-3.5" />
                          <span>
                            {isRestActiveForSet
                              ? formatRestTime(restCountdown!)
                              : formatRestTime(ex.restSeconds || 90)}
                          </span>
                        </button>

                        <button
                          onClick={() => toggleSetCompletion(setKey)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                            isCompleted
                              ? 'border-red-600 bg-red-600 text-white shadow-lg shadow-red-900/40'
                              : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900 text-zinc-400'
                          }`}
                          title="Mark set completed"
                        >
                          <Check className={`w-4 h-4 sm:w-5 sm:h-5 ${isCompleted ? 'stroke-[3]' : 'opacity-40'}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Persistent Footer Action */}
      <footer className="fixed bottom-0 left-0 w-full p-4 sm:p-5 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-zinc-800 z-30 flex justify-center">
        <div className="max-w-3xl w-full">
          <button
            onClick={handleFinish}
            className="w-full py-4 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-white text-sm sm:text-base hover:bg-red-500 active:scale-[0.99] transition-all cursor-pointer shadow-xl shadow-red-900/40 border border-red-500"
          >
            FINISH LABYRINTH WORKOUT
          </button>
        </div>
      </footer>

      {/* Custom Sleek Exit Confirmation Modal replacing blocking window.confirm */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center mx-auto text-red-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white uppercase italic">
                EXIT WORKOUT?
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Your completed sets and session timer will be safely preserved.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono-data text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                RESUME
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onClose();
                }}
                className="py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono-data text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-red-950"
              >
                EXIT SESSION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
