import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/profile/ProfilePage";
import EditProfilePage from "@/pages/profile/EditProfilePage";
import MySkillsPage from "@/pages/profile/MySkillsPage";
import SkillDetailPage from "@/pages/profile/SkillDetailPage";
import EditSkillPage from "@/pages/profile/EditSkillPage";
import AddSkillProfile from "@/pages/profile/AddSkillProfile";
import SettingsPage from "@/pages/profile/SettingsPage";
import LandingPage from "@/pages/LandingPage";

// import { Dashboard } from "@/pages/Dashboard";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
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
} from "@/pages";
import VerifyEmailRoute from "@/pages/auth/VerifyEmailRoute";
import HomePage from "@/pages/HomePage";
// import EmailVerificationPage from "@/pages/auth/EmailVerificationPage";

export const routesConfig = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },

  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/auth/verify-email",
    element: <VerifyEmailRoute />,
  },

  // {
  //   path: "/dashboard",
  //   element: <Dashboard />,
  // },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/points-badges",
    element: <PointsAndBadges />,
  },
  {
    path: "/session-history",
    element: <SessionHistory />,
  },
  {
    path: "/session-feedback/:sessionId",
    element: <SessionFeedback />,
  },

  {
    path: "/request-skill",
    element: <RequestSkill />,
  },
  {
    path: "/request-skill/add-skill",
    element: <AddSkill />,
  },
  // to be edited
  {
    path: "/requests-sent",
    element: <RequestsSent />,
  },
  {
    path: "/sessions",
    element: <UpcomingSession />,
  },

  {
    path: "/explore",
    element: <Explore />,
  },
  {
    path: "/all-reviews",
    element: <AllReviews />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/profile/edit",
    element: <EditProfilePage />,
  },
  {
    path: "/profile/skills",
    element: <MySkillsPage />,
  },
  {
    path: "/profile/add-skill",
    element: <AddSkillProfile />,
  },
  {
    path: "/profile/settings",
    element: <SettingsPage />,
  },
  {
    path: "/profile/skills/:skillId",
    element: <SkillDetailPage />,
  },
  {
    path: "/profile/skills/:skillId/edit",
    element: <EditSkillPage />,
  },

  {
    path: "/onboarding/interests",
    element: <OnboardingInterests />,
  },
  {
    path: "/onboarding/teaching",
    element: <OnboardingTeaching />,
  },
  {
    path: "/onboarding/profile",
    element: <OnboardingProfile />,
  },
  {
    path: "/onboarding/loading",
    element: <OnboardingLoading />,
  },
  // to be checked
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
  // to be checked
  {
    path: "/preview/points-manage",
    element: <PreviewPointsManage />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
];
