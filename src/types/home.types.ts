export type IconName =
  | "search"
  | "sparkles"
  | "user-check"
  | "award"
  | "swap"
  | "star"
  | "globe"
  | "bar-chart"
  | "music"
  | "pen-tool"
  | "smartphone"
  | "cloud"
  | "shield"
  | "line-chart"
  | "bot";

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  icon: IconName;
  accent: "blue" | "orange" | "green";
};

export type StatCardItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  value: string;
  color: "blue" | "orange" | "green";
};

export type SwapBanner = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
};

export type TrendingItem = {
  id: string;
  title: string;
  learningCount: number;
  growthLabel: string; // e.g. "+341"
  icon: IconName;
};

export type InterestItem = {
  id: string;
  label: string;
  icon: IconName;
  selected?: boolean;
};

export type MentorCardItem = {
  id: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  rating: number;
  reviewCount: number;
  swapCount: number;
  title: string;
  description: string;
  tags: string[];
};

export type SessionItem = {
  id: string;
  category: string;
  image: string;
  title: string;
  mentorName: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  dateLabel: string;
  timeLabel: string;
};

export type TestimonialItem = {
  id: string;
  name: string;
  subtitle: string;
  quote: string;
  rating: number;
};

export type DashboardData = {
  userName: string;
  heroSubtitle: string;
  quickActions: QuickAction[];
  stats: StatCardItem[];
  swapBanner: SwapBanner;
  trending: TrendingItem[];
  interests: InterestItem[];
  recommendations: MentorCardItem[];
  upcomingSessions: SessionItem[];
  testimonials: TestimonialItem[];
};