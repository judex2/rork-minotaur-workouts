import React, { useState } from 'react';
import { TabType, Labyrinth, CommunityPost, UserProfile, DirectMessage } from './types';
import {
  INITIAL_LABYRINTHS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_USER_PROFILE,
  INITIAL_DIRECT_MESSAGES,
} from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { ProfileView } from './components/ProfileView';
import { LabyrinthDetailModal } from './components/LabyrinthDetailModal';
import { ActiveWorkoutView } from './components/ActiveWorkoutView';
import { DirectCommsDrawer } from './components/DirectCommsDrawer';
import { CreateLabyrinthModal } from './components/CreateLabyrinthModal';
import { PhotoLightboxModal } from './components/PhotoLightboxModal';
import { WorkoutCompleteModal } from './components/WorkoutCompleteModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('HOME');

  // Application State
  const [labyrinths, setLabyrinths] = useState<Labyrinth[]>(INITIAL_LABYRINTHS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(INITIAL_DIRECT_MESSAGES);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [baselinePhoto, setBaselinePhoto] = useState<string>(
    INITIAL_USER_PROFILE.baselinePhotos['nightwing-routine'] ||
      Object.values(INITIAL_USER_PROFILE.baselinePhotos)[0] ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXxIK3POuj83VShJ3s6_QPxlQ4P_5zNwNofvhyW7UFj2We-Mwb83x1d_YbxBpVh_GKMLWlplNNboPReI6J0W23-a0u_nMuaCUzCZmHxxC_KBGTWrEJxNj8OD2_QfMh_n0PipxiSJMhdGziYyRXluTbOkebSmeGiOjd9_JL3TXH73oOlbGV9CiYKmhCw1s8qOKMZO3TMvM28-gCUbm-P-y7S36VmSvjlKsa0d1t684suVTCr9C7DlNU'
  );

  // Modal / Screen States
  const [selectedLabyrinth, setSelectedLabyrinth] = useState<Labyrinth | null>(null);
  const [activeWorkoutSession, setActiveWorkoutSession] = useState<{
    labyrinth: Labyrinth;
    dayIndex: number;
  } | null>(null);
  const [activeCommsLabyrinth, setActiveCommsLabyrinth] = useState<Labyrinth | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; index: number }>({
    isOpen: false,
    index: 0,
  });
  const [workoutCompleteData, setWorkoutCompleteData] = useState<{
    labyrinth: Labyrinth;
    summary: {
      durationFormatted: string;
      totalVolumeKg: number;
      completedSetsCount: number;
      sessionNotes: string;
    };
  } | null>(null);

  // Handlers
  const handleOpenLabyrinth = (labyrinth: Labyrinth) => {
    setSelectedLabyrinth(labyrinth);
  };

  const handleStartWorkout = (labyrinth: Labyrinth, dayIndex: number = 0) => {
    // If user hasn't joined, joining captures their Day 0 baseline photo quietly
    if (!labyrinth.isJoined) {
      setLabyrinths((prev) =>
        prev.map((l) => (l.id === labyrinth.id ? { ...l, isJoined: true } : l))
      );
    }
    setActiveWorkoutSession({ labyrinth, dayIndex });
  };

  const handleEnlist = (labyrinth: Labyrinth) => {
    setLabyrinths((prev) =>
      prev.map((l) =>
        l.id === labyrinth.id
          ? { ...l, isJoined: true, membersCount: l.membersCount + 1 }
          : l
      )
    );
    setSelectedLabyrinth({ ...labyrinth, isJoined: true, membersCount: labyrinth.membersCount + 1 });
  };

  const handleFinishWorkout = (summary: {
    durationFormatted: string;
    totalVolumeKg: number;
    completedSetsCount: number;
    sessionNotes: string;
  }) => {
    if (activeWorkoutSession) {
      const finishedLab = activeWorkoutSession.labyrinth;
      setActiveWorkoutSession(null);
      setWorkoutCompleteData({
        labyrinth: finishedLab,
        summary,
      });
    }
  };

  const handleShareWorkoutToCommunity = (caption: string) => {
    if (!workoutCompleteData) return;
    const lab = workoutCompleteData.labyrinth;

    const newPost: CommunityPost = {
      id: `post-workout-${Date.now()}`,
      labyrinthId: lab.id,
      author: {
        name: userProfile.name,
        username: userProfile.username,
        avatarUrl: userProfile.avatarUrl,
        isVerified: true,
        isFounder: false,
      },
      timeAgo: 'JUST NOW',
      tag: 'PROGRESS',
      isPinned: false,
      content: caption,
      comparison: {
        baselineImage: baselinePhoto,
        currentImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDsneXmx2UlYMRihSyQN5q9F_BvK3d_c9J8nWdWQELGAzvwQjgI_wOGoOlSXTxCqGLFnt_pe8xvowjvGqefFcIHqJXFs9hRB5bgSRpO24TlVHzFzHkexvG2vX9Kw1RWBZfEWP34lclN907bH5OVCMUbci6uhLeZkXNBkR-YJ4K5ORBPfRW8i1ysOtJk74DV4QDKjI01EVeVwdfYpN-z9hviTVc4pfXFxLLYVRmUB_my0JgZFGwIaxvF',
        baselineLabel: 'BASELINE (DAY 0)',
        currentLabel: 'TODAY (WEEK 6)',
        durationText: 'SESSION COMPLETE • 42 DAYS IN LABYRINTH',
      },
      likes: 1,
      hasLiked: true,
      commentsCount: 0,
      comments: [],
    };

    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked,
            likes: hasLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handlePinPost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isPinned: !p.isPinned } : p))
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `comm-${Date.now()}`,
      author: userProfile.name,
      content: text,
      timeAgo: 'JUST NOW',
      isFounder: false,
    };

    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const comments = p.comments ? [...p.comments, newComment] : [newComment];
          return {
            ...p,
            comments,
            commentsCount: comments.length,
          };
        }
        return p;
      })
    );
  };

  const handleAddPost = (postData: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}`,
      likes: 0,
      hasLiked: false,
      commentsCount: 0,
      comments: [],
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  const handleSendMessage = (text: string) => {
    const labId = activeCommsLabyrinth?.id || 'nightwing-routine';
    const userMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      labyrinthId: labId,
      sender: 'USER',
      senderName: userProfile.name,
      text,
      timestamp: 'JUST NOW',
      isRead: true,
    };

    setDirectMessages((prev) => [...prev, userMsg]);

    // Simulated authentic coach reply from founder
    setTimeout(() => {
      const coachReplies = [
        'Checked your notes on the 3-second eccentric. Keep the elbows tucked at 45 degrees for maximum triceps tension.',
        'Good observation. On block 2 we maintain volume. Add 2.5kg to the close-grip bench next Monday.',
        'Locked in. Maintain scapular retraction throughout the full ROM and keep breathing rhythmic.',
      ];
      const randomReply = coachReplies[Math.floor(Math.random() * coachReplies.length)];

      const founderMsg: DirectMessage = {
        id: `msg-founder-${Date.now()}`,
        labyrinthId: labId,
        sender: 'FOUNDER',
        senderName: activeCommsLabyrinth?.creator.name || 'Alex Rivers',
        text: randomReply,
        timestamp: 'JUST NOW',
        isRead: true,
      };
      setDirectMessages((prev) => [...prev, founderMsg]);
    }, 1200);
  };

  const handleCreateLabyrinth = (newLabyrinth: Labyrinth) => {
    setLabyrinths((prev) => [newLabyrinth, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      foundedLabyrinthsCount: prev.foundedLabyrinthsCount + 1,
    }));
  };

  const handleToggleComms = (enabled: boolean) => {
    if (activeCommsLabyrinth) {
      const updated = { ...activeCommsLabyrinth, directCommsEnabled: enabled };
      setActiveCommsLabyrinth(updated);
      setLabyrinths((prev) =>
        prev.map((l) => (l.id === updated.id ? updated : l))
      );
    }
  };

  const foundedList = labyrinths.filter((l) => l.isFounded);

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col font-sans antialiased selection:bg-white selection:text-black">
      {/* Top iOS Header */}
      <Header
        currentTab={currentTab}
        onOpenMenu={() => setCurrentTab('PROFILE')}
        onOpenFounderProfile={() => setCurrentTab('PROFILE')}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onNewLabyrinth={() => setIsCreateModalOpen(true)}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentTab === 'HOME' && (
          <HomeView
            labyrinths={labyrinths}
            onSelectLabyrinth={handleOpenLabyrinth}
            onStartActiveWorkout={(lab) => handleStartWorkout(lab, lab.currentDayIndex || 2)}
            onOpenHistory={() => {
              const active = labyrinths.find((l) => l.id === 'nightwing-routine') || labyrinths[0];
              handleOpenLabyrinth(active);
            }}
            onEnlist={handleEnlist}
          />
        )}

        {currentTab === 'EXPLORE' && (
          <ExploreView
            labyrinths={labyrinths}
            onSelectLabyrinth={handleOpenLabyrinth}
            onEnlist={handleEnlist}
          />
        )}

        {currentTab === 'PROFILE' && (
          <ProfileView
            profile={userProfile}
            foundedLabyrinths={foundedList}
            onSelectLabyrinth={handleOpenLabyrinth}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenPhotoLightbox={(idx) => setLightboxState({ isOpen: true, index: idx })}
          />
        )}
      </div>

      {/* iOS Bottom 3-Tab Nav - Visible at all times */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          // If a full-screen submodal is open, switching tabs navigates smoothly
        }}
      />

      {/* NOTIFICATIONS DRAWER */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setIsNotificationsOpen(false);
        }}
      />

      {/* LABYRINTH DETAIL MODAL (ARCHITECTURE & COMMUNITY TABS) */}
      {selectedLabyrinth && (
        <LabyrinthDetailModal
          labyrinth={selectedLabyrinth}
          allPosts={communityPosts}
          baselinePhoto={baselinePhoto}
          onClose={() => setSelectedLabyrinth(null)}
          onStartWorkout={(lab, dayIdx) => {
            setSelectedLabyrinth(null);
            handleStartWorkout(lab, dayIdx);
          }}
          onOpenDirectComms={(lab) => setActiveCommsLabyrinth(lab)}
          onAddPost={handleAddPost}
          onLikePost={handleLikePost}
          onPinPost={handlePinPost}
          onAddComment={handleAddComment}
          onCaptureBaselinePhoto={(labId, photoUrl) => setBaselinePhoto(photoUrl)}
        />
      )}

      {/* ACTIVE WORKOUT SESSION FULL-SCREEN VIEW */}
      {activeWorkoutSession && (
        <ActiveWorkoutView
          labyrinth={activeWorkoutSession.labyrinth}
          dayIndex={activeWorkoutSession.dayIndex}
          onClose={() => setActiveWorkoutSession(null)}
          onFinishWorkout={handleFinishWorkout}
        />
      )}

      {/* 1-ON-1 DIRECT COMMS WITH OWNER DRAWER */}
      {activeCommsLabyrinth && (
        <DirectCommsDrawer
          labyrinth={activeCommsLabyrinth}
          messages={directMessages}
          onClose={() => setActiveCommsLabyrinth(null)}
          onSendMessage={handleSendMessage}
          onToggleCommsEnabled={handleToggleComms}
        />
      )}

      {/* CREATE LABYRINTH ROUTINE BUILDER MODAL */}
      {isCreateModalOpen && (
        <CreateLabyrinthModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateLabyrinth}
        />
      )}

      {/* BEFORE & AFTER PHOTO LIGHTBOX WITH COMPARISON SLIDER */}
      {lightboxState.isOpen && (
        <PhotoLightboxModal
          images={userProfile.galleryImages}
          initialIndex={lightboxState.index}
          baselinePhoto={baselinePhoto}
          onClose={() => setLightboxState({ isOpen: false, index: 0 })}
          onUpdateBaselinePhoto={(newUrl) => setBaselinePhoto(newUrl)}
        />
      )}

      {/* WORKOUT CONCLUDED CELEBRATION & STATS SUMMARY */}
      {workoutCompleteData && (
        <WorkoutCompleteModal
          labyrinth={workoutCompleteData.labyrinth}
          summary={workoutCompleteData.summary}
          onClose={() => setWorkoutCompleteData(null)}
          onShareToCommunity={handleShareWorkoutToCommunity}
        />
      )}
    </div>
  );
}
