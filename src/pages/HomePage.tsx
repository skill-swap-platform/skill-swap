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

const DEFAULT_SESSION_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop";

function mapApiToDashboard(
  api: DashboardApiResponse,
  userName: string
): DashboardData {
  const mock = HomeDashboardMockData;

  // ── Trending ─────────────────────────────────────────────────────────
  const trending: TrendingItem[] = Array.isArray(api.trending)
    ? api.trending.map((t, i) => ({
        id: `tr-${i + 1}`,
        title: t.skillName,
        learningCount: t.learningCount,
        growthLabel: "",
        icon: TRENDING_ICONS[i % TRENDING_ICONS.length],
      }))
    : [];

  // ── Recommendations ──────────────────────────────────────────────────
  const recommendations: MentorCardItem[] =
    api.recommended?.skill && api.recommended?.user
      ? [
          {
            id: api.recommended.skill.id ?? `rec-${Date.now()}`,
            mentorName: api.recommended.user.userName ?? "",
            mentorRole: api.recommended.skill.category?.name ?? "",
            mentorAvatar: api.recommended.user.image ?? "",
            rating: api.recommended.user.avarage ?? 0,
            reviewCount: api.recommended.user.totalFeedbacks ?? 0,
            swapCount:
              (api.recommended.user.receivedSwaps ?? 0) +
              (api.recommended.user.sentSwaps ?? 0),
            title: api.recommended.skill.name ?? "",
            description: api.recommended.skill.description ?? "",
            tags: [api.recommended.skill.category?.name].filter(Boolean) as string[],
          },
        ]
      : [];

  // ── Upcoming sessions ────────────────────────────────────────────────
  const sessionsList = api.sessions?.data;
  const upcomingSessions: SessionItem[] = Array.isArray(sessionsList)
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
          image: DEFAULT_SESSION_IMAGE,
          title: s.title ?? "",
          mentorName: s.host?.userName ?? "",
          level: LEVEL_MAP[s.status ?? ""] ?? "Beginner",
          dateLabel,
          timeLabel,
        };
      })
    : [];

  // ── Stats ────────────────────────────────────────────────────────────
  const learnedCount =
    typeof api.learnedSkillsCount === "number" ? api.learnedSkillsCount : 0;
  const activeSwaps = api.swaps?.accepted ?? 0;
  const ratingValue = api.rating?.rating ?? 0;

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

// Initial number of items shown per section
const INITIAL_LIMITS = {
  trending: 4,
  interests: 4,
  recommendations: 3,
  upcomingSessions: 2,
  testimonials: 3,
};

export default function DashboardPage() {
  // Get the logged-in user's name from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id || "";
  const userName = user?.userName || HomeDashboardMockData.userName;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (section: string) =>
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));

  const sliced = <T,>(items: T[], section: keyof typeof INITIAL_LIMITS): T[] =>
    expanded[section] ? items : items.slice(0, INITIAL_LIMITS[section]);

  useEffect(() => {
    if (userId) {
      getDashboardData(userId)
        .then((apiData) => setData(mapApiToDashboard(apiData, userName)))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId, userName]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-slate-500">
          <p className="text-lg">Unable to load dashboard data.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
        <Footer />
      </main>
    );
  }

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
          <SectionHeader
            title="Trending This Week"
            actionLabel={data.trending.length > INITIAL_LIMITS.trending ? "See all" : undefined}
            expanded={!!expanded.trending}
            onActionClick={() => toggle("trending")}
          />

          {data.trending.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sliced(data.trending, "trending").map((item) => (
                <TrendingCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white py-8 text-center text-slate-400">
              No trending skills this week.
            </p>
          )}
        </section>

        {/* Interests */}
        <section className="mt-10">
          <SectionHeader
            title="Your Interests"
            actionLabel={data.interests.length > INITIAL_LIMITS.interests ? "See all" : undefined}
            expanded={!!expanded.interests}
            onActionClick={() => toggle("interests")}
          />
          {data.interests.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {sliced(data.interests, "interests").map((item) => (
                <InterestChip key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white py-8 text-center text-slate-400">
              No interests added yet.
            </p>
          )}
        </section>

        {/* Recommended */}
        <section className="mt-10">
          <SectionHeader
            title="Recommended for you"
            actionLabel={data.recommendations.length > INITIAL_LIMITS.recommendations ? "See all" : undefined}
            expanded={!!expanded.recommendations}
            onActionClick={() => toggle("recommendations")}
          />
          {data.recommendations.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {sliced(data.recommendations, "recommendations").map((item) => (
                <MentorCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white py-8 text-center text-slate-400">
              No recommendations available right now.
            </p>
          )}
        </section>

        {/* Upcoming sessions */}
        <section className="mt-10">
          <SectionHeader
            title="Upcoming Sessions"
            actionLabel={data.upcomingSessions.length > INITIAL_LIMITS.upcomingSessions ? "See all" : undefined}
            expanded={!!expanded.upcomingSessions}
            onActionClick={() => toggle("upcomingSessions")}
          />
          {data.upcomingSessions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {sliced(data.upcomingSessions, "upcomingSessions").map((item) => (
                <SessionCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white py-8 text-center text-slate-400">
              No upcoming sessions.
            </p>
          )}
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

          {data.testimonials.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {sliced(data.testimonials, "testimonials").map((item) => (
                  <TestimonialCard key={item.id} item={item} />
                ))}
              </div>

              {data.testimonials.length > INITIAL_LIMITS.testimonials && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => toggle("testimonials")}
                    className="text-sm font-medium text-blue-500 hover:text-blue-600"
                  >
                    {expanded.testimonials ? "Show less" : "See all testimonials"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="rounded-xl bg-white py-8 text-center text-slate-400">
              No testimonials yet.
            </p>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
