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

// Later:
// import { useEffect, useState } from "react";
// fetch from API and store in state.

export default function DashboardPage() {
  const data = HomeDashboardMockData;

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
