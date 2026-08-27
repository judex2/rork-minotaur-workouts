import React, { useState } from 'react';
import { Labyrinth, CategoryType, DifficultyType, Exercise, LabyrinthDay } from '../types';
import {
  X,
  MoreVertical,
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  FileText,
  Image as ImageIcon,
  Upload,
  Maximize2,
  ChevronRight,
  Check,
  Sparkles,
} from 'lucide-react';

interface CreateLabyrinthModalProps {
  onClose: () => void;
  onCreate: (newLabyrinth: Labyrinth) => void;
}

interface BuilderExerciseBlock {
  id: string;
  name: string;
  sets: number | string;
  reps: string;
  rest: string;
  notes: string;
  target?: string;
  weightKg?: number;
}

interface BuilderDay {
  id: string;
  dayNumber: number;
  title: string;
  sessionNotes: string;
  attachedMedia: string[];
  exercises: BuilderExerciseBlock[];
}

export const CreateLabyrinthModal: React.FC<CreateLabyrinthModalProps> = ({
  onClose,
  onCreate,
}) => {
  // Routine Configuration State
  const [structure, setStructure] = useState<'MULTI_DAY' | 'SINGLE'>('MULTI_DAY');
  const [durationMode, setDurationMode] = useState<'FIXED' | 'ONGOING'>('FIXED');
  const [weeksCount, setWeeksCount] = useState<number>(12);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [category, setCategory] = useState<CategoryType>('HYPERTROPHY');
  const [difficulty, setDifficulty] = useState<DifficultyType>('ADVANCED');
  const [programTitle, setProgramTitle] = useState('CUSTOM LABYRINTH PROTOCOL');

  // Days list state
  const [days, setDays] = useState<BuilderDay[]>([
    {
      id: 'day-1',
      dayNumber: 1,
      title: 'DAY 1: UPPER BODY HEAVY',
      sessionNotes: 'Focus on maximum mechanical tension, scapular retraction, and explosive concentric drive.',
      attachedMedia: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAFD6IKjFJaEM5aI0padRGzijq3ABiiy9LkUdqjt2sHsY4yzjZwKPopqPsNGaLoD_kIjc1Pr0xJJUXjH3VayGqiHNETMYPnCKfgJwMkTd1ANxwS_oRY-37Mu6F6b0zhoqBB2R3dWD7epaqmPLyH8pnrJKONSH1e06ptxn2UFkt1fN3Ft9wMpzHhQcqsRZ-4I9cL_O3sy-nNEVLP4zaq4LVBFjRTsK15aZvETHqkJJ0UmxwyGgGXaanV',
      ],
      exercises: [
        {
          id: 'b-1',
          name: 'BARBELL BENCH PRESS',
          sets: '4',
          reps: '4-6',
          rest: '180s',
          notes: 'Add specific notes (e.g. 3 second negative tempo on eccentric phase)...',
          target: 'Chest & Triceps',
          weightKg: 85,
        },
        {
          id: 'b-2',
          name: 'INCLINE DUMBBELL PRESS',
          sets: '3',
          reps: '8-10',
          rest: '90s',
          notes: 'Keep 30-degree incline, strict elbow flare at 45 degrees.',
          target: 'Upper Chest',
          weightKg: 34,
        },
      ],
    },
    {
      id: 'day-2',
      dayNumber: 2,
      title: 'DAY 2: LOWER BODY VOLUME',
      sessionNotes: 'Deep knee flexion, paused squats in the hole, and hamstring curl drop-sets.',
      attachedMedia: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBq5E9N0m-7ARvDaWNUplzb6klHJUo9yHaedeyBuVVxXI1v6s9GyWtUHWkFgg6Oa0P13CkidEHbjqdqv6twCQ7_Tfp8DJwBsjuhQcm2jSPfsUFG1NOWAae91FSD9Mr6rPVH3cNWU4_MCqRvBJ6KwRGXzn_EdATDCQLM8rHD5m9DF9S5RQ8wGRGBaWdZbRxRDzLCYfRkLe1WpORJr3IHn_vqfbl3yZqmYnML_XNzWeLdwf6cTvWNc5kg',
      ],
      exercises: [
        {
          id: 'b-3',
          name: 'BARBELL BACK SQUAT',
          sets: '4',
          reps: '6-8',
          rest: '180s',
          notes: '2-second pause in the hole, violent hip drive on ascent.',
          target: 'Quads & Glutes',
          weightKg: 120,
        },
        {
          id: 'b-4',
          name: 'ROMANIAN DEADLIFT',
          sets: '3',
          reps: '8-10',
          rest: '120s',
          notes: 'Hips back, stretch hamstrings fully without spinal flexion.',
          target: 'Hamstrings',
          weightKg: 100,
        },
      ],
    },
    {
      id: 'day-3',
      dayNumber: 3,
      title: 'DAY 3: ACTIVE RECOVERY',
      sessionNotes: 'Thoracic mobility drills, dead hangs, and 30-minute steady state cardio.',
      attachedMedia: [],
      exercises: [
        {
          id: 'b-5',
          name: 'DEAD HANG GRIP & MOBILITY',
          sets: '3',
          reps: '45s',
          rest: '60s',
          notes: 'Full scapular decompression, deep diaphragmatic breathing.',
          target: 'Forearms & Spine',
          weightKg: 0,
        },
      ],
    },
  ]);

  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const activeDay = days[activeDayIndex] || days[0];

  // Helper for generating block labels A, B, C, D...
  const getBlockLetter = (index: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index % letters.length] || `${index + 1}`;
  };

  // Add a new day to the program
  const handleAddDay = () => {
    const nextNum = days.length + 1;
    const newDay: BuilderDay = {
      id: `day-${Date.now()}`,
      dayNumber: nextNum,
      title: `DAY ${nextNum}: NEW SESSION`,
      sessionNotes: '',
      attachedMedia: [],
      exercises: [
        {
          id: `b-${Date.now()}`,
          name: 'PRIMARY COMPOUND LIFT',
          sets: '4',
          reps: '8-10',
          rest: '90s',
          notes: '',
          target: 'Main Focus',
          weightKg: 60,
        },
      ],
    };

    setDays([...days, newDay]);
    setActiveDayIndex(days.length); // Switch to the newly created day
  };

  // Delete a day
  const handleDeleteDay = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (days.length <= 1) return;
    const updated = days.filter((_, i) => i !== index).map((d, i) => ({
      ...d,
      dayNumber: i + 1,
    }));
    setDays(updated);
    if (activeDayIndex >= updated.length) {
      setActiveDayIndex(updated.length - 1);
    }
  };

  // Update active day title
  const handleUpdateDayTitle = (newTitle: string) => {
    setDays(
      days.map((d, i) => (i === activeDayIndex ? { ...d, title: newTitle.toUpperCase() } : d))
    );
  };

  // Update active day session notes
  const handleUpdateSessionNotes = (notes: string) => {
    setDays(
      days.map((d, i) => (i === activeDayIndex ? { ...d, sessionNotes: notes } : d))
    );
  };

  // Add exercise to active day
  const handleAddExerciseToActiveDay = () => {
    const nextLetter = getBlockLetter(activeDay.exercises.length);
    const newEx: BuilderExerciseBlock = {
      id: `b-${Date.now()}`,
      name: `NEW EXERCISE ${nextLetter}`,
      sets: '3',
      reps: '10-12',
      rest: '90s',
      notes: '',
      target: 'Muscle Target',
      weightKg: 40,
    };

    setDays(
      days.map((d, i) =>
        i === activeDayIndex
          ? { ...d, exercises: [...d.exercises, newEx] }
          : d
      )
    );
  };

  // Delete exercise block from active day
  const handleDeleteExercise = (exId: string) => {
    if (activeDay.exercises.length <= 1) return;
    setDays(
      days.map((d, i) =>
        i === activeDayIndex
          ? { ...d, exercises: d.exercises.filter((ex) => ex.id !== exId) }
          : d
      )
    );
  };

  // Update specific exercise field in active day
  const handleUpdateExercise = (
    exId: string,
    field: keyof BuilderExerciseBlock,
    value: any
  ) => {
    setDays(
      days.map((d, i) =>
        i === activeDayIndex
          ? {
              ...d,
              exercises: d.exercises.map((ex) =>
                ex.id === exId ? { ...ex, [field]: value } : ex
              ),
            }
          : d
      )
    );
  };

  // Add sample/uploaded image to media
  const handleAddMedia = () => {
    const sampleImages = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKiOZgAfLnYEKL24VT1uLv7M60hKQvtXI7lrUbUYo9Yx6fYbRu61-KAZTK9UPbi6AiQpIOSMsFPOO6o7eWtmNJZwmrLdZBKHts9QGyiAPWceyPNk5_dOCl1V_lebAA9w5FZvn4C5vqh-a_p5qkOcLRvNJNSm-XmmIrePeu5mG87DjDfZfI3UQM1_4tDAJjU46BksJqxNhPrjR1K4HYI0vCt5dy-gt3s9tBEz_OWqiZ7kWiXJRpPfk4',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChR3otxGLuHDB_lBIjVb-t3I-pDW0utXSCxRK4Aj2p8ESeMYWmDq0A1ARDOPNTprd5pBQTjnkvZO4ps6kWgzSbDqsiqPEcsi0fA5LJgqD5yi2vsK5_dE6BiSE25moUTQV4Vva1mLxK8fFRjbV0YFZTynEIGu30SeMldiI_bNpbm-1iJo4D64Y0tLY4W1usVoSkn9I1GbGMGC_SNKtolxqnhG4HkFRZCWpUMFlHmHF6_FZhIp5jyE6q',
    ];
    const newMediaUrl = sampleImages[activeDay.attachedMedia.length % sampleImages.length];

    setDays(
      days.map((d, i) =>
        i === activeDayIndex
          ? { ...d, attachedMedia: [...d.attachedMedia, newMediaUrl] }
          : d
      )
    );
  };

  // Save & Publish handler
  const handleSaveAndPublish = () => {
    const compiledProgramDays: LabyrinthDay[] = days.map((d, idx) => {
      const parsedExercises: Exercise[] = d.exercises.map((ex, exIdx) => ({
        id: `ex-${idx}-${exIdx}`,
        name: ex.name,
        target: ex.target || 'Hypertrophy Focus',
        setsCount: typeof ex.sets === 'number' ? ex.sets : parseInt(ex.sets as string, 10) || 4,
        defaultReps: parseInt(ex.reps.split('-')[0], 10) || 10,
        defaultWeightKg: ex.weightKg || 50,
        restSeconds: parseInt(ex.rest.replace(/\D/g, ''), 10) || 90,
      }));

      return {
        dayNumber: idx + 1,
        dayLabel: d.title,
        routineName: d.title.replace(/^DAY \d+:\s*/i, ''),
        sessionNotes: d.sessionNotes || 'Execute with maximum mechanical tension and rigid discipline.',
        formCheckTitle: `${d.exercises[0]?.name || 'MOVEMENT'} FORM CHECK`,
        formCheckImage:
          d.attachedMedia[0] ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBq5E9N0m-7ARvDaWNUplzb6klHJUo9yHaedeyBuVVxXI1v6s9GyWtUHWkFgg6Oa0P13CkidEHbjqdqv6twCQ7_Tfp8DJwBsjuhQcm2jSPfsUFG1NOWAae91FSD9Mr6rPVH3cNWU4_MCqRvBJ6KwRGXzn_EdATDCQLM8rHD5m9DF9S5RQ8wGRGBaWdZbRxRDzLCYfRkLe1WpORJr3IHn_vqfbl3yZqmYnML_XNzWeLdwf6cTvWNc5kg',
        formCheckCues: [
          '3-second controlled eccentric',
          'Explosive drive on concentric',
          'Rigid scapular positioning',
        ],
        exercises: parsedExercises,
      };
    });

    const newLabyrinth: Labyrinth = {
      id: `lab-${Date.now()}`,
      title: programTitle.toUpperCase(),
      tagline: `${weeksCount} WEEKS • ${daysPerWeek} DAYS/WK ARCHITECTURE`,
      creator: {
        name: 'Alex Rivers',
        username: '@alexrivers',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDsneXmx2UlYMRihSyQN5q9F_BvK3d_c9J8nWdWQELGAzvwQjgI_wOGoOlSXTxCqGLFnt_pe8xvowjvGqefFcIHqJXFs9hRB5bgSRpO24TlVHzFzHkexvG2vX9Kw1RWBZfEWP34lclN907bH5OVCMUbci6uhLeZkXNBkR-YJ4K5ORBPfRW8i1ysOtJk74DV4QDKjI01EVeVwdfYpN-z9hviTVc4pfXFxLLYVRmUB_my0JgZFGwIaxvF',
        isVerified: true,
        isFounder: true,
      },
      coverImage:
        activeDay.attachedMedia[0] ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAFD6IKjFJaEM5aI0padRGzijq3ABiiy9LkUdqjt2sHsY4yzjZwKPopqPsNGaLoD_kIjc1Pr0xJJUXjH3VayGqiHNETMYPnCKfgJwMkTd1ANxwS_oRY-37Mu6F6b0zhoqBB2R3dWD7epaqmPLyH8pnrJKONSH1e06ptxn2UFkt1fN3Ft9wMpzHhQcqsRZ-4I9cL_O3sy-nNEVLP4zaq4LVBFjRTsK15aZvETHqkJJ0UmxwyGgGXaanV',
      category,
      weeks: weeksCount,
      difficulty,
      price: 'FREE',
      membersCount: 1,
      isFounded: true,
      isJoined: true,
      visibility: 'PUBLIC',
      directCommsEnabled: true,
      directCommsStatus: 'ONLINE',
      description:
        'Engineered split designed for progressive overload, eccentric control, and muscle architecture.',
      programDays: compiledProgramDays,
      currentDayIndex: 0,
    };

    onCreate(newLabyrinth);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0E0E0E] text-white flex flex-col font-sans overflow-y-auto hide-scrollbar select-none">
      {/* Top Builder Navigation Header matching reference */}
      <header className="sticky top-0 left-0 w-full z-40 bg-[#0E0E0E]/95 backdrop-blur-xl border-b border-zinc-800/80 px-5 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-white hover:text-red-500 p-1.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Close Builder"
        >
          <X className="w-6 h-6" />
        </button>

        <h1 className="font-display font-black text-xl tracking-wider uppercase text-white">
          BUILDER
        </h1>

        <button
          onClick={() => {
            const promptTitle = prompt('Edit Labyrinth Program Name:', programTitle);
            if (promptTitle) setProgramTitle(promptTitle);
          }}
          className="text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Program Options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Main Builder Form */}
      <main className="flex-1 max-w-xl mx-auto w-full px-5 py-6 space-y-8 pb-36">
        {/* ROUTINE CONFIGURATION CONTAINER */}
        <section className="bg-[#141414] border border-zinc-800/90 rounded-3xl p-6 space-y-6 shadow-xl">
          <span className="font-mono-data text-[11px] text-zinc-400 uppercase tracking-widest block font-bold">
            ROUTINE CONFIGURATION
          </span>

          {/* STRUCTURE TOGGLE */}
          <div className="space-y-2">
            <span className="font-mono-data text-xs text-zinc-400 uppercase tracking-wider block font-semibold">
              STRUCTURE
            </span>
            <div className="grid grid-cols-2 gap-2 bg-[#0A0A0A] p-1 rounded-2xl border border-zinc-800/80">
              <button
                type="button"
                onClick={() => setStructure('MULTI_DAY')}
                className={`py-3 rounded-xl font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  structure === 'MULTI_DAY'
                    ? 'bg-white text-black font-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                MULTI-DAY SPLIT
              </button>
              <button
                type="button"
                onClick={() => setStructure('SINGLE')}
                className={`py-3 rounded-xl font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  structure === 'SINGLE'
                    ? 'bg-white text-black font-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                SINGLE ROUTINE
              </button>
            </div>
          </div>

          {/* DURATION TOGGLE */}
          <div className="space-y-2">
            <span className="font-mono-data text-xs text-zinc-400 uppercase tracking-wider block font-semibold">
              DURATION
            </span>
            <div className="grid grid-cols-2 gap-2 bg-[#0A0A0A] p-1 rounded-2xl border border-zinc-800/80">
              <button
                type="button"
                onClick={() => setDurationMode('FIXED')}
                className={`py-3 rounded-xl font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  durationMode === 'FIXED'
                    ? 'bg-white text-black font-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                FIXED LENGTH
              </button>
              <button
                type="button"
                onClick={() => setDurationMode('ONGOING')}
                className={`py-3 rounded-xl font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  durationMode === 'ONGOING'
                    ? 'bg-white text-black font-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ONGOING
              </button>
            </div>
          </div>

          {/* WEEKS / DAYS PER WEEK INPUTS */}
          <div className="grid grid-cols-2 gap-6 pt-2 items-center">
            <div>
              <span className="font-mono-data text-xs text-zinc-400 uppercase tracking-widest block mb-2 font-semibold">
                WEEKS
              </span>
              <input
                type="number"
                value={weeksCount}
                onChange={(e) => setWeeksCount(Math.max(1, Number(e.target.value)))}
                className="w-full bg-transparent border-b-2 border-zinc-700 focus:border-white text-center font-display font-black text-xl py-1 text-white outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <span className="absolute -left-3 top-7 text-zinc-600 text-lg font-light">/</span>
              <span className="font-mono-data text-xs text-zinc-400 uppercase tracking-widest block mb-2 font-semibold">
                DAYS PER WEEK
              </span>
              <input
                type="number"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Math.max(1, Math.min(7, Number(e.target.value))))}
                className="w-full bg-transparent border-b-2 border-zinc-700 focus:border-white text-center font-display font-black text-xl py-1 text-white outline-none transition-colors"
              />
            </div>
          </div>
        </section>

        {/* PROGRAM STRUCTURE HEADER & ADD DAY BUTTON */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-display font-black text-xl uppercase tracking-tight text-white">
              PROGRAM STRUCTURE
            </h2>
            <button
              type="button"
              onClick={handleAddDay}
              className="text-white hover:text-red-400 flex items-center gap-1.5 font-mono-data text-xs uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all py-1 px-2 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              <Plus className="w-4 h-4 text-red-500" /> ADD DAY
            </button>
          </div>

          {/* LIST OF PROGRAM DAYS */}
          <div className="space-y-2.5">
            {days.map((day, idx) => {
              const isSelected = activeDayIndex === idx;
              return (
                <div
                  key={day.id}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-xl shadow-white/5 font-black'
                      : 'bg-[#141414] text-zinc-300 border-zinc-800/90 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical
                      className={`w-5 h-5 ${isSelected ? 'text-black' : 'text-zinc-500'}`}
                    />
                    <span className="font-display font-black text-sm uppercase tracking-wide">
                      {day.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newName = prompt('Rename Day Label:', day.title);
                        if (newName) {
                          setDays(
                            days.map((d, i) => (i === idx ? { ...d, title: newName.toUpperCase() } : d))
                          );
                        }
                      }}
                      className={`p-1.5 rounded-lg hover:bg-black/10 transition-colors ${
                        isSelected ? 'text-black' : 'text-zinc-400'
                      }`}
                      title="Edit day label"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {days.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteDay(idx, e)}
                        className={`p-1.5 rounded-lg hover:bg-black/10 transition-colors ${
                          isSelected ? 'text-red-600' : 'text-zinc-500 hover:text-red-500'
                        }`}
                        title="Delete Day"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ACTIVE DAY EDITOR (WITH WHITE VERTICAL ACCENT LINE) */}
        <section className="relative pl-5 border-l-4 border-white space-y-6">
          <div>
            <input
              type="text"
              value={activeDay.title}
              onChange={(e) => handleUpdateDayTitle(e.target.value)}
              placeholder="DAY 1: UPPER BODY HEAVY"
              className="bg-transparent text-white font-display font-black text-2xl uppercase tracking-tight w-full outline-none leading-none focus:text-red-400 transition-colors"
            />
            <p className="font-mono-data text-[10px] text-zinc-400 uppercase tracking-widest mt-1 font-bold">
              EDITING CURRENT DAY
            </p>
          </div>

          {/* SESSION NOTES */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono-data text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              <FileText className="w-4 h-4 text-zinc-400" />
              <span>SESSION NOTES</span>
            </div>
            <textarea
              rows={3}
              value={activeDay.sessionNotes}
              onChange={(e) => handleUpdateSessionNotes(e.target.value)}
              placeholder="Add specific instructions for pacing, intent, or equipment setup..."
              className="w-full bg-[#181818] border border-zinc-800 focus:border-white rounded-2xl p-4 font-sans text-sm text-white outline-none transition-colors resize-none placeholder:text-zinc-600 leading-relaxed"
            />
          </div>

          {/* ATTACHED MEDIA */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono-data text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              <ImageIcon className="w-4 h-4 text-zinc-400" />
              <span>ATTACHED MEDIA</span>
            </div>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
              {/* UPLOAD BUTTON */}
              <button
                type="button"
                onClick={handleAddMedia}
                className="w-28 h-28 shrink-0 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-[#141414] flex flex-col items-center justify-center gap-2 text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95"
              >
                <Upload className="w-6 h-6 text-zinc-500" />
                <span className="font-mono-data text-[10px] uppercase font-bold tracking-widest">
                  UPLOAD
                </span>
              </button>

              {/* MEDIA THUMBNAILS */}
              {activeDay.attachedMedia.map((imgUrl, imgIdx) => (
                <div
                  key={imgIdx}
                  className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden relative border border-zinc-800 bg-zinc-950 group"
                >
                  <img
                    src={imgUrl}
                    alt="Attached exercise demo"
                    className="w-full h-full object-cover grayscale brightness-90 contrast-125"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setDays(
                        days.map((d, i) =>
                          i === activeDayIndex
                            ? {
                                ...d,
                                attachedMedia: d.attachedMedia.filter((_, mi) => mi !== imgIdx),
                              }
                            : d
                        )
                      );
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* EXERCISE BLOCKS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 font-mono-data text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                <Maximize2 className="w-4 h-4 text-zinc-400" />
                <span>EXERCISE BLOCKS</span>
              </div>
              <span className="font-mono-data text-xs text-zinc-400 uppercase tracking-widest font-bold">
                {activeDay.exercises.length} BLOCKS
              </span>
            </div>

            {/* EXERCISE BLOCK CARDS matching Block A / Block B reference */}
            <div className="space-y-4">
              {activeDay.exercises.map((block, bIdx) => (
                <div
                  key={block.id}
                  className="bg-[#141414] border border-zinc-800/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl"
                >
                  {/* Block Header */}
                  <div className="flex justify-between items-center">
                    <span className="font-mono-data text-[10px] text-zinc-300 font-bold bg-[#1e1e1e] border border-zinc-700/60 px-3 py-1 rounded-lg uppercase tracking-wider">
                      BLOCK {getBlockLetter(bIdx)}
                    </span>
                    {activeDay.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteExercise(block.id)}
                        className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                        title="Delete Exercise Block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Exercise Name Input */}
                  <input
                    type="text"
                    value={block.name}
                    onChange={(e) =>
                      handleUpdateExercise(block.id, 'name', e.target.value.toUpperCase())
                    }
                    placeholder="BARBELL BENCH PRESS"
                    className="w-full bg-transparent text-white font-display font-black text-xl sm:text-2xl uppercase tracking-tight outline-none focus:text-red-400 transition-colors"
                  />

                  {/* Sets / Reps / Rest Columns */}
                  <div className="grid grid-cols-3 gap-4 pt-1">
                    <div>
                      <span className="font-mono-data text-[10px] text-zinc-400 uppercase tracking-widest block mb-1 font-semibold">
                        SETS
                      </span>
                      <input
                        type="text"
                        value={block.sets}
                        onChange={(e) => handleUpdateExercise(block.id, 'sets', e.target.value)}
                        placeholder="4"
                        className="w-full bg-transparent border-b border-zinc-700 focus:border-white font-mono-data font-black text-base py-1 text-white outline-none"
                      />
                    </div>

                    <div>
                      <span className="font-mono-data text-[10px] text-zinc-400 uppercase tracking-widest block mb-1 font-semibold">
                        REPS
                      </span>
                      <input
                        type="text"
                        value={block.reps}
                        onChange={(e) => handleUpdateExercise(block.id, 'reps', e.target.value)}
                        placeholder="4-6"
                        className="w-full bg-transparent border-b border-zinc-700 focus:border-white font-mono-data font-black text-base py-1 text-white outline-none"
                      />
                    </div>

                    <div>
                      <span className="font-mono-data text-[10px] text-zinc-400 uppercase tracking-widest block mb-1 font-semibold">
                        REST
                      </span>
                      <input
                        type="text"
                        value={block.rest}
                        onChange={(e) => handleUpdateExercise(block.id, 'rest', e.target.value)}
                        placeholder="180s"
                        className="w-full bg-transparent border-b border-zinc-700 focus:border-white font-mono-data font-black text-base py-1 text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Notes Line */}
                  <div className="pt-2">
                    <input
                      type="text"
                      value={block.notes}
                      onChange={(e) => handleUpdateExercise(block.id, 'notes', e.target.value)}
                      placeholder="Add specific notes (e.g. 3 second negative tempo)..."
                      className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-600 font-sans text-xs text-zinc-300 py-1.5 outline-none placeholder:text-zinc-600 transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ADD EXERCISE DASHED BUTTON */}
            <button
              type="button"
              onClick={handleAddExerciseToActiveDay}
              className="w-full py-6 rounded-3xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-[#121212] flex flex-col items-center justify-center gap-2 text-white transition-all cursor-pointer active:scale-[0.99]"
            >
              <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-black text-sm uppercase tracking-wider">
                ADD EXERCISE
              </span>
            </button>
          </div>
        </section>
      </main>

      {/* Sticky Bottom SAVE & PUBLISH Button matching reference */}
      <footer className="fixed bottom-0 left-0 w-full z-40 bg-[#0E0E0E]/95 backdrop-blur-xl border-t border-zinc-800/80 p-5 flex justify-center">
        <div className="max-w-xl w-full">
          <button
            type="button"
            onClick={handleSaveAndPublish}
            className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-display font-black text-base uppercase tracking-widest rounded-2xl active:scale-[0.99] transition-all cursor-pointer shadow-2xl"
          >
            SAVE & PUBLISH
          </button>
        </div>
      </footer>
    </div>
  );
};
