export type TabType = 'HOME' | 'EXPLORE' | 'PROFILE';
export type CadenceType = 'DAILY' | 'ALTERNATING' | 'MULTI_DAY_SPLIT';
export type PaymentType = 'FREE' | 'ONE_TIME' | 'MONTHLY_SUBSCRIPTION';

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
  tag?: string;
  date: string;
}

export type CategoryType = 'ALL' | 'STRENGTH' | 'HYPERTROPHY' | 'CALISTHENICS' | 'ENDURANCE' | 'MOBILITY';
export type DifficultyType = 'OPEN' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
export type PostTagType = 'ALL' | 'QUESTION' | 'PUMP' | 'PROGRESS' | 'GENERAL';

export interface ExerciseSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  target: string;
  setsCount: number;
  defaultReps: number;
  defaultWeightKg: number;
  restSeconds: number;
}

export interface LabyrinthDay {
  dayNumber: number;
  dayLabel: string; // e.g. "MONDAY — ARM DAY"
  routineName: string; // e.g. "NIGHTWING ROUTINE"
  sessionNotes: string;
  formCheckTitle: string;
  formCheckImage: string;
  dayImage?: string; // photo for the specific day
  formCheckVideoAlt?: string;
  formCheckCues: string[];
  exercises: Exercise[];
}

export interface Creator {
  name: string;
  username: string;
  avatarUrl: string;
  isVerified: boolean;
  isFounder?: boolean;
}

export interface Labyrinth {
  id: string;
  title: string;
  tagline: string;
  creator: Creator;
  coverImage: string;
  category: 'STRENGTH' | 'HYPERTROPHY' | 'CALISTHENICS' | 'ENDURANCE' | 'MOBILITY';
  weeks: number;
  difficulty: DifficultyType;
  price: 'FREE' | string; // e.g. 'FREE', '$19.99', '$49.00', '$19.99/mo'
  cadenceType?: CadenceType; // 'DAILY', 'ALTERNATING', 'MULTI_DAY_SPLIT'
  cadenceLabel?: string; // e.g. "SAME ROUTINE • EVERY DAY", "ALTERNATING • EVERY OTHER DAY", "4 DAYS / WEEK"
  paymentType?: PaymentType; // 'FREE', 'ONE_TIME', 'MONTHLY_SUBSCRIPTION'
  priceAmount?: number;
  membersCount: number;
  isOfficial?: boolean;
  isJoined?: boolean;
  isFounded?: boolean;
  visibility?: 'PUBLIC' | 'PRIVATE';
  directCommsEnabled: boolean;
  directCommsStatus?: 'ONLINE' | 'ACTIVE' | 'OFFLINE';
  description: string;
  programDays: LabyrinthDay[];
  currentDayIndex?: number;
}

export interface ProgressComparison {
  baselineImage: string;
  currentImage: string;
  baselineLabel: string;
  currentLabel: string;
  durationText: string;
  notes?: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  username: string;
  avatarUrl: string;
  isFounder?: boolean;
  content: string;
  timeAgo: string;
}

export interface CommunityPost {
  id: string;
  labyrinthId: string;
  author: Creator;
  timeAgo: string;
  tag: 'QUESTION' | 'PUMP' | 'PROGRESS' | 'GENERAL';
  isPinned?: boolean;
  content: string;
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  comments?: CommunityComment[];
  comparison?: ProgressComparison;
  singleImage?: string;
}

export interface DirectMessage {
  id: string;
  labyrinthId: string;
  sender: 'USER' | 'FOUNDER';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface UserProfile {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  foundedLabyrinthsCount: number;
  totalMembersCount: string;
  activeLabyrinthId?: string;
  baselinePhotos: Record<string, string>; // labyrinthId -> photoUrl
  galleryImages: Array<{
    id: string;
    imageUrl: string;
    caption: string;
    tag?: string;
    date: string;
  }>;
}
