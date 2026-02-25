import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/profile/ProfilePage";
import EditProfilePage from "@/pages/profile/EditProfilePage";
import MySkillsPage from "@/pages/profile/MySkillsPage";
import SkillDetailPage from "@/pages/profile/SkillDetailPage";
import EditSkillPage from "@/pages/profile/EditSkillPage";
import AddSkillProfile from "@/pages/profile/AddSkillProfile";
import SettingsPage from "@/pages/profile/SettingsPage";
import LandingPage from "@/pages/LandingPage";
import Search from "@/pages/search/Search";
import SearchResults from "@/pages/search/SearchResults";
import SearchWithFilters from "@/pages/search/SearchWithFilters";

import { Dashboard } from "@/pages/Dashboard";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminSkillsManagement } from "@/pages/admin/AdminSkillsManagement";
import { AdminUsersList } from "@/pages/admin/AdminUsersList";
import { PointsAndBadges } from "@/pages/PointsAndBadges";
import { SessionHistory } from "@/pages/SessionHistory";
import { SessionFeedback } from "@/pages/SessionFeedback";

import { AddSkill, RequestSkill } from "@/pages/RequestSkill";
import RequestsSent from "@/pages/RequestsSent/RequestsSent";
import UpcomingSession from "@/pages/session/UpcomingSession";
import Explore from "@/pages/explore/Explore";
import AllReviews from "@/components/explore/AllReviews";

import {
  OnboardingInterests,
  OnboardingTeaching,
  OnboardingProfile,
  OnboardingLoading,
  Login,
  Register,
  PreviewSessionCompleted,
  PreviewBadgeUnlocked,
  PreviewFeedbackForm,
  PreviewManageBadges,
  PreviewPointsManage,
  MessagesPage,
} from "@/pages";
import VerifyEmailRoute from "@/pages/auth/VerifyEmailRoute";
import HomePage from "@/pages/HomePage";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// ─── Route type used by AppRouter ────────────────────────────────────────────
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

export const routesConfig: RouteConfig[] = [
  // ── Public routes (no auth required) ───────────────────────────────────────
  {
    path: "/",
    element: (
      <GuestRoute>
        <LandingPage />
      </GuestRoute>
    ),
  },

  // ── Guest-only routes (redirect to /home if already logged in) ─────────────
  {
    path: "/auth/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
  },
  {
    path: "/auth/verify-email",
    element: <VerifyEmailRoute />,
  },

  // ── Protected routes (require authentication) ──────────────────────────────
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/skills",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminSkillsManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminUsersList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/points-badges",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <PointsAndBadges />
      </ProtectedRoute>
    ),
  },
  {
    path: "/session-history",
    element: (
      <ProtectedRoute>
        <SessionHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/session-feedback/:sessionId",
    element: (
      <ProtectedRoute>
        <SessionFeedback />
      </ProtectedRoute>
    ),
  },
  {
    path: "/request-skill",
    element: (
      <ProtectedRoute>
        <RequestSkill />
      </ProtectedRoute>
    ),
  },
  {
    path: "/request-skill/add-skill",
    element: (
      <ProtectedRoute>
        <AddSkill />
      </ProtectedRoute>
    ),
  },
  {
    path: "/requests-sent",
    element: (
      <ProtectedRoute>
        <RequestsSent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sessions",
    element: (
      <ProtectedRoute>
        <UpcomingSession />
      </ProtectedRoute>
    ),
  },

  {
    path: "/messages",
    element: (
      <ProtectedRoute>
        <MessagesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/explore",
    element: (
      <ProtectedRoute>
        <Explore />
      </ProtectedRoute>
    ),
  },
  // Search and Discovery Routes
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/search/results",
    element: <SearchResults />,
  },
  {
    path: "/search/filters",
    element: <SearchWithFilters />,
  },


  {
    path: "/all-reviews",
    element: (
      <ProtectedRoute>
        <AllReviews />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/edit",
    element: (
      <ProtectedRoute>
        <EditProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/skills",
    element: (
      <ProtectedRoute>
        <MySkillsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/add-skill",
    element: (
      <ProtectedRoute>
        <AddSkillProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/skills/:skillId",
    element: (
      <ProtectedRoute>
        <SkillDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/skills/:skillId/edit",
    element: (
      <ProtectedRoute>
        <EditSkillPage />
      </ProtectedRoute>
    ),
  },

  // ── Onboarding (protected — user must be logged in) ────────────────────────
  {
    path: "/onboarding/interests",
    element: (
      <ProtectedRoute>
        <OnboardingInterests />
      </ProtectedRoute>
    ),
  },
  {
    path: "/onboarding/teaching",
    element: (
      <ProtectedRoute>
        <OnboardingTeaching />
      </ProtectedRoute>
    ),
  },
  {
    path: "/onboarding/profile",
    element: (
      <ProtectedRoute>
        <OnboardingProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/onboarding/loading",
    element: (
      <ProtectedRoute>
        <OnboardingLoading />
      </ProtectedRoute>
    ),
  },

  // ── Preview / dev routes ───────────────────────────────────────────────────
  {
    path: "/preview/session-completed",
    element: <PreviewSessionCompleted />,
  },
  {
    path: "/preview/badge-unlocked",
    element: <PreviewBadgeUnlocked />,
  },
  {
    path: "/preview/feedback-form",
    element: <PreviewFeedbackForm />,
  },
  {
    path: "/preview/manage-badges",
    element: <PreviewManageBadges />,
  },
  {
    path: "/preview/points-manage",
    element: <PreviewPointsManage />,
  },

  // ── Catch-all ──────────────────────────────────────────────────────────────
  {
    path: "*",
    element: <NotFound />,
  },
];
