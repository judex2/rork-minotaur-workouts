import React, { useState } from 'react';
import { Labyrinth, CommunityPost, LabyrinthDay, Creator } from '../types';
import {
  ArrowLeft,
  Settings,
  Pin,
  ThumbsUp,
  MessageSquare,
  Edit,
  Plus,
  Play,
  Check,
  Send,
  Camera,
  Layers,
  Sparkles,
  UserCheck,
  Shield,
  HelpCircle,
  Clock,
  Radio,
} from 'lucide-react';

interface LabyrinthDetailModalProps {
  labyrinth: Labyrinth;
  allPosts: CommunityPost[];
  baselinePhoto?: string;
  onClose: () => void;
  onStartWorkout: (labyrinth: Labyrinth, dayIndex: number) => void;
  onOpenDirectComms: (labyrinth: Labyrinth) => void;
  onAddPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount'>) => void;
  onLikePost: (postId: string) => void;
  onPinPost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCaptureBaselinePhoto: (labyrinthId: string, photoUrl: string) => void;
}

export const LabyrinthDetailModal: React.FC<LabyrinthDetailModalProps> = ({
  labyrinth,
  allPosts,
  baselinePhoto,
  onClose,
  onStartWorkout,
  onOpenDirectComms,
  onAddPost,
  onLikePost,
  onPinPost,
  onAddComment,
  onCaptureBaselinePhoto,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ARCHITECTURE' | 'COMMUNITY'>('COMMUNITY');
  const [selectedTag, setSelectedTag] = useState<'ALL' | 'QUESTION' | 'PUMP' | 'PROGRESS'>('ALL');
  const [selectedDayIdx, setSelectedDayIdx] = useState(labyrinth.currentDayIndex || 0);

  // New Post State
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postTag, setPostTag] = useState<'QUESTION' | 'PUMP' | 'PROGRESS' | 'GENERAL'>('PROGRESS');
  const [shareProgressWithBaseline, setShareProgressWithBaseline] = useState(true);
  const [uploadedProgressImage, setUploadedProgressImage] = useState<string>(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDsneXmx2UlYMRihSyQN5q9F_BvK3d_c9J8nWdWQELGAzvwQjgI_wOGoOlSXTxCqGLFnt_pe8xvowjvGqefFcIHqJXFs9hRB5bgSRpO24TlVHzFzHkexvG2vX9Kw1RWBZfEWP34lclN907bH5OVCMUbci6uhLeZkXNBkR-YJ4K5ORBPfRW8i1ysOtJk74DV4QDKjI01EVeVwdfYpN-z9hviTVc4pfXFxLLYVRmUB_my0JgZFGwIaxvF'
  );

  // Comment Thread Modal State
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Before & After Interactive Slider state for progress comparisons
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({});

  const currentDay = labyrinth.programDays[selectedDayIdx] || labyrinth.programDays[0];

  // Filter community posts for this Labyrinth
  const labyrinthPosts = allPosts.filter(
    (p) => p.labyrinthId === labyrinth.id || p.labyrinthId === 'nightwing-routine'
  );

  const filteredPosts = labyrinthPosts.filter((post) => {
    if (selectedTag === 'ALL') return true;
    return post.tag === selectedTag;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const userAuthor: Creator = {
      name: 'USER_784',
      username: '@iron_sculptor',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJpNUrT6DUGp7kiUld3-zmt_GdbqpDd6nhdu17J27-PddI7mw1O1nJ7d-b218m9LqA6vzyV0HbGUz7-lE-eLA-YyCzWbanqiUOh2vsPKtyHUIKTueA1lUxqE91Rt-uNyhtDbC2RpYWQsPqWvc6uX_kZQ1yd_WGaP-YGrOnPcccGpWVPeXcNu_Q0FhzGlNXkfL_BTpRPah31FZn9CeoSMn-bp7t3fAoBjg_vfiXtsREYUAkLYgtUNmQ',
      isVerified: false,
    };

    onAddPost({
      labyrinthId: labyrinth.id,
      author: userAuthor,
      timeAgo: 'JUST NOW',
      tag: postTag,
      isPinned: false,
      content: postContent,
      comparison:
        shareProgressWithBaseline && postTag === 'PROGRESS'
          ? {
              baselineImage:
                baselinePhoto ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBXxIK3POuj83VShJ3s6_QPxlQ4P_5zNwNofvhyW7UFj2We-Mwb83x1d_YbxBpVh_GKMLWlplNNboPReI6J0W23-a0u_nMuaCUzCZmHxxC_KBGTWrEJxNj8OD2_QfMh_n0PipxiSJMhdGziYyRXluTbOkebSmeGiOjd9_JL3TXH73oOlbGV9CiYKmhCw1s8qOKMZO3TMvM28-gCUbm-P-y7S36VmSvjlKsa0d1t684suVTCr9C7DlNU',
              currentImage: uploadedProgressImage,
              baselineLabel: 'BASELINE',
              currentLabel: `WEEK ${Math.floor((selectedDayIdx + 3) / 2) + 1}`,
              durationText: `${(selectedDayIdx + 1) * 14} DAYS IN THE LABYRINTH`,
            }
          : undefined,
      singleImage:
        !shareProgressWithBaseline && uploadedProgressImage ? uploadedProgressImage : undefined,
    });

    setPostContent('');
    setShowNewPostModal(false);
  };

  const handleSliderMove = (postId: string, position: number) => {
    setSliderPositions((prev) => ({
      ...prev,
      [postId]: position,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-zinc-100 overflow-y-auto hide-scrollbar flex flex-col font-sans pb-24">
      {/* Top Bar */}
      <header className="sticky top-0 left-0 w-full z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 px-5 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-white hover:text-red-500 p-2 rounded-xl bg-zinc-900 border border-zinc-800 active:scale-95 transition-all cursor-pointer shadow-sm"
          title="Back to Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <h1 className="font-display font-black text-lg tracking-widest uppercase text-white italic">
            LABYRINTHS
          </h1>
        </div>

        <button
          onClick={() => alert(`Labyrinth Settings:\n• Direct Comms: ${labyrinth.directCommsEnabled ? 'ENABLED' : 'DISABLED'}\n• Program: ${labyrinth.title}\n• Visibility: ${labyrinth.visibility || 'PUBLIC'}`)}
          className="text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
          title="Labyrinth Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Active Program Header Details */}
      <div className="px-5 pt-6 pb-4 border-b border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-2 text-red-500 font-mono-data text-xs uppercase tracking-widest mb-1 font-bold">
          <Layers className="w-3.5 h-3.5" /> ACTIVE PROGRAM
        </div>
        <h2 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-white italic">
          {labyrinth.title}
        </h2>
        <p className="font-mono-data text-xs text-zinc-400 uppercase tracking-wider mt-1">
          {currentDay?.dayLabel || 'MONDAY — ARM DAY'}
        </p>

        {/* Sub Navigation Bar: ARCHITECTURE / COMMUNITY / DAY 3 OF 12 */}
        <div className="flex items-center justify-between mt-6 border-b border-zinc-800 text-xs font-mono-data uppercase tracking-wider">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveSubTab('ARCHITECTURE')}
              className={`pb-3 font-bold transition-all cursor-pointer ${
                activeSubTab === 'ARCHITECTURE'
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ARCHITECTURE
            </button>
            <button
              onClick={() => setActiveSubTab('COMMUNITY')}
              className={`pb-3 font-bold transition-all cursor-pointer ${
                activeSubTab === 'COMMUNITY'
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              COMMUNITY
            </button>
          </div>

          <span className="pb-3 text-zinc-500 font-bold">
            DAY {selectedDayIdx + 1} OF {labyrinth.programDays.length * 4 || 12}
          </span>
        </div>
      </div>

      {/* SUB TAB 1: ARCHITECTURE / PROGRAM BLUEPRINT */}
      {activeSubTab === 'ARCHITECTURE' && (
        <div className="px-5 py-6 max-w-3xl mx-auto w-full space-y-6">
          {/* Day Selector */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="font-mono-data text-xs text-zinc-400 uppercase tracking-widest font-bold">
              SCHEDULED CHAMBERS
            </span>
            <div className="flex gap-2">
              {labyrinth.programDays.map((d, idx) => (
                <button
                  key={d.dayNumber}
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`w-9 h-9 rounded-xl font-mono-data text-xs font-bold transition-all cursor-pointer ${
                    selectedDayIdx === idx
                      ? 'bg-red-600 text-white shadow-md shadow-red-950 border border-red-500'
                      : 'border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900'
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Session Overview Card */}
          <div className="border border-zinc-800 bg-zinc-900 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono-data text-xs text-red-500 uppercase tracking-widest block mb-1 font-bold">
                  {currentDay?.dayLabel}
                </span>
                <h3 className="font-display font-black text-2xl uppercase text-white italic">
                  {currentDay?.routineName}
                </h3>
              </div>
              <span className="bg-zinc-800 text-zinc-300 font-mono-data text-[10px] px-2.5 py-1 rounded-lg uppercase font-bold border border-zinc-700">
                {currentDay?.exercises.length} MOVEMENTS
              </span>
            </div>

            {/* Session Notes */}
            <div className="border-l-2 border-red-500 pl-4 py-2 bg-zinc-950/60 rounded-r-xl">
              <span className="font-mono-data text-[10px] text-zinc-400 uppercase tracking-widest block mb-1 font-bold">
                COACHING INTENT
              </span>
              <p className="font-mono-data text-xs sm:text-sm text-zinc-300">
                {currentDay?.sessionNotes}
              </p>
            </div>

            {/* Form Check Demo Preview */}
            <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-data text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                  {currentDay?.formCheckTitle}
                </span>
                <span className="text-[10px] font-mono-data text-red-400 flex items-center gap-1 font-bold">
                  <Play className="w-3 h-3 fill-red-500 text-red-500" /> DEMO
                </span>
              </div>
              <div className="aspect-video w-full relative overflow-hidden group rounded-xl border border-zinc-800">
                <img
                  src={currentDay?.formCheckImage}
                  alt={currentDay?.formCheckTitle}
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-red-500 bg-black/70 flex items-center justify-center shadow-lg shadow-red-950">
                    <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                  </div>
                </div>
              </div>
              <ul className="mt-3 space-y-1">
                {currentDay?.formCheckCues.map((cue, idx) => (
                  <li key={idx} className="font-mono-data text-xs text-zinc-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                    {cue}
                  </li>
                ))}
              </ul>
            </div>

            {/* Exercise List */}
            <div className="space-y-3 pt-2">
              <h4 className="font-mono-data text-xs text-zinc-400 uppercase tracking-widest font-bold">
                TARGET EXERCISES
              </h4>
              {currentDay?.exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono-data text-xs text-red-500 font-bold">0{idx + 1}</span>
                    <div>
                      <span className="font-mono-data font-bold text-sm text-white uppercase block">
                        {ex.name}
                      </span>
                      <span className="text-xs text-zinc-400">Target: {ex.target}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-data text-sm font-bold text-white block">
                      {ex.setsCount} x {ex.defaultReps}
                    </span>
                    <span className="font-mono-data text-[10px] text-zinc-500 font-semibold">
                      {ex.defaultWeightKg > 0 ? `${ex.defaultWeightKg} KG` : 'BODYWEIGHT'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onStartWorkout(labyrinth, selectedDayIdx)}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-display font-black py-4 rounded-2xl uppercase tracking-widest text-xs active:scale-[0.99] transition-all cursor-pointer mt-4 shadow-xl shadow-red-900/40 border border-red-500"
            >
              START WORKOUT (DAY {selectedDayIdx + 1})
            </button>
          </div>
        </div>
      )}

      {/* SUB TAB 2: COMMUNITY SOCIAL FEED */}
      {activeSubTab === 'COMMUNITY' && (
        <div className="px-5 py-6 max-w-3xl mx-auto w-full space-y-6">
          {/* Tag Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {(['ALL', 'QUESTION', 'PUMP', 'PROGRESS'] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`flex-1 min-w-[90px] py-2.5 rounded-xl font-mono-data text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/40 border border-red-500'
                    : 'border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* INITIATE_DIRECT_COMMS_FOUNDER Button */}
          <div className="py-2">
            <button
              onClick={() => onOpenDirectComms(labyrinth)}
              className="w-full rounded-2xl border border-dashed border-red-500/50 bg-zinc-900 hover:bg-red-950/20 text-white py-4 px-4 font-mono-data font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] shadow-lg"
            >
              <span className="text-red-400">[ INITIATE_DIRECT_COMMS_FOUNDER ]</span>
              {labyrinth.directCommsEnabled ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Founder is Online" />
              ) : (
                <span className="text-[10px] text-zinc-500">(OFFLINE)</span>
              )}
            </button>
          </div>

          <div className="h-[1px] w-full bg-zinc-800" />

          {/* Community Post List */}
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              return (
                <article
                  key={post.id}
                  className={`border rounded-3xl bg-zinc-900 p-6 space-y-4 relative shadow-xl ${
                    post.isPinned ? 'border-red-500 shadow-red-950/30' : 'border-zinc-800'
                  }`}
                >
                  {/* Pinned Badge if pinned */}
                  {post.isPinned && (
                    <div className="flex items-center gap-1.5 text-xs font-mono-data text-red-500 uppercase font-bold tracking-widest mb-1">
                      <Pin className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                      <span>PINNED BY OWNER</span>
                    </div>
                  )}

                  {/* Post Author Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border border-zinc-700 overflow-hidden bg-zinc-950 shrink-0 shadow-md">
                        <img
                          src={post.author.avatarUrl}
                          alt={post.author.name}
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-black text-sm text-white uppercase italic">
                            {post.author.name}
                          </h4>
                          {post.author.isFounder && (
                            <span className="bg-red-600 text-white font-mono-data text-[9px] px-1.5 py-0.5 rounded font-black shadow-sm">
                              FOUNDER
                            </span>
                          )}
                        </div>
                        <span className="font-mono-data text-[10px] text-zinc-400 uppercase">
                          {post.timeAgo}
                        </span>
                      </div>
                    </div>

                    {/* Tag pill */}
                    <span className="border border-zinc-700 bg-zinc-950/60 text-zinc-300 font-mono-data text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider font-bold">
                      {post.tag}
                    </span>
                  </div>

                  {/* Post Text Content */}
                  <p className="font-sans text-sm text-zinc-200 leading-relaxed">
                    {post.content}
                  </p>

                  {/* SPECIAL BEFORE & AFTER PAIRED PROGRESS PHOTO CARD */}
                  {post.comparison && (
                    <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-3 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono-data text-zinc-400 uppercase tracking-widest">
                        <span>Labyrinth Progress Tracker</span>
                        <span className="text-red-400 font-bold">{post.comparison.durationText}</span>
                      </div>

                      {/* Side by side comparison display */}
                      <div className="grid grid-cols-2 gap-1.5 relative overflow-hidden aspect-[4/3] sm:aspect-[16/9] rounded-xl border border-zinc-800">
                        {/* Baseline Image */}
                        <div className="relative h-full w-full overflow-hidden">
                          <img
                            src={post.comparison.baselineImage}
                            alt="Baseline"
                            className="w-full h-full object-cover grayscale brightness-90"
                          />
                          <div className="absolute bottom-2 left-2 bg-zinc-900/90 border border-zinc-700 px-2 py-1 rounded">
                            <span className="font-mono-data text-[10px] text-white font-black uppercase tracking-wider">
                              {post.comparison.baselineLabel}
                            </span>
                          </div>
                        </div>

                        {/* Current Progress Image */}
                        <div className="relative h-full w-full overflow-hidden">
                          <img
                            src={post.comparison.currentImage}
                            alt="Current Progress"
                            className="w-full h-full object-cover grayscale brightness-105 contrast-125"
                          />
                          <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded shadow-md shadow-red-950">
                            <span className="font-mono-data text-[10px] font-black uppercase tracking-wider">
                              {post.comparison.currentLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Single Image if attached */}
                  {post.singleImage && !post.comparison && (
                    <div className="aspect-video w-full rounded-2xl border border-zinc-800 overflow-hidden">
                      <img
                        src={post.singleImage}
                        alt="Attached Workout Update"
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                  )}

                  {/* Post Footer: Likes, Comments, Founder Pin action */}
                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono-data text-zinc-400">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => onLikePost(post.id)}
                        className={`flex items-center gap-2 hover:text-white transition-colors cursor-pointer ${
                          post.hasLiked ? 'text-red-500 font-bold' : ''
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${post.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        onClick={() => setActiveCommentPostId(post.id)}
                        className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount || post.comments?.length || 0}</span>
                      </button>
                    </div>

                    {/* Founder Quick Actions */}
                    {labyrinth.isFounded && (
                      <button
                        onClick={() => onPinPost(post.id)}
                        className="text-[10px] text-zinc-400 hover:text-red-400 uppercase flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Pin className="w-3 h-3" />
                        {post.isPinned ? 'UNPIN' : 'PIN FAVORITE'}
                      </button>
                    )}
                  </div>

                  {/* Inline Comments Preview */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="pt-3 space-y-2 border-t border-zinc-800/80 text-xs">
                      {post.comments.slice(0, 2).map((c) => (
                        <div key={c.id} className="bg-zinc-950/70 p-3 rounded-xl border-l-2 border-red-500">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono-data text-white font-bold flex items-center gap-1">
                              {c.author}
                              {c.isFounder && (
                                <span className="bg-red-600 text-white text-[8px] px-1 rounded font-black">
                                  FOUNDER
                                </span>
                              )}
                            </span>
                            <span className="font-mono-data text-[9px] text-zinc-500">{c.timeAgo}</span>
                          </div>
                          <p className="text-zinc-300 font-sans">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Action Button for Posting in Community */}
      {activeSubTab === 'COMMUNITY' && (
        <button
          onClick={() => setShowNewPostModal(true)}
          className="fixed bottom-20 right-5 z-40 bg-red-600 hover:bg-red-500 text-white p-4 rounded-2xl active:scale-95 shadow-2xl shadow-red-950 transition-all cursor-pointer border border-red-500"
          title="Share Labyrinth Update"
        >
          <Edit className="w-5 h-5 text-white" />
        </button>
      )}

      {/* NEW POST MODAL */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <h3 className="font-display font-black text-lg text-white uppercase italic">
                  POST TO LABYRINTH
                </h3>
              </div>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-zinc-400 hover:text-white font-mono-data text-xs font-bold"
              >
                CANCEL
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Tag Selector */}
              <div>
                <label className="font-mono-data text-[10px] text-zinc-400 uppercase tracking-widest block mb-1.5 font-bold">
                  SELECT POST CATEGORY
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['PROGRESS', 'QUESTION', 'PUMP', 'GENERAL'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setPostTag(t)}
                      className={`py-2 rounded-xl font-mono-data text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        postTag === t
                          ? 'bg-red-600 text-white shadow-md shadow-red-900/40 border border-red-500'
                          : 'border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-950'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div>
                <label className="font-mono-data text-[10px] text-zinc-400 uppercase tracking-widest block mb-1.5 font-bold">
                  UPDATE / QUESTION
                </label>
                <textarea
                  rows={3}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder={
                    postTag === 'QUESTION'
                      ? 'Tag question to the owner: E.g., @Alex on skullcrushers wrist alignment...'
                      : 'Share your progress, weights hit, or session notes...'
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 font-sans text-sm text-white outline-none transition-colors"
                  required
                />
              </div>

              {/* Progress Photo Pairing Option */}
              {postTag === 'PROGRESS' && (
                <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono-data text-xs text-white font-bold uppercase block">
                        PAIR WITH DAY 0 BASELINE PHOTO
                      </span>
                      <p className="text-[10px] text-zinc-400">
                        Automatically pairs with your starting snapshot to show timeline.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={shareProgressWithBaseline}
                      onChange={(e) => setShareProgressWithBaseline(e.target.checked)}
                      className="w-4 h-4 accent-red-600 cursor-pointer"
                    />
                  </div>

                  {shareProgressWithBaseline && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                      <div className="border border-zinc-800 p-2 bg-zinc-900 rounded-xl text-center">
                        <span className="font-mono-data text-[9px] text-zinc-400 uppercase block mb-1 font-bold">
                          DAY 0 BASELINE
                        </span>
                        <div className="aspect-square bg-black rounded-lg overflow-hidden border border-zinc-700">
                          <img
                            src={
                              baselinePhoto ||
                              'https://lh3.googleusercontent.com/aida-public/AB6AXuBXxIK3POuj83VShJ3s6_QPxlQ4P_5zNwNofvhyW7UFj2We-Mwb83x1d_YbxBpVh_GKMLWlplNNboPReI6J0W23-a0u_nMuaCUzCZmHxxC_KBGTWrEJxNj8OD2_QfMh_n0PipxiSJMhdGziYyRXluTbOkebSmeGiOjd9_JL3TXH73oOlbGV9CiYKmhCw1s8qOKMZO3TMvM28-gCUbm-P-y7S36VmSvjlKsa0d1t684suVTCr9C7DlNU'
                            }
                            alt="Baseline preview"
                            className="w-full h-full object-cover grayscale"
                          />
                        </div>
                      </div>

                      <div className="border border-red-500/50 p-2 bg-zinc-900 rounded-xl text-center">
                        <span className="font-mono-data text-[9px] text-red-400 font-bold uppercase block mb-1">
                          CURRENT SNAPSHOT
                        </span>
                        <div className="aspect-square bg-black rounded-lg overflow-hidden border border-red-500">
                          <img
                            src={uploadedProgressImage}
                            alt="Current update"
                            className="w-full h-full object-cover grayscale"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-mono-data font-black py-4 rounded-2xl uppercase tracking-widest text-xs transition-colors cursor-pointer shadow-xl shadow-red-900/40 border border-red-500"
              >
                PUBLISH UPDATE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COMMENT THREAD DRAWER */}
      {activeCommentPostId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 space-y-4 max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <h3 className="font-display font-black text-sm text-white uppercase italic">
                  THREAD DISCUSSION
                </h3>
              </div>
              <button
                onClick={() => setActiveCommentPostId(null)}
                className="text-zinc-400 hover:text-white font-mono-data text-xs font-bold"
              >
                CLOSE
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {labyrinthPosts
                .find((p) => p.id === activeCommentPostId)
                ?.comments?.map((c) => (
                  <div key={c.id} className="bg-zinc-950 p-3 rounded-xl border-l-2 border-red-500">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono-data text-xs text-white font-bold flex items-center gap-1">
                        {c.author}
                        {c.isFounder && (
                          <span className="bg-red-600 text-white text-[8px] px-1 rounded font-black">
                            FOUNDER
                          </span>
                        )}
                      </span>
                      <span className="font-mono-data text-[10px] text-zinc-500">{c.timeAgo}</span>
                    </div>
                    <p className="text-sm text-zinc-300">{c.content}</p>
                  </div>
                ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-zinc-800">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write reply or ask founder..."
                className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white font-sans outline-none transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCommentText.trim()) {
                    onAddComment(activeCommentPostId, newCommentText);
                    setNewCommentText('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newCommentText.trim()) {
                    onAddComment(activeCommentPostId, newCommentText);
                    setNewCommentText('');
                  }
                }}
                className="bg-red-600 hover:bg-red-500 text-white px-5 rounded-xl font-mono-data text-xs font-bold uppercase transition-all shadow-md shadow-red-900/40"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
