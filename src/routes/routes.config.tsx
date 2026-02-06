
import NotFound from "@/pages/NotFound";
import { RequestSkill } from "@/pages/RequestSkill";
import UpcomingSession from "@/pages/session/UpcomingSession";

export const routesConfig = [
  {
    path: "/",
    element: <RequestSkill />,
  },
  {
    path: "/sessions",
    element: <UpcomingSession />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
