
import NotFound from "@/pages/NotFound";
import { RequestSkill } from "@/pages/RequestSkill";
import { UpcomingSessionCard } from "@/pages/session/UpcomingSessionCard";

export const routesConfig = [
  {
    path: "/",
    element: <RequestSkill />,
  },
  {
    path: "/sessions",
    element: <UpcomingSessionCard />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
