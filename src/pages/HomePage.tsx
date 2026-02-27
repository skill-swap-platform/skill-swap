import { TrendingUp } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import QuickActionCard from "@/components/home/QuickActionCard";
import StatCard from "@/components/home/StatCard";
import SwapBanner from "@/components/home/SwapBanner";
import SectionHeader from "@/components/home/SectionHeader";
import TrendingCard from "@/components/home/TrendingCard";
import InterestChip from "@/components/home/InterestChip";
import MentorCard from "@/components/home/MentorCard";
import SessionCard from "@/components/home/SessionCard";
import TestimonialCard from "@/components/home/TestimonialCard";
import { HomeDashboardMockData } from "@/data/home.mock";
import { Footer, Header } from "@/components";
import { useEffect, useState } from "react";
import {
  getDashboardData,
  type DashboardApiResponse,
} from "@/api/services/home.service";
import type { DashboardData, TrendingItem, MentorCardItem, SessionItem } from "@/types/home.types";

const TRENDING_ICONS: TrendingItem["icon"][] = ["globe", "bar-chart", "music", "pen-tool"];

const LEVEL_MAP: Record<string, SessionItem["level"]> = {
  BEGINNER: "Beginner",
  BEGINEER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

function mapApiToDashboard(
  api: DashboardApiResponse,
  userName: string
): DashboardData {
  const mock = HomeDashboardMockData;

  // ── Trending ─────────────────────────────────────────────────────────
  const trending: TrendingItem[] =
    Array.isArray(api.trending) && api.trending.length > 0
      ? api.trending.map((t, i) => ({
          id: `tr-${i + 1}`,
          title: t.skillName,
          learningCount: t.learningCount,
          growthLabel: "",
          icon: TRENDING_ICONS[i % TRENDING_ICONS.length],
        }))
      : mock.trending;

  // ── Recommendations ──────────────────────────────────────────────────
  let recommendations: MentorCardItem[] = mock.recommendations;
  if (api.recommended) {
    const r = api.recommended;
    recommendations = [
      {
        id: r.skill.id,
        mentorName: r.user.userName,
        mentorRole: r.skill.category?.name ?? "",
        mentorAvatar: r.user.image ?? "",
        rating: r.user.avarage ?? 0,
        reviewCount: r.user.totalFeedbacks,
        swapCount: r.user.receivedSwaps + r.user.sentSwaps,
        title: r.skill.name,
        description: r.skill.description,
        tags: [r.skill.category?.name].filter(Boolean) as string[],
      },
    ];
  }

  // ── Upcoming sessions ────────────────────────────────────────────────
  const sessionsList = api.sessions?.data;
  const upcomingSessions: SessionItem[] =
    Array.isArray(sessionsList) && sessionsList.length > 0
      ? sessionsList.map((s) => {
          const date = new Date(s.scheduledAt);
          const endDate = new Date(s.endsAt);
          const dateLabel = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const fmt = (d: Date) =>
            d.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          const timeLabel = `${fmt(date)} - ${fmt(endDate)}`;

          return {
            id: s.id,
            category: s.skill?.name ?? "",
            image: mock.upcomingSessions[0]?.image ?? "",
            title: s.title,
            mentorName: s.host?.userName ?? "",
            level: LEVEL_MAP[s.attendee?.userName ? "" : ""] ?? "Beginner",
            dateLabel,
            timeLabel,
          };
        })
      : mock.upcomingSessions;

  // ── Stats ────────────────────────────────────────────────────────────
  const learnedCount =
    typeof api.learnedSkillsCount === "number"
      ? api.learnedSkillsCount
      : Number(mock.stats[0].value);

  const activeSwaps = api.swaps?.accepted ?? Number(mock.stats[1].value);

  const ratingValue = api.rating?.rating ?? Number(mock.stats[2].value);

  return {
    userName,
    heroSubtitle: mock.heroSubtitle,
    quickActions: mock.quickActions,
    stats: [
      { ...mock.stats[0], value: String(learnedCount) },
      { ...mock.stats[1], value: String(activeSwaps) },
      { ...mock.stats[2], value: String(ratingValue) },
    ],
    swapBanner: mock.swapBanner,
    trending,
    interests: mock.interests,
    recommendations,
    upcomingSessions,
    testimonials: mock.testimonials,
  };
}

export default function DashboardPage() {
  // Get the logged-in user's name from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id || "";
  const userName = user?.userName || HomeDashboardMockData.userName;

  const [data, setData] = useState<DashboardData>({
    ...HomeDashboardMockData,
    userName,
  });

  useEffect(() => {
    if (userId) {
      getDashboardData(userId)
        .then((apiData) => setData(mapApiToDashboard(apiData, userName)))
        .catch(console.error);
    }
  }, [userId, userName]);

  return (
    <main className="min-h-screen bg-slate-100">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <HeroSection userName={data.userName} subtitle={data.heroSubtitle} />

        {/* Top actions */}
        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {data.quickActions.map((item) => (
              <QuickActionCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {data.stats.map((item) => (
              <StatCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Swap banner */}
        <section className="mt-6">
          <SwapBanner item={data.swapBanner} />
        </section>

        {/* Trending */}
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-slate-700" />
            <h2 className="text-2xl font-bold text-slate-900">
              Trending This Week
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.trending.map((item) => (
              <TrendingCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Interests */}
        <section className="mt-10">
          <SectionHeader title="Your Interests" actionLabel="See all" />
          <div className="flex flex-wrap gap-3">
            {data.interests.map((item) => (
              <InterestChip key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Recommended */}
        <section className="mt-10">
          <SectionHeader title="Recommended for you" actionLabel="See all" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {data.recommendations.map((item) => (
              <MentorCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Upcoming sessions */}
        <section className="mt-10">
          <SectionHeader title="Upcoming Sessions" actionLabel="See all" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.upcomingSessions.map((item) => (
              <SessionCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-12 pb-10">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              What Our Community Says
            </h2>
            <p className="mt-2 text-slate-500">
              Joined thousands of people who have transformed their skills
              through Skill Swap
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {data.testimonials.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
