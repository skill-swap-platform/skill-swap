import NotFound from "@/pages/NotFound";
import LandingPage from "@/pages/LandingPage";

import { Dashboard } from "@/pages/Dashboard";
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

export const routesConfig = [
  {
    path: "/",
    element: <LandingPage />,
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
    path: "/dashboard",
    element: <Dashboard />,
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
    path: "/session-feedback",
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

  {
    path: "*",
    element: <NotFound />,
  },
];