
import NotFound from "@/pages/NotFound";
import { RequestSkill } from "@/pages/RequestSkill";
import UpcomingSession from "@/pages/session/UpcomingSession";
import LandingPage from "@/pages/LandingPage";
import { Dashboard } from "@/pages/Dashboard";
import { PointsAndBadges } from "@/pages/PointsAndBadges";
import { SessionHistory } from "@/pages/SessionHistory";
import { SessionFeedback } from "@/pages/SessionFeedback";

export const routesConfig = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/request-skill",
    element: <RequestSkill />,
  },
  {
    path: "/sessions",
    element: <UpcomingSession />,
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
    path: "*",
    element: <NotFound />,
  },
];
